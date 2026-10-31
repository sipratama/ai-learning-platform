# DP-05 — Test Strategy and Risk-Based Coverage

| Metadata | Value |
|---|---|
| Version | v0.1.0 |
| Status | Draft — Not Approved |
| Approval gate | AG-05 — Not Approved |
| Purpose | Define the MVP verification layers, priorities, environments and evidence contract. |

## 1. Authority, scope and boundaries

Sources are the current [Decision Registry](../DP-01/03-decision-registry.md) (AG-01–AG-04, FA-004–FA-008, especially FA-007 B), [DP-02 rules](../DP-02/02-domain-rules-and-invariants.md) and [acceptance criteria](../DP-02/05-acceptance-criteria.md), [DP-03 architecture and transactions](../DP-03/06-architecture-decisions-and-traceability.md), and [DP-04 contract traceability](../DP-04/06-security-operations-traceability.md). AG-04 conditionally approved its six v0.1.0 documents after their draft snapshot; planned controls are not executed evidence. This document specifies verification of MVP behavior, privacy, resilience and beta quality. It excludes implementation, executable tests, production release approval and post-MVP recommendations/certificates/gamification. AG-05 remains unapproved.

GAP-001 (exceptional access and public listing), GAP-002 (Path curriculum migration/leave), GAP-003 (evidence mapping, target eligibility and abandonment trigger), and GAP-007 (exact protected prerequisite actions) remain **Open**. Tests of their approved outer invariants may be planned; dependent behavior is blocked until a Product Owner decision and change control. Singapore remains a conditional region preference; no Go host, commercial SLA or numeric RPO/RTO is approved.

## 2. Risk classification and coverage

`P0/P1/P2` indicate verification scheduling and depth, **not defect severity**. For each item, record business impact, security exposure, privacy impact, integrity impact, likelihood, detectability and recovery difficulty as High/Medium/Low with rationale and affected actors. Any high security, privacy or integrity impact, hard-to-detect forged evidence, or difficult recovery warrants P0; widespread core journey failure is also P0. P1 covers important normal and error paths with bounded impact; P2 covers low-impact presentation and rare recoverable edges. Reassess priority when observed failures change likelihood or impact. Defect severity is independently assigned in [defect management](06-verification-traceability-and-defect-management.md).

| Risk ID | Priority | Risk and required verification |
|---|---|---|
| RISK-001 | P0 | Authentication, Go role checks, object ownership and Admin bootstrap; cross-user and privilege-negative tests. |
| RISK-002 | P0 | Official learning evidence, grading, completion and Path reuse; server authority and no forged/lost/duplicated proof. |
| RISK-003 | P0 | Assessment lifecycle: version lock, one active attempt, expiry, idempotent immutable result, retry accounting and concurrent transitions. GAP-003 abandonment trigger is conditional. |
| RISK-004 | P0 | Course version pin, normal archive access, authorized manual migration and preserved history. Mapping criteria/target eligibility are GAP-003 conditional. |
| RISK-005 | P0 | Go-validated Course-completion prerequisite at approved protected actions; exact action coverage is GAP-007 conditional. Guest free reading remains available. |
| RISK-006 | P0 | Deletion, access restriction, individual-record removal/de-identification, 30/30/180-day targets, isolated restore with no resurrection. |
| RISK-007 | P0 | Private answer/content leakage, token/secrets exposure, unsafe storage access and critical security controls. |
| RISK-008 | P1 | Public discovery, Guest learning, independent Path/Course intent, notes/bookmarks/preferences and usability. |
| RISK-009 | P1 | FA-007 field/lab Web Vitals, representative API load, WCAG 2.2 AA, usability task success and operations drills. Escalate a release-blocking deviation to P0. |
| RISK-010 | P2 | Low-impact copy and cosmetic edge states after essential accessibility and journey checks pass. |

## 3. Verification architecture

| Layer | Responsibility and evidence |
|---|---|
| Go unit | Pure rule/state-transition cases, input validation and deterministic time/version boundaries; record build and case result. |
| PostgreSQL integration | Real transaction, constraints, rollback, isolation and retry behavior for DP-03 `TX` owners; inspect authoritative state. |
| API contract | DP-04 `API-C`/`API` operation, auth, problem response, ETag, idempotency, cursor and compatibility contracts. |
| Authorization matrix | Guest/Student/Admin, own/other object, deleted account and private storage deny/allow matrix across every protected operation. |
| React component | Rendering and safe local state, error/focus states, interaction semantics; browser state never grants official proof. |
| Browser E2E | Critical Guest, Student, Assessment, Admin and deletion journeys through real service boundaries. |
| Concurrency/race | Parallel start/submit/completion/enrollment/publish/migration/deletion with owner-state reconciliation and no duplicate result. |
| Security/abuse | Authorized-project negative tests for token, BOLA, injection, leakage, replay and rate controls; see [security plan](03-security-privacy-and-abuse-verification.md). |
| Performance | Field and lab frontend, representative API p95/5xx at 50 concurrent VUs; see [validation plan](04-performance-accessibility-and-usability-validation.md). |
| Accessibility/usability | Manual and automated WCAG checks plus observed task success; neither automation nor lab data alone proves field outcomes. |
| Operational recovery | RB-001–RB-011 drills, alert receipt, rollback and isolated backup/deletion restore, with operator and artifact records. |

Reserve evidence-ID templates by category: `EVD-UNIT-{n}` (Go unit), `EVD-INT-{n}` (PostgreSQL integration), `EVD-API-{n}` (API contract), `EVD-AUTHZ-{n}` (authorization matrix), `EVD-UI-{n}` (React component), `EVD-E2E-{n}` (browser), `EVD-RACE-{n}` (concurrency), `EVD-SEC-{n}` (security/abuse), `EVD-PERF-{n}` (performance), `EVD-A11Y-{n}` (accessibility), `EVD-USE-{n}` (usability), and `EVD-OPS-{n}` (recovery). `{n}` is assigned at actual execution; these prefixes reserve no result.

## 4. Environments and data

| Environment | Use and isolation |
|---|---|
| Local | Deterministic unit/component work with synthetic data and no production secrets. |
| Disposable integration | Isolated PostgreSQL/Auth/Storage test tenants, seeded versions and accounts; reset between cases; destructive deletion/fault-injection here. |
| Staging | Production-like candidate artifact, representative data scale and managed-service configuration; controlled load, E2E, accessibility and recovery rehearsal. Access restricted; synthetic/pseudonym-safe fixtures only. |
| Production-safe | After separately authorized release: read-only health/telemetry and permitted canary checks, no destructive tests on user data, no arbitrary private-object or answer inspection. |

Fixtures require distinct Guest browser states, Student A/B, Admin/unauthorized actors; Course versions V1/V2 and independent Path membership; published/draft/archived content; configured Course-completion prerequisites; active/expired/submitted Attempts with configured retry and passing policies; compatible/incompatible *test* evidence mappings only after GAP-003 approval; deletion cases across Auth, database, Storage, backup inventory and audit ages. Record fixture policy/version and anonymize exported evidence. No synthetic fixture value becomes a new product threshold.

## 5. Evidence contract and acceptance implications

For **every category/layer** above, an execution record must carry an evidence ID (`EVD-<category>-<sequence>`, allocated only at execution), requirement/risk and scenario IDs, environment and dataset/fixture version, build/Git revision/artifact, actual UTC execution timestamp, expected result, actual result, artifact location/checksum or immutable reference, executor/reviewer, disposition (`Pass`, `Fail`, `Blocked`, `Not run`), defects and retest reference. This is a **template; no EVD record or pass is asserted here**. Retain only redacted evidence with access controls. Unknown or missing evidence remains `Not run`/`Blocked`, never inferred as pass.

P0 coverage and the [release hard gates](05-release-evidence-and-go-no-go-criteria.md) require acceptable executed evidence before beta authorization. AG-05 approval would approve this plan only; technical readiness and release authorization are separate. Related scenario inventories: [functional](02-functional-integration-and-e2e-verification.md), [security](03-security-privacy-and-abuse-verification.md), [validation](04-performance-accessibility-and-usability-validation.md), [traceability](06-verification-traceability-and-defect-management.md).
