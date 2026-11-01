# VS-02A — Scope and Dependency Assessment

| Metadata | Value |
|---|---|
| Package / version | VS-02A readiness review / v0.1.0 |
| Prepared | 2026-11-01, Asia/Jakarta |
| Status | **PROPOSED DESIGN; implementation BLOCKED; PO review pending** |
| Authority | Current PO task authorizes documentation, architecture and security readiness review only |
| Repository / branch | `sipratama/ai-learning-platform` / `docs/vs-02a-identity-readiness` |
| Reviewed HEAD | `4110eb0d37684bae9e39b8639fd0b3fcca7d487d` |

Start here; continue with [identity](02-identity-and-authorization-design.md), [schema/lifecycle](03-account-schema-and-lifecycle-design.md), [threats/tests](04-threat-model-and-security-test-matrix.md), [environment/bundles](05-environment-and-implementation-plan.md), and [decision/blockers/verification](06-readiness-decision-and-open-questions.md). Proposed technical choices in this package are reviewable recommendations, not newly approved decisions or implementation instructions effective today.

## 1. Repository preflight and evidence limits

Read-only inspection found the expected origin `https://github.com/sipratama/ai-learning-platform.git`, branch and full HEAD above. Initial `git status --short` was empty. Local `origin/main` and live `git ls-remote origin refs/heads/main` both returned the same full SHA. No fetch, checkout, branch creation or other Git mutation was used. No applicable `AGENTS.md` was found in this repository or its ancestor directories.

[PR #10](https://github.com/sipratama/ai-learning-platform/pull/10) was independently read through the GitHub connector: merged to `main` at `2026-11-01T00:37:16Z`, merge commit equals reviewed HEAD; head `f53e9536a9f424cc616f82334c8dbecf88b1e59f`. Local merge history confirms it. This proves the Docker preview merge; it supplies no VS-01A acceptance or VS-02A permission. Latest-main verification is a point-in-time observation, to be repeated before any subsequent authorized work.

| Inspected implementation | Finding and consequence |
|---|---|
| [Go composition](../../apps/api/cmd/api/main.go), [HTTP wrapper](../../apps/api/internal/platform/httpserver/handler.go), [server](../../apps/api/internal/platform/httpserver/server.go), [public router](../../apps/api/internal/platform/httpserver/public.go) | One Go API; `/healthz`, five public GET patterns and fixture media. Validated request IDs, no-store, nosniff, panic containment, redacted `slog`, HTTP time/header limits and bounded public-read concurrency. **No identity middleware, JWT library, Account database, role store or protected route exists.** Preserve the existing wrapper when adding a protected dispatch path later. |
| [Public domain/service](../../apps/api/internal/publiclearning/service.go), [API client](../../apps/web/src/lib/api/public.ts) | Visibility-filtered read DTOs and signed pagination belong to the Guest contract. They are not an authentication or authorization adapter. |
| [React routes](../../apps/web/src/app/App.tsx), [entry](../../apps/web/src/main.tsx), [dependencies](../../apps/web/package.json) | Public catalog, Path/Course details, free reader and unavailable route only. No login/logout, Supabase client dependency, account provider or protected workspace. Existing client API is public. |
| [Compose](../../compose.local.yaml), [API image](../../apps/api/Dockerfile.local), [web image](../../apps/web/Dockerfile.local), [Nginx](../../apps/web/nginx.local.conf) | Two local-only containers; loopback web port 8088; API internal; same-origin proxy; synthetic fixture; no DB/provider credentials or persistent volumes. Nginx's default access log includes request URLs: future identity ingress must avoid sensitive URL logging. |
| [Configuration guards](../../apps/api/internal/platform/config/config.go), [development composition](../../apps/api/cmd/api/fixture_dev.go), [standard composition](../../apps/api/cmd/api/fixture_prod.go), [boundary check](../../scripts/check-fixture-boundary.sh) | Fixture opt-in only in local/test; tagged artifact rejects staging/production even with fixture disabled; standard build excludes fixture adapter. These guards remain required. |
| [CI](../../.github/workflows/ci.yml), [HTTP tests](../../apps/api/internal/platform/httpserver/public_fixture_test.go), [browser configs](../../apps/web/playwright.integration.config.ts), [Docker suite](../../apps/web/playwright.local.config.ts) | Go standard/tagged vet/test/race/build and fixture checks; Vitest, mocked Playwright, real Go+React Playwright; separate eight-case Docker suite. CI currently runs the first two browser configurations, not Docker. No PostgreSQL, identity, rotation or lifecycle integration suite exists. These are inspected capabilities, not tests executed in this review. |

The [local-preview record](../local-preview/README.md) and [feature inventory](../product-status/2026-11-01-feature-inventory.md) report earlier runtime results and limitations. They are historical evidence, not fresh runs here. This review creates no Auth tenant, accounts, keys, database, migration, image, runtime test result or deployment.

## 2. Source authority and apparent conflicts

Use [DP-06's forward/reverse lookup rule](../DP-06/06-execution-traceability-and-handoff-register.md#1-authority-and-lookup-rule): decisions → domain RULE/AC → architecture MOD/TX → API/SEC → FT/ST → bounded slice. Apply only documented later dispositions to the exact subjects they address. [Decision Registry §9](../DP-01/03-decision-registry.md#9-decision-relations--change-control) requires material changes to have approved change records, impact analysis and reviewer sign-off; there is no blanket “newest file wins” rule.

| Apparent conflict | Documented resolution |
|---|---|
| Original DP metadata says Draft/Not Approved; later addenda say conditional approval | [Registry §16](../DP-01/03-decision-registry.md#16-subsequent-product-owner-ag-06-disposition-2026-10-31-administrative-addendum) and [Open Decisions §14](../DP-01/04-open-decisions-register.md#14-subsequent-ag-06-disposition-2026-10-31-administrative-addendum) record later AG-06 conditional approval. AG-01 is approved for DP-01 v0.1.2; AG-02 for DP-02 v0.1.1 and AG-03–06 for their six-document v0.1.0 snapshots are conditionally approved. Preserve original snapshot metadata. Planning approval is distinct from slice permission. |
| DP-02 refers to FA-006/007/008 as Open | Later [approved B/B1 dispositions](../DP-01/04-open-decisions-register.md#1-open-decisions-overview) control those topics; do not invent retention or numeric service policy from older wording. |
| VS-01A backlog says planned/unimplemented; current code and merged PRs exist | [Closure record](../DP-06/07-vs-01a-formal-closure-and-acceptance.md) and [handoff §5](../DP-06/06-execution-traceability-and-handoff-register.md#5-vs-01a-accepted-implementation-and-closure-preparation-2026-10-31-addendum) document later bounded implementation and technical evidence, while formal closure remains pending. |
| Guest walkthrough was satisfactory; tests and merges succeeded | Feedback supports continued planning only. [VS01A-CLOSE-001 decision fields](../DP-06/07-vs-01a-formal-closure-and-acceptance.md#51-decision-fields-for-vs01a-close-001) still lack independent human dispositions and final PO DD-001 decision. PR #8 remediation and PR #10 preview do not supply these signatures. |
| GOV-AI-001 discusses alternate acceptance | [Proposal §U and final status](../DP-01/05-gov-ai-001-ai-assisted-technical-acceptance-proposal.md#u-follow-up-documentation-only-after-valid-approval) explicitly preserve existing rules: **PROPOSED / NOT EFFECTIVE; AUTHORITY CLARIFICATION REQUIRED**. No adoption/effective date is present. Even its proposed framework treats identity as at least Tier B, requiring human specialist review. |
| VS-02A cites privacy AC and ST-005/006, but cleanup/enrollment/Attempts are later slices | Implement identity/state/owner denial contracts now in bounded tests; do not implement later resources merely to obtain full-scenario PASS. The [coverage dispositions](04-threat-model-and-security-test-matrix.md#5-coverage-and-hard-gates) explicitly preserve deferred coverage. |

No governance owner files are modified. Historical EG-001–003 remain provenance limitations under AG-01-EG-B; D-005's provisional historical mapping is not the sole basis for selecting Supabase. G3-001 and the approved prospective technical direction supply that constraint.

## 3. Smallest safe VS-02A boundary

The [VS-02A acceptance row](../DP-06/03-vertical-slice-backlog-and-acceptance-contracts.md#2-approved-boundary-increments--all-authorization-pending) and [EXEC-002](../DP-06/06-execution-traceability-and-handoff-register.md#2-bidirectional-slice-traceability) are authoritative scope references.

| Required outcome | Proposed bounded deliverable | Source → verification |
|---|---|---|
| Supabase authentication | Login/logout for pre-created synthetic users; trusted environment configuration; no public registration required for this bounded proof | D-011, G3-001; FT-005; VSA-T01/T24 |
| Verified tokens | Go signature, issuer, audience, time and key validation; explicit supported setup; fail closed | SEC-001–004/023; ST-001–003; VSA-T02–T10 |
| Internal identity | Durable Account plus unique external binding; idempotent **nonpublic explicit provisioning**, read-only API-006; missing bindings denied | MOD-001, ENT-001/002; FT-005; VSA-T11/T12 |
| Roles and ownership | Go-owned Student and separately granted Admin; `/me` derived from verified principal; reusable owner checks | D-011/025, RULE-024, AC-039/040; SEC-006–008; VSA-T14–T16 |
| Trusted bootstrap | One authorized, audited nonpublic initial Admin grant with durable replay protection | Q-006, RULE-026, AC-041, TX-020; FT-020; VSA-T17–T19 |
| Access-state guard | ACTIVE required on protected reads/commands; synthetic suspension/deletion states and transactional race proof | FA-006 B, AC-045/046 **guard only**, TX-016 boundary; VSA-T13/T20–T22/T33 |
| Minimal observability | Safe auth decisions, key/dependency health and durable bootstrap/state audit; scoped operator evidence access | MOD-011, TX-018, SEC-021; VSA-T23/T28 |
| React account state | Loading, authenticated, unauthenticated, restricted and unavailable states; server-returned role display; cancellable requests and logout clearing | JRN-005, UX-007/014, API-006; VSA-T24–T26 |

`VSA-*` identifiers are package-local proposals, defined in this package, not new DP requirement or decision allocations. Every test is planned, not executed.

## 4. Boundaries with subsequent increments

| Increment | Included later; excluded here |
|---|---|
| VS-02B | Independent Path participation, Course enrollment, eligible published pin and intent/idempotency contracts. Login/browsing must create none of these. |
| VS-05A | Admin CMS draft/validate/preview/publish routes and UI; content persistence. VS-02A proves role checks with test adapters and bootstrap, not a fake publishing endpoint. |
| VS-06A | Public own-deletion acceptance API-036, case/status UI, durable cleanup/retry/provider removal, suppression ledger and isolated restore proof; API-038 audit browsing as scoped there. VS-02A supplies an access-guard capability, not an operational deletion service. |
| VS-03A / VS-04A | Workspace, official progress/evidence, assessment/grade/completion. Owner tests here use synthetic test-only resources; no substitute product endpoints or learning tables. |

Only synthetic Student/Admin identities and isolated credentials are eligible before VS-06A; real personal data, production publishing, enrollment, official progress, grading, full deletion and deployment remain outside this task. A future public signup/provisioning flow requires a reviewed command/API and policy decision; GET `/me` must not create business state implicitly.

## 5. Dependencies and governance finding

**Implementation is BLOCKED.** VS-01A formal predecessor clearance is not satisfied. Its closure record names implementation `339344e654ea77817ecddf05094d1d55b7bf3865`; later changes through PR #8/#10 must be assessed explicitly in any eventual exact-candidate closure, without replacing that historical record. GOV-AI-001 adoption is not a shortcut or a prerequisite if the existing human-review route is followed.

GAP-001 (content revocation/listing), GAP-002 (Path leave/migration), GAP-003 (evidence compatibility/abandonment) and GAP-007 (learning prerequisite actions) do **not directly block this bounded identity scope**. They stay Open and their branches remain excluded. Account suspension is not GAP-001 content-access revocation; its authority and reversal rules still need explicit design disposition. Neither infrastructure choice nor synthetic fixtures resolve a GAP.

Independent DR-001 verification, specialist design review, environment evidence, trusted bootstrap authorization and explicit QUAL-002 PO authorization are still required. [Document 06](06-readiness-decision-and-open-questions.md) assigns each unresolved item an accountable role and required disposition; no actual reviewer appointment or approval is implied.
