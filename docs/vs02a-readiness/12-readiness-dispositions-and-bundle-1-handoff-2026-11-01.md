# VS-02A — Readiness dispositions and Bundle 1 handoff

Date: 2026-11-01 Asia/Jakarta. Source baseline: `91080f45e1aba38316eeecca6eeba3f618bd7f3a`. **Additive technical assessment; implementation BLOCKED.** This task authorizes readiness preparation and GitHub delivery only. No human reviewer, signature, effective date or implementation authority is inferred.

## 1. Source conflicts and approved scope

| Historical wording / apparent contradiction | Narrow later disposition and present interpretation |
|---|---|
| [Original register](06-readiness-decision-and-open-questions.md) says all O items open; hosted/local and algorithm undecided in [environment proposal](05-environment-and-implementation-plan.md) | [VSA-DEC-001](08-po-supabase-hosted-es256-platform-selection-2026-11-01.md), merged by [PR #15](https://github.com/sipratama/ai-learning-platform/pull/15), resolves hosted Supabase and ES256/P-256 selection only. Operational O03 and remaining O04 are open. |
| Original readiness says no PO predecessor decision; Issue #13 closed/checked and PR #14 merged | [PO comment](https://github.com/sipratama/ai-learning-platform/issues/13#issuecomment-6551979025) approves exact candidate `d12727edc92170dc0bc3c27060786ca37a504b0b` **subject to mandatory independent review**. GitHub PR #14 and #15 review submissions were empty at inspection. This supports conditional PO approval, not independent review or formal closure. [Closure ledger](../DP-06/07-vs-01a-formal-closure-and-acceptance.md) remains PENDING SIGN-OFF; [later candidate review](../DP-06/08-vs-01a-current-main-closure-candidate-review-2026-11-01.md) preserves the conditions. |
| Earlier documents prohibit Git writes in their original tasks | Current explicit request delegates this branch, commit, push, PR and Issue #16 comment under DEL-001. It grants neither PR merge nor Auth implementation. Historical authority snapshots remain intact. |
| Original DP metadata says AG-06 Not Approved | [Later registry addendum](../DP-01/03-decision-registry.md#16-subsequent-product-owner-ag-06-disposition-2026-10-31-administrative-addendum) conditionally approves the named planning snapshots. Conditional planning approval does not satisfy independent review, DR-001 or QUAL-002. |
| GOV-AI-001 offers alternate acceptance | [Proposal](../DP-01/05-gov-ai-001-ai-assisted-technical-acceptance-proposal.md) remains PROPOSED / NOT EFFECTIVE. No amendment is adopted here; use current human-review requirements. |

No blanket latest-document override is applied. Existing decision fields and historical evidence remain unchanged; this addendum addresses only the stated subjects.

## 2. O01–O14 current disposition

No full VSA-O item is closed by this task. Completed preparation is distinguished from missing execution/approval.

| Item | Actual progress / current status | Required next disposition and accountable role |
|---|---|---|
| O01 | **OPEN / governance blocker.** Conditional PO approval verified; independent predecessor acceptance not evidenced. | PO appoints qualified independent domain/security/QA reviewer(s); review exact candidate/deltas and residuals, preserve evidence, then update VS01A-CLOSE-001 with final DD-001 decision. |
| O02 | **OPEN / governance blocker.** Independent VS-02A review and scope authority absent. This AI assessment is preparation only. | Independent human identity/security specialist reviews profile/threats; complete HAND-001/DR-001; PO separately authorizes after applicable gates. |
| O03 | **PARTIALLY SELECTED / operationally BLOCKED.** Hosted provider approved; project inventory inaccessible, no verified environment. MCP suitability and safe operator checklist prepared. | Authorized operator connects, identifies isolated project or obtains explicit org/region/budget/create approval; records actual Auth, signer, JWKS, issuer/audience, roster/DB/CI evidence. |
| O04 | **PARTIALLY SELECTED / OPEN.** ES256/P-256 approved; maintained library candidate/version compatibility and detailed cache/time/failure recommendations prepared in [security review](11-go-jwt-security-review-2026-11-01.md). | Identity/Go security reviewer approves exact dependency, strict parsing, TTL/skew/lifetime/size/refresh/outage/emergency policy against actual tenant; fresh advisory review before dependency addition. |
| O05 | **OPEN / Bundle 1 blocker.** Offline replay versus live session-validation tradeoff documented, neither selected. | PO + independent specialist choose semantics, replay budget, logout scope, provider ban/delete response and live authority contract if required. |
| O06 | **OPEN.** Candidate remains existing synthetic users, nonpublic Student provisioning, read-only `/me`, memory-only sessions and relogin on reload. | PO + frontend/identity reviewer explicitly accept/revise before Bundles 2/6. No public signup, hidden GET provisioning or persistence approval inferred. |
| O07 | **OPEN.** Private PostgreSQL schema, unique binding, atomic operation/audit and capability proposal reviewed; no DB inspected or migration run. | Data/Go/security reviewers choose DB major, migration runner, grant/lock/retry/recovery contracts and authorize separately. Future real PostgreSQL constraint/race/rollback evidence required. |
| O08 | **OPEN / later gate.** Proposed SUSPENDED semantics remain unapproved. | PO + identity owner define actor/reason/reinstatement/revision policy before Bundle 5; no state-management command now. Unknown/restricted states deny. |
| O09 | **OPEN / later gate.** No Admin target, bootstrap operator, authority, assurance or recovery approved. | PO/operator/security specialist separately authorize a known synthetic target and one-time audited operation before Bundle 4. No bootstrap in this task or Bundle 1. |
| O10 | **OPEN / later gate.** Protected audit minimization/retention/access proposal remains candidate. | Security/privacy/data/operations owners approve accountability links, evidence access/expiry and 180-day executor/hold policy before durable privileged actions. |
| O11 | **OPEN / real-data prohibition remains.** Synthetic-only boundary maintained; no deletion/restore proof. | Privacy/data/operations + PO resolve VS-06A deletion, suppression, provider reconciliation and 30/30-day active/backup proof before any real Student/Admin data or production publishing. |
| O12 | **OPEN / acceptance blocker.** Existing Guest checks and probe guard checks are separate evidence; VSA-T01–T33 remain NOT RUN. | QA/implementation owners execute actual local/PostgreSQL/Supabase/browser cases after their authorizations; independent reviewer dispositions before VS-02A DD-001 acceptance. |
| O13 | **OPEN / nonblocking if current process followed.** No GOV-AI-001 adoption. | Human governance authority may decide separately; no waiver here. |
| O14 | **OPEN / predecessor follow-up.** Fresh checks are recorded separately; they do not resolve manual accessibility, artifact retention or target-platform review. | Appointed QA/security evidence owner reviews current dependency findings, preserves prior hosted bytes/digests before expiry, and supplies exact-candidate human disposition. Historical evidence/advisory counts are not relabeled current. |

The existing [schema/lifecycle proposal](03-account-schema-and-lifecycle-design.md) still requires separate migrator, provisioner and bootstrap capabilities; ordinary Go runtime must not be database owner, `postgres`, `service_role` or BYPASSRLS. Keep `identity` outside exposed Data API schemas and deny browser `anon`/`authenticated` access. These are review recommendations; no privileges were verified or changed.

## 3. Gates and next scope

| Gate from [decision pack](07-product-owner-decision-pack-and-implementation-gate-2026-11-01.md) | Present result |
|---|---|
| G0 predecessor | **OPEN** — conditional PO approval lacks required independent completion |
| G1 VS-02A design/security | **OPEN** — independent reviewer/HAND-001/DR-001 disposition absent |
| G2 isolated environment | **BLOCKED** — connection and project evidence absent |
| G3 verifier/session decisions | **OPEN** — O04 defaults/library and O05 replay policy unapproved |
| G4 implementation authority | **NOT GRANTED** — separate explicit scoped QUAL-002 approval required after G0–G3 |

There is a sequencing ambiguity in the earlier G1 wording that mentions QUAL-002 authority as well as G4. For this handoff, G1 supplies reviewed design/readiness evidence and G4 is the final separate implementation decision after G0–G3, consistent with the earlier pack's explicit G4 condition. This is a clarification of evidence ordering, not a new governance waiver.

**Exact next action:** authenticate the official Supabase connection for permitted read-only inventory, identify/approve the isolated target, then run the public-JWKS probe and collect trusted synthetic-token evidence without retaining tokens. If no eligible target exists, obtain explicit organization/ownership, available region and billing/project-creation approval first. In parallel, PO can appoint independent reviewers and resolve O05/O06; these do not depend on project creation.

**Only after G0–G4:** create `feat/vs-02a-token-verification` from then-current main. Proposed Bundle 1 contains strict fixed-trust configuration, the reviewed pinned Go JOSE/JWT dependency, bounded JWKS transport/cache/clock/rotation/outage handling, a verified external-identity type, and protected adapter tests. Include deterministic fake-JWKS unit/HTTP/fuzz/concurrency tests for VSA-T02–T10/T27/T29, real-provider token/key evidence and Guest regression.

Keep protected product routes unexposed until server-side Account authorization exists in later bundles. No Account migration/provisioning, `/me` data capability, browser login UI, Student/Admin grants, bootstrap, public signup, production deployment or real data belongs to Bundle 1. A synthetic test adapter is not a public authenticated-user bypass. Any required live-session capability chosen under O05 must be separately designed/reviewed before implementation, including privilege/DB implications.

Commit/push and opening this readiness PR do not close Issue #16, authorize Bundle 1 or permit merge. QUAL-004 merge approval and QUAL-005 deployment remain separate under the [delivery rules](../DP-06/04-secure-delivery-and-change-management.md).
