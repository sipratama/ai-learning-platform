# DP-03 — Data Lifecycle & Retention

| Metadata | Value |
|---|---|
| Package | DP-03 — Domain-Aligned Architecture & Data Contracts |
| Version | v0.1.0 |
| Status | **Draft — Not Approved** |
| Approval gate | AG-03 — **Not Approved** |
| Approved sources | [FA-006 B in DP-01 registry](../DP-01/03-decision-registry.md) and [Open Decisions Register](../DP-01/04-open-decisions-register.md); [DP-02 RULE-023/027](../DP-02/02-domain-rules-and-invariants.md); [AG-02 addendum](../DP-02/06-traceability-matrix.md) |

**Approved Product Owner policy:** FA-006 B, Lifecycle-Based Deletion & Data Minimization. Its **30-day active-data deletion**, **30-day backup expiry**, and **180-day security-audit retention** are Product Owner targets, not statutory claims. This document proposes an architecture to meet them; AG-03 is Not Approved. GAP-001/002/003/007 remain Open and are not resolved by deletion design.

## 1. Account lifecycle and deadline

| State / owner | Entry condition and access | Exit / failure contract |
|---|---|---|
| ACTIVE / MOD-001 | Verified Supabase subject maps to active internal Account; Student may request own deletion. | Request validation checks authenticated ownership and validity without exposing another account. Invalid/unauthorized requests create no deletion transition. |
| ACCEPTED_RESTRICTED / MOD-001 + MOD-010 | A valid authenticated Student request is accepted and durably recorded. In the same authoritative local transition, Go invalidates official access. The deadline is measured from the valid request, not from a later cleanup retry. | Repeated request returns the existing case. A still-cryptographically-valid token cannot bypass Go's restricted account check. No self-service recovery once effective deletion begins. |
| CLEANUP_PENDING / MOD-010 | Owner-specific PostgreSQL records, Supabase Auth identity, and private Storage objects are cleaned/de-identified through retry-safe work; backup suppression is active. | Partial provider failure leaves the account restricted and the case retryable. Reconciliation records which owner/provider remains incomplete. |
| COMPLETED / MOD-010 | All required active-data dispositions and verification finish within 30 days of valid request; nonpersonal completion evidence remains as needed under policy. | A completed case is idempotent; it cannot reactivate the account. Backup copies expire within 30 days under the approved target and restore safeguards stay effective until no deleted data can reappear. |

**Proposal:** Treat valid request acceptance and Go-side access invalidation as one local atomic operation. Supabase Auth disabling/deletion may occur asynchronously, but it is not the only access gate. No soft-delete flag alone counts as completed erasure. If a step cannot meet the 30-day active-data target, surface an operational exception for authorized resolution; do not silently mark completion or extend the target. Legitimate legal obligations, where applicable, require explicit case-specific handling; this draft invents no indefinite exception or recovery promise.

## 2. Data classification and disposition

`P` = personal identity/workspace; `L` = Student-linked learning; `I` = internal operational; `C` = public course content. Owners correspond to the [module contract](02-module-boundaries-and-dependencies.md) and [entity IDs](03-logical-data-model.md). “Delete/de-identify” means the applicable policy must choose an irreversible disposition before execution; pseudonymization with a retained re-identification key is not anonymous.

| Data class / examples | Owner and systems | FA-006 B disposition | Verification / unresolved detail |
|---|---|---|---|
| Identity and profile (`P`; ENT-001/002) | MOD-001; Go account mapping and Supabase Auth | Invalidate access on acceptance; delete personal profile and coordinate Auth identity deletion. | Verify Go denies access and provider cleanup succeeds; no self-service recovery. |
| Notes/bookmarks (`P`; ENT-023/024), workspace preferences (`P`; ENT-025) | MOD-009; PostgreSQL and any private object references | Delete notes and bookmarks; minimize/delete linked preferences under account deletion. | Owner confirms absence of active personal records. |
| Participation, enrollment, progress, completion (`P/L`; ENT-011–014) | MOD-004/005/006; PostgreSQL | Delete or irreversibly de-identify Student-linked records according to applicable policy. Historical evidence protection while ACTIVE does not override deletion. | Verify links to deleted identity cannot reconstruct Student history; exact class-by-class choice requires policy/application review. |
| Activity and assessment evidence (`P/L`; ENT-015/018–021) | MOD-007/008; PostgreSQL | Delete or irreversibly de-identify Student-linked evidence, Attempts, Submissions, Results and passing references according to applicable policy. | Immutable while retained is compatible with deletion/de-identification; never silently alter an active Student's grades. |
| Migration/evidence mapping (`P/L`; ENT-028/029) | MOD-005; PostgreSQL | Remove or irreversibly de-identify Student linkage under applicable policy. | Preserve only nonpersonal operational proof if needed; GAP-003 compatibility policy remains open. |
| Private Student files (`P`; ENT-030) | Owning module; Supabase Storage | Delete linked private objects and stale access grants/links. | Reconcile storage inventory and failed deletion retries; public course assets are not automatically Student data. |
| Security audit (`I`, possibly linkable; ENT-026) | MOD-011; controlled audit store | Retain for 180 days unless a legitimate legal obligation requires otherwise; minimize actor linkage and never log tokens, personal payloads, notes or answers. | Verify scheduled expiry and any documented legal exception; accountability mapping is separately protected and policy-bound. |
| Deletion case/work evidence (`P` while linkable; ENT-027) | MOD-010; controlled workflow state | Keep only minimum information required for idempotent completion, retry and backup reconciliation; remove/de-identify personal linkage when no longer needed. | Do not use case record as a self-service recovery path; no invented indefinite case retention. |
| Truly anonymous aggregate (`I`) | Owning analytics/projection capability if later approved | May be retained only when irreversible aggregation cannot identify or relink a Student. | Re-identifiable or small-cell data are not treated as anonymous by assertion alone; no new analytics feature is authorized. |
| Backups containing pre-deletion data | Managed PostgreSQL/Auth/Storage backup mechanisms as applicable | Backup expiry target no later than 30 days; a restore cannot silently resurrect deleted personal data. | Backup inventory, expiry evidence, isolated restore and deletion replay/suppression are required; FA-008 owns infrastructure/recovery specifics. |
| Browser Guest local state (`P` where present; ENT-031) | Browser | Not server official evidence; user/browser clear and optional selective merge follow DP-02. | No server-side passing inferred; account deletion does not claim control of unavailable local browser copies. |

## 3. Deletion orchestration and reconciliation

```mermaid
sequenceDiagram
  actor Student
  participant Go as Go / MOD-010
  participant DB as PostgreSQL owners
  participant Auth as Supabase Auth
  participant Store as Supabase Storage
  participant Guard as Restore safeguard
  Student->>Go: Authenticated own-account deletion request
  Go->>DB: Validate owner; accept case and restrict account atomically
  DB-->>Go: Case accepted; official access blocked
  Go-->>Student: Accepted, no self-service recovery
  Go->>Guard: Register protected deletion marker
  loop Retry-safe owner cleanup
    Go->>DB: Request owner delete or irreversible de-identification
    DB-->>Go: Per-owner outcome
    Go->>Store: Delete private Student objects
    Store-->>Go: Outcome
    Go->>Auth: Remove/disable managed identity
    Auth-->>Go: Outcome
  end
  Go->>Guard: Reconcile backup expiry and restore protection
  Guard-->>Go: Verified status
  Go->>DB: Mark complete only when active-data steps verified
```

*Logical lifecycle; no cross-provider atomic transaction is asserted. The restore safeguard is a protected operational control, not a prescribed service or schema.*

- **Idempotency:** Request acceptance uses one stable deletion case per valid account request; each cleanup unit records completion so a retry cannot recreate data or duplicate side effects. An unknown provider outcome is reconciled before repeat action.
- **Failure recovery:** The Account remains restricted while a dependency is unavailable. The coordinator retries and exposes overdue work to authorized operators without exposing personal payloads in logs. Completion requires independent checks of Auth, PostgreSQL and private Storage cleanup.
- **Backup restore:** Keep a minimal protected suppression/deletion record outside restorable stale data for only the necessary backup window, subject to minimization. Restore into a restricted state, replay or verify deletions, then allow access only after the deleted account/data cannot reappear. A restored Auth identity or token must not bypass MOD-001's account state.
- **Audit evidence:** Record case state, operation outcome, time, owner/provider and nonpayload correlation reference. Limit actor mapping separately; do not store notes, answers, profile fields, raw tokens or personal content in security logs. Enforce 180-day expiry unless a legitimate legal obligation is documented.
- **Policy boundary:** FA-006 B permits deletion **or irreversible de-identification** of Student-linked learning data according to applicable policy. This draft does not choose an unapproved class-by-class exception. FA-008 must later specify operational backup mechanisms and recovery objectives; FA-007 owns numeric UX/performance thresholds.
