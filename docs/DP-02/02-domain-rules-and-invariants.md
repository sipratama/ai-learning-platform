# DP-02 — Domain Rules & Invariants

| Metadata | Value |
|---|---|
| Package | DP-02 — Comprehensive Domain & UX Contracts |
| Version | 0.1.1 |
| Status | **Draft — Not Approved** |
| Approval gate | AG-02 — **Not Approved** |
| Normative source | [DP-01 Decision Registry](../DP-01/03-decision-registry.md) and [MVP Scope Baseline](../DP-01/02-mvp-scope-baseline.md) |

This document owns the DP-02 behavioral rules. AG02-01–AG02-05 are current explicit Product Owner decisions, separate from the approved DP-01 baseline. A transition occurs only after its stated preconditions are validated by the authoritative service. Rejected actions leave authoritative evidence and previous achievements unchanged. State names below are logical, not a SQL schema or API contract. Exact policy choices absent from approved sources remain listed in §6.

## 1. Participation, enrollment and navigation

| ID | Preconditions → transition / outcome | Invariant and failure outcome | Source |
|---|---|---|---|
| RULE-001 | A Course is placed in one or more Paths → membership is available for discovery and Path progress derivation. | Membership never creates a second canonical Course completion. | D-012, Q-004, FA-004 B |
| RULE-002 | Authenticated Student explicitly joins a Path → official Path participation exists. | Joining creates **no** member Course enrollment; unauthenticated join is rejected and browsing creates none. | FA-004 B |
| RULE-003 | Student explicitly enrolls in a Course or takes a first official learning action that expresses enrollment intent → Course enrollment is established idempotently. | Browsing alone cannot enroll; Path participation is independent. A duplicate intent cannot create conflicting enrollments. | G2-001A, FA-004 B |
| RULE-004 | New Course enrollment and an eligible published Course version exist → pin the latest eligible published version at enrollment. | New enrollment into an archived or unpublished Course is rejected unless a separately approved policy permits it. No draft or ineligible version is pinned. | FA-005 B, AG02-01 |
| RULE-005 | Authorized Admin may configure an optional prerequisite referencing completion of another Course, including across Paths. For an applicable protected official learning action, Go verifies global Course completion before accepting the action. | Unmet Course completion blocks that protected action with an explanation; Guest free reading remains governed by RULE-006. Required score, skill, time, arbitrary expression or script prerequisites are outside MVP. Exact protected-action coverage remains open. | D-018, PO-CLAR-D018, AG02-05 |
| RULE-006 | Guest opens free content, including any flagship Lesson → permit reading and local ungraded practice without login. | Guest cannot receive official completion, graded assessment, or account achievements. Authentication is required for those actions. | D-009, Q-001, PO-CLAR-D010-Q001 |
| RULE-007 | Guest opts into selective recovery after authentication → eligible local position/drafts/settings may be merged safely. | Local records cannot become verified passing or official completion; a conflict or failed merge preserves authoritative server state. | D-017, Q-002, FA-002 B |

## 2. Evidence, progress and completion

| ID | Preconditions → transition / outcome | Invariant and failure outcome | Source |
|---|---|---|---|
| RULE-008 | Admin configures a supported interactive activity as required → completion policy records requiredness for the relevant version. | A merely rendered or clicked block does not satisfy a server-required participation or passing condition. | Q-007, FA-002 B |
| RULE-009 | Student performs an activity → classify evidence as local interaction, server-recorded participation, or server-verified passing according to its approved contract. | Higher evidence tiers cannot be inferred from browser flags or local recovery. Invalid evidence is rejected. | FA-002 B |
| RULE-010 | Student explicitly requests official completion → Go checks identity, applicable prerequisites, pinned policy/version, required activity evidence and assessments. | Completion is recorded only if all applicable required evidence is authoritative; otherwise show unmet conditions without granting completion. | D-013, Q-004, FA-002 B |
| RULE-011 | A completion policy identifies required/optional Lessons and assessments → hierarchical Lesson/Course completion derives from the required conditions. | Optional material cannot silently become mandatory; canonical Course completion is reusable across Paths. | Q-003, Q-004 |
| RULE-012 | For a Path's applicable member Courses, derive progress from globally reusable Course completion. A non-participating Student may see informational preview progress; official progress and Path completion require authenticated Path participation. | Preview creates neither participation nor official Path completion. Path progress never creates or overwrites Course completion, and Path joining never enrolls member Courses. | FA-004 B, Q-004, AG02-02 |
| RULE-013 | A new completion-affecting Course or Path policy/version is published → apply it prospectively by default. | Prior valid Course/Path completion and passing evidence remain valid; editorial-only revision or Path membership change alone does not retroactively invalidate an earned official completion. | Q-003, FA-001, AG02-02 |
| RULE-014 | Retroactive revalidation is proposed → require explicit policy, approval, audit and learner notification before any affected historical achievement is reevaluated. | No implicit retroactive invalidation on publish or migration. Without those controls, reject revalidation. | FA-001, Q-003 |

## 3. Structured assessment and attempt lifecycle

| ID | Preconditions → transition / outcome | Invariant and failure outcome | Source |
|---|---|---|---|
| RULE-015 | Admin configures a graded single/multiple-choice assessment → publish with a defined assessment version and configured passing score, weights and retry policy. | Ungraded knowledge checks do not issue official grades. No unapproved question type, threshold or retry limit is assumed. | D-016, Q-005 |
| RULE-016 | Authenticated eligible Student starts an Assessment Version with no active Attempt for that Student + Assessment + Assessment Version → create one version-locked ACTIVE Attempt. | At most one active Attempt exists in that exact context; a repeated start must not create a second, and the existing active Attempt remains available to resume. | FA-003 B, AG02-04 |
| RULE-017 | ACTIVE Attempt reaches its configured expiry (24 hours by default) before valid submission → EXPIRED; an explicitly recorded abandonment → ABANDONED. | Both terminal states remain in immutable Attempt history and count in applicable retry accounting. Neither is automatically a scored failure or invalidates earlier passing evidence. Exact abandonment trigger remains unspecified. | FA-003 B, AG02-04 |
| RULE-018 | Valid submission arrives while Attempt is ACTIVE and within expiry → grade using its locked version and transition to SUBMITTED with immutable Result. | Same-attempt repeated submission is idempotent; a conflicting duplicate, version mismatch or late submission cannot overwrite a Result. | Q-005, FA-003 B |
| RULE-019 | A retry is allowed by configured policy after a terminal Attempt → count submitted, expired and abandoned Attempts as the applicable retry policy requires, then start a new version-locked Attempt subject to RULE-016. | Expired/abandoned Attempts cannot be omitted from applicable retry accounting; earlier immutable grades and verified passing evidence survive. No numeric limit or new threshold is set here. | Q-005, FA-003 B, AG02-04 |

**Attempt state contract:** `ACTIVE → SUBMITTED`, `ACTIVE → EXPIRED`, or `ACTIVE → ABANDONED`. Each terminal state is irreversible and remains in history. Expired and abandoned Attempts count under the applicable retry policy; no numeric limit or automatic invalidation of prior passing is implied.

## 4. Content publication and version migration

| ID | Preconditions → transition / outcome | Invariant and failure outcome | Source |
|---|---|---|---|
| RULE-020 | Authorized Admin edits supported Content Blocks in a draft → validate and preview before publish. Publishing produces a distinct published revision/version. | Draft content is not substituted into enrolled Students' pinned published version. Invalid content cannot be published. | D-015, Q-007, FA-005 B |
| RULE-021 | A newer eligible published Course version becomes available → new eligible enrollments use it; existing enrollments remain pinned. | Publish alone neither migrates an existing enrollment nor rewrites historical progress, completion or passing evidence. Normal archive/unpublish does not by itself revoke eligible existing pinned access. | FA-005 B, AG02-01 |
| RULE-022 | An existing enrollment is selected for migration → authorized Admin manually identifies source version, target eligible published version, affected enrollments and explicit evidence compatibility mapping; the action is audited and learners receive notice of migration and new requirements. | No automatic migration engine. Missing authorization, eligible target or compatibility mapping blocks migration; failed migration leaves the prior pin and historical evidence intact. | FA-005 B, FA-001, AG02-03 |
| RULE-023 | Historical evidence is retained or removed under a future data lifecycle policy → enforce that policy without rewriting the fact that a past achievement was valid. | Version pinning does not promise indefinite content retention. Exact deletion/retention policy remains FA-006 Open. | FA-005 B, G3-003, FA-006 Open |

## 5. Roles, workspace and discovery

| ID | Preconditions → transition / outcome | Invariant and failure outcome | Source |
|---|---|---|---|
| RULE-024 | Student accesses or edits their progress, notes, bookmarks or preferences → allow own records. Admin content/audit actions require privileged authorization. | No arbitrary cross-Student ownership bypass; unauthorized requests reveal no protected data. | D-019, D-025, Q-006, G3-001 |
| RULE-025 | Public visitor searches or filters the catalog → show matching published/discoverable Paths and Courses, with empty/error states. | Rule-based recommendations are post-MVP and are not required for discovery. Visibility of unpublished/archived items is an unresolved policy detail. | D-021, PO-CLAR-D021, FA-005 B |
| RULE-026 | Trusted nonpublic operation bootstraps an Admin from a known Supabase user identity → authorize and audit it once. | Public self-service cannot grant Admin privilege. | Q-006, G3-001 |
| RULE-027 | Authenticated Student accesses a basic own-account export/deletion request path → allow an owned request and show its processing state under the applicable privacy policy. | Another Student cannot access or submit the request on their behalf. No deletion/retention deadline or exception is inferred before FA-006. | D-025, G3-003, FA-006 Open |
| RULE-028 | Authorized Admin archives or unpublishes a Course → stop new enrollment unless a separately approved policy permits it. Existing eligible enrolled Students may continue their pinned published version while it remains access-eligible. | Archive/unpublish is not exceptional revocation and never automatically invalidates historical achievement. It does not promise indefinite content retention. | AG02-01, FA-005 B |
| RULE-029 | Exceptional access revocation is requested → require an explicit authorized, auditable policy and distinguish it from normal archive/unpublish. | Unauthorized or policy-less revocation is rejected; revocation does not silently erase historical completion, Attempt results or passing evidence. | AG02-01, FA-001 |
| RULE-030 | Path membership changes → calculate subsequent official Path progress under the applicable version-aware Path policy and Prospective by Default. | Global Course completion is unchanged; an already earned official Path completion is not retroactively invalidated solely by the membership change. Detailed curriculum-version migration is not inferred. | AG02-02, FA-001, FA-004 B |
| RULE-031 | A controlled Course version migration has an explicit source-to-target evidence mapping → carry forward only previously verified evidence mapped as compatible; incompatible or unmapped target requirements must be fulfilled again before target-version completion. | Preserve original evidence, Attempts and completion records; no manufactured passing evidence and no erasure of previously earned completion. | AG02-03, FA-005 B |

## 6. Unresolved policy boundaries

| Dependency | Contract gap | Gate / handling |
|---|---|---|
| FA-006 | Retention/deletion periods, historical content availability, backup reconciliation. | Open; AG-03, consistency AG-04. No lifetime is guaranteed here. |
| FA-007 | Measurable accessibility, UX and performance thresholds. | Open; AG-05. Functional UX contract is draft without numeric targets. |
| FA-008 | Operational capacity, recovery and hosting parameters. | Open; AG-04. No infrastructure target here. |
| AG-02 policy edge | Exact access-eligibility and exceptional-revocation policy parameters beyond AG02-01 safeguards are unspecified. | Keep archive/unpublish distinct from revocation; do not invent unrestricted Admin deletion or content lifetime. |
| AG-02 policy edge | Detailed Path curriculum-version migration and Path leave behavior remain unspecified. | Preserve prospective completion and global Course records; do not invent a migration algorithm. |
| AG-02 policy edge | Exact protected official actions for Course-completion prerequisites and exceptional edge cases remain unspecified. | Go enforces them where applicable; do not invent new prerequisite types. |
| AG-02 policy edge | Exact evidence-compatibility criteria, target eligible-version criteria beyond published/authorized status, and abandonment trigger remain unspecified. | Explicit mapping and policy are required; do not assume equivalence or a numeric retry limit. |
