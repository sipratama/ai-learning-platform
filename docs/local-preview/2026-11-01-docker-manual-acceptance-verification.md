# Current-main Docker preview and PO manual acceptance preparation

Prepared 2026-11-01, Asia/Jakarta. **READY FOR PRODUCT OWNER MANUAL TESTING — approved OrbStack engine, synthetic Guest scope only. Manual results remain NOT RUN.** Docker Desktop itself is NOT VERIFIED; no claim of Desktop testing is made.

Source base: **`7ec5973be65fdefc0d09e29d9850ea48ca052961`**. Branch: `test/local-docker-human-acceptance`. Reviewed packaging fix: **`e5b09f5a0fa7e775c2e0f530c27d4a51df09d4e3`**. Subsequent commits add documentation/evidence only; exact final head/CI is recorded in the PR. [Indonesian operator guide](PO-TESTING-ID.md), [MT-01–MT-08 plan](PO-MANUAL-TEST-PLAN.md), [unsigned manual result sheet](manual-test-results.json).

## 1. Repository and effective governance

The initial main working tree was clean. Fetched main contains merged PR #18 at `161e18e80bcf7f3540dc38a0add360267a2e0b1a` and PR #17 at the source base above. A new branch was created only because the manual package and a reproducible preview-build fix were needed. Existing uncommitted work was not discarded; historical source/evidence is preserved except the two explicitly changed packaging/CI files.

[Governance/operator evidence](evidence/2026-11-01-po/governance-and-operator.json) separates these facts:

| Subject | Effective disposition / limit |
|---|---|
| Current local work | User authorizes Guest Docker execution/manual-test preparation; explicitly replies **“Gunakan OrbStack untuk uji lokal ini”**. No daemon/global settings changed |
| Provider selection | Recorded hosted Supabase/ES256 and Frankfurt choices, R1 exact synthetic provider fixture authorization remain bounded prior decisions; no Supabase call is made here |
| Issue #16 | OPEN, with all nine checklist items checked, but body still says Auth NOT AUTHORIZED. Checked boxes alone do not supply a named independent reviewer, exact O04/O05/O06 dispositions or QUAL-002 authority. No checklist change or closure performed |
| VS-01A closure | `VS01A-CLOSE-001` remains PENDING SIGN-OFF. Issue #13 PO decision is conditional on mandatory independent review; fresh PR #14 review query and PR #17 review/comments do not supply that completion |
| PR #18 review/merge | Merged remediation is actual code; fresh main npm audits are now zero. The recorded review is **AI-assisted COMMENTED**, explicitly not independent human approval and originally calls for independent review before merge. A merge does not retroactively supply that review or close all O14 residuals |
| O04/O05/O06 | [Decision records](../vs02a-readiness/18-o04-o05-o06-decision-records-2026-11-01.md) remain PROPOSED / NOT APPROVED; 3600 s observed provider token lifetime is separate from proposed 30 s verifier tolerance. No new decision inferred from merge/checklist |
| QUAL-002 | [Formal review form](../vs02a-readiness/21-formal-implementation-authorization-review-2026-11-01.md) remains NOT GRANTED; G0/G1/G3 and a separate G4 decision are unresolved. This task does not create an Auth branch |
| GOV-AI-001 / security | Governance amendment still proposed/not effective; independent identity/security review and independent API-key revocation verification remain pending. The operator's earlier replacement report is not re-verified here; private env/keys were not read |

The old runbook's eleven-advisory and draft-PR statements remain historical snapshots. This addendum records current merge/audit facts without rewriting them or accepting any unsigned decision. GitHub event timestamps and local host UTC logs show source-clock ordering skew; independent clock calibration was NOT RUN. Use commit DAG/digests for lineage, not inferred approval chronology. No system clock was changed.

## 2. Engine, supported commands and actual running stack

Docker Desktop was not found at checked application locations/Spotlight, and no active Desktop context exists. Docker CLI/Engine **29.8.2**, Compose **5.5.0**, context **orbstack**, Linux **arm64** were available. Operator explicitly selected OrbStack. Port 8088 was already owned by the same project/root Compose preview, not an unrelated listener. Its old healthy status was not treated as current build proof.

Configuration reused unchanged: [compose.local.yaml](../../compose.local.yaml), project **`ai-learning-local-preview`**, existing two-service synthetic stack. No database, new production stack, Supabase service or credential is added. Actual successful command:

```sh
docker compose -f compose.local.yaml up --build -d --wait --wait-timeout 120
docker compose -f compose.local.yaml ps
curl --fail http://127.0.0.1:8088/healthz
```

The local stack is **left running**. Only this project's future explicit `down` should stop it. The new CI job tears down its own isolated runner, never the operator's local engine.

| Service | Container | Verified state | Host exposure / identity |
|---|---|---|---|
| api | `ai-learning-local-preview-api-1` | running / healthy | No host API mapping, internal 8080; UID 10001; current linux/arm64 platform manifest matches rebuilt tag |
| web | `ai-learning-local-preview-web-1` | running / healthy | Only `127.0.0.1:8088 → 8080`; UID 101; current linux/arm64 platform manifest matches rebuilt tag |

[Container inspection](evidence/2026-11-01-po/container-verification.json) records actual manifest/index/config identifiers, architecture, health, non-root/read-only/cap-drop/no-new-privileges settings and environment **names only**. OCI config, image index and platform manifest digests are different kinds; an initial naive ID comparison was corrected by comparing `ImageManifestDescriptor.digest` to `docker image inspect --platform linux/arm64`. Both platform manifests match; identical final runtime layers were reused, not falsely described as newly recreated containers.

[Actual HTTP verification](evidence/2026-11-01-po/http-verification.json) confirms frontend/nested routes, proxied health/API, public fixture IDs/media and negative API responses. Main URL: **http://127.0.0.1:8088/catalog**. Reader: **http://127.0.0.1:8088/courses/course-flagship/lessons/lesson-flagship-1**. Browser routing is actual React through Nginx to the Go fixture, not mocked Vite routing. Default browser was opened to the verified catalog.

## 3. Reproduced build defect and minimal fix

**DEF-LOCAL-001 — P1 local preview build blocker; reproduced and fixed in packaging.** Initial current-main `docker compose ... up --build -d` failed at Vite/Rolldown native binding import. Npm 10.9.9 reported install success and zero vulnerabilities, but its successful cached install layer lacked the needed Rolldown musl package and Vite's nested Lightning CSS musl package. The existing old stack stayed up; its health was not substituted for a successful build.

[Initial build FAIL](evidence/2026-11-01-po/compose-up-build.txt), [cached-layer reproduction](evidence/2026-11-01-po/cached-layer-diagnostic.txt), [targeted npm events](evidence/2026-11-01-po/cached-npm-target-events.txt) and [clean identical-input probe](evidence/2026-11-01-po/alpine-clean-probe.txt) distinguish the observations. Clean same-image/same-lock installs succeed. Exact original transport/download failure is not established; this is not proof that the lockfile/minimatch override is incompatible. The generic upstream optional-dependency error links [npm issue #4828](https://github.com/npm/cli/issues/4828), but that link alone does not establish the same underlying defect. The first diagnostic had a quoting error; its failed output is retained separately, and the corrected mounted probe—not that failed command—establishes clean native imports.

Fix: keep `npm ci` and required native-module imports in **one Docker RUN instruction**, including Rolldown, Tailwind oxide, root Lightning CSS and Vite's own resolved Lightning CSS. An incomplete install now fails before BuildKit may cache it as a successful dependency layer. No lock/dependency/base-image version, source feature, security rule or Auth code changed. Do not remove the lock or update npm blindly to bypass the failure.

Regression evidence:

- [Negative guard](evidence/2026-11-01-po/native-guard-negative.json): the real incomplete cached layer is rejected, expected nonzero and actual exit 1 → **PASS**. This does not relabel the original build FAIL.
- [Fixed Compose build/start](evidence/2026-11-01-po/compose-up-fixed.json): actual build including all four import checks succeeds, both services healthy → **PASS**.
- Existing actual Docker browser/proxy suite **8/8 PASS**, and a new CI job builds/starts the supported stack, runs that suite, retains diagnostics and cleans up only its CI runner. All original CI checks remain.

No other reproducible Guest feature defect was found in this bounded execution. This is not an exhaustive defect-free or independent security claim.

## 4. Automated verification versus manual testing

| Check | Actual result / coverage |
|---|---|
| Compose/image build | Initial FAIL retained; minimal native-cache fix and final build/start PASS on approved OrbStack arm64 |
| Container/health/frontend/proxy | PASS: both healthy; `/healthz` JSON ok; actual frontend 200, nested SPA refresh, API/media status/content checks; no separate API host port |
| Runtime secret-shaped asset scan | PASS for API-secret/private-key/serialized JWT patterns in actual static assets; matching contents never printed. No production credentials configured or required |
| Docker browser suite | PASS **8** actual Go–Nginx–React desktop/mobile tests; no request interception. Includes private/draft/media boundaries, safe errors, pagination, flashcard, nested refresh, keyboard/axe |
| Additional automatic observation | PASS **12** pages across desktop 1440×1000, tablet 834×1112, mobile 390×844; zero normal-flow console/page errors, external origins or dialogs; no page horizontal overflow. Chrome **156.0.8078.79** |
| Host Go | PASS standard/devfixture vet, tests and race; fixture artifact/startup boundary passes. Go **1.27.3** |
| Frontend | PASS typecheck/lint/tooling compatibility, **26** unit/component tests and build; Node **22.23.4**, npm **10.9.9** |
| Host browser regressions | PASS **24** mocked E2E and **12** actual host Go–React E2E. Tests ran in disposable source copy to preserve historical evidence |
| npm audit / production audit | PASS, **0 / 0** on current merged main dependencies; prior 11 findings are historical, no new waiver or dependency change |
| Isolated checkpoint artifacts | PASS offline Go verifier race/vet and **15** operator guards / **10** JWKS probe guards. No real token/provider operation rerun; these scripts are not app Auth |
| Secret/source/evidence checks | Executed and retained with manifest; existing app/test/lock/evidence bytes preserved except Dockerfile.local/CI; scans/digests are bounded assurance |
| Product Owner MT-01–MT-08 | **NOT RUN**, actual result NOT RUN and no PO identity/decision supplied. Automatic screenshots are not manual evidence |
| Manual zoom/screen reader/physical devices | **NOT RUN**; explicit PO cases prepared. Automated axe is not WCAG certification |
| Docker Desktop/native Windows | **NOT RUN / unavailable in inspected setup**; operator-approved OrbStack replaces Desktop for this local run only |
| Final-head hosted CI | Exact run/head/jobs recorded in PR after execution; no future result assumed here |
| Auth login, app logout, RBAC, Admin UI | **NOT IMPLEMENTED** in current app routes/Go source; `/api/v1/me` and Admin endpoints are 404. Operator JWT scripts and generic route rejection do not prove application Auth |

[Browser observation](evidence/2026-11-01-po/browser-observation.json), [timed frontend/backend checks](evidence/2026-11-01-po/commands.json), [Docker command outcomes](evidence/2026-11-01-po/docker-commands.json) and [runtime/source manifest](evidence/2026-11-01-po/runtime-source-manifest.json) retain provenance. Host checks use base app/test/package bytes unchanged by the packaging fix. Local stdout has ordinary Playwright NO_COLOR/FORCE_COLOR warnings; these are not hidden or claimed to be application console errors. Expected deliberate 400/404/405/406 probes are separate from normal-flow diagnostics.

Automated screenshots are under [desktop catalog](evidence/2026-11-01-po/auto-desktop-catalog.png), [tablet reader](evidence/2026-11-01-po/auto-tablet-reader.png) and [mobile reader](evidence/2026-11-01-po/auto-mobile-reader.png). They document the automated observation only. The eight manual cases have separate suggested locations and remain untouched by those results.

## 5. Handoff and limits

The PO can now follow [the Indonesian guide](PO-TESTING-ID.md) and fill actual results/evidence in [the manual sheet](manual-test-results.json). Leave any unperformed subcase NOT RUN/BLOCKED; do not mark an entire case PASS on partial evidence. The full-screen browser route and same-origin API are live on loopback without production credentials. No LAN/tunnel/public exposure is authorized; OrbStack's direct local container access is an engine-level capability already documented in the old runbook, not a new access guarantee.

Keep Issue #16 OPEN. O04/O05/O06 accountable decisions, independent identity/security/predecessor review, final VS-01A closure and separate QUAL-002 remain required before Auth implementation. The merged npm fix does not close all O14 or other governance conditions. This package and CI supply neither independent human sign-off, PO manual acceptance, Auth Bundle 1 authority, deployment nor beta approval. Stack remains running for the operator unless shutdown is requested.
