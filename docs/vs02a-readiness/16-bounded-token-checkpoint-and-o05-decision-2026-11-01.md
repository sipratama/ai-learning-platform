# VS-02A — Bounded token checkpoint and O05 decision proposal

| Field | Current checkpoint |
|---|---|
| Starting source | `8ebcffb8903899714326946ce443d4e2c76772ac`, existing draft PR #17 |
| Environment | `vs02a-synthetic-candidate`, Frankfurt `eu-central-1`, synthetic-only |
| Roster authority | [VSA-SYN-20261101-R1](15-synthetic-roster-and-token-checkpoint-approval-2026-11-01.md): **explicitly approved** in the current conversation |
| Application scope | **No Auth Bundle 1 implementation**; operator-only separate verifier module and bounded preparation/verification client |
| Independent review | **Not supplied**; no human review or final slice sign-off inferred |

This record continues [the pre-token checkpoint](14-connected-supabase-public-jwks-checkpoint-2026-11-01.md). Historical pending/blocked observations remain unchanged. The new task separately authorizes bounded real-token verification and local negative tests; it does not grant application implementation authority or approve O05.

## 1. Preflight and approval boundary

Fresh read-only inspection of scoped MCP found authenticated access and 22 tools, including `get_project_url`, `get_publishable_keys` and `execute_sql`, but **no supported Admin Auth create-user tool**. The existing URL exactly matches the previously approved issuer fingerprint. A public project key was used only in memory to read the provider's public `GET /auth/v1/settings`; it was never printed or committed. The provider source defines `disable_signup`, `external.anonymous_users` and `external.email` in [Supabase Auth settings](https://github.com/supabase/auth/blob/master/internal/api/settings.go).

Unlike the earlier operator-only setting reports, this direct HTTPS read observed **disable_signup=true**, **anonymous_users=false**, **email=true** with HTTP 200 and certificate verification. Aggregate Auth user count was **0**. These are executed configuration/count observations, not successful login or token-signature proof. No public/anonymous signup attempt was sent.

The operator explicitly approved R1's exact A/B/C roster, reserved non-delivery addresses, confirmation/credential policy, bounded create/password-login/local-logout actions and reset/delete ownership. [Approval/provenance](synthetic-roster-approval.json) records that disposition separately from independent review, O05 and QUAL-002. `.invalid` has no mailbox or claimed domain ownership; explicit acceptance of the non-delivery fixture policy replaces use of a real test-mail account. Provider rejection requires a revised approved roster, never a substituted real address.

Because the MCP inventory has no supported create-user tool, the bounded operator client uses the MCP-validated project and supported server-side Admin Auth API. The project's **existing** modern secret is entered only through `getpass` in the operator's local terminal, not read from PostgreSQL/OAuth credentials, exported or passed as an argument. A later operator disclosure in chat is a separate containment blocker recorded below; the disclosed value is not retained here. [Supabase API-key guidance](https://supabase.com/docs/guides/getting-started/api-keys) requires modern API keys in `apikey`; they are not user JWTs. No key creation/rotation is authorized. No SQL insertion into managed Auth schemas is used.

## 2. Separate verification artifact and scope

[Operator verifier module](../../scripts/vs02a-jwt-checkpoint/README.md) pins `github.com/golang-jwt/jwt/v5 v5.3.1` in a **separate module under scripts**, with no application import, middleware, DB adapter, Account/role logic, protected route, key cache or deploy wiring. Application dependencies are unchanged. The provider wrapper uses fixed TLS-verified destinations and a maintained JOSE library via a private memory pipe; cryptography is not handwritten.

Local negative credentials are ephemeral and never sent to Supabase or unrelated services. Cases cover unsupported algorithms, wrong trust context, signature/payload forgery, time/lifetime errors, malformed/duplicate JSON, unknown kid, token-selected key URLs, private/wrong/invalid-point JWKs, expiry/skew edges and proof-output redaction. Operator tests cover approval boundaries, private file permissions, no broadening of actions/roster, local-only logout, bounded retries, concurrent-ledger exclusion, partial outcomes and credential leakage. They are **local checkpoint cases**, not full VSA acceptance tests.

The checkpoint expects exact approved issuer, singleton audience `authenticated`, ES256/P-256, required canonical `sub`/`session_id`, integral `iat`/`exp`, provider user context, 3600-second maximum issued lifetime and 30-second skew. These are proposed test expectations, not approved production O04 defaults. A mismatch fails closed; no audience is adopted from an unverified token and no algorithm/lifetime fallback exists.

## 3. Real-token outcomes — update only from executed proof

The approved Admin API creation completed **PASS for A/B/C**, 2026-11-01 04:41:38–04:41:49 UTC. Each is a confirmed nonanonymous provider `authenticated` user; none is an application Account or has any application grant. An earlier rejected Admin input was **BLOCKED before any create request**, then corrected by the operator in their hidden local prompt. The failure is retained rather than overwritten.

Real password sign-in, trusted ES256 JWKS signature/claims verification and task-local logout completed **PASS for all three**, 04:42:38–04:42:57 UTC. Observed issuer matched the approved fingerprint, actual audience was `authenticated`, and subject matched the created provider UUID. Each signed session UUID existed before logout and disappeared after HTTP **204** local logout. All actual `iat`/`exp` intervals were **3600 seconds**. The same JWT still passed offline verification immediately after logout, with 3595/3596/3596 seconds remaining until `exp`. This is an executed bounded observation, not an application API request or full-hour replay drill.

[Live proof](evidence/2026-11-01-real-token-checkpoint/live-verification.json) records only hashes, times and outcomes. [Exact evidence matrix](17-real-token-checkpoint-evidence-2026-11-01.md) separates provider proof, local fixtures, failures and gates. No password, JWT, refresh token, secret key, private key or private operational path is committed. The task credential ledger was removed after all proofs/logout succeeded; the three provider users remain. Read-only postflight found **3 approved confirmed users, 0 provider sessions, no identity schema**, and signup/anonymous remained disabled. No password reset, user deletion, migration or application Auth implementation occurred.

## 3.1 Operator env and disclosed-key containment

After completion, the operator requested reusable env storage and pasted a privileged API key into the conversation. The initial containment state was **BLOCKED**. The operator subsequently reported “Sudah dicabut dan pengganti dibuat”; revocation/replacement is now **operator-reported complete**, with independent verification **NOT RUN**. There is no claim of malicious use or production exposure. The disclosed value is neither saved nor reused by this task. This does not negate the prior signature observations; the operator report and independent verification limit must remain distinct in the readiness record.

The [operator helper](../../scripts/vs02a-jwt-checkpoint/README.md#private-operator-env-optional) now supports an explicitly selected local env outside Git/apps: `~/.config/vs02a-operator/.env`, file `0600`, parent `0700`. An empty template was created with **zero provider writes**; at 05:29:36 UTC the helper reported successful local storage after the operator entered the replacement through a hidden Terminal prompt. The value was not read into chat or sent to a provider; its provenance is operator input, not an independent comparison with the disclosed key. Replacement input uses a hidden local prompt, literal strict parsing, no shell sourcing, no process env export and no key echo. Storage is permission-restricted plaintext; it is not encryption or a secret manager. Fixture passwords and JWTs never go there. Fifteen offline operator tests cover this and the R1 guards. The env enhancement was added after the live execution; its tests are local, not another provider run.

Following the operator-reported revocation/replacement in Dashboard → Settings → API Keys, the replacement may be entered locally with `configure-env`; its value must never be supplied in chat. API-key changes fall outside R1; no key-management API call is implemented or executed. [Supabase guidance](https://supabase.com/docs/guides/getting-started/api-keys) treats secret keys as elevated credentials and describes replacement of leaked keys. Do not rotate ES256 signing keys for this API-secret incident. Configuring local storage authorizes no further fixture creation: R1 is already fulfilled and the existing-project guard stops duplicate provisioning.

## 4. O05 decision prepared for accountable review

**Decision ID: `VSA-O05-PROVIDER-LOGOUT-PROPOSAL-20261101`; status: PROPOSED / NOT APPROVED.** The roster approval and the Frankfurt decision do not approve a JWT replay policy. An independent identity/security specialist must review the evidence/limits before the applicable implementation gate; no reviewer is invented here.

The candidate is **provider-only logout with bounded offline access-JWT replay until expiration plus the explicitly accepted clock tolerance**. Provider logout invalidates the affected refresh/session authority; a future browser implementation must separately clear client state, while an already-issued JWT can still satisfy offline signature/claims validation. This behavior is described in [Supabase sign-out](https://supabase.com/docs/guides/auth/signout) and [session validation guidance](https://supabase.com/docs/guides/auth/sessions#how-to-ensure-an-access-token-jwt-cannot-be-used-after-a-user-signs-out).

| Decision input | Required actual evidence / current limit |
|---|---|
| Actual provider-issued lifetime | **3600 seconds for each of A/B/C**, computed from verified `exp - iat`; see live proof. This is the observed token lifetime, not a Management API setting read. |
| Replay observation | **PASS observation:** same JWT verified offline after local logout 204; matching session row changed from present to absent for each user. No full elapsed lifetime drill or application 200 response. |
| Maximum exposure | Candidate verifier tolerance is 30 seconds: at the post-logout observations, computed residual bounds were **3625/3626/3626 seconds** (`exp + 30 - now`). Maximum from verified `iat` is **3630 seconds**, not a fresh lifetime starting at logout. These are computed ceilings, not elapsed observation; O04/skew and clock policy still require review. |
| User-facing semantics | The future logout flow must immediately clear browser state (browser behavior NOT RUN here); previously copied bearer may remain valid offline. Failed provider logout must be distinguished from confirmed provider invalidation. Browser/session persistence O06 remains separate. |
| Server authority | Future Go Account ACTIVE state/current grants must still be checked on every protected request. This operator checkpoint creates no such store/route and proves none of those controls. |
| Excluded assurance | No immediate stolen-bearer rejection guarantee, no full ST-003 session branch PASS, no provider ban/deletion/recovery proof and no Admin/MFA assurance. |
| Alternative | Require reviewed live session-status capability instead; absence denies, outage fails closed, no positive cache if immediate invalidation is promised. Adds dependency/latency/privilege design; not implemented here. |

Proposed accountable disposition using the linked actual token evidence:

> I, [PO identity/role], approve/revise/reject provider-only logout for the bounded synthetic VS-02A scope. Observed lifetime: [actual verified value and evidence link]. Accepted remaining replay bound and skew: [value/policy]. Limitations, incident restriction and future server-state controls: [disposition]. Independent identity/security reviewer, separation, findings and disposition: [attributable evidence]. This does not authorize Auth Bundle 1; applicable G0–G3 and separate G4 QUAL-002 authority remain required.

All decision identity/date/reviewer/risk-acceptance fields remain **PENDING** until their actual dispositions occur. Even a successful provider JWT/offline replay checkpoint does not approve O05 or close Issue #16 by itself.
