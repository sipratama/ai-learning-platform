# Feature inventory — 2026-11-01

The working product is a **read-only, synthetic Guest learning demonstration**. It is not an authenticated learning platform yet. This assessment covers baseline `a6ca53b03063a3ed357d4175dec562b7e3a38693` plus the local Docker packaging and tests in this working tree. Preflight began on 2026-10-31; this inventory uses the completion date in Asia/Jakarta. No product feature, policy, dependency version or governance status was changed.

## Classification and evidence

`IMPLEMENTED_AND_TESTED` means the bounded capability below exists and passed the referenced check. `IMPLEMENTED_NOT_VERIFIED` means implementation exists but execution was not verified. `PARTIAL` means only part of the named product capability exists. `NOT_IMPLEMENTED` means the contract is planned but executable implementation is absent. `BLOCKED_BY_DECISION` identifies an unresolved policy dependency. `OUT_OF_SCOPE` identifies excluded/deferred product scope. These are technical observations, not formal acceptance. No capability needed the `IMPLEMENTED_NOT_VERIFIED` classification in this assessment; Docker Desktop itself remains an unverified runtime platform.

Evidence keys used in every table:

| Key | Source / execution evidence |
|---|---|
| G | Actual [React routes](../../apps/web/src/app/App.tsx), [catalog](../../apps/web/src/screens/Catalog.tsx), [details](../../apps/web/src/screens/Details.tsx), [reader](../../apps/web/src/screens/Reader.tsx), [shell](../../apps/web/src/components/Shell.tsx), [blocks](../../apps/web/src/components/Blocks.tsx). |
| A | Actual [Go public HTTP routes](../../apps/api/internal/platform/httpserver/public.go), [public service](../../apps/api/internal/publiclearning/service.go), [cursor implementation](../../apps/api/internal/publiclearning/cursor.go), [fixture adapter](../../apps/api/internal/devfixture/repository.go). Only five public GET endpoint patterns, fixture media and liveness are implemented. |
| D | New [Docker browser suite](../../apps/web/tests/local-preview/guest-docker.spec.ts), [config](../../apps/web/playwright.local.config.ts): actual Go through Nginx, no interception; desktop 1440×1000 and mobile 390×844. See [run results and evidence](../local-preview/README.md#verification-record). |
| U | Frontend typecheck, lint, 26 unit/component tests and build passed. [App tests](../../apps/web/src/app/App.test.tsx), [block tests](../../apps/web/src/components/Blocks.test.tsx), [shell tests](../../apps/web/src/components/Shell.test.tsx), [API tests](../../apps/web/src/lib/api/public.test.ts). |
| T | Standard and `devfixture` Go vet/tests, [fixture boundary](../../scripts/check-fixture-boundary.sh), and actual Docker staging/production startup rejection passed. Public contract/visibility tests: [Go HTTP tests](../../apps/api/internal/platform/httpserver/public_fixture_test.go). |
| N | Source inventory: G/A are the complete current browser/API surfaces; no identity, Student, Admin, SQL migration, database, worker or cloud integration implementation exists. A documentation contract, private fixture marker or package name is not feature implementation. For absent capabilities, **NOT RUN** means there is no implementation to execute; the absence assessment is source inspection plus the roadmap contract. |
| R | Authoritative [16-increment roadmap](../DP-06/01-implementation-roadmap-and-dependencies.md), [acceptance contracts](../DP-06/03-vertical-slice-backlog-and-acceptance-contracts.md), [MVP scope](../DP-01/02-mvp-scope-baseline.md). Later registry addenda govern current approvals; original Draft metadata is historical. |

## Guest learning

| Capability | VS ID | Classification | Implementation evidence | Test evidence | Main limitation | Next required work |
|---|---|---|---|---|---|---|
| Public catalog | VS-01A / 01B | IMPLEMENTED_AND_TESTED | G `/catalog`; A `/api/v1/catalog/{paths,courses}` | D HTTP/journey/catalog | Synthetic read-only snapshot only | VS-05A/05B + 01B controlled published content |
| Learning Paths | VS-01A / 01B | IMPLEMENTED_AND_TESTED | G cards; A two visible Paths | D catalog/path | No join or official Path state | VS-02B participation; 01B production reads |
| Courses | VS-01A / 01B | IMPLEMENTED_AND_TESTED | G cards; A two visible Courses; canonical flagship shared across Paths | D catalog/course | No enrollment; fixture version only | VS-02B enrollment; 01B production reads |
| Search / membership filters / pagination | VS-01A | IMPLEMENTED_AND_TESTED | G URL/search/reset/load-more; A q, courseId/pathId, limit, signed cursor | D matching/no-match/reset/filter/two-page read and invalid cursor cases; U/T | Two-item fixture; cursor expires on process restart; no production-scale performance evidence | VS-01B persistent projections and realistic volume |
| Path detail | VS-01A / 01B | IMPLEMENTED_AND_TESTED | G `/paths/:pathId`; A `/api/v1/paths/:id` | D path navigation/screenshot | Published synthetic memberships only | VS-05A/05B publication and 01B reads |
| Course detail | VS-01A / 01B | IMPLEMENTED_AND_TESTED | G `/courses/:courseId`; A `/api/v1/courses/:id` | D course navigation/screenshot | Outline and read links do not enroll | VS-01B + 02B |
| Free Lesson Reader | VS-01A / 01B | IMPLEMENTED_AND_TESTED | G `/courses/:courseId/lessons/:lessonId`; A corresponding GET | D rich text, code, next/back, nested refresh, media | Three synthetic free Lessons total; flagship has two; no complete production curriculum | VS-01B authored flagship content and validation |
| Full MVP Block set | VS-01A / 05B / 03A | PARTIAL | G five renderers: richText, code, callout, flashcard, media | D + U safe rendering; T media allowlist | No knowledge checks, prompt practice, step-by-step, template diagrams/timelines, authoring or official tracking | VS-05B full author/validate/preview/render contracts; 03A evidence |
| Local flashcards | VS-01A | IMPLEMENTED_AND_TESTED | G React reveal/hide state; explicitly ungraded | D keyboard reveal and reset after refresh; U | Memory only; no grade, saved answer or official proof | Keep Guest boundary; VS-03A separately for authorized evidence |
| Mobile navigation | VS-01A | IMPLEMENTED_AND_TESTED | G responsive Shell dialog/menu, reader outline/navigation | D mobile/Escape/focus/320px overflow; U | Tested Chromium viewports, not every device/browser | Broader device/manual review before release |
| Accessibility | VS-01A and cross-slice | PARTIAL | G semantic regions, skip link, focus, contrast/motion styles | D four pages × two viewports axe: no violations; keyboard checks; U | Automated samples do not establish WCAG 2.2 AA compliance; no full assistive-technology/user audit | Manual screen-reader, zoom, content and release evidence |
| Empty/error/loading recovery | VS-01A | IMPLEMENTED_AND_TESTED | G catalog reset and generic errors; A safe Problem responses | D no-match/hidden-content recovery; U; T; prior pagination remediation | No error-free/offline guarantee; runtime upstream outages show safe failure | Preserve regressions; production observability/recovery later |
| Saved Guest position/draft/settings recovery | VS-03A related; R Guest recovery | NOT_IMPLEMENTED | N; Shell history scroll and transient flashcard are not saved recovery | NOT RUN; source inspection | No durable recovery or explicit safe-merge flow | Specify authorized Guest recovery within later workspace scope |
| Complete production Guest experience/content | VS-01B | PARTIAL | G/A working demonstration of the read journey | D confirms demo only | No real publishing/database or complete flagship content | VS-05A/05B, 06A, verified flagship and 01B |

The callout is visible static explanatory text; it has no expand/open control. Code is displayed literally and cannot execute. Media is the allowlisted synthetic SVG, not an upload service or video player. The unsupported-Block fallback is a safe unavailable message, not successful interaction. Decorative illustrations/sidebar notes are marked decorative; Lesson position, content counts and outline links are informational/navigation, not learner progress or completion. There are no fake login, enrollment, grading or Admin success flows.

## Identity and roles

| Capability | VS ID | Classification | Implementation evidence | Test evidence | Main limitation | Next required work |
|---|---|---|---|---|---|---|
| Registration | VS-02A | NOT_IMPLEMENTED | N; no registration route or Supabase client | NOT RUN | No real accounts | Verified Supabase identity + internal Account mapping |
| Login / logout | VS-02A | NOT_IMPLEMENTED | N; `/login` is generic unavailable UI | NOT RUN | No credentials or login UI | Implement authorized identity flows and negative tests |
| Session handling | VS-02A | NOT_IMPLEMENTED | N; public fetch uses credentials omit | NOT RUN | No tokens, refresh, revocation or authenticated session | Server-verified identity/session and safe expiry |
| Student Account | VS-02A | NOT_IMPLEMENTED | N; no Account model/store/API | NOT RUN | Browsing creates no Student | Account/access-state schema and ownership checks |
| Admin role | VS-02A | NOT_IMPLEMENTED | N; no Admin authz routes | NOT RUN | No privileged UI/API | Go role enforcement, denial/audit evidence |
| Trusted Admin bootstrap | VS-02A | NOT_IMPLEMENTED | N; no nonpublic bootstrap operation | NOT RUN | No synthetic Admin or role override supplied | Implement trusted, nonpublic, audited bootstrap |
| Account deletion access restrictions | VS-02A / 06A | NOT_IMPLEMENTED | N; no lifecycle/access guard | NOT RUN | No deletion workflow or restored-data suppression | 02A restriction + 06A durable lifecycle before real users |

## Student learning

| Capability | VS ID | Classification | Implementation evidence | Test evidence | Main limitation | Next required work |
|---|---|---|---|---|---|---|
| Path join | VS-02B | NOT_IMPLEMENTED | N; Path links are public navigation | NOT RUN | Joining cannot happen | Independent authenticated intent and membership store |
| Course enrollment | VS-02B | NOT_IMPLEMENTED | N; read links perform GET only | D proves Guest reads; enrollment NOT RUN | Opening a Course creates no enrollment | Explicit enroll, Go owner checks, transaction |
| Pinned curriculum | VS-02B | NOT_IMPLEMENTED | A snapshotId is fixture publication, not Student pin | NOT RUN | No enrollment version ownership | Latest-eligible published pin and preservation |
| Official progress | VS-03A | NOT_IMPLEMENTED | N; no Student progress endpoint/store | D official-write endpoint unavailable; product NOT RUN | Reader counters are not progress | Version-aware Go-owned progress/evidence |
| Learning activity | VS-01A / 03A | PARTIAL | G local flashcard only; no server evidence API | D local interaction; official activity NOT RUN | No durable participation or verified passing | VS-03A evidence tiers, ownership and requiredness |
| Notes / bookmarks | VS-03A | NOT_IMPLEMENTED | N; no workspace routes or write API | NOT RUN | No save controls/storage | Own-object APIs, persistence and UI |
| Workspace / preferences | VS-03A | NOT_IMPLEMENTED | N; no Student dashboard/settings route | NOT RUN | No persisted reading preferences/resume | Authenticated workspace and safe recovery |
| Learning history | VS-03A / 04B | NOT_IMPLEMENTED | N; browser navigation history is not learning history | NOT RUN | No durable learner records | Owned progress/evidence/completion views |

## Assessment and completion

| Capability | VS ID | Classification | Implementation evidence | Test evidence | Main limitation | Next required work |
|---|---|---|---|---|---|---|
| Graded quiz | VS-05B / 04A | NOT_IMPLEMENTED | N; flashcard is ungraded, private fixture assessment is not a quiz API | NOT RUN | No official questions/submission | Published versioned policies and Student assessment |
| Attempt lifecycle | VS-04A | NOT_IMPLEMENTED | N; no Attempt/Result model, schema or commands | NOT RUN | No active-attempt lock/resume/expiry | Atomic version lock, server-time expiry, idempotency |
| Automatic grading | VS-04A | NOT_IMPLEMENTED | N; no grading service | NOT RUN | No score or immutable result | Go single/multi-select grading; answer secrecy |
| Retry policy | VS-04A | NOT_IMPLEMENTED | N; no retry accounting | NOT RUN | No enforcement | Approved terminal-event accounting; exclude unresolved abandonment |
| Completion proof | VS-04B | NOT_IMPLEMENTED | N; no completion command | D unavailable official endpoints; product NOT RUN | Local state cannot create proof | Explicit completion against authoritative evidence |
| Course achievement | VS-04B | NOT_IMPLEMENTED | N; no canonical completion record | NOT RUN | No earned learner achievement | Reusable version-aware Course proof |
| Path completion | VS-04B | NOT_IMPLEMENTED | N; no derived Path progress service | NOT RUN | Counts describe content only | Derive from authorized canonical Course proofs |

## Admin content lifecycle

| Capability | VS ID | Classification | Implementation evidence | Test evidence | Main limitation | Next required work |
|---|---|---|---|---|---|---|
| Admin dashboard | VS-05A | NOT_IMPLEMENTED | N; no Admin layout/routes | NOT RUN | No authenticated management surface | 02A bootstrap/roles then scoped Admin UI |
| Authoring | VS-05A / 05B | NOT_IMPLEMENTED | N; fixture JSON is repository-owned test input | NOT RUN | No hybrid editor or draft persistence | Versioned draft editor/schema/validation |
| Admin preview | VS-05A / 05B | NOT_IMPLEMENTED | N; Guest demo is not privileged draft preview | NOT RUN | Drafts intentionally hidden from public API | Authorized unpublished-version preview |
| Publish / unpublish | VS-05A / 06B | NOT_IMPLEMENTED | N; fixture published marker is static | T/D visibility filtering only; Admin workflow NOT RUN | No publication command/transaction | Validated atomic publish, then normal archive/unpublish |
| Version management | VS-05A / 05B | NOT_IMPLEMENTED | A immutable fixture pub-v1/draft-v2 only | T fixture visibility; authoring NOT RUN | No durable revisions, retention or Student pins | Content version ownership and preservation |
| Audit trail | VS-05A / 06A / 06B | NOT_IMPLEMENTED | N; request correlation logs are not durable business audit | NOT RUN | No actor/action ledger or retention | Minimized authorized audit and lifecycle integration |

## Persistence and operations

| Capability | VS ID | Classification | Implementation evidence | Test evidence | Main limitation | Next required work |
|---|---|---|---|---|---|---|
| PostgreSQL | VS-02A / 05A onward | NOT_IMPLEMENTED | N; A in-memory read-only adapter | NOT RUN | No database, schema or durable records | Reviewed owner/schema migrations and integration tests |
| Supabase integration | VS-02A / 06A | NOT_IMPLEMENTED | N; no SDK/token verification/service connection | NOT RUN | No Auth/DB/Storage service used | Separate synthetic identity foundation, privacy safeguards |
| Storage | VS-05A / 05B / 06A | PARTIAL | A one embedded public SVG asset allowlist | D media 200, manifest 404, unexpected query 400; T | No managed upload/private object/cleanup infrastructure | Secured Storage ownership, publish visibility and deletion |
| Database migration | VS-02A onward | NOT_IMPLEMENTED | N; no SQL migrations or runner | NOT RUN | Fixture versions are not schema migrations | Expand/transition/contract and rollback compatibility review |
| Deletion / cleanup | VS-06A | NOT_IMPLEMENTED | N; no cases, ledger or worker | NOT RUN | No real Student data permitted | Durable idempotent cleanup across Auth/DB/Storage |
| Restore safety | VS-06A / 06B | NOT_IMPLEMENTED | N; no backups, suppression replay or drills | NOT RUN | Compose down/restart is not backup/restore | Isolated restore suppression, reconciliation and evidence |
| Local Docker preview | VS-01A support | IMPLEMENTED_AND_TESTED | [Compose](../../compose.local.yaml), two multi-stage images; [guide](../local-preview/README.md) | Build/start/health/D/security/guard/lifecycle checks | OrbStack linux/arm64 tested; Docker Desktop and amd64 unverified | PO inspect locally; repeat on Docker Desktop |
| Production deployment | VS-01B / 06A / 06B | NOT_IMPLEMENTED | N; Dockerfiles explicitly LOCAL ONLY | T rejects fixture artifact in staging/prod | No production artifact/host/release approval | Published persistence, managed environments, release gates |
| Monitoring / alerting | VS-01A / 06A / 06B | PARTIAL | A structured request ID/status/timing logs, liveness, graceful shutdown; Compose probes | T + running-stack health/log checks | No durable dashboards, alert rules, recovery monitoring or SLA proof | 06A baseline telemetry and 06B alerts/drills |
| CI | Cross-slice | IMPLEMENTED_AND_TESTED | Existing [.github workflow](../../.github/workflows/ci.yml), local equivalent scope exercised | U/T; hosted CI for this working tree **NOT RUN** | New Compose suite not in hosted CI | Separate follow-up: Compose config/build/smoke CI job |

## Policy-blocked and excluded capabilities

| Capability | VS ID | Classification | Evidence | Test evidence | Main limitation | Next required work |
|---|---|---|---|---|---|---|
| Path leave / curriculum migration | VS-02C | BLOCKED_BY_DECISION | R; GAP-002 Open | NOT RUN | Policy and implementation absent | PO GAP-002 disposition and contract update |
| Explicit Attempt abandonment trigger | VS-04C | BLOCKED_BY_DECISION | R; GAP-003 Open | NOT RUN | Do not invent retry-affecting trigger | PO GAP-003 disposition |
| Exceptional revocation / archived public listing detail | VS-06C | BLOCKED_BY_DECISION | R; GAP-001 Open | NOT RUN | Normal archive does not resolve exceptions | PO GAP-001 disposition |
| Manual Course migration / evidence compatibility | VS-06D | BLOCKED_BY_DECISION | R; GAP-003 Open | NOT RUN | No silent migration or guessed eligibility | PO GAP-003 disposition |
| Exact prerequisite-protected action matrix | VS-03B | BLOCKED_BY_DECISION | R; GAP-007 Open | NOT RUN | Core assessment excludes unresolved action policy | PO GAP-007 disposition |
| Certificates, billing/premium/paywalls | No committed VS | OUT_OF_SCOPE | R scope §3 | NOT RUN | Deferred, not missing committed increments | Separate scope authorization if desired |
| Recommendations, AI tutor / prompt grading, code sandbox | No committed VS | OUT_OF_SCOPE | R scope §§2–3 | NOT RUN | Rule-based recommendations deferred; AI-driven recommendations not committed MVP scope | No implementation inferred |
| Advanced gamification/analytics/notifications/exam controls | No committed VS | OUT_OF_SCOPE | R scope §3 | NOT RUN | Basic workspace and structured single/multi assessment remain MVP | Separate post-MVP planning |

## Roadmap progress and sequence

The roadmap contains **16 increments: 1 technically implemented, 0 formally accepted, 10 remaining core increments and 5 policy-blocked increments**. Thus 15 increments remain technically unimplemented, including the 5 blocked. The Docker support work is not a seventeenth increment. Increment coverage is **1/16 = 6.25%**; this is not an effort-weighted product completion estimate. The denominator includes blocked increments. Feature-table row counts are not another progress denominator.

| Increment | Current technical state | Main prerequisite / remaining outcome |
|---|---|---|
| VS-01A | Technically implemented; formal closure pending | Synthetic Guest foundation verified; DD-001 sign-off still required |
| VS-02A | Unimplemented core | 01A formal closure, independent DR-001 and explicit authorization; verified identity/internal Account/roles/bootstrap/access restrictions |
| VS-05A | Unimplemented core | 02A; minimal audited draft/validate/preview/publish |
| VS-06A | Unimplemented core | 02A; durable privacy/cleanup/restore safeguards before real Student/Admin data or production publishing |
| VS-02B | Unimplemented core | 02A + 05A; 06A before real data; independent join/enroll and pins |
| VS-05B | Unimplemented core | 05A; full MVP Blocks/assessment policy authoring; may parallel 02B |
| VS-01B | Unimplemented core | 05B + 06A + verified published flagship; production-compatible public reads |
| VS-03A | Unimplemented core | 02B + 05B + 01B; authoritative activity/progress/workspace |
| VS-04A | Unimplemented core | 03A + 05B; atomic versioned Attempts and immutable grading |
| VS-04B | Unimplemented core | 04A + 03A; explicit trustworthy completion and canonical proof |
| VS-06B | Unimplemented core | 05A + 02B + 06A; normal archive, alerts, rollback and isolated restore drills; may parallel assessment work |
| VS-02C | Blocked, unimplemented | 02B + GAP-002 decision |
| VS-04C | Blocked, unimplemented | 04A + GAP-003 decision |
| VS-06C | Blocked, unimplemented | 06B + GAP-001 decision |
| VS-06D | Blocked, unimplemented | 04B + 06B + GAP-003 decision |
| VS-03B | Blocked, unimplemented | 04B + 05B + GAP-007 decision |

Recommended dependency order: **VS-02A → VS-05A and VS-06A → VS-02B and VS-05B → VS-01B → VS-03A → VS-04A → VS-04B**. VS-06B follows 05A/02B/06A and can progress alongside assessment. These are dependencies, not staffing dates or authorization.

For authenticated learning, the minimum additions are verified identity/Account/ownership (02A), versioned published content (05A/05B), privacy safeguards (06A), explicit participation/enrollment/pins (02B), public content delivery (01B) and learning evidence/workspace (03A). For trustworthy assessment/completion, add published assessment policies (05B), server evidence (03A), atomic Attempts/Go grading (04A), explicit proof (04B), and resolve any GAP-dependent behavior included in release scope. For production-compatible Guest content, add trusted Admin identity (02A), controlled authoring/publication (05A/05B), privacy/operations prerequisite (06A), verified complete flagship content and 01B. A usable production MVP also requires 06B and the DP-05 release evidence/approval; none is supplied by the local demo.

The next recommendation is **VS-02A readiness preparation**, followed by implementation only after predecessor formal closure, independent DR-001 verification and explicit PO slice authorization. [VS01A-CLOSE-001 / DD-001](../DP-06/07-vs-01a-formal-closure-and-acceptance.md) remains **PENDING SIGN-OFF**. [GOV-AI-001](../DP-01/05-gov-ai-001-ai-assisted-technical-acceptance-proposal.md) remains **PROPOSED / NOT EFFECTIVE; AUTHORITY CLARIFICATION REQUIRED**. AG-01 is approved for its baseline and AG-02–AG-06 conditionally approved for their recorded snapshots; those approvals do not authorize the next slice. No formal acceptance, adoption, beta approval, production deployment or GAP closure is asserted here.
