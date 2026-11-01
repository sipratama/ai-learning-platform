#!/usr/bin/env python3
"""Bounded synthetic checkpoint operator; no application Auth implementation.

preflight is read-only. prepare/provision/verify require the explicit R1 approval
record. Secrets are never CLI arguments or output; Admin input uses getpass or
an explicitly selected, operator-only private env file outside the repository.
"""

import argparse
import base64
import contextlib
import datetime
import fcntl
import getpass
import hashlib
import json
import os
from pathlib import Path
import queue
import re
import secrets
import ssl
import stat
import subprocess
import sys
import tempfile
import threading
import time
import urllib.error
import urllib.request

RECORD = "VSA-SYN-20261101-R1"
ISSUER_HASH = "6bbc53576144f2de6f6099639010fa5603394de404f16dcb324b1c0e22debd9a"
ROSTER = {"A": "vs02a-student-a@vs02a.invalid", "B": "vs02a-student-b@vs02a.invalid",
          "C": "vs02a-candidate-c@vs02a.invalid"}
UUID = re.compile(r"[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}\Z")
REPO = Path(__file__).resolve().parent.parent
ENV_NAME = "VS02A_SUPABASE_SECRET_KEY"
DEFAULT_ENV = Path.home() / ".config/vs02a-operator/.env"


class Stop(Exception):
    """Static failure code only; never attach response/request/credential values."""


def digest(value):
    return hashlib.sha256(value.encode()).hexdigest()


def now():
    return datetime.datetime.now(datetime.timezone.utc).isoformat()


def operator_env_path(path):
    path = Path(path).absolute()
    if path.is_symlink() or path.parent.is_symlink() or path.resolve().is_relative_to(REPO):
        raise Stop("operator_env_must_be_outside_repository_without_symlinks")
    parent = path.parent.stat()
    if (not stat.S_ISDIR(parent.st_mode) or stat.S_IMODE(parent.st_mode) != 0o700
            or parent.st_uid != os.getuid()):
        raise Stop("operator_env_directory_must_be_owned_0700")
    return path


def read_operator_env(path, allow_empty=False):
    path = operator_env_path(path)
    descriptor = os.open(path, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    with os.fdopen(descriptor) as stream:
        info = os.fstat(stream.fileno())
        if (not stat.S_ISREG(info.st_mode) or stat.S_IMODE(info.st_mode) != 0o600
                or info.st_uid != os.getuid() or info.st_nlink != 1):
            raise Stop("operator_env_file_must_be_owned_single_link_0600")
        value = stream.read(4097)
    lines = [line for line in value.splitlines() if line and not line.startswith("#")]
    if len(value) > 4096 or len(lines) != 1 or not lines[0].startswith(ENV_NAME + "="):
        raise Stop("operator_env_format")
    secret = lines[0][len(ENV_NAME) + 1:]
    if not (allow_empty and secret == "") and not re.fullmatch(r"sb_secret_[A-Za-z0-9_-]+", secret):
        raise Stop("operator_env_secret_format")
    return secret  # Literal parsing only: no source/eval, expansion or os.environ export.


def setup_operator_env(path, configure=False):
    path = Path(path).absolute()
    if path.resolve().is_relative_to(REPO) or path.parent.is_symlink():
        raise Stop("operator_env_must_be_outside_repository_without_symlinks")
    path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    path = operator_env_path(path)
    if path.exists() or path.is_symlink():
        if read_operator_env(path, allow_empty=True):
            raise Stop("operator_env_already_contains_key_no_overwrite")
        if not configure:
            return {"status": "PASS", "operation": "init-env", "provider_writes": 0, "secret_stored": False}
    elif configure:
        raise Stop("initialize_operator_env_before_configuring")
    secret = ""
    if configure:
        if not sys.stdin.isatty():
            raise Stop("operator_terminal_required_for_admin_secret")
        secret = getpass.getpass("Replacement project secret key (hidden; exposed chat key must be revoked): ").strip()
        if not re.fullmatch(r"sb_secret_[A-Za-z0-9_-]+", secret):
            raise Stop("modern_project_secret_key_required")
        # Write through the checked descriptor; never replace an unrelated existing key.
        descriptor = os.open(path, os.O_WRONLY | os.O_NOFOLLOW | os.O_NONBLOCK)
    else:
        descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
    with os.fdopen(descriptor, "w") as stream:
        info = os.fstat(stream.fileno())
        if (not stat.S_ISREG(info.st_mode) or stat.S_IMODE(info.st_mode) != 0o600
                or info.st_uid != os.getuid() or info.st_nlink != 1):
            raise Stop("operator_env_file_must_be_owned_single_link_0600")
        stream.truncate(0)
        stream.write("# Private operator use only; never source or copy into an application.\n" + ENV_NAME + "=" + secret + "\n")
    return {"status": "PASS", "operation": "configure-env" if configure else "init-env",
            "provider_writes": 0, "secret_stored": configure, "file_mode": "0600", "directory_mode": "0700"}


def approval(path):
    d = json.loads(Path(path).read_text())
    actual = {x["alias"]: x["email"] for x in d.get("roster", [])}
    if (d.get("record_id") != RECORD or d.get("status") != "APPROVED"
            or d.get("issuer_sha256") != ISSUER_HASH or actual != ROSTER
            or len(d["roster"]) != 3 or not d.get("approval_provenance")
            or any(x.get("application_grants") != [] for x in d["roster"])
            or d.get("mail_policy") != "reserved-invalid-no-mailbox-no-outbound-mail"
            or d.get("credential_policy") != "local-private-ledger-0600-tokens-memory-only"
            or d.get("provider_actions") != ["create-exact-roster", "password-sign-in-max-two-per-user", "local-logout-task-sessions-only"]
            or d.get("auth_bundle_1_authorized") is not False
            or not d.get("reset_delete_owner") or "PENDING" in d["reset_delete_owner"]):
        raise Stop("explicit_roster_approval_missing_or_mismatched")
    return d


def private_file(path):
    path = Path(path).absolute()
    if path.is_symlink() or path.resolve().is_relative_to(REPO):
        raise Stop("private_file_must_be_outside_repository")
    info = path.stat()
    if not stat.S_ISREG(info.st_mode) or stat.S_IMODE(info.st_mode) != 0o600 or info.st_uid != os.getuid():
        raise Stop("private_file_ownership_or_mode")
    if stat.S_IMODE(path.parent.stat().st_mode) != 0o700:
        raise Stop("private_directory_mode")
    fd = os.open(path, os.O_RDONLY | os.O_NOFOLLOW)
    with os.fdopen(fd) as stream:
        value = json.load(stream)
    if (value.get("record_id") != RECORD or value.get("generated_by") != "vs02a-checkpoint"
            or {x["alias"]: x["email"] for x in value.get("users", [])} != ROSTER
            or len(value["users"]) != 3):
        raise Stop("private_roster_mismatch")
    return path, value


def save_private(path, value):
    fd, temporary = tempfile.mkstemp(prefix="ledger-", dir=path.parent)
    try:
        os.fchmod(fd, 0o600)
        with os.fdopen(fd, "w") as stream:
            json.dump(value, stream)
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


@contextlib.contextmanager
def private_operation(path):
    path, _ = private_file(path)
    descriptor = os.open(path.parent / ".checkpoint.lock", os.O_CREAT | os.O_RDWR | os.O_NOFOLLOW, 0o600)
    try:
        try:
            fcntl.flock(descriptor, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise Stop("another_operator_process_is_using_this_ledger") from None
        yield private_file(path)
    finally:
        os.close(descriptor)


class MCP:
    """Official local client handles OAuth; no token-store reads or model turns."""
    def __enter__(self):
        self.process = subprocess.Popen(["codex", "app-server", "--listen", "stdio://"],
                                        stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                        stderr=subprocess.DEVNULL, text=True, bufsize=1)
        self.messages = queue.Queue()
        self.sequence = 0

        def receive():
            for line in self.process.stdout:
                try:
                    self.messages.put(json.loads(line))
                except ValueError:
                    pass
        threading.Thread(target=receive, daemon=True).start()
        try:
            return self.initialize()
        except Exception:
            self.__exit__()
            raise

    def initialize(self):
        self.call("initialize", {"clientInfo": {"name": "vs02a_checkpoint_operator", "version": "1.0"}})
        self.process.stdin.write(json.dumps({"method": "initialized"}) + "\n")
        self.process.stdin.flush()
        status = self.call("mcpServerStatus/list", {"serverName": "supabase", "detail": "toolsAndAuthOnly", "limit": 1})
        data = status.get("data", [])
        if len(data) != 1 or data[0].get("authStatus") != "oAuth":
            raise Stop("scoped_mcp_not_authenticated")
        self.tools = data[0].get("tools", {})
        thread = self.call("thread/start", {"ephemeral": True, "cwd": str(REPO)})
        self.thread = thread["thread"]["id"]
        self.project = self.tool("get_project_url", {})["url"]
        self.issuer = self.project + "/auth/v1"
        if digest(self.issuer) != ISSUER_HASH:
            raise Stop("scoped_project_mismatch")
        return self

    def __exit__(self, *_):
        self.process.terminate()
        try:
            self.process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            self.process.kill()
            self.process.wait()
        self.process.stdin.close()

    def call(self, method, params):
        self.sequence += 1
        mid = self.sequence
        self.process.stdin.write(json.dumps({"id": mid, "method": method, "params": params}) + "\n")
        self.process.stdin.flush()
        deadline = time.monotonic() + 50
        while time.monotonic() < deadline:
            try:
                message = self.messages.get(timeout=max(0.1, deadline - time.monotonic()))
            except queue.Empty:
                raise Stop("mcp_timeout") from None
            if message.get("id") == mid:
                if "error" in message:
                    raise Stop("mcp_request_failed")
                return message.get("result", {})
        raise Stop("mcp_timeout")

    def tool(self, name, args):
        if name not in {"get_project_url", "get_publishable_keys", "execute_sql"} or name not in self.tools:
            raise Stop("unsupported_checkpoint_tool")
        result = self.call("mcpServer/tool/call", {"threadId": self.thread, "server": "supabase", "tool": name, "arguments": args})
        if result.get("isError"):
            raise Stop("mcp_tool_failed")
        parts = [json.loads(x["text"]) for x in result.get("content", []) if x.get("type") == "text"]
        if len(parts) != 1:
            raise Stop("mcp_result_shape")
        return parts[0]

    def select(self, query):
        if not query.startswith("SELECT ") or ";" in query:
            raise Stop("non_select_disallowed")
        text = self.tool("execute_sql", {"query": query})["result"].replace("\\n", "\n").replace('\\"', '"')
        start = text.index("\n[") + 1
        end = text.index("]\n", start) + 1
        return json.loads(text[start:end])

    def public_key(self):
        def values(value):
            if isinstance(value, str):
                yield value
            elif isinstance(value, dict):
                for item in value.values():
                    yield from values(item)
            elif isinstance(value, list):
                for item in value:
                    yield from values(item)
        found = [x for x in values(self.tool("get_publishable_keys", {}))
                 if re.fullmatch(r"sb_publishable_[A-Za-z0-9_-]+", x)]
        if not found:
            raise Stop("modern_publishable_key_unavailable")
        return found[0]

    def count(self):
        return self.select("SELECT count(*)::integer AS provider_user_count FROM auth.users")[0]["provider_user_count"]

    def session_exists(self, subject, session):
        if not UUID.fullmatch(subject) or not UUID.fullmatch(session):
            raise Stop("invalid_verified_session_context")
        query = "SELECT EXISTS (SELECT 1 FROM auth.sessions WHERE id = '" + session + "'::uuid AND user_id = '" + subject + "'::uuid) AS present"
        return self.select(query)[0]["present"]


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *_args, **_kwargs):
        raise Stop("redirect_disallowed")


def request(issuer, path, public_key=None, body=None, bearer=None, method="GET"):
    routes = {"/settings": "GET", "/.well-known/jwks.json": "GET", "/admin/users": "POST",
              "/token?grant_type=password": "POST", "/logout?scope=local": "POST"}
    if digest(issuer) != ISSUER_HASH or routes.get(path) != method:
        raise Stop("untrusted_destination")
    headers = {"Accept": "application/json", "Content-Type": "application/json", "User-Agent": "vs02a-private-checkpoint/1.0"}
    if public_key:
        headers["apikey"] = public_key
    if bearer:
        headers["Authorization"] = "Bearer " + bearer
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}), NoRedirect(),
                                        urllib.request.HTTPSHandler(context=ssl.create_default_context()))
    encoded = json.dumps(body).encode() if body is not None else None
    try:
        with opener.open(urllib.request.Request(issuer + path, data=encoded, headers=headers, method=method), timeout=5) as response:
            if response.status != 204 and response.headers.get_content_type() != "application/json":
                raise Stop("provider_content_type")
            raw = response.read(65537)
            if len(raw) > 65536:
                raise Stop("provider_response_size")
            return response.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as error:
        raise Stop("provider_http_" + str(error.code)) from None
    except (OSError, ValueError, urllib.error.URLError):
        raise Stop("provider_network_or_format") from None


def settings(mcp, key):
    status, data = request(mcp.issuer, "/settings", key)
    if (status != 200 or data.get("disable_signup") is not True
            or data.get("external", {}).get("anonymous_users") is not False
            or data.get("external", {}).get("email") is not True):
        raise Stop("auth_settings_not_ready")
    return {"http_status": status, "disable_signup": True, "anonymous_users_enabled": False,
            "email_provider_enabled": True, "tls_certificate_verified": True}


def prepare():
    directory = Path(tempfile.mkdtemp(prefix="vs02a-synthetic-"))
    os.chmod(directory, 0o700)
    path = directory / "credentials.json"
    value = {"record_id": RECORD, "generated_by": "vs02a-checkpoint", "created_at_utc": now(),
             "users": [{"alias": alias, "email": email, "password": secrets.token_urlsafe(32), "state": "prepared"}
                       for alias, email in ROSTER.items()]}
    descriptor = os.open(path, os.O_CREAT | os.O_EXCL | os.O_WRONLY | os.O_NOFOLLOW, 0o600)
    with os.fdopen(descriptor, "w") as stream:
        json.dump(value, stream)
    return {"status": "PASS", "operation": "prepare-local-credentials", "provider_writes": 0,
            "private_credential_path": str(path), "passwords_printed": False}


def provision(mcp, path, ledger, key, admin_env_file=None):
    if mcp.count() != 0 or any(u.get("state") != "prepared" for u in ledger["users"]):
        raise Stop("creation_requires_empty_project_and_new_ledger")
    if admin_env_file is not None:
        admin = read_operator_env(admin_env_file)
    else:
        if not sys.stdin.isatty():
            raise Stop("operator_terminal_required_for_admin_secret")
        admin = getpass.getpass("Project secret API key (hidden; never paste in chat): ").strip()
    if not re.fullmatch(r"sb_secret_[A-Za-z0-9_-]+", admin):
        raise Stop("modern_project_secret_key_required")
    result = []
    for user in ledger["users"]:
        user["state"] = "creation_attempted_do_not_retry_blindly"
        save_private(path, ledger)
        try:
            status, data = request(mcp.issuer, "/admin/users", admin, body={"email": user["email"], "password": user["password"],
                                   "email_confirm": True, "user_metadata": {"vs02a_roster": RECORD, "fixture_alias": user["alias"]}}, method="POST")
            subject = data.get("id", "")
            if status not in (200, 201) or not UUID.fullmatch(subject) or data.get("email") != user["email"] or data.get("role") != "authenticated":
                raise Stop("provider_created_user_requires_reconciliation")
        except Stop as error:
            result.append({"alias": user["alias"], "status": "BLOCKED", "reason": str(error)})
            return {"status": "BLOCKED", "operation": "create-approved-roster", "users": result,
                    "partial_provider_state_possible": True, "reconcile_private_ledger_before_retry": True,
                    "remaining_users_not_run": 3 - len(result)}
        user.update(state="created", provider_user_id=subject)
        save_private(path, ledger)
        result.append({"alias": user["alias"], "status": "PASS", "subject_sha256": digest(subject), "application_grants": []})
    return {"status": "PASS", "operation": "create-approved-roster", "users": result, "provider_user_count": mcp.count()}


def verify_token(binary, issuer, token, jwks):
    value = subprocess.run([str(binary), "--issuer", issuer, "--audience", "authenticated"],
                           input=json.dumps({"token": token, "jwks": jwks}), capture_output=True, text=True, timeout=10)
    if value.returncode:
        raise Stop("access_token_verification_failed")
    result = json.loads(value.stdout)
    allowed = {"status", "issuer_sha256", "audience", "subject_sha256", "session_id_sha256", "kid_sha256", "algorithm", "issued_at_unix", "expires_at_unix", "issued_lifetime_seconds", "verified_at_unix", "remaining_until_exp_seconds", "checkpoint_skew_seconds"}
    if result.get("status") != "PASS" or set(result) != allowed:
        raise Stop("verifier_output_shape")
    hashes = ["issuer_sha256", "subject_sha256", "session_id_sha256", "kid_sha256"]
    dates = ["issued_at_unix", "expires_at_unix", "issued_lifetime_seconds", "verified_at_unix", "remaining_until_exp_seconds", "checkpoint_skew_seconds"]
    if (any(not isinstance(result[x], str) or not re.fullmatch(r"[0-9a-f]{64}", result[x]) for x in hashes)
            or any(type(result[x]) is not int for x in dates)
            or result["issuer_sha256"] != ISSUER_HASH or result["algorithm"] != "ES256"
            or result["audience"] != "authenticated"):
        raise Stop("verifier_output_values")
    return result


def verify_users(mcp, path, ledger, key, binary):
    if any(u.get("state") != "created" or not UUID.fullmatch(u.get("provider_user_id", "")) for u in ledger["users"]) or mcp.count() != 3:
        raise Stop("approved_roster_not_created")
    results = []
    for user in ledger["users"]:
        if user.get("sign_in_attempts", 0) >= 2:
            raise Stop("approved_login_limit")
        user["sign_in_attempts"] = user.get("sign_in_attempts", 0) + 1
        save_private(path, ledger)
        token = None
        row = {"alias": user["alias"]}
        failure = None
        session = None
        jwks = None
        try:
            status, response = request(mcp.issuer, "/token?grant_type=password", key,
                                       body={"email": user["email"], "password": user["password"]}, method="POST")
            token = response.get("access_token")
            if status != 200 or not isinstance(token, str) or len(token) > 8192 or response.get("user", {}).get("id") != user["provider_user_id"]:
                raise Stop("password_flow_context")
            response.clear()  # Access/refresh credentials are never retained on disk.
            _, jwks = request(mcp.issuer, "/.well-known/jwks.json")
            proof = verify_token(binary, mcp.issuer, token, jwks)
            if proof["subject_sha256"] != digest(user["provider_user_id"]):
                raise Stop("verified_subject_mismatch")
            # Only decode the exact token after the maintained verifier accepted it.
            payload = json.loads(base64.urlsafe_b64decode(token.split(".")[1] + "=" * (-len(token.split(".")[1]) % 4)))
            session = payload.get("session_id", "")
            if digest(session) != proof["session_id_sha256"] or not mcp.session_exists(user["provider_user_id"], session):
                raise Stop("live_session_before_logout")
            row.update(status="PASS", proof=proof, live_session_before_logout=True)
        except Stop as error:
            failure = str(error)
        except Exception:
            failure = "verification_runtime_error_redacted"
        finally:
            if isinstance(token, str) and 0 < len(token) <= 8192:
                try:
                    status, _ = request(mcp.issuer, "/logout?scope=local", key, bearer=token, method="POST")
                    if status not in (200, 204):
                        raise Stop("local_logout_failed")
                    row["local_logout_http_status"] = status
                except Stop as error:
                    row["local_logout_result"] = "BLOCKED"
                    failure = str(error)
        if failure is None:
            try:
                row["live_session_after_logout"] = mcp.session_exists(user["provider_user_id"], session)
                row["offline_replay_after_logout"] = verify_token(binary, mcp.issuer, token, jwks)
                if row["live_session_after_logout"]:
                    raise Stop("session_removal_not_observed")
            except Stop as error:
                failure = str(error)
            except Exception:
                failure = "replay_or_session_check_error_redacted"
        if failure:
            row.update(status="BLOCKED", reason=failure)
        results.append(row)
        if failure:
            return {"status": "BLOCKED", "operation": "verify-approved-user-tokens", "users": results,
                    "credential_ledger_removed": False, "remaining_users_not_run": 3 - len(results),
                    "application_auth_tested": False, "o05_decision": "PROPOSED_NOT_APPROVED"}
    path.unlink()  # Only this task-created, validated ledger; fixture users remain.
    return {"status": "PASS", "operation": "verify-approved-user-tokens", "users": results,
            "credential_ledger_removed": True, "fixture_users_deleted": False,
            "application_auth_tested": False, "o05_decision": "PROPOSED_NOT_APPROVED"}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("operation", choices=["preflight", "prepare", "provision", "verify", "init-env", "configure-env"])
    parser.add_argument("--approval-record", type=Path, default=REPO / "docs/vs02a-readiness/synthetic-roster-approval.json")
    parser.add_argument("--credentials", type=Path)
    parser.add_argument("--verifier", type=Path)
    parser.add_argument("--admin-env-file", type=Path, help="Explicit private operator env outside Git; never loaded by apps")
    args = parser.parse_args()
    started = now()
    try:
        if args.admin_env_file and args.operation not in {"provision", "init-env", "configure-env"}:
            raise Stop("admin_env_not_used_by_this_operation")
        if args.operation in {"prepare", "provision", "verify"}:
            approval(args.approval_record)
        if args.operation in {"init-env", "configure-env"}:
            result = setup_operator_env(args.admin_env_file or DEFAULT_ENV, args.operation == "configure-env")
        elif args.operation == "prepare":
            result = prepare()
        else:
            if args.operation in {"provision", "verify"} and not args.credentials:
                raise Stop("private_credentials_required")
            local = private_operation(args.credentials) if args.operation != "preflight" else contextlib.nullcontext(None)
            with local as private:
                with MCP() as mcp:
                    key = mcp.public_key()
                    observed = settings(mcp, key)
                    if args.operation == "preflight":
                        result = {"status": "PASS", "operation": "read-only-preflight", "auth_settings": observed,
                                  "provider_user_count": mcp.count(), "mcp_tool_count": len(mcp.tools), "provider_writes": 0,
                                  "issuer_sha256": digest(mcp.issuer),
                                  "supported_admin_auth_create_tool": any("create_user" in x or "admin_create" in x for x in mcp.tools)}
                    elif args.operation == "provision":
                        result = provision(mcp, *private, key, admin_env_file=args.admin_env_file)
                    else:
                        if not args.verifier or not args.verifier.is_file():
                            raise Stop("reviewed_verifier_binary_required")
                        result = verify_users(mcp, *private, key, args.verifier.resolve())
        result.update(started_at_utc=started, completed_at_utc=now(), record_id=RECORD,
                      environment_alias="vs02a-synthetic-candidate")
        print(json.dumps(result, sort_keys=True))
        return 0 if result.get("status") == "PASS" else 2
    except Stop as error:
        print(json.dumps({"status": "BLOCKED", "reason": str(error), "started_at_utc": started,
                          "completed_at_utc": now(), "record_id": RECORD}))
        return 2
    except Exception:
        print(json.dumps({"status": "BLOCKED", "reason": "operator_checkpoint_error_redacted",
                          "started_at_utc": started, "completed_at_utc": now(), "record_id": RECORD}))
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
