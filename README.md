# AI Learning Platform

This repository contains an **engineering bootstrap and an internal disposable fixture environment**, not a working learning platform. The Go process serves only `GET /healthz`; the React page is a development placeholder. Product APIs, Guest Learning, authentication, publishing and PostgreSQL persistence await separate authorization.

## Local prerequisites

- Go 1.27.3 (the supported patch release selected for bootstrap CI)
- Node.js 22.23.4 or another version satisfying `apps/web/package.json`
- npm 10 or newer

No Supabase project or PostgreSQL server is needed for this bootstrap.

## Run locally

From `apps/api`, run `go run ./cmd/api`. The API listens on `127.0.0.1:8080` by default. Set `HTTP_LISTEN_ADDR` to another valid host and port when needed; see `apps/api/.env.example`. The process reads environment variables directly and does not auto-load `.env` files. `GET http://127.0.0.1:8080/healthz` is a liveness check only, not proof of database or provider readiness.

From `apps/web`, run `npm ci` then `npm run dev`. The page is served on local loopback by Vite. `VITE_API_BASE_URL` accepts an HTTP(S) URL, with a local development default of `http://127.0.0.1:8080`. In a production build, an unset value defaults to the page origin. See `apps/web/.env.example`. Vite exposes `VITE_` values to the browser: never put tokens, passwords, service-role keys, or private URLs in them. The placeholder does not call the API yet.

## Checks

- Backend, from `apps/api`: `gofmt -l .`, `go vet ./...`, `go test ./...`, `go test -race ./...`, `go build ./...`
- Frontend, from `apps/web`: `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`
- Repository root: `bash scripts/check-secrets.sh`, `git diff --check`

GitHub Actions runs the same bootstrap checks plus tagged fixture tests and artifact-boundary verification without credentials or deployment. The secret check is a baseline guard for obvious tracked keys; it is not a substitute for review or a full secret scanner.

## Disposable VS-01A fixture

The synthetic manifest is `apps/api/internal/devfixture/manifest.json`. It implements `VS01A-FX-001` with identity `vs01a-guest-proof@1.0.0`, version `1.0.0`, published snapshot `pub-v1`, and private draft `draft-v2`. Its Go-owned loader validates references, order, version/publication state, free flagship Lessons, supported Blocks and the embedded public media asset. Internal methods return fresh allowlisted public projections. No API-001–005 route or browser content screen serves it yet.

Fixture mode is **off by default**. For a local process that validates the fixture at startup, run `APP_ENV=local FIXTURE_MODE=vs01a go run -tags devfixture ./cmd/api` from `apps/api`. `APP_ENV=test` is also allowed for isolated tests. Standard builds reject fixture mode; development-tagged builds reject staging and production even with fixture mode disabled. Production/staging builds must omit the `devfixture` tag. The build check `bash scripts/check-fixture-boundary.sh` verifies the package and private synthetic marker are absent from the standard binary and tests both startup guards. The fixture requires no PostgreSQL, Supabase, real credentials or seed writes.

Run `go test -tags devfixture ./...` and `go test -race -tags devfixture ./...` from `apps/api` to validate the manifest, projections, negative fixture cases and isolation. Each test should call `devfixture.Load()` for a fresh immutable snapshot; discarding it resets the fixture without shared global state or cleanup writes. Future API tests can construct one snapshot per test, and future browser E2E can use it only through an authorized API layer. Record application revision, fixture identity/version, snapshot ID, environment and expected/actual result when those tests are executed. Cursor signing and reset behavior remain for the future API layer.

The fixture-layer portions of VS01A-N01–N06, N12 and N13 are covered by tagged Go tests. HTTP, filter/cursor, React and browser portions of VS01A-N01–N17 remain pending until those separately authorized features exist. No test here proves the full negative-test matrix or DR-001/QUAL-009 readiness.

## Deferred boundaries

DP-03 and DP-06 define Go-owned business rules and future PostgreSQL-backed authoritative state. The internal development fixture is not an Admin publication mechanism and contains no official learning state. This bundle creates no schema, migration, publication route or managed Supabase integration. Future PostgreSQL behavior and recovery remain unverified.

AG-06 is conditionally approved as a planning baseline; VS-01A product implementation remains pending. The current AG-06 addendum is in DP-01; earlier “Not Approved” metadata is historical. Open GAPs remain open.
