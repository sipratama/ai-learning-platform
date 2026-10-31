# DP-02 — UX & Interaction Specification

| Metadata | Value |
|---|---|
| Package | DP-02 — Comprehensive Domain & UX Contracts |
| Version | 0.1.0 |
| Status | **Draft — Not Approved** |
| Approval gate | AG-02 — **Not Approved** |
| Behavioral source | [User Journeys](03-user-journeys-and-permissions.md), [Domain Rules](02-domain-rules-and-invariants.md) |

This is a behavioral UX contract, not a visual design or frontend implementation. A screen never presents local activity as official passing, and it must distinguish the Student's pinned published version from newer available versions. Numeric accessibility/performance targets remain FA-007 Open.

## 1. Screen and interaction contracts

| ID | User intent and visible information | Primary action and navigation | Access / related IDs |
|---|---|---|---|
| UX-001 Public catalog | Find a Path or Course; show discoverable titles, summaries, search/filter state and access labels. | Search/filter; open Path or Course detail; reset filters. | Public; JRN-001, PERM-001, RULE-025 |
| UX-002 Path detail | Understand Path purpose, member Courses and derived progress when signed in; distinguish participation from Course enrollment. | Open Course; Student may join Path; Guest prompted to authenticate for official participation. | Public detail where discoverable; JRN-002, JRN-007, JRN-013, RULE-002, RULE-012 |
| UX-003 Course detail | Understand Course, published/version context, free access, required activities and enrollment state. | Open free Lesson; Student enrolls explicitly or begins official action; resume pinned version. | Public detail where discoverable; JRN-002, JRN-008, JRN-009, RULE-003–006 |
| UX-004 Lesson Reader | Learn in Lesson/Module context; show structured Blocks, position, required conditions and authoritative completion state separately. | Navigate available Lessons; interact; Student explicitly completes when eligible. | Guest free reading; Student official actions; JRN-003, JRN-009, JRN-011, RULE-006, RULE-010 |
| UX-005 Interactive Block | Engage with rich text/media/code/callout, flashcards, prompt practice, step-by-step and template diagram/timeline; expose activity status appropriate to its tier. | Interact, review feedback or retry local exercise where offered. | Guest local or Student under published policy; JRN-004, JRN-010, RULE-008, RULE-009 |
| UX-006 Knowledge check | Practice single/multi checks with feedback; label ungraded local check distinctly from graded assessment. | Select, check and review feedback; return to Lesson. | Guest local and Student; JRN-004, JRN-010, RULE-009, RULE-015 |
| UX-007 Authentication and recovery | Explain why official actions need Student login and which local state may be recovered. | Sign up/login; optionally select eligible local position/draft/settings for safe merge or decline. | Guest → Student; JRN-005, JRN-006, RULE-006, RULE-007 |
| UX-008 Graded assessment | Show assessment version context, configured passing/retry terms when available, one active Attempt, remaining time/expiry and submitted Result. | Start/resume active Attempt; answer; submit once; view immutable result; retry only if policy allows. | Authenticated Student; JRN-012, RULE-015–019 |
| UX-009 Student dashboard | Review Course enrollment, canonical completions, derived Path progress and resume entry points; distinguish no enrollment from no progress. | Resume pinned Course; open Path/Course progress. | Own Student data; JRN-013, JRN-014, RULE-011, RULE-012, RULE-024 |
| UX-010 Student workspace | Manage own notes, bookmarks and reading preferences, including concise/detail reader choices where supported. | Add/edit/remove own item; navigate back to associated Lesson. | Own Student data; JRN-014, RULE-024 |
| UX-011 Admin CMS | Organize Path/Course/Module/Lesson/Block, configure supported prerequisites, use visual/Markdown editor and preview each MVP Block with validation feedback. | Save draft, validate, preview; open publication flow. | Authorized Admin; JRN-017–019, RULE-005, RULE-008, RULE-020, RULE-024 |
| UX-012 Publish/version review | Compare draft and published context, show validation outcome and affected new-versus-existing enrollment behavior. | Publish validated distinct version or retain draft; show audit/confirmation. | Authorized Admin; JRN-020, RULE-020, RULE-021 |
| UX-013 Controlled migration | Show selected enrollment, source/target published versions, explicit policy/authorization, expected learner communication and protected historical evidence. | Admin reviews and executes manual migration; Student sees communication/result. | Authorized Admin and affected Student view; JRN-015, JRN-016, JRN-021, RULE-014, RULE-022, RULE-023 |
| UX-014 Contextual navigation and access states | Show distinct responsive Public, Student Workspace, Lesson Reader and Admin contexts; location and available actions are clear. | Move between permitted areas; recover from missing/unauthorized content. | Role-scoped; JRN-001–022, RULE-024, RULE-025 |
| UX-015 Student privacy controls | Understand own-data export/account deletion request options and policy-dependent processing state without a fabricated deadline. | Initiate own request or return to workspace. | Authenticated Student; JRN-023, PERM-013, RULE-027; FA-006 processing conditional |

## 2. Loading, empty, validation and error states

| ID | Loading / empty | Validation / error and recovery | Responsive and accessibility contract |
|---|---|---|---|
| State for UX-001 | Loading indicator; no-match state with clear filters. | Search failure preserves query and offers retry. | Search/filter controls labeled, keyboard usable; results announce changes without losing focus. |
| State for UX-002 | Path loading; no member Courses shown as genuine empty state. | Unavailable Path uses policy-dependent safe access state; failed join leaves unjoined state. | Course list and join action usable at narrow widths and by keyboard. |
| State for UX-003 | Detail loading; no eligible published version gives unavailable state. | Unmet prerequisite or enrollment failure explains next action; no false enrollment. | Enrollment action has clear name/status and focusable error message. |
| State for UX-004 | Lesson/block loading; empty Lesson is an authoring issue, not a false completion. | Failed block/media shows retry/fallback; unmet evidence enumerated on completion rejection. | Reading order, headings, media alternatives, focus and keyboard movement remain usable on mobile/desktop. |
| State for UX-005 | Interactive asset loading; absent optional activity may be skipped only when policy says optional. | Invalid input or failure does not mark authoritative passing. | Interaction has non-color feedback, labels and keyboard operation; motion is not necessary to understand outcome. |
| State for UX-006 | Check loading; unanswered state visible. | Invalid choice explains correction; local feedback cannot look like official score. | Questions/choices grouped and announced; selection and result operable without pointer. |
| State for UX-007 | Authentication/merge progress; no recoverable local state states that plainly. | Auth failure returns to safe Guest state; merge conflict shows eligible items and keeps server evidence intact. | Focus moves to errors; recovery choices and consent are explicit and keyboard accessible. |
| State for UX-008 | Attempt creation/grading loading; no active Attempt shows start only if eligible. | Expired/abandoned/late/version-mismatch state blocks submit and offers configured next action; duplicate submit never shows two grades. | Time/expiry is conveyed in text, not color alone; warnings and result readable by assistive technology. |
| State for UX-009 | Progress loading; no participation/enrollment distinct from zero completion. | Data failure shows retry without fabricated progress. | Progress text accompanies visualization and remains understandable at narrow widths. |
| State for UX-010 | Own items loading; empty notes/bookmarks invite creation. | Save/conflict/unauthorized errors preserve user input where safe and avoid cross-user disclosure. | Form labels, focus, reading preferences and controls work by keyboard and touch. |
| State for UX-011 | Draft/preview loading; empty content shows authoring prompt. | Unsupported/invalid Block or policy prevents publish with field-level feedback. | Editor and preview expose structure and validation to keyboard/screen reader; responsive Admin layout preserves actions. |
| State for UX-012 | Validation/publish progress; no draft cannot publish. | Permission or validation failure preserves previous published version; success identifies new version and pinning effect. | Confirmation and errors announced; version labels are textual and unambiguous. |
| State for UX-013 | Migration review/execution progress; no eligible target prevents action. | Missing policy/authorization or failure leaves old pin and evidence; show audit-safe status and support route. | Explicit confirmation, affected-version text, focus handling and learner notice usable on small screens. |
| State for UX-014 | Each area has loading and meaningful empty state. | Unauthorized/not-found/error states do not leak protected content; retry/back navigation remains available where allowed. | Context navigation has landmarks, visible focus and responsive order; no action depends solely on hover. |
| State for UX-015 | Request state loads; no prior request is clearly distinguished from pending processing. | Invalid or cross-account action is rejected without disclosure; no unapproved completion promise. | Request controls and status are labeled, keyboard accessible and legible at narrow widths. |

## 3. Interaction boundaries

- **Official versus local:** Student server-verified evidence and Guest local practice must be labeled differently wherever shown (UX-004–UX-009).
- **Pinned version:** A new publication may be visible as an update, but opening a currently enrolled Course continues its pinned version unless controlled migration succeeds (UX-003, UX-009, UX-012, UX-013).
- **Deferred scope:** Rule-based recommendations, AI grading/tutor, executable sandbox, broad gamification and payment interfaces are not MVP UX requirements.
- **Unresolved:** FA-005 B does not establish unpublish/archive visibility or exceptional revocation behavior. FA-006 controls retention; FA-007 controls quantitative accessibility/UX/performance targets; FA-008 controls operational targets. UX-002, UX-003, UX-004, UX-013 must not imply permanent historical content access.
