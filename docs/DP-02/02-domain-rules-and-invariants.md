# DP-02 — Domain Rules & Invariants

| Metadata | Value |
|---|---|
| Package | DP-02 — Comprehensive Domain & UX Contracts |
| Version | 0.1.0 |
| Status | **Draft — Not Approved** |
| Approval gate | AG-02 — **Not Approved** |
| Normative source | [DP-01 Decision Registry](../DP-01/03-decision-registry.md) and [MVP Scope Baseline](../DP-01/02-mvp-scope-baseline.md) |

This document owns the DP-02 behavioral rules. A transition occurs only after its stated preconditions are validated by the authoritative service. Rejected actions leave authoritative evidence and previous achievements unchanged. State names below are logical, not a SQL schema or API contract. Exact policy choices absent from approved sources remain listed in §6.

## 1. Participation, enrollment and navigation

| ID | Preconditions → transition / outcome | Invariant and failure outcome | Source |
|---|---|---|---|
| RULE-001 | A Course is placed in one or more Paths → membership is available for discovery and Path progress derivation. | Membership never creates a second canonical Course completion. | D-012, Q-004, FA-004 B |
| RULE-002 | Authenticated Student explicitly joins a Path → official Path participation exists. | Joining creates **no** member Course enrollment; unauthenticated join is rejected and browsing creates none. | FA-004 B |
| RULE-003 | Student explicitly enrolls in a Course or takes a first official learning action that expresses enrollment intent → Course enrollment is established idempotently. | Browsing alone cannot enroll; Path participation is independent. A duplicate intent cannot create conflicting enrollments. | G2-001A, FA-004 B |
| RULE-004 | New Course enrollment and an eligible published Course version exist → pin the latest eligible published version at enrollment. | No draft or ineligible version is pinned. What qualifies as eligible beyond published status remains a contract question. | FA-005 B |
| RULE-005 | Student requests an official learning action with an applicable configured prerequisite → Go validates it before accepting the action. | Unmet prerequisites block that official action with a recoverable explanation; Guest free reading remains governed by RULE-006. Exact prerequisite configuration is not invented. | D-018, PO-CLAR-D018 |
| RULE-006 | Guest opens free content, including any flagship Lesson → permit reading and local ungraded practice without login. | Guest cannot receive official completion, graded assessment, or account achievements. Authentication is required for those actions. | D-009, Q-001, PO-CLAR-D010-Q001 |
| RULE-007 | Guest opts into selective recovery after authentication → eligible local position/drafts/settings may be merged safely. | Local records cannot become verified passing or official completion; a conflict or failed merge preserves authoritative server state. | D-017, Q-002, FA-002 B |

## 2. Evidence, progress and completion

| ID | Preconditions → transition / outcome | Invariant and failure outcome | Source |
|---|---|---|---|
| RULE-008 | Admin configures a supported interactive activity as required → completion policy records requiredness for the relevant version. | A merely rendered or clicked block does not satisfy a server-required participation or passing condition. | Q-007, FA-002 B |
| RULE-009 | Student performs an activity → classify evidence as local interaction, server-recorded participation, or server-verified passing according to its approved contract. | Higher evidence tiers cannot be inferred from browser flags or local recovery. Invalid evidence is rejected. | FA-002 B |
| RULE-010 | Student explicitly requests official completion → Go checks identity, applicable prerequisites, pinned policy/version, required activity evidence and assessments. | Completion is recorded only if all applicable required evidence is authoritative; otherwise show unmet conditions without granting completion. | D-013, Q-004, FA-002 B |
| RULE-011 | A completion policy identifies required/optional Lessons and assessments → hierarchical Lesson/Course completion derives from the required conditions. | Optional material cannot silently become mandatory; canonical Course completion is reusable across Paths. | Q-003, Q-004 |
| RULE-012 | An eligible Course completion exists for a member Course → derive its contribution to every relevant Path progress view. | Path progress does not create or overwrite Course completion; participating in a Path does not imply Course enrollment. Exact membership-change calculation is open. | FA-004 B, Q-004 |
| RULE-013 | A new completion-affecting policy/version is published → apply it prospectively by default. | Prior valid completion and passing evidence remain valid; editorial-only revision does not invalidate achievement. | Q-003, FA-001 |
| RULE-014 | Retroactive revalidation is proposed → require explicit policy, approval, audit and learner notification before any affected historical achievement is reevaluated. | No implicit retroactive invalidation on publish or migration. Without those controls, reject revalidation. | FA-001, Q-003 |

## 3. Structured assessment and attempt lifecycle

| ID | Preconditions → transition / outcome | Invariant and failure outcome | Source |
|---|---|---|---|
| RULE-015 | Admin configures a graded single/multiple-choice assessment → publish with a defined assessment version and configured passing score, weights and retry policy. | Ungraded knowledge checks do not issue official grades. No unapproved question type, threshold or retry limit is assumed. | D-016, Q-005 |
| RULE-016 | Authenticated eligible Student starts an assessment with no active attempt in the applicable context → create one ACTIVE Attempt locked to that assessment version. | A repeated start must not create a second active attempt; the existing active attempt remains available to resume. | FA-003 B |
| RULE-017 | ACTIVE Attempt reaches its configured expiry (24 hours by default) before valid submission → transition to EXPIRED. An Attempt can enter ABANDONED only through an explicitly specified abandonment action/policy. | EXPIRED and ABANDONED are terminal and cannot submit; expiry is not an automatic scored failure. Abandonment trigger and any expiry override require explicit policy. | FA-003 B |
| RULE-018 | Valid submission arrives while Attempt is ACTIVE and within expiry → grade using its locked version and transition to SUBMITTED with immutable Result. | Same-attempt repeated submission is idempotent; a conflicting duplicate, version mismatch or late submission cannot overwrite a Result. | Q-005, FA-003 B |
| RULE-019 | A retry is allowed by the configured policy after a terminal Attempt → start a new version-locked Attempt subject to RULE-016. | Earlier immutable grades and historically valid passing evidence survive later attempts. No retry count is set by this document. | Q-005, FA-003 B |

**Attempt state contract:** `ACTIVE → SUBMITTED`, `ACTIVE → EXPIRED`, or `ACTIVE → ABANDONED`. Each terminal state is irreversible. Whether an abandoned attempt counts against a configured retry allowance is not approved and must be configured/decided explicitly before dependent acceptance.

## 4. Content publication and version migration

| ID | Preconditions → transition / outcome | Invariant and failure outcome | Source |
|---|---|---|---|
| RULE-020 | Authorized Admin edits supported Content Blocks in a draft → validate and preview before publish. Publishing produces a distinct published revision/version. | Draft content is not substituted into enrolled Students' pinned published version. Invalid content cannot be published. | D-015, Q-007, FA-005 B |
| RULE-021 | A newer eligible published Course version becomes available → new enrollments use it; existing enrollments remain pinned. | Publish alone neither migrates an existing enrollment nor rewrites historical progress, completion or passing evidence. | FA-005 B |
| RULE-022 | An existing enrollment is selected for migration → Admin must use a manual, explicitly authorized and audited action with an explicit policy and appropriate learner communication. | No automatic migration engine; failed or unauthorized migration leaves the enrollment pinned and historical evidence intact. Details of evidence mapping between versions require an explicit policy. | FA-005 B, FA-001 |
| RULE-023 | Historical evidence is retained or removed under a future data lifecycle policy → enforce that policy without rewriting the fact that a past achievement was valid. | Version pinning does not promise indefinite content retention. Exact deletion/retention policy remains FA-006 Open. | FA-005 B, G3-003, FA-006 Open |

## 5. Roles, workspace and discovery

| ID | Preconditions → transition / outcome | Invariant and failure outcome | Source |
|---|---|---|---|
| RULE-024 | Student accesses or edits their progress, notes, bookmarks or preferences → allow own records. Admin content/audit actions require privileged authorization. | No arbitrary cross-Student ownership bypass; unauthorized requests reveal no protected data. | D-019, D-025, Q-006, G3-001 |
| RULE-025 | Public visitor searches or filters the catalog → show matching published/discoverable Paths and Courses, with empty/error states. | Rule-based recommendations are post-MVP and are not required for discovery. Visibility of unpublished/archived items is an unresolved policy detail. | D-021, PO-CLAR-D021, FA-005 B |
| RULE-026 | Trusted nonpublic operation bootstraps an Admin from a known Supabase user identity → authorize and audit it once. | Public self-service cannot grant Admin privilege. | Q-006, G3-001 |
| RULE-027 | Authenticated Student accesses a basic own-account export/deletion request path → allow an owned request and show its processing state under the applicable privacy policy. | Another Student cannot access or submit the request on their behalf. No deletion/retention deadline or exception is inferred before FA-006. | D-025, G3-003, FA-006 Open |

## 6. Unresolved policy boundaries

| Dependency | Contract gap | Gate / handling |
|---|---|---|
| FA-006 | Retention/deletion periods, historical content availability, backup reconciliation. | Open; AG-03, consistency AG-04. No lifetime is guaranteed here. |
| FA-007 | Measurable accessibility, UX and performance thresholds. | Open; AG-05. Functional UX contract is draft without numeric targets. |
| FA-008 | Operational capacity, recovery and hosting parameters. | Open; AG-04. No infrastructure target here. |
| AG-02 policy question | Unpublish/archive visibility, previously enrolled access and exceptional revocation were not settled by FA-005 B. | Leave dependent access states conditional; do not select a default policy. |
| AG-02 policy question | Path membership snapshot/denominator under course additions/removals, progress visibility before joining, and Path leave behavior are not established by FA-004 B. | Do not assign a progress formula, backfill display or withdrawal rule. |
| AG-02 policy question | Migration evidence mapping, version eligibility beyond publication, and abandoned-attempt retry accounting lack approved detail. | Require explicit policy/configuration before a dependent behavior is treated as accepted. |
| AG-02 policy question | Supported prerequisite types/targets and their exact official-action effects are not established by D-018/PO-CLAR-D018. | Keep RULE-005's Go validation boundary; do not invent a prerequisite configuration schema or eligibility policy. |
