# npm tooling minimatch remediation — 2026-11-01

Prepared 2026-11-01, Asia/Jakarta. Engineering validation **PASS; independent security approval NOT SUPPLIED; merge NOT AUTHORIZED by this report**.

Maintenance branch: `fix/npm-tooling-minimatch-advisory`, created in a separate worktree from fetched `origin/main` **`91080f45e1aba38316eeecca6eeba3f618bd7f3a`**. Implementation commit: **`7eccd9a2c9144ca5aa4dedc5c229628cf2668d92`**. The original branch and Draft PR #17 remain untouched. Its [advisory assessment at fae0b2a](https://github.com/sipratama/ai-learning-platform/blob/fae0b2a5072b552898f45fc9fe0bdb30d338bffd/docs/vs02a-readiness/20-npm-tooling-advisory-dispositions-2026-11-01.md) was read as a reference; no unrelated PR #17 changes were merged, copied or cherry-picked.

## 1. Baseline and root cause

Clean baseline `npm ci` succeeded. Full `npm audit --json` exited **1: 11 Moderate, 0 High/Critical**; `npm audit --omit=dev --json` exited **0: zero**. [Before audit](evidence/2026-11-01-minimatch/baseline-audit.json) and [dependency tree](evidence/2026-11-01-minimatch/baseline-tree.json) reproduce actual paths. All 11 are development-tooling package findings: one direct root [GHSA-g3hv-75wg-m249 / CVE-2026-118764](https://github.com/advisories/GHSA-g3hv-75wg-m249) affecting minimatch before 11.0.1, plus ten inherited package/metavulnerability entries, not eleven independent CVEs.

The root concerns amplified preprocessing of attacker-supplied glob patterns with optimization level at least 2. Current inspected ESLint/config-array/estree callers use default optimization and bounded project-controlled patterns; this limits demonstrated applicability but never justified ignoring the installed vulnerable version or suppressing audit results.

[Fresh registry metadata](evidence/2026-11-01-minimatch/registry-metadata.json) and maintainer release records were reviewed: [ESLint 10.14.0](https://github.com/eslint/eslint/releases/tag/v10.14.0), [TypeScript ESLint 8.72.1](https://github.com/typescript-eslint/typescript-eslint/releases/tag/v8.72.1), [minimatch 11.0.3](https://github.com/isaacs/minimatch/releases/tag/v11.0.3), [minimatch changelog](https://raw.githubusercontent.com/isaacs/minimatch/v11.0.3/changelog.md). Latest stable parents still declare minimatch `^10.2.6` (ESLint), `^10.2.4` (config-array) and `^10.2.2` (estree). No supported stable parent resolution to the patched major was available in the queried metadata. Automatic npm suggestions to downgrade ESLint/TS-ESLint were rejected; `npm audit fix --force` was not used.

## 2. Scoped remediation and all affected paths

The only dependency-version change is minimatch **10.2.6 → 11.0.3**, pinned with [npm parent-scoped overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json/#overrides) for exactly:

```json
{
  "eslint@10.14.0": { "minimatch": "11.0.3" },
  "@eslint/config-array@0.23.5": { "minimatch": "11.0.3" },
  "@typescript-eslint/typescript-estree@8.72.1": { "minimatch": "11.0.3" }
}
```

The scopes are deliberately version-specific. They do not claim upstream semver support, and new parent versions must be reviewed rather than silently inheriting an indefinite global override. The lock adds the required **development-only** `@isaacs/nonrecursive-glob-match 1.0.3` with integrity metadata. Existing brace-expansion stays at its locked version; no production direct dependency or unrelated node/version changes. [Exact node delta](evidence/2026-11-01-minimatch/lock-delta.json) and [per-finding results](evidence/2026-11-01-minimatch/finding-delta.json) are retained.

| Before affected package | Before → after locked version | Refreshed full audit |
|---|---|---|
| minimatch | 10.2.6 → **11.0.3** | Not reported |
| eslint | 10.14.0 → 10.14.0 | Not reported |
| @eslint/config-array | 0.23.5 → 0.23.5 | Not reported |
| @eslint/js | 10.0.1 → 10.0.1 | Not reported |
| @eslint-community/eslint-utils | 4.10.1 → 4.10.1 | Not reported |
| typescript-eslint | 8.72.1 → 8.72.1 | Not reported |
| @typescript-eslint/parser | 8.72.1 → 8.72.1 | Not reported |
| @typescript-eslint/typescript-estree | 8.72.1 → 8.72.1 | Not reported |
| @typescript-eslint/eslint-plugin | 8.72.1 → 8.72.1 | Not reported |
| @typescript-eslint/type-utils | 8.72.1 → 8.72.1 | Not reported |
| @typescript-eslint/utils | 8.72.1 → 8.72.1 | Not reported |

ESLint/config-array engines on the 22.x line require at least 22.13; TS-ESLint peers accept the unchanged ESLint 10 and TypeScript **5.9.3**. Minimized overrides preserve these parent peers rather than downgrading. Validation used CI's **Node 22.23.4, npm 10.9.9**. Initial shell Node 26 was detected and baseline/install/comparison were repeated with Node 22. Lock generation used existing **npm 11.20.0 on Node 22** to preserve original Linux `libc` metadata; npm 10 regeneration churn was discarded. Subsequent clean npm 10 install left lock bytes unchanged. The manifest's pre-existing `>=22.12.0` engine declaration is not a newly validated minimum; this maintenance does not expand supported Node versions.

## 3. Major-version compatibility experiment

Minimatch 11 is not API-equivalent in general: the `makeRe` API and AST class are removed and set entries now use Matcher objects; partial matching, empty path parts and some Windows semantics intentionally changed. Inspected consumers use constructor/`match` and exported `minimatch`, not those removed APIs. Keeping the override depends on the actual consumer/configuration evidence below, not merely zero advisories.

[Compatibility guard](../../scripts/check-minimatch-tooling.mjs) was run unchanged on baseline and override. [Before](evidence/2026-11-01-minimatch/compatibility-before.json), [after](evidence/2026-11-01-minimatch/compatibility-after.json) and [comparison/provenance](evidence/2026-11-01-minimatch/compatibility-comparison.json) retain:

- The same **30 actual linted files**, including tests/configuration, with no lost nonignored tracked JS/TS file; all 30 effective rule/language/plugin/settings configurations have identical digests.
- Identical complete behavior digest **`f82e6f03484cf4995d206db69abdffcd9ece58ca3a8cb75a4723772328b07c4e`**, with 12 pattern classes covering JS/TS/TSX, braces, extglobs, escaped names, dot files, directory-prefix partial matching and all project ignore families, across every scoped consumer.
- Eight effective ignore/nonignore cases, including near-name directories that must remain linted; four valid/invalid TSX and JS/TS rule fixtures proving parsing and rule diagnostics remain active.
- Actual TypeScript Program parsing through estree's `allowDefaultProject` matcher, which is not enabled in normal project config; an explicit Win32 matching-option check (not a native Windows test).

Both constructor resolution and behavior comparisons passed. `npm run test:tooling` now checks resolved version 11.0.3, all tracked nonignored lintable files, effective ignores, representative rules/parsing and default-project behavior in CI. The original lint config, rules, TypeScript config, application/test source and existing browser assertions are unchanged.

CI adds full/production audits and the tooling guard alongside all original checks. No severity filtering, advisory suppression, disabled rule or removed validation obtains green results. If a future consumer relies on removed APIs or a new glob/configuration changes behavior, reject/rework the override; do not patch application semantics or weaken checks to accommodate it.

## 4. Executed regression evidence

[Timed commands and versions](evidence/2026-11-01-minimatch/commands.json), [frontend logs](evidence/2026-11-01-minimatch/frontend-checks.txt) and [backend logs](evidence/2026-11-01-minimatch/backend-checks.txt) retain actual results. Tests ran in a disposable copy whose [source manifest](evidence/2026-11-01-minimatch/validation-source-manifest.json) matches implementation-commit input bytes. This protects historical checked-in browser evidence from the existing screenshot/report writers. Execution preceded the implementation commit; exact source hashes, not a fabricated earlier commit timestamp, connect them. The two one-time compatibility captures have retained log filesystem times, not exact start/end timers; subsequent guard execution has timed command evidence.

| Check | Actual result |
|---|---|
| `npm ci` (baseline and final clean installation) | PASS |
| `npm audit --json` | **11 Moderate / exit 1 → zero / exit 0** |
| `npm audit --omit=dev --json` | **zero → zero**, PASS |
| `npm ls minimatch --all` and affected-package JSON tree | PASS; every scoped path resolves/dedupes minimatch 11.0.3, no invalid peer/tree error |
| `npm run lint`, `npm run test:tooling`, baseline/override snapshot comparison | PASS; same 30 linted files/configurations and finite-corpus behavior |
| `npm run typecheck`, `npm test`, `npm run build` | PASS; **26 unit/component tests in 5 files**, unchanged app source |
| `npm run test:e2e:mock` | PASS: **24** desktop/tablet/mobile cases |
| `npm run test:e2e:real` | PASS: **12** actual Go–React desktop/mobile cases |
| Existing backend vet/tests/race/build, standard and `devfixture`; fixture boundary | PASS using Go **1.27.3**, despite no backend source change |
| Secret baseline, JS syntax, whitespace and source/evidence checks | PASS; limited scans are not independent security certification |
| Final-head hosted CI | Record exact head/run/jobs in maintenance PR after push; no future success assumed in this record |

[After full audit](evidence/2026-11-01-minimatch/after-audit.json) and [after production audit](evidence/2026-11-01-minimatch/after-audit-production.json) confirm **all original eleven reported findings eliminated in the resolved maintenance candidate**. This is not a claim of zero unknown vulnerabilities or formal O14 completion.

## 5. Remaining review conditions and follow-up

A qualified independent tooling/security reviewer must assess the version-scoped semver override, upstream breaking changes versus actual API use, new dev-only supply-chain node and regression evidence before merge under applicable delivery review requirements. **No such sign-off occurred.** Native Windows and other Node/tooling versions were NOT RUN; macOS Node 22 evidence and the final Linux CI results have their own scopes. Corpus agreement is finite, not universal glob equivalence.

Prefer removing the overrides once reviewed stable upstream parents accept a patched compatible minimatch. Recheck registry/advisories, update the expected-version guard deliberately, validate peers, rerun the same compatibility/audit/regression suite and keep full CI gates. Exact pinned parent scopes and the new audit gate make stale/unsupported dependency changes visible.

PR #17, Supabase projects/credentials, authentication, production/data/schema and Admin bootstrap are untouched. Issue #16 stays open; broader O14 predecessor/accessibility/evidence-retention and independent-review conditions are not resolved by dependency remediation. Merge remains a separate authorized action.
