# DP-04 — Authentication, Authorization & Security

| Metadata | Value |
|---|---|
| Package | DP-04 — API, Security & Operations Contracts |
| Version | v0.1.0 |
| Status | **Draft — Not Approved** |
| Approval gate | AG-04 — **Not Approved** |
| Approved sources | [DP-01 registry](../DP-01/03-decision-registry.md) (Q-006, G3-001/003, FA-006 B, FA-006-B1 B, FA-008 B); [DP-02 permissions](../DP-02/03-user-journeys-and-permissions.md), [rules](../DP-02/02-domain-rules-and-invariants.md); [DP-03 trust boundary](../DP-03/01-architecture-overview.md), [identity/data owners](../DP-03/02-module-boundaries-and-dependencies.md) |

**Contract status:** Approved product and infrastructure direction supplies the guardrails. `SEC` controls below are **derived/proposed technical contracts requiring AG-04 review**. “Evidence” is a verification plan, not a claim that testing has occurred. GAP-001/002/003/007 are Open; their policy-dependent operations remain blocked for implementation. No public Auth or Storage client is allowed to write core LMS business data directly.

## 1. Identity and trust flow

1. Guest public reads require no Student identity; they may not issue official enrollment, passing, graded Result or completion.
2. Supabase Auth authenticates Student/Admin identity. A proposed browser transport uses a short-lived bearer access token sent only to Go over TLS; public client configuration is distinct from privileged service credentials. Token persistence/refresh must be reviewed for XSS and CSRF risk. If a cookie-based transport is selected later, add CSRF protection before release.
3. Go verifies signature against configured trusted algorithm/keys, issuer, audience, expiry and not-before, including bounded clock skew and key rotation. Unknown key, invalid claim or unavailable validation material fails protected requests closed. The exact Supabase verification mechanism is deployment-specific; no unverified provider default is assumed.
4. Go maps the verified external subject to one internal Account, then checks account lifecycle, role, ownership and current resource policy. A cryptographically valid token cannot restore access after an accepted deletion request. Provider sign-out/revocation is coordinated but is not the only access gate.
5. Admin bootstrap is a trusted, nonpublic, one-time privileged operation tied to a known Supabase user identity, with authorization and audit. No public sign-up flag, role claim or permanent unrestricted bootstrap path grants Admin rights.

```mermaid
sequenceDiagram
  actor Actor
  participant Auth as Supabase Auth
  participant Go as Go API
  participant DB as Account/role owner
  Actor->>Auth: Authenticate
  Auth-->>Actor: Signed identity token
  Actor->>Go: Protected request with token
  Go->>Go: Verify signature, issuer, audience, exp, nbf, key state
  Go->>DB: Resolve subject, role, lifecycle and ownership
  alt active and authorized
    DB-->>Go: Scoped actor context
    Go-->>Actor: Authorized result
  else invalid or restricted
    Go-->>Actor: 401 or safe 403/404; no protected mutation
  end
```

*Logical security sequence. It does not specify a final token storage scheme or endpoint.*

## 2. Control matrix

`Verification` describes required future evidence for AG-04/implementation review; none is asserted as completed. Enforcement is server-side unless explicitly noted. See [API inventory](01-api-contract-and-resource-design.md), [workflows](03-api-workflows-and-failure-contracts.md), and [runbooks](05-observability-reliability-and-runbooks.md).

| ID / threat | Required control and enforcement boundary | Planned verification evidence | Source / dependency |
|---|---|---|---|
| SEC-001 Forged token | Go validates token signature and approved algorithm/key against trusted Supabase configuration; reject unsigned, altered or unknown-key tokens. | Negative signature/algorithm/key tests; rotation drill. | G3-001, ADR-002. |
| SEC-002 Wrong issuer/audience | Go matches configured issuer and audience per environment; cross-environment credentials cannot authenticate. | Wrong issuer/audience and staging-to-production rejection tests. | G3-001, INF-06. |
| SEC-003 Expired/early token | Go validates expiry/not-before and bounded clock skew; invalid token yields 401 before business command. | Expired/nbf boundary tests. | G3-001, ADR-002. |
| SEC-004 Key rotation outage | Trusted key material refresh and safe rotation; unknown key fails closed while public safe reads remain possible. | Rotation/failure drill and error-rate observation. | G3-001, INF-09. |
| SEC-005 Deleted-account token reuse | Go checks internal account lifecycle on every protected command; accepted deletion invalidates access even before provider token expiry. | Replay old token after accepted deletion; verify 403 and no mutation. | FA-006 B/B1, TX-016. |
| SEC-006 Role escalation | Go-owned role grants, least privilege and trusted Admin bootstrap; browser or token metadata alone cannot self-assign Admin. | Student-to-Admin tampering tests and bootstrap audit review. | Q-006, G3-001, RULE-026. |
| SEC-007 BOLA/IDOR | Derive `/me` subject from verified actor; owner checks on enrollments, progress, Attempts, notes, bookmarks, privacy cases and Storage objects. Foreign IDs return safe 403/404. | Cross-Student ID matrix with no data leakage. | RULE-024/027, AC-039/046. |
| SEC-008 Privileged content mutation | Separate Admin permission for draft, preview, publish, archive, migration and audit; recheck at action boundary. | Guest/Student denial and scoped Admin success tests. | RULE-020/024/028, PERM-008/014. |
| SEC-009 Exceptional revocation | Distinct explicitly authorized auditable policy/action; normal archive cannot act as mass revocation. | Deny policy-less request; verify audit and protected evidence. | AG02-01, RULE-029; GAP-001 blocks parameters. |
| SEC-010 Migration abuse | Admin authorization, source/target/enrollment ownership, verified compatibility mapping, audit and learner notice obligation. | Unauthorized/mismatched mapping rejection and historic-evidence checks. | AG02-03, RULE-022/031; GAP-003 blocks criteria. |
| SEC-011 Assessment answer exposure | Published learner response excludes answer keys/unpublished versions until permitted result disclosure; Admin authoring is scoped. | Guest/Student object enumeration and response-field tests. | D-016, RULE-015/020/024. |
| SEC-012 Grade forgery | Go owns Attempt uniqueness, locked version, grading and immutable Results; browser evidence cannot create passing. | Duplicate/late/version-mismatch and forged evidence tests. | FA-002/003 B, AG02-04, RULE-009/016–019. |
| SEC-013 Prerequisite bypass | Go validates global Course completion for each applicable protected official action; never trust client predicate. | Unmet prerequisite mutation denial across approved action list. | AG02-05, RULE-005; exact list GAP-007 Open. |
| SEC-014 Unpublished content exposure | Public catalog/content adapters filter drafts, private versions and unpublished assessment answers; server rechecks visibility before object access. | Direct-ID/URL guessing tests and archived-state review. | RULE-020/025/028; listing GAP-001. |
| SEC-015 Storage credential/object leak | Privileged Supabase credentials server-side in managed secret store; Go authorizes private object access and short-scope grants where needed. | Secret scan, browser bundle inspection, cross-owner object tests. | G3-001/003, INF-08, ADR-010. |
| SEC-016 CORS/CSRF | Explicit allowed web origins per environment; reject credentialed wildcard CORS. Bearer-header proposal limits ambient-cookie CSRF; cookie transport requires anti-CSRF design before use. | Origin/credential tests; CSRF threat review for selected transport. | G3-001, INF-06/08. |
| SEC-017 XSS/token handling | Encode rendered content, sanitize supported rich/Markdown blocks, constrain unsafe media, and avoid exposing tokens in logs/URLs or long-lived browser storage by default. | Content injection tests and browser storage review. | Q-007, G3-001/003. |
| SEC-018 Abuse/rate pressure | Bound request sizes, cursor/page size, attempts and public search; rate-limit by appropriate actor/source without revealing account existence. | Load/abuse tests, 429 behavior, false-positive review. | G3-001, INF-09; numeric thresholds FA-007 Open. |
| SEC-019 Input/domain validation | Parse and validate types, references, versions and supported Block/prerequisite forms; reject unsafe unknown mutation fields. | Malformed payload, path traversal and unsupported-type tests. | RULE-005/020, AC-044/066. |
| SEC-020 Safe errors | Standard problem response with correlation ID, no stack trace, raw query, token, private title, answer or other account data. | Error-path disclosure review. | G3-003, RULE-024. |
| SEC-021 Audit integrity and minimization | Durably audit privileged bootstrap/publish/migrate/revoke/deletion outcomes without personal payloads; restrict readers and retain security audit 180 days unless legitimate legal obligation. | Audit completeness/access/expiry tests; legal-exception review. | Q-006, FA-006 B/B1, INF-09. |
| SEC-022 Deletion across providers | Accept only own valid request; restrict access atomically, retry owner/Auth/Storage cleanup, restore suppression; individual linked records delete or irreversibly de-identify. | Failure/retry/restore drill; 30-day active/backup tracking. | FA-006 B/B1, TX-016/017, INF-11. |
| SEC-023 Transport/dependency protection | TLS for public traffic and protected service connections; least-privilege DB/Storage/service identities; no browser service key or unrestricted DB writes. | Configuration review and credential-scope test. | G3-001/003, INF-08. |
| SEC-024 Supply-chain/release privilege | GitHub Actions build with dependency/secret checks, restricted deploy credentials and explicit production approval; artifact identity retained. | CI run, approval and artifact provenance review. | INF-07/08, G3-004. |

## 3. Authorization decision matrix

| Resource/action | Guest | Student | Admin | Enforcement owner |
|---|---|---|---|---|
| Public catalog/free flagship Lesson | Read permitted published/free content | Same, plus own context | Preview/author under privilege | Go catalog/content visibility; SEC-014. |
| Official Path join / Course enroll | Login required | Own only, independent actions | Cannot forge Student evidence | Go participation/enrollment; SEC-007/013. |
| Own Attempt/Result/completion | Deny | Own eligible version-locked state | Author policy; cannot submit/grade as Student | Go Assessment/Progress; SEC-007/012. |
| Notes, bookmarks, preferences | Local only where applicable | Own only | No arbitrary owner bypass | Go Workspace; SEC-007. |
| Publish/archive/migrate/revoke | Deny | Deny | Distinct privileges and approved policy; audit | Go Content/Enrollment; SEC-008–SEC-010. |
| Deletion/export request | Login required | Own valid request only; deletion later blocks access | No arbitrary Student request | Go Privacy/Identity; SEC-005/022. |
| Audit review | Deny | Deny | Scope-limited, no payload leakage | Go Audit; SEC-021. |

## 4. Conditional and later-gate boundaries

GAP-001 controls exceptional revocation parameters and archived listing; GAP-002 Path leave/curriculum migration; GAP-003 compatibility/target eligibility/abandonment trigger; GAP-007 protected prerequisite action list. None is filled by a security control. FA-007 still determines quantitative UX/performance/beta thresholds. FA-008 B approves managed operational direction but neither a specific Go host nor final Singapore region. AG-04 review must approve the proposed technical controls before any implementation authorization can be inferred.
