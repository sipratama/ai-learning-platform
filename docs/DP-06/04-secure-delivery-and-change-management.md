# DP-06 — Secure Delivery and Change Management

| Metadata | Value |
|---|---|
| Version | v0.1.0 |
| Status | Draft — Not Approved |
| Approval gate | AG-06 — Not Approved |
| Purpose | Define future review, CI, migration and release-control practices for authorized slices. |

## 1. Authority, scope and exclusions

Sources: [Decision Registry](../DP-01/03-decision-registry.md), [DP-03 transaction design](../DP-03/05-consistency-and-transaction-design.md), [DP-04 security](../DP-04/02-authentication-authorization-and-security.md), [infrastructure](../DP-04/04-infrastructure-and-deployment-operations.md) and [runbooks](../DP-04/05-observability-reliability-and-runbooks.md), [DP-05 release gates](../DP-05/05-release-evidence-and-go-no-go-criteria.md), and this package's [roadmap](01-implementation-roadmap-and-dependencies.md), [standards](02-repository-architecture-and-engineering-standards.md), [backlog](03-vertical-slice-backlog-and-acceptance-contracts.md), [readiness](05-implementation-readiness-and-quality-gates.md) and [handoff](06-execution-traceability-and-handoff-register.md). AG-05 is conditionally approved for DP-05 v0.1.0; AG-06 is Not Approved. This is a proposed workflow only. It creates no branch, PR, code, CI configuration, migration or production access. GAP-001/002/003/007 remain Open and dependent implementation blocked.

## 2. Git ownership and future review flow

| ID | Proposed delivery contract |
|---|---|
| DEL-001 | Product Owner retains control of branch creation/switching, staging, commits, push, merge, tags and PR creation unless **explicitly delegated in a future task**. This document does not delegate any Git write. A future authorized slice may propose a branch name such as `feat/vs-02b-enrollment`; the Product Owner approves/creates it. |
| DEL-002 | One coherent authorized slice or bounded sub-slice per proposed PR, with linked VS ID, approved baseline, change classification, affected RULE/AC/API/SEC/FT/ST IDs, migration/rollback impact and evidence references. `feat`, `fix`, `docs`, `test`, `refactor` Conventional Commit types express intent; a commit message is not approval. |
| DEL-003 | Before review, author provides design/contract diff, reproducible local and CI results, security/privacy impact, data migration review, negative tests and user-visible behavior. Reviewers include relevant domain owner, security/privacy for high-risk changes, and operations for deployment/recovery changes. Product Owner resolves policy questions. |
| DEL-004 | Merge requires authorized Git operator, passing required CI, resolved blocking review findings, approved contract alignment, migration compatibility and rollback/recovery plan. Never merge an unresolved GAP-dependent branch as if it were approved. CI green is necessary evidence for covered checks, not beta approval. |
| DEL-005 | Release candidate tagging is considered only after an authorized artifact/build and release review; tag identity must map to Git revision and artifact digest. Production deployment requires separate approval, health/observability checks and rollback criteria. AG-06 or a slice Done status cannot substitute for [beta Go/No-Go](../DP-05/05-release-evidence-and-go-no-go-criteria.md). |

## 3. Change classification and approval

| ID / class | Examples | Required disposition |
|---|---|---|
| DEL-006 Nonmaterial implementation detail | Internal package/refactor, query optimization that preserves behavior and privacy, UI polish within approved UX contract. | Future authorized slice owner review and tests; document impact. No Product Owner policy change inferred. |
| DEL-007 Editorial documentation correction | Broken link, typo, ID formatting that changes no contract. | Documentation review and appropriate version note; preserve normative snapshot provenance. |
| DEL-008 Approved-contract implementation | Exact approved RULE/AC/API/SEC behavior in authorized slice. | AG-06 and explicit slice authorization first, then code review/CI/evidence; no automatic product reapproval for faithful implementation. |
| DEL-009 Material architecture/API change | Reassign module ownership, change transaction authority, break `/api/v1` semantics, change persistence or trust boundary. | Decision Registry change control and appropriate Product Owner architecture/API gate before implementation; update downstream contracts/tests. |
| DEL-010 Product-policy change | GAP closure; new protected prerequisite actions, revocation rules, Path leave/migration, evidence compatibility or Attempt abandonment trigger. | Explicit Product Owner decision with stable source and affected DP-02–DP-06 contract review before dependent implementation. A technical default is not an approval. |
| DEL-011 Security-policy change | Weaken token validation, owner checks, answer secrecy, role bootstrap, idempotency or hard gate. | Security review and Product Owner approval through change control; no ordinary performance/UX exception can waive security or integrity hard gates. |
| DEL-012 Data-retention/privacy change | Alter FA-006/B1 disposition, 30/30/180-day targets, restore suppression or legal exception interpretation. | Product Owner/privacy review and change control before implementation. Never silently keep personal linked data because historic evidence is valuable. |

## 4. Secure build and environment controls

| ID | Required future control and review evidence |
|---|---|
| DEL-013 | Managed secrets per environment; no privileged Supabase key, production credential, token, answer key or private payload in source, browser bundle, logs or PR description. Scoped service identities and key rotation reviewed. |
| DEL-014 | CI and local checks proportionate to changed scope: format/static/dependency/secret scans; Go unit/PostgreSQL integration/race/API contract; React component/browser E2E; security ownership/negative and deletion/restore tests. Record tool versions, revision and actual results; do not call this document a passed run. |
| DEL-015 | Local, disposable integration, staging and production are isolated by data and credentials. Destructive/race/fault-injection/restore tests use synthetic or approved isolated data, never uncontrolled production user data. Production access is least privilege, audited, time/scoped to an authorized operator. |
| DEL-016 | Supply-chain review links source revision, dependency versions, build artifact digest, CI outcome and deploy approval. Unknown provenance, secret leak or blocking security finding prevents merge/deployment pending disposition. GitHub Actions is the approved CI/CD direction; no workflow file is authored here. |
| DEL-017 | Inspect sensitive error/log surfaces, CORS/CSRF assumptions and Storage authorization in review; Go validates internal role/ownership despite a valid Supabase token. Admin publish, migration, revocation, privacy and restore actions require minimized durable audit as specified by DP-04. |

## 5. Schema, data migration and rollback boundary

| ID | Required future control |
|---|---|
| DEL-018 | Before a schema change, identify owner module/TX, compatibility with current and previous app artifact, backfill/data volume, index/locking risk, constraints for Attempt uniqueness and immutable Result, and privacy/retention impact. Review a forward-compatible expand/transition/contract path with PostgreSQL-backed tests. |
| DEL-019 | A Course **version migration** is a product action distinct from a database schema migration. VS-06D remains blocked by GAP-003; neither a SQL backfill nor a schema default may silently move enrolled Students or fabricate passing evidence. |
| DEL-020 | Roll back app artifacts only when schema/data compatibility is demonstrated. Irreversible deletion, de-identification, historical grade or version-pin changes cannot be safely reversed automatically; plan forward repair and audited reconciliation instead. A failed migration keeps authoritative prior state or enters a restricted, reviewable recovery state. |
| DEL-021 | Backup restore occurs first in an isolated/restricted environment. Verify backup integrity, deletion-suppression/replay, Auth/Storage/DB reconciliation and absence of deleted personal data before access is enabled; managed backup existence alone is insufficient. Preserve 30-day active-data deletion, 30-day backup expiry and 180-day minimized security-audit targets (legal obligation exception only where applicable). |

Security and data-integrity hard gates in [DP-05](../DP-05/05-release-evidence-and-go-no-go-criteria.md) remain nonwaivable. A future authorized PR, staging deployment and beta release are separate decisions. No actual CI, migration, drill or review result is claimed here.
