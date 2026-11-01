"""Offline operator-control tests: fake transport only, never a provider session."""
import base64
import importlib.util
import io
import json
import os
from pathlib import Path
import stat
import tempfile
import unittest
import urllib.error
from unittest.mock import Mock, patch

spec = importlib.util.spec_from_file_location("operator_tool", Path(__file__).with_name("vs02a_checkpoint_operator.py"))
tool = importlib.util.module_from_spec(spec)
spec.loader.exec_module(tool)


class OperatorSafety(unittest.TestCase):
    def test_operator_env_local_setup_never_echoes_or_exports_key(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "operator/.env"
            result = tool.setup_operator_env(path)
            self.assertFalse(result["secret_stored"])
            self.assertEqual(stat.S_IMODE(path.stat().st_mode), 0o600)
            marker = "sb_" + "secret_" + "offline-fixture"
            with patch.object(tool.sys.stdin, "isatty", return_value=True), patch.object(tool.getpass, "getpass", return_value=marker):
                result = tool.setup_operator_env(path, configure=True)
            self.assertTrue(result["secret_stored"])
            self.assertNotIn(marker, json.dumps(result))
            self.assertEqual(tool.read_operator_env(path), marker)
            self.assertNotIn(tool.ENV_NAME, os.environ)
            with self.assertRaisesRegex(tool.Stop, "no_overwrite"):
                tool.setup_operator_env(path, configure=True)

    def test_operator_env_rejects_shell_syntax_and_unexpected_variables(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / ".env"
            tool.setup_operator_env(path)
            for value in ("$(touch never-execute)", "`never-execute`", '"quoted"', "${OTHER}", "", "legacy-jwt"):
                path.write_text(tool.ENV_NAME + "=" + value + "\n")
                with self.subTest(value=value), self.assertRaises(tool.Stop):
                    tool.read_operator_env(path)
            path.write_text(tool.ENV_NAME + "=sb_" + "secret_fixture\nOTHER=value\n")
            with self.assertRaisesRegex(tool.Stop, "operator_env_format"):
                tool.read_operator_env(path)

    def test_operator_env_rejects_repository_links_and_loose_permissions(self):
        with self.assertRaises(tool.Stop):
            tool.setup_operator_env(tool.REPO / ".env")
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / ".env"
            tool.setup_operator_env(path)
            path.chmod(0o644)
            with self.assertRaises(tool.Stop):
                tool.read_operator_env(path, allow_empty=True)
            path.chmod(0o600)
            link = Path(directory) / "linked.env"
            link.symlink_to(path)
            with self.assertRaises(tool.Stop):
                tool.read_operator_env(link)
            link.unlink()
            os.link(path, link)
            with self.assertRaises(tool.Stop):
                tool.read_operator_env(path, allow_empty=True)
            link.unlink()
            path.parent.chmod(0o750)
            with self.assertRaises(tool.Stop):
                tool.read_operator_env(path, allow_empty=True)
            path.parent.chmod(0o700)

    def test_provision_does_not_read_env_when_project_is_not_empty(self):
        mcp = Mock()
        mcp.count.return_value = 3
        with patch.object(tool, "read_operator_env") as read:
            with self.assertRaisesRegex(tool.Stop, "creation_requires_empty_project"):
                tool.provision(mcp, None, {"users": []}, "unused", Path("/unused/private.env"))
            read.assert_not_called()

    def created_ledger(self):
        result = tool.prepare()
        path = Path(result["private_credential_path"])
        _, ledger = tool.private_file(path)
        for index, user in enumerate(ledger["users"], start=1):
            user.update(state="created", provider_user_id=f"{index:08}-1111-4111-8111-111111111111")
        tool.save_private(path, ledger)
        return path, ledger

    def approved(self):
        d = json.loads((tool.REPO / "docs/vs02a-readiness/synthetic-roster-approval.json").read_text())
        d.update(status="APPROVED", approval_provenance="offline test fixture only", reset_delete_owner="offline fixture owner")
        return d

    def test_pending_approval_blocks_before_any_network_or_local_secret(self):
        path = tool.REPO / "docs/vs02a-readiness/synthetic-roster-approval.json"
        d = self.approved()
        d.update(status="PENDING", approval_provenance=None)
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "approval.json"
            path.write_text(json.dumps(d))
            with self.assertRaisesRegex(tool.Stop, "explicit_roster_approval"):
                tool.approval(path)

    def test_approval_cannot_widen_roster_or_provider_actions(self):
        for field, value in (("provider_actions", ["global-logout"]), ("mail_policy", "real-email"),
                             ("auth_bundle_1_authorized", True), ("issuer_sha256", "other-target"),
                             ("reset_delete_owner", "PENDING"), ("approval_provenance", None)):
            with self.subTest(field=field), tempfile.TemporaryDirectory() as directory:
                d = self.approved()
                d[field] = value
                path = Path(directory) / "approval.json"
                path.write_text(json.dumps(d))
                with self.assertRaises(tool.Stop):
                    tool.approval(path)
        d = self.approved()
        d["roster"][2]["application_grants"] = ["Admin"]
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "approval.json"
            path.write_text(json.dumps(d))
            with self.assertRaises(tool.Stop):
                tool.approval(path)

    def test_prepared_credentials_are_private_distinct_and_not_printed(self):
        result = tool.prepare()
        path = Path(result["private_credential_path"])
        try:
            _, d = tool.private_file(path)
            self.assertEqual(stat.S_IMODE(path.stat().st_mode), 0o600)
            self.assertEqual(stat.S_IMODE(path.parent.stat().st_mode), 0o700)
            passwords = [x["password"] for x in d["users"]]
            self.assertEqual(len(set(passwords)), 3)
            self.assertTrue(all(len(p) >= 43 and p not in json.dumps(result) for p in passwords))
            os.chmod(path, 0o640)
            with self.assertRaisesRegex(tool.Stop, "ownership_or_mode"):
                tool.private_file(path)
            os.chmod(path, 0o600)
            link = path.parent / "link.json"
            link.symlink_to(path)
            with self.assertRaises(tool.Stop):
                tool.private_file(link)
            link.unlink()
        finally:
            path.unlink()
            path.parent.rmdir()

    def test_wrong_destination_or_method_never_opens_network(self):
        with patch.object(tool.urllib.request, "build_opener") as build:
            with self.assertRaises(tool.Stop):
                tool.request("https://example.invalid/auth/v1", "/settings")
            with patch.object(tool, "digest", return_value=tool.ISSUER_HASH):
                with self.assertRaises(tool.Stop):
                    tool.request("https://example.invalid/auth/v1", "/settings", method="POST")
            build.assert_not_called()
        with self.assertRaisesRegex(tool.Stop, "redirect_disallowed"):
            tool.NoRedirect().redirect_request(None)

    def test_provider_errors_never_echo_response_or_key(self):
        error = urllib.error.HTTPError("local-sensitive-marker", 401, "local-sensitive-marker", {}, io.BytesIO(b"local-sensitive-marker"))
        with patch.object(tool, "digest", return_value=tool.ISSUER_HASH), patch.object(tool.urllib.request, "build_opener") as build:
            build.return_value.open.side_effect = error
            with self.assertRaises(tool.Stop) as caught:
                tool.request("https://example.invalid/auth/v1", "/settings", "local-sensitive-marker")
            self.assertEqual(str(caught.exception), "provider_http_401")

    def test_no_admin_secret_prompt_with_unapproved_state_or_nonterminal(self):
        mcp = Mock()
        mcp.count.return_value = 1
        with patch.object(tool.getpass, "getpass") as prompt:
            with self.assertRaises(tool.Stop):
                tool.provision(mcp, None, {"users": []}, "unused")
            prompt.assert_not_called()
        mcp.count.return_value = 0
        with patch.object(tool.sys.stdin, "isatty", return_value=False), patch.object(tool.getpass, "getpass") as prompt:
            with self.assertRaisesRegex(tool.Stop, "operator_terminal_required"):
                tool.provision(mcp, None, {"users": []}, "unused")
            prompt.assert_not_called()

    def test_partial_creation_is_retained_and_not_blindly_retried(self):
        result = tool.prepare()
        path = Path(result["private_credential_path"])
        _, ledger = tool.private_file(path)
        mcp = Mock()
        mcp.count.return_value = 0
        first = ledger["users"][0]
        subject = "11111111-1111-4111-8111-111111111111"
        try:
            with patch.object(tool.sys.stdin, "isatty", return_value=True), \
                    patch.object(tool.getpass, "getpass", return_value="sb_" + "secret_" + "offline-fixture"), \
                    patch.object(tool, "request", side_effect=[(200, {"id": subject, "email": first["email"], "role": "authenticated"}), tool.Stop("provider_network_or_format")]) as request:
                report = tool.provision(mcp, path, ledger, "unused")
                self.assertEqual(report["status"], "BLOCKED")
                self.assertEqual(request.call_count, 2)
                self.assertTrue(report["reconcile_private_ledger_before_retry"])
                self.assertNotIn(first["password"], json.dumps(report))
            _, recorded = tool.private_file(path)
            self.assertEqual(recorded["users"][0]["state"], "created")
            self.assertEqual(recorded["users"][1]["state"], "creation_attempted_do_not_retry_blindly")
            with patch.object(tool.getpass, "getpass") as prompt:
                with self.assertRaises(tool.Stop):
                    tool.provision(mcp, path, recorded, "unused")
                prompt.assert_not_called()
        finally:
            path.unlink()
            path.parent.rmdir()

    def test_two_operator_processes_cannot_use_the_same_ledger(self):
        result = tool.prepare()
        path = Path(result["private_credential_path"])
        try:
            with tool.private_operation(path):
                with self.assertRaisesRegex(tool.Stop, "another_operator_process"):
                    with tool.private_operation(path):
                        self.fail("concurrent operator unexpectedly acquired private ledger")
        finally:
            path.unlink()
            (path.parent / ".checkpoint.lock").unlink()
            path.parent.rmdir()

    def test_invalid_verifier_proof_cannot_leak_token_in_a_hash_field(self):
        proof = {"status": "PASS", "issuer_sha256": tool.ISSUER_HASH, "subject_sha256": "local-sensitive-marker",
                 "session_id_sha256": "a" * 64, "kid_sha256": "b" * 64, "algorithm": "ES256", "audience": "authenticated",
                 "issued_at_unix": 1, "expires_at_unix": 2, "issued_lifetime_seconds": 1,
                 "verified_at_unix": 1, "remaining_until_exp_seconds": 1, "checkpoint_skew_seconds": 30}
        process = Mock(returncode=0, stdout=json.dumps(proof))
        with patch.object(tool.subprocess, "run", return_value=process):
            with self.assertRaisesRegex(tool.Stop, "verifier_output_values"):
                tool.verify_token(Path("/tmp/fake-verifier"), "unused", "local-sensitive-marker", {})

    def test_successful_flow_logs_out_locally_and_never_retains_tokens(self):
        path, ledger = self.created_ledger()
        mcp = Mock()
        mcp.issuer = "unused-local-transport-fixture"
        mcp.count.return_value = 3
        mcp.session_exists.side_effect = [True, False] * 3
        tokens = []
        logout_paths = []

        def transport(issuer, route, key=None, body=None, bearer=None, method="GET"):
            if route == "/token?grant_type=password":
                self.assertTrue(all(token not in path.read_text() for token in tokens))
                user = next(u for u in ledger["users"] if u["email"] == body["email"])
                payload = {"session_id": user["provider_user_id"]}
                segment = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
                token = "local-header." + segment + ".local-signature"
                tokens.append(token)
                return 200, {"access_token": token, "refresh_token": "local-sensitive-marker", "user": {"id": user["provider_user_id"]}}
            if route == "/.well-known/jwks.json":
                return 200, {}
            logout_paths.append(route)
            return 204, {}

        def proof(binary, issuer, token, jwks):
            payload = json.loads(base64.urlsafe_b64decode(token.split(".")[1] + "=" * (-len(token.split(".")[1]) % 4)))
            subject = payload["session_id"]
            return {"status": "PASS", "subject_sha256": tool.digest(subject), "session_id_sha256": tool.digest(subject)}

        try:
            with patch.object(tool, "request", side_effect=transport), patch.object(tool, "verify_token", side_effect=proof):
                result = tool.verify_users(mcp, path, ledger, "local-public-key", Path("/tmp/local-verifier"))
            self.assertEqual(result["status"], "PASS")
            self.assertEqual(logout_paths, ["/logout?scope=local"] * 3)
            self.assertFalse(path.exists())
            self.assertTrue(all(token not in json.dumps(result) for token in tokens))
            self.assertNotIn("local-sensitive-marker", json.dumps(result))
            self.assertFalse(result["application_auth_tested"])
            self.assertEqual(result["o05_decision"], "PROPOSED_NOT_APPROVED")
        finally:
            if path.exists():
                path.unlink()
            path.parent.rmdir()

    def test_verification_failure_still_logs_out_and_preserves_partial_evidence(self):
        path, ledger = self.created_ledger()
        mcp = Mock()
        mcp.count.return_value = 3
        mcp.issuer = "unused-local-transport-fixture"
        try:
            with patch.object(tool, "request", side_effect=[(200, {"access_token": "local-sensitive-marker", "user": {"id": ledger["users"][0]["provider_user_id"]}}), (200, {}), (204, {})]) as request, \
                    patch.object(tool, "verify_token", side_effect=tool.Stop("access_token_verification_failed")):
                result = tool.verify_users(mcp, path, ledger, "unused", Path("/tmp/local-verifier"))
            self.assertEqual(result["status"], "BLOCKED")
            self.assertEqual(result["remaining_users_not_run"], 2)
            self.assertEqual(request.call_args.args[1], "/logout?scope=local")
            self.assertTrue(path.exists())
            self.assertNotIn("local-sensitive-marker", json.dumps(result))
            self.assertEqual(result["users"][0]["local_logout_http_status"], 204)
        finally:
            path.unlink()
            path.parent.rmdir()


if __name__ == "__main__":
    unittest.main(verbosity=2)
