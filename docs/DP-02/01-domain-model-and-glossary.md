# DP-02 — Domain Model & Glossary

| Metadata | Value |
|---|---|
| Package | DP-02 — Comprehensive Domain & UX Contracts |
| Version | 0.1.1 |
| Status | **Draft — Not Approved** |
| Approval gate | AG-02 — **Not Approved** |
| Normative source | [DP-01 approved v0.1.2 baseline and subsequent governance record](../DP-01/03-decision-registry.md) |

This is a **logical domain vocabulary**, not a database model. The approved DP-01 v0.1.2 product substance is authoritative; its v0.1.3 administrative record documents AG-01 and FA-004/005 approvals. AG02-01–AG02-05 are later explicit Product Owner decisions for this draft, not historical DP-01 approvals. Rules are owned by [Domain Rules](02-domain-rules-and-invariants.md). An ID here names a concept, not a new business decision.

## 1. Core concepts

| ID | Concept | Responsibility and boundary | Approved source |
|---|---|---|---|
| DOM-001 | Learning Path | Curriculum grouping of Courses; a Course may appear in multiple Paths. Path participation is distinct from Course enrollment. | D-012, FA-004 B |
| DOM-002 | Course | Reusable canonical learning unit containing Modules; completion belongs to the canonical Course, with relevant version/policy context. | D-012, Q-004, FA-004 B |
| DOM-003 | Module | Ordered instructional grouping within a Course version; detailed ordering policy is not established here. | D-012 |
| DOM-004 | Lesson | Learning unit within a Module, composed of Content Blocks and possibly required activities. | D-012, D-013 |
| DOM-005 | Content Block | Structured authored content or interaction rendered in a Lesson. The approved MVP block set is recorded in Q-007. | D-014, Q-007 |
| DOM-006 | Published Course Version | Published Course snapshot used to pin an enrollment. Publication state and continued access eligibility are distinct; archive/unpublish alone does not revoke an eligible existing enrollment. | Q-003, FA-005 B, AG02-01 |
| DOM-007 | Path Participation | Authenticated Student's official relationship to a Path. It does not create member Course enrollments. Informational preview progress does not create participation or official Path completion. | FA-004 B, AG02-02 |
| DOM-008 | Course Enrollment | Authenticated Student's intentional relationship to one Course and its pinned eligible published version. | G2-001A, FA-005 B |
| DOM-009 | Learning Progress | Server-recognized state derived from authoritative learning evidence for Student views; Guest local progress is separate. | D-013, FA-002 B, Q-004 |
| DOM-010 | Completion Record | Official, version-aware achievement for Lesson, Course or Path policy as applicable; canonical Course completion is reusable across Paths. Path membership changes do not erase earned Course or Path completion. | Q-003, Q-004, FA-001, FA-004 B, AG02-02 |
| DOM-011 | Activity Evidence | Three distinct tiers: local interaction, server-recorded participation, server-verified passing. Browser-only evidence cannot establish passing. | FA-002 B |
| DOM-012 | Assessment | Admin-authored structured graded single/multiple-choice evaluation with configured passing policy, weights and retries. | D-016, Q-005 |
| DOM-013 | Attempt | Assessment session locked to an assessment version. Active uniqueness context is Student + Assessment + Assessment Version; default expiry is 24 hours. Terminal expired/abandoned attempts remain in history and count in applicable retry accounting. | FA-003 B, AG02-04 |
| DOM-014 | Submission | Student's submitted answers for an Attempt; repeated submission of the same attempt is idempotent. | FA-003 B |
| DOM-015 | Result | Immutable grading outcome. Passing evidence remains valid independently of later retry grades. | Q-005, FA-003 B |
| DOM-016 | Content Draft / Revision | Admin-authored editable state and historical revision identity; distinct from published content. | D-015, FA-005 B |
| DOM-017 | Student Workspace | Student-owned progress, resume, notes, bookmarks and reading preferences. Detailed analytics are deferred. | D-019, D-024 |
| DOM-018 | Identity / Role | Guest unauthenticated; Student authenticated learner; Admin authorized privileged user. Identity uses Supabase Auth; Go controls LMS authorization. | D-011, Q-006, G3-001 |
| DOM-019 | Optional Prerequisite | Admin-configured Course-completion condition referencing another Course, including across Paths. Globally reusable completion can satisfy it; Go validates applicable protected actions. Other prerequisite types are outside MVP. | D-018, PO-CLAR-D018, AG02-05 |
| DOM-020 | Version Migration | Manual Admin-controlled, explicitly authorized and audited transition of identified enrollments from a source version to a target eligible published Course version, with learner notice and explicit evidence compatibility mapping. | FA-005 B, AG02-03 |
| DOM-021 | Guest Local State | Optional browser-held position, drafts or settings available for selective recovery; not official achievement evidence. | D-017, Q-002 |
| DOM-022 | Privacy Request | Student-owned request for basic data export or account deletion processing. Exact retention, deletion timing and exceptions remain FA-006 Open. | D-025, G3-003, FA-006 Open |
| DOM-023 | Publication / Access State | Course publication or archive/unpublish state is separate from an enrolled Student's eligibility to access a pinned version. Exceptional revocation is a distinct authorized, auditable action. | FA-005 B, AG02-01 |
| DOM-024 | Evidence Compatibility Mapping | Explicit migration record that identifies source/target requirements and which previously verified evidence is compatible; unmapped or incompatible requirements must be fulfilled again for target-version completion. Original evidence remains historical. | FA-005 B, AG02-03 |
| DOM-025 | Path Progress View | Informational preview for a non-participating Student versus official, version-aware progress for a participating Student; both use global Course completion without duplicating it. | FA-004 B, AG02-02 |

## 2. Logical relationships

| Relationship | Established cardinality or constraint |
|---|---|
| Learning Path ↔ Course | A Path contains member Courses; one Course may belong to multiple Paths. Exact membership limits and ordering are not fixed here. |
| Course → Module → Lesson → Content Block | Hierarchical containment in the approved learning model. Exact minimum/maximum counts are not policy; the flagship planning target is approximately four Modules and 12–16 Lessons. |
| Student ↔ Path Participation | Official participation requires Student identity and Path joining. A non-participating Student may see preview progress; preview is neither participation nor official Path completion. Path leave behavior is not yet specified. |
| Student ↔ Course Enrollment | Enrollment requires Student intent, is independent of Path participation, and pins an eligible Published Course Version. Browsing is not intent. |
| Course Completion ↔ Paths | One canonical Course completion may contribute to multiple Paths; Path membership must not duplicate that achievement. |
| Assessment → Attempt → Submission/Result | At most one active Attempt exists for each Student, Assessment and Assessment Version. Submitted Result is immutable; expired/abandoned attempts remain in retry history without automatically invalidating prior passing evidence. |
| Course Version ↔ Enrollment | Existing enrollment remains pinned on publish or normal archive/unpublish while access remains eligible; new enrollment uses latest eligible published version. Exceptional revocation and controlled migration are separate actions. |
| Source ↔ Target Course Version | A manual migration identifies both versions, affected enrollments and explicit evidence compatibility. Original evidence and completion records remain attached to their historical context. |
| Course-completion prerequisite ↔ Course | An optional prerequisite references another Course; global Course completion may satisfy it across Paths. Which official actions are protected remains policy-dependent. |

## 3. Ownership boundaries

- **Admin** owns authoring, validation, preview, publishing, requiredness and configured assessment policy; privileged operations are authorized and audited ([RULE-020](02-domain-rules-and-invariants.md), [RULE-024](02-domain-rules-and-invariants.md)).
- **Student** owns their participation, enrollment intent, attempts, notes, bookmarks and preferences; official evidence is validated by Go ([RULE-003](02-domain-rules-and-invariants.md), [RULE-010](02-domain-rules-and-invariants.md), [RULE-024](02-domain-rules-and-invariants.md)).
- **Student privacy** includes an own-account export/deletion request path; final processing conditions are conditional on FA-006 ([RULE-027](02-domain-rules-and-invariants.md)).
- **Guest** may read free lessons and use local practice, including every flagship Lesson, without acquiring official Student records ([RULE-006](02-domain-rules-and-invariants.md)).
- **Go API** is authoritative for business authorization, grading, passing and official completion; browser state is not an authority ([RULE-010](02-domain-rules-and-invariants.md)).

## 4. Terms deliberately left open

| Dependency | Unresolved meaning / affected contract |
|---|---|
| FA-006 — AG-03 | Historical content and personal-data retention, deletion, backup reconciliation. Version pinning does not promise indefinite access. |
| FA-007 — AG-05 | Numeric accessibility, usability, performance and beta-release thresholds. UX behavior below is specified without inventing targets. |
| FA-008 — AG-04 | Hosting, capacity and recovery targets; this document assigns no infrastructure parameters. |
| AG-02 review question | Exact access eligibility or exceptional revocation policy beyond the approved AG02-01 safeguards; no unrestricted deletion or indefinite retention is implied. |
| AG-02 review question | Detailed Path curriculum/version migration and Path leave behavior are not established by AG02-02; no algorithm is implied. |
| AG-02 review question | Exact protected learning actions and prerequisite edge cases beyond the Course-completion type are not established by AG02-05. |
