# VS-02A — Environment verification and Supabase MCP assessment

| Field | Observation, 2026-11-01 Asia/Jakarta |
|---|---|
| Result | **BLOCKED: authorized Supabase connection and project evidence unavailable** |
| Source baseline | `91080f45e1aba38316eeecca6eeba3f618bd7f3a`, merged PR #15 |
| Branch | `docs/vs-02a-supabase-environment-verification`, created from freshly fetched `origin/main` |
| Authority | Current PO request authorizes readiness scripts/docs, checks, commit, push, PR and Issue #16 progress comment; excludes Auth implementation, project creation/cost without explicit approval, migrations, bootstrap and deployment |
| Environment identifier | **UNASSIGNED**; no verified project, issuer, region, database or synthetic roster |
| Preparation | AI-assisted engineering/security analysis; no independent human sign-off |

Read with the [operator runbook](09-hosted-supabase-es256-synthetic-setup-and-verification-runbook.md), [verifier review](11-go-jwt-security-review-2026-11-01.md), [decision gates](12-readiness-dispositions-and-bundle-1-handoff-2026-11-01.md), and [executed evidence](13-verification-evidence-2026-11-01.md).

## 1. Repository and connection observations

- Initial branch `main`, clean working tree; `git fetch origin --prune` succeeded. Local main and fetched origin main matched the full baseline above. GitHub confirms [PR #15](https://github.com/sipratama/ai-learning-platform/pull/15) merged at `2026-11-01T02:59:05Z`, with that merge SHA. The requested branch existed neither locally nor remotely before creation. No applicable `AGENTS.md` found in the repository or ancestor directories.
- [Issue #16](https://github.com/sipratama/ai-learning-platform/issues/16) was OPEN, with all operational checks unchecked and no comments at initial inspection. Its conditions remain unsatisfied.
- No Supabase tools were available in this session. Plugin discovery returned Supabase as available but **not installed/connected**. No Supabase CLI, `supabase/config.toml`, linked project reference, Supabase-named environment variables, or conventional Supabase CLI credential/project files were found. Only committed `.env.example` files were found outside dependencies. Only paths and variable names were inspected; credential stores were not searched or copied.
- These observations mean **project inventory is inaccessible**, not that no project exists. Neither the operator's organization nor project isolation/ownership has been verified. The operator was asked to connect/authenticate through an approved method; they requested an assessment of the official MCP repository, addressed below.
- No provider project, user, signing key, database, migration, grant, or deployment was created/changed. No actual user JWT was obtained or decoded.

## 2. Can official Supabase MCP be used?

**Yes, technically suitable after operator authentication; not connected in this session.** The [official repository](https://github.com/supabase/mcp) documents a hosted HTTP endpoint and OAuth login. Its [configuration example](https://github.com/supabase/mcp/blob/main/README.md) supports project scoping, read-only mode and feature filtering. No local Supabase installation is necessary for this hosted connection.

Recommended connection stages, kept in operator-local client configuration:

```text
Discovery, only if the operator permits organization/project inventory:
https://mcp.supabase.com/mcp?read_only=true&features=account,docs

After the exact isolated test project is approved:
https://mcp.supabase.com/mcp?project_ref=<approved-project-ref>&read_only=true&features=database,docs
```

The [official MCP guide](https://supabase.com/docs/guides/ai-tools/mcp) describes OAuth, `read_only`, `project_ref` and feature groups; project scoping removes account tools. An unscoped connection can see multiple projects. Discovery must use only organization/project metadata; never inspect another project's data. Restrict to the approved project afterward. Read-only database access can still expose secrets/personal rows: use allowlisted metadata queries only, never `SELECT *` from managed Auth tables or retrieve passwords, tokens, connection strings or signing material. No mutating tool, SQL, migration, branch, project or key action is authorized by connecting.

A TLS-verifying unauthenticated GET to the discovery URL returned **HTTP 401**, measured in this task. This establishes reachability and lack of authentication only. It is not a successful MCP initialization, tool inventory, OAuth authorization or tenant verification. No OAuth/PAT has been acquired or persisted by this task. No client-wide MCP configuration was modified.

The published tool list covers project discovery and database metadata. It does not establish a dedicated Auth signing-settings or synthetic login/token-verification capability. Inspect the actual authenticated tool inventory before relying on it. Dashboard evidence may still be needed for active ES256 settings; public JWKS and an independently signature-verified synthetic access token are separate checks. Do not expose a JWT through MCP SQL/results or chat to compensate for a missing tool. This is an inference about suitability from the published interface, not an executed integration claim.

## 3. Operator checklist and exact stop boundaries

1. **Connect only:** sign into the intended Supabase organization via the official plugin/client OAuth flow. Keep credentials in the client-managed credential store. Record operator identity, organization ownership and permitted inventory scope in restricted operations evidence. No PAT or password in chat/Git.
2. **Identify before creating:** list permitted project metadata; classify candidate ownership, isolation, region, billing and reset/delete owner. Reject production/shared/personal-data projects. If none qualifies, present the exact organization, owner, proposed name, available region, plan/quota/cost and reset scope for explicit operator/PO approval **before** project creation, including a nominally free project. No such approval has been supplied here.
3. **Region:** Singapore `ap-southeast-1` appears in the current [region catalogue](https://supabase.com/docs/guides/platform/regions). Catalogue presence does not prove operator-specific capacity or approved residency/billing. Prefer the exact region after approval; do not assume an APAC general-region selection guarantees it. Record actual project region privately.
4. **Read settings:** confirm Auth enabled, public signup and anonymous signup disabled, email/SMS/OAuth side effects disabled or bounded to an approved synthetic test policy, exact browser origins/redirect allowlist, active ES256/P-256 signing and actual access-token lifetime. A JWKS with an ES256 standby key does **not** prove active signing is ES256. Key state changes/rotation require a separate explicit operation approval for this isolated tenant.
5. **Public metadata probe:** run the script below only against the approved project. Confirm nonempty compatible keys, certificate verification, fixed destination and no redirects. Preserve the redacted result, source SHA, execution timestamp, restricted manifest reference and reviewer. Unexpected keys/extensions block for inspection; do not widen trust.
6. **Synthetic token evidence:** only after separate roster/user-creation authorization, a trusted operator signs in as an approved synthetic user through the provider. A maintained trusted verifier must check the actual signature against the fixed JWKS and exact expected issuer/audience, then confirm `sub`/`session_id` UUID types, integral `iat`/`exp`, user context and maximum lifetime. Retain only assertion outcomes and fingerprints in restricted evidence, no token or personal identifiers. Never use a generic online JWT decoder. This step is **BLOCKED**, and no credential-handling verifier is introduced here.
7. **Storage:** review O07 private schema/version/privileges before any DDL. A project existing does not prove least privilege. After separate migration authorization, prove browser roles have no access and runtime/operator capabilities are separated. No real data, Admin bootstrap or production access.
8. **Review:** attach evidence to Issue #16 via redacted links; obtain G0–G3 dispositions and separate G4 authorization. Environment PASS alone does not permit Bundle 1.

## 4. Executable public-JWKS probe

[verify-supabase-jwks.py](../../scripts/verify-supabase-jwks.py) uses Python 3.9+ standard library, handles no tokens or API keys, performs one GET, validates a bounded public key-set shape and emits redacted JSON. It requires an exact default hosted issuer and a nonidentifying alias bound to the approved project in a restricted manifest. Custom domains require a separately reviewed change; they are not accepted through arbitrary URL input. Aliases are labels, not proof of isolation or approval.

```sh
# Set the approved issuer locally, outside committed files; it is not a secret.
export SUPABASE_TEST_ISSUER='https://<approved-project-ref>.supabase.co/auth/v1'
python3 scripts/verify-supabase-jwks.py --environment-alias vs02a-synthetic-operator-chosen

# No network or credentials: validate the probe's safety guards.
PYTHONDONTWRITEBYTECODE=1 python3 scripts/test-verify-supabase-jwks.py
```

Exit codes: `0` public shape PASS; `1` incompatible/malformed/HTTP FAIL; `2` missing configuration or network/TLS BLOCKED. The timeout is two seconds per blocking socket operation; the probe is a manual preparation tool, not the proposed Go end-to-end deadline/cache implementation. It caps response bytes at 64 KiB, keys at eight, rejects redirects/proxies/private fields/duplicate members and kids, and outputs hashed kids rather than raw keys/issuer. Malformed/private responses are never echoed.

**Scope limitation:** PASS establishes public-JWKS structure only. Coordinate encoding/size is checked; cryptographic point validity, signatures, active signer, tenant ownership, Auth enablement, issuer claims, audience and session semantics are not verified. No offline test result satisfies VSA-T01–T33. The unconfigured invocation actually returned **BLOCKED / approved_issuer_not_supplied**, as recorded in the [evidence matrix](13-verification-evidence-2026-11-01.md).

## 5. Private manifest fields to complete after approval

Keep the actual manifest outside Git: approval reference, operator/organization/project identity, nonidentifying alias, exact issuer and hash, actual region/plan/cost approval, reset/delete owner, signup/origin controls, active signing algorithm, public-key fingerprints, verified audience/claim assertions, synthetic roster aliases with restricted mappings, token lifetime, PostgreSQL version/role inventory, secret-store reference names, evidence access/expiry owner and reviewer dispositions. Do not place credentials, raw JWTs, passwords, database URLs or private key material in the manifest committed to this repository; no actual private manifest is created here.
