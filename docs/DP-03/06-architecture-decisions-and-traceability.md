# DP-03 — Architecture Decisions & Traceability

| Metadata | Value |
|---|---|
| Package | DP-03 — Domain-Aligned Architecture & Data Contracts |
| Version | v0.1.3 — subsequent administrative addendum after the six-document v0.1.0 snapshot |
| Status | **DP-03 v0.1.0 Conditionally Approved; this addendum records later governance only** |
| Approval gate | AG-03 — **Conditionally Approved for six v0.1.0 documents** |
| Approved sources | [DP-01 Decision Registry](../DP-01/03-decision-registry.md), [Open Decisions Register](../DP-01/04-open-decisions-register.md), [DP-02 rules](../DP-02/02-domain-rules-and-invariants.md), [acceptance criteria](../DP-02/05-acceptance-criteria.md), [conditional AG-02 addendum](../DP-02/06-traceability-matrix.md) |

`ADR` IDs below are **proposed architecture decisions for AG-03 review**, not additional approved product decisions. DP-01 v0.1.2 remains the approved prospective product baseline; DP-01 v0.1.4 and DP-02's v0.1.2 traceability addendum record later governance without retroactively changing approved snapshots. AG-02 is **Conditionally Approved** for the six DP-02 v0.1.1 documents. GAP-001/002/003/007 remain Open, and their dependent implementation is unauthorized. FA-006 B is approved; FA-007/008 remain Open.

## 1. Approved product and technical inputs

| Source | Approved or conditional substance | DP-03 treatment |
|---|---|---|
| G3-001/002/003, D-027 | Supabase Auth/PostgreSQL/Storage with Go-owned business layer; modular monolith, pragmatic hexagonal boundaries, privacy lifecycle. Historical wording remains subject to EG-001–EG-003 provenance limits. | Propose trust, module, data and transaction boundaries; no microservice or direct browser write to core LMS data. |
| FA-001/002/003 | Prospective completion; tiered evidence; version-locked expiring Attempts, immutable grades and preserved passing. | Preserve version context and historical achievements while account remains active; enforce Attempt uniqueness and evidence authority. |
| FA-004 B / FA-005 B | Independent Path/Course participation; global Course completion; pinned published Course versions and manual controlled migration. | Separate participation, enrollment, completion and publishing owners; do not auto-enroll or silently migrate. |
| AG02-01–AG02-05 | Archive/access, Path preview/official progress, explicit migration mapping, exact Attempt context/retry accounting, Course-completion prerequisite type. | Incorporate approved guards while leaving GAP-001/002/003/007 details conditional. |
| FA-006 B | Lifecycle-Based Deletion & Data Minimization with valid authenticated request, access invalidation, personal-data disposition, 30-day active-data and backup targets, 180-day security-audit target, no silent resurrection. | Propose deletion coordinator, owner cleanup, provider reconciliation and restore safeguards. These are Product Owner targets, not legal claims. |

## 2. Architecture proposals and trade-offs

Every row is **Proposed — AG-03 review required**. Alternatives are considered designs, not newly approved product options. Module (`MOD`), entity (`ENT`) and transaction (`TX`) IDs resolve in the linked owner documents: [modules](02-module-boundaries-and-dependencies.md), [data model](03-logical-data-model.md), [transactions](05-consistency-and-transaction-design.md).

| ID / context | Approved source → proposed consequence | Alternative and trade-off | Risk / open dependency | Affected contracts |
|---|---|---|---|---|
| ADR-001 Go system boundary | G3-001/002 → one Go modular monolith with inward domain dependencies and adapters for Supabase/PostgreSQL. | Per-domain services add distributed consistency/operations; unstructured monolith blurs ownership. | Module boundaries could erode without review; FA-008 deployment remains open. | MOD-001–MOD-011; TX-001–TX-020; overview §2. |
| ADR-002 Identity authority | D-011, Q-006, G3-001, FA-006 B → verify Supabase identity at Go boundary, map to internal Account/role/lifecycle state, gate deleting accounts. | Trusting browser role/token claims alone cannot enforce LMS authorization or deletion restriction. | Token verification/key rotation details belong to DP-04; no privileged browser credential. | MOD-001/010/011; ENT-001/002/027; TX-016/020. |
| ADR-003 Owned data in shared PostgreSQL | G3-002/003 → each module owns writes and invariants; cross-module reads use capabilities or projections. | Shared arbitrary table writes are simpler initially but obscure authorization and transaction ownership. | Cross-module read latency/projections require coherent recheck; FA-008 scale open. | MOD-001–MOD-011; ENT-001–ENT-030; TX-001–TX-020. |
| ADR-004 Global completion with independent Path participation | FA-004 B, AG02-02, Q-004 → separate join and enrollment; derive Path progress from global Course achievement and applicable member Courses. | Per-Path Course completion duplicates evidence and can conflict. | Path leave and curriculum migration GAP-002. | MOD-004/005/006; ENT-004/011/012/014; TX-001/011/012/013. |
| ADR-005 Immutable published versions and pins | FA-005 B, AG02-01/03, FA-001 → frozen published snapshots, explicit enrollment pin and auditable controlled migration. | Mutable live Course content can silently change old learner requirements. | Archive visibility/revocation GAP-001; target eligibility and compatibility GAP-003. | MOD-003/005/006; ENT-006/012/028/029; TX-002–TX-005/015. |
| ADR-006 Evidence and assessment authority | FA-002/003, AG02-04 → server-tiered evidence, version-locked one-active-attempt context, atomic submission/immutable Result and policy-counted terminal history. | Browser evidence or mutable grading is simpler but cannot prove official outcomes. | Abandonment trigger GAP-003; numeric retry/threshold remains configured, not invented. | MOD-007/008/006; ENT-015/017–021; TX-006–TX-011. |
| ADR-007 Course-completion prerequisites | D-018, PO-CLAR-D018, AG02-05 → authored reference to another canonical Course; Go checks global completion at applicable protected action. | General expression/rule engine expands MVP and complicates audit. | Exact protected actions GAP-007; no score/skill/time types. | MOD-003/006; ENT-014/022; TX-014. |
| ADR-008 Privacy coordinator with owner cleanup | G3-003, FA-006 B → accepted request atomically restricts Go access; retry-safe coordinator asks each owner to dispose of its linked data and reconciles Auth/Storage. | One giant cross-provider transaction is unavailable; soft delete alone fails erasure. | Class-by-class delete versus irreversible de-identification requires applicable policy; no indefinite exception inferred. | MOD-001/004–MOD-011; ENT-001/011–015/018–030; TX-016/017; lifecycle §§1–3. |
| ADR-009 Restore and minimized audit | FA-006 B, Q-006 → protected deletion suppression/replay on restore and nonpayload security audit with 180-day retention. | Restoring stale backups directly can resurrect deleted data; raw logs undermine minimization. | Backup/restore mechanics FA-008; legitimate legal obligation may alter audit retention only where applicable. | MOD-010/011; ENT-026/027/030; TX-017/018. |
| ADR-010 Narrow Storage access | G3-001/003, FA-006 B → Go authorizes private object operations and coordinates deletion; public published assets follow approved access policy. | Browser-held privileged credentials expose all objects; unrestricted public buckets expose private Student files. | Concrete bucket policy and provider configuration belong to DP-04/FA-008. | MOD-003/009/010; ENT-030; TX-017. |
| ADR-011 Local atomicity plus durable external work | G3-002, FA-005 B, AG02-03, FA-006 B → use local transactions for pin/grade/completion and durable, idempotent notices/audit/deletion work. | Fully asynchronous core proof risks false completion; cross-provider atomicity is not available. | Delivery and recovery implementation mechanics need later design, not a new product rule. | MOD-005/006/008/010/011; ENT-014/018–020/027–029; TX-009/011/015–018. |

## 3. DP-01 → DP-02 → DP-03 traceability

The [architecture overview](01-architecture-overview.md) owns system/trust boundaries; [modules](02-module-boundaries-and-dependencies.md) own behavior/data responsibility; [data model](03-logical-data-model.md) owns logical records; [lifecycle](04-data-lifecycle-and-retention.md) owns FA-006 B disposition; [transactions](05-consistency-and-transaction-design.md) own consistency behavior. IDs below identify direct review paths, not implementation approval.

| DP-01 / later PO source | DP-02 rule and acceptance | DP-03 architecture/data/consistency | Status |
|---|---|---|---|
| G3-001/002, Q-006 | RULE-024/026; AC-040/041 | ADR-001/002/003; MOD-001/011; ENT-001/002/026; TX-018/020 | Architecture proposed for AG-03. |
| D-009, Q-001, FA-002 B | RULE-006/007/009; AC-004/005/012/013/015/016 | ADR-002/006; MOD-001/007/009; ENT-015/031; TX-006/019 | Guest local evidence never official. |
| FA-004 B, Q-004, AG02-02 | RULE-001/002/011/012/030; AC-003/006/007/019/052–055 | ADR-004; MOD-004/005/006; ENT-004/011/012/014; TX-001/011–013 | GAP-002 Open for detailed Path transitions. |
| FA-005 B, FA-001, AG02-01/03 | RULE-004/013/020–023/028/029/031; AC-009/020/034–038/047–051/056–060 | ADR-005/011; MOD-003/005/006; ENT-006/012/014/028/029; TX-002–005/015 | GAP-001/003 Open; no silent pin migration or erasure. |
| FA-003 B, AG02-04, Q-005 | RULE-015–019; AC-022/024–031/061–063 | ADR-006/011; MOD-008; ENT-017–021; TX-007–010 | GAP-003 abandonment trigger Open. |
| D-018, PO-CLAR-D018, AG02-05 | RULE-005; AC-011/044/064–067 | ADR-007; MOD-003/006; ENT-022; TX-014 | GAP-007 protected action list Open. |
| D-025, G3-003, FA-006 B | RULE-023/024/027; AC-039/045/046 (v0.1.1 request boundary) | ADR-008/009/010; MOD-010/011 and owner modules; ENT-001/023–030; TX-016–018; lifecycle §§1–3 | FA-006 B later approved; DP-02 v0.1.1 text is historical; no retroactive AC rewrite. |

## 4. Open dependencies and approval boundary

| ID | Unresolved detail / effect on AG-03 | Owner gate |
|---|---|---|
| GAP-001 | Exact exceptional revocation/access eligibility and public archived listing. ADR-005 and TX-004/005 define only approved safeguards; conditional details cannot be implemented. | AG-02 follow-up/change control; conditional at AG-03. |
| GAP-002 | Path leave and curriculum-version migration. ADR-004 preserves global and earned completion but proposes no migration algorithm. | AG-02 follow-up/change control; conditional at AG-03. |
| GAP-003 | Evidence compatibility criteria, target eligibility beyond approved status and abandonment trigger. ADR-005/006 and TX-008/015 require policy input. | AG-02 follow-up/change control; conditional at AG-03. |
| GAP-007 | Exact protected prerequisite actions and edge cases. ADR-007 cannot define coverage by inference. | AG-02 follow-up/change control; conditional at AG-03. |
| FA-007 | Quantitative accessibility, performance and beta targets are not selected. | AG-05 downstream. |
| FA-008 | Hosting, capacity, RPO/RTO, backup mechanisms and operational thresholds are not selected. FA-006's approved privacy targets still apply. | AG-04 downstream; DP-03 assumes only managed services. |

**AG-03 decision requested:** Review the proposed architecture boundaries, logical ownership, privacy orchestration and transaction design. AG-03 remains **Not Approved** until the Product Owner decides. Conditional AG-02 does not authorize implementation of the four unresolved GAPs, and no DP-04 authoring or application implementation follows from this draft.

## 5. Subsequent governance addendum — outside the approved v0.1.0 snapshot

Sections 1–4 above retain the original Draft v0.1.0 review state. The Product Owner later **conditionally approved AG-03** for the six DP-03 v0.1.0 documents. The other five DP-03 files retain their original Draft/Not Approved metadata as a snapshot; this administrative v0.1.1 addendum changes no architecture contract. Material changes require [Decision Registry change control](../DP-01/03-decision-registry.md).

FA-006-B1 B subsequently approved deletion or irreversible de-identification of individual Student-linked learning records during account deletion, permitting only genuinely anonymous aggregate retention; pseudonymous identifiers alone do not anonymize records. FA-008 B subsequently approved INF-01–INF-14 Balanced Production MVP. These later decisions are recorded in the [Decision Registry](../DP-01/03-decision-registry.md) and [Open Decisions Register](../DP-01/04-open-decisions-register.md). The §2–§4 statements that FA-008 was Open are historical; FA-006-B1 sets the minimum disposition without choosing delete versus irreversible de-identification for each class. FA-006 B's 30-day active-data, 30-day backup and 180-day security-audit targets remain effective. Singapore remains a conditional preferred region pending legal and latency validation.

GAP-001/002/003/007 remain **Open** with dependent implementation unauthorized; FA-007 remains **Open**. AG-04 is **Not Approved** and DP-04 documentation authoring is separately authorized. Conditional AG-03 approval neither closes the GAPs nor verifies missing historical evidence.

## 6. Later governance status — v0.1.2 administrative addendum

The Product Owner subsequently **conditionally approved AG-04** for the six DP-04 v0.1.0 documents and **approved FA-007 B** for DP-05. The §5 FA-007/AG-04 statuses are historical; the original DP-03 v0.1.0 architecture contract remains unchanged. GAP-001/002/003/007 remain **Open**, with dependent implementation unauthorized. AG-05 is **Not Approved**. See the current [Decision Registry](../DP-01/03-decision-registry.md).

## 7. Later governance status — v0.1.3 administrative addendum

AG-05 was subsequently **Conditionally Approved** for six DP-05 v0.1.0 documents; §6 records its earlier state. The DP-03 v0.1.0 architecture contract remains unchanged. GAP-001/002/003/007 remain **Open** with dependent implementation unauthorized. AG-06 is **Not Approved**; no implementation or beta release is authorized. See the current [Decision Registry](../DP-01/03-decision-registry.md).
