# DP-04 — Security & Operations Traceability

| Metadata | Value |
|---|---|
| Package | DP-04 — API, Security & Operations Contracts |
| Version | v0.1.2 — administrative addendum after the six-document v0.1.0 snapshot |
| Status | **DP-04 v0.1.0 Conditionally Approved; addendum records later governance only** |
| Approval gate | AG-04 — **Conditionally Approved for six v0.1.0 documents** |
| Approved sources | [DP-01 Decision Registry](../DP-01/03-decision-registry.md) and [Open Decisions Register](../DP-01/04-open-decisions-register.md); [DP-02 rule/AC sources](../DP-02/06-traceability-matrix.md); [DP-03 architecture decisions and AG-03 addendum](../DP-03/06-architecture-decisions-and-traceability.md) |

This matrix links **DP-01/current Product Owner source → DP-02 behavior → DP-03 architecture → DP-04 proposed API/security/operations → planned verification**. The approval column refers to product/governance source status, not approval of DP-04 methods or controls. All `API`, `SEC`, `WF`, `OPS`, `OBS`, `RB` and `TRC` contracts are Draft proposals for AG-04 review. No verification evidence has been collected or asserted here. AG-02 and AG-03 are conditionally approved for their named snapshots; GAP-001/002/003/007 remain Open and dependent implementation unauthorized. FA-007 remains Open; AG-04 is Not Approved.

## 1. Forward traceability and approval boundary

| ID / source and status | DP-02 rule / AC | DP-03 architecture | DP-04 API / workflow | Security / operational control | Planned verification evidence; dependency |
|---|---|---|---|---|---|
| TRC-001 D-021, PO-CLAR-D021; approved current scope | RULE-025; AC-001/002/042/043 | ADR-001/003; MOD-002/003; TX-003 | API-001–API-004; WF-001 | SEC-014/018/020; OPS-001/009; OBS-001/003; RB-001 | Search/filter, safe visibility and error tests; archived listing GAP-001 **Open**, branch blocked. |
| TRC-002 D-009, Q-001, FA-002 B; approved | RULE-006/007/009; AC-004/005/012/013/015 | ADR-002/006; MOD-001/007/009; ENT-031; TX-006/019 | API-005/006/015; WF-002/005/006 | SEC-007/012/017/020; OPS-004; OBS-008 | Guest access and forged-local-pass rejection tests; no Guest official evidence. |
| TRC-003 D-011, Q-006, G3-001; approved prospectively with historical source limits | RULE-024/026; AC-040/041 | ADR-001/002; MOD-001/011; TX-020 | API-006/029–API-033/038; WF-011/018 | SEC-001–SEC-008/021/023/024; OPS-006–OPS-008/019; OBS-006; RB-002/010 | Token claim, cross-role, bootstrap and privileged-audit tests; no public Admin grant. |
| TRC-004 FA-004 B, AG02-02; approved | RULE-001/002/012/030; AC-003/006/007/019/052–055 | ADR-004; MOD-004/006; ENT-004/011/014; TX-001/012/013 | API-003/007–API-009; WF-003 | SEC-007; OBS-010 | Join/preview/global completion tests; Path leave/curriculum migration GAP-002 **Open**, no endpoint. |
| TRC-005 G2-001A, FA-005 B, AG02-01; approved core | RULE-003/004/021/028; AC-008–010/035/047/048 | ADR-005; MOD-003/005; ENT-006/012; TX-002/004 | API-004/010–API-013/033; WF-004/005/012/014 | SEC-007/008/014; OPS-003; OBS-008/010; RB-003 | Enroll/archive race, pin and retained-access tests; public listing GAP-001 **Open**. |
| TRC-006 D-018, PO-CLAR-D018, AG02-05; approved type/target | RULE-005; AC-011/044/064–067 | ADR-007; MOD-003/006; ENT-022; TX-014 | API-010/014/030; WF-004/010/011 | SEC-013/019; OBS-008 | Go-side unmet/global-completion and unsupported-type tests; exact action list GAP-007 **Open**, blocked. |
| TRC-007 FA-002 B; approved | RULE-008/009; AC-014–016 | ADR-006; MOD-007; ENT-015; TX-006 | API-015; WF-006 | SEC-012/019; OBS-001/008 | Tier separation, duplicate and forged-proof tests. |
| TRC-008 FA-003 B, AG02-04, Q-005; approved core | RULE-015–019; AC-022–031/061–063 | ADR-006/011; MOD-008; ENT-017–021; TX-007–010 | API-016–API-019; WF-007–WF-009 | SEC-007/011/012/018; OPS-003; OBS-007/008; RB-005/006 | Active uniqueness, expiry, retry accounting, idempotent grade and prior-pass tests; abandonment trigger GAP-003 **Open**, blocked. |
| TRC-009 Q-003/004, FA-001, AG02-02; approved | RULE-010–014/030; AC-017–021/053/054 | ADR-004/006; MOD-006; ENT-014; TX-011/012 | API-009/013/014/044; WF-010 | SEC-007/012/013; OBS-010 | Explicit Lesson/Course completion, canonical Course achievement, prospective Path progress and stale-policy tests; detailed Path migration GAP-002 **Open**. |
| TRC-010 D-012/015, Q-003/007, FA-005 B, AG02-02; approved core | RULE-001/013/020/021/030; AC-020/032–035/040/044/054 | ADR-004/005/011; MOD-003; ENT-004/006/010; TX-003/013 | API-029–API-032/039–API-043; WF-011 | SEC-008/011/014/017/019/021; OPS-016/017; RB-010 | Course/Path draft/preview validation, stale ETag, publish-audit, unchanged pins and earned Path completion tests; GAP-002 detail blocked. |
| TRC-011 FA-005 B, AG02-03; approved core | RULE-022/031; AC-036–038/056–060 | ADR-005/011; MOD-005; ENT-028/029; TX-015 | API-034; WF-013 | SEC-010/021; OBS-008/009; RB-007 | Pin/evidence preservation, authorization, notice and mapping tests; compatibility/target GAP-003 **Open**, **implementation blocked**. |
| TRC-012 AG02-01; approved core | RULE-028/029; AC-047–051 | ADR-005; MOD-003/005; TX-004/005 | API-033/035; WF-014/015 | SEC-008/009/021; OBS-006; RB-010 | Distinct action, unauthorized denial and historical-evidence tests; exceptional parameters GAP-001 **Open**, API-035 **blocked**. |
| TRC-013 D-019/024/025; approved baseline | RULE-024; AC-039/045/046 | ADR-003/008; MOD-009/010; ENT-023–027 | API-020–API-028/037; WF-017 | SEC-007/020/022; OPS-003/004; OBS-001 | Cross-Student notes/bookmarks/preferences/export-request tests; no unapproved export deadline. |
| TRC-014 FA-006 B and FA-006-B1 B; approved | RULE-023/027; AC-045/046 (DP-02 v0.1.1 request boundary) | ADR-008/009/010; MOD-010/011; ENT-001/011–015/018–030; TX-016–018 | API-036; WF-016 | SEC-005/007/015/021/022; OPS-010/011/018; OBS-006/009/011; RB-008/009 | Request/retry/de-identification/restore tests; active-data 30 days, backup expiry 30 days, security audit 180 days unless legal obligation. No evidence yet. |
| TRC-015 FA-008 B, INF-01–INF-14; approved direction | RULE-024/026; AC-040/041; no new infrastructure-specific DP-02 product rule | ADR-001/002/009/010/011; MOD-001/010/011 | API-C09/C13; WF-016/018 | SEC-015/016/021/023/024; OPS-001–OPS-019; OBS-001–OBS-012; RB-001–RB-011 | Environment, CI approval, secret, alert, cost and restore drills planned. Singapore conditional; no Go provider, numeric SLA/RPO/RTO selected. |
| TRC-016 FA-007; **Open** | AC-043 numeric thresholds remain open | ADR-001 operational interface; no new numeric contract | API-C06/C09; no threshold endpoint | SEC-018; OPS-009/012/013; OBS-003/005 | Quantitative UX/performance/beta evidence belongs to AG-05; not an AG-04 invented target. |

## 2. Reverse lookup and coverage audit

| Contract namespace | Owner and reverse lookup |
|---|---|
| API-C01–API-C14 and API-001–API-044 | [API contract](01-api-contract-and-resource-design.md) owns definitions. Public reads TRC-001/002; identity/roles TRC-003; Path TRC-004; enrollment/progress/completion TRC-005/009; prerequisites TRC-006; evidence/assessment TRC-007/008; content TRC-010; migration/revocation TRC-011/012; workspace/export TRC-013; deletion TRC-014; audit/operations TRC-003/015. |
| SEC-001–SEC-024 | [Security controls](02-authentication-authorization-and-security.md) own threat, boundary and planned evidence. Identity/role TRC-003; object ownership TRC-004/005/013/014; high-risk grade/migration/revocation TRC-008/011/012; infrastructure TRC-015. |
| WF-001–WF-018 | [Workflows](03-api-workflows-and-failure-contracts.md) own actor, precondition, transition, failure, retry and audit. Each workflow is covered by its corresponding TRC row above. |
| OPS-001–OPS-019 | [Infrastructure](04-infrastructure-and-deployment-operations.md) owns INF-01–INF-14 translation plus release/restore controls. TRC-015 is the operational source path. |
| OBS-001–OBS-012 and RB-001–RB-011 | [Observability/runbooks](05-observability-reliability-and-runbooks.md) owns signals and procedures; TRC-015 links the operational source, and relevant product rows link high-risk recovery. |

**Missing coverage that remains conditional:** GAP-001 revocation/listing, GAP-002 Path leave/curriculum migration, GAP-003 mapping criteria/target eligibility/abandonment trigger, GAP-007 protected prerequisite action list. Their interfaces are documented only to the approved boundary and are **not implementation-ready**. FA-007 numeric targets remain AG-05 work. No security or operational control is treated as a substitute for those product decisions.

## 3. Approval and evidence status

AG-01 approved DP-01 v0.1.2 prospectively; historical evidence gaps EG-001–EG-003 remain unverified. AG-02 conditionally approved six DP-02 v0.1.1 files; AG-03 conditionally approved six DP-03 v0.1.0 files. FA-006 B, FA-006-B1 B and FA-008 B are current explicit Product Owner approvals recorded later in the [Decision Registry](../DP-01/03-decision-registry.md). This DP-04 package is **Draft v0.1.0, AG-04 Not Approved**. “Planned verification” is a checklist, not passed test evidence, deploy permission or implementation authorization. Material changes require change control; no DP-05 work or application code follows automatically.

## 4. Subsequent governance addendum — outside approved v0.1.0 snapshot

Sections 1–3 retain the original DP-04 v0.1.0 draft review state. The Product Owner later **conditionally approved AG-04** for the six DP-04 v0.1.0 documents, only for contracts supported by approved product decisions. The other five files retain Draft/Not Approved metadata from their original snapshot. This v0.1.1 administrative addendum changes no API, security or operations contract. Planned tests and drills remain **unexecuted plans**. Material contract changes require [Decision Registry change control](../DP-01/03-decision-registry.md).

FA-007 B, Balanced Quality Beta, was approved later with its exact targets recorded in the [Decision Registry](../DP-01/03-decision-registry.md). TRC-016's earlier “Open” status is historical. GAP-001/002/003/007 remain **Open**, and related implementation remains blocked. Singapore remains conditional on legal/latency validation; no Go host, commercial SLA or numeric RPO/RTO is approved. AG-05 is **Not Approved**; DP-05 documentation authoring is separately authorized. Neither documentation approval nor a planned test is beta-release evidence.

## 5. Later governance status — v0.1.2 administrative addendum

The Product Owner subsequently **conditionally approved AG-05** for the six DP-05 v0.1.0 documents; §4's AG-05 status is historical. The DP-04 v0.1.0 API, security and operations contracts are unchanged. GAP-001/002/003/007 remain **Open**, and dependent implementation blocked. Security and integrity hard gates remain nonwaivable; AG-05 approval supplies no executed evidence, beta-release permission or VS-01 authorization. AG-06 is **Not Approved**. Current governance is in the [Decision Registry](../DP-01/03-decision-registry.md).
