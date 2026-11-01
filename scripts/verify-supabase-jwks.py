#!/usr/bin/env python3
"""Read-only public-JWKS shape probe; never a JWT/signature verifier."""

import argparse
import base64
import hashlib
import json
import os
import re
import ssl
import sys
import urllib.error
import urllib.request
from datetime import datetime, timezone

MAX_BYTES = 65536
MAX_KEYS = 8
TIMEOUT_SECONDS = 2
ISSUER = re.compile(r"https://[a-z0-9]{20}\.supabase\.co/auth/v1\Z")
PRIVATE_FIELDS = {"d", "p", "q", "dp", "dq", "qi", "oth", "k"}


class ProbeError(Exception):
    """Only static error codes may leave this process."""


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ProbeError("redirect_rejected")


def jwks_url(issuer):
    if not ISSUER.fullmatch(issuer):
        raise ProbeError("invalid_hosted_issuer")
    return issuer + "/.well-known/jwks.json"


def unique_object(pairs):
    obj = {}
    for key, value in pairs:
        if key in obj:
            raise ProbeError("duplicate_json_member")
        obj[key] = value
    return obj


def reject_constant(_):
    raise ProbeError("nonfinite_json_number")


def coordinate(value):
    if not isinstance(value, str) or not re.fullmatch(r"[A-Za-z0-9_-]{43}", value):
        raise ProbeError("invalid_public_coordinate")
    raw = base64.urlsafe_b64decode(value + "=")
    if len(raw) != 32 or base64.urlsafe_b64encode(raw).decode().rstrip("=") != value:
        raise ProbeError("invalid_public_coordinate")


def inspect_jwks(body):
    if len(body) > MAX_BYTES:
        raise ProbeError("jwks_too_large")
    try:
        obj = json.loads(body.decode("utf-8"), object_pairs_hook=unique_object,
                         parse_constant=reject_constant)
    except (ValueError, UnicodeError, RecursionError):
        raise ProbeError("invalid_json") from None
    if not isinstance(obj, dict) or set(obj) != {"keys"}:
        raise ProbeError("invalid_jwks_envelope")
    keys = obj["keys"]
    if not isinstance(keys, list) or not 1 <= len(keys) <= MAX_KEYS:
        raise ProbeError("empty_or_excess_keys")
    kids = set()
    fingerprints = []
    for key in keys:
        if not isinstance(key, dict):
            raise ProbeError("invalid_jwk")
        if PRIVATE_FIELDS.intersection(key):
            raise ProbeError("private_material_rejected")
        if key.get("kty") != "EC" or key.get("crv") != "P-256":
            raise ProbeError("incompatible_key_type")
        if "alg" in key and key["alg"] != "ES256":
            raise ProbeError("incompatible_algorithm")
        if "use" in key and key["use"] != "sig":
            raise ProbeError("incompatible_key_use")
        if "key_ops" in key and key["key_ops"] != ["verify"]:
            raise ProbeError("incompatible_key_operations")
        # Web Crypto's registered public extractability metadata conveys no trust.
        if "ext" in key and not isinstance(key["ext"], bool):
            raise ProbeError("invalid_extractability_metadata")
        # Unexpected extensions require inspection, never new trust locations.
        if set(key) - {"kty", "crv", "kid", "x", "y", "alg", "use", "key_ops", "ext"}:
            raise ProbeError("unreviewed_jwk_extension")
        kid = key.get("kid")
        if not isinstance(kid, str) or not re.fullmatch(r"[\x21-\x7e]{1,128}", kid):
            raise ProbeError("invalid_kid")
        if kid in kids:
            raise ProbeError("duplicate_kid")
        kids.add(kid)
        coordinate(key.get("x"))
        coordinate(key.get("y"))
        fingerprints.append(hashlib.sha256(kid.encode()).hexdigest())
    return {"key_count": len(keys), "kid_sha256": sorted(fingerprints),
            "key_shape": "EC/P-256", "algorithm_metadata": "ES256-or-absent"}


def fetch_jwks(issuer):
    url = jwks_url(issuer)
    context = ssl.create_default_context()
    opener = urllib.request.build_opener(
        urllib.request.ProxyHandler({}), NoRedirect(),
        urllib.request.HTTPSHandler(context=context))
    request = urllib.request.Request(url, headers={"Accept": "application/json"})
    with opener.open(request, timeout=TIMEOUT_SECONDS) as response:
        if response.status != 200:
            raise ProbeError("unexpected_http_status")
        if response.headers.get_content_type() != "application/json":
            raise ProbeError("unexpected_content_type")
        return inspect_jwks(response.read(MAX_BYTES + 1))


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--environment-alias", required=True,
                        help="Nonidentifying alias, bound privately to the approved synthetic project")
    args = parser.parse_args(argv)
    result = {"probe": "public-jwks-shape-only",
              "executed_at_utc": datetime.now(timezone.utc).isoformat(),
              "token_verification": "NOT RUN"}
    if not re.fullmatch(r"vs02a-synthetic-[a-z0-9-]{1,32}", args.environment_alias):
        result.update(status="BLOCKED", reason="invalid_environment_alias")
        print(json.dumps(result, sort_keys=True))
        return 2
    result["environment_alias"] = args.environment_alias
    issuer = os.environ.get("SUPABASE_TEST_ISSUER", "")
    if not issuer:
        result.update(status="BLOCKED", reason="approved_issuer_not_supplied")
        print(json.dumps(result, sort_keys=True))
        return 2
    try:
        result.update(fetch_jwks(issuer))
        result.update(status="PASS", http_status=200, tls_certificate_verified=True,
                      issuer_sha256=hashlib.sha256(issuer.encode()).hexdigest())
    except ProbeError as error:
        result.update(status="FAIL", reason=str(error))
    except urllib.error.HTTPError as error:
        result.update(status="FAIL", reason="http_error", http_status=error.code)
    except (OSError, ValueError, urllib.error.URLError):
        result.update(status="BLOCKED", reason="network_or_tls_unavailable")
    print(json.dumps(result, sort_keys=True))
    return {"PASS": 0, "FAIL": 1, "BLOCKED": 2}[result["status"]]


if __name__ == "__main__":
    sys.exit(main())
