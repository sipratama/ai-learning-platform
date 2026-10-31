# DP-05 — Release Evidence and Go/No-Go Criteria

| Metadata | Value |
|---|---|
| Version | v0.1.0 |
| Status | Draft — Not Approved |
| Approval gate | AG-05 — Not Approved |
| Purpose | Define the evidence package, nonwaivable gates and separate release decision. |

## 1. Authority, scope and decision separation

FA-007 B in the [current Decision Registry](../DP-01/03-decision-registry.md) approves Balanced Quality Beta targets, not a release. AG-01 approved the DP-01 v0.1.2 prospective baseline; AG-02/03/04 conditionally approved their named six-document snapshots. AG-05 **is Not Approved**. Sources include [DP-02 acceptance criteria](../DP-02/05-acceptance-criteria.md), [DP-03 architecture traceability](../DP-03/06-architecture-decisions-and-traceability.md), [DP-04 security](../DP-04/02-authentication-authorization-and-security.md), [operations/runbooks](../DP-04/05-observability-reliability-and-runbooks.md) and this package's [strategy](01-test-strategy-and-risk-based-coverage.md), [functional](02-functional-integration-and-e2e-verification.md), [security](03-security-privacy-and-abuse-verification.md), [validation](04-performance-accessibility-and-usability-validation.md), and [traceability](06-verification-traceability-and-defect-management.md). This is a **decision procedure**, not executed release evidence or authorization to deploy.

Three distinct records are required: (1) AG-05 Product Owner approval of documentation, if given; (2) technical readiness review of an actual candidate and evidence; (3) explicit beta release authorization by the authorized release decision maker/Product Owner. None is inferred from another. GAP-001/002/003/007 remain Open, with dependent implementation blocked; unresolved conditional behavior cannot be silently counted as verified. Scope excludes post-MVP features and any invented commercial SLA. Singapore remains a conditional region preference; provider and numeric RPO/RTO remain undecided.

## 2. Release evidence package (required fields, all unfilled)

| ID | Evidence item and acceptance check |
|---|---|
| REL-001 | Candidate identity: release name, Git revision, build/artifact digest, build provenance, deployment environment/config revision and authorized operator. |
| REL-002 | Approved requirement baseline: exact DP-01/02/03/04 snapshots and later administrative dispositions, open GAPs, applied change-control records and scope exclusions. |
| REL-003 | Executed test inventory: scenario IDs, expected/actual, environment, artifact, time, reviewer, disposition, coverage gaps and failed/retested cases. |
| REL-004 | All critical E2E journey results: Guest free Lesson, Student independent Path/Course, prerequisites where approved, version pin, Attempt/grading/completion, Admin publish/archive/migration where approved, deletion. |
| REL-005 | API-C01–14 / API-001–044 contract verification by applicable operation, including authentication, ownership, idempotency, error and compatibility evidence. Conditional GAP operations reported blocked, not passed. |
| REL-006 | Security/privacy package: SEC-001–024 negative tests, vulnerability findings and dispositions, cross-owner checks, answer/secret exposure review, deletion and anonymization proof. |
| REL-007 | FA-007 measurement: frontend LCP/INP/CLS field percentiles and lab diagnosis, API read/write p95, 5xx rate, 50-VU load, usability task success and WCAG 2.2 AA critical-journey audit, each with sample limitations. |
| REL-008 | Operations readiness: OBS-001–012 signal/alert review, RB-001–011 runbook owner and drill outcome, release monitoring, on-call contact and incident path. |
| REL-009 | Recovery: rollback artifact and exercise, isolated backup restoration, deletion suppression/replay, 30-day active and backup expiry tracking, 180-day minimized audit retention or documented legitimate legal obligation. |
| REL-010 | Open defects with severity, priority, affected requirement, risk, owner, mitigations and retest evidence; unverified findings cannot be assumed resolved. |
| REL-011 | Risk exceptions: exact scope, impact, evidence, mitigation, owner, expiry/review condition, approval authority, follow-up and explicit classification against hard gates. |
| REL-012 | Signed or otherwise auditable review decisions from quality, security/privacy, engineering/operations and Product Owner/release authority, including disagreements and decision time. |

No `REL` row asserts an artifact exists. An actual release dossier must link immutable/redacted execution evidence using the [evidence contract](01-test-strategy-and-risk-based-coverage.md#5-evidence-contract-and-acceptance-implications); missing evidence is `Not run` or `Blocked`.

## 3. Hard gates (nonwaivable through ordinary exceptions)

| ID | Required disposition before beta release |
|---|---|
| GATE-001 | **No-Go** if any critical E2E journey fails or a critical business rule lacks acceptable executed evidence. GAP-dependent behavior remains excluded from implementation until decided, and may block release if needed for the actual scope. |
| GATE-002 | **No-Go** if verified learning/assessment evidence can be lost, duplicated, forged or silently invalidated; grading/result immutability, one active Attempt, version pin and completion authority must hold. |
| GATE-003 | **No-Go** if unauthorized cross-Student access, privilege escalation, unpublished answer exposure or personal-data exposure remains possible. |
| GATE-004 | **No-Go** with unresolved Critical or High security blockers. Noncritical security findings require explicit documented mitigation/disposition. |
| GATE-005 | **No-Go** for blocking deletion, individual-record de-identification, 30/30/180-day policy, access invalidation or restore-resurrection defects; restore safeguard must be demonstrated. |
| GATE-006 | **No-Go** if a mandatory approved release criterion is unmet without an explicitly permitted, authorized exception; absence of evidence is not a pass. |
| GATE-007 | **No-Go** if candidate identity, review/audit trail, rollback/recovery readiness or authorized release decision is missing. |

Security, privacy exposure and data-integrity hard gates **cannot** be waived using performance/UX exception handling. A critical usability blocker also prevents beta release. A failed WCAG critical-journey barrier must be triaged for user impact and release blocking; no blanket accessibility waiver is implied.

## 4. Conditional gates and risk acceptance

`EXC-001` is the only ordinary exception path: a **noncritical** performance deviation, **noncritical** UX deficiency, or another explicitly nonblocking finding may be proposed for a **limited beta**. The proposal records scope and affected cohort/route/operation, measured impact and evidence quality, mitigation and monitoring, accountable owner, expiration or review trigger, approving authority, user communication if relevant, follow-up/retest plan and rollback condition. Quality and security/privacy reviewers independently confirm it does not intersect GATE-001–005; Product Owner/release authority explicitly accepts it and records the decision. No unstated operation exemption, silent threshold change or indefinite acceptance. A special API threshold is a proposed product change requiring approval, not an automatic exception. If evidence is too weak to classify impact, decide No-Go until measured.

FA-007 B targets remain: primary usability, Guest journey and Student enrollment-to-assessment success each ≥90%; no critical usability blocker; responsive mobile/desktop; WCAG 2.2 AA critical journeys; LCP p75 ≤2.5s, INP p75 ≤200ms, CLS p75 ≤0.1; read API p95 ≤500ms, write API p95 ≤1,000ms, HTTP 5xx <1%, initial 50 concurrent VUs. Exceptions are narrow and recorded; they do not erase the measured deviation.

## 5. Decision record and acceptance implications

| Decision | Meaning |
|---|---|
| Go | All hard gates met, approved criteria evidenced, no unresolved blocker, release authority explicitly approves candidate and monitoring/rollback. |
| Conditional Go | All hard gates met; only authorized, time-bounded `EXC-001` noncritical deviations remain; limited beta scope and monitoring/exit conditions recorded; release authority explicitly approves. |
| No-Go | Any hard gate fails, required evidence missing, exception unauthorized/out of scope, or release authority withholds approval. |

Quality lead compiles evidence and defects; security/privacy lead reviews hard controls and personal data; engineering/operations lead confirms artifact, alerts, rollback and restore; Product Owner confirms product scope and the authorized release decision maker signs Go/Conditional Go/No-Go. A role may be held by the same person only if governance permits, but sign-off responsibilities remain explicit. Record UTC decision time, candidate artifact, review identities/roles, dissent, exception IDs and follow-up. This plan grants no AG-05 approval and reports no technical readiness or beta release result.
