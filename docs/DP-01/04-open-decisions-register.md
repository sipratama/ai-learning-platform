# DP-01 — Open Decisions Register

| Metadata | Nilai |
|---|---|
| Package | DP-01 — Traceable Product Baseline |
| Artifact | Open Decisions Register |
| Version | 0.1.4 — subsequent administrative governance synchronization |
| Status | **Approved product baseline v0.1.2; v0.1.3 and v0.1.4 record later governance decisions** |
| Approval gate | AG-01 — **Approved for v0.1.2 by current Product Owner approval** |
| Revision boundary | v0.1.2 product substance approved; v0.1.3 records AG-01/FA-004 B/FA-005 B; v0.1.4 records AG-02 conditional approval and FA-006 B without changing that substance |
| Prepared | 2026-10-31 |

> **Rule:** FA-004 B, FA-005 B and FA-006 B are current explicit Product Owner approvals. Only FA-007 and FA-008 remain open among the FA items. AG-02 is conditionally approved for DP-02 v0.1.1; GAP-001/002/003/007 remain Open. Historical candidate approaches below are not additional approvals. This v0.1.4 administrative revision follows both the approved DP-01 v0.1.2 snapshot and the v0.1.3 governance record.

## 1. Open decisions overview

| ID | Priority | Topic | Blocking approval | State |
|---|---|---|---|---|
| FA-004 | P1 | Learning Path Participation | AG-02 contract review | **Approved — Option B** |
| FA-005 | P1 | Publishing & Historical Access | AG-02 contract review | **Approved — Option B** |
| FA-006 | P1 | Retention & Account Deletion Parameters | AG-03; consistency AG-04 | **Approved — Option B** |
| FA-007 | P1 | UX, Performance & Beta Thresholds | AG-05 | **Open** |
| FA-008 | P1 | Infrastructure & Operational Parameters | AG-04 | **Open** |

FA-004/005 Option B supplied approved DP-02 inputs; AG-02 has since been conditionally approved for v0.1.1. FA-006 B supplies the approved DP-03 privacy input. FA-007/008 remain open for their indicated later gates. The open AG-02 GAPs below do not receive implementation authorization.

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

**Decision status:** **Approved — Option B** by current explicit Product Owner approval. **AG-03** remains Not Approved; consistency with AG-04 remains required.

## 5. FA-007 — UX, Performance & Beta Thresholds

**Decision question:** What measurable, testable UX, accessibility, speed, load, and beta-release thresholds are acceptable for R1–R4?

**Already approved:** responsive contextual UX (G2-002), accessibility as product requirement (G2-003), evidence-based gates R0–R4 (G2-004). Suggested example metrics in prior discussion are not approvals.

**Must resolve:**
- Accessibility target and verification protocol, including manual assistive-technology evidence.
- Primary usability tasks, representative participant selection, task success criteria.
- Page performance indicators and representative device/network profile.
- Go API latency/load metrics and supported concurrency; coordinate with FA-008.
- Beta participant selection, defect severity thresholds and release No-Go policy.
- Recovery drill and operational evidence requirements appropriate to R4.

**Affected:** DP-02 UX, DP-04 operational requirements, DP-05 QA and release gates.

**Blocking:** **AG-05**; operationally consistent with FA-008. **Owner:** product owner with UX/QA and engineering input; **due:** before AG-05.

## 6. FA-008 — Infrastructure & Operational Parameters

**Decision question:** Which managed hosting arrangement, capacities, expected costs, recovery objectives and operational monitoring targets are committed for MVP?

**Already approved:** isolated local/staging/production, Supabase managed Auth/PostgreSQL/Storage, Go API, GitHub Actions, secrets, monitoring, tested backup/restore, lean production infrastructure (G3-001/G3-004). No specific hosting vendor, currency budget, numeric RPO/RTO, or capacity is approved.

**Must resolve:**
- Managed application/frontend hosting and environment separation details.
- Budget envelope and baseline traffic/concurrency assumptions.
- Backup coverage/frequency and tested RPO/RTO.
- Alerting, logging retention, ownership and incident response expectations.
- Database migration/rollback strategy aligned with recoverability.
- Supabase provider limits, storage media and failure modes.

**Affected:** DP-04 operations/security, DP-03 storage/recovery assumptions, DP-05 performance/reliability.

**Blocking:** **AG-04**. **Owner:** product owner with engineering/operations input; **due:** before AG-04.

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

PO-CLAR-D021, PO-CLAR-D018 and PO-CLAR-D010-Q001 are current Product Owner scope dispositions recorded in the Decision Registry. They do not resolve EG-001–EG-003. FA-004/005/006 were separately approved as Option B; FA-007–FA-008 remain Open.

AG-01-EG-B is the Product Owner's prospective evidence-gap disposition. EG-001–EG-003 remain historically unresolved. AG-01 approval and DP-02 authoring authorization were separate later Product Owner actions.

## 9. Gate status and controls

| Gate | Current status | Open decisions relevant |
|---|---|---|
| AG-01 | **Approved for DP-01 v0.1.2** | EG-001–EG-003 historically open with prospective disposition AG-01-EG-B; v0.1.3 and v0.1.4 are subsequent administrative records |
| AG-02 | **Conditionally Approved for six DP-02 v0.1.1 documents** | GAP-001/002/003/007 Open; dependent implementation unauthorized; material changes require change control |
| AG-03 | Not Approved | Review DP-03 against approved FA-006 B and conditional AG-02 boundaries |
| AG-04 | Not Started | FA-008, FA-006 consistency |
| AG-05 | Not Started | FA-007 |
| AG-06 | Not Started | Requires approved dependencies / governance plan |

**Authoring boundary:** DP-03 documentation authoring is separately authorized after conditional AG-02 approval and FA-006 B. DP-04–DP-06 authoring, application code, DB schema and API contracts remain unauthorized. AG-03 is Not Approved.

## 10. Conditional AG-02 open GAPs

The Product Owner conditionally approved the six DP-02 v0.1.1 documents as a current disposition. Their original draft metadata is a snapshot of the pre-approval state. The following remain **Open**, and requirements depending on unresolved detail are **not authorized for implementation**:

| ID | Open policy detail | Source |
|---|---|---|
| GAP-001 | Exact exceptional access-eligibility/revocation parameters and public listing behavior. | [DP-02 traceability](../DP-02/06-traceability-matrix.md) |
| GAP-002 | Detailed Path curriculum-version migration and leave behavior. | [DP-02 traceability](../DP-02/06-traceability-matrix.md) |
| GAP-003 | Evidence compatibility criteria, target eligibility beyond approved status, and abandonment trigger. | [DP-02 traceability](../DP-02/06-traceability-matrix.md) |
| GAP-007 | Exact protected prerequisite action coverage and edge cases. | [DP-02 traceability](../DP-02/06-traceability-matrix.md) |

Material changes require the [Decision Registry change control](03-decision-registry.md). Conditional AG-02 approval does not close these GAPs or grant AG-03 approval.
