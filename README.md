# AI Learning Platform

This repository currently contains an **engineering bootstrap**, not a working learning platform. The Go process serves only `GET /healthz`; the React page is a development placeholder. Product APIs, Guest Learning, authentication, publishing, persistence, and content fixtures await separate authorization.

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

GitHub Actions runs the same bootstrap checks without credentials or deployment. The secret check is a baseline guard for obvious tracked keys; it is not a substitute for review or a full secret scanner.

## Deferred boundaries

DP-03 and DP-06 define Go-owned business rules and future PostgreSQL-backed authoritative state. VS-01A may later use Go-owned, immutable in-memory development fixtures for a bounded public proof, after its own authorization. This bootstrap creates no such adapter, schema, migration, publication route, or managed Supabase integration. Future PostgreSQL behavior and recovery remain unverified.

AG-06 is conditionally approved as a planning baseline; VS-01A implementation remains pending. Some historical DP-06 metadata still says “Not Approved” and needs a separate administrative synchronization task. Open GAPs remain open.
