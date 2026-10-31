# DP-04 — API Workflows & Failure Contracts

| Metadata | Value |
|---|---|
| Package | DP-04 — API, Security & Operations Contracts |
| Version | v0.1.0 |
| Status | **Draft — Not Approved** |
| Approval gate | AG-04 — **Not Approved** |
| Approved sources | [DP-01 registry](../DP-01/03-decision-registry.md) (FA-001–FA-006 B, FA-006-B1 B); [DP-02 rules](../DP-02/02-domain-rules-and-invariants.md), [acceptance](../DP-02/05-acceptance-criteria.md); [DP-03 transactions](../DP-03/05-consistency-and-transaction-design.md) |

All API IDs refer to the **proposed** [resource inventory](01-api-contract-and-resource-design.md); no endpoint is approved merely by appearing here. Go performs role, owner, lifecycle and applicable policy checks at the authoritative write boundary ([security](02-authentication-authorization-and-security.md)). Every failure returns a safe correlation ID and leaves prior official evidence intact unless a documented accepted transition already committed. Retrying an unknown outcome begins with reading authoritative state, not blindly repeating a side effect. `WF` IDs are proposed interaction contracts for AG-04 review.

## 1. Workflow matrix

| ID / actors and preconditions | API sequence and authoritative transition | Authorization, transaction and race | Failure, retry, audit and acceptance |
|---|---|---|---|
| WF-001 Guest catalog; public visitor | API-001/002 search/filter → API-003/004 detail → API-005 free Lesson. No enrollment/evidence mutation. | Public visibility only; archived listing depends on GAP-001. Reads may use projection but protected actions recheck owner state. | Invalid query 400, hidden 404, provider failure 503; retry GET. No Student audit. AC-001–005/047–048. |
| WF-002 Guest → Student; explicit authentication/recovery choice | Supabase Auth sign-in → Go actor resolution API-006; selected eligible local position/drafts/settings merge through approved owner capability, not an official-pass API. | Go verifies token and own Account; local claim is never server passing/completion. Merge is idempotent and preserves authoritative evidence. | Auth failure 401; merge conflict 409; retry safe selection, no forced merge. AC-005/012/013. |
| WF-003 Student Path join; active account and discoverable Path | API-003 view → API-007 explicit join → API-008/009 participation/progress. Join creates only Path participation. | Go owns authenticated join; TX-001 idempotent; no member Course enrollment. Global Course achievements are read for official progress. | 404 unavailable, 409 conflicting context; retry PUT returns existing join. Path leave/migration GAP-002 blocked. AC-006/007/019/052–055. |
| WF-004 Student Course enrollment/prerequisite; eligible published Course | API-004 detail → API-010 explicit enrollment or first official intent → API-011 pin. Go checks Course-completion prerequisite **when applicable**. | Student own enrollment; TX-002 checks publication/version and global completion at protected action. Concurrent enroll/archive chooses committed eligible state. | 409 archived/unmet applicable prerequisite, 412 stale version; repeat PUT idempotent. Exact protected action set GAP-007. AC-008–011/048/064–067. |
| WF-005 Guest/Student Lesson read and progress | Guest API-005 reads free content/local practice; Student API-012 pinned Lesson and API-013 authoritative progress. Local state cannot become official proof. | Visibility/pin check; reads do not enroll merely by browsing. Existing eligible pinned access survives normal archive. | 403 revoked or 404 hidden; retry GET after safe recovery. Archived listing/revocation detail GAP-001. AC-004/015/035/047. |
| WF-006 Student activity evidence; eligible pinned context | API-015 sends activity/version and proof → Go records only supported server participation or verified passing tier → API-013 reflects progress. | Own enrollment, policy and tier checked in TX-006; duplicate claim converges; no Guest local promotion. | 409 stale pin, 422 unsupported proof; key-based safe retry. AC-014–016/018. |
| WF-007 Student Attempt start; eligible Assessment Version | API-016 metadata → API-017 start/resume → API-018 own Attempt. One ACTIVE per Student/Assessment/Version, locked and default 24-hour expiry. | Go owns TX-007; concurrent starts return same active context or one wins. Prior passing remains. | 409 retry not allowed, 422 wrong version; idempotency key and state lookup. AC-024–026/031/061. |
| WF-008 Student Attempt terminalization; ACTIVE Attempt | Go checks authoritative expiry → EXPIRED; ABANDONED only through an approved trigger. API-018 shows terminal history; retry eligibility counts expired/abandoned. | TX-008 serializes submit versus terminal transition; exact abandonment trigger GAP-003 remains blocked. | Late submit 409, stale version 412; repeated expiry idempotent, no scored failure or prior-pass invalidation. AC-026/027/030/062/063. |
| WF-009 Student submission/grading; own ACTIVE unexpired Attempt | API-019 locks version, validates answers, commits Submission/immutable Result; API-018 reads same Result. | TX-009 atomic; same replay returns same result, conflicting duplicate rejected. Go alone grades; no client score authority. | 409 terminal/conflicting replay, 412 version mismatch, 503 before commit; read state before retry. AC-022/028–031/061–063. |
| WF-010 Student explicit completion; own pinned Course/Lesson | API-013 unmet conditions → API-044 Lesson or API-014 Course explicit action → Go validates tiered evidence, Assessment and applicable prerequisite; emits authoritative achievement. | TX-011 coherent policy/evidence check; concurrent requests converge; canonical Course completion is reused across Paths, Path participation separate. | 409 unmet proof, 412 stale pin; idempotent PUT and no false completion. AC-017–021/053/054. |
| WF-011 Admin author/preview/publish; authorized draft | API-039/040 create Course/Path drafts; API-030/041 edit; API-031/042 preview; API-032/043 publish distinct validated versions; API-029 lists Course versions. | Go Admin checks, ETag and TX-003/013; Course publish does not change existing pins, Path membership changes preserve earned completion. | 403 unauthorized, 412 stale draft, 422 invalid structure; key-based publish retry, durable audit. Detailed Path curriculum migration GAP-002 blocked. AC-020/032–035/040/044/054. |
| WF-012 Student pinned-version resume; existing eligible enrollment | API-011 identifies pin → API-012 reads that version, regardless of newer publication. | Read Go enrollment/access owner; no silent migration, no mutable published snapshot. | 403 exceptional restriction under approved policy, 404 absent; retry GET, keep historic evidence. AC-035/047. |
| WF-013 Admin manual Course migration; explicit authorization and eligible target | API-029 source/target review → API-034 selected enrollments, explicit mapping and durable learner notice → API-011 new pin after success. | TX-015 compares current pin, preserves original evidence/Attempts/completion, carries only explicitly compatible verified evidence. **Implementation blocked by GAP-003** compatibility/target criteria. | 403 unauthorized, 409 pin race, 422 mapping failure; key retry and audit/notice reconciliation; old pin on failure. AC-036–038/056–060. |
| WF-014 Admin normal archive/unpublish; authorized Course | API-033 publication-state change → API-010 rejects new enrollment; API-011/012 continues existing eligible pin. | TX-004 distinct from revocation; ETag protects concurrent enroll/archive; no historical erasure. | 412 stale, 403 unauthorized; repeat state change safe, audit. Public listing detail GAP-001 remains blocked. AC-047/048/051. |
| WF-015 Admin exceptional revocation; explicit approved policy required | API-035 records separate authorized access change; never reuse normal archive. Historical completion/Results/passing remain. | TX-005 requires policy/privilege/audit; **implementation blocked by GAP-001** parameters. | 403 policy-less, 409 stale access, 422 invalid scope; key retry/audit reconciliation. AC-049–051. |
| WF-016 Student account deletion; valid authenticated own request | API-036 accepts request, durably restricts Go access and returns case state; worker coordinates owner PostgreSQL, Supabase Auth/Storage and backup restore safeguards. | TX-016 local acceptance/access invalidation; TX-017 retry-safe cross-provider cleanup. Individual linked learning records deleted or irreversibly de-identified; only truly anonymous aggregates may remain. | Invalid identity 401/403; unknown outcome resolved by case state; failed job remains restricted and escalates. Active data within 30 days of valid request, backup expiry within 30 days; security audit 180 days unless legal obligation. AC-045/046; FA-006 B/B1. |
| WF-017 Student basic export request; active own account | API-037 accepts own request and returns policy-dependent state; no unapproved delivery deadline is promised. | Go owner check; key-based duplicate convergence; export processing cannot expose other Student records. | 403 foreign/restricted, 409 duplicate; retry by request state. AC-045/046. |
| WF-018 Admin scoped audit review; authorized operator | API-038 reads minimized audit events with cursor/filter, no personal payloads or unrestricted export. | Go role/scope and object checks; 180-day security audit expiry unless legitimate legal obligation. | 403 insufficient scope, 404 hidden, 503 dependency failure; safe GET retry. AC-040/041/049; FA-006 B. |

## 2. High-risk sequence contracts

```mermaid
sequenceDiagram
  actor Student
  participant API as Go API
  participant DB as PostgreSQL owners
  Student->>API: API-017 start Assessment Version V with key
  API->>DB: Check eligible pin/retry and get-or-create ACTIVE Attempt for S/A/V
  DB-->>API: One version-locked Attempt and expiry
  Student->>API: API-019 submit Attempt answers
  API->>DB: Atomically check ACTIVE, expiry, V and commit Result once
  alt accepted
    DB-->>API: Immutable Result
    API-->>Student: Same Result on safe replay
  else expired, abandoned or conflicting
    DB-->>API: Terminal/current state
    API-->>Student: Safe 409/412; prior passing unchanged
  end
```

*WF-007–WF-009. Expired/abandoned Attempts enter applicable retry accounting; abandonment trigger remains GAP-003.*

```mermaid
sequenceDiagram
  actor Admin
  participant API as Go API
  participant DB as PostgreSQL owners
  participant Notice as Learner notice
  Admin->>API: API-034 source, target, selected enrollments, mapping and key
  API->>API: Check privilege, eligible target and verified compatibility
  alt policy detail unresolved
    API-->>Admin: Block implementation pending GAP-003
  else approved policy available
    API->>DB: Compare pin; commit target pin, mapping, audit/notice obligation
    DB-->>API: Migration record or stale conflict
    API->>Notice: Deliver and reconcile learner notice
    API-->>Admin: Recorded outcome and notice state
  end
```

*WF-013 is a conditional contract; this diagram does not approve compatibility criteria or target eligibility.*

```mermaid
sequenceDiagram
  actor Student
  participant API as Go API
  participant DB as PostgreSQL owners
  participant Worker as Privacy worker
  participant Managed as Supabase Auth and Storage
  Student->>API: API-036 valid own deletion request
  API->>DB: Accept case and restrict Account atomically
  DB-->>API: Restricted case; deadline from valid request
  API-->>Student: Accepted state; no self-service recovery
  API->>Worker: Durable cleanup obligation
  loop Retry-safe reconciliation
    Worker->>DB: Owner delete or irreversible de-identification
    Worker->>Managed: Delete Auth identity and private objects
    Managed-->>Worker: Outcome
  end
  Worker->>DB: Verify active cleanup and restore suppression before complete
```

*WF-016 preserves FA-006 B/B1 targets and does not treat a soft-deleted flag or managed backup service as completed erasure.*

## 3. Failure and policy boundary

No workflow infers Path leave/curriculum migration (GAP-002), exceptional revocation parameters or public archive listing (GAP-001), migration compatibility/abandonment trigger (GAP-003), or exact protected prerequisite action set (GAP-007). Conditional branches are documentation only and blocked for implementation. FA-007 remains the source for quantitative UX/performance/beta thresholds. See [operational runbooks](05-observability-reliability-and-runbooks.md) for dependency recovery.
