# DP-06 — Repository Architecture and Engineering Standards

| Metadata | Value |
|---|---|
| Version | v0.1.0 |
| Status | Draft — Not Approved |
| Approval gate | AG-06 — Not Approved |
| Purpose | Propose a concrete repository layout and engineering rules for the approved modular monolith boundaries. |

## 1. Scope, authority and exclusions

Sources: [current decisions](../DP-01/03-decision-registry.md), [DP-02 rules](../DP-02/02-domain-rules-and-invariants.md), [DP-03 overview](../DP-03/01-architecture-overview.md), [11 module contracts](../DP-03/02-module-boundaries-and-dependencies.md), [logical data](../DP-03/03-logical-data-model.md), [transactions](../DP-03/05-consistency-and-transaction-design.md), [DP-04 API](../DP-04/01-api-contract-and-resource-design.md), [security](../DP-04/02-authentication-authorization-and-security.md), [operations](../DP-04/04-infrastructure-and-deployment-operations.md), and [DP-05 strategy](../DP-05/01-test-strategy-and-risk-based-coverage.md). AG-05 is conditionally approved for its six v0.1.0 documents through a later [addendum](../DP-05/06-verification-traceability-and-defect-management.md); AG-06 remains Not Approved. This document describes a **proposed layout only**: no directory, code, migration, CI file or provider is created or selected. No new microservice, Kubernetes, Kafka or distributed transaction mechanism is proposed. Singapore remains conditional; no numeric SLA/RPO/RTO is invented.

GAP-001/002/003/007 remain Open; code structures may reserve ordinary interfaces for approved invariants, but no missing policy is filled by an adapter or configuration default. See [roadmap](01-implementation-roadmap-and-dependencies.md), [backlog](03-vertical-slice-backlog-and-acceptance-contracts.md), [delivery](04-secure-delivery-and-change-management.md), [gates](05-implementation-readiness-and-quality-gates.md), and [traceability](06-execution-traceability-and-handoff-register.md).

## 2. Proposed repository layout (future work only)

```text
apps/
  api/
    cmd/api/                 Go HTTP entry point
    cmd/worker/              bounded background work entry point
    internal/platform/       configuration, transport, telemetry, database setup
    internal/modules/        one area per MOD-001–MOD-011 logical owner
      identity/              domain, application, ports, adapters
      catalog/
      content/
      pathparticipation/
      enrollment/
      progress/
      activity/
      assessment/
      workspace/
      privacy/
      audit/
    internal/http/           route registration, auth middleware, DTO and problem mapping
    internal/adapters/       Supabase Auth/Storage, PostgreSQL and outbound delivery
    migrations/              reviewed forward-compatible schema changes
    tests/                   integration, contract, race and security fixtures
  web/
    src/app/                 routing, providers and global error boundaries
    src/features/            catalog, lesson, auth, participation, enrollment,
                             progress, assessment, workspace, admin, privacy
    src/components/          accessible reusable UI primitives
    src/lib/api/             typed Go API client and problem handling
    src/lib/auth/            Supabase sign-in integration; no business authority
    src/styles/              Tailwind and theme integration
    tests/                   component and browser E2E specifications
docs/                       governed DP-01–DP-06 and future evidence references
.github/workflows/           future approved GitHub Actions definitions
```

The tree is illustrative, not a mandate to create every folder before a slice needs it. `internal/modules/<owner>/domain` contains rules and types; `application` coordinates use cases and transaction boundaries; `ports` declares narrow required capabilities; `adapters` implements outbound persistence/provider calls. One Go binary or a bounded worker process may host several modules; a folder is **not** a separate service. Shared platform code holds mechanics, never domain decisions. React feature folders own page-specific state; common components remain accessible and domain-neutral. Exact package names are implementation details within AG-06 review.

## 3. Ownership and dependency rules

| ID | Engineering contract |
|---|---|
| ENG-001 | Preserve MOD-001 Identity, MOD-002 Catalog, MOD-003 Content, MOD-004 Path Participation, MOD-005 Enrollment, MOD-006 Progress/Completion, MOD-007 Activity Evidence, MOD-008 Assessment, MOD-009 Workspace, MOD-010 Privacy/Lifecycle and MOD-011 Audit as **logical owners** in one Go modular monolith. A module may read another owner's capability; it never writes another owner's tables directly. |
| ENG-002 | Dependency direction: domain has no transport, DB, Supabase or UI dependency; application calls domain and narrow ports; inbound HTTP and outbound adapters depend inward. Place interfaces at use-case/module or external-service boundaries, not mechanically around every function. |
| ENG-003 | Go use case owns each official transition; DP-03 TX-001–TX-020 identify transaction owner. Keep enrollment pin, Attempt uniqueness, grade, completion and deletion acceptance atomic in PostgreSQL where required. External Auth/Storage/notice work is durable, idempotent and reconciled, never claimed atomic across providers. |
| ENG-004 | Supabase Auth establishes identity; Go verifies signature/algorithm/key, issuer, audience, expiry and active internal Account/role/owner state on protected actions. Browser claims or public Supabase client credentials do not grant Admin or official evidence. Trusted one-time bootstrap is nonpublic and audited. |
| ENG-005 | Go is the only business authority for eligibility, prerequisites where applicable, assessment grading, evidence tier, version pin and completion. PostgreSQL persists authoritative state; projections may lag but protected writes recheck owner state. Storage serves authorized objects through narrow grants; no privileged service key reaches browser. |
| ENG-006 | HTTP transport follows API-C01–C14 and API-001–044: typed DTO boundary, server-derived `/me` subject, shape/field validation before domain validation, safe `application/problem+json`, 401/403/404 ownership behavior, ETag/If-Match and idempotency-key rules. Do not invent unsupported error codes or change `/v1` semantics silently. |
| ENG-007 | Request IDs propagate from Go ingress through DB transaction, worker and provider where feasible. Structured logs contain safe event/outcome/reason and correlation ID, never tokens, answers, notes, raw payloads or personal content. Define metrics/alerts under OBS-001–012 and FA-008, without silently selecting new thresholds. |
| ENG-008 | Validate all input at trust boundaries: allowlisted fields, content Block schema, reference existence, safe Markdown/media rendering, supported Course-completion prerequisite type and server-authoritative time/version. Reject unsafe unknown fields, unsupported rule types and stale versions. GAP-007 cannot be guessed from a generic payload. |
| ENG-009 | Schema changes are reviewed, versioned, forward-compatible and exercised against PostgreSQL-backed fixtures before merge. Prefer expand/transition/contract; identify backfill, locking, duplicate/foreign-key and rollback/restore risks. Never automatically reverse irreversible deletion, evidence or migration data. |
| ENG-010 | Concurrency uses DB constraints and transaction isolation appropriate to TX contracts, plus idempotency/reconciliation for unknown outcomes. At most one ACTIVE Attempt per Student/Assessment/Version; Results immutable; Course pins and canonical completion cannot race into contradictory state. |
| ENG-011 | Secrets come from managed per-environment stores, never source control or browser bundle. Local, staging and production credentials/data are isolated; least-privilege DB/Storage/CI identities and controlled rotation follow SEC-015/023/024 and INF-06–08. |
| ENG-012 | Dependencies and packages remain pinned/reviewed; CI runs formatting/static checks, unit, PostgreSQL integration, API contract, React component, browser E2E, authorization-negative and migration safety checks as the affected slice requires. Test fixtures carry Course/Assessment versions and privacy lifecycle states; no actual test result is asserted here. |
| ENG-013 | Naming follows existing stable governance IDs in docs and clear domain names in code. API DTOs may use transport names, but domain types remain independent of JSON/SQL. Generated clients or OpenAPI artifacts require separately authorized implementation and contract review. |
| ENG-014 | A material architecture, product-policy, security-policy or retention change requires Decision Registry change control and appropriate Product Owner gate before implementation. A bounded nonmaterial implementation choice may be reviewed in its future slice PR; no DP-06 draft grants Git-write permission. |

## 4. Supabase and frontend trust boundary

The browser may authenticate through Supabase Auth and call the Go API with a token. Go validates identity and independently maps the subject to an active Account, Student/Admin role and resource ownership for every protected command. React may display local Guest position and ungraded interaction, but cannot elevate it to official participation or passing. The browser never writes core LMS PostgreSQL records directly, never holds service-role credentials and never receives unpublished answers. Go owns private Storage authorization and deletion reconciliation. PostgreSQL is the persistence mechanism for authoritative transactions; Supabase managed services do not replace Go rule checks. This is consistent with [SEC-001–024](../DP-04/02-authentication-authorization-and-security.md) and DP-03 MOD/TX ownership.

The exact provider for managed Go containers, production region, paid tier, instance size and numerical recovery objectives remain unapproved. FA-008 B approves the *shape* of managed deployment, GitHub Actions, separated environments, worker/observability and backup compatibility only. AG-06 review may approve the repository structure as an implementation plan, but each slice and any Git operation still needs separate authorization.
