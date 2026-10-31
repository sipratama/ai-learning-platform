# DP-01 — Open Decisions Register

| Metadata | Nilai |
|---|---|
| Package | DP-01 — Traceable Product Baseline |
| Artifact | Open Decisions Register |
| Version | 0.1.3 — administrative governance synchronization |
| Status | **Approved product baseline v0.1.2; v0.1.3 records later governance decisions** |
| Approval gate | AG-01 — **Approved for v0.1.2 by current Product Owner approval** |
| Revision boundary | v0.1.2 product substance approved; v0.1.3 records AG-01, FA-004 B and FA-005 B without changing that substance |
| Prepared | 2026-10-31 |

> **Rule:** FA-004 B and FA-005 B are current explicit Product Owner approvals. Only FA-006–FA-008 remain unresolved. Historical candidate approaches below are not additional approvals; no policy is chosen silently. This v0.1.3 administrative revision follows the approved v0.1.2 product snapshot.

## 1. Open decisions overview

| ID | Priority | Topic | Blocking approval | State |
|---|---|---|---|---|
| FA-004 | P1 | Learning Path Participation | AG-02 contract review | **Approved — Option B** |
| FA-005 | P1 | Publishing & Historical Access | AG-02 contract review | **Approved — Option B** |
| FA-006 | P1 | Retention & Account Deletion Parameters | AG-03; consistency AG-04 | **Open** |
| FA-007 | P1 | UX, Performance & Beta Thresholds | AG-05 | **Open** |
| FA-008 | P1 | Infrastructure & Operational Parameters | AG-04 | **Open** |

FA-004/005 Option B supplies approved DP-02 inputs; AG-02 still requires review. Remaining P1 items block their indicated later gates.

## 2. FA-004 — Learning Path Participation

**Resolved decision — Option B:** Path participation and Course enrollment are independent. Joining a Path does not enroll all member Courses. Course completion is global and reusable; Path progress derives from completion of member Courses. Official Path participation requires Student authentication.

**Already approved invariants:** course enrollment is intent-based (G2-001A); browsing alone is not enrollment; same course can belong to multiple paths (D-012); canonical course completion is reused across paths (Q-004).

**Historical candidate models:** aggregated progress without participation; explicit independent Path participation; hybrid follow behavior. The Product Owner selected independent Path and Course participation (Option B) after DP-01 v0.1.2.

**DP-02 contract work:** define Path joining, progress and Student UX without duplicating Course completion. No automatic enrollment of member Courses.

**Affected:** DP-02 Domain Rules, Student UX, DP-03 model, DP-04 API, DP-05 verification.

**Decision status:** **Approved — Option B** by the Product Owner after v0.1.2. **AG-02** contract approval remains pending.

## 3. FA-005 — Publishing, Archiving & Historical Access

**Resolved decision — Option B:** Existing enrolled Students stay on their pinned published Course version; new enrollments use the latest eligible published version. Publishing does not silently migrate existing enrollments. Historical progress, completion and passing evidence remain protected. MVP migration is manual, Admin-controlled, explicitly authorized and audited, with appropriate learner communication. No automatic curriculum migration engine. Historical content retention depends on FA-006.

**Already approved:** hybrid editor with draft/preview/publish/revisions (D-015); version-aware/prospective completion (Q-003, FA-001); historical achievements preserved.

**DP-02 contract work:** describe version pinning, publishing and controlled migration. Detailed unpublish/archive visibility, exceptional revocation and historical retention are not established by Option B; do not silently choose them. Retention/deletion depends on FA-006.

**Affected:** DP-02 Domain Rules/UX, DP-03 data model, DP-04 CMS/API/security, DP-05 tests.

**Decision status:** **Approved — Option B** by the Product Owner after v0.1.2. **AG-02** contract approval remains pending; unresolved policy details must be flagged rather than invented.

## 4. FA-006 — Data Retention & Account Deletion Parameters

**Decision question:** What precise retention/deletion deadlines and legal/operational exceptions apply to Student records, assessments, notes, assets, audit logs, and backups?

**Already approved:** privacy by design, ownership, controlled deletion/retention, basic export and backup deletion reconciliation (G3-003). No numeric deadline is approved.

**Must resolve:**
- Category-based data inventory and retention periods.
- Deletion request phases, temporary suspension/lock and failure handling.
- Which records require preservation or irreversible anonymization on legitimate grounds.
- Media/object storage cleanup and cross-service reconciliation.
- How restored backups avoid reactivating previously deleted accounts/data.
- Audit evidence policy while minimizing personal data.

**Affected:** DP-03 database/data lifecycle; DP-04 operations/recovery/security; DP-05 privacy tests.

**Blocking:** **AG-03**; must be consistent with **AG-04**. **Owner:** product owner plus relevant privacy/legal review when applicable; **due:** before AG-03.

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

PO-CLAR-D021, PO-CLAR-D018 and PO-CLAR-D010-Q001 are current Product Owner scope dispositions recorded in the Decision Registry. They do not resolve EG-001–EG-003. FA-004/005 were separately approved as Option B; FA-006–FA-008 remain Open.

AG-01-EG-B is the Product Owner's prospective evidence-gap disposition. EG-001–EG-003 remain historically unresolved. AG-01 approval and DP-02 authoring authorization were separate later Product Owner actions.

## 9. Gate status and controls

| Gate | Current status | Open decisions relevant |
|---|---|---|
| AG-01 | **Approved for DP-01 v0.1.2** | EG-001–EG-003 historically open with prospective disposition AG-01-EG-B; v0.1.3 is subsequent administrative sync |
| AG-02 | Not Approved | Review DP-02 contracts based on approved FA-004 B and FA-005 B |
| AG-03 | Not Started | FA-006 |
| AG-04 | Not Started | FA-008, FA-006 consistency |
| AG-05 | Not Started | FA-007 |
| AG-06 | Not Started | Requires approved dependencies / governance plan |

**Authoring boundary:** DP-02 documentation authoring is separately authorized after AG-01 approval. DP-03–DP-06 authoring, application code, DB schema and API contracts remain unauthorized.
