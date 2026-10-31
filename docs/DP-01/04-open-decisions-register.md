# DP-01 — Open Decisions Register

| Metadata | Nilai |
|---|---|
| Package | DP-01 — Traceable Product Baseline |
| Artifact | Open Decisions Register |
| Version | 0.1.5 — subsequent administrative governance synchronization |
| Status | **Approved product baseline v0.1.2; v0.1.3–v0.1.5 record later governance decisions** |
| Approval gate | AG-01 — **Approved for v0.1.2 by current Product Owner approval** |
| Revision boundary | v0.1.2 product substance approved; v0.1.3–v0.1.4 record prior governance; v0.1.5 records AG-03 conditional approval, FA-006-B1 B and FA-008 B without changing that substance |
| Prepared | 2026-10-31 |

> **Rule:** FA-004 B, FA-005 B, FA-006 B, FA-006-B1 B and FA-008 B are current explicit Product Owner approvals; FA-007 remains Open. AG-02 and AG-03 are conditionally approved for their named snapshots; GAP-001/002/003/007 remain Open and dependent implementation unauthorized. This v0.1.5 administrative revision follows the approved DP-01 v0.1.2 snapshot; it does not replace historical source evidence.

## 1. Open decisions overview

| ID | Priority | Topic | Blocking approval | State |
|---|---|---|---|---|
| FA-004 | P1 | Learning Path Participation | AG-02 contract review | **Approved — Option B** |
| FA-005 | P1 | Publishing & Historical Access | AG-02 contract review | **Approved — Option B** |
| FA-006 | P1 | Retention & Account Deletion Parameters | AG-03; consistency AG-04 | **Approved — Option B** |
| FA-006-B1 | P1 | Student-linked learning-record disposition | AG-04 privacy consistency | **Approved — Option B** |
| FA-007 | P1 | UX, Performance & Beta Thresholds | AG-05 | **Open** |
| FA-008 | P1 | Infrastructure & Operational Parameters | AG-04 | **Approved — Option B** |

FA-004/005 supplied DP-02 inputs; FA-006 B supplied DP-03 privacy input; FA-006-B1 B and FA-008 B supply DP-04 inputs. FA-007 remains Open for AG-05. The open AG-02 GAPs below do not receive implementation authorization.

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

**Resolved decision — Option B, Balanced Production MVP:** INF-01–INF-14 in the [Decision Registry](03-decision-registry.md) approve managed static frontend hosting/CDN, managed Go containers, Supabase PostgreSQL/Auth/Storage, isolated Local/Staging/Production, GitHub Actions with production approval, managed secrets, structured observability, lightweight worker capability, FA-006-compatible backup/restore, best-effort availability without commercial SLA, pragmatic horizontal scaling and budget/cost controls. Singapore is only a conditional preferred region pending legal and latency validation. No specific Go host, paid tier, instance size, numeric RPO/RTO or commercial SLA is approved.

**Operational contract work:** DP-04 must define delivery, access, rollback, restore verification and cost-monitoring boundaries. A managed backup service alone does not prove FA-006 B or FA-006-B1 B compliance. FA-007 still owns quantitative performance and beta thresholds.

**Affected:** DP-04 operations/security, DP-03 storage/recovery assumptions, DP-05 performance/reliability.

**Decision status:** **Approved — Option B** by current explicit Product Owner approval. **AG-04** remains Not Approved.

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

PO-CLAR-D021, PO-CLAR-D018 and PO-CLAR-D010-Q001 are current Product Owner scope dispositions recorded in the Decision Registry. They do not resolve EG-001–EG-003. FA-004/005/006, FA-006-B1 and FA-008 were separately approved as Option B; FA-007 remains Open.

AG-01-EG-B is the Product Owner's prospective evidence-gap disposition. EG-001–EG-003 remain historically unresolved. AG-01 approval and DP-02 authoring authorization were separate later Product Owner actions.

## 9. Gate status and controls

| Gate | Current status | Open decisions relevant |
|---|---|---|
| AG-01 | **Approved for DP-01 v0.1.2** | EG-001–EG-003 historically open with prospective disposition AG-01-EG-B; v0.1.3–v0.1.5 are subsequent administrative records |
| AG-02 | **Conditionally Approved for six DP-02 v0.1.1 documents** | GAP-001/002/003/007 Open; dependent implementation unauthorized; material changes require change control |
| AG-03 | **Conditionally Approved for six DP-03 v0.1.0 documents** | GAP-001/002/003/007 Open; dependent implementation unauthorized; material changes require change control |
| AG-04 | Not Approved | Review DP-04 against approved FA-006 B, FA-006-B1 B and FA-008 B |
| AG-05 | Not Started | FA-007 |
| AG-06 | Not Started | Requires approved dependencies / governance plan |

**Authoring boundary:** DP-04 documentation authoring is separately authorized after conditional AG-03 approval and FA-008 B. DP-05–DP-06 authoring and application code/configuration remain unauthorized. AG-04 is Not Approved.

## 10. Conditional AG-02 open GAPs

The Product Owner conditionally approved the six DP-02 v0.1.1 documents as a current disposition. Their original draft metadata is a snapshot of the pre-approval state. The following remain **Open**, and requirements depending on unresolved detail are **not authorized for implementation**:

| ID | Open policy detail | Source |
|---|---|---|
| GAP-001 | Exact exceptional access-eligibility/revocation parameters and public listing behavior. | [DP-02 traceability](../DP-02/06-traceability-matrix.md) |
| GAP-002 | Detailed Path curriculum-version migration and leave behavior. | [DP-02 traceability](../DP-02/06-traceability-matrix.md) |
| GAP-003 | Evidence compatibility criteria, target eligibility beyond approved status, and abandonment trigger. | [DP-02 traceability](../DP-02/06-traceability-matrix.md) |
| GAP-007 | Exact protected prerequisite action coverage and edge cases. | [DP-02 traceability](../DP-02/06-traceability-matrix.md) |

Material changes require the [Decision Registry change control](03-decision-registry.md). Conditional AG-02/AG-03 approval does not close these GAPs or grant AG-04 approval.

## 11. Subsequent FA-006-B1 and AG-03 disposition

**FA-006-B1 — Approved B:** Delete or irreversibly de-identify individual Student-linked learning records during account deletion. Only genuinely anonymous aggregate statistics may be retained; replacing personal identifiers with pseudonymous identifiers alone is not anonymization. Historical learning-evidence protection does not override FA-006 B personal-data deletion. Active data deletion remains within 30 days of a valid request, backup expiry within 30 days, and security audit retention 180 days unless legitimate legal obligations require otherwise. These are Product Owner targets, not statutory claims.

**AG-03 — Conditionally Approved:** The six DP-03 v0.1.0 documents are the approved baseline. Their original Draft/Not Approved metadata records the earlier snapshot. GAP-001/002/003/007 remain Open; dependent implementation is unauthorized. Material changes require change control. The later disposition does not approve AG-04.
