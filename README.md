# AI Learning Platform

This repository implements the bounded **VS-01A disposable Guest proof**: the original React Guest UI reads API-001–005 from Go when the development-only fixture is explicitly enabled. Standard builds contain no fixture implementation/data and return safe unavailable responses for content. Authentication, official learning state, Admin publishing, production content, and PostgreSQL persistence remain outside this slice.

## Local prerequisites

- Go 1.27.3 (the supported patch release selected for bootstrap CI)
- Node.js 22.23.4 or another version satisfying `apps/web/package.json`
- npm 10 or newer

No Supabase project, PostgreSQL server, production credentials, or Student data is needed for this slice.

## Run locally

From `apps/api`, run `go run ./cmd/api`. The API listens on `127.0.0.1:8080` by default. Set `HTTP_LISTEN_ADDR` to another valid host and port when needed; see `apps/api/.env.example`. The process reads environment variables directly and does not auto-load `.env` files. `GET http://127.0.0.1:8080/healthz` is a liveness check only, not proof of database or provider readiness.

To serve the disposable public content and its approved media, run `APP_ENV=local FIXTURE_MODE=vs01a go run -tags devfixture ./cmd/api` from `apps/api`. The standard command above intentionally has no synthetic content fallback.

From `apps/web`, run `npm ci` then `npm run dev`. Open `http://127.0.0.1:5173/catalog`. API/media reads default to the page origin; Vite proxies `/api/v1` and `/assets/fixture` to `http://127.0.0.1:8080` without rewriting queries. Set the server-only shell variable `API_PROXY_TARGET` to another HTTP loopback origin if needed. `VITE_API_BASE_URL` remains an optional absolute HTTP(S) override; never put credentials or private URLs in `VITE_` values. Production hosting must route same-origin API requests to an independently configured Go service; the development proxy is not a production content source.

## Checks

- Backend, from `apps/api`: `gofmt -l .`, `go vet ./...`, `go test ./...`, `go test -race ./...`, `go build ./...`
- Repeat vet, test, race, and build with `-tags devfixture` for development API/fixture coverage.
- Frontend, from `apps/web`: `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`
- Mocked browser contracts: `npm run test:e2e:mock`. Real Go + React: `npm run test:e2e:real` (requires Go 1.27.3, or `GO_BIN` set to that executable). Install the pinned Playwright browser with `npx playwright install chromium` when no suitable local browser exists.
- Repository root: `bash scripts/check-secrets.sh`, `git diff --check`

GitHub Actions is configured for standard/tagged/race/backend boundary checks, React checks, separately named mocked/real browser tests, and the secret guard, without deployment. Hosted CI success is not inferred from local execution. The secret check is a baseline guard for obvious tracked keys; it is not a substitute for review or a full secret scanner.

## Disposable VS-01A fixture

The synthetic manifest is `apps/api/internal/devfixture/manifest.json`. It implements `VS01A-FX-001` with identity `vs01a-guest-proof@1.0.0`, version `1.0.0`, published snapshot `pub-v1`, and private draft `draft-v2`. Its Go-owned loader validates references, order, version/publication state, free flagship Lessons, supported Blocks and the embedded public media asset. API-001–005 use its fresh allowlisted public projections through `internal/publiclearning`. Shared public DTO types are independent of the tagged fixture package; private records and media bytes remain inside that excluded package.

Fixture mode is **off by default**. For a local process that validates the fixture at startup, run `APP_ENV=local FIXTURE_MODE=vs01a go run -tags devfixture ./cmd/api` from `apps/api`. `APP_ENV=test` is also allowed for isolated tests. Standard builds reject fixture mode; development-tagged builds reject staging and production even with fixture mode disabled. Production/staging builds must omit the `devfixture` tag. The build check `bash scripts/check-fixture-boundary.sh` verifies the package and private synthetic marker are absent from the standard binary and tests both startup guards. The fixture requires no PostgreSQL, Supabase, real credentials or seed writes.

Run `go test -tags devfixture ./...` and `go test -race -tags devfixture ./...` from `apps/api` to validate the manifest, projections, HTTP contracts, negative cases, and isolation. Each test constructs a fresh snapshot/service. Service construction generates a random 32-byte HMAC-SHA-256 cursor key; reset/restart invalidates old cursors. Cursors bind endpoint, normalized filters, limit, snapshot, and last title/ID; valid repeated GETs remain replayable. No cursor key or private record is exposed.

See the [real integration report](docs/vs01a-integration/2026-10-31-real-api-integration.md) for executed API/browser evidence, VS01A-N01–N17 coverage by layer, and remaining review/hosted-CI boundaries. The technical admission limit is 32 concurrent public reads per handler instance; excess work receives safe 429 responses. This is bounded process backpressure, not a per-user quota or production SLA.

## Deferred boundaries

DP-03 and DP-06 define Go-owned business rules and future PostgreSQL-backed authoritative state. The internal development fixture is not an Admin publication mechanism and contains no official learning state. This bundle creates no schema, migration, publication route or managed Supabase integration. Future PostgreSQL behavior and recovery remain unverified.

The current task separately authorized VS-01A implementation. AG-06 remains a conditionally approved planning baseline; earlier “Not Approved” metadata is historical. Open GAPs, independent review, hosted CI, PR/merge, deployment, and beta release decisions remain separate. No production publishing or storage policy is inferred from the disposable proof.
