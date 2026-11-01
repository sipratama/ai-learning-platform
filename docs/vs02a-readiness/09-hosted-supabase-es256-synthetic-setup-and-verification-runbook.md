# VS-02A — Hosted Supabase ES256 Synthetic Environment Setup and Verification Runbook

**Status: PROCEDURE PREPARED — NOT EXECUTED.** Product Owner selected hosted Supabase plus ES256 in [VSA-DEC-001](08-po-supabase-hosted-es256-platform-selection-2026-11-01.md). Project configuration, credentials, provider users, PostgreSQL and CI connection are **not yet verified**. This procedure is for a human-authorized operator with appropriate Supabase access. Never paste tokens or service credentials into GitHub.

## 0. Preconditions (before creating a project)

- [ ] The authorized operator can sign into their own Supabase organization. Identify owner and purpose as **disposable VS-02A synthetic identity proof**.
- [ ] Confirm project quota, pricing/billing and ability to delete/reset. **Do not purchase or create a project without explicit operator approval of account/budget.**
- [ ] Confirm region: **Singapore is a proposal, not an established project fact**. Choose available jurisdiction after residency/cost review.
- [ ] Confirm approved project naming and separate boundaries. **Do not reuse** existing production, shared development, personal-identity or customer Supabase projects.
- [ ] Confirm whether any GitHub/Supabase integration will be connected, and give only the required access scope. The platform choice does not automatically connect accounts.
- [ ] Ensure test users contain no real names, phone numbers, real email addresses or passwords in committed fixtures. If the provider requires reachable addresses, configure a suitably isolated test-mail policy and document that limitation separately without committing personal details.

## 1. Project creation and signing-key configuration

1. Using the [Supabase Dashboard](https://supabase.com/dashboard), create a **new** isolated project only after approval of the above preconditions. Capture the *project reference/URL*, chosen region and owner in a **restricted operational manifest**, not in the public source tree if those details create an exposure concern.
2. In project **Authentication** settings, inspect JWT signing keys. **Explicitly select/verify an asymmetric EC P-256 / ES256 signing configuration** according to current Supabase Dashboard and [official signing-key guide](https://supabase.com/docs/guides/auth/signing-keys). Do not assume project defaults are ES256. Do not rotate/revoke shared production keys.
3. Verify HTTPS issuer is the expected exact project issuer `https://<approved-project-ref>.supabase.co/auth/v1` and the derived JWKS path is `/auth/v1/.well-known/jwks.json`. The fixed issuer/audience and keys must match the **actual** authorized test tenant; no wildcard issuer.
4. Retrieve the **public JWKS** from the configured URL using a normal TLS-verifying client. Inspect only public key metadata: `kty=EC`, `crv=P-256`, supported signing `alg=ES256` where present, unique bounded `kid`, no private `d` parameter. For hosted project, the endpoint may return an empty JWKS until asymmetric signing is configured. **Empty or wrong key set means FAIL/BLOCKED**, never an implicit HS256 fallback.
5. Define and verify the expected user audience from one actual **synthetic** token against provider settings. Proposed value: `authenticated`; the real value must be reviewed before Go config is pinned. Do not commit or paste the token itself.
6. Never issue an Admin role, grant browser database permissions or expose service-role/secret keys for this smoke test.

### Safe metadata-only public JWKS inspection

The command below reads **public** JWKS for an operator-controlled known project; it does not handle user JWTs. Replace placeholders locally; no shell-history secrets. Confirm TLS certificates and destination before execution.

```sh
export SUPABASE_TEST_ISSUER='https://<approved-project-ref>.supabase.co/auth/v1'
curl --fail --show-error --silent --max-time 5 \
  "${SUPABASE_TEST_ISSUER}/.well-known/jwks.json" \
  | python3 -c 'import json,sys; d=json.load(sys.stdin); keys=d.get("keys",[]); assert isinstance(keys,list); print([{"kid":k.get("kid"),"kty":k.get("kty"),"crv":k.get("crv"),"alg":k.get("alg")} for k in keys])'
```

This is a **metadata inspection**, not signature validation. A populated ES256 JWKS alone does not show the issuer's real users or access-token profile; verify both separately. Limit captured output to public, non-sensitive metadata and remove any accidental tokens or private fields.

## 2. Synthetic-identity and PostgreSQL isolation checks

- [ ] Create only an approved small synthetic roster (Student A, Student B, candidate Admin C). Provider user creation is a *separate approved action*; no production signup or real user migration.
- [ ] Preserve external issuer+subject mapping only in a restricted test-operations record; never link by email.
- [ ] Approve PostgreSQL major version, migration runner, private schema, TLS, DB roles and privilege matrix under VSA-O07; **do not execute DDL yet**. A Supabase project existing does not satisfy these design gates.
- [ ] Restrict API runtime DB grants; separate migration, provisioning and bootstrap operator capabilities. No anon/authenticated browser grant to private `identity` objects.
- [ ] Confirm audit minimization and retention owner, including synthetic-only records (VSA-O10). Do not assume disposable means unregulated.

## 3. Required redacted verification evidence

Create a **new evidence record only after actual execution**. Suggested protected metadata (do not commit secrets or copied JWTs):

| Field | Expected observation |
|---|---|
| Date/time UTC and operator | Actual actor, execution timestamp and permitted environment |
| Environment identifier | Restricted project reference or nonreversible internal environment identifier |
| Region / billing selection | Actually selected and approved values |
| Issuer | Exact approved HTTPS issuer fingerprint or approved redacted identifier |
| JWKS | HTTP status, checked source URL, number of keys, public key `kid` fingerprint and EC/P-256/ES256 compatibility |
| User token verification | A real synthetic Supabase-issued JWT signature checked by a trusted verifier **without retaining the token**; exact issuer/audience, subject/session types and expiry ceiling |
| Tenant isolation | Evidence that no real identities/data or staging/production credentials are used |
| DB privileges | Post-review negative access check: browser roles cannot access identity tables; runtime access restricted to least privilege |
| Negative cases | Fake issuer, wrong audience, HS256, missing kid, key rotation/outage: fail-closed results after actual tests |
| Security review | Named specialist, scope/conflict declaration, findings, date and link |
| Verdict | PASS / FAIL / BLOCKED, owner, defect ID and follow-up |

**Do not fabricate PASS, IDs, user accounts or token traces** from the planned test matrix. The [VSA-T01–T33 test matrix](04-threat-model-and-security-test-matrix.md) is planned, not executed; allocate actual DP-05 EVD references only upon execution.

## 4. Explicit stop conditions

Stop and record **BLOCKED** if the actual project signs with HS256/RS256 rather than selected ES256, public JWKS is empty/incompatible, tenant issuer/audience is ambiguous, billing/region approval is absent, only real users are available, private keys/credentials are exposed, or independent reviewer/implementation authorization required by governance is missing. Never circumvent a blocker by widening accepted algorithms, disabling TLS verification, accepting JWT payload without signature, or using `service_role` from the browser.

## 5. Handoff

When an authorized operator supplies the verified **redacted** environment evidence and a qualified independent human reviewer signs the VSA-P1 verification decisions, update [the decision pack](07-product-owner-decision-pack-and-implementation-gate-2026-11-01.md) and [the existing open-item register](06-readiness-decision-and-open-questions.md) through explicit addenda. Then, **only after G0–G4** and a separate scoped Product Owner implementation approval, start `feat/vs-02a-token-verification` (Go strict fixed-trust verifier + local fake-JWKS tests; no schema writes, no Admin, no login UI).

## Official documentation

- [Supabase JWT signing keys](https://supabase.com/docs/guides/auth/signing-keys)
- [Supabase JWT verification](https://supabase.com/docs/guides/auth/jwts#verifying-a-jwt-from-supabase)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Supabase regions](https://supabase.com/docs/guides/platform/regions)
