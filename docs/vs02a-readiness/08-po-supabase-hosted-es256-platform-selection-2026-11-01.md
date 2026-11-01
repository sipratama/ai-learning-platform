# VS-02A — Product Owner Platform Selection: Hosted Supabase + ES256

| Metadata | Value |
|---|---|
| Decision ID | `VSA-DEC-001` — bounded platform/algorithm selection |
| Date / provenance | 2026-11-01; user explicitly accepted the assistant's recommendation for **Supabase hosted test project with ES256** in the project conversation |
| Preparation | AI-maintained repository record of the PO's expressed choice; **not** an independent review or GitHub-authenticated signature |
| Starting source | `main` `00480abd9970bdea127d2e3706a260cf53bb29d9`; PR #15 readiness decision pack |
| Disposition | **SELECTED FOR VS-02A SYNTHETIC TEST PLANNING ONLY** |
| Implementation authorization | **NOT GRANTED**; gates G0–G4 remain open |
| Credential / infrastructure action | No real project/keys/DB/users created, rotated, purchased or verified by this record |

## 1. Precise scope of the PO choice

The selected platform for a *future dedicated identity test environment* is **hosted Supabase Auth**. The selected JWT signing/verification algorithm for the bounded VS-02A design is **ES256 (NIST P-256, asymmetric)**. The Go API is intended to verify signatures against the exact approved tenant JWKS, issuer and audience, and derive application authority only from Go-owned PostgreSQL Account/access/roles after authentication.

This selection resolves **the provider/hosting choice within VSA-O03** and **the algorithm choice within VSA-O04**. It does **not** resolve:
- actual Supabase project creation, tenancy/project reference, billing, region, owner, isolated PostgreSQL, synthetic test users and operational verification (O03);
- exact trust config, maintained Go JWT/JOSE library version, numeric defaults and emergency key-rotation policy (remaining O04);
- provider-only logout and access-JWT reuse until expiry versus live session revalidation (O05);
- registration/session storage/provisioning policy (O06);
- predecessor formal acceptance, mandatory security review and implementation authorization (O01/O02).

The rest of [VSA-P1](02-identity-and-authorization-design.md) is a **proposed security profile**, not blanket approval of every numeric default. The earlier [open-items register](06-readiness-decision-and-open-questions.md) remains a historical readiness snapshot. This decision document is an additive, narrower later disposition; do not mark its whole O03/O04 row `CLOSED`.

## 2. Environment boundary and recommended region

- Use **one newly isolated, disposable, nonproduction Supabase project**, not a personal or production tenant. No real learner identity or contact details.
- **Suggested primary region: Singapore**, for relatively near Indonesian testing; region, residency and cost remain **operator/PO review items**. Select an explicitly available region in the project setup, record the actual region as nonsecret evidence, and ensure hosted project quota/billing has been accepted before creation.
- Use separate synthetic user identities for A/B/C; subject UUIDs should be observed from the provider after creation, not hardcoded into a real tenant based on proposed fixture examples. Test artifacts should use neutral aliases.
- Browser receives only project URL and publishable key in approved public configuration; never service-role/secret key, DB credentials, signing private key, JWT or refresh token in GitHub issues, CI logs or frontend build variables.
- Keep the current Guest fixture mode independent and secret-free; do not turn on Auth in the existing local Docker preview.

## 3. Security invariants carried into the implementation gate

1. **No fallback** to HS256, `none`, RS256, unverified claims, arbitrary issuer, user-selected JWKS URLs or browser role claims.
2. Auth issuer is configured out-of-band and immutable per environment; JWKS is derived exclusively from the approved issuer: `https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json`.
3. Reject empty/incompatible JWKS in identity-ready mode. An existing project still signing HS256 must be **stopped for review**, not silently accepted. Do not rotate a shared/existing environment key as part of exploratory testing.
4. Validate exact audience and required claims and use a maintained JOSE implementation; user credentials must be a real Supabase Auth user access token, not a publishable API key.
5. Always resolve authorization/ownership and current account restrictions server-side. `GET /api/v1/me` must not mutate Account state or auto-provision.
6. Profile, logging, key-cache lifetime, issuer/subject mapping and session revocation semantics require the independent security/design review in the existing [threat matrix](04-threat-model-and-security-test-matrix.md).

## 4. Implementation and decision limits

**Authorized now:** preparing this record, setup checklist, environment/evidence requirements, architecture review material, and risk-based test mapping. **Not authorized by this decision:** creating a hosted project without account/billing confirmation; rotating an active tenant key; adding credentials, DB migration or Auth feature code; granting Admin roles; real-data usage; production rollout; marking independent review or DD-001 complete.

Follow [the setup runbook](09-hosted-supabase-es256-synthetic-setup-and-verification-runbook.md), then obtain human specialist review and explicit scoped implementation approval before `feat/vs-02a-token-verification`.

## 5. External technical references (consulted 2026-11-01)

- Supabase: [JWT signing keys and rotation](https://supabase.com/docs/guides/auth/signing-keys) — ES256 is P-256; public JWKS and rotation/cache semantics.
- Supabase: [JWT verification](https://supabase.com/docs/guides/auth/jwts#verifying-a-jwt-from-supabase) — JWKS endpoint, asymmetric/public-key validation, and no keys for symmetric signing.
- Supabase: [Available regions](https://supabase.com/docs/guides/platform/regions) — region and data residency considerations.

**Next accountable action:** the PO/authorized operator confirms an isolated project and cost/region; a human security reviewer approves the precise verification profile and tests. A PR merge alone is not those confirmations.
