# VS-02A — O04/O05/O06 decision records for accountable review

Prepared 2026-11-01, Asia/Jakarta. Source candidate: `0b80442f8430753d21e187287ab705a95998dcd5`, draft PR #17. **All three records are PROPOSED / NOT APPROVED.** This task authorizes readiness drafting, checks and GitHub delivery only. The PO selected hosted Supabase/ES256 and Frankfurt and approved R1 provider fixtures; those decisions do not approve these policies, independent review or Auth Bundle 1.

Read alongside [executed proof](17-real-token-checkpoint-evidence-2026-11-01.md), [earlier O05 proposal](16-bounded-token-checkpoint-and-o05-decision-2026-11-01.md), [original security profile](11-go-jwt-security-review-2026-11-01.md), [governance path](19-independent-review-and-governance-path-2026-11-01.md) and [authorization review](21-formal-implementation-authorization-review-2026-11-01.md). These later recommendations refine the decision choices; they do not rewrite historical statuses.

## 1. O04 — fixed-trust Go JWT verification profile

| Decision field | Review-ready proposal |
|---|---|
| Record | `VSA-DEC-O04-20261101`, version 1; VSA-O04 remains OPEN |
| Selected already | Hosted Supabase; ES256/P-256 only. No HS256, RS256 or unsigned fallback |
| Proposed dependency | Pin `github.com/golang-jwt/jwt/v5 v5.3.1` plus checksum after fresh module scan in the separately authorized implementation PR; current pin exists only in the operator module |
| Required specialist | Identified human Go/identity-security specialist separate from material implementation authorship; assess actual composed parser, transport/cache design and threat matrix; record qualifications/conflicts and findings |
| Accountable policy decision | PO explicitly adopts/revises scope and numeric risk choices following specialist disposition; a PO self-review is not the specialist's independent approval |
| Current dispositions | Specialist identity/review/link: PENDING; PO identity/decision/link: PENDING; actual approval/effective times: PENDING |

Proposed acceptance contract for the future isolated verifier:

| Profile component | Proposed requirement and measurable acceptance | Evidence now / residual risk |
|---|---|---|
| Trust | Single exact out-of-band HTTPS issuer and derived well-known JWKS; immutable singleton `authenticated` audience; reject token-selected URLs/keys, redirects, duplicate JSON/keys and extra audiences | Actual three-user issuer/audience/signature evidence PASS. Local malformed/trust cases PASS. No deployed app ingress proof |
| Signature/key | Maintained library verifies ES256 with trusted EC/P-256 public point, known bounded kid; no private/symmetric/incompatible JWK or algorithm negotiation; signature and all claims succeed before any principal exists | Actual A/B/C ES256 PASS; 53 local negatives cover selected unsafe classes. No full VSA-T02–T05 HTTP acceptance |
| User claims | Required exact issuer/audience, canonical `sub` and `session_id` UUIDs, integral positive `iat`/`exp`, authenticated provider user context; optional valid integral `nbf`. Recommend require `is_anonymous` explicitly boolean false. No Student/Admin grant from JWT role or metadata, including `app_metadata` | Actual canonical subject/session matches PASS. The checkpoint allows missing `is_anonymous`; absence/null/type rejection in the stricter future profile must be tested, not inferred from the checkpoint |
| Time | Proposed **30-second** leeway and **3600-second maximum issued lifetime**; `0 < exp-iat <= 3600`, `iat <= now+30`, `now < exp+30` (equality rejects), optional `nbf <= now+30` and `nbf < exp`. Trusted synchronized server clock; drift beyond approved tolerance makes identity unready, never expands leeway | Actual A/B/C `exp-iat` = **3600 seconds**; this is observed token lifetime, not a tenant-setting API read. Local boundary tests PASS; clock operations/design review still pending |
| Bounds | JWT 8192 bytes, kid 128 bytes, JWKS 64 KiB / 8 keys, JSON nesting bounded; reject oversized/ambiguous input before expensive work; bounded header ingress limits must be set in adapter contract | Operator verifier tests selected bounds locally. No HTTP resource-exhaustion/load proof |
| Transport | Certificate/hostname validation, fixed destination, redirects prohibited, **2-second total Go fetch deadline**, bounded body/read/close; preserve raw JSON for strict duplicate detection before typed decode | Live operator wrapper used a separate **5-second** request timeout and decoded provider JSON before passing it onward. It does not validate the proposed 2-second transport or end-to-end duplicate-JWKS behavior |
| Cache | Per fixed issuer, atomic complete validated replacement; **5-minute hard TTL**, routine refresh at **4 minutes**, monotonic successful-fetch age. Failed refresh does not extend trust; no expired positive cache | Entire cache is proposed, NOT RUN in the offline operator artifact. Provider edge cache can outlast Go TTL |
| Refresh | One in-flight fetch per issuer; bounded waiters/cancellation, **30-second issuer-wide unknown-kid cooldown**, no unbounded per-kid maps. Fresh complete set without kid → 401; no usable authority/required fetch failed → 503. Known fresh key may work until hard TTL | NOT RUN as application concurrency/outage behavior; require deterministic fake-JWKS/barrier tests before review acceptance |
| Rotation/incident | Known issuer+kid emergency deny overrides cached trust, or disable identity traffic. Validate provider standby propagation/overlap/removal only under separate approved drill. API-secret revocation and JWT-signing-key rotation are different operations | Actual known kid verification PASS; rotation/denylist drills NOT RUN. A local TTL cannot guarantee provider-wide emergency revocation time |
| Errors/authority | Invalid credential → generic 401 without Account lookup; trust outage → 503. Future Account stage checks current binding/ACTIVE/grants per protected request; absent/restricted/roleless → generic 403, DB unavailable → 503. No GET provisioning or positive state/grant cache | No Account schema/route exists. Bundle 1 may expose only a synthetic test adapter; public protected product access waits for later server-state controls |

Acceptance requires the specialist to assess the exact profile (including numeric values), library/checksum/current advisories, missing-claim cases, safe generic errors, Guest isolation, clock readiness, bounded cache/refresh and emergency containment. VSA-T02–T10/T27/T29 and relevant ST-001–003 remain only partially exercised; provider rotation, cache/outage/concurrency, HTTP/no-lookup/fuzz and deployed behavior remain NOT RUN. Reassess material provider/key/config/dependency/code changes; do not carry approval onto an unreviewed candidate.

Primary references: [tagged JWT parser options](https://github.com/golang-jwt/jwt/blob/v5.3.1/parser_option.go), [Supabase signing keys](https://supabase.com/docs/guides/auth/signing-keys), [JWT verification](https://supabase.com/docs/guides/auth/jwts). Current changelog review identified [the announced TLS cipher removal](https://supabase.com/changelog/cbc-tls-ciphers-deprecated); the proposed transport must use supported platform TLS without weakening verification. This is a compatibility review, not a cipher-negotiation drill.

## 2. O05 — recommend provider-only local logout for the bounded proof

| Decision field | Review-ready proposal |
|---|---|
| Record | `VSA-DEC-O05-20261101`, version 1; carries forward `VSA-O05-PROVIDER-LOGOUT-PROPOSAL-20261101`; VSA-O05 remains OPEN |
| Recommendation | Explicit **provider-only local-session logout** for isolated synthetic proof; clear client memory independently. No promise of immediate access-JWT revocation |
| Observed fact | Three real JWT lifetimes were **3600 seconds**; each local logout returned 204 and its signed session row disappeared; the same JWT immediately afterward still passed offline verification |
| Proposed policy | **30-second verifier tolerance**, subject to O04 review. No change to tenant lifetime/keys is authorized |
| Required specialist | Independent human identity/security specialist assesses replay, failed logout, refresh lifetime, local restriction, incident response and scope; no invented review identity |
| Accountable PO choice | Explicitly accept/revise/reject this residual replay risk for the bounded synthetic proof; PO risk acceptance remains separate from specialist approval |
| Current dispositions | Specialist: PENDING; PO: PENDING; approval/effective times: PENDING; **PROPOSED / NOT APPROVED** |

For a currently valid stolen bearer, candidate residual offline acceptance is `max(0, exp + 30 - serverNow)`. At the actual post-logout checks, remaining time to `exp` was 3595/3596/3596 seconds; adding proposed tolerance gives computed 3625/3626/3626-second bounds. The maximum **3630 seconds is measured from verified issuance**, not a new lifetime beginning at logout. Clock validity, key trust and all future Account/state checks remain preconditions. These arithmetic bounds are not elapsed-hour observations.

The bound applies to a **fixed already-issued access JWT**, not the lifetime of a provider refresh session. A stolen usable refresh credential may renew access until that authority is invalidated; the 3600/3630-second calculation is not a bound on that separate compromise. R1 did not exchange or replay refresh tokens. Active-page refresh remains the separate O06 proposal below.

Proposed acceptance criteria:

1. Choose `scope=local` explicitly. Other sessions/devices are unaffected; global logout is a separate scope decision. Browser memory/cache clears immediately even when provider logout fails, while UI distinguishes confirmed provider sign-out from unconfirmed server invalidation.
2. A confirmed local logout must prevent further renewal of that session. Session deletion was observed; actual refresh-reuse rejection and browser cleanup were **NOT RUN**, because R1 discarded refresh tokens. Test the approved future refresh/logout flow after separate authority; do not run it again using deleted fixture passwords.
3. Do not claim provider ban/user deletion, `/user` or `getUser` enforces immediate offline bearer denial. Those behaviors were not tested. Future Go Account restriction must deny the next protected request based on live server state; that capability is not implemented by this task or Bundle 1.
4. No Admin, production, real learner or official mutation assurance follows from this bounded risk choice. New requirements for immediate token revocation, privilege, persistent sessions or longer lifetimes force a new security disposition before expansion. If containment controls are unavailable, stop protected identity traffic rather than assume logout invalidates a copied JWT.
5. Retain tests for logout failure, races/in-flight requests, refresh/logout ordering, deterministic expiry/skew and safe Guest navigation; actual application endpoint and browser acceptance remain future work. Even live session validation cannot undo an already-authorized in-flight request.

Alternative: reviewed server-only live session validation bound to verified issuer/sub/session, absence → 401, authority failure → 503, no positive cache if promising immediate invalidation. This adds privilege, latency, outage and transaction boundaries and is not recommended for this bounded proof unless the PO requires immediate rejection. No direct managed-Auth DB capability is authorized here.

[Supabase sign-out](https://supabase.com/docs/guides/auth/signout) and [session validation](https://supabase.com/docs/guides/auth/sessions#how-to-ensure-an-access-token-jwt-cannot-be-used-after-a-user-signs-out) support the distinction between provider session invalidation and offline JWT validation. Full ST-003 session acceptance is not claimed.

## 3. O06 — existing users, nonpublic Accounts and memory-only browser sessions

| Decision field | Review-ready proposal |
|---|---|
| Record | `VSA-DEC-O06-20261101`, version 1; VSA-O06 remains OPEN |
| Recommendation | Existing-user-only synthetic email/password login; nonpublic synthetic Account provisioning; browser session material only in memory |
| Approved already | R1 created only provider Auth users; signup and anonymous disabled; reset/delete owner accepted. **No application Accounts or grants were created** |
| Required reviewers | PO decides bounded UX/onboarding; named frontend/identity owner assesses lifecycle/races/storage; independent identity/security specialist reviews boundary; O07 data/Go review is additionally required before provisioning/schema implementation |
| Current dispositions | PO: PENDING; frontend/identity owner: PENDING; independent security: PENDING; O07: OPEN; approval/effective times: PENDING |

Proposed acceptance criteria:

1. No registration, invitation, account linking/email matching, password-recovery mail or anonymous flow. Auth signup remains OFF. Go receives only access bearer JWTs, never provider passwords, refresh tokens or Admin secrets. Hosted traffic uses verified TLS; existing loopback Guest preview stays credential-free.
2. Nonpublic Account provisioning is a separate future capability: verify the trusted issuer/subject, atomically create Account + ACTIVE state + binding + **Student-only** grant + minimized audit/operation record under O07. No Admin grant, runtime provisioner privilege or broad managed-Auth access. Idempotent retries preserve Account/state/grants and cannot resurrect restricted/deleted identities. Provider creation is not Account creation.
3. `GET /api/v1/me` is read-only. Missing binding denies generically (403); repeated GET never provisions, grants, resets state or mutates audit/business authority. No client-supplied account ID or provider metadata supplies application roles.
4. Future pinned SDK uses `persistSession: false`, `detectSessionInUrl: false`, and explicit in-memory access **and refresh** custody. Preserve the existing recommendation for automatic refresh only while the active page lives; it is an O06 proposal, not behavior tested by the operator's one-shot login. No localStorage, sessionStorage, IndexedDB, service-worker cache, cookies, URL, analytics or credential traces. SDK configuration alone is insufficient: test all storage and refresh paths.
5. Reload/new tab requires sign-in. Reload discards memory but does **not** prove provider logout; an unreachable refresh token can leave a provider session behind. Background timers, provider defaults and cross-tab synchronization must not silently restore persistence. Define/test per-tab scope and cleanup separately from other device sessions. Memory-only storage does not eliminate XSS token theft or the O05 replay window.
6. Clear principal, protected data and request generation on logout/401/account change. Abort or ignore stale `/me`/refresh responses from A after switching to B; 403 shows generic restriction, 503 unavailable without cached authority. At most one reviewed refresh retry for 401; no blind retry of 403 or privileged mutations. Use only validated local-relative return destinations; reject open redirects and URL token imports.
7. Test A/B isolation, reload/tab behavior, concurrent refresh/logout, storage/bundle redaction, safe errors, Guest continuity, keyboard/focus and relevant assistive technology. No Auth browser flow was run in the checkpoint. R1 fixture passwords were deleted; any future credential reset or new provider operation needs explicit resource-specific authority.

Sources: [original React design](02-identity-and-authorization-design.md#9-react-authentication-design), [Account provisioning design](03-account-schema-and-lifecycle-design.md#2-provisioning-and-identity-binding), [Supabase client initialization](https://supabase.com/docs/reference/javascript/initializing). O06 recommendation does not authorize SDK installation, UI implementation, schema/grant changes or public signup.

## 4. Separate attributable dispositions required

For **each** record above, the eventual decision must identify exact record version/candidate/evidence, actor/role/qualifications/conflicts, approve/revise/reject outcome, accepted residuals/exclusions, unresolved findings and conditions, actual UTC decision time and review/expiry triggers. PO product/risk disposition and specialist technical disposition occupy separate records even if delivered together. Actor fields remain **PENDING** here; no checkbox, R1 response, CI success or documentation merge supplies them.

After these decisions and the predecessor/security/environment gates are satisfied, the PO may separately review [QUAL-002 authorization](21-formal-implementation-authorization-review-2026-11-01.md). No decision in this document currently supplies it.
