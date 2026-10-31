# DP-02 — Traceability Matrix

| Metadata | Value |
|---|---|
| Package | DP-02 — Comprehensive Domain & UX Contracts |
| Version | 0.1.0 |
| Status | **Draft — Not Approved** |
| Approval gate | AG-02 — **Not Approved** |
| Source | [Approved DP-01 baseline and governance record](../DP-01/03-decision-registry.md) |

Read each row in either direction: an approved source produces a [domain concept](01-domain-model-and-glossary.md) and [rule](02-domain-rules-and-invariants.md), exercised by a [journey/permission](03-user-journeys-and-permissions.md), presented through a [UX contract](04-ux-and-interaction-specification.md), and checked by [acceptance criteria](05-acceptance-criteria.md). `MVP` is scope classification, **not AG-02 approval**. Historical D/Q/G2 summaries rely on the prospectively approved DP-01 v0.1.2 baseline under AG-01/AG-01-EG-B; unknown D-001–D-008 and D-029 are not independent sources.

## 1. Decision → requirement → verification

| Approved source decision | Domain | Rule | Journey / permission | UX | Acceptance | Scope / dependency |
|---|---|---|---|---|---|---|
| D-012, Q-004, Q-007 | DOM-003, DOM-004, DOM-005 | RULE-011, RULE-020 | JRN-003, JRN-017, JRN-018, PERM-002, PERM-008 | UX-004, UX-011 | AC-017, AC-032 | MVP hierarchy and Block authoring |
| D-012, Q-004, FA-004 B | DOM-001, DOM-002 | RULE-001 | JRN-002, JRN-013, PERM-001 | UX-002, UX-009 | AC-003, AC-019 | MVP |
| FA-004 B | DOM-007, DOM-018 | RULE-002 | JRN-007, PERM-003 | UX-002 | AC-006, AC-007 | MVP; leave policy open |
| G2-001A, FA-004 B | DOM-008 | RULE-003 | JRN-008, PERM-004 | UX-003 | AC-008, AC-009, AC-010 | MVP |
| FA-005 B | DOM-006, DOM-008 | RULE-004 | JRN-008, JRN-009, PERM-004 | UX-003, UX-009 | AC-009 | MVP; eligibility details open |
| D-018, PO-CLAR-D018 | DOM-019 | RULE-005 | JRN-008, JRN-011, PERM-004 | UX-003, UX-004 | AC-011, AC-018 | MVP; exact configuration open |
| D-009, Q-001, PO-CLAR-D010-Q001 | DOM-004, DOM-021 | RULE-006 | JRN-003, JRN-004, JRN-005, PERM-002 | UX-004, UX-005, UX-006, UX-007 | AC-004, AC-005, AC-011 | MVP |
| D-017, Q-002 | DOM-021 | RULE-007 | JRN-006, PERM-012 | UX-007 | AC-012, AC-013 | MVP |
| Q-007, FA-002 B | DOM-005, DOM-011 | RULE-008 | JRN-010, JRN-019, PERM-005, PERM-009 | UX-005, UX-011 | AC-014 | MVP |
| FA-002 B | DOM-011 | RULE-009 | JRN-004, JRN-010, PERM-005 | UX-005, UX-006 | AC-013, AC-015, AC-016, AC-023 | MVP |
| D-013, Q-004, FA-002 B | DOM-009, DOM-010 | RULE-010 | JRN-011, PERM-005 | UX-004, UX-009 | AC-014, AC-017, AC-018 | MVP |
| Q-003, Q-004 | DOM-010 | RULE-011 | JRN-011, JRN-013, PERM-005 | UX-004, UX-009 | AC-017, AC-018 | MVP |
| FA-004 B, Q-004 | DOM-001, DOM-010 | RULE-012 | JRN-007, JRN-013, PERM-003 | UX-002, UX-009 | AC-019 | MVP; membership-change formula open |
| Q-003, FA-001 | DOM-006, DOM-010 | RULE-013 | JRN-011, JRN-015, PERM-005 | UX-009, UX-012 | AC-020 | MVP |
| FA-001 | DOM-010, DOM-020 | RULE-014 | JRN-016, JRN-021, PERM-010 | UX-013 | AC-021 | MVP |
| D-016, Q-005 | DOM-012 | RULE-015 | JRN-012, JRN-019, PERM-006, PERM-009 | UX-006, UX-008, UX-011 | AC-022, AC-023 | MVP; configured thresholds only |
| FA-003 B | DOM-013 | RULE-016 | JRN-012, PERM-006 | UX-008 | AC-024, AC-025, AC-031 | MVP |
| FA-003 B | DOM-013 | RULE-017 | JRN-012, PERM-006 | UX-008 | AC-026, AC-027, AC-030 | MVP |
| Q-005, FA-003 B | DOM-014, DOM-015 | RULE-018 | JRN-012, PERM-006 | UX-008 | AC-022, AC-028, AC-029, AC-030 | MVP |
| Q-005, FA-003 B | DOM-013, DOM-015 | RULE-019 | JRN-012, PERM-006 | UX-008 | AC-031 | MVP; retry limit/config open |
| D-015, Q-007, FA-005 B | DOM-005, DOM-016 | RULE-020 | JRN-017, JRN-018, JRN-019, JRN-020, PERM-008 | UX-011, UX-012 | AC-032, AC-033, AC-034, AC-040 | MVP |
| FA-005 B | DOM-006, DOM-008 | RULE-021 | JRN-015, JRN-020, PERM-008 | UX-003, UX-012 | AC-034, AC-035 | MVP |
| FA-005 B, FA-001 | DOM-020 | RULE-022 | JRN-016, JRN-021, PERM-010 | UX-013 | AC-036, AC-037, AC-038 | MVP; evidence mapping open |
| FA-005 B, G3-003 | DOM-006, DOM-010 | RULE-023 | JRN-016, JRN-021, PERM-010 | UX-013 | AC-037 | MVP boundary; FA-006 retention Open |
| D-019, D-025, Q-006 | DOM-017, DOM-018 | RULE-024 | JRN-014, JRN-022, PERM-007, PERM-008 | UX-010, UX-014 | AC-033, AC-039, AC-040, AC-042, AC-043 | MVP |
| D-021, PO-CLAR-D021 | DOM-001, DOM-002 | RULE-025 | JRN-001, JRN-002, PERM-001 | UX-001, UX-014 | AC-001, AC-002, AC-042, AC-043 | MVP discovery; recommendations deferred |
| Q-006, G3-001 | DOM-018 | RULE-026 | JRN-022, PERM-011 | UX-011, UX-014 | AC-041 | MVP |
| D-025, G3-003 | DOM-022 | RULE-027 | JRN-023, PERM-013 | UX-015 | AC-045, AC-046 | MVP request boundary; FA-006 processing Open |
| D-018, PO-CLAR-D018 | DOM-019 | RULE-005, RULE-020 | JRN-019, PERM-009 | UX-011 | AC-044 | MVP supported prerequisite authoring |

## 2. Reverse coverage and source rules

- **Rules:** RULE-001–RULE-027 each have at least one source, journey/permission, UX contract and AC in §1. The AC column is the reverse lookup from acceptance to its rule; the individual AC entries also cite their rules.
- **Journeys:** JRN-001–JRN-023 cover Guest (001–006), Student (007–016 and 023) and Admin (017–022). PERM-001–PERM-013 state role boundaries. The [journey document](03-user-journeys-and-permissions.md) owns their detailed flows.
- **UX:** UX-001–UX-015 cover catalog, details, reader, interactive blocks, knowledge checks, auth/recovery, assessment, dashboard/workspace, Admin CMS/publishing/migration and basic privacy controls. The [UX document](04-ux-and-interaction-specification.md) owns loading, empty, error, responsive and accessibility states.
- **Acceptance:** AC-001–AC-046 cover committed behaviors and known conditional boundaries; each AC cites at least one approved rule/source. No AC promotes rule-based recommendations, AI grading, code execution, payments or automatic curriculum migration into MVP.

## 3. Coverage gaps and conditional dependencies

| ID | Missing approved detail / impact | Status and gate |
|---|---|---|
| GAP-001 | Unpublish/archive public visibility, previously enrolled access and exceptional revocation are not determined by FA-005 B; UX-002, UX-003, UX-004 and JRN-009 cannot finalize these states. | Material contract question for AG-02; no default chosen. |
| GAP-002 | Path membership snapshot/denominator under later Course changes, progress visibility before joining and Path leave behavior are not determined by FA-004 B; RULE-012/JRN-013 show derived progress without an invented formula. | Material contract question for AG-02; no default chosen. |
| GAP-003 | Migration evidence mapping, eligible-version criteria beyond publication, exact active-attempt context and abandoned-attempt retry accounting lack approved detail; RULE-004, RULE-016, RULE-017, RULE-022 are bounded but not fully executable policies. | Material contract questions for AG-02 where these behaviors must be accepted. |
| GAP-004 | FA-006 retention/deletion and historical content lifetime. | Open; AG-03, consistency AG-04. |
| GAP-005 | FA-007 numeric UX, accessibility, performance and beta thresholds. | Open; AG-05. |
| GAP-006 | FA-008 capacity, hosting, recovery and monitoring parameters. | Open; AG-04. |
| GAP-007 | Supported prerequisite types/targets and exact effects on official actions are not determined by D-018/PO-CLAR-D018; RULE-005 is an enforcement boundary, not a configuration policy. | Material contract question for AG-02; no type or policy invented. |

**Contradiction audit:** No known contradiction within the approved rules is asserted. The conditional gaps above are not resolved by this draft. Historical evidence gaps EG-001–EG-003 remain visible in [DP-01](../DP-01/04-open-decisions-register.md) under AG-01-EG-B; they are not independent DP-02 requirement sources.
