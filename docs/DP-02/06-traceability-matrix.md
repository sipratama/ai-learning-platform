# DP-02 — Traceability Matrix

| Metadata | Value |
|---|---|
| Package | DP-02 — Comprehensive Domain & UX Contracts |
| Version | 0.1.5 — subsequent administrative addendum after the six-document v0.1.1 snapshot |
| Status | **DP-02 v0.1.1 Conditionally Approved; later addenda record governance only** |
| Approval gate | AG-02 — **Conditionally Approved for six v0.1.1 documents** |
| Source | [Approved DP-01 baseline and governance record](../DP-01/03-decision-registry.md) |

Read each row in either direction: an approved source produces a [domain concept](01-domain-model-and-glossary.md) and [rule](02-domain-rules-and-invariants.md), exercised by a [journey/permission](03-user-journeys-and-permissions.md), presented through a [UX contract](04-ux-and-interaction-specification.md), and checked by [acceptance criteria](05-acceptance-criteria.md). `MVP` is scope classification, **not implementation authorization**. AG02-01–AG02-05 are current explicit Product Owner approvals for the v0.1.1 draft, not original historical DP-01 decisions. Historical D/Q/G2 summaries rely on the prospectively approved DP-01 v0.1.2 baseline under AG-01/AG-01-EG-B; unknown D-001–D-008 and D-029 are not independent sources. Sections 1–3 below preserve the v0.1.1 contract snapshot; §4 records subsequent governance and controls current gap status.

## 1. Decision → requirement → verification

| Approved source decision | Domain | Rule | Journey / permission | UX | Acceptance | Scope / dependency |
|---|---|---|---|---|---|---|
| D-012, Q-004, Q-007 | DOM-003, DOM-004, DOM-005 | RULE-011, RULE-020 | JRN-003, JRN-017, JRN-018, PERM-002, PERM-008 | UX-004, UX-011 | AC-017, AC-032 | MVP hierarchy and Block authoring |
| D-012, Q-004, FA-004 B | DOM-001, DOM-002 | RULE-001 | JRN-002, JRN-013, PERM-001 | UX-002, UX-009 | AC-003, AC-019 | MVP |
| FA-004 B | DOM-007, DOM-018 | RULE-002 | JRN-007, PERM-003 | UX-002 | AC-006, AC-007 | MVP; Path leave policy remains unspecified |
| G2-001A, FA-004 B | DOM-008 | RULE-003 | JRN-008, PERM-004 | UX-003 | AC-008, AC-009, AC-010 | MVP |
| FA-005 B, AG02-01 | DOM-006, DOM-008, DOM-023 | RULE-004 | JRN-008, JRN-009, PERM-004 | UX-003, UX-009 | AC-009, AC-048 | MVP; exceptional eligibility policy parameters unspecified |
| D-018, PO-CLAR-D018, AG02-05 | DOM-019 | RULE-005 | JRN-008, JRN-011, PERM-004 | UX-003, UX-004 | AC-011, AC-018 | MVP; exact protected-action list unspecified |
| D-009, Q-001, PO-CLAR-D010-Q001 | DOM-004, DOM-021 | RULE-006 | JRN-003, JRN-004, JRN-005, PERM-002 | UX-004, UX-005, UX-006, UX-007 | AC-004, AC-005, AC-011 | MVP |
| D-017, Q-002 | DOM-021 | RULE-007 | JRN-006, PERM-012 | UX-007 | AC-012, AC-013 | MVP |
| Q-007, FA-002 B | DOM-005, DOM-011 | RULE-008 | JRN-010, JRN-019, PERM-005, PERM-009 | UX-005, UX-011 | AC-014 | MVP |
| FA-002 B | DOM-011 | RULE-009 | JRN-004, JRN-010, PERM-005 | UX-005, UX-006 | AC-013, AC-015, AC-016, AC-023 | MVP |
| D-013, Q-004, FA-002 B | DOM-009, DOM-010 | RULE-010 | JRN-011, PERM-005 | UX-004, UX-009 | AC-014, AC-017, AC-018 | MVP |
| Q-003, Q-004 | DOM-010 | RULE-011 | JRN-011, JRN-013, PERM-005 | UX-004, UX-009 | AC-017, AC-018 | MVP |
| FA-004 B, Q-004, AG02-02 | DOM-001, DOM-010, DOM-025 | RULE-012 | JRN-007, JRN-013, PERM-003, PERM-016 | UX-002, UX-009 | AC-019, AC-052, AC-053, AC-055 | MVP; detailed Path curriculum migration unspecified |
| Q-003, FA-001 | DOM-006, DOM-010 | RULE-013 | JRN-011, JRN-015, PERM-005 | UX-009, UX-012 | AC-020 | MVP |
| FA-001 | DOM-010, DOM-020 | RULE-014 | JRN-016, JRN-021, PERM-010 | UX-013 | AC-021 | MVP |
| D-016, Q-005 | DOM-012 | RULE-015 | JRN-012, JRN-019, PERM-006, PERM-009 | UX-006, UX-008, UX-011 | AC-022, AC-023 | MVP; configured thresholds only |
| FA-003 B | DOM-013 | RULE-016 | JRN-012, PERM-006 | UX-008 | AC-024, AC-025, AC-031 | MVP |
| FA-003 B | DOM-013 | RULE-017 | JRN-012, PERM-006 | UX-008 | AC-026, AC-027, AC-030 | MVP |
| Q-005, FA-003 B | DOM-014, DOM-015 | RULE-018 | JRN-012, PERM-006 | UX-008 | AC-022, AC-028, AC-029, AC-030 | MVP |
| Q-005, FA-003 B | DOM-013, DOM-015 | RULE-019 | JRN-012, PERM-006 | UX-008 | AC-031 | MVP; retry limit/config open |
| D-015, Q-007, FA-005 B | DOM-005, DOM-016 | RULE-020 | JRN-017, JRN-018, JRN-019, JRN-020, PERM-008 | UX-011, UX-012 | AC-032, AC-033, AC-034, AC-040 | MVP |
| FA-005 B | DOM-006, DOM-008 | RULE-021 | JRN-015, JRN-020, PERM-008 | UX-003, UX-012 | AC-034, AC-035 | MVP |
| FA-005 B, FA-001, AG02-03 | DOM-020, DOM-024 | RULE-022 | JRN-016, JRN-021, PERM-010 | UX-013 | AC-036, AC-037, AC-038, AC-056, AC-059, AC-060 | MVP; explicit compatibility mapping required |
| FA-005 B, G3-003 | DOM-006, DOM-010 | RULE-023 | JRN-016, JRN-021, PERM-010 | UX-013 | AC-037 | MVP boundary; FA-006 retention Open |
| D-019, D-025, Q-006 | DOM-017, DOM-018 | RULE-024 | JRN-014, JRN-022, PERM-007, PERM-008 | UX-010, UX-014 | AC-033, AC-039, AC-040, AC-042, AC-043 | MVP |
| D-021, PO-CLAR-D021 | DOM-001, DOM-002 | RULE-025 | JRN-001, JRN-002, PERM-001 | UX-001, UX-014 | AC-001, AC-002, AC-042, AC-043 | MVP discovery; recommendations deferred |
| Q-006, G3-001 | DOM-018 | RULE-026 | JRN-022, PERM-011 | UX-011, UX-014 | AC-041 | MVP |
| D-025, G3-003 | DOM-022 | RULE-027 | JRN-023, PERM-013 | UX-015 | AC-045, AC-046 | MVP request boundary; FA-006 processing Open |
| D-018, PO-CLAR-D018 | DOM-019 | RULE-005, RULE-020 | JRN-019, PERM-009 | UX-011 | AC-044 | MVP supported prerequisite authoring |
| AG02-01 | DOM-006, DOM-023 | RULE-021, RULE-028, RULE-029 | JRN-002, JRN-008, JRN-009, JRN-024, JRN-025, PERM-004, PERM-014, PERM-015 | UX-003, UX-016 | AC-047, AC-048, AC-049, AC-050, AC-051 | MVP; normal archive distinct from exceptional revocation |
| AG02-02 | DOM-001, DOM-007, DOM-010, DOM-025 | RULE-002, RULE-012, RULE-013, RULE-030 | JRN-007, JRN-013, PERM-003, PERM-016 | UX-002, UX-009 | AC-052, AC-053, AC-054, AC-055 | MVP; Path leave/curriculum migration unspecified |
| AG02-03 | DOM-006, DOM-020, DOM-024 | RULE-022, RULE-031 | JRN-016, JRN-021, PERM-010 | UX-013 | AC-056, AC-057, AC-058, AC-059, AC-060 | MVP; explicit mapping, no automatic equivalence |
| AG02-04 | DOM-013, DOM-015 | RULE-016, RULE-017, RULE-019 | JRN-012, PERM-006 | UX-008 | AC-061, AC-062, AC-063 | MVP; numeric retry limit unspecified |
| AG02-05 | DOM-019 | RULE-005, RULE-020 | JRN-008, JRN-019, PERM-004, PERM-009 | UX-003, UX-011 | AC-064, AC-065, AC-066, AC-067 | MVP; Course-completion type only |

## 2. Reverse coverage and source rules

- **Rules:** RULE-001–RULE-031 each have at least one source, journey/permission, UX contract and AC in §1. The AC column is the reverse lookup from acceptance to its rule; individual AC entries also cite their rules.
- **Journeys:** JRN-001–JRN-025 cover Guest (001–006), Student (007–016 and 023) and Admin (017–022 and 024–025). PERM-001–PERM-016 state role boundaries. The [journey document](03-user-journeys-and-permissions.md) owns their detailed flows.
- **UX:** UX-001–UX-016 cover catalog, details, reader, interactive blocks, knowledge checks, auth/recovery, assessment, dashboard/workspace, Admin CMS/publishing/migration, privacy controls and archive/revocation. The [UX document](04-ux-and-interaction-specification.md) owns loading, empty, error, responsive and accessibility states.
- **Acceptance:** AC-001–AC-067 cover committed behaviors and known conditional boundaries; each AC cites at least one approved rule/source. No AC promotes rule-based recommendations, AI grading, code execution, payments or automatic curriculum migration into MVP.

## 3. Coverage gaps and conditional dependencies

| ID | Missing approved detail / impact | Status and gate |
|---|---|---|
| GAP-001 | AG02-01 resolves normal archive/unpublish and exceptional revocation boundaries. Exact exceptional access-eligibility/revocation policy parameters and public listing behavior remain unspecified; no indefinite content access follows. | Core resolved; conditional policy edge for AG-02. |
| GAP-002 | AG02-02 resolves preview versus official Path progress and prospective membership-change protection. Detailed Path curriculum-version migration and leave behavior remain unspecified. | Core resolved; conditional policy edge for AG-02. |
| GAP-003 | AG02-03/04 resolve explicit evidence mapping, Attempt context and expired/abandoned retry accounting. Exact compatibility criteria, target eligibility beyond approved status and abandonment trigger remain policy inputs; no automatic algorithm or numeric limit is inferred. | Core resolved; conditional policy edge for AG-02. |
| GAP-004 | FA-006 retention/deletion and historical content lifetime. | Open; AG-03, consistency AG-04. |
| GAP-005 | FA-007 numeric UX, accessibility, performance and beta thresholds. | Open; AG-05. |
| GAP-006 | FA-008 capacity, hosting, recovery and monitoring parameters. | Open; AG-04. |
| GAP-007 | AG02-05 resolves Course-completion prerequisite type and cross-Path target. Exact protected-action coverage and edge cases remain unspecified; no extra prerequisite types are inferred. | Core resolved; conditional policy edge for AG-02. |

**v0.1.1 contradiction audit (historical snapshot):** No known contradiction within approved rules was asserted. AG02-01–AG02-05 resolved the five material questions from v0.1.0; the narrower policy edges remained explicit, and FA-006–FA-008 were Open at that time. Historical evidence gaps EG-001–EG-003 remain visible in [DP-01](../DP-01/04-open-decisions-register.md) under AG-01-EG-B; they are not independent DP-02 requirement sources. Current status is in §4.

## 4. Subsequent governance addendum — not part of the approved v0.1.1 snapshot

The Product Owner later **conditionally approved AG-02** for the six DP-02 v0.1.1 documents. The other five files retain their original Draft/Not Approved snapshot metadata; that metadata reports their state when authored, not the later approval disposition. This v0.1.2 administrative addendum does not amend their business rules or acceptance criteria. Material changes require the [Decision Registry change control](../DP-01/03-decision-registry.md).

| ID | Current status and effect |
|---|---|
| GAP-001 | **Open.** Exceptional access-eligibility/revocation parameters and public listing behavior remain undecided. |
| GAP-002 | **Open.** Detailed Path curriculum-version migration and leave behavior remain undecided. |
| GAP-003 | **Open.** Evidence compatibility criteria, target eligibility beyond approved status and abandonment trigger remain undecided. |
| GAP-007 | **Open.** Exact protected prerequisite action coverage and edge cases remain undecided. |
| FA-006 / GAP-004 | **FA-006 Approved — Option B** after v0.1.1; the §3 “Open” status is historical. Lifecycle-Based Deletion & Data Minimization is recorded in the [Decision Registry](../DP-01/03-decision-registry.md) and [Open Decisions Register](../DP-01/04-open-decisions-register.md). |
| FA-007 / GAP-005 | **Open** for AG-05. |
| FA-008 / GAP-006 | **Open** for AG-04. |

Requirements depending on unresolved GAP-001/002/003/007 detail are **not authorized for implementation**. Conditional AG-02 approval does not approve those details, AG-03, or application work. Historical evidence gaps EG-001–EG-003 remain unverified.

## 5. Later governance status — v0.1.3 administrative addendum

The Product Owner later conditionally approved the six DP-03 v0.1.0 documents through AG-03 and approved FA-006-B1 B and FA-008 B. The §4 statement that AG-03 is unapproved and FA-008 is Open records its earlier state. FA-006-B1 B requires deletion or irreversible de-identification of individual Student-linked learning records; only genuinely anonymous aggregates may remain. FA-008 B approves INF-01–INF-14, with Singapore only conditionally preferred. See the current [Decision Registry](../DP-01/03-decision-registry.md). GAP-001/002/003/007 remain **Open**, FA-007 remains **Open**, and dependent implementation remains unauthorized. AG-04 is **Not Approved**. No DP-02 business rule or acceptance criterion is changed by this addendum.

## 6. Later governance status — v0.1.4 administrative addendum

The Product Owner subsequently **conditionally approved AG-04** for six DP-04 v0.1.0 documents and **approved FA-007 B**. The §5 FA-007/AG-04 statuses are historical. GAP-001/002/003/007 remain **Open** and dependent implementation blocked. AG-05 is **Not Approved**. This addendum changes no DP-02 rule or acceptance criterion; current decision wording is in the [Decision Registry](../DP-01/03-decision-registry.md).

## 7. Later governance status — v0.1.5 administrative addendum

The Product Owner subsequently **conditionally approved AG-05** for the six DP-05 v0.1.0 documents. The §6 AG-05 status is historical. FA-007 B remains Approved; GAP-001/002/003/007 remain **Open** and dependent implementation blocked. AG-06 is **Not Approved**; no slice implementation or beta release follows from the DP-05 documentation approval. This addendum changes no DP-02 domain rule or AC; see the current [Decision Registry](../DP-01/03-decision-registry.md).
