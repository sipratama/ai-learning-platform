"""Offline guard checks for the operator probe, not VSA-T01–T33 execution."""

import base64
import contextlib
import importlib.util
import io
import json
import os
from pathlib import Path
import ssl
import unittest
import urllib.error
from unittest.mock import patch

spec = importlib.util.spec_from_file_location(
    "probe", Path(__file__).with_name("verify-supabase-jwks.py"))
probe = importlib.util.module_from_spec(spec)
spec.loader.exec_module(probe)


def public_key(**changes):
    # Public NIST P-256 generator coordinates; no private key or JWT fixture.
    values = ["6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296",
              "4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"]
    x, y = [base64.urlsafe_b64encode(bytes.fromhex(v)).decode().rstrip("=") for v in values]
    return dict({"kid": "offline-public-key", "kty": "EC", "crv": "P-256",
                 "alg": "ES256", "x": x, "y": y}, **changes)


class ProbeGuards(unittest.TestCase):
    def inspect(self, keys):
        return probe.inspect_jwks(json.dumps({"keys": keys}).encode())

    def test_compatible_public_shape_with_optional_metadata(self):
        for omit_alg in (False, True):
            key = public_key()
            if omit_alg:
                del key["alg"]
            result = self.inspect([key])
            self.assertEqual(result["key_count"], 1)
            self.assertNotIn("offline-public-key", json.dumps(result))
            self.assertNotIn("x", result)

    def test_empty_excess_duplicate_and_nonobject_keys_deny(self):
        for keys in ([], [public_key()] * 9, [public_key(), public_key()], [None], {}):
            with self.subTest(keys_type=type(keys).__name__), self.assertRaises(probe.ProbeError):
                self.inspect(keys)

    def test_extractability_metadata_is_boolean_and_cannot_override_trust(self):
        for flag in (True, False):
            self.assertEqual(self.inspect([public_key(ext=flag)])["key_count"], 1)
            for changes in ({"alg": "HS256"}, {"d": "sensitive-marker"},
                            {"crv": "P-384"}, {"jku": "https://example.invalid"}):
                with self.subTest(ext=flag, fields=list(changes)), self.assertRaises(probe.ProbeError):
                    self.inspect([public_key(ext=flag, **changes)])
        for invalid in (None, "true", 1, 0, [], {}):
            with self.subTest(value_type=type(invalid).__name__), self.assertRaisesRegex(
                    probe.ProbeError, "invalid_extractability_metadata"):
                self.inspect([public_key(ext=invalid)])

    def test_incompatible_and_private_material_deny(self):
        for changes in ({"alg": "HS256"}, {"alg": "RS256"}, {"kty": "oct"},
                        {"crv": "P-384"}, {"d": "sensitive-marker"}, {"k": "sensitive-marker"},
                        {"use": "enc"}, {"key_ops": ["sign"]}, {"key_ops": None},
                        {"kid": ""}, {"kid": "x" * 129}, {"kid": "line\nbreak"},
                        {"x": "bad"}, {"y": None}, {"x5u": "https://example.invalid"}):
            with self.subTest(fields=list(changes)), self.assertRaises(probe.ProbeError):
                self.inspect([public_key(**changes)])

    def test_malformed_duplicate_nonfinite_and_oversize_json_deny(self):
        for body in (b"{", b"[]", b'{"keys":[],"keys":[]}',
                     b'{"keys":[{"kid":"a","kid":"b"}]}',
                     b'{"keys": NaN}', b'{"keys": Infinity}', b"\xff",
                     b"[" * 2000, b" " * (probe.MAX_BYTES + 1)):
            with self.subTest(size=len(body)), self.assertRaises(probe.ProbeError):
                probe.inspect_jwks(body)

    def test_issuer_cannot_select_other_destinations(self):
        for issuer in ("http://localhost/auth/v1", "https://127.0.0.1/auth/v1",
                       "https://example.invalid/auth/v1", "https://" + "a" * 20 +
                       ".supabase.co.evil.invalid/auth/v1", "https://" + "a" * 20 +
                       ".supabase.co/auth/v1?x=y", "https://user:pass@example.invalid/auth/v1"):
            with patch.object(probe.urllib.request, "build_opener") as opener:
                with self.assertRaises(probe.ProbeError):
                    probe.fetch_jwks(issuer)
                opener.assert_not_called()

    def test_redirect_is_rejected(self):
        with self.assertRaisesRegex(probe.ProbeError, "redirect_rejected"):
            probe.NoRedirect().redirect_request(None, None, 302, "", {}, "https://example.invalid")

    def test_transport_requires_tls_no_proxy_bounded_read_and_deadline(self):
        with patch.object(probe.urllib.request, "build_opener") as build:
            response = build.return_value.open.return_value.__enter__.return_value
            response.status = 200
            response.headers.get_content_type.return_value = "application/json"
            response.read.return_value = json.dumps({"keys": [public_key()]}).encode()
            result = probe.fetch_jwks("https://" + "a" * 20 + ".supabase.co/auth/v1")
            handlers = build.call_args.args
            self.assertEqual(handlers[0].proxies, {})
            self.assertIsInstance(handlers[1], probe.NoRedirect)
            self.assertEqual(handlers[2]._context.verify_mode, ssl.CERT_REQUIRED)
            self.assertTrue(handlers[2]._context.check_hostname)
            self.assertEqual(build.return_value.open.call_args.kwargs["timeout"], 2)
            response.read.assert_called_once_with(65537)
            self.assertEqual(result["key_count"], 1)
            response.headers.get_content_type.return_value = "text/html"
            with self.assertRaisesRegex(probe.ProbeError, "unexpected_content_type"):
                probe.fetch_jwks("https://" + "a" * 20 + ".supabase.co/auth/v1")

    def test_missing_configuration_blocks_without_network(self):
        with patch.dict(os.environ, {}, clear=True), patch.object(probe, "fetch_jwks") as fetch:
            output = io.StringIO()
            with contextlib.redirect_stdout(output):
                code = probe.main(["--environment-alias", "vs02a-synthetic-pending"])
            self.assertEqual(code, 2)
            self.assertEqual(json.loads(output.getvalue())["status"], "BLOCKED")
            fetch.assert_not_called()

    def test_errors_do_not_echo_remote_body_issuer_or_secrets(self):
        for error, expected in ((probe.ProbeError("private_material_rejected"), "FAIL"),
                                (urllib.error.HTTPError("sensitive-marker", 401, "sensitive-marker", {}, None), "FAIL"),
                                (urllib.error.URLError("sensitive-marker"), "BLOCKED")):
            with patch.dict(os.environ, {"SUPABASE_TEST_ISSUER": "sensitive-marker"}), \
                    patch.object(probe, "fetch_jwks", side_effect=error):
                output = io.StringIO()
                with contextlib.redirect_stdout(output):
                    code = probe.main(["--environment-alias", "vs02a-synthetic-offline"])
                self.assertNotEqual(code, 0)
                self.assertNotIn("sensitive-marker", output.getvalue())
                self.assertEqual(json.loads(output.getvalue())["status"], expected)


if __name__ == "__main__":
    unittest.main(verbosity=2)
