# VS-01A original frontend — implementation and verification

31 October 2026 · `sipratama/ai-learning-platform` · frontend scope only.

## A. Branch and baseline

- Working branch: `feat/vs-01a-original-guest-ui`.
- Parent baseline: `main`, `9b29797c238f077286e8e9b9042ce4bd6dec25e5` (merged bootstrap and disposable fixture preparation).
- The Product Owner's follow-up, “buat dari branch main”, delegated branch creation from that baseline after the preflight findings. No staging, commit, push, PR, merge, tag, or deployment was performed.
- Initial tree contained only the previous untracked discovery report. It was preserved. No unfinished VS-01A implementation was overwritten or discarded.
- This baseline had no Guest UI or public API-001–005 implementation. The authorized frontend was built against the existing read contracts, rather than changing Go to accommodate the UI.

## B. Design specification used

Primary design authority: [AI Learning — Playful Neo-Brutalist Learning Experience](../design-discovery/2026-10-31-ailene-inspired-vs01a.md), especially sections D–J. Product behavior follows the public VS-01A addendum in [DP-04](../DP-04/01-api-contract-and-resource-design.md), the [DP-02 UX contract](../DP-02/04-ux-and-interaction-specification.md), and the bounded [DP-06 fixture contract](../DP-06/03-vertical-slice-backlog-and-acceptance-contracts.md).

Identity: learning notes and geometric index markers, Forest outlines, warm canvas, Lime actions, Sky information, Peach local practice, Public Sans, and hard shadows. The catalog is more expressive; the Reader uses a restrained white article surface and an 18px reading style. Mobile changes composition, including a compact three-part note and single-column cards.

The original user-supplied Ailene screenshot remains unavailable. Implementation uses the approved original specification; it is not a pixel match or a reproduction of Ailene branding.

## C. Files changed

All application changes are under `apps/web`. Go, fixture data, backend contracts, repository scripts, and CI workflow files are unchanged.

| Area | Files |
|---|---|
| Entry/routing | [App.tsx](../../apps/web/src/app/App.tsx), [index.html](../../apps/web/index.html) |
| Tokens and shared styling | [index.css](../../apps/web/src/styles/index.css) |
| Reusable components | [ui.tsx](../../apps/web/src/components/ui.tsx), [Shell.tsx](../../apps/web/src/components/Shell.tsx), [ContentCards.tsx](../../apps/web/src/components/ContentCards.tsx), [Blocks.tsx](../../apps/web/src/components/Blocks.tsx) |
| Screens | [Catalog.tsx](../../apps/web/src/screens/Catalog.tsx), [Details.tsx](../../apps/web/src/screens/Details.tsx), [Reader.tsx](../../apps/web/src/screens/Reader.tsx) |
| Public read boundary | [public.ts](../../apps/web/src/lib/api/public.ts), [useResource.ts](../../apps/web/src/lib/useResource.ts) |
| Component/unit tests | [App.test.tsx](../../apps/web/src/app/App.test.tsx), [Blocks.test.tsx](../../apps/web/src/components/Blocks.test.tsx), [public.test.ts](../../apps/web/src/lib/api/public.test.ts) |
| Browser tests | [guest.spec.ts](../../apps/web/tests/e2e/guest.spec.ts), [public-fixture.ts](../../apps/web/tests/support/public-fixture.ts), [playwright.config.ts](../../apps/web/playwright.config.ts) |
| Frontend configuration | [package.json](../../apps/web/package.json), [package-lock.json](../../apps/web/package-lock.json), [tsconfig.json](../../apps/web/tsconfig.json), [vite.config.ts](../../apps/web/vite.config.ts), [eslint.config.mjs](../../apps/web/eslint.config.mjs), [frontend .gitignore](../../apps/web/.gitignore) |
| Documentation/evidence | [Frontend README](../../apps/web/README.md), this report, and 12 original frontend screenshots in [evidence](evidence/desktop-catalog.png). The earlier discovery report remains preserved and untracked from the previous task. |

The bootstrap-only App assertion was updated for the replacement Guest UI and expanded into journey/error/security checks. Existing API configuration tests are unchanged and continue passing.

## D. Tokens and reusable components

- Canvas `#F7F7F1`, Forest `#17382F`, Lime `#C9F45D`, Peach `#FFB48F`, Sky `#A9DDF2`, white surfaces, secondary `#4A6359`, and error `#9D2925`.
- Shared 4–64px spacing scale; 2px Forest border; 8px controls and 12px cards; 2/4/6px zero-blur offset shadows; 3px focus outline with offset.
- Public Sans variable font is self-hosted through `@fontsource-variable/public-sans@5.3.0`, OFL-1.1. Monospace is reserved for literal code. Typography uses shared heading/body/metadata styles and reading/code variables.
- Primary, secondary, icon, text, disabled, hover, pressed, and pending controls; semantic badges; Path/Course cards; status panels; breadcrumb and type navigation; native dialog and curriculum disclosure.
- Focus and active state remain distinct. Forest text is used on the accent colors; white is not used on Lime/Peach/Sky. Reduced motion removes transitions and pressed transforms.
- No raster images or proprietary Ailene assets are used. SVG icons are locally authored. The small media diagram visible in browser screenshots is a test-only public media response, not a production asset or a modification to the Go fixture.

## E. Screen implementation

| Screen | Implemented frontend behavior |
|---|---|
| Guest Catalog | Editorial hero; Path/Course URL navigation; explicit search; membership filter; public DTO cards; cursor append; loading, empty, retry, invalid-query/cursor recovery; request cancellation. Query changes do not steal focus or scroll to the hero. |
| Path Detail | Title/description; public count; ordered member Course cards with semantic subheadings; canonical Course links; catalog back navigation; loading/empty/error. |
| Course Detail | Overview and public counts; ordered Module disclosures; free Lesson links; first free reading entry point; responsive access panel; loading/empty/error. |
| Free Lesson Reader | Deep links; Course/Module context; version/snapshot/membership consistency checks; outline navigation; safe Markdown, literal code, callout, public media with fallback, Prev/Next; local ungraded disclosure. |
| Local flashcard | Front remains visible; native button toggles authored back via `aria-expanded`/`aria-controls`; focus stays on the button. Reset on reload/new Lesson; no storage or server writes. |

There is no login, enrollment, Student/Admin UI, official progress, streak, certificate, achievement, quiz, grading, or completion feature. Metadata counts indicate available content, never earned progress.

## F. Screenshot evidence and visual review

The following full-page screenshots were captured from the actual rendered React UI using controlled public DTO HTTP responses. Font loading was awaited. Normal-state capture precedes axe inspection so accessibility probes do not contaminate the visual state. Screenshots were directly inspected; they are not generated design comps.

| Screen | Desktop 1440×1000 | Tablet 834×1112 | Mobile 390×844 |
|---|---|---|---|
| Catalog | [Desktop](evidence/desktop-catalog.png) | [Tablet](evidence/tablet-catalog.png) | [Mobile](evidence/mobile-catalog.png) |
| Path Detail | [Desktop](evidence/desktop-path.png) | [Tablet](evidence/tablet-path.png) | [Mobile](evidence/mobile-path.png) |
| Course Detail | [Desktop](evidence/desktop-course.png) | [Tablet](evidence/tablet-course.png) | [Mobile](evidence/mobile-course.png) |
| Reader + expanded flashcard | [Desktop](evidence/desktop-reader.png) | [Tablet](evidence/tablet-reader.png) | [Mobile](evidence/mobile-reader.png) |

Review found and corrected initial focus stealing, excess mobile decorative height, small metadata, and a wrapping tablet search label. Desktop sidebar, tablet dialog navigation, stacked mobile layout, collapsed narrow Reader outline, code scrolling, and expanded flashcard were inspected. Local horizontal scrolling of long code is intentional; document horizontal overflow is not.

Visual acceptance applies to these Chrome renders and controlled public data. Live Go integration, physical-device behavior, Safari/Firefox, and complete WCAG conformance are not established by screenshots.

## G. Accessibility results

Environment: Node `22.23.4`, npm `10.9.9`, Playwright `1.64.1`, Google Chrome `156.0.8078.79`, axe Playwright integration `4.14.0`; locale `id-ID`, timezone `Asia/Jakarta`, reduced-motion preference enabled.

| Check | Actual result / limitation |
|---|---|
| Automated accessibility | Zero violations in 12 normal-state axe scans: four screens × desktop/tablet/mobile, using WCAG 2 A/AA, 2.1 AA, and 2.2 AA tags. This is a subset of WCAG checks. |
| Keyboard | Browser keyboard tests pass: skip link, main focus, visible input focus, native dialog open/trap/Escape/return, and Enter/Space flashcard reveal with retained focus. |
| Semantics | Page headings, landmarks, label associations, active navigation, ordered membership, disclosure names, and flashcard expanded state checked by component/browser tests and axe. |
| Contrast | Original palette pairs retain the discovery calculations: Forest/Canvas 11.89:1, Forest/white 12.78:1, Forest/Lime 10.09:1, Forest/Peach 7.41:1, Forest/Sky 8.71:1; no automated normal-state contrast violations. |
| Reflow / text resize | No document overflow at 320 CSS px; 200% root text enlargement at 320px retains search and flashcard controls. 320px is the layout-equivalent reflow width for a 1280px desktop viewport at 400% zoom. Native browser UI zoom itself was not manipulated. |
| Reduced motion | Preference is exercised across the browser suite; transition duration for the disclosure button is checked as `0s`. No shimmer, autoplay, sound, or 3D card animation exists. |
| Screen readers | Programmatic semantics and announcements are checked; a human VoiceOver/NVDA reading session was not run. Do not claim complete WCAG 2.2 AA certification. |

## H. Functional regression and security boundaries

- Search submit, membership filter, result reset, URL Back/Forward, both free flagship Lessons, Path→Course navigation, and opaque cursor append/reset pass browser tests across all three projects.
- Cursor values are retained and forwarded as opaque strings; the client does not sign, decode, alter, or validate server signatures. The test cursor is explicitly a stub. Cryptographic behavior remains unverified until real backend tests run.
- Local flashcard reveal/hide works with keyboard. Reload collapses it; browser tests observe only GET API requests and no localStorage entries.
- Code resembling a script remains literal. Raw HTML, unsafe Markdown links, Markdown images, unsafe media URLs, unsupported Blocks, and arbitrary server error details do not become active content. Safe Blocks remain readable.
- Wrong Course/Lesson pairing and hidden resource responses produce generic unavailable UI. Server-side hiding/authorization is not proven by route interception.
- Course/Lesson version and snapshot mismatch fails closed instead of combining different generations.
- Public test fixtures are isolated in tests; the production bundle was scanned for representative test/private markers and did not contain them.
- `git diff` confirms no changes under `apps/api`, `.github`, or repository `scripts`. Existing DTOs, Go fixture, signing design, and production/development isolation remain untouched.

Relevant frontend coverage maps to portions of VS01A-N04–N06, N09–N13, N15, and N17. API authorization, signing, request-ID/logging, rate limiting, and artifact-isolation tests remain backend responsibilities; this report does not mark the whole VS01A-N01–N17 matrix passed.

## I. Commands and outcomes

Commands are from `apps/web` unless specified otherwise.

| Command / check | Outcome |
|---|---|
| `npm run typecheck` | PASS, includes frontend source plus Playwright config/tests. |
| `npm run lint` | PASS. Generated Playwright artifacts are ignored, alongside existing build/dependency output; source checks remain enabled. |
| `npm test` | PASS: 22 tests across four files, including unchanged API configuration tests. |
| `npm run build` | PASS: production React bundle and self-hosted fonts built. |
| `npm run test:e2e` | PASS: 24 tests across desktop, tablet, and mobile, including 12 axe scans and 12 screen captures. [Run log](evidence/verification-e2e.txt). |
| Impeccable detector | No findings in its one bounded mechanical scan. Does not replace visual/browser review. |
| `git diff --check` | PASS; no whitespace errors in tracked diffs. |
| `bash scripts/check-secrets.sh` from root | PASS for its existing tracked-file baseline; untracked new files additionally inspected for test/private markers and credential patterns. |
| `npm audit --omit=dev` | Zero reported production dependency vulnerabilities at execution time. |
| Full `npm audit` | 11 moderate development-tool findings; same packages/count as the original baseline. No new production finding. No forced dependency downgrade performed. |
| `go test -race ./...` | NOT RUN successfully: `go: command not found`. |
| `go test -race -tags devfixture ./...` | NOT RUN successfully: `go: command not found`. |
| `bash scripts/check-fixture-boundary.sh` from root | BLOCKED: requires missing Go executable. No backend pass claimed. |

The original baseline did not contain Playwright tests; this change adds the browser suite. It uses controlled HTTP responses, so “PASS” here describes frontend browser verification, not full-stack E2E acceptance or hosted CI.

## J. Outstanding issues and scope limits

1. **Live public API integration is unavailable in this baseline.** API-001–005 and public media must be supplied by a separately authorized backend task using the existing contracts. The frontend displays genuine unavailable/error states until then.
2. **Go verification is blocked by the environment.** Run the existing backend/race/fixture-boundary checks in the supported Go environment before merge review; no Go installation or backend change was made for a frontend task.
3. **Manual screen-reader, Safari/Firefox, native browser zoom, and physical-device checks remain.** Automated semantics/reflow tests and Chrome screenshots do not replace those.
4. **11 pre-existing moderate development dependency advisories remain.** They match the original baseline; production audit is clear at the recorded check. Review separately without breaking the pinned toolchain through a forced fix.
5. **Discovery screenshot gap remains.** The design report's original screenshot reconciliation was never possible; the implementation follows the original proposed identity approved through this task.
6. Hosted CI, field Web Vitals, ≥90% Guest usability studies, full VS-01A completion, and release approval were not performed or inferred. The current worktree is intentionally uncommitted for review.

## K. Recommended Conventional Commit message

```text
feat(web): build original neo-brutalist VS-01A guest experience
```

Suggested description: introduce shared visual primitives and public catalog/detail/reader routes, preserve the five read contracts, and verify local ungraded interactions, safe content rendering, accessibility automation, and responsive layouts. Explicitly note the pending live backend integration.

## L. PR review checklist

- [ ] Confirm Product Owner branch/scope authorization and baseline `9b29797`.
- [ ] Review the original discovery specification and all 12 rendered captures; confirm original AI Learning branding and no copied reference assets.
- [ ] Review tokens, typography, card/button/navigation consistency, mobile composition, Reader measure, and focus states.
- [ ] Reproduce typecheck, lint, 22 unit/component tests, production build, and 24 controlled-response browser tests.
- [ ] Verify live API integration only after API-001–005 exist; do not label the test stubs as a working Go backend.
- [ ] Run Go/race/fixture-boundary checks in the supported environment and review hosted CI separately.
- [ ] Check public DTO/version/cursor boundaries and safe Markdown/code/media behavior; confirm test/private content is absent from the production bundle.
- [ ] Perform remaining screen-reader, cross-browser, native zoom, and physical-device checks before claiming broad WCAG coverage.
- [ ] Confirm no Student/Admin capabilities, fabricated progress, copied Ailene assets, backend/fixture/CI edits, or production mock data.
- [ ] Preserve the pre-existing discovery report; review it for inclusion through the owner's Git workflow.
- [ ] Review existing development-tool advisories separately; no forced toolchain changes hidden in this UI work.
- [ ] Keep merge, deployment, beta approval, and all remaining Git writes under Product Owner control.
