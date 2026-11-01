# VS-02A — Connected Supabase and public-JWKS checkpoint

| Field | Current observation, 2026-11-01 Asia/Jakarta |
|---|---|
| Source before this follow-up | `7164b7adda548b5ad0ea96f72e763a02d02e2af5` on `docs/vs-02a-supabase-environment-verification`, draft PR #17 |
| Environment alias | `vs02a-synthetic-candidate`; actual project/org references remain outside Git |
| Connection | **PASS: local Codex MCP configured, OAuth successful, authenticated MCP initialized** |
| Public JWKS | **PASS for metadata/shape only:** HTTP 200, verified TLS, one EC/P-256 public key with `alg=ES256` |
| Signup controls | Operator reports public signup and anonymous sign-in **OFF** after correcting initially enabled public signup; no independent settings API/runtime test |
| Overall readiness | **PARTIAL / BLOCKED for Auth implementation and full environment acceptance** |
| Attribution | AI-executed checks plus operator statements in this conversation; no independent human review |

This dated addendum follows [environment/MCP preparation](10-environment-verification-and-mcp-assessment-2026-11-01.md), [security recommendations](11-go-jwt-security-review-2026-11-01.md), [decision gates](12-readiness-dispositions-and-bundle-1-handoff-2026-11-01.md), and the [earlier pre-connection evidence checkpoint](13-verification-evidence-2026-11-01.md). Earlier BLOCKED results describe their actual execution time and remain intact.

## 1. Connection and isolation evidence

The operator supplied a project-scoped hosted MCP URL and explicitly requested adding it to Codex and authenticating. `codex mcp add supabase --url '<operator-supplied URL>'` added the named global configuration in the user's local Codex settings and automatically initiated OAuth. Its process completed with **Successfully logged in**; a redundant second login was unnecessary. `codex mcp list --json` subsequently reported enabled `streamable_http` and OAuth authentication. No credentials were read from the credential store, exported, printed or committed. No OAuth authorization URL, state, callback code or client secret is retained in repository evidence.

The [official OpenAI MCP guide](https://developers.openai.com/codex/mcp) distinguishes CLI configuration/authentication from the interactive `/mcp` command. `/mcp` was not run as a shell command or represented as executed. Verification went further through the official client's [MCP status/tool interface](https://developers.openai.com/codex/app-server): initialize, discover the configured server, and make two allowlisted read-only tool calls. **22 tools** were discovered with `authStatus=oAuth`; `get_project_url` returned the exact operator-supplied project's URL. Local client transport sessions started **zero model turns**; they were used for protocol operations only.

The URL/feature groups match the operator's request. Project scoping disables account-level project/organization discovery; no broader organization access was added. The requested URL does not set the server's `read_only` parameter, so mutating tools are advertised. Only `get_project_url` and `execute_sql` with the exact metadata-only SELECT recorded in evidence were called; no mutation, secret-key retrieval, signup or function deployment was performed. OAuth connection establishes operational access, not authorization for all advertised actions.

The operator answered **“Ya, proyek khusus uji sintetis”** to a question explicitly covering the supplied organization, their authority, dedicated VS-02A use, absence of real accounts/data and absence of shared use. This is attributable **operator attestation in chat**, not an independent security sign-off or a separately executed organization-membership API check. The actual deployment region, billing plan/reset owner and full provider settings are still unverified. This task created no project and incurred no project-creation purchase.

## 2. Observed public keys and PostgreSQL

[Redacted MCP/database evidence](evidence/2026-11-01-mcp-connected/mcp-and-postgres.json) records:

- Authenticated project URL matches the supplied target; only its hash is retained.
- PostgreSQL reports **17.11** and server setting `ssl=on`. This is **not** proof that a future Go connection uses certificate/hostname verification; its DSN/runtime role does not exist here.
- Private schema `identity` is **absent**. No DDL or migration was attempted; O07/schema/grant approval remains open.
- Aggregate `auth.users` count is **0**. No user identifiers, contact data, credentials or token/session rows were read. This supports absence of Auth accounts at that instant, not an audit of every database object or service.

[Public-key metadata](evidence/2026-11-01-mcp-connected/public-key-metadata.json) and [probe result](evidence/2026-11-01-mcp-connected/public-jwks.json) record one key with `kty=EC`, `crv=P-256`, `alg=ES256`, `use=sig`, `key_ops=[verify]`, boolean `ext=true`, and no private fields. Kids/issuer are hashed; raw coordinates, tenant references, API keys and user tokens are not retained.

**Operator-assisted current-key correlation; no successful user-token verification:** a published key can be standby or retained. The [Supabase signing-key lifecycle](https://supabase.com/docs/guides/auth/signing-keys) explicitly distinguishes standby, current and previously used keys. In response to guided instructions to inspect **Current key**, the operator supplied a key ID. Its hash exactly matches the observed ES256/P-256 public key. This supports the reported current-key identification; the active provider configuration was not independently read through a settings API, and actual signing was not tested. Exact token `iss`/`aud`, user/session claims and lifetime remain unverified. With zero provider users and no separately approved synthetic roster, no token was issued or obtained. The expected audience remains a candidate, not an observation.

The operator initially reported **public signup ON / anonymous sign-in OFF**. This was a configuration **FAIL** against the synthetic-only/nonpublic provisioning boundary. After guided instructions to turn off signup and save, the operator reported **both OFF**. Both observations are retained in [operator settings](evidence/2026-11-01-mcp-connected/operator-settings.json). This is a corrected **operator-reported** control state, not an independent settings read or a passed signup runtime test. No signup attempt or user creation was performed to test it.

## 3. Public-probe compatibility correction

The original committed preparation probe rejected this response as `unreviewed_jwk_extension`. Inspection showed the additional member was **`ext: true`**, the registered public extractability field in the [W3C Web Cryptography Recommendation](https://www.w3.org/TR/webcrypto-1/#dfn-JsonWebKey), not a private key or an algorithm change.

The correction accepts only boolean `ext`, with either boolean value, as optional public metadata. It rejects string/null/integer/object/array values. It conveys no new issuer, key URL, signature authority or algorithm permission. Unknown extensions and all existing private-material, algorithm, curve, size, duplicate and transport guards remain enforced. Added regression assertions prove `ext` cannot make HS256, a private key, a different curve or a token-controlled URL acceptable. No application JWT verifier or Auth dependency was implemented.

The [old-probe FAIL](evidence/2026-11-01-mcp-connected/probe-before.json), [corrected live PASS](evidence/2026-11-01-mcp-connected/public-jwks.json), [ten offline guard tests](evidence/2026-11-01-mcp-connected/probe-guards.txt), and [execution/source digests](evidence/2026-11-01-mcp-connected/execution.json) are retained separately. The old failure was a preparation-tool compatibility defect, not evidence that Supabase signed an invalid token.

## 4. Evidence and remaining gates

`S2` below means the revised scripts identified by SHA-256 in the new execution/artifact records and committed in **`914fd011e17c02bef6f65bd01bac05b4db58debe`**, based on `7164b7adda548b5ad0ea96f72e763a02d02e2af5`. The subsequent operator-control documentation does not change those script bytes. Environment aliases in this table are redacted labels bound by the operator-supplied target and observed URL/issuer hashes.

| Test ID | Expected behavior | Actual result | Status | Evidence | Relevant source | Environment | Remaining risk |
|---|---|---|---|---|---|---|---|
| EV-CONN-01 | Configure/authenticate scoped MCP without handling credentials in the repository | Add command initiated and completed OAuth; configured/enabled; authenticated MCP initialized; 22 tools found | **PASS** | [Connection record](evidence/2026-11-01-mcp-connected/mcp-and-postgres.json) | `7164b7a` + local operator config | candidate | Client connection is not approval of every advertised tool |
| EV-CONN-02 | Select an authorized isolated synthetic target | Operator attestation and exact project URL match | **PASS for attestation/target match** | [Connection record](evidence/2026-11-01-mcp-connected/mcp-and-postgres.json) | `7164b7a` | candidate | Organization membership/region/budget/reset ownership not independently verified |
| EV-CONN-03 | Obtain public nonempty compatible JWKS over verified HTTPS | HTTP 200, one EC/P-256/ES256 public key; no private fields | **PASS for public metadata** | [Public metadata](evidence/2026-11-01-mcp-connected/public-key-metadata.json), [probe](evidence/2026-11-01-mcp-connected/public-jwks.json) | S2 | candidate | No curve/signature/token validation or active-signer proof |
| EV-CONN-04 | Valid Web Crypto metadata accepted while unsafe inputs still deny | Original probe exit 1; corrected live probe exit 0; ten offline tests pass | **PASS after tool correction** | [Before](evidence/2026-11-01-mcp-connected/probe-before.json), [guards](evidence/2026-11-01-mcp-connected/probe-guards.txt), [execution](evidence/2026-11-01-mcp-connected/execution.json) | `7164b7a` old probe; S2 corrected | candidate + offline | Preparation checks only, no VSA verifier test PASS |
| EV-CONN-05 | Read DB capability/version without migration or personal rows | 17.11, `ssl=on`, no identity schema, zero Auth users | **PASS for observations** | [Database metadata](evidence/2026-11-01-mcp-connected/mcp-and-postgres.json) | `7164b7a` + recorded SELECT | candidate | No runtime DB role/privilege/TLS or migration proof |
| EV-CONN-06 | Verify current signer, signup/anonymous controls and actual region | Guided Current-key ID matches ES256 public key; operator reports both signup controls OFF after correction; actual region still unverified | **BLOCKED overall** | [Operator metadata](evidence/2026-11-01-mcp-connected/operator-settings.json), [guided procedure](#5-next-operator-step) | `7164b7a`; S2 public-key correlation | candidate | Operator-assisted configuration evidence; no independent settings API read, region or actual signing proof |
| EV-CONN-09 | Public and anonymous signup disabled for nonpublic synthetic provisioning | Operator first reports signup ON/anonymous OFF, then confirms both OFF after saving correction | **FAIL initially; PASS for final operator report** | [Retained control history](evidence/2026-11-01-mcp-connected/operator-settings.json) | Operator Dashboard action; S2 checkpoint | candidate | No independent runtime signup test; no configuration mutation through MCP |
| EV-CONN-07 | Verify an actual synthetic access JWT's signature/context/lifetime | No synthetic user/token created or obtained | **NOT RUN** | This checkpoint | `7164b7a` | candidate | No actual issuer/audience/user/session token proof |
| EV-CONN-08 | Source/links/secret patterns and retained artifact digests consistent | Final local check records mechanical results | **PASS** | [Preparation checks](evidence/2026-11-01-mcp-connected/preparation-checks.json), [artifacts](evidence/2026-11-01-mcp-connected/artifacts.json) | S2 | local | Pattern-based checks are not a full history/security audit |

Historical [2026-11-01 artifact hashes](evidence/2026-11-01/artifacts.json) describe the previous checkpoint: resolve its two script entries from **commit `7164b7adda548b5ad0ea96f72e763a02d02e2af5`**, not today's revised script files. All its retained evidence-file bytes remain unchanged. The new [artifact manifest](evidence/2026-11-01-mcp-connected/artifacts.json) identifies S2 separately. Existing Guest runtime results remain their earlier executions; new hosted CI results belong to the actual follow-up PR SHA and are linked in the PR/Issue progress record.

O03 now has actual authenticated access, operator isolation attestation, public JWKS and limited DB observations, but remains **OPEN/PARTIAL**. O04's reviewed verifier defaults/dependency and O05/O06 policy decisions remain unresolved; O01/O02 independent predecessor/design review is still missing. No full VSA-O item, G0–G4 gate or Issue #16 is closed. VSA-T01–T33 remain **NOT RUN**. The earlier eleven Moderate tooling advisories remain unresolved; no dependency changes or waiver occurred.

## 5. Next operator step

The operator requested help understanding Dashboard metadata. The first guided step was to open **Settings → JWT Signing Keys** and locate **Current key**. The supplied ID matches the observed public ES256 key; only its hash and this limited correlation are recorded. No key was copied as cryptographic material or rotated/created/revoked. This is operator-assisted settings evidence, not a signed-token test.

The operator completed **Authentication → Sign In / Providers** inspection and reports both **Allow new users to sign up** and **Allow anonymous sign-ins** OFF after the guided signup correction. The [Supabase configuration guide](https://supabase.com/docs/guides/auth/general-configuration) defines the controls. Obtain the actual deployment region next; a region is not inferred from a preferred location. No sensitive screenshots or credentials are requested.

After configuration evidence, obtain separate approval of a minimal synthetic provider-user roster and trusted token verification procedure before creating any user or issuing a token. No real identities, public signup, LMS Account provisioning, migration or Admin grant is authorized. Bundle 1 still waits for G0–G3 and separate G4 QUAL-002 authority.
