# AI Learning public frontend

Original Guest UI for VS-01A. The application reads only the five public endpoints in [DP-04](../../docs/DP-04/01-api-contract-and-resource-design.md), without authentication, enrollment, official progress, grades, or completion writes.

## Run

Use the Node/npm versions in `package.json` and the repository README.

```sh
npm ci
npm run dev
```

Vite serves `http://127.0.0.1:5173`. `VITE_API_BASE_URL` defaults to `http://127.0.0.1:8080` in development and the page origin in a production build. The existing URL validator rejects credentials, query strings, fragments, and non-HTTP(S) schemes. Never put credentials into a `VITE_` variable.

**Integration prerequisite:** the `main` baseline used for this change has only a Go health endpoint and an internal development fixture adapter. It does not serve API-001–005 or public fixture media. This frontend therefore displays a real unavailable/error state when run against that baseline. There is no embedded production demo dataset, mock mode, direct manifest import, or backend replacement. A separately authorized backend implementation must supply the existing public contracts; local cross-origin integration also needs the applicable backend origin configuration. No backend configuration was changed here.

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
```

Playwright runs Chrome/Chromium at desktop, tablet, and mobile viewports. On macOS it uses the existing Google Chrome executable when present; `PLAYWRIGHT_CHROMIUM_EXECUTABLE` selects another explicit installation. Otherwise install Playwright Chromium with `npx playwright install chromium`. The test server uses loopback only.

The browser suite intercepts public HTTP reads with test-only DTO doubles from `tests/support/public-fixture.ts`. These doubles are never imported by application entry points. They cover UI behavior, state recovery, opaque cursor forwarding, safe rendering, accessibility automation, and responsive screenshots. **They do not prove real Go API behavior, cryptographic cursor signing, server visibility, CORS, or production integration.** Baseline tests had no Playwright suite; this change adds it.

`npm run test:e2e` writes the 12 normal screen captures to `docs/frontend/evidence` and puts transient reports/traces under ignored frontend output directories. Review screenshots directly; an automated axe pass alone does not establish WCAG 2.2 AA. See the [implementation/verification report](../../docs/frontend/2026-10-31-vs01a-ui-alignment.md) for actual results and remaining limitations.
