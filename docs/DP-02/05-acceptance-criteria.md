# DP-02 — Acceptance Criteria

| Metadata | Value |
|---|---|
| Package | DP-02 — Comprehensive Domain & UX Contracts |
| Version | 0.1.0 |
| Status | **Draft — Not Approved** |
| Approval gate | AG-02 — **Not Approved** |
| Rule source | [Domain Rules](02-domain-rules-and-invariants.md) and [UX Specification](04-ux-and-interaction-specification.md) |

Each `AC` is a proposed **MVP behavioral acceptance criterion** derived from an approved source through the named rule. “Given / When / Then” describes an observable outcome, not an endpoint, SQL structure or test implementation. Configuration values are supplied by approved policy; no unspecified threshold, retry count or retention period is created here.

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
| AC-009 | **Given** an eligible published Course, **when** a Student explicitly enrolls or takes an official action expressing enrollment intent, **then** one enrollment is established on the latest eligible published version. | RULE-003, RULE-004; G2-001A, FA-005 B |
| AC-010 | **Given** the same enrollment intent is repeated, **when** processed again, **then** the existing applicable enrollment is returned/represented without a conflicting duplicate. | RULE-003; G2-001A |
| AC-011 | **Given** an applicable prerequisite is unmet, **when** an official learning action is requested, **then** Go rejects that action with the unmet condition visible; free Guest reading is not thereby converted into login-only content. | RULE-005, RULE-006; D-018, PO-CLAR-D018 |
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
| AC-019 | **Given** a canonical Course completion and membership in multiple Paths, **when** Path progress is viewed, **then** the single Course achievement contributes to each relevant Path without a second Course completion. | RULE-001, RULE-012; Q-004, FA-004 B |
| AC-020 | **Given** a valid completion predates an editorial-only revision or prospective policy change, **when** the new version is published, **then** the prior achievement remains valid. | RULE-013; Q-003, FA-001 |
| AC-021 | **Given** no explicit retroactive policy, approval, audit and notification, **when** historical revalidation is requested, **then** it is rejected without changing prior achievement. | RULE-014; FA-001 |

## 3. Assessment and attempts

| ID | Given / When / Then | Rule; approved source |
|---|---|---|
| AC-022 | **Given** a graded single/multiple-choice assessment with configured score, weight and retry policy, **when** a valid Student submission is graded, **then** the locked version and configured policy determine the immutable result. | RULE-015, RULE-018; D-016, Q-005 |
| AC-023 | **Given** an ungraded knowledge check, **when** a learner completes it, **then** local/participation feedback is shown without an official assessment grade. | RULE-009, RULE-015; D-016 |
| AC-024 | **Given** no active Attempt in the applicable context, **when** an eligible Student starts, **then** one ACTIVE Attempt is created and locked to the assessment version. | RULE-016; FA-003 B |
| AC-025 | **Given** an ACTIVE Attempt already exists, **when** another start is requested in the same context, **then** no second active scored Attempt is created. | RULE-016; FA-003 B |
| AC-026 | **Given** default expiry applies, **when** 24 hours elapse before valid submission, **then** the Attempt becomes EXPIRED and cannot be submitted as active. | RULE-017; FA-003 B |
| AC-027 | **Given** an Attempt expires or is abandoned, **when** its terminal state is viewed, **then** it is not automatically represented as a scored failure. | RULE-017; FA-003 B |
| AC-028 | **Given** an ACTIVE unexpired Attempt, **when** a valid submission arrives, **then** it becomes SUBMITTED with one immutable result. | RULE-018; FA-003 B |
| AC-029 | **Given** the same Attempt submission is repeated, **when** it is processed, **then** the result is idempotent; a conflicting duplicate cannot overwrite the prior result. | RULE-018; FA-003 B |
| AC-030 | **Given** an expired Attempt or assessment-version mismatch, **when** submission is attempted, **then** no new grade is issued for that Attempt and the existing result/evidence is unchanged. | RULE-017, RULE-018; FA-003 B |
| AC-031 | **Given** configured retry permission after a terminal Attempt, **when** a Student retries, **then** a new valid Attempt may start without changing earlier immutable results or passing evidence. | RULE-016, RULE-019; Q-005, FA-003 B |

## 4. Publishing, migration, permissions and UX states

| ID | Given / When / Then | Rule; approved source |
|---|---|---|
| AC-032 | **Given** Admin authors any MVP Content Block type, **when** validating and previewing its draft, **then** the supported renderer and validation feedback are available before publication. | RULE-020; Q-007, D-015 |
| AC-033 | **Given** invalid draft content or unauthorized publisher, **when** publish is attempted, **then** publication is rejected and the existing published Course version remains available under its current policy. | RULE-020, RULE-024; D-015, Q-006 |
| AC-034 | **Given** a validated draft and authorized Admin, **when** it is published, **then** a distinct published version is available for eligible new enrollment. | RULE-020, RULE-021; FA-005 B |
| AC-035 | **Given** a Student is already enrolled on a published version, **when** a newer version is published, **then** the existing enrollment remains pinned and historical progress/completion/passing evidence remain intact. | RULE-021; FA-005 B |
| AC-036 | **Given** no explicit migration authorization or policy, **when** a pinned enrollment is targeted for migration, **then** the action is rejected and the current pin/evidence remain unchanged. | RULE-022; FA-005 B |
| AC-037 | **Given** authorized Admin, explicit migration policy and learner communication, **when** manual migration succeeds, **then** the resulting pin is visible and an audit record exists while historical evidence remains protected. | RULE-022, RULE-023; FA-005 B |
| AC-038 | **Given** migration fails, **when** the failure is shown, **then** the prior pin and historical evidence remain intact; no automatic retry engine moves the learner silently. | RULE-022; FA-005 B |
| AC-039 | **Given** a Student owns notes/bookmarks/preferences, **when** editing them, **then** only that Student's records are changed. A cross-Student request is denied without disclosure. | RULE-024; D-019, D-025 |
| AC-040 | **Given** a non-Admin user, **when** attempting authoring, publishing or privileged audit actions, **then** access is denied without changing content or another Student's evidence. | RULE-020, RULE-024; Q-006, G3-001 |
| AC-041 | **Given** Admin bootstrap is requested through public/self-service flow, **when** it is processed, **then** no Admin privilege is granted; only the trusted nonpublic authorized operation may bootstrap and audit it. | RULE-026; Q-006 |
| AC-042 | **Given** public, Student or Admin content is loading, empty, invalid or unavailable, **when** its state occurs, **then** the relevant screen shows an understandable state and an allowed recovery action without false completion or protected-data leakage. | RULE-024, RULE-025; G2-001, G2-002 |
| AC-043 | **Given** an MVP interactive or navigation control, **when** used with keyboard/assistive technology or narrow viewport, **then** the action and feedback remain operable and understandable. Numeric compliance targets remain FA-007 Open. | RULE-024, RULE-025; G2-002, G2-003 |
| AC-044 | **Given** a supported prerequisite configuration in an Admin draft, **when** it is validated and published, **then** the applicable official learning action checks it through Go; unsupported or invalid configuration cannot publish. | RULE-005, RULE-020; D-018, PO-CLAR-D018 |
| AC-045 | **Given** an authenticated Student, **when** they open basic privacy controls, **then** they can initiate only their own export/deletion request and see its policy-dependent state; no unapproved deadline is shown. | RULE-024, RULE-027; D-025, G3-003, FA-006 Open |
| AC-046 | **Given** a request targeting another Student's privacy record, **when** a user attempts it, **then** access is denied without revealing or changing that record. | RULE-024, RULE-027; D-025, G3-003 |

## 5. Deliberately unapproved acceptance detail

No AC above sets an archive/unpublish visibility default, exceptional revocation rule, Path membership-change denominator, migration evidence-mapping algorithm, abandonment trigger or retry accounting, retention period, numeric accessibility target, capacity target or automatic curriculum migration. AC-037 is conditional on an explicit migration policy covering the affected evidence. Those items require the policies identified in [Domain Rules §6](02-domain-rules-and-invariants.md) or later FA-006–FA-008 gates. Tests for those specific behaviors remain **blocked**, not silently passed or failed.
