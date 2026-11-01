# Bounded VS-02A operator checkpoint

This separate Go module is an **operator verification artifact**, not application authentication. Nothing under `apps/` imports it. It has no HTTP listener, Account/role store, middleware, JWKS cache or deploy integration. The pinned `github.com/golang-jwt/jwt/v5 v5.3.1` dependency is confined to this module; application dependencies are unchanged.

The CLI receives `{token, jwks}` through a private process pipe, never through command arguments or a token file. It validates ES256/P-256 signatures with the maintained library, exact out-of-band issuer/audience, required user/session UUIDs, user context and time policy. It emits only hashes, nonsecret times/lifetime, algorithm/audience and verdicts. Cryptography is not handwritten. Local tests generate ephemeral private keys in memory and send no invalid credentials to provider services.

The trusted live wrapper is [vs02a_checkpoint_operator.py](../vs02a_checkpoint_operator.py). It derives the target from authenticated scoped MCP and checks the previously approved issuer hash; its HTTPS requests reject redirects/proxies and verify certificates. Public JWKS comes only from the fixed issuer's well-known endpoint. The Go CLI alone cannot prove the origin of arbitrary supplied JWKS bytes; the wrapper's fixed fetch is part of the live proof.

## Operator authorization

Read [the exact R1 approval](../../docs/vs02a-readiness/15-synthetic-roster-and-token-checkpoint-approval-2026-11-01.md). `prepare`, `provision` and `verify` fail closed unless the machine-readable record explicitly approves the exact target/roster/actions and names a reset/delete owner. A record file is a procedural guard, not a cryptographic human signature or application authority. O05/security review and Auth Bundle 1 authorization remain separate.

From the repository root:

```sh
# Read-only settings/count proof; retrieves only a public project key in memory.
PYTHONDONTWRITEBYTECODE=1 python3 scripts/vs02a_checkpoint_operator.py preflight

# After explicit R1 approval: creates a task-private credential ledger outside Git.
PYTHONDONTWRITEBYTECODE=1 python3 scripts/vs02a_checkpoint_operator.py prepare
```

`prepare` reports a path, not passwords. Keep that actual path in local operations only. It is private (`0600`, parent `0700`) and bound to exact A/B/C fixture addresses. Do not inspect it through chat, copy it into the repository or capture its contents in evidence. The examples below use **placeholder paths**; do not create a second ledger for an already provisioned roster.

```sh
# Run in the operator's real terminal, after approval and fresh empty-project checks.
# Enter the current unexposed project secret at the hidden getpass prompt.
# No secret value in commands, browser code, evidence or chat.
PYTHONDONTWRITEBYTECODE=1 python3 scripts/vs02a_checkpoint_operator.py provision \
  --credentials /outside-git/task-private/credentials.json

# Compile to a temporary location outside the source tree.
cd scripts/vs02a-jwt-checkpoint
go build -o /tmp/vs02a-jwt-proof .
cd ../..

# Actual provider-issued tokens remain in memory, including between proof and logout.
PYTHONDONTWRITEBYTECODE=1 python3 scripts/vs02a_checkpoint_operator.py verify \
  --credentials /outside-git/task-private/credentials.json \
  --verifier /tmp/vs02a-jwt-proof
```

Only the operator enters the current unexposed project secret. No secret is obtained from SQL, an OAuth token store or an unlisted MCP tool. Modern secret keys go in the `apikey` header, not Bearer; user access JWTs are Bearer credentials only for their own local logout. There is no legacy Admin-key fallback. A missing Admin capability, rejected reserved address, partial creation or timeout stops execution for reconciliation, never a blind second user create or an invented success. Do not create/rotate a project key under the roster approval.

## Private operator env (optional)

The operator requested reusable local env storage after the live checkpoint. The secret subsequently pasted into chat is treated as exposed; **do not save or reuse that value**. The operator must revoke it and create a replacement in Dashboard → Settings → API Keys. R1 does not authorize key creation/revocation by this client. No API-key mutation is implemented.

```sh
# Local file setup only; no Supabase writes. Default parent 0700, file 0600.
python3 scripts/vs02a_checkpoint_operator.py init-env
# After revoking the disclosed key: run in your own terminal and enter the replacement.
python3 scripts/vs02a_checkpoint_operator.py configure-env
```

The default file is `~/.config/vs02a-operator/.env`, outside Git and all application folders. It contains only `VS02A_SUPABASE_SECRET_KEY=` followed by the value entered at the hidden prompt. The initial file is empty. Storage is permission-restricted plaintext, **not encrypted storage**; the operator controls local device/backups and future removal. No token or fixture password belongs in this env file. The helper never prints or exports the value, never loads a process-wide env implicitly, never runs shell expansion and refuses unknown variables, quoting, links, loose permissions and overwriting an existing nonempty key. Do not `source` or copy it into an app env. `--admin-env-file /absolute/private/path/.env` explicitly selects a different file.

Only an independently authorized future provisioning operation may select it with `provision --admin-env-file "$HOME/.config/vs02a-operator/.env" --credentials /outside-git/task-private/credentials.json`. **Do not run provisioning again for R1**: its three users already exist and its credential ledger was removed. Approval, fixed-project and empty-project guards still apply before reading the secret. Read-only preflight and JWT verification never load this env. Configuring storage does not authorize any additional provider operation or approve O05.

The creation phase uses supported `POST /auth/v1/admin/users`, only the three reserved addresses, per-user confirmation and fixture-only metadata. It does not enable signup, send mail, write managed Auth tables with SQL, create an application Account or grant Admin. A local nonblocking ledger lock prevents overlapping operator processes. Each in-flight creation is recorded privately before the request so an uncertain result cannot be blindly retried.

The verification phase reads the approved credential ledger, performs one password sign-in per user (maximum two across retries), verifies the exact provider UUID against the signed subject, observes the matching `auth.sessions` row through a scoped read, logs out **only that task session** with `scope=local`, checks removal and re-verifies the same still-unexpired JWT offline. The refresh token is discarded without being stored or exchanged. No application `/me` or authorization behavior is exercised. On failure, partial redacted outcomes and cleanup uncertainty remain visible; unused users are NOT RUN.

Only after all three proofs/local logouts succeed is the task-created local credential ledger removed. Provider fixture users remain; deletion/reset belongs to the named operator and needs a separate resource-specific instruction. Retained evidence must be reviewed for secrets before committing; never collect raw request/response traces or HTTP debug logs.

## Checkpoint policy and limits

- ES256 only, EC/P-256 public keys, known kid, no token-selected URL/key, strict bounded compact/base64/JSON parsing and no duplicate JSON members.
- One exact configured hosted issuer and singleton `authenticated` audience. Require canonical subject/session UUIDs, `role=authenticated`, nonanonymous user context, integral `iat`/`exp`, optional valid `nbf`, maximum issued lifetime 3600 seconds and 30-second leeway. These are **checkpoint expectations**, not an approved production O04 profile.
- A mismatch is FAIL/BLOCKED; do not derive a permissive expected audience from the token or raise the lifetime ceiling silently.
- Offline replay immediately after local logout measures the distinction between provider session removal and offline JWT verification. It does not prove application replay rejection/acceptance, provider ban/delete semantics, a full real-time expiry wait, role/state guards, rotation, outage/cache behavior or all VSA-T01–T33.
- Local injected-clock tests cover expiry/skew equality. A predicted replay ceiling from verified `exp` is not an observed hour-long replay test.

Run credential-free checks:

```sh
cd scripts/vs02a-jwt-checkpoint
go vet ./...
go test -count=1 -race -v ./...
cd ../..
PYTHONDONTWRITEBYTECODE=1 python3 scripts/test_vs02a_checkpoint_operator.py
```

CI runs only these offline checks and the existing public-probe tests. It has no provider secrets and does not create users or obtain live tokens. Live evidence is separate, timestamped and bound to the exact operator artifact hashes/source revision.
