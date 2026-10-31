# DP-02 — User Journeys & Permissions

| Metadata | Value |
|---|---|
| Package | DP-02 — Comprehensive Domain & UX Contracts |
| Version | 0.1.0 |
| Status | **Draft — Not Approved** |
| Approval gate | AG-02 — **Not Approved** |
| Rule source | [Domain Rules](02-domain-rules-and-invariants.md) |

Each journey is **MVP** unless marked **Conditional**. “Alternate” is an allowed branch, not a separate product decision. Failure leaves authoritative state unchanged, as specified by the linked rule. These journeys describe behavior, not routes or screen mockups.

## 1. Guest journeys

| ID / actor | Trigger and preconditions | Main flow | Alternate flow | Failure flow | Postconditions | Rules / class |
|---|---|---|---|---|---|---|
| JRN-001 Guest | Opens public catalog; no login. | Browse, search and filter discoverable Paths/Courses. | Empty result shows clear reset action. | Loading failure shows retry; no false results. | No enrollment or participation created. | RULE-025; MVP |
| JRN-002 Guest | Opens a discoverable Path or Course detail. | Read description, curriculum and access information; choose free Lesson. | Unavailable item explains status without revealing protected draft. | Not-found/visibility restriction shows safe state. | No official records created. | RULE-001, RULE-006, RULE-025; MVP, visibility policy conditional |
| JRN-003 Guest | Opens a free Lesson; flagship Lessons are all free. | Read structured Blocks in Lesson Reader; move within available free curriculum. | Resume from eligible local position. | Media/block load failure offers retry or fallback without marking completion. | Reading state may remain local; no official completion. | RULE-006, RULE-009; MVP |
| JRN-004 Guest | Interacts with local flashcard/check/practice block. | Receive local feedback and retain eligible local state. | Skip optional local activity. | Invalid local input shows correction without server passing evidence. | No official grade or passing record. | RULE-006, RULE-009; MVP |
| JRN-005 Guest | Chooses sign-up/login to use an official action. | Authenticate as Student and return to intended context. | Cancel and continue free learning. | Authentication failure keeps Guest access and shows retry. | Student authority starts only after successful authentication; no automatic completion. | RULE-003, RULE-006, RULE-007; MVP |
| JRN-006 Guest → Student | Authenticated Student explicitly opts into recovery; eligible local state exists. | Review/select position, drafts or settings, then merge safely. | Decline recovery; keep server state. | Conflict or invalid local evidence is rejected without losing server state. | Only eligible local state recovered; no passing/completion imported. | RULE-007, RULE-009; MVP |

## 2. Student journeys

| ID / actor | Trigger and preconditions | Main flow | Alternate flow | Failure flow | Postconditions | Rules / class |
|---|---|---|---|---|---|---|
| JRN-007 Student | Chooses to join a Path; authenticated. | Confirm Path participation and view derived progress. | Already participating → show existing state. | Authentication/availability failure gives no participation. | Path joined; member Courses are **not** enrolled. | RULE-002, RULE-012; MVP |
| JRN-008 Student | Chooses “Ikuti Kursus” or first official learning action; eligible Course version exists. | Validate applicable prerequisite; enroll idempotently; pin latest eligible published version. | Already enrolled → resume pinned version. | Unmet prerequisite or missing eligible version blocks official action. | One applicable enrollment; no Path participation implied. | RULE-003–RULE-005; MVP |
| JRN-009 Student | Opens enrolled Course or workspace. | Resume pinned Lesson/version and see next required condition. | Browse other free material without changing enrollment. | Missing/withdrawn content uses policy-dependent access state, not silent migration. | Existing pin and evidence unchanged. | RULE-004, RULE-010, RULE-021; MVP, withdrawal behavior conditional |
| JRN-010 Student | Performs required Lesson interaction; enrolled and eligible. | Submit participation or passing evidence as required; view verified status. | Optional activity may be skipped under policy. | Invalid/local-only evidence is not promoted; show unmet requirement. | Server evidence recorded only at validated tier. | RULE-008–RULE-010; MVP |
| JRN-011 Student | Chooses complete action; required policy applies. | Go validates required evidence and records eligible completion. | Already complete → show existing achievement. | Missing evidence/prerequisite shows unmet conditions. | Version-aware completion, no duplicate canonical Course achievement. | RULE-010–RULE-014; MVP |
| JRN-012 Student | Starts graded assessment; authenticated and eligible. | Open one version-locked ACTIVE attempt; answer and submit; view result. | Resume same active attempt or allowed retry after terminal attempt. | Expired, late, version-mismatched or conflicting duplicate submission cannot grade/overwrite. | Immutable grade; valid passing evidence persists. | RULE-015–RULE-019; MVP |
| JRN-013 Student | Opens Path/Course/dashboard progress. | View validated Course completion and derived Path progress. | Show empty state before enrollment/participation. | Data error displays retry without false completion. | Canonical Course record reused across Paths. | RULE-011–RULE-013; MVP, Path denominator conditional |
| JRN-014 Student | Opens own workspace. | Manage notes, bookmarks and reading preferences; resume own learning. | Remove own item or use concise/detail reading view. | Unauthorized ownership or save failure does not expose/overwrite another Student's data. | Own workspace updated only on accepted action. | RULE-024; MVP |
| JRN-015 Student | A newer Course version is published while enrolled. | Continue on the identified current pinned version. | Inspect newer-version information if made available under an approved visibility policy. | Version mismatch must not silently switch content. | Enrollment and historical evidence remain on current pin until authorized migration. | RULE-021, RULE-022; MVP, newer-version visibility conditional |
| JRN-016 Student | Admin performs an authorized migration under explicit policy. | Receive appropriate communication; inspect resulting version and preserved achievements. | Remain pinned when not selected for migration. | Failed migration leaves prior pin/evidence intact and exposes support path. | Only authorized migration changes pin; no retroactive invalidation by default. | RULE-014, RULE-022, RULE-023; MVP, evidence mapping conditional |

## 3. Admin journeys

| ID / actor | Trigger and preconditions | Main flow | Alternate flow | Failure flow | Postconditions | Rules / class |
|---|---|---|---|---|---|---|
| JRN-017 Admin | Opens authorized CMS; privileged identity. | Manage Path/Course/Module/Lesson structure and preview curriculum. | Save draft without publishing. | Unauthorized action or invalid structure is rejected and audited as applicable. | Draft changed; published enrollment pins unchanged. | RULE-001, RULE-020, RULE-024; MVP |
| JRN-018 Admin | Edits supported Content Blocks in a draft. | Use visual/Markdown authoring; validate and preview every MVP block type. | Continue draft revision after validation feedback. | Invalid block blocks publish, preserves prior published version. | Draft revision/preview only until publish. | RULE-008, RULE-020; MVP |
| JRN-019 Admin | Configures Lesson activity, supported prerequisite or assessment policy. | Mark supported activities required; configure applicable prerequisites; set graded question, weight, passing and retry configuration. | Leave supported activity optional. | Invalid/unsupported configuration cannot publish; no default retry limit is fabricated. | Policy becomes effective only when appropriately published. | RULE-005, RULE-008, RULE-015, RULE-020; MVP |
| JRN-020 Admin | Publishes a validated revision; privileged identity. | Review change and publish distinct eligible Course version. | Keep draft without publishing. | Validation/auth failure leaves published version intact. | New enrollment may use new version; existing enrollment stays pinned. | RULE-020, RULE-021; MVP |
| JRN-021 Admin | Initiates manual migration for selected enrolled Students under explicit policy. | Verify authorization, affected version and learner communication; execute and audit controlled action. | Cancel before execution. | Missing policy, invalid target or failure leaves prior pin and evidence unchanged. | Migration recorded; no automatic engine or silent revalidation. | RULE-014, RULE-022, RULE-023; MVP, mapping policy conditional |
| JRN-022 Admin | Opens permitted content/audit/progress view. | Review publication, migration and relevant progress evidence within privilege scope. | Filter/review without modifying Student grades. | Unauthorized scope denied; protected data not revealed. | No silent grade or ownership changes. | RULE-024, RULE-026; MVP |

## 4. Student privacy request journey

| ID / actor | Trigger and preconditions | Main flow | Alternate flow | Failure flow | Postconditions | Rules / class |
|---|---|---|---|---|---|---|
| JRN-023 Student | Opens own privacy controls while authenticated. | Initiate basic own-data export or account deletion request and view its policy-dependent processing state. | Return without a request. | Cross-account attempt is denied; processing policy remains conditional on FA-006. | Only the Student's own request may proceed; no deadline or deletion result is implied. | RULE-024, RULE-027; MVP boundary, FA-006 conditional |

## 5. Role-permission matrix

| ID | Action | Guest | Student | Admin | Rule |
|---|---|---|---|---|---|
| PERM-001 | Browse/search/filter discoverable catalog and free detail | Allow | Allow | Allow subject to visibility | RULE-025 |
| PERM-002 | Read free/flagship Lessons; local ungraded practice | Allow | Allow | Preview/author as privileged | RULE-006 |
| PERM-003 | Join official Path | Login required | Own participation only | No Student evidence substitution | RULE-002 |
| PERM-004 | Enroll in Course / official action | Login required | Own, subject to eligibility/prerequisite | No arbitrary Student enrollment | RULE-003–RULE-005 |
| PERM-005 | Record official activity evidence/completion | Deny | Own, Go validated | Configure policy, not forge evidence | RULE-008–RULE-010 |
| PERM-006 | Start/submit graded assessment | Deny | Own eligible attempt | Author assessment, not grade as Student | RULE-015–RULE-019 |
| PERM-007 | View own progress, notes, bookmarks, preferences | Local only | Own records | Scope-limited review; no ownership bypass | RULE-024 |
| PERM-008 | Author/validate/preview/publish content | Deny | Deny | Privileged, audited | RULE-020, RULE-024 |
| PERM-009 | Configure requiredness and grading policy | Deny | Deny | Privileged, audited | RULE-008, RULE-015 |
| PERM-010 | Migrate pinned Course enrollment | Deny | No self-migration | Manual, authorized, audited | RULE-022 |
| PERM-011 | Bootstrap Admin role | Deny | Deny | Trusted nonpublic operation only | RULE-026 |
| PERM-012 | Recover Guest local state | Local state only | Optional selective merge into own state | No Student evidence substitution | RULE-007 |
| PERM-013 | Request own data export/account deletion | Login required | Own request, processing policy conditional | No arbitrary Student request | RULE-027 |

## 6. Access and decision boundaries

- Access to unpublished/archived content and exceptional revocation are **not specified** by FA-005 B. Journeys JRN-002, JRN-009 and JRN-016 must use an explicit later policy before release behavior is finalized.
- Path membership change calculation and leave behavior are **not specified** by FA-004 B. JRN-007/JRN-013 do not assume a denominator or withdrawal transition.
- FA-006 retention/deletion, FA-007 numeric UX thresholds and FA-008 operational parameters remain Open for their later gates. These do not authorize speculative UX or data-lifecycle behavior.
