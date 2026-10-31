# DP-05 — Verification Traceability and Defect Management

| Metadata | Value |
|---|---|
| Version | v0.1.1 — administrative addendum after the six-document v0.1.0 snapshot |
| Status | DP-05 v0.1.0 Conditionally Approved; addendum records later governance only |
| Approval gate | AG-05 — Conditionally Approved for six v0.1.0 documents |
| Purpose | Connect approved sources to planned evidence and govern defect disposition. |

## 1. Authority and reading key

Read each row forward from [DP-01 current decisions](../DP-01/03-decision-registry.md) through [DP-02 rules/AC](../DP-02/02-domain-rules-and-invariants.md), [DP-03 traceability](../DP-03/06-architecture-decisions-and-traceability.md), [DP-04 traceability](../DP-04/06-security-operations-traceability.md) to DP-05 scenarios and [release gates](05-release-evidence-and-go-no-go-criteria.md). Read backward from a scenario ID to its source to audit scope. `EVD` means **expected artifact type**, not executed evidence. `Ready` means documentation can describe an approved invariant, not that implementation is authorized or a test passed. The other five DP-05 files are [strategy](01-test-strategy-and-risk-based-coverage.md), [functional](02-functional-integration-and-e2e-verification.md), [security](03-security-privacy-and-abuse-verification.md), [validation](04-performance-accessibility-and-usability-validation.md), and [release](05-release-evidence-and-go-no-go-criteria.md). AG-05 is Not Approved.

## 2. Bidirectional critical-requirement matrix

| ID; DP-01 source | DP-02 rule / AC | DP-03 contract; DP-04 API / control | Risk; DP-05 scenario → expected evidence | Gate; dependency |
|---|---|---|---|---|
| TRACE-001; D-009/010, Q-001, FA-002 B | RULE-006/007/009; AC-004/005/012–015 | ADR-002/006, TX-006/019; API-005/006/015, SEC-012/017, WF-002/005 | RISK-002/008; FT-002–004, ST-009 → Guest browser/local and server proof diff | GATE-001/002; Ready. |
| TRACE-002; FA-004 B, AG02-02 | RULE-001/002/012/030; AC-006/007/052–055 | ADR-004, TX-001/012/013; API-007–009, SEC-007, OBS-010 | RISK-002/008; FT-006/019, ST-005 → participation/enrollment/global completion diff | GATE-001/002; Path leave/curriculum migration Conditional GAP-002. |
| TRACE-003; FA-005 B, AG02-01 | RULE-003/004/021/028; AC-008–010/035/047/048 | ADR-005, TX-002/004; API-010–013/033, SEC-007/014, RB-003 | RISK-004; FT-007/022/031 → pin/archive/concurrency record | GATE-001/002; archived listing Conditional GAP-001. |
| TRACE-004; D-018, AG02-05 | RULE-005; AC-011/044/064–067 | ADR-007, TX-014; API-010/014/030, SEC-013/019 | RISK-005; FT-008, ST-010 → Go policy and denied-action matrix | GATE-001/002; exact action list Conditional GAP-007. |
| TRACE-005; D-013, FA-001/002 B, AG02-02 | RULE-008–014; AC-014–021/053–055 | ADR-004/006, TX-006/011/012; API-013–015/044, SEC-012, OBS-010 | RISK-002; FT-009/019 → evidence-tier and canonical completion trace | GATE-001/002; detailed Path migration Conditional GAP-002. |
| TRACE-006; FA-003 B, AG02-04 | RULE-015–019; AC-022–031/061–063 | ADR-006/011, TX-007–010; API-016–019, SEC-011/012, RB-005/006 | RISK-003; FT-011–018/031, ST-009/021 → Attempt/result/parallel timeline | GATE-001/002/003; abandonment trigger Conditional GAP-003. |
| TRACE-007; FA-005 B, AG02-03 | RULE-022/031; AC-036–038/056–060 | ADR-005/011, TX-015; API-034, SEC-010/021, RB-007 | RISK-004; FT-023/024, ST-007 → mapping, old/new pin, notice and audit trace | GATE-001/002/003; compatibility/target criteria Conditional GAP-003, dependent implementation blocked. |
| TRACE-008; AG02-01 | RULE-028/029; AC-047–051 | ADR-005, TX-004/005; API-033/035, SEC-009/021, RB-010 | RISK-004/007; FT-022/025, ST-007 → distinct archive/revocation and preserved-history trace | GATE-001/002/003; exact exceptional policy Conditional GAP-001, dependent implementation blocked. |
| TRACE-009; Q-006, D-025 | RULE-024/026; AC-039–041 | ADR-001/002, TX-020; API-006/038, SEC-001–008/021, RB-002 | RISK-001/007; FT-005/020/026, ST-001–006/016 → role/owner/token/audit matrix | GATE-001/003/004; Ready. |
| TRACE-010; D-019/025 | RULE-024/027; AC-039/045/046 | ADR-003/008, TX-016; API-020–028/037, SEC-007/020/022 | RISK-001/008; FT-010/027, ST-005/017 → own/foreign resource diff | GATE-001/003/005; Ready. |
| TRACE-011; FA-006 B, FA-006-B1 B | RULE-023/027; AC-045/046 (original request boundary) | ADR-008–011, TX-016–018; API-036, SEC-005/021/022, OPS-018, OBS-011, RB-008/009 | RISK-006; FT-027–030, ST-017/018 → case/provider/retention/isolated-restore proof | GATE-001/005; Ready under later approved privacy disposition. |
| TRACE-012; FA-007 B | RULE-006/024/025; AC-001–005/043 (earlier numeric gap historical) | ADR-001; API-C06/C09, SEC-018, OPS-009/012/013, OBS-003/005 | RISK-008/009; VAL-001–015, FT-001–002 → field/lab/API/study/WCAG results | GATE-001/006; approved targets, no executed evidence. |
| TRACE-013; FA-008 B | RULE-024/026; AC-040/041; no infrastructure-specific new rule | ADR-001/002/009–011; API-C09/C13, SEC-015/016/021/023/024, OPS-001–019, OBS-001–012, RB-001–011 | RISK-006/007/009; ST-011/012/016/018–020, FT-029, REL-008/009 → secret/alert/rollback/restore drill | GATE-003/004/005/007; Singapore conditional; no host/SLA/RPO/RTO value approved. |
| TRACE-014; D-021, PO-CLAR-D021 | RULE-025; AC-001/002/042/043 | ADR-001/003; API-001–004, SEC-014/018/020, RB-001 | RISK-008; FT-001, ST-008/014 → search/filter/visibility/error record | GATE-001; archived public listing Conditional GAP-001; recommendations post-MVP. |

All AG02-01–AG02-05 appear above: AG02-01 TRACE-003/008, AG02-02 TRACE-002/005, AG02-03 TRACE-007, AG02-04 TRACE-006, AG02-05 TRACE-004. GAP-001 affects TRACE-003/008/014; GAP-002 affects TRACE-002/005; GAP-003 affects TRACE-006/007; GAP-007 affects TRACE-004. Exact GAP definitions remain in the [Open Decisions Register](../DP-01/04-open-decisions-register.md) and [DP-04 matrix](../DP-04/06-security-operations-traceability.md). No GAP is closed here.

## 3. Reverse lookup, coverage and evidence status

| DP-05 inventory | Source lookup | Current evidence state |
|---|---|---|
| FT-001–010 | TRACE-001–005/009/010/014 | Not run; FT-001 archived branch and FT-008 protected-action list conditional. |
| FT-011–019 | TRACE-005/006 | Not run; FT-014 and abandonment fixture part of FT-018 conditional. |
| FT-020–026 | TRACE-003/007–009 | Not run; migration/revocation positive details conditional. |
| FT-027–031 | TRACE-003/006/007/010/011 | Not run; FT-031 migration branch conditional. |
| ST-001–021 | TRACE-001/004/006–013/014 | Not run; negative tests for SEC-001–024 planned; GAP-dependent branches conditional. |
| VAL-001–015 | TRACE-012 | Not run; no field, lab, API, study or WCAG evidence. |
| REL-001–012 | TRACE-001–014 | Required release dossier only; none populated. |

Coverage audit at drafting: critical approved MVP rules have planned scenarios, but **zero executed evidence**. The exact GAP-001/002/003/007 behaviors are intentionally without finalized executable scenario or implementation authorization; record them as `Blocked`, not as passed or omitted. SEC-001–024 and OPS/OBS/RB controls have planned checks, but none are verified. The broad `RB-001–011` drill inventory needs candidate-specific execution records before readiness; the table does not claim a drill. Deferred rule-based recommendations, certificates and broader gamification are not beta MVP tests. Every planned scenario has source IDs and an evidence artifact type; actual evidence IDs are allocated only upon execution.

## 4. Defect management contract

| ID | Required process |
|---|---|
| DEF-001 Severity | `Critical`: exploitable cross-user access/privilege, forged/lost official proof, severe deletion/restore exposure, or unavailable critical journey without safe workaround. `High`: major security/privacy/functional failure with significant impact. `Medium`: bounded noncritical failure with viable mitigation. `Low`: minor recoverable/cosmetic defect. Severity describes **impact**, not schedule. Security lead confirms security classification. |
| DEF-002 Priority | `P0` immediate hard-gate investigation, `P1` next release-scope repair, `P2` scheduled lower-risk work. Priority describes **order/coverage**, not impact; a medium defect may become P0 due to exposure, while severity remains medium. |
| DEF-003 Reproduction | Record candidate revision, environment, actor/role, owner IDs as redacted references, fixture/version/policy, preconditions, steps, expected/actual, frequency, timing and correlation ID. Concurrency cases include event order and transaction outcome. |
| DEF-004 Evidence | Attach minimal safe API/browser/log/DB proof, artifact location, timestamp, affected RULE/AC/API/SEC/FT/ST/VAL IDs and privacy classification. Avoid raw tokens, answers and personal content. |
| DEF-005 Ownership/triage | Quality lead opens/validates; domain engineering owner analyzes; security/privacy or operations lead joins when relevant; Product Owner decides material policy. Deduplicate by underlying cause but retain affected scenario links and failed runs. |
| DEF-006 Remediation/retest | Owner records root cause/change, builds new candidate, reruns failed scenario and adjacent invariant/authorization/concurrency regression; attach new evidence and reviewer. A code merge alone never closes a defect. |
| DEF-007 Acceptance/closure | Close only on verified retest and documented impact resolution. Noncritical performance/UX acceptance follows `EXC-001`; hard security/integrity/privacy gates cannot be accepted through that path. Reopened on regression or expired exception. |

No defect counts, test passes or exceptions are fabricated. AG-05 documentation approval, technical readiness and release authorization remain separate [decisions](05-release-evidence-and-go-no-go-criteria.md).

## 5. Subsequent governance addendum — outside approved v0.1.0 snapshot

Sections 1–4 preserve the original DP-05 v0.1.0 Draft/Not Approved review state. The Product Owner later **conditionally approved AG-05** for all six DP-05 v0.1.0 documents, covering verification strategy, scenarios, evidence requirements and release-gate design. The other five files retain original snapshot metadata. This v0.1.1 addendum changes no test target or gate. FA-007 B remains Approved; GAP-001/002/003/007 remain **Open**, and their dependent implementation blocked. Security and data-integrity hard gates cannot be waived. Documentation approval supplies no executed evidence, beta release authorization or slice implementation permission. AG-06 is **Not Approved**; material changes require [Decision Registry change control](../DP-01/03-decision-registry.md).
