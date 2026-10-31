# AI Learning public frontend

Original Guest UI for VS-01A. The application reads only the five public endpoints in [DP-04](../../docs/DP-04/01-api-contract-and-resource-design.md), without authentication, enrollment, official progress, grades, or completion writes.

## Run

Use the Node/npm versions in `package.json` and the repository README.

```sh
npm ci
npm run dev
```

Vite serves `http://127.0.0.1:5173`. `VITE_API_BASE_URL` defaults to the page origin in development and production. Vite proxies public API and fixture-media reads to `http://127.0.0.1:8080`; `API_PROXY_TARGET` can select another HTTP loopback origin. The existing URL validator rejects credentials, query strings, fragments, and non-HTTP(S) schemes. Never put credentials into a `VITE_` variable.

**Integration:** start the actual Go API from `apps/api` with `APP_ENV=local FIXTURE_MODE=vs01a go run -tags devfixture ./cmd/api`. The five existing read contracts and approved fixture media are now served in that explicit mode. Standard Go builds have no fixture and return safe unavailable content responses. There is no embedded frontend demo dataset, production mock fallback, direct manifest import, or browser database access. Same-origin proxying avoids adding a permissive CORS policy.

## Routes

- `/catalog?type=paths` and `/catalog?type=courses`: public lists. Search submits `q`; membership filters use `courseId` for Paths and `pathId` for Courses. Optional `limit` is bounded to 1–50, with the server default retained when omitted.
- `/paths/:pathId`: ordered member Courses, preserving canonical Course identity.
- `/courses/:courseId`: Modules and free Lesson reading entry points.
- `/courses/:courseId/lessons/:lessonId`: bounded safe content rendering and local flashcard reveal.

Hosting must support an SPA fallback to `index.html` for frontend deep links while keeping API/media routes separate. No deployment configuration is provided by this change.

## Design and accessibility

The [discovery specification](../../docs/design-discovery/2026-10-31-ailene-inspired-vs01a.md) owns the original visual direction. Shared CSS tokens live in `src/styles/index.css`; React primitives live in `src/components`. Public Sans is self-hosted from the pinned Fontsource dependency under OFL-1.1; its license is shipped in that package. Brand typography, SVG icons, and geometric decorations are original to this frontend. No Ailene assets or source were acquired for implementation.

Desktop uses a 232px sidebar; tablet/mobile use a native modal navigation dialog. Reader outline becomes an ordinary disclosure on narrow screens. Focus rings, skip navigation, semantic links/buttons, form labels, live status, and reduced motion are provided. Flashcards are native button disclosures: no 3D flip, persistence, score, or server mutation.

Markdown uses `react-markdown` with raw HTML skipped, an element allowlist, guarded links, and content headings below the page H1. Markdown images are not allowed; media Blocks use only controlled `/assets/fixture/` paths. Code remains literal text. API errors never display arbitrary server titles/details. Public DTO adapters retain only the fields used by the UI; they do not replace Go's visibility or authorization rules.

## Verify

```sh
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm run test:e2e:real
```

Playwright runs Chrome/Chromium at desktop, tablet, and mobile viewports. On macOS it uses the existing Google Chrome executable when present; `PLAYWRIGHT_CHROMIUM_EXECUTABLE` selects another explicit installation. Otherwise install Playwright Chromium with `npx playwright install chromium`. The test server uses loopback only.

The existing `npm run test:e2e` / `npm run test:e2e:mock` suite intercepts reads with test-only DTO doubles from `tests/support/public-fixture.ts`; it remains a fast UI contract suite. These doubles are never imported by application entry points and do not prove server authorization or cryptographic behavior.

`npm run test:e2e:real` uses `playwright.integration.config.ts` and `tests/integration/guest-real.spec.ts`. It builds and starts the actual development Go artifact on `127.0.0.1:18081`, starts Vite on `127.0.0.1:15173`, and makes real public API/media requests through the proxy. There is no interception of the five product endpoints. Both processes are owned and stopped by the runner; the temporary Go binary is removed. Go 1.27.3 is required; set `GO_BIN` to an explicit executable when it is not on PATH. There are no production network/service dependencies during test execution.

Mock screenshots now go to ignored `test-results/mock-evidence` so the earlier design evidence remains historical. Real screenshots and redacted HTTP metadata go to `docs/vs01a-integration/evidence`, with distinct integration report/trace output. Review screenshots directly; an automated axe pass alone does not establish WCAG 2.2 AA. The earlier [UI report](../../docs/frontend/2026-10-31-vs01a-ui-alignment.md) records that phase; the [real integration report](../../docs/vs01a-integration/2026-10-31-real-api-integration.md) records current API/browser results and remaining gates.
