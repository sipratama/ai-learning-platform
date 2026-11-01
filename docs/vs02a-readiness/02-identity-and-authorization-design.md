# VS-02A — Identity and Authorization Design

| Metadata | Value |
|---|---|
| Version / status | v0.1.0 / **PROPOSED; security specialist and PO disposition required** |
| Baseline / date | `4110eb0d37684bae9e39b8639fd0b3fcca7d487d` / 2026-11-01 Asia/Jakarta |
| Owners | MOD-001 Identity & Access; MOD-011 Administration & Audit |
| Scope authority | [Scope and contract map](01-scope-and-dependency-assessment.md#3-smallest-safe-vs-02a-boundary) |

## 1. Provider facts and selected verification profile

Official sources were consulted online on 2026-11-01. Supabase documents asymmetric RSA/EC signing keys as well as legacy/shared-secret signing; asymmetric public keys are discoverable at `https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json`. Its edge discovery cache lasts ten minutes; client caching can add delay. Rotation introduces a new signing key while older keys can remain trusted; revocation and cache observation are separate concerns. [Supabase signing keys](https://supabase.com/docs/guides/auth/signing-keys).

JWKS can contain no keys when asymmetric signing is not configured. For HS256, Supabase recommends validation against the Auth server's `/auth/v1/user`, rather than distributing the signing secret. A publishable API key is not a user access token. These facts do not make a decode-only parser a verifier. [Supabase JWT verification](https://supabase.com/docs/guides/auth/jwts#verifying-a-jwt-from-supabase).

**Proposed profile `VSA-P1`:** a dedicated synthetic Supabase project explicitly configured for **ES256**, P-256 asymmetric signing; Go accepts ES256 only. RS256 is supported by the provider but excluded from this profile until a separately reviewed configuration/test change. HS256, `none`, opaque API keys, imported third-party issuers and arbitrary custom JWTs are rejected; there is no runtime fallback based on the untrusted token's algorithm. Empty/incompatible JWKS blocks identity readiness. If the available project is HS256-only, stop identity integration and either obtain an authorized asymmetric test project or review a distinct Auth-server verification profile. This review does not rotate keys or install a provider.

The precise tenant configuration, approved JWT lifetime, Go JOSE dependency/version and successful token samples remain prerequisites under VSA-O03/O04. Do not claim an actual project matches this profile. Algorithm-specific library support and vulnerability review must precede dependency selection; never handwrite cryptography.

## 2. Trust boundaries and principal

```mermaid
sequenceDiagram
  participant Browser as React browser
  participant Auth as Isolated Supabase Auth
  participant Go as Go protected adapter
  participant Identity as MOD-001 use case
  participant DB as Private PostgreSQL identity schema
  Browser->>Auth: Synthetic user signs in
  Auth-->>Browser: Session credentials
  Browser->>Go: Authorization Bearer access token
  Go->>Go: Fixed trust config, JWKS signature and claims
  Go->>Identity: Verified issuer, subject, session and token times
  Identity->>DB: Resolve binding, Account access state, role grants
  alt ACTIVE and operation permitted
    Identity-->>Go: Internal Account principal
    Go-->>Browser: API-006 minimal own state
  else invalid, missing or restricted
    Go-->>Browser: Safe 401 or 403; dependency outage 503
  end
```

The untrusted browser includes all body/query/path IDs, headers and provider metadata. JWKS is external input fetched only from configured trust infrastructure. PostgreSQL role/access state is authoritative business data. A trusted operator/bootstrap tool is a separate privilege boundary, absent from public HTTP routing. No browser Supabase database/Storage client may read or modify the identity tables.

Proposed immutable request principal: `{accountID, verifiedIssuer, verifiedSubject, sessionID, tokenIssuedAt, tokenExpiresAt, roles, accessRevision}`. Construct it only after verification and Account resolution. Keep external subject/session identifiers internal, out of ordinary logs and public DTOs. The internal random Account ID is the business owner key; never derive it from email or use a browser-supplied Account ID. Claims named `role`, `user_metadata`, `app_metadata` or profile fields grant **no LMS authority**, even when signed. Only server-owned role rows do.

## 3. Required configuration and startup behavior

These names are proposed interfaces, not added environment variables. Values below are descriptions/placeholders, never working credentials.

| Configuration | Required validation / custody |
|---|---|
| `IDENTITY_MODE` | Explicit `disabled` for Guest preview or `supabase-es256` for identity integration; unknown/incomplete mode rejects startup. No token bypass/mock-actor mode in a deployable identity artifact. |
| `APP_ENV` and identity environment ID | Must agree with an operator-approved manifest of project reference, issuer, DB identity and browser origin. Never infer issuer from request Host. Local integration and Guest preview have different project/network names. |
| `SUPABASE_AUTH_ISSUER` | Exact trusted `https://<project-ref>.supabase.co/auth/v1` for selected hosted project, without query, fragment or userinfo; byte-exact match on verified `iss`. No wildcard or suffix matching. |
| `SUPABASE_AUTH_AUDIENCE` | One configured user audience, proposed `authenticated`; verify actual tenant token. String or singleton string-array equal to it; other/multiple audiences rejected in this profile. Never accept `anon` or `service_role` as user credentials. |
| JWKS location | Derived from the approved issuer plus `/.well-known/jwks.json`, fixed at process start. No token `jku`, `x5u`, embedded `jwk`, custom Host, DNS target or redirect may choose another trust source. TLS verification required; redirects rejected. |
| Token policy | Proposed skew **30 seconds**, accepted token lifetime ceiling **3600 seconds**, maximum serialized bearer **8192 bytes**, kid **128 bytes**, JWKS response **64 KiB** / **8 keys**, HTTP Auth/JWKS deadline **2 seconds** within server limits. These are reviewable engineering defaults, not PO SLAs or observed provider settings. Tenant expiry must fit the ceiling. |
| Key-cache policy | Proposed local hard TTL **5 minutes**, refresh at **4 minutes**, unknown-key refresh single-flight with **30-second** cooldown per issuer; no unbounded attacker-controlled kid map. Time is monotonic for cache age. |
| PostgreSQL DSN | Runtime secret, private server custody; identity runtime role with only necessary grants; TLS verified to approved hosted DB. Separate migrator/bootstrap/operator credentials, never supplied to API/browser as a universal service key. |
| Browser public config | Explicit identity feature mode, project URL, publishable key, same-origin Go API. `VITE_` values are public build-time values. Public key/project pairing checked against the environment manifest. No signing, service-role, DB or bootstrap credentials. |

No successful startup on malformed trust configuration. Identity readiness remains false until compatible trusted keys and the identity schema are available. Process liveness is distinct from identity readiness; independently safe public reads can continue. Existing Guest mode initializes no Auth client or DB and remains credential-free. A local Supabase alternative would need its own reviewed loopback issuer/TLS exception and ES256 configuration; never relax hosted trust matching to accommodate it.

## 4. Request validation algorithm and errors

1. Parse exactly one `Authorization` header with Bearer scheme and one bounded token. Reject duplicate headers, query/cookie tokens, empty bearer and ambiguous whitespace/extra credentials. Protected-route failures use safe Problem responses and validated correlation IDs. Authentication must precede any protected side effect.
2. Reject malformed compact JWT structure, excess sizes, invalid encoding, duplicate JSON members, unsupported critical headers and non-JWT input. Header `kid` must be a bounded nonempty string; `typ`, if present, must be `JWT`. Only ES256 with matching EC/P-256 verification key is eligible. Reject symmetric keys, private JWK material, duplicate matching kids, encryption keys and inconsistent `alg`/`use`/`key_ops`. Absence of optional JWK metadata does not imply permission to use the wrong key type.
3. Select keys solely from the configured issuer cache. Verify the signature with a maintained JOSE library before trusting any claim. Unverified `iss`/`sub` never selects a tenant, database, URL or Account. Reject algorithm/key confusion, altered payloads and unsupported compression/extensions.
4. Require `iss`, `aud`, `sub`, `exp`, `iat`, `session_id`; reject missing, null, wrong-type, nonfinite or invalid numeric dates. Supabase user subject/session must be canonical UUIDs for this profile. Require provider user context `role=authenticated` and `is_anonymous` not true; this context check is not a Student/Admin grant. No email-based linking or JWT service-credential authentication.
5. With server time `now` and skew `s`, require `now < exp+s`, `nbf <= now+s` (if supplied), `iat <= now+s`, `iat < exp`, `nbf < exp`, and `0 < exp-iat <= lifetime ceiling`. Thus equality at `exp+s` rejects. NumericDates must be integral seconds in this profile. Validate exact issuer/audience even after valid signature. Use server UTC and a controllable clock; test expiry and skew edges. Beyond tolerance: 401. Time synchronization failure makes identity unready rather than widening tolerance.
6. Resolve the external binding, Account state and grants from PostgreSQL on **every protected request**. No positive Account/role cache in this increment. Missing/restricted Account or no usable role: generic 403 without account existence detail. DB outage: 503, no cached-actor bypass. API-006 is a read; missing Account never triggers creation.

| Condition | Proposed HTTP behavior |
|---|---|
| Missing/malformed/forged/unsupported/expired/wrong-context JWT; unknown kid after successful trusted refresh | 401; generic `Unauthorized`, appropriate Bearer challenge; no claim/parser detail |
| Compatible key material cannot be obtained on cold/expired cache or required provider live check fails operationally | 503 `Service Unavailable`; no authenticated result |
| Valid identity with absent, suspended, deleting/deleted binding/Account, revoked role or insufficient permission | Safe 403; foreign resource lookup uses indistinguishable 404 where applicable |
| Malformed API-006 query or unsupported representation/method | 400/406/405 consistent with API conventions; authenticate recognized protected methods before protected data processing |
| Unexpected internal failure | 500 with request ID only; preserve protected state |

These refine [API-006 and HTTP semantics](../DP-04/01-api-contract-and-resource-design.md#3-http-failure-semantics-and-conditional-boundaries), not a new domain error-code registry. Unknown/unimplemented product routes remain 404; that alone is not evidence of a working authorization check.

## 5. Rotation, cache and provider failure

Cache the **validated set** per configured issuer and replace it atomically after a successful fetch; removed keys leave the local set. Bound fetch size/key count and concurrent work. Refresh before TTL; do not extend the last-success timestamp on timeout, invalid response or partial parse. A known trusted key within hard TTL may still verify while Auth/JWKS is unreachable. Unknown kid can trigger one bounded refresh; cooldown prevents kid-flood amplification. A fresh set without the key yields 401; inability to determine trust due to fetch failure yields 503. Expired cache is never used as stale trust; safe public reads remain available.

Local purge/restart removes Go cache but cannot invalidate the provider's edge cache. Rotation rehearsal must prepublish the standby key, wait for provider propagation, observe both keys, switch signing, verify overlap, then remove old trust after the approved expiry/propagation window. Supabase's guidance includes waiting at least twenty minutes around standby/revocation propagation; use measured provider behavior rather than assuming a five-minute Go TTL makes revocation immediate. [Supabase discovery guidance](https://supabase.com/docs/guides/auth/jwts#verifying-a-jwt-from-supabase).

For a compromised key, an approved operational denylist of issuer+kid must immediately override cache, or disable identity traffic until corrected. No public cache-purge/key-trust endpoint. Retain key IDs/config revision and redacted verification results in rotation evidence; no private key. The combined edge/local cache delay and skew are residual acceptance considerations, not a guarantee of immediate provider key revocation.

## 6. Session revocation, logout and account takeover

Supabase sign-out destroys affected refresh tokens, but issued access JWTs remain valid until `exp`. A Go signature check alone cannot detect logout. [Supabase sign-out](https://supabase.com/docs/guides/auth/signout). Supabase documents checking JWT `session_id` against `auth.sessions` for sensitive operations when immediate session revocation matters. [Supabase sessions](https://supabase.com/docs/guides/auth/sessions#how-to-ensure-an-access-token-jwt-cannot-be-used-after-a-user-signs-out).

Proposed bounded behavior: API-006 accepts a cryptographically valid token for an ACTIVE Account until expiry; browser logout clears its local state immediately. Do **not** report replay after provider-only logout as immediately rejected. Local Account suspension/deletion denies every old token independently of provider availability. The replay window, provider ban/delete behavior and any requirement for immediate per-session invalidation need security/PO disposition VSA-O05 before implementation.

If immediate per-session revocation is required, revise the profile before coding: add a narrow server-only, read-only session-status capability for the configured `auth.sessions` context (no browser access or general Auth schema writes), check sensitive commands without positive caching, and fail 503 on unavailable live authority. Do not assert `/user` or `getUser` necessarily proves session existence; verify that semantic explicitly. Full Account takeover handling includes trusted Account restriction, credential/session reset and investigation by authorized operators; browser UI logout alone is insufficient. Admin MFA/reauthentication and recovery controls require the VSA-O09 disposition; synthetic-only scope does not waive review.

## 7. Go authorization responsibilities

Sources: [MOD-001/011 boundaries](../DP-03/02-module-boundaries-and-dependencies.md#1-proposed-module-contracts), [SEC-005–008/021](../DP-04/02-authentication-authorization-and-security.md#2-control-matrix), [RULE-024/026/027](../DP-02/02-domain-rules-and-invariants.md#5-roles-workspace-and-discovery).

| Boundary | Responsibility |
|---|---|
| HTTP middleware / adapter | Validate token, resolve active Account, construct typed principal, reject absent credentials and map safe errors. Public read routes stay independent. No header/body role becomes principal authority. |
| MOD-001 identity use case | Read binding/access/grants; expose `requireActive`, `requireRole`, `requireOwner` capabilities with a transaction-aware recheck. Unknown states/permissions deny. |
| Owning business use case | Explicit operation permission, owner predicate and current business policy at point of use. Repository reads/writes include `owner_account_id = principal.accountID`; never load foreign data into a serializer before authorization. Future modules must call this even without HTTP. |
| Transaction boundary | Recheck/lock Account and role authority with protected command, consistent lock ordering with restriction/bootstrap. Access revision is a stale-context detector, never a substitute for the lock/recheck. See [transaction design](03-account-schema-and-lifecycle-design.md#3-transactions-and-concurrency). |
| MOD-011 audit port | Required privileged audit durable in the local transaction; audit failure rolls back the privileged action. Safe bounded denied-auth telemetry is distinct from durable privileged audit. |

Permission proposal: ACTIVE Student reads own `/me` and future own resources only. Admin has an explicit additional role grant and may read own `/me`; future content/audit actions require named privileges in their slices. Admin never gets an arbitrary cross-Student owner bypass, submits another Student's attempt, grants itself roles publicly, or overrides deletion state. A roleless Account is denied; no implicit fallback grant. Role removal takes effect on the next request/command recheck, independent of old JWT claims.

Proposed API-006 success: `{"data":{"accountId":"<internal-id>","roles":["Student"],"accessState":"ACTIVE"},"meta":{"requestId":"<validated-id>"}}`. No token, external subject, email, session, provider metadata or personal profile is required for this proof. Generic 403 contains no restricted-account payload. Explicitly whitelist query parameters (none proposed) and methods; use no-store. Extensions to profile fields require classification review.

## 8. Trusted initial Admin bootstrap

Use a separate nonpublic operator command, absent from API route registration and ordinary API runtime privileges. Inputs are an explicit environment manifest, approved operation/authorization reference and **known issuer+Supabase user UUID**, never an email, wildcard, browser role or “first signup”. Operator verifies the existing synthetic provider user via approved trusted provider access before invoking the local transaction. No real account is created in this review.

Bootstrap requires an ACTIVE, previously provisioned Account and a database-enforced per-environment singleton record. In one transaction: lock singleton, resolve/lock binding and Account, verify authority/environment/state, assert no initial grant already consumed, insert Admin grant, increment access revision, insert minimized durable audit, record completed bootstrap operation, commit. Bootstrap DB credential has only this narrow capability; ordinary API credential cannot issue Admin grants or update bootstrap state. Do not put authority in a startup environment flag checked repeatedly by the public server.

Same operation and same subject after an unknown response reads recorded outcome without a second grant/audit. A different subject, conflicting operation payload, concurrent contender, unauthorized operator, restricted Account or missing audit fails with no grant. If the initial Admin is later restricted/deleted or its role revoked, singleton remains consumed; retries do not recreate authority. Additional Admins, replacement bootstrap and break-glass recovery require new explicit policy/authorization and independent audit; do not reset the singleton or invent a permanent superuser route.

## 9. React authentication design

Propose only `/login`, a minimal own-account view, and logout controls; precise screen routing/copy is a VSA-O06 review item. Existing Guest routes remain accessible without Auth configuration. First integration uses existing synthetic email/password users, no public registration/recovery/email side effects. Credential form calls Auth directly over TLS; Go receives access tokens only, never passwords/refresh tokens. Any future redirects must allow only local relative return paths, with no external/open redirect.

Use a pinned reviewed Supabase JS client configured for in-memory sessions (`persistSession: false`), automatic refresh during the active page, and no implicit URL token import for this password flow (`detectSessionInUrl: false`). SDK options are documented in [Supabase client initialization](https://supabase.com/docs/reference/javascript/initializing). Memory-only means reload/new tab requires sign-in again; this is an explicit bounded tradeoff pending PO disposition, not a persistent-session promise. No bearer in localStorage/sessionStorage/IndexedDB, URL, console or analytics. XSS can still steal live memory tokens; preserve inert content rendering and review identity CSP/dependency risks.

Auth events initiate Go `/me` resolution outside synchronous callback work. Only a successful Go response renders Student/Admin account state. Use session generation/abort control so delayed `/me` or refresh from A cannot populate B after logout/login. Clear account cache and protected screen state immediately on logout, 401 or account change; on 403 show a generic restriction and allow Guest navigation; on 503 show unavailable/retry without rendering cached authority. Refresh at most once per request after 401, then sign out locally; do not retry 403 or privileged mutations blindly. Failed provider logout must clear browser state while explaining server sign-out was not confirmed.

Bearer-header transport uses no ambient auth cookies. Prefer same-origin Go proxy; if cross-origin API is later needed, exact origin allowlist and preflight headers/methods, no credentialed wildcard or cookies. CORS is not an authorization boundary. Changing to cookies requires a reviewed CSRF/session design. Local HTTP is permitted only for the documented loopback synthetic preview; hosted Auth/DB and any externally reachable traffic require verified TLS.
