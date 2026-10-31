# DP-01 — Open Decisions Register

| Metadata | Nilai |
|---|---|
| Package | DP-01 — Traceable Product Baseline |
| Artifact | Open Decisions Register |
| Version | 0.1.2 |
| Status | **Draft — Not Approved** |
| Approval gate | AG-01 — **Not Started** |
| Prepared | 2026-10-31 |

> **Rule:** Items here are unresolved. Candidate approaches are **not approvals**. A later owner decision is required before the dependent approval gate; Codex and document authors must not choose a policy silently.

## 1. Open decisions overview

| ID | Priority | Topic | Blocking approval | State |
|---|---|---|---|---|
| FA-004 | P1 | Learning Path Participation | AG-02 | **Open** |
| FA-005 | P1 | Publishing & Historical Access | AG-02 | **Open** |
| FA-006 | P1 | Retention & Account Deletion Parameters | AG-03; consistency AG-04 | **Open** |
| FA-007 | P1 | UX, Performance & Beta Thresholds | AG-05 | **Open** |
| FA-008 | P1 | Infrastructure & Operational Parameters | AG-04 | **Open** |

Priority P1 means **nonblocking to begin DP-01 authoring**, not optional for affected later approvals.

## 2. FA-004 — Learning Path Participation

**Decision question:** Must Student explicitly enroll/follow a Learning Path, or does participation arise from global course activity and aggregated course completion?

**Already approved invariants:** course enrollment is intent-based (G2-001A); browsing alone is not enrollment; same course can belong to multiple paths (D-012); canonical course completion is reused across paths (Q-004).

**Candidate models (not selected):**
- Aggregated path progress, no path enrollment.
- Explicit path enrollment with separate intent.
- Hybrid participation (optional follow path, but canonical course completion remains global).

**Must resolve:** enrollment intent; whether an explicit path participation record exists; how path progress is calculated without duplicate completion; removal/visibility of paths; student UX states.

**Affected:** DP-02 Domain Rules, Student UX, DP-03 model, DP-04 API, DP-05 verification.

**Blocking:** **AG-02**. **Owner:** product owner, approval explicit; **due:** before AG-02.

## 3. FA-005 — Publishing, Archiving & Historical Access

**Decision question:** What do unpublish, archive and revision mean for public access and a Student who already enrolled or completed a lesson?

**Already approved:** hybrid editor with draft/preview/publish/revisions (D-015); version-aware/prospective completion (Q-003, FA-001); historical achievements preserved.

**Must resolve:**
- Publication states and allowed transitions (draft, published, unpublished, archived).
- Public catalog visibility versus authenticated previously-enrolled access.
- Revocation for invalid, unsafe or legally restricted materials.
- Historical revision retention and policy/version links.
- What Admin may delete versus unpublish/archive; student notifications when affected.

**Affected:** DP-02 Domain Rules/UX, DP-03 data model, DP-04 CMS/API/security, DP-05 tests.

**Blocking:** **AG-02**. **Owner:** product owner, approval explicit; **due:** before AG-02.

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
| EG-004 | Formal AG-01 review and approval of the four drafts have not occurred | Complete formal review and obtain explicit named-version approval |

Reference: [03-decision-registry.md](03-decision-registry.md).

PO-CLAR-D021, PO-CLAR-D018 and PO-CLAR-D010-Q001 are current Product Owner scope dispositions recorded in the Decision Registry. They do not resolve EG-001–EG-003 or change FA-004–FA-008 from Open.

AG-01-EG-B is the Product Owner's current prospective evidence-gap disposition. EG-001–EG-003 remain historically unresolved; the disposition does not approve AG-01 or authorize later documentation.

## 9. Gate status and controls

| Gate | Current status | Open decisions relevant |
|---|---|---|
| AG-01 | **Not Started** | EG-001–EG-003 historically open with prospective disposition AG-01-EG-B; EG-004 formal review and explicit approval pending; FA P1 allowed to remain Open |
| AG-02 | Not Started | FA-004, FA-005 |
| AG-03 | Not Started | FA-006 |
| AG-04 | Not Started | FA-008, FA-006 consistency |
| AG-05 | Not Started | FA-007 |
| AG-06 | Not Started | Requires approved dependencies / governance plan |

**Authoring boundary:** Only DP-01 drafts were authorized by AAR-01. No application code, repository, DB schema, API contract or authoring of DP-02–DP-06 has been authorized.
