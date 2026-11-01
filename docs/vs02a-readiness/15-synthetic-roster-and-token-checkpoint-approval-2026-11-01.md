# VS-02A — Synthetic roster and token checkpoint approval record

| Field | Proposed value / current disposition |
|---|---|
| Record | `VSA-SYN-20261101-R1` |
| Baseline | `8ebcffb8903899714326946ce443d4e2c76772ac`, draft PR #17 |
| Target | Previously approved isolated hosted test project; alias `vs02a-synthetic-candidate`; Frankfurt `eu-central-1` |
| Approval | **APPROVED for the exact bounded R1 actions below**; operator replied “Setujui R1 persis seperti tertulis” to the explicit approval question |
| Authority needed | Explicit operator/PO reply approving the exact roster, mail policy, credential custody, action scope and reset/delete owner below |
| Exclusions | No application Account/Student/Admin grants, Admin bootstrap, migration, public signup, anonymous sign-in, deployment or Auth Bundle 1 |

This is a concrete proposal for the current bounded verification task. The earlier approval of the project/region and the instruction to prepare this checkpoint do not approve creating users. Preserve [the earlier connected checkpoint](14-connected-supabase-public-jwks-checkpoint-2026-11-01.md) and [implementation gates](12-readiness-dispositions-and-bundle-1-handoff-2026-11-01.md).

## Exact roster

| Alias | Synthetic provider email | Provider context | Application authority |
|---|---|---|---|
| Student A | `vs02a-student-a@vs02a.invalid` | Ordinary nonanonymous Auth user | None: label only; no application Account or role write |
| Student B | `vs02a-student-b@vs02a.invalid` | Ordinary nonanonymous Auth user | None: label only; no application Account or role write |
| Candidate C | `vs02a-candidate-c@vs02a.invalid` | Ordinary nonanonymous Auth user | None: not an Admin; no bootstrap/grant |

Do not hardcode provider UUIDs. Obtain UUIDs from successful supported provider operations and keep the mapping in a restricted local execution ledger. Public evidence uses aliases and hashes. An existing/conflicting user or unexpected project data stops creation for review; never overwrite/reset a matching email automatically or adopt an unrelated user.

## Mail ownership and confirmation policy — explicit acceptance required

Propose **no deliverable mailbox and no outbound mail**. `.invalid` is a reserved nonresolving namespace, not a domain/mailbox claimed to be owned by the operator. The operator must explicitly accept this non-delivery test policy in place of an owned mailbox. No real contact address, test-mail service account, SMTP credential, email invitation, magic link or password-reset email is used.

Use supported server-side Admin Auth creation with per-user `email_confirm=true` for these three synthetic identities only; leave global confirmation/signup settings unchanged. This bypass is limited to operator-created synthetic fixtures, not public onboarding. If Supabase rejects the reserved addresses, stop; an operator-owned isolated test-mail domain/addresses and delivery policy require a revised, explicitly approved roster. Do not improvise a real address.

Sources: [IANA reserved .invalid domain](https://www.iana.org/domains/root/db/invalid), [Supabase server-side createUser and email confirmation](https://supabase.com/docs/reference/javascript/auth-admin-createuser).

## Credential handling

- Generate an independent random password with at least 256 bits of entropy for each approved alias, only after approval. Never put passwords, JWTs, refresh tokens, API keys or private signing keys in chat, Git, command arguments, logs, screenshots or CI artifacts.
- If a local credential ledger is needed, use a newly created private directory outside the repository (mode `0700`) and exclusive-create file (mode `0600`), without symlink following or overwrite. Retain only fixture emails/passwords and creation UUIDs there; no user access/refresh token is written to disk. Do not copy the ledger into evidence.
- Authentication responses and user JWTs stay in the operator process's memory. Emit only allowlisted verification booleans, public policy values, times/lifetime and subject/session/kid/issuer hashes. Suppress raw provider error bodies and parser errors.
- Use a scoped, approved administrative Auth capability or an operator-supplied project secret **locally**, never by reading secrets/signing keys from PostgreSQL or putting a service credential in the browser. Public project keys may be used in memory for settings/password sign-in; they are not user tokens or Admin authority.
- At completion, terminate the test sessions through the specifically approved local logout scope and remove the task-created local credential ledger after recording redacted outcomes. Do not delete any caller-managed secret store or credential file.

## Proposed provider state changes — all require the approval below

1. Create at most the exact three users above in the approved project through supported Admin Auth API/Dashboard operations, with fixture-only metadata, no phone and no email delivery. Keep public signup and anonymous sign-ins disabled. No SQL insertion into managed `auth` tables.
2. Perform at most **two password sign-ins per fixture** to obtain genuine provider access JWTs for this checkpoint. This creates provider sessions. No signup, refresh-token exchange, invitation, external OAuth or account recovery flow.
3. Perform at most **one local-scope logout per session created by this task**, affecting only that task session. Never use global logout for another session/user. Re-verify the already-issued access token in memory to observe offline replay; do not call a nonexistent application protected endpoint or claim an application logout test passed.
4. Read only restricted session-existence booleans, fixture counts and other scoped metadata needed for evidence. Negative signature/claims cases use ephemeral local keys/tokens and fake fixtures, not forged traffic to Supabase or unrelated services.

The checkpoint will pin exact trusted issuer/JWKS from approved project configuration, expected audience `authenticated`, ES256/P-256 only, proposed 30-second skew and 3600-second maximum issued lifetime. These are the checkpoint's test expectations, not approval of the production O04 profile. A mismatch is recorded FAIL/BLOCKED; no HS256/RS256/unsigned fallback or silent lifetime change.

## Reset/delete responsibility

Proposed accountable owner: **the current authorized operator/PO who supplied and confirmed the isolated project**. Explicitly accepting this record assigns responsibility for retained fixture users, reset/deletion scheduling and project teardown. It does not silently delegate a destructive reset: provider user deletion, password reset, project deletion or cleanup of preexisting resources requires a separate explicit instruction identifying exact resources. No real learner data or production recovery policy is introduced.

## Capability boundary

The previous scoped MCP inventory contains metadata/SQL tools but no supported Admin Auth create-user tool. Reinspect current capabilities before execution. OAuth access/SQL privileges do not justify direct insertion into `auth.users`/`auth.identities` or extraction of service/signing secrets. If the scoped connection cannot perform a supported creation flow, record **BLOCKED** and request an approved local Admin API capability or operator Dashboard creation. Approval of this roster alone cannot fabricate a missing capability.

## Approval ledger

| Required disposition | Status |
|---|---|
| Exact A/B/C roster approved | **APPROVED — explicit R1 reply** |
| Non-delivery `.invalid` policy accepted; no mailbox ownership falsely claimed | **APPROVED — explicit R1 reply; no deliverable mailbox or domain ownership claimed** |
| Per-fixture email confirmation and credential custody approved | **APPROVED — explicit R1 reply** |
| Bounded creation/password sign-in/local logout actions approved | **APPROVED — explicit R1 reply** |
| Operator accepts reset/delete responsibility | **ACCEPTED — current authorized operator/PO** |
| Supported creation capability available | **MCP has no Admin Auth create-user tool; supported Admin API path prepared, local operator secret input required** |
| Independent security review / O05 replay risk acceptance | **NOT APPROVED BY THIS RECORD** |
| Auth Bundle 1 / QUAL-002 authority | **NOT GRANTED** |

Suggested operator reply: “I approve `VSA-SYN-20261101-R1` exactly as written, accept the three reserved synthetic addresses with no mailbox/outbound email, approve the described credential handling and bounded create/sign-in/local-logout actions, and accept reset/delete responsibility.” A changed email/domain, owner, target or flow requires an updated record and explicit disposition. Actual approval identity/time/provenance is added only after a reply is received.

Recorded disposition: the current authorized operator/PO selected **“Setujui R1 persis seperti tertulis”** in this project conversation. [Machine-readable approval/provenance](synthetic-roster-approval.json) records the receipt checkpoint time; no GitHub-authenticated signature, exact message timestamp or independent human review is fabricated. The proposed reply above is retained as history, not an additional approval request.

O05 remains a separate decision proposal: provider-only logout can leave an access JWT usable by an offline verifier until `exp + approved skew`. Actual measured lifetime/replay observations must be recorded before a PO decision is requested; this roster approval neither approves that risk nor supplies independent review.
