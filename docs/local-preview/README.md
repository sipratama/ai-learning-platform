# Local Docker Guest preview

**LOCAL SYNTHETIC PREVIEW ONLY. Never deploy these fixture-enabled images to staging or production.** This stack serves the current read-only Guest demonstration. It has no real accounts, Student records, official scores/completion, Admin publishing, database, Supabase connection or production content.

## Start and inspect

From the repository root, with Docker Desktop running **Linux containers** and Docker Compose v2 or newer:

```sh
docker compose -f compose.local.yaml up --build -d
docker compose -f compose.local.yaml ps
```

Wait until both services show `healthy`, then open **http://127.0.0.1:8088/catalog**. Builds need internet access for the pinned public images and `npm ci`; running the built demo needs no external service. Host Go/Node installations are unnecessary for the preview. Port 8088 must be free. Use this project's commands from its repository root; do not stop unrelated containers if a port is occupied.

| URL | Actual behavior |
|---|---|
| http://127.0.0.1:8088/ | Redirects within the SPA to catalog |
| http://127.0.0.1:8088/catalog | Paths, Course switch, search, membership filters |
| http://127.0.0.1:8088/catalog?limit=1 | Two-page Path fixture demonstration |
| http://127.0.0.1:8088/paths/path-foundations | Published synthetic Path detail |
| http://127.0.0.1:8088/courses/course-flagship | Synthetic flagship outline |
| http://127.0.0.1:8088/courses/course-flagship/lessons/lesson-flagship-1 | Free reader, rich text, literal code, local flashcard, SVG |
| http://127.0.0.1:8088/courses/course-flagship/lessons/lesson-flagship-2 | Safe Practice reader with static callout |
| http://127.0.0.1:8088/healthz | Proxied Go liveness: HTTP 200 JSON `status: ok` |
| http://127.0.0.1:8088/api/v1/catalog/paths | Actual public Go fixture response |
| http://127.0.0.1:8088/assets/fixture/diagram.svg | Allowlisted synthetic public media |

The same-origin proxy also forwards `/api/v1/catalog/courses`, `/api/v1/paths/:id`, `/api/v1/courses/:id`, and `/api/v1/courses/:id/lessons/:id`. There is no separately published API port. Refreshing a valid nested browser route serves the SPA; unknown browser routes show the application's unavailable page.

```sh
# Follow logs (Ctrl-C stops following, leaving the preview running).
docker compose -f compose.local.yaml logs -f

# Stop and remove this project's containers/network.
docker compose -f compose.local.yaml down

# Rebuild and recreate both services after changes.
docker compose -f compose.local.yaml up --build -d --force-recreate
```

All five requested lifecycle commands were exercised locally, including a bounded follow-logs session. `down` leaves built images/cache available. There are no persistent volumes or learner records to preserve; the web temporary filesystem is discarded. API restart creates a fresh cursor-signing key, invalidating previously issued cursors. If a list says “Daftar perlu dimuat ulang”, choose “Muat ulang daftar” to start a fresh read. Flashcard reveal state resets on page reload and never counts as official learning evidence.

## Architecture and configuration

```text
browser → 127.0.0.1:8088 → web (Nginx :8080)
                            ├─ built React files / SPA fallback
                            └─ /api/*, /assets/fixture*, /healthz → api:8080
                                                                  Go devfixture
```

[compose.local.yaml](../../compose.local.yaml) defines only two services on a project-scoped bridge network. API is built with Go **1.27.3**, `CGO_ENABLED=0` and the existing `devfixture` tag, then copied into Alpine **3.24.2** as UID/GID **10001**. Compose explicitly sets `APP_ENV=local`, `FIXTURE_MODE=vs01a`, `HTTP_LISTEN_ADDR=0.0.0.0:8080`. The standard API artifact and existing fixture startup guards are unchanged. Both staging and production classifications reject the fixture artifact, even with fixture mode disabled.

Web uses Node **22.23.4**, lockfile `npm ci`, TypeScript checking and Vite build, then serves only the resulting static files with Nginx **1.30.6** as UID/GID **101**. Base images are pinned by multi-platform index digest in each Dockerfile; linux/arm64 was built here. Other architectures require their own verification. Runtime images contain neither frontend node_modules nor Go/Node build tools. Nginx's inherited `EXPOSE 80` metadata is not a listener or a published host port; the supplied config listens on 8080 only.

`VITE_API_BASE_URL` is a **build-time public bundle value**, not runtime container configuration. The [web Dockerfile](../../apps/web/Dockerfile.local) forces it to `""` for this build. The existing client resolves blank/missing configuration to `window.location.origin`; all content/media requests therefore go to `http://127.0.0.1:8088`. Setting a runtime environment variable on Nginx cannot reconfigure an already built bundle. The optional source-supported override is an absolute HTTP(S) origin without credentials/query/hash and would require rebuilding; it is unnecessary here. Never put secrets in a `VITE_` variable.

`API_PROXY_TARGET` belongs to the host Vite development server, not this runtime. Its loopback guard remains unchanged. Docker uses Nginx's `api:8080` service discovery; it does not relax that Vite guard. No CORS configuration is needed. `proxy_pass` has no URI suffix, preserving the request path, query string and signed cursor. Explicit API/media locations prevent SPA fallback for missing resources. Go errors remain JSON Problem responses; an unavailable upstream yields a generic Nginx 502/504, never the React index page. Static missing `/assets/*` files return 404.

API health checks perform a real GET `/healthz`. Web probes its static `/` document. Compose waits for API health before starting web. `/healthz` through web checks proxy-to-Go liveness; web health alone does not prove API reachability or production readiness.

## Local security boundary

- Only web publishes `127.0.0.1:8088:8080`; API has no host port mapping. Do not replace loopback with `0.0.0.0`, add tunnels or deploy these images externally.
- Both services run as non-root, drop all Linux capabilities, prohibit privilege escalation and use read-only root filesystems. Web has only a 16 MiB, noexec/nosuid `/tmp` tmpfs for Nginx. No bind mounts, Docker socket, persistent volumes, privileged mode or host networking are used.
- Build contexts are narrow per-app allowlists. Environment/key files, generated reports, node_modules and build output are excluded. The final web stage copies only `dist`; the final API stage copies only the executable. The API executable intentionally embeds synthetic fixture content, including private negative-test records; it is a local-only artifact. Public responses are projection/allowlist filtered.
- The bridge network permits ordinary container egress; this is not an egress sandbox. Runtime browser observation found only same-origin requests, and no external service is configured or required. Builds fetch public dependencies. There are no production credentials or real learner data.
- Engine-level container access can differ. OrbStack supports [direct local container IP access](https://docs.orbstack.dev/docker/network) and [automatic local container domains](https://docs.orbstack.dev/docker/domains), independent of published ports. Compose does not modify these global engine settings or make the daemon a security boundary against its local owner. Use only the documented loopback URL; never configure external routing to this fixture stack.

## Verify independently

```sh
docker compose -f compose.local.yaml config
curl --fail http://127.0.0.1:8088/healthz
curl --fail http://127.0.0.1:8088/api/v1/catalog/paths
curl --fail http://127.0.0.1:8088/api/v1/catalog/courses
curl --fail http://127.0.0.1:8088/assets/fixture/diagram.svg
```

For browser verification, install the pinned frontend dependencies with the repository's Node 22.23.4 environment and start Compose first:

```sh
cd apps/web
npm ci
# If local Google Chrome is unavailable, install Playwright Chromium first:
# npm exec -- playwright install chromium
npm exec -- playwright test --config playwright.local.config.ts
```

The suite selects local Google Chrome when available, otherwise Playwright Chromium. `PLAYWRIGHT_CHROMIUM_EXECUTABLE` can select an installed compatible executable. It starts no mock/API/Vite server and intercepts no requests. Reports are ignored under `apps/web/test-results/` and `apps/web/playwright-report/local-preview/`. These eight tests require the fixed loopback URL; do not run container stop/restart probes concurrently with them. Existing mocked and host real-Go suites retain their separate configurations and contracts.

## Verification record

Assessment completed **2026-11-01 Asia/Jakarta**, from clean preflight baseline `a6ca53b03063a3ed357d4175dec562b7e3a38693`, branch `chore/local-docker-preview-and-feature-inventory`, origin `https://github.com/sipratama/ai-learning-platform.git`. Local main, merge base and remote main matched that baseline. PR #8 pagination/E2E remediation and PR #9 governance proposal were present. No prior Docker setup existed. No Git write was performed.

Execution used the existing **OrbStack** Docker context, Docker CLI/Engine **29.8.2**, Compose **5.5.0**, linux/arm64, and local Chromium through Google Chrome. **Docker Desktop itself was not available as a running context and is NOT VERIFIED.** The files use ordinary Linux Docker/Compose features for the PO's Docker Desktop environment. No daemon switch or global configuration change was made.

| Check | Actual result |
|---|---|
| Compose config; both multi-stage image builds | PASS; pinned images available, npm ci/build successful |
| Start / status / follow logs / down / forced rebuild | PASS; both services healthy after final start |
| Actual public HTTP contracts | PASS; five public GET patterns, pub-v1 snapshot, `/healthz`, media |
| Browser desktop/mobile | PASS: **8/8**, no route interception; 8 page screenshots plus restart-recovery screenshot |
| Search/filter/reset/pagination and deep refresh | PASS; exact signed cursor/query preserved through Nginx |
| Negative visibility/private data | PASS; hidden/draft/mismatched Lessons 404; private markers absent; invalid cursor 400; unknown official write endpoint 404 |
| API/media errors and unavailable upstream | PASS; no SPA index returned; generic 502/504 during actual API stop |
| Restart recovery | PASS; old cursor 400 after actual API restart; UI reload clears error and new pagination succeeds |
| Responsive/keyboard/axe | PASS for sampled pages/viewports, including 320px overflow and menu Escape/focus; zero automated violations, **not full WCAG compliance** |
| Container security / host exposure | PASS inspection: non-root/read-only/cap-drop/no-new-privileges/no privileged or host mode; no API host mapping; web loopback only |
| Host address probe | PASS: 127.0.0.1:8088 connects; host's LAN address 192.168.1.6:8088 refuses. This is a probe from the same Mac, not an independent physical LAN-device test |
| Frontend typecheck / lint / unit / build | PASS; 26 unit/component tests |
| Standard and devfixture Go vet/test | PASS |
| Fixture boundary and Docker startup guards | PASS; standard artifact excludes fixtures; four Docker staging/production × disabled/vs01a runs reject startup |
| Secret guard / diff check / scope review | PASS; no application behavior, lockfile, CI, historical evidence or governance change |
| Dependency audit | Existing baseline: **11 moderate development dependency findings**, 0 high/critical; `npm audit --omit=dev` reports **0** findings. No dependency edits or audit waiver made |
| Hosted CI / Docker Desktop / amd64 | **NOT RUN** for this working tree |

The initial fully isolated `internal: true` network produced healthy containers but no host port forwarding on the active engine. It was replaced with the project-scoped bridge network above; loopback exposure was then verified. The first new desktop catalog test used an ambiguous “Course” locator; scoping it to “Jenis katalog” fixed the test. The outage probe initially expected only 502; the engine can produce a connection timeout/504, so it now checks both safe transport-failure statuses. These observations required no product behavior or fixture-guard changes.

Private local evidence (outside Git):

```text
/Users/farahananda/Documents/project/sipratama/ai-learning-platform-evidence/local-docker-preview-2026-10-31-_bwqefcu/
  logs/          build, lifecycle, HTTP, container inspection, tests, audits, restart
  browser/       initial and final JSON/HTML reports and attachments
  screenshots/   desktop/mobile catalog, Path, Course, reader, restart recovery
  base-images.json
  initial-source-sha256.json
```

The evidence folder retains the preflight date in its name; it was not renamed or used to overwrite historical evidence. Re-run commands on another workstation to create its own evidence. Detailed implemented/planned/blocked capability mapping and the 16-increment dependency sequence are in the [feature inventory](../product-status/2026-11-01-feature-inventory.md).

Remaining limits: Docker Desktop/other architectures and independent LAN-device access need verification; development dependency advisories need a separately scoped triage; complete manual accessibility, production volume/performance, real content, persistence, identity, CMS, assessment, recovery and production release checks are absent. A separate CI follow-up could validate Compose config, build both images, run the loopback suite and always tear down; the existing workflow is intentionally unchanged.

This work is ready for PO code review as local-preview support. VS-01A/DD-001 remains **PENDING SIGN-OFF**; GOV-AI-001 remains **PROPOSED / NOT EFFECTIVE**. No beta/production approval or VS-02A implementation authorization follows from these checks.
