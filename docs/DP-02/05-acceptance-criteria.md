# DP-02 — Acceptance Criteria

| Metadata | Value |
|---|---|
| Package | DP-02 — Comprehensive Domain & UX Contracts |
| Version | 0.1.1 |
| Status | **Draft — Not Approved** |
| Approval gate | AG-02 — **Not Approved** |
| Rule source | [Domain Rules](02-domain-rules-and-invariants.md) and [UX Specification](04-ux-and-interaction-specification.md) |

Each `AC` is a proposed **MVP behavioral acceptance criterion** derived from an approved source through the named rule. AG02-01–AG02-05 are current explicit Product Owner decisions, not historical DP-01 approvals. “Given / When / Then” describes an observable outcome, not an endpoint, SQL structure or test implementation. Configuration values are supplied by approved policy; no unspecified threshold, retry count or retention period is created here.

## 1. Discovery, access and participation

| ID | Given / When / Then | Rule; approved source |
|---|---|---|
| AC-001 | **Given** discoverable catalog items, **when** a visitor searches or filters, **then** matching published/discoverable Paths and Courses are shown with the active query/filter state. | RULE-025; D-021, PO-CLAR-D021 |
| AC-002 | **Given** no match, **when** search/filter completes, **then** a clear empty state and reset action appear; no recommendation feature is required. | RULE-025; PO-CLAR-D021 |
| AC-003 | **Given** a Course belongs to two Paths, **when** both Path details are viewed, **then** the same canonical Course is represented in each without creating duplicate completion records. | RULE-001; D-012, Q-004 |
| AC-004 | **Given** an unauthenticated Guest, **when** any flagship Lesson is opened, **then** its free content and local ungraded practice are accessible without login. | RULE-006; Q-001, PO-CLAR-D010-Q001 |
| AC-005 | **Given** a Guest, **when** official completion or graded assessment is requested, **then** Student authentication is required and no official result is issued to the Guest. | RULE-006; Q-001, PO-CLAR-D010-Q001 |
| AC-006 | **Given** a Student and discoverable Path, **when** the Student joins, **then** official Path participation is recorded without enrolling any member Course. | RULE-002; FA-004 B |
| AC-007 | **Given** a Guest, **when** official Path join is requested, **then** authentication is required and no participation record is made. | RULE-002; FA-004 B |
| AC-008 | **Given** a Student only browses a Course, **when** the detail page is viewed, **then** no Course enrollment is created. | RULE-003; G2-001A |
| AC-009 | **Given** an eligible published Course that is neither archived nor unpublished, **when** a Student explicitly enrolls or takes an official action expressing enrollment intent, **then** one enrollment is established on the latest eligible published version. | RULE-003, RULE-004; G2-001A, FA-005 B, AG02-01 |
| AC-010 | **Given** the same enrollment intent is repeated, **when** processed again, **then** the existing applicable enrollment is returned/represented without a conflicting duplicate. | RULE-003; G2-001A |
| AC-011 | **Given** a configured Course-completion prerequisite is unmet, **when** an applicable protected official learning action is requested, **then** Go rejects that action with the missing Course completion visible; free Guest reading is not thereby converted into login-only content. | RULE-005, RULE-006; D-018, PO-CLAR-D018, AG02-05 |
| AC-012 | **Given** an eligible Guest local position/draft/setting and a newly authenticated Student, **when** selective recovery is accepted, **then** only selected eligible local state is merged. | RULE-007; Q-002 |
| AC-013 | **Given** a recovery conflict or browser-only passing claim, **when** merge is attempted, **then** authoritative Student progress and passing remain unchanged. | RULE-007, RULE-009; Q-002, FA-002 B |

## 2. Activity evidence and completion

| ID | Given / When / Then | Rule; approved source |
|---|---|---|
| AC-014 | **Given** Admin marks a supported activity required in a published completion policy, **when** a Student attempts completion without the required authoritative tier, **then** completion is withheld and the requirement is shown. | RULE-008, RULE-010; FA-002 B |
| AC-015 | **Given** a Guest or Student clicks a local activity, **when** only local interaction is recorded, **then** no server-verified passing evidence is issued. | RULE-009; FA-002 B |
| AC-016 | **Given** a Student supplies valid participation or passing evidence, **when** Go validates it, **then** the corresponding distinct server tier is recorded and visible. | RULE-009; FA-002 B |
| AC-017 | **Given** all required conditions for the applicable pinned policy/version are met, **when** the Student explicitly completes, **then** official completion is recorded and displayed. | RULE-010, RULE-011; D-013, Q-004 |
| AC-018 | **Given** required evidence, assessment or applicable prerequisite is missing, **when** completion is requested, **then** no official completion is granted and unmet conditions are shown. | RULE-005, RULE-010, RULE-011; D-013, Q-004 |
| AC-019 | **Given** a canonical Course completion and membership in multiple Paths, **when** Path progress is viewed, **then** the single Course achievement contributes to each applicable Path without a second Course completion; non-participating preview is labeled unofficial. | RULE-001, RULE-012; Q-004, FA-004 B, AG02-02 |
| AC-020 | **Given** a valid completion predates an editorial-only revision or prospective policy change, **when** the new version is published, **then** the prior achievement remains valid. | RULE-013; Q-003, FA-001 |
| AC-021 | **Given** no explicit retroactive policy, approval, audit and notification, **when** historical revalidation is requested, **then** it is rejected without changing prior achievement. | RULE-014; FA-001 |

## 3. Assessment and attempts

| ID | Given / When / Then | Rule; approved source |
|---|---|---|
| AC-022 | **Given** a graded single/multiple-choice assessment with configured score, weight and retry policy, **when** a valid Student submission is graded, **then** the locked version and configured policy determine the immutable result. | RULE-015, RULE-018; D-016, Q-005 |
| AC-023 | **Given** an ungraded knowledge check, **when** a learner completes it, **then** local/participation feedback is shown without an official assessment grade. | RULE-009, RULE-015; D-016 |
| AC-024 | **Given** no active Attempt for a Student, Assessment and Assessment Version, **when** that eligible Student starts, **then** one ACTIVE Attempt is created and locked to that version. | RULE-016; FA-003 B, AG02-04 |
| AC-025 | **Given** an ACTIVE Attempt already exists for the same Student, Assessment and Assessment Version, **when** another start is requested, **then** no second active Attempt is created and the existing Attempt remains resumable. | RULE-016; FA-003 B, AG02-04 |
| AC-026 | **Given** default expiry applies, **when** 24 hours elapse before valid submission, **then** the Attempt becomes EXPIRED and cannot be submitted as active. | RULE-017; FA-003 B |
| AC-027 | **Given** an Attempt expires or is abandoned, **when** its terminal state is viewed, **then** it remains in immutable Attempt history and is not automatically represented as a scored failure. | RULE-017; FA-003 B, AG02-04 |
| AC-028 | **Given** an ACTIVE unexpired Attempt, **when** a valid submission arrives, **then** it becomes SUBMITTED with one immutable result. | RULE-018; FA-003 B |
| AC-029 | **Given** the same Attempt submission is repeated, **when** it is processed, **then** the result is idempotent; a conflicting duplicate cannot overwrite the prior result. | RULE-018; FA-003 B |
| AC-030 | **Given** an expired Attempt or assessment-version mismatch, **when** submission is attempted, **then** no new grade is issued for that Attempt and the existing result/evidence is unchanged. | RULE-017, RULE-018; FA-003 B |
| AC-031 | **Given** configured retry permission after a terminal Attempt, **when** a Student retries, **then** applicable expired and abandoned Attempts are included in retry accounting and a new Attempt starts only if the policy permits, without changing earlier results or passing evidence. | RULE-016, RULE-019; Q-005, FA-003 B, AG02-04 |

## 4. Publishing, migration, permissions and UX states

| ID | Given / When / Then | Rule; approved source |
|---|---|---|
| AC-032 | **Given** Admin authors any MVP Content Block type, **when** validating and previewing its draft, **then** the supported renderer and validation feedback are available before publication. | RULE-020; Q-007, D-015 |
| AC-033 | **Given** invalid draft content or unauthorized publisher, **when** publish is attempted, **then** publication is rejected and the existing published Course version remains available under its current policy. | RULE-020, RULE-024; D-015, Q-006 |
| AC-034 | **Given** a validated draft and authorized Admin, **when** it is published, **then** a distinct published version is available for eligible new enrollment. | RULE-020, RULE-021; FA-005 B |
| AC-035 | **Given** a Student is already enrolled on a published version, **when** a newer version is published, **then** the existing enrollment remains pinned and historical progress/completion/passing evidence remain intact. | RULE-021; FA-005 B |
| AC-036 | **Given** no explicit migration authorization or policy, **when** a pinned enrollment is targeted for migration, **then** the action is rejected and the current pin/evidence remain unchanged. | RULE-022; FA-005 B |
| AC-037 | **Given** authorized Admin, source/target eligible versions, affected enrollments, explicit compatibility mapping and learner notice, **when** manual migration succeeds, **then** the resulting pin is visible and an audit record exists while original evidence and Attempts remain protected. | RULE-022, RULE-023, RULE-031; FA-005 B, AG02-03 |
| AC-038 | **Given** migration fails, **when** the failure is shown, **then** the prior pin and historical evidence remain intact; no automatic retry engine moves the learner silently. | RULE-022; FA-005 B |
| AC-039 | **Given** a Student owns notes/bookmarks/preferences, **when** editing them, **then** only that Student's records are changed. A cross-Student request is denied without disclosure. | RULE-024; D-019, D-025 |
| AC-040 | **Given** a non-Admin user, **when** attempting authoring, publishing or privileged audit actions, **then** access is denied without changing content or another Student's evidence. | RULE-020, RULE-024; Q-006, G3-001 |
| AC-041 | **Given** Admin bootstrap is requested through public/self-service flow, **when** it is processed, **then** no Admin privilege is granted; only the trusted nonpublic authorized operation may bootstrap and audit it. | RULE-026; Q-006 |
| AC-042 | **Given** public, Student or Admin content is loading, empty, invalid or unavailable, **when** its state occurs, **then** the relevant screen shows an understandable state and an allowed recovery action without false completion or protected-data leakage. | RULE-024, RULE-025; G2-001, G2-002 |
| AC-043 | **Given** an MVP interactive or navigation control, **when** used with keyboard/assistive technology or narrow viewport, **then** the action and feedback remain operable and understandable. Numeric compliance targets remain FA-007 Open. | RULE-024, RULE-025; G2-002, G2-003 |
| AC-044 | **Given** an authorized Admin configures a prerequisite referencing another Course completion, **when** it is validated and published, **then** an applicable protected official action checks globally reusable completion through Go; unsupported or invalid prerequisite types cannot publish. | RULE-005, RULE-020; D-018, PO-CLAR-D018, AG02-05 |
| AC-045 | **Given** an authenticated Student, **when** they open basic privacy controls, **then** they can initiate only their own export/deletion request and see its policy-dependent state; no unapproved deadline is shown. | RULE-024, RULE-027; D-025, G3-003, FA-006 Open |
| AC-046 | **Given** a request targeting another Student's privacy record, **when** a user attempts it, **then** access is denied without revealing or changing that record. | RULE-024, RULE-027; D-025, G3-003 |

## 5. AG02-01–AG02-05 decision scenarios

| ID | Given / When / Then | Rule; approved source |
|---|---|---|
| AC-047 | **Given** an eligible Student is already enrolled on a pinned published Course version, **when** an Admin normally archives or unpublishes the Course, **then** that Student can continue the pinned version while access remains eligible and historical achievements are unchanged. | RULE-021, RULE-028; AG02-01 |
| AC-048 | **Given** a Course is archived or unpublished, **when** a new Student requests enrollment, **then** enrollment is rejected unless a separately approved policy explicitly permits it. | RULE-004, RULE-028; AG02-01 |
| AC-049 | **Given** no explicit authorized auditable exceptional policy, **when** revocation is requested, **then** revocation is denied and normal archive/unpublish cannot be used as its silent substitute. | RULE-029; AG02-01 |
| AC-050 | **Given** an explicit authorized auditable revocation policy applies, **when** access is exceptionally revoked, **then** permitted access changes but historical completion, Attempt Results and passing evidence remain intact. | RULE-023, RULE-029; AG02-01 |
| AC-051 | **Given** Admin reviews Course state changes, **when** archive/unpublish and exceptional revocation are presented, **then** the actions and their access/evidence consequences are clearly distinct. | RULE-028, RULE-029; AG02-01 |
| AC-052 | **Given** an authenticated Student has not joined a Path but has completed a member Course globally, **when** viewing Path progress, **then** any displayed calculation is labeled informational preview and no official participation/completion is created. | RULE-002, RULE-012; AG02-02 |
| AC-053 | **Given** an authenticated Student joins a Path, **when** official progress is shown, **then** globally completed applicable member Courses contribute under the applicable version-aware Path policy without enrolling the Student in other Courses. | RULE-002, RULE-012; FA-004 B, AG02-02 |
| AC-054 | **Given** a Student already earned official Path completion, **when** Path membership changes, **then** that completion and all global Course completions remain valid; subsequent progress follows the applicable prospective policy. | RULE-013, RULE-030; FA-001, AG02-02 |
| AC-055 | **Given** a Student has not joined a Path, **when** all member Courses appear complete in preview, **then** no official Path completion is issued. | RULE-002, RULE-012; AG02-02 |
| AC-056 | **Given** an Admin starts manual migration, **when** source/target eligible published versions, affected enrollments or explicit evidence mapping are missing, **then** migration is blocked and existing pins/evidence remain unchanged. | RULE-022, RULE-031; AG02-03 |
| AC-057 | **Given** previously verified source evidence is explicitly mapped compatible with a target requirement, **when** authorized migration completes, **then** only that evidence may satisfy the mapped target requirement while the original record remains. | RULE-022, RULE-031; AG02-03 |
| AC-058 | **Given** target requirements have incompatible or unmapped source evidence, **when** migration completes, **then** those requirements remain unmet until fulfilled under the target version; no passing evidence is manufactured. | RULE-031; AG02-03 |
| AC-059 | **Given** a target version is ineligible or differs from the authorized target, **when** migration is requested, **then** the action is rejected without changing pin, source Attempts or completion. | RULE-022, RULE-031; AG02-03 |
| AC-060 | **Given** an authorized migration changes a Student's pinned version and introduces new requirements, **when** the change is communicated, **then** the Student sees the source/target context, notice and outstanding target requirements without losing historical achievements. | RULE-022, RULE-031; AG02-03 |
| AC-061 | **Given** an ACTIVE Attempt for Student S, Assessment A and Version V, **when** another start for S/A/V occurs, **then** no second active Attempt exists; a different version remains a distinct context subject to its own eligibility policy. | RULE-016; AG02-04 |
| AC-062 | **Given** expired and abandoned Attempts in a Student's applicable history, **when** a configured retry policy is evaluated, **then** those Attempts are included in that accounting without an invented numeric limit. | RULE-017, RULE-019; AG02-04 |
| AC-063 | **Given** earlier verified passing evidence, **when** a later Attempt expires or is abandoned, **then** the earlier passing remains valid and the terminal Attempt stays recorded. | RULE-017, RULE-019; AG02-04 |
| AC-064 | **Given** a configured prerequisite references another Course in a different Path and the Student has globally completed it, **when** Go validates an applicable protected action, **then** the prerequisite is satisfied without a duplicate Course completion. | RULE-005, RULE-011; AG02-05 |
| AC-065 | **Given** the Student lacks the referenced Course completion, **when** an applicable protected action is requested, **then** Go blocks it with the unmet Course identified while Guest free reading remains available. | RULE-005, RULE-006; AG02-05 |
| AC-066 | **Given** an Admin draft proposes a score, skill, time, arbitrary-expression or script prerequisite, **when** validation occurs, **then** that unsupported type cannot be published as an MVP prerequisite. | RULE-005, RULE-020; AG02-05 |
| AC-067 | **Given** a user without Admin privilege, **when** they attempt to configure a Course-completion prerequisite, **then** the change is denied without changing published policy. | RULE-005, RULE-024; AG02-05 |

## 6. Deliberately unapproved acceptance detail

The criteria above apply AG02-01–AG02-05 without inventing unrestricted deletion, indefinite content access, a Path curriculum migration algorithm, evidence equivalence without explicit mapping, a numeric retry limit, new passing threshold, additional prerequisite type or exact protected-action list. Exact access-eligibility/revocation policy parameters, Path leave/version migration, compatibility criteria and abandonment trigger remain policy edges in [Domain Rules §6](02-domain-rules-and-invariants.md). FA-006–FA-008 remain Open for their later gates; criteria requiring their detailed policies are **blocked**, not silently passed.
