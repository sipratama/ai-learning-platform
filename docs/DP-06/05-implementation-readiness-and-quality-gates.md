# DP-06 — Implementation Readiness and Quality Gates

| Metadata | Value |
|---|---|
| Version | v0.1.0 |
| Status | Draft — Not Approved |
| Approval gate | AG-06 — Not Approved |
| Purpose | Keep documentation, slice, merge, deployment and beta release decisions distinct. |

## 1. Source and boundary

Sources: current [Decision Registry](../DP-01/03-decision-registry.md), [DP-02 acceptance criteria](../DP-02/05-acceptance-criteria.md), [DP-03 transactions](../DP-03/05-consistency-and-transaction-design.md), [DP-04 security](../DP-04/02-authentication-authorization-and-security.md) and [operations](../DP-04/04-infrastructure-and-deployment-operations.md), and conditionally approved DP-05 v0.1.0 [strategy](../DP-05/01-test-strategy-and-risk-based-coverage.md), [verification scenarios](../DP-05/02-functional-integration-and-e2e-verification.md), [security tests](../DP-05/03-security-privacy-and-abuse-verification.md), [quality measurements](../DP-05/04-performance-accessibility-and-usability-validation.md) and [release gates](../DP-05/05-release-evidence-and-go-no-go-criteria.md). The later AG-05 disposition is in the [DP-05 addendum](../DP-05/06-verification-traceability-and-defect-management.md). This is a proposed gate design, not evidence that any gate passed. AG-06 is Not Approved and no implementation slice is authorized. GAP-001/002/003/007 remain Open and dependent work blocked. Related DP-06 documents: [roadmap](01-implementation-roadmap-and-dependencies.md), [standards](02-repository-architecture-and-engineering-standards.md), [backlog](03-vertical-slice-backlog-and-acceptance-contracts.md), [delivery](04-secure-delivery-and-change-management.md), [handoff](06-execution-traceability-and-handoff-register.md).

## 2. Six separate decisions

| ID / gate | Decision authority and required proof | Current state |
|---|---|---|
| QUAL-001 Documentation approval | Product Owner reviews six DP-06 v0.1.0 docs against approved sources, dependencies and open GAPs; AG-06 decision records scope and conditions. This does **not** authorize code. | **AG-06 Not Approved.** |
| QUAL-002 Slice readiness and authorization | Product Owner separately names a VS ID and approves implementation after DR-001: approved source/API/SEC/AC/scenarios, satisfied predecessors, no unresolved GAP detail, schema/migration/recovery analysis and usable isolated environment. | **No slice authorized; all pending, GAP branches blocked.** |
| QUAL-003 Slice completion | Domain and quality reviewers verify DD-001 with actual implementation and redacted executed evidence for that slice; incomplete/failed/blocked cases stay visible. | **Not run; no implementation.** |
| QUAL-004 PR/merge readiness | Authorized Git operator confirms review, CI, contract/security/migration checks and approved change classification; Product Owner Git ownership remains unless later delegated. | **Not run; no PR.** |
| QUAL-005 Environment deployment readiness | Authorized operations/release reviewer checks artifact/config identity, environment isolation, secrets, migrations, health/alerts, rollback and restoration boundary before staging or production action. | **Not run; no deployment.** |
| QUAL-006 Beta Go/No-Go | Separate Product Owner/release-authority decision using actual candidate evidence, all critical E2E and hard gates, FA-007 targets and controlled exceptions only where allowed. AG-05 or AG-06 approval is insufficient. | **Not run; no beta authorization.** |

## 3. Pre-implementation checklist and test responsibility

| ID | Required before a selected slice starts |
|---|---|
| QUAL-007 | AG-06 approved, explicit Product Owner authorization for the exact sub-slice, predecessor verification, selected behavior free of relevant open GAPs, and any material contract change approved through change control. A GAP-dependent increment is `Blocked`, not `Ready`. |
| QUAL-008 | Confirm relevant DP-04 API-C/API and SEC contracts, DP-02 AC, DP-03 owner/TX, DP-05 FT/ST/VAL plans, data classification, migration/rollback/restore implications and negative authorization cases. Where the existing approved contract is insufficient, return to Product Owner; do not invent policy. |
| QUAL-009 | Local/disposable environment, versioned synthetic content/Assessment/deletion fixtures, least-privilege credentials, relevant managed-service emulator/test tenant and CI plan are available. Production Student data cannot be accepted before VS-06A privacy safeguards and review. |

| ID | Verification category and gate evidence expected after future implementation |
|---|---|
| QUAL-010 | Go unit tests: deterministic domain invariants, policy/version/time boundaries, unsupported input. |
| QUAL-011 | PostgreSQL-backed integration: constraints, owner transactions, cross-module behavior, deletion/retry and forward-compatible migrations. |
| QUAL-012 | Concurrency/race: parallel enrollment/publish, Attempt start/expiry/submit, completion and deletion; one authoritative outcome with replay reconciliation. |
| QUAL-013 | API contract: API-C01–14 and affected API-001–044 method/status/DTO/ETag/idempotency/cursor/ownership behavior. |
| QUAL-014 | React component and **Playwright browser E2E**: critical Guest/Student/Admin journeys, responsive/error/focus states and safe local recovery. |
| QUAL-015 | Security negative tests: token trust, BOLA/IDOR, privilege escalation, private answer/Storage access, input, logging and abuse controls. |
| QUAL-016 | Migration/data lifecycle: schema compatibility, version pin, no fabricated proof, accepted deletion/access restriction, 30/30/180-day targets and isolated restore suppression. GAP-dependent Course migration remains blocked pending policy. |
| QUAL-017 | Operations: alerts/correlation, safe retry and RB-001–RB-011 drills applicable to candidate, rollback feasibility and backup restoration; evidence cannot be inferred from a runbook checklist. |

Every future execution record must include requirement/scenario and build revision, environment and fixture version, UTC execution time, expected and actual result, redacted artifact location, reviewer, defect and retest disposition. A plan, checklist, CI configuration or asserted “Done” without run artifacts is **not evidence**. DP-05 `EVD` identifiers are allocated only upon execution.

## 4. FA-007 B beta acceptance boundary

FA-007 B remains approved and unchanged: primary usability task success **≥90%**, Guest learning journey success **≥90%**, Student enrollment-to-assessment journey success **≥90%**; no critical usability blocker; responsive mobile/desktop; **WCAG 2.2 AA** target for critical journeys; frontend **LCP p75 ≤2.5 seconds, INP p75 ≤200 milliseconds, CLS p75 ≤0.1**; API **read p95 ≤500 milliseconds, write p95 ≤1,000 milliseconds, HTTP 5xx <1%**; initial load test **50 concurrent virtual users**. All critical E2E journeys must pass with no critical integrity defect, unauthorized cross-Student access, privilege escalation or unpublished-answer leak, and no unresolved Critical/High security blocker. Account deletion and restore safeguards need executed proof.

These are beta acceptance targets, **not mandatory performance measurements for every individual development commit** and not commercial SLAs. Lab data alone do not prove field Web Vitals; API critical operations cannot hide behind aggregate fast reads. Noncritical performance/UX deviations may be considered only under documented, authorized limited-beta risk acceptance (`EXC-001`), while security and data-integrity hard gates are **nonwaivable**. A failed critical usability journey, missing required evidence or a blocking privacy/restore defect is No-Go under [GATE-001–007](../DP-05/05-release-evidence-and-go-no-go-criteria.md). No beta release is authorized by this document.

FA-008 B remains managed frontend/Go/Supabase services, isolated environments, GitHub Actions with production approval, managed secrets, observability, worker and backup/cost controls. Singapore is only conditionally preferred pending legal/latency validation; no Go host, commercial SLA or numeric RPO/RTO has been selected. No test has been run as part of DP-06 documentation.
