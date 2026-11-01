# VS-02A — Product Owner Decision Pack and Implementation Gate (2026-11-01)

| Field | Status |
|---|---|
| Purpose | Decision-ready next step after VS-01A Guest proof; **documentation only** |
| Starting `main` | `00480abd9970bdea127d2e3706a260cf53bb29d9` (merged PR #14) |
| Sources | [VS-02A scope](01-scope-and-dependency-assessment.md), [identity design](02-identity-and-authorization-design.md), [account schema](03-account-schema-and-lifecycle-design.md), [threat/test matrix](04-threat-model-and-security-test-matrix.md), [bundle plan](05-environment-and-implementation-plan.md), [open register](06-readiness-decision-and-open-questions.md), [VS-01A closure contract](../DP-06/07-vs-01a-formal-closure-and-acceptance.md), [latest review](../DP-06/08-vs-01a-current-main-closure-candidate-review-2026-11-01.md) |
| Author | AI-assisted preparation; not independent human reviewer or signed PO decision |
| Outcome | **READINESS PACK PREPARED; VS-02A IMPLEMENTATION NOT YET AUTHORIZED** |

## 1. What has actually happened since the original readiness package

- PR #14 merged; Issue #13 is closed with all checklist boxes checked. The Product Owner's [comment on Issue #13](https://github.com/sipratama/ai-learning-platform/issues/13) explicitly approves the **bounded disposable VS-01A proof subject to completion and verification of all mandatory independent review requirements**. This is an attributable **conditional PO disposition**, not evidence of a second human reviewer.
- The merged audit document states `PENDING INDEPENDENT HUMAN REVIEW AND PO DD-001 DECISION`. The authoritative [VS01A-CLOSE-001](../DP-06/07-vs-01a-formal-closure-and-acceptance.md) still says `PENDING SIGN-OFF`. A checked issue, closed issue or merged documentation PR does not override the source-of-truth record.
- No independent human PR review is recorded on PR #14. The user has confirmed they personally performed the Product Owner review. **Do not invent independent approval or rewrite historical decision fields.**
- The earlier Guest candidate `d12727edc92170dc0bc3c27060786ca37a504b0b` had passing hosted CI; PR #14 is documentation-only. This pack does not claim fresh runtime or provider verification.

## 2. Bounded product decision proposal (not automatically approved)

The smallest implementation that avoids speculative privilege and data flows is:

| Decision | Recommended default | Explicit non-goals / constraint | Open item |
|---|---|---|---|
| Authentication | **VSA-P1: Supabase Auth ES256 only**, trusted exact issuer/audience and configured JWKS, strict JOSE verification in Go | No HS256 fallback, no JWT decode-only, no user-controlled key URL; actual tenant signing profile must be verified | O03/O04 |
| Protected API | Start with read-only `GET /api/v1/me`; Go derives internal Account/roles from verified subject and private DB | No implicit account creation on GET; no browser-supplied Account ID, no role from JWT metadata | O02/O06 |
| Account provisioning | Trusted **nonpublic synthetic operator** provisions known test subjects, Student role only | No public signup, no auto-link by email, no Admin role via provisioning | O06/O07 |
| Session | Browser memory-only access credentials for initial proof; explicit re-login after reload | **Proposed only**. Provider logout may not immediately revoke an already-issued access JWT; resolve replay window before implementation | O05/O06 |
| Authorization | Go-owned server-side Student/Admin grants, ACTIVE access-state check on each protected request | No Admin bootstrap via public API; no trusted role claim from provider | O07/O09 |
| Storage | Private PostgreSQL `identity` schema with unique issuer/subject, immutable internal Account ID, atomic provision/audit, no exposed browser grants | No real learner records, production migrations, broad RLS bypass or service-role key in browser | O07/O10/O11 |
| Admin bootstrap | One-time trusted operator command for known synthetic subject with atomic audit and consumed marker | **Defer** until operator authority, MFA/assurance and recovery model are explicitly reviewed | O09 |
| Account states | Fail closed on absent/restricted/deleted; suspend/reinstate commands deferred until transition policy approval | No deleted-account resurrection | O08 |
| Audit | Minimal protected security events, limited accountability mapping, explicit retention/expiry owner | No raw JWT, email, credential or indefinite identity mapping | O10 |
| Data scope | Isolated synthetic users only | VS-06A gates real Student/Admin data, deletion/restore and production rollout | O11 |

These defaults are a **recommendation for review**, not an approved technical standard, operational provider observation or permission to write code.

## 3. Critical path — gates before bundle 1

| Order | Gate | Evidence needed | Status |
|---|---|---|---|
| G0 | **VS-01A predecessor**: separate qualified independent human review or valid, prospectively effective governance amendment; final explicit DD-001 disposition | Named reviewer, scope/conflicts, artifact preservation, residual dispositions, exact candidate SHA, PO decision and effective date in closure ledger | **OPEN** |
| G1 | **VS-02A security/design**: independent identity/security specialist reviews VSA-P1 and threat matrix; DR-001/HAND-001 and separate PO QUAL-002 implementation authority | Attributable review with actual decisions, tests, scope and owner; not just checklist | **OPEN** |
| G2 | **Synthetic provider environment**: authorized project/region, ES256 JWKS, exact issuer/audience, verified test roster and environment/CI access | Redacted environment manifest; no tokens, passwords or private keys in Git | **OPEN** |
| G3 | **Bundle-1 design decisions**: JOSE dependency/version, TTL/skew/lifetime/rotation/outage, logout/session replay choice | Reviewed decision record and negative-test acceptance criteria | **OPEN** |
| G4 | **Implementation authorization**: explicit PO instruction naming bundle 1, scope and exclusions **after G0–G3** | Dated authorization linked in issue/decision registry | **OPEN** |

Readiness work such as provider comparison, threat review, and decision drafting may proceed **without** treating G0–G4 as passed. No credentials, infrastructure purchase, Supabase provisioning, migrations, deploy or Auth code are authorized by this document.

## 4. Later gates by bundle

- **Before bundle 2**: O06/O07 — provisioning and PostgreSQL major/version, migration runner, privileges, transactions and concurrent collision behavior.
- **Before bundle 4**: O09 — trusted Admin bootstrap target/operator, independent security approval, audit, MFA/recovery.
- **Before bundle 5**: O08/O10 — state transition/reinstatement authority and durable audit retention.
- **Before bundle 6**: O06 — browser session persistence, safe return routes and auth UX.
- **Before final VS-02A acceptance**: O12 — actual synthetic Go/PostgreSQL/Supabase/browser execution of applicable VSA-T01–T33, evidence and independent disposition. O11 still gates real data.

## 5. Recommended next review sequence

1. **Review and record PO choices for O04/O05/O06**: ES256-only; choose whether short-lived JWT remains valid until expiry after provider-only logout or add a reviewed live session check; decide existing-user-only, nonpublic synthetic provisioning and memory-only browser sessions. The logout choice is a **security decision** and cannot be assumed from this recommendation.
2. **Resolve G0 explicitly**: since the project is solo-owned, either obtain genuinely independent human security/QA review or formally propose/adopt an appropriately authorized governance amendment for this bounded proof. PO self-signoff is valid PO evidence, **not independent human evidence**. Never retroactively mark earlier reviews independent.
3. **Select the authorized synthetic Supabase environment**; validate actual ES256 key profile and isolate PostgreSQL/CI secrets. Do not publish identifiers or secrets in an issue.
4. **Request independent security review** of VSA-P1 and critical tests (T02–T10, T14–T22, T27–T31); resolve any design changes in the original docs with review trail.
5. **After G0–G4**: create `feat/vs-02a-token-verification` from the then-current main. Implement only fixed-trust JWT verifier and protected API skeleton with local fake-JWKS tests, fail-closed errors, no Student/Admin writes, no public signup, no bootstrap, no deployment. Open a separate PR with Go unit/fuzz/HTTP/CI evidence.

## 6. Decision template for accountable human approvers

> VS-02A design decision (date/time UTC): I, [role/identity], approve/revise/reject the explicitly named options O04 [choice], O05 [choice], O06 [choice]. Evidence reviewed: [permalinks]. Exceptions/risks: [items, owners, milestones]. Independent reviewer [identity, role, separation] disposition: [link]. This decision does not authorize implementation unless G0–G4 are independently satisfied and a separate scoped implementation approval is recorded.

**No boxes or approvals in this pack are pre-checked.** The next PR is documentation-only; merging it means the decision pack is available, **not** that VS-02A is approved or VS-01A formally closed.

## 7. Addendum — PO platform/algorithm selection (2026-11-01)

Following this pack's creation, the Product Owner explicitly agreed to use **a dedicated hosted Supabase synthetic test project with ES256** and requested further GitHub readiness work. This is recorded in [VSA-DEC-001](08-po-supabase-hosted-es256-platform-selection-2026-11-01.md) and the [setup/verification runbook](09-hosted-supabase-es256-synthetic-setup-and-verification-runbook.md).

- **SELECTED:** hosted Supabase for VS-02A synthetic identity testing; ES256/P-256 as the intended only accepted user JWT signature algorithm (part of O03/O04).
- **NOT SELECTED/VERIFIED:** actual test tenant, region, billing, credentials, issuer, audience, public keys, JOSE dependency/defaults, logout replay/session policy, account provisioning UX, or database privileges.
- **NOT AUTHORIZED:** Auth implementation, migration, privileged grants, provider key changes or production. **G0–G4 remain open** and VSA-O01/O02/O05/O06 require separate dispositions. Retain the earlier decision matrix as history: later selection of two items does not imply wholesale approval.

The runbook has executable-looking **operator instructions, not executed tests**. Neither this addendum nor the merge of its documentation PR constitutes independent human review or a formal VS-01A closure decision.
