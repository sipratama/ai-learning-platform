# DP-01 — Open Decisions Register

| Metadata | Nilai |
|---|---|
| Package | DP-01 — Traceable Product Baseline |
| Artifact | Open Decisions Register |
| Version | 0.1.7 — subsequent administrative governance synchronization |
| Status | **Approved product baseline v0.1.2; v0.1.3–v0.1.7 record later governance decisions** |
| Approval gate | AG-01 — **Approved for v0.1.2 by current Product Owner approval** |
| Revision boundary | v0.1.2 product substance approved; v0.1.3–v0.1.6 record prior governance; v0.1.7 records later AG-05 conditional approval without changing that substance |
| Prepared | 2026-10-31 |

> **Rule:** FA-004 B, FA-005 B, FA-006 B, FA-006-B1 B, FA-007 B and FA-008 B are current explicit Product Owner approvals. AG-02/AG-03/AG-04/AG-05 are conditionally approved for their named snapshots; GAP-001/002/003/007 remain Open and dependent implementation unauthorized. v0.1.7 is a later administrative record, not a change to DP-01 v0.1.2 product substance or historical evidence.

## 1. Open decisions overview

| ID | Priority | Topic | Blocking approval | State |
|---|---|---|---|---|
| FA-004 | P1 | Learning Path Participation | AG-02 contract review | **Approved — Option B** |
| FA-005 | P1 | Publishing & Historical Access | AG-02 contract review | **Approved — Option B** |
| FA-006 | P1 | Retention & Account Deletion Parameters | AG-03; consistency AG-04 | **Approved — Option B** |
| FA-006-B1 | P1 | Student-linked learning-record disposition | AG-04 privacy consistency | **Approved — Option B** |
| FA-007 | P1 | UX, Performance & Beta Thresholds | AG-05 | **Approved — Option B** |
| FA-008 | P1 | Infrastructure & Operational Parameters | AG-04 | **Approved — Option B** |

FA-004/005 supplied DP-02 inputs; FA-006 B supplied DP-03 privacy input; FA-006-B1 B and FA-008 B supplied DP-04 inputs. FA-007 B supplies DP-05 quality targets. Only GAP-001/002/003/007 remain open here; their dependent implementation remains unauthorized.

## 2. FA-004 — Learning Path Participation

**Resolved decision — Option B:** Path participation and Course enrollment are independent. Joining a Path does not enroll all member Courses. Course completion is global and reusable; Path progress derives from completion of member Courses. Official Path participation requires Student authentication.

**Already approved invariants:** course enrollment is intent-based (G2-001A); browsing alone is not enrollment; same course can belong to multiple paths (D-012); canonical course completion is reused across paths (Q-004).

**Historical candidate models:** aggregated progress without participation; explicit independent Path participation; hybrid follow behavior. The Product Owner selected independent Path and Course participation (Option B) after DP-01 v0.1.2.

**DP-02 contract work:** define Path joining, progress and Student UX without duplicating Course completion. No automatic enrollment of member Courses.

**Affected:** DP-02 Domain Rules, Student UX, DP-03 model, DP-04 API, DP-05 verification.

**Decision status:** **Approved — Option B** by the Product Owner after v0.1.2. **AG-02** was later conditionally approved for DP-02 v0.1.1; its named GAPs remain Open.

## 3. FA-005 — Publishing, Archiving & Historical Access

**Resolved decision — Option B:** Existing enrolled Students stay on their pinned published Course version; new enrollments use the latest eligible published version. Publishing does not silently migrate existing enrollments. Historical progress, completion and passing evidence remain protected. MVP migration is manual, Admin-controlled, explicitly authorized and audited, with appropriate learner communication. No automatic curriculum migration engine. Historical content retention depends on FA-006.

**Already approved:** hybrid editor with draft/preview/publish/revisions (D-015); version-aware/prospective completion (Q-003, FA-001); historical achievements preserved.

**DP-02 contract work:** describe version pinning, publishing and controlled migration. Detailed unpublish/archive visibility, exceptional revocation and historical retention are not established by Option B; do not silently choose them. Retention/deletion depends on FA-006.

**Affected:** DP-02 Domain Rules/UX, DP-03 data model, DP-04 CMS/API/security, DP-05 tests.

**Decision status:** **Approved — Option B** by the Product Owner after v0.1.2. **AG-02** was later conditionally approved for DP-02 v0.1.1; unresolved policy details must be flagged rather than invented.

## 4. FA-006 — Data Retention & Account Deletion Parameters

**Resolved decision — Option B, Lifecycle-Based Deletion & Data Minimization:** A valid authenticated Student deletion request starts a controlled account-deletion lifecycle. Access is invalidated after the request is accepted. Personal profile data, notes and bookmarks are deleted. Student-linked learning data are deleted or irreversibly de-identified according to applicable policy. Protection of historical learning evidence while an account remains active does not override account deletion rights. Security audit retention is **180 days** unless a legitimate legal obligation requires otherwise. The active-data deletion target is **no later than 30 days after a valid request**; backup expiry target is **no later than 30 days**. Truly anonymous aggregates may be retained. No self-service recovery is allowed after effective deletion begins. Processing is idempotent, auditable and retry-safe; restoring backups must not silently resurrect deleted personal data. These targets are Product Owner policy, not asserted statutory deadlines.

**Architecture contract work:** DP-03 defines data classification, deletion phases, access invalidation, cross-service cleanup, irreversible de-identification, nonpersonal audit evidence and restore safeguards. It does not invent indefinite exceptions, unapproved recovery guarantees or a physical schema.

**Affected:** DP-03 database/data lifecycle; DP-04 operations/recovery/security; DP-05 privacy tests.

**Decision status:** **Approved — Option B** by current explicit Product Owner approval. **AG-03** was subsequently conditionally approved for DP-03 v0.1.0; consistency with AG-04 remains required.

## 5. FA-007 — UX, Performance & Beta Thresholds

**Resolved decision — Option B, Balanced Quality Beta:** Primary usability task, Guest learning journey and Student enrollment-to-assessment journey success are each **≥90%**, with no critical usability blocker at beta and responsive mobile/desktop. WCAG 2.2 AA is the target for critical journeys. Frontend targets: LCP p75 **≤2.5 seconds**, INP p75 **≤200 milliseconds**, CLS p75 **≤0.1**. API targets: read p95 **≤500 milliseconds**, write p95 **≤1,000 milliseconds**, HTTP 5xx **<1%**, initial load test **50 concurrent virtual users**. All critical E2E journeys and critical business rules require evidence; no unresolved critical integrity defect, forged/lost/duplicated verified assessment evidence, cross-Student private access, privilege escalation or unpublished answer exposure. Deletion and restore safeguards require verification. No unresolved Critical/High security blocker, and no ordinary exception for unauthorized access, privilege escalation or personal-data exposure. Noncritical performance/UX deviations may receive documented authorized limited-beta risk acceptance; security and data-integrity hard gates cannot. These are beta acceptance targets, not commercial SLAs or test results. Full wording is in the [Decision Registry §14](03-decision-registry.md).

**Verification design work:** DP-05 defines representative sampling, field/lab measurement, workload/dataset assumptions, manual accessibility review, test evidence and Go/No-Go process without claiming an executed result.

**Affected:** DP-02 UX, DP-04 operational requirements, DP-05 QA and release gates.

**Decision status:** **Approved — Option B** by current explicit Product Owner approval. AG-05 was Not Approved at the v0.1.6 record; its later conditional approval is in §13. Beta release still requires separate evidence and authorization.

## 6. FA-008 — Infrastructure & Operational Parameters

**Resolved decision — Option B, Balanced Production MVP:** INF-01–INF-14 in the [Decision Registry](03-decision-registry.md) approve managed static frontend hosting/CDN, managed Go containers, Supabase PostgreSQL/Auth/Storage, isolated Local/Staging/Production, GitHub Actions with production approval, managed secrets, structured observability, lightweight worker capability, FA-006-compatible backup/restore, best-effort availability without commercial SLA, pragmatic horizontal scaling and budget/cost controls. Singapore is only a conditional preferred region pending legal and latency validation. No specific Go host, paid tier, instance size, numeric RPO/RTO or commercial SLA is approved.

**Operational contract work:** DP-04 must define delivery, access, rollback, restore verification and cost-monitoring boundaries. A managed backup service alone does not prove FA-006 B or FA-006-B1 B compliance. FA-007 still owns quantitative performance and beta thresholds.

**Affected:** DP-04 operations/security, DP-03 storage/recovery assumptions, DP-05 performance/reliability.

**Decision status:** **Approved — Option B** by current explicit Product Owner approval. AG-04 was Not Approved at the v0.1.5 record; its later conditional approval is recorded in §12.

## 7. Open decision workflow

For each FA item:

1. Confirm the open question and already-approved invariants.
2. Present options, implications, and recommended choice **without treating recommendation as approval**.
3. Obtain explicit product-owner decision; record ID, date, decision wording, rationale and constraints.
4. Change status to Approved only after authorization.
5. Update linked Domain Rules/Architecture/API/Test specifications and affected approval gate.
6. Preserve historical discussion; do not overwrite prior approved decisions silently.

## 8. Other issues discovered during DP-01 authoring

These are **source evidence gaps, not product P1 decisions**:

| ID | Historical evidence gap | Current disposition |
|---|---|---|
| EG-001 | D-001–D-008 individually mapped decision text not fully available; D-007/008 unknown | Prospective disposition accepted by AG-01-EG-B; historical mapping remains unverified |
| EG-002 | D-029 exact historical decision wording unavailable | Prospective disposition accepted by AG-01-EG-B; original wording remains unverified |
| EG-003 | Original approval records and per-ID source pointers are unavailable in this repository for R/P entries, including Q/G2/G3; existing U entries also lack an independently checkable original source here | Prospective disposition accepted by AG-01-EG-B; no original source is thereby verified |
| EG-004 | AG-01 approval was pending in the v0.1.2 draft snapshot | Closed by later explicit Product Owner approval for the four v0.1.2 documents; no historical source verification implied |

Reference: [03-decision-registry.md](03-decision-registry.md).

PO-CLAR-D021, PO-CLAR-D018 and PO-CLAR-D010-Q001 are current Product Owner scope dispositions recorded in the Decision Registry. They do not resolve EG-001–EG-003. FA-004/005/006, FA-006-B1, FA-007 and FA-008 were separately approved as Option B.

AG-01-EG-B is the Product Owner's prospective evidence-gap disposition. EG-001–EG-003 remain historically unresolved. AG-01 approval and DP-02 authoring authorization were separate later Product Owner actions.

## 9. Gate status and controls

| Gate | Current status | Open decisions relevant |
|---|---|---|
| AG-01 | **Approved for DP-01 v0.1.2** | EG-001–EG-003 historically open with prospective disposition AG-01-EG-B; v0.1.3–v0.1.7 are subsequent administrative records |
| AG-02 | **Conditionally Approved for six DP-02 v0.1.1 documents** | GAP-001/002/003/007 Open; dependent implementation unauthorized; material changes require change control |
| AG-03 | **Conditionally Approved for six DP-03 v0.1.0 documents** | GAP-001/002/003/007 Open; dependent implementation unauthorized; material changes require change control |
| AG-04 | **Conditionally Approved for six DP-04 v0.1.0 documents** | GAP-001/002/003/007 Open; dependent implementation unauthorized; planned tests/drills not evidence |
| AG-05 | **Conditionally Approved for six DP-05 v0.1.0 documents** | Verification plans and release-gate design approved conditionally; no executed evidence or beta release authorization |
| AG-06 | Not Approved | DP-06 review required; no implementation slice authorized |

**Authoring boundary:** DP-06 documentation authoring is separately authorized after conditional AG-05 approval. AG-06 is Not Approved; VS-01 and other application code/test scripts/configuration remain unauthorized. GAP-dependent implementation remains blocked.

## 10. Conditional AG-02 open GAPs

The Product Owner conditionally approved the six DP-02 v0.1.1 documents as a current disposition. Their original draft metadata is a snapshot of the pre-approval state. The following remain **Open**, and requirements depending on unresolved detail are **not authorized for implementation**:

| ID | Open policy detail | Source |
|---|---|---|
| GAP-001 | Exact exceptional access-eligibility/revocation parameters and public listing behavior. | [DP-02 traceability](../DP-02/06-traceability-matrix.md) |
| GAP-002 | Detailed Path curriculum-version migration and leave behavior. | [DP-02 traceability](../DP-02/06-traceability-matrix.md) |
| GAP-003 | Evidence compatibility criteria, target eligibility beyond approved status, and abandonment trigger. | [DP-02 traceability](../DP-02/06-traceability-matrix.md) |
| GAP-007 | Exact protected prerequisite action coverage and edge cases. | [DP-02 traceability](../DP-02/06-traceability-matrix.md) |

Material changes require the [Decision Registry change control](03-decision-registry.md). Conditional AG-02/AG-03/AG-04 approval does not close these GAPs or grant AG-05 approval.

## 11. Subsequent FA-006-B1 and AG-03 disposition

**FA-006-B1 — Approved B:** Delete or irreversibly de-identify individual Student-linked learning records during account deletion. Only genuinely anonymous aggregate statistics may be retained; replacing personal identifiers with pseudonymous identifiers alone is not anonymization. Historical learning-evidence protection does not override FA-006 B personal-data deletion. Active data deletion remains within 30 days of a valid request, backup expiry within 30 days, and security audit retention 180 days unless legitimate legal obligations require otherwise. These are Product Owner targets, not statutory claims.

**AG-03 — Conditionally Approved:** The six DP-03 v0.1.0 documents are the approved baseline. Their original Draft/Not Approved metadata records the earlier snapshot. GAP-001/002/003/007 remain Open; dependent implementation is unauthorized. Material changes require change control. The later disposition does not approve AG-04.

## 12. Subsequent AG-04 disposition

**AG-04 — Conditionally Approved:** The six DP-04 v0.1.0 documents are the approved baseline for contracts supported by approved product decisions. Their original Draft/Not Approved metadata records the earlier snapshot. GAP-001/002/003/007 remain Open and their dependent implementation blocked. Planned security tests and operational drills are not completed evidence. Material contract changes require change control. FA-007 B was approved later as the DP-05 quality source; neither decision approves AG-05 or beta release.

## 13. Subsequent AG-05 disposition

**AG-05 — Conditionally Approved:** The six DP-05 v0.1.0 documents form the conditionally approved verification-plan baseline. Their original Draft/Not Approved metadata reports the earlier snapshot. This later administrative disposition approves strategy, scenarios, evidence requirements and release-gate design only; security and integrity hard gates remain nonwaivable. It supplies no executed evidence, technical readiness, slice implementation permission or beta release approval. FA-007 B stays Approved. GAP-001/002/003/007 stay Open with dependent implementation blocked; material changes require change control. AG-06 is Not Approved.

## 14. Subsequent AG-06 disposition (2026-10-31 administrative addendum)

The §13 `AG-06 Not Approved` wording and the original AG-06 row above are historical pre-approval records. The current Product Owner disposition is **AG-06 Conditionally Approved** for the six DP-06 v0.1.0 documents and their 16-increment planning baseline, as recorded in the [Decision Registry §16](03-decision-registry.md#16-subsequent-product-owner-ag-06-disposition-2026-10-31-administrative-addendum). Engineering Bootstrap and the VS-01A Contract & Fixture Readiness bundle were separately authorized. VS-01A implementation, merge, deployment and beta release remain unauthorized. GAP-001/002/003/007 remain **Open**; the five GAP-dependent increments remain **Blocked**. No open GAP is disposed by this administrative update.

## 15. VS-01A closure sign-off pending (2026-10-31 addendum)

The later **VS01A-CLOSE-001** [decision record](03-decision-registry.md#17-vs-01a-closure-preparation-decision-2026-10-31-addendum) and [acceptance evidence ledger](../DP-06/07-vs-01a-formal-closure-and-acceptance.md) record the merged disposable Guest implementation at `339344e654ea77817ecddf05094d1d55b7bf3865`. Accepted CI succeeds, including the P2 focus regression coverage. Earlier “implementation not authorized/not present” text above is historical; supplied later PO tasks separately authorized bounded implementation and remediation. AG-01–AG-06 historical records are preserved.

| Pending item | Current status | Evidence / next authority |
|---|---|---|
| Independent human domain/security/quality sign-off | **PENDING SIGN-OFF** | No submitted PR #4/#5 reviews or supplied external sign-off; author’s #5 unit-success comment is not independent approval. Product Owner appoints reviewer(s); reviewer records revision, findings/limitations and signed disposition. |
| Formal VS-01A DD-001 decision | **PENDING — PO decision not granted** | Preparation authorization is not closure. After mandatory sign-off and condition disposition, PO explicitly decides for the accepted SHA and records authority/effective date. |
| Evidence preservation / limitations | **OPEN follow-up** | Retain accepted-run artifacts before reported expiry; record bounded accessibility/dependency-risk disposition. Manual screen-reader remains NOT RUN; automated axe is not full WCAG certification. |
| VS-02A implementation | **NOT AUTHORIZED** | Planning handoff exists; formal predecessor acceptance, its own DR-001 and explicit PO scope authorization still required. |

These are pending closure conditions, not new product-policy GAPs. **GAP-001/002/003/007 remain OPEN** with VS-02C/04C/06C/06D/03B **Blocked**. No production publishing, deployment, beta or Student-data acceptance is granted. This addendum does not overwrite prior gate tables or invent reviewer identities, signatures or approvals.

## 16. GOV-AI-001 proposal awaiting decision (2026-10-31)

| Proposal reference | Status / next decision |
|---|---|
| [GOV-AI-001 — AI-assisted technical acceptance](05-gov-ai-001-ai-assisted-technical-acceptance-proposal.md) | **PROPOSED / NOT EFFECTIVE — AUTHORITY CLARIFICATION REQUIRED**. PO drafting authorization only. Establish amendment authority/concurrence, review alternatives and controls, then explicitly approve, reject or defer through existing change control. No approver, signature or effective date is inferred. |

This is a proposal reference outside the historically approved snapshots, not a new approved policy or product GAP disposition. AG-01–AG-06 and existing QUAL outcomes are unchanged. VS01A-CLOSE-001/DD-001 remain **PENDING SIGN-OFF**; GAP-001/002/003/007 remain **Open** and their dependent increments **Blocked**. No VS-01A closure, waiver, deployment, beta or VS-02A implementation is authorized.
