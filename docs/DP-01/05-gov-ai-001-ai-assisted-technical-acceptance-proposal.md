# GOV-AI-001 — AI-Assisted Technical Acceptance Governance Amendment Proposal

## A. Metadata and proposal status

**GOV-AI-001 — PROPOSED / NOT EFFECTIVE**

**AUTHORITY CLARIFICATION REQUIRED**

| Field | Record |
|---|---|
| Version / prepared | Proposal v0.1.0 / 2026-10-31 |
| Preparation authority | Current Product Owner task “GOV-AI-001: AI-Assisted Technical Acceptance Governance Amendment Proposal”; drafting only |
| Repository / branch | `sipratama/ai-learning-platform` / `docs/gov-ai-001-acceptance-proposal` |
| Inspected HEAD, local main, merge-base and remote main | `0b91ba9f5840a9201de9ef124418777c2a49cb48` |
| Proposed post-remediation VS-01A review candidate | `0b91ba9f5840a9201de9ef124418777c2a49cb48`; not formally accepted by this proposal |
| Historical accepted implementation reference | `339344e654ea77817ecddf05094d1d55b7bf3865`; its closure decision remains pending |
| Prepared / assessed by | Codex AI; previously involved in implementation, tests, remediation, documentation and review |
| Recommended alternative | Option C, a narrowly bounded hybrid pilot, subject to authority clarification and explicit approval |
| Governance adoption / approver / effective UTC date | **NOT GRANTED / PENDING / PENDING** |
| VS01A-CLOSE-001 / DD-001 | **PENDING SIGN-OFF**, unchanged |

This document proposes a review modality. It grants no waiver, gate PASS, Git permission, slice closure, deployment, beta release or VS-02A implementation. Its register references are discovery aids outside the historically approved snapshots; no AG approval is inherited by this proposal.

## B. Executive decision summary

The proposed framework separates disposable synthetic proof (Tier A), identity/privilege and sensitive-data capability (Tier B), and externally consequential operations (Tier C). It preserves mandatory functional, security, privacy, integrity and evidence requirements while making reviewer independence and accountable decisions explicit.

Recommend **Option C**: first establish amendment authority and obtain a qualified independent human governance/security review of this policy change; then, if validly adopted, permit a named Tier A pilot with two disclosed assessment channels and explicit PO acceptance. A second AI channel adds challenge but is not independent human approval. Tier B/C retain mandatory qualified human specialist review under this proposed option. The pilot initially covers only consideration of the named VS-01A candidate; future increments need renewed applicability decisions and their own DR-001 authorization.

Option A retains current rules. Option B is a broader, strictly eligible Tier A route. None is selected or effective by being recommended. If authority cannot be established, current human sign-off requirements continue.

## C. Existing governance problem

The supplied project context describes a solo-maintained project with substantial AI assistance. This is a constraint on staffing, not evidence that AI has human independence. The same Codex system contributed to both engineering and review; fresh adversarial prompts, repeated tests and successful CI do not remove that conflict or cover every form of assurance.

The original DD-001 requires reviewers and resolved findings. The later, specific VS-01A closure dispositions explicitly require independent human domain/security/quality sign-off before a PO closure decision. Those clauses are effective current requirements. The post-remediation implementation and CI improved the technical evidence, but did not amend the review requirement. Relabeling an AI report, author's comment, merge or CI success as human approval would create circular self-certification.

## D. Authoritative references and affected clauses

References below identify the source path, exact section/IDs and whether the proposal would affect its review wording. Original Draft/Not Approved metadata is interpreted with later named dispositions, not silently rewritten.

| Ref | Source and exact section / IDs | Effect or retained boundary |
|---|---|---|
| R01 | [Decision Registry](03-decision-registry.md), §9 ID/change control; §§11–16 approval dispositions; §17 VS01A-CLOSE-001 | §9 approval/reviewer-sign-off path must be satisfied; §17 human-review conditions need explicit prospective supersession for any eligible candidate. AG-01 remains Approved for DP-01 v0.1.2; AG-02–AG-06 remain Conditionally Approved for their named snapshots. |
| R02 | [Open Decisions Register](04-open-decisions-register.md), §7 workflow; §§9–14 subsequent dispositions; §15 closure-pending rows | Workflow requires explicit PO decision and historical preservation. §15 human sign-off/PO closure conditions require a later applicability disposition; GAP-001/002/003/007 remain Open. |
| R03 | [Decision Registry](03-decision-registry.md), §2 D-009/010/021 and PO-CLAR-D010-Q001/PO-CLAR-D021; [MVP Scope](02-mvp-scope-baseline.md), §2 Committed MVP capabilities | Guest-first/free flagship, discovery/search/filter; no new recommendation or premium requirement. D-021's historical wording is qualified by its current clarification. |
| R04 | [Domain Rules](../DP-02/02-domain-rules-and-invariants.md), RULE-006/007/009/020/024–027; [acceptance criteria](../DP-02/05-acceptance-criteria.md), AC-001–005/039–041/045–046 | Free public reading and local practice remain distinct from authenticated, Go-owned official state. No behavioral amendment. |
| R05 | [Permissions](../DP-02/03-user-journeys-and-permissions.md), §5 PERM-001–013; [UX](../DP-02/04-ux-and-interaction-specification.md), UX-001–007/014–015 and §2 states | Ownership, trusted Admin bootstrap, safe error/recovery, keyboard and accessible state requirements retained. |
| R06 | [Architecture](../DP-03/01-architecture-overview.md), §§1–3; [modules](../DP-03/02-module-boundaries-and-dependencies.md), MOD-001–003/006–011 and dependency rules | Supabase identity, Go business authority, PostgreSQL authoritative persistence and owner ports remain; a browser or AI report grants no business authority. |
| R07 | [API contract](../DP-04/01-api-contract-and-resource-design.md), API-C01–14, API-001–006 and §4 public-read addendum; [security](../DP-04/02-authentication-authorization-and-security.md), §§1–3 SEC-001–024 | No API/security contract amendment, including SEC-011/014/017/020. Tier A's in-memory exception is development-only. |
| R08 | [Test strategy](../DP-05/01-test-strategy-and-risk-based-coverage.md), §§3–5; [functional scenarios](../DP-05/02-functional-integration-and-e2e-verification.md), FT-001–005/020 | Evidence fields, actual execution and required scenario coverage retained. |
| R09 | [Security verification](../DP-05/03-security-privacy-and-abuse-verification.md), §§2–4 ST-001–021 and VS01A-N01–N17; [validation](../DP-05/04-performance-accessibility-and-usability-validation.md), §5 VAL-012–015 | Negative testing and manual/automated accessibility boundaries retained; no blanket WCAG waiver. |
| R10 | [Release gates](../DP-05/05-release-evidence-and-go-no-go-criteria.md), §§2–5 REL-001–012, GATE-001–007, EXC-001; [defect management](../DP-05/06-verification-traceability-and-defect-management.md), §4 DEF-001–007 | All hard gates and separate beta decision retained. EXC-001 is not a development human-review exemption. |
| R11 | [Roadmap](../DP-06/01-implementation-roadmap-and-dependencies.md), §§3–5; [backlog](../DP-06/03-vertical-slice-backlog-and-acceptance-contracts.md), §1 DR-001/DD-001, §2 VS-01A/02A, §5 VS01A-FX-001 | Review-modality clarification would need an approved addendum to DD-001. No dependency, readiness, implementation authorization or production-persistence change. |
| R12 | [Delivery controls](../DP-06/04-secure-delivery-and-change-management.md), DEL-001–005/009–017/018–021 | DEL-003 reviewer roles and DEL-004 review confirmation need conditional alignment; change control, Git ownership, security/privacy and migration safeguards remain. |
| R13 | [Quality gates](../DP-06/05-implementation-readiness-and-quality-gates.md), §2 QUAL-001–006, §3 QUAL-007–017 and §4 beta boundary | Proposed modality affects QUAL-003 and review confirmation in QUAL-004 only where explicitly adopted; all gate outcomes and applicable evidence duties remain unchanged now. |
| R14 | [Handoff](../DP-06/06-execution-traceability-and-handoff-register.md), HAND-004 and §§5.1/5.4/5.5 | Later addendum would distinguish candidate revision, permitted review modality and formal acceptance; existing pending rows remain historical. |
| R15 | [VS-01A closure](../DP-06/07-vs-01a-formal-closure-and-acceptance.md), §§1/3–8, particularly §§5/5.1 and §8 checklist | Explicit human sign-off, decision fields, transitions and exclusions need a traceable later applicability decision, never silent deletion. |
| R16 | [Remediation report](../vs01a-remediation/2026-10-31-pagination-recovery-and-e2e-stability.md), §§B–M and R–T | Evidence of AI-F01/F02 correction and local repetition; its pre-push CI NOT RUN statement remains true for its historical preparation time. New hosted evidence is recorded in §M below. |

Three short source clauses establish the authority boundary:

> Material changes require a new approved decision/change record, impact analysis, reviewer sign-off, and updates to dependent requirements/tests/roadmap.

R01 §9. This amendment is material review-governance work, not DEL-007 editorial correction.

> Product Owner resolves policy questions.

R12 DEL-003. This names a policy role but does not explicitly waive other review conditions.

> A role may be held by the same person only if governance permits, but sign-off responsibilities remain explicit.

R10 §5. Conditional role co-location is not a grant of independent-review exemption.

## E. Amendment authority analysis

**AUTHORITY CLARIFICATION REQUIRED.** The repository names the PO for product-policy decisions, AG dispositions and final slice/release decisions. R01 §9 and R02 §7 prescribe material change approval, impact review, reviewer sign-off and auditable recording. They do not provide a complete governance-amendment delegation matrix or expressly permit the PO alone to remove the current independent-human requirement. This task authorizes proposal drafting only.

| Question | Evidence-based answer / unresolved action |
|---|---|
| Who approves governance changes? | PO is the named policy decision maker; the applicable material-change reviewer/sign-off and any additional authority must also be established. No separate governance board is identified in the inspected documents. |
| May the PO amend this specific human-review condition unilaterally? | Not established. Obtain a traceable authority clarification identifying the governing source, role, scope, required concurrence and any limits. A generated approval paragraph cannot supply it. |
| External requirements or stakeholders? | The inspected repository does not establish a complete inventory of binding organizational, contractual, legal or external assurance obligations. Absence from the repo is not proof of absence. PO must identify applicable obligations and obtain required authorized stakeholder concurrence; specialist advice where needed. No statutory claim or waiver is made here. |
| What is nonwaivable? | Existing applicable security/privacy/data-integrity controls and release hard gates in R07–R10. Neither PO risk acceptance nor this proposal can override them. FA-006/B1 targets remain PO policy, not invented legal requirements. |
| How does adoption become effective? | Only after authority is resolved, the existing material-change review is satisfied, explicit approval and applicability are recorded, affected normative addenda are authorized/completed, and an actual effective UTC date is recorded. No approval by silence, CI, merge or this task. |
| Can existing implementation be assessed? | Yes, prospectively if a valid adoption decision expressly permits reassessment of a named already-implemented candidate. Historical decisions, test times and approvals are not backdated. |
| Who provides additional assurance? | Appropriate reviewer(s) under current change control. Option C additionally proposes independent human governance/security review of adoption; that extra safeguard is a recommendation, not a fabricated existing universal rule. A reviewer assesses evidence and cannot invent amendment authority. |

Recommended decision path: document the authority source and obligations; obtain current-process reviewer dispositions; use a qualified human separate from policy/implementation authorship for the proposed Option C adoption review; then obtain the authorized governance decision and PO's explicit choice. If authority remains disputed or no valid approval path exists, defer adoption and retain Option A. Reviewing this amendment alone does not sign off the VS-01A implementation.

## F. Scope and exclusions

The framework concerns how technical evidence is assessed and accepted for an explicitly named slice. It changes no product entitlement, module owner, API, data policy, security requirement, production topology or open GAP. Highest applicable tier wins; synthetic data alone cannot downgrade an identity, privilege or official-evidence change to Tier A. Unknown classification means pending clarification, not presumed eligibility.

Tier A excludes real personal data; authentication or authorization/role/bootstrap capability; protected or private Storage access; official participation, enrollment, grades, progress or completion; authoritative business transactions; destructive real-data actions; production migrations/access/deployments; public beta; and any external obligation requiring human assurance. Synthetic domain-authority or privacy-lifecycle changes are at least Tier B. Real data or externally consequential operations add Tier C controls, even for nominally public read-only UI.

Under recommended Option C, the initial exception is a one-candidate pilot for VS-01A at the §A SHA, not blanket permission for all Tier A work. Broader applicability requires a subsequent explicit decision. All implementation still requires its own DR-001 and PO authorization.

## G. Tier A/B/C assurance framework

**All entries are proposed controls, not current permissions or gate results.** Option A keeps existing human review for every tier. Option B would permit its narrower stated substitution only in Tier A. The table specifies the recommended Option C controls.

| Dimension | Tier A — disposable synthetic proof | Tier B — identity, privilege and sensitive-data capability | Tier C — production/external consequence |
|---|---|---|---|
| Eligibility | Isolated development/test, synthetic content, no authority-bearing state, public-read-only/local ungraded behavior, bounded reversible effects; every §F exclusion screened. | Synthetic/test identity, roles, ownership, token trust, official-state authority or privacy/deletion capability; isolated environment. | Any real personal data, production/privileged operational access, public beta, consequential migration, destructive real-data action or external obligation. |
| Mandatory evidence | §I dossier, adversarial assessment, applicable functional/security/accessibility negatives, exact-candidate hosted CI, risk ledger and fixture/artifact exclusion proof. Second assessment channel for the pilot. | Tier A evidence standard plus threat model/trust and data-flow diagrams, provider configuration, negative auth/owner/bootstrap matrix, applicable PostgreSQL/concurrency/audit/lifecycle and rollback tests. | Tier B domain controls plus REL-001–012, applicable GATE-001–007, candidate/config/artifact provenance, production-like drills, alert/rollback/restore readiness, privacy and FA-007/beta measurements where applicable. |
| Reviewer separation | AI conflict disclosed; second channel prepares a separate challenge from source/evidence before seeing first conclusions. PO alone records the accountable acceptance decision after effective policy permits it. AI-to-AI separation is not human independence. | At least one relevant qualified human specialist separate from implementation authorship; AI assists but cannot fill that independent human role. PO remains accountable. | Independent qualified human engineering/security/privacy/operations assurance appropriate to scope, separate from authorship, plus required external reviewer/authority. AI self-review alone insufficient. |
| Human escalation | Any §K trigger; unresolved classification, weak evidence, meaningful assessor disagreement, material security/integrity uncertainty or required external assurance ends eligibility. | Specialist review mandatory; escalate provider/trust, cross-account, lifecycle, destructive/data compatibility and unresolved findings to the relevant discipline. | Specialist/operations review mandatory; external/privacy/contract stakeholders as required; missing authorization or recovery proof prevents action. |
| Decision authority | Established governance authority adopts policy; PO explicitly accepts/rejects named candidate only after eligibility and evidence duties. No delegated AI acceptance. | PO grants separate scope authorization and acceptance after required specialist dispositions; governance changes use §E. | Separately authorized release/operations authority and PO, plus any required stakeholder concurrence; slice acceptance cannot grant release permission. |
| Status vocabulary | Modality `ELIGIBLE FOR TIER A` or `INELIGIBLE/ESCALATE`; assessment `COMPLETE/INCOMPLETE`; recommendation `TECHNICAL PASS/CONDITIONAL/BLOCKED`; formal outcome only by §L. | `TIER B — HUMAN REVIEW REQUIRED`, then `REVIEW PENDING/COMPLETE`; same technical recommendation vocabulary; formal outcome only by §L. | `TIER C — RELEASE REVIEW REQUIRED`; existing `Go/Conditional Go/No-Go` only within actual authorized release procedure, never an AI declaration. |
| Nonwaivable controls | Applicable §J controls, evidence truthfulness, isolation, no secret/answer leak or official-state fabrication; no requirement reclassified away merely to obtain Tier A. | All applicable §J identity/owner/authority/lifecycle controls; no Critical/High finding accepted through a lower-tier exception. | All applicable §J and GATE-001–007; external requirements, authorized operations and production/beta approval remain separate. |
| Expiry/reassessment | Bind to exact SHA/fixture/dependencies/config and a PO-specified review date/expiry. Pilot ends on named candidate decision or earlier expiry/trigger; another candidate needs renewed applicability. | Reassess material code/provider/key/role/lifecycle/schema/config/dependency change, incident or expired specialist disposition; do not carry review across an unassessed trust-boundary change. | Reassess each candidate/environment/config, data migration, material operational change or incident; approvals expire under explicitly recorded release conditions. |

Proposed technical recommendations do not replace DD-001. A `CONDITIONAL` recommendation leaves each condition explicit; it cannot become formal acceptance while a mandatory condition, Critical/High finding or required evidence is unresolved. Missing/blocked/unrun evidence remains visible. Current formal status is unchanged by this vocabulary.

## H. Reviewer roles and independence limitations

| Role | Responsibility / separation |
|---|---|
| Implementer | Produces code, tests and implementation evidence; discloses contributions and unresolved assumptions. May be AI-assisted. |
| AI technical assessor | Examines source and actual evidence adversarially; identifies findings/limits; has no approval authority. **Codex is an AI system and may have assisted the implementation.** |
| Human independent reviewer | Identifiable qualified human separate from material authorship of the reviewed change; directly assesses source/evidence, conflicts and applicable controls and records their own auditable disposition. No invented identity or signature. |
| Product Owner | Owns scope, residual-risk decisions where allowed, exact-candidate acceptance and explicit implementation authorization; is not automatically an independent reviewer if involved in implementation. |
| Governance decision authority | The role whose power to amend the named requirements is established under §E, including required concurrence. This may include the PO if supported by authority evidence; that capacity is not assumed. |

Required conflict procedure: identify contributors, assessor/model/tool/channel, organizational relationships, prior implementation/testing/documentation involvement and evidence access; record the scope and limitations before conclusions; obtain a fresh challenge against approved sources and candidate; preserve both assessments and disagreements; escalate under §K; have the authorized human decision maker issue their own decision. AI-drafted decision text remains a draft until that actor explicitly adopts it through a verifiable channel.

A fresh Codex review is not independent human review. AI-generated approval wording is not a human signature. A second model/vendor/context can share blind spots and must be labeled non-human where applicable. Repetition/CI increase confidence for covered behavior but do not replace threat judgment, accessibility observation, operational assurance or required independence. Unresolved Critical/High findings block acceptance; severity follows DEF-001, separately from P0/P1/P2 priority.

## I. Evidence and traceability requirements

Retain the R08 §5 execution contract. Each applicable evidence item must identify EVD/scenario/requirement IDs, actual executor/reviewer, exact build/source/artifact/config identity, environment, fixture/policy/dependency/tool versions, UTC execution time, expected/actual result, result disposition, redacted artifact location/checksum or immutable reference, defect/condition owner and retest. No execution ID is allocated for this proposal's non-executed application tests.

Additional proposed dossier fields: tier rationale and exclusion checklist; implementation/assessor conflict statement; source-to-AC/API/SEC/FT/ST/VAL coverage; all failed, blocked and unrun cases; security/privacy/data impact; dependency/secret provenance; second-channel challenge and disagreements for Option C; findings and permitted residual-risk owner/mitigation/review date; human-review applicability; and distinct policy approval, candidate acceptance, Git, deployment and beta references.

CI evidence must bind to the exact candidate SHA and required job/step outcomes. A workflow file or green unrelated revision is insufficient. Evidence carried from another revision needs explicit source/config/dependency equivalence analysis; it is labeled historical and cannot be silently represented as a new run. Retain failures and focused repetitions, recording retries; a successful rerun never deletes a failure.

Artifacts must be readable and checksum-verifiable at decision time, with redaction, access controls, owner and retention plan. An expiring URL or artifact metadata alone is not retained evidence. Preserve/export before expiry and verify the destination and checksum. No new universal retention duration is invented here; the approver must set the required evidence review/retention terms before adoption, consistent with existing privacy policy. Loss, tampering or unavailable mandatory evidence stops acceptance pending reconstruction/reverification. Source and model/tool disclosure must not include secrets or private prompts containing personal data.

## J. Nonwaivable controls

The amendment cannot downgrade the following applicable controls. Applicability is documented against actual scope, not used as a waiver. Absent capabilities may be `NOT APPLICABLE` with evidence of their absence, never fabricated PASS; adding them triggers reclassification.

| Control | Existing authoritative IDs / required boundary |
|---|---|
| Trusted identity and active account | SEC-001–005/023, MOD-001: configured signature/algorithm/key, issuer, audience, exp/nbf and rotation/outage fail-closed behavior; issuer/subject linking; deleting-account access denied despite a valid provider token. |
| Ownership, privilege and bootstrap | SEC-006–010, PERM-003–013: Go-owned role/owner checks, no client self-escalation, nonpublic authorized audited Admin bootstrap, no cross-account access. GAP-dependent positive behavior remains blocked. |
| Public/draft/answer isolation | SEC-011/014, API-001–005, ST-008, VS01A-N01–N06: allowlisted published/free projections, correct membership/version context, no private draft/answer/media exposure. |
| Official evidence/data integrity | SEC-012/013, RULE-007/009–019, GATE-002: no browser/AI-created official proof, one active Attempt, locked/pinned versions, immutable result and authoritative transaction/concurrency checks where implemented. |
| Tokens, secrets, content and transport | SEC-015–020/023: least privilege and environment isolation, no privileged browser credential, safe Markdown/media/input/cursors, relevant CORS/CSRF/TLS/rate controls, safe correlation/error/log surfaces. |
| Privacy/deletion/restore | SEC-005/021/022, FA-006/B1, GATE-005: minimization, own-request restriction, durable retry/reconciliation, individual deletion/de-identification, no restore resurrection; 30-day active/backup and 180-day minimized audit targets retained with only existing permitted exceptions. |
| Audit and supply-chain integrity | SEC-021/024, DEL-013–017, REL-001/003/012: auditable privileged operations, truthful evidence, restricted CI/deploy privilege and artifact provenance; no fabricated reviewer or hidden failing test. |
| Critical functional/accessibility quality | GATE-001/004/006, AC/FT/VAL contracts: acceptable executed critical evidence, no unresolved Critical/High findings or critical usability barrier; automated scans alone do not establish WCAG compliance. |
| Authorized release and recovery | QUAL-005/006, DEL-005/018–021, REL-001–012, GATE-001–007: separate candidate/environment deployment and beta decisions, required recovery/drills and applicable FA-007 criteria. |

EXC-001 remains the existing limited-beta exception route for explicitly nonblocking deviations, with its independent quality/security confirmation and authorized decision. It does not waive hard gates, supply Tier A adoption authority, or create a blanket accessibility/security exception. This proposal introduces no broader risk-acceptance loophole.

## K. Human escalation triggers

Require qualified human specialist review and pause the lower-assurance acceptance path when: identity/token/key/account linking, role/owner/bootstrap, private Storage, official learning authority, personal-data handling/deletion/retention/restore, material security policy, schema/evidence compatibility, or deployment/privileged operational scope is introduced or materially changed. All Tier B/C candidates require that review under the proposed framework.

Also escalate any Critical/High finding; suspected hard-gate failure; relevant new vulnerability; material unsafe-content/secret/answer exposure; inability to prove isolation; missing or contradictory evidence; an unresolved meaningful disagreement between assessment channels; assessor conflict not covered by an effective policy; unknown authority or external obligation; critical keyboard/screen-reader/usability barrier; or incident/regression that undermines an earlier assessment. If impact cannot be classified safely, human triage precedes acceptance. PO risk acceptance cannot convert a hard-gate failure into eligibility.

## L. Product Owner decision procedure

This is a proposed future procedure. All fields remain unfilled in this document.

1. Establish authority and obligations under §E; identify required reviewer(s) and any additional stakeholder. Preserve current rules until this is resolved.
2. Record explicit selection of A/B/C, the exact approved proposal version/digest, scope, rationale, role separation, pilot limits, evidence retention/review terms, expiry and actual effective UTC date. Record rejections, dissent and conditions. A conditional intention is not effective adoption while prerequisites remain unmet.
3. Authorize a separate documentation adoption change that states the exact clauses superseded, preserves original snapshots and synchronizes §U. Adoption becomes operational only after its required conditions and normative addenda are complete; a proposal merge is insufficient.
4. For a candidate, record named SHA, tier/exclusions, source baseline, evidence ledger, conflicts, required specialist/second-channel dispositions, unresolved conditions and bounded residual-risk decisions. Distinguish evidence compilation from the human decision.
5. Record an explicit candidate outcome: accept, reject or defer. Only a validly authorized, fully evidenced accept decision can later support formal DD-001 PASS. No AI verdict grants that status. An interim `READY FOR PO DECISION` is permissible only when every mandatory prior condition is actually satisfied under then-effective rules.
6. Keep implementation authorization, PR/merge, deployment, beta and subsequent-slice decisions separate. PO retains Git control under DEL-001.

Suggested decision form: decision ID/version; authority source and concurrence; option and approved text digest; applicability/exclusions; reviewer identities/roles/conflicts and disposition references; evidence/candidate identity; permitted residual risks with owner/review date; conditions; actual decision/effective UTC timestamps; reversibility/expiry; and explicit statement of actions not authorized. Leave absent fields `PENDING`; never fill human names/signatures by inference.

## M. Applicability to VS-01A

### M.1 Implementation and execution lineage

| Evidence | Freshly inspected fact / limitation |
|---|---|
| [PR #4](https://github.com/sipratama/ai-learning-platform/pull/4) | Real public Go integration merged as `109e6f5102d333730ed9914e36dd2ce6d6452222`. |
| [PR #5](https://github.com/sipratama/ai-learning-platform/pull/5) | Focus correction merged as historical accepted implementation `339344e654ea77817ecddf05094d1d55b7bf3865`. |
| [PR #6](https://github.com/sipratama/ai-learning-platform/pull/6) | Pending closure documentation merged as `cd40884a9d08bdffcb581846d88142c87e079bc4`; not human/PO acceptance. |
| [PR #7](https://github.com/sipratama/ai-learning-platform/pull/7) | Browser evidence retained at merge `d8c708583b750b0b53f5145ef496716cfc35bbf2`; retention does not grant approval. |
| [PR #8](https://github.com/sipratama/ai-learning-platform/pull/8) | AI-F01/F02 remediation head `60025bb92f405c0b4589a10e020635d95d9110f8` merged as current candidate `0b91ba9f5840a9201de9ef124418777c2a49cb48`. |
| [Merge CI 41211679110](https://github.com/sipratama/ai-learning-platform/actions/runs/41211679110) | Completed successful push run for the exact current candidate, 2026-10-31T14:46:26Z–14:48:52Z (21:46:26–21:48:52 WIB). Backend job `124567809431`, frontend `124567809433`, secret baseline `124567809185`; all listed mandatory steps successful, none failed/skipped/cancelled. |
| [Frontend executed log](https://github.com/sipratama/ai-learning-platform/actions/runs/41211679110/job/124567809433) | **26 unit/component, 24 mocked and 12 real Go+React cases passed**. The hosted run does not execute the report's separate local 20-repeat/three-suite commands. |
| New merge-run browser artifact | Artifact `13046363444`, 2,116,320 bytes, metadata says nonexpired; SHA-256 `25f5c0273bc2dc70999e515318ebf5a15aca4416a47a92f94f3f44ab395126d0`; expiry 2026-11-14T14:48:47Z (21:48:47 WIB). Metadata inspected only in this proposal task: archive not downloaded/rehashed here. Verify and retain accessible bytes before any future acceptance depends on it. |

R16 records the earlier local remediation runs: 20 consecutive focused mobile passes, three full suites at 12/12, 10 focus regressions, repeated actual Go restarts, and retained development failures/corrections. Those are prior executions, not reruns in this documentation task. The earlier AI audit is available in conversation and its privately preserved `prior-audit/logs/audit-disposition.json` summary, whose inspected SHA-256 is `ed7426292d7f95e1e7514b401e370ab91085a6c0f7071f6022695870433b073f`. It recorded AI-F01/F02 and amendment-authority uncertainty, not human approval. Its locator/provenance is through R16 §L; it is not a new committed independent report.

### M.2 Tier A candidacy and conditions

VS-01A is potentially Tier A: one immutable synthetic `vs01a-guest-proof@1.0.0` / `pub-v1` fixture, five public GET endpoints, local ungraded interactions, no official Student state, no production authentication/database or real user data. Standard-artifact exclusion and startup guards bound the fixture. The amendment must not turn this into a production publishing path or infer permission for Student/Admin capability.

AI-F01/F02 are reported technically remediated in R16 and now supported by merged-candidate CI. That addresses those findings' bounded technical disposition, not general security assurance or formal closure. Manual screen-reader testing, broader browsers/devices, synthetic/content coverage and 11 Moderate development-tool advisories remain disclosed limitations requiring explicit owner/risk/follow-up disposition where permitted. No Critical/High or hard-gate issue may be accepted through that residual-risk step. No WCAG, production or beta compliance is inferred.

R16 reports verified private retention of 44 prior audit files and three older hosted ZIPs; PR #7 retains historical browser artifacts in Git. These accounts do not prove indefinite availability of every artifact. Before a decision, the human decision maker verifies the evidence locations/checksums/access and the current merge-run artifact or equivalent retained execution evidence.

Proposed prospective mechanism: validly adopt GOV-AI-001 with explicit eligibility for this exact candidate; complete required second-channel/human-trigger review and the current risk/evidence dossier; then create a new auditable VS-01A closure decision with actual authority, candidate/policy revisions and decision time. It may refer to and prospectively supersede the pending disposition of VS01A-CLOSE-001, while preserving that original entry, its `339344e…` reference and its historical PENDING status. Do not backdate or rewrite the old decision as PASS. No new closure ID or approval is created here. If main advances, assess the new diff/evidence explicitly; the candidate SHA and governance-policy revision are distinct identities.

Until that process completes, **VS-01A remains PENDING SIGN-OFF and is not closed**.

## N. Implications for VS-02A

VS-02A is **at least Tier B**, even with synthetic accounts: its purpose is the identity/privilege/account-lifecycle trust boundary. Any real personal data, production credentials/access, public beta or consequential operational action adds Tier C requirements. Tier A acceptance of VS-01A cannot authorize it.

Proposed readiness/review checklist, for later separately authorized planning and implementation:

- [ ] Verify formal predecessor acceptance and independent DR-001/QUAL-007–009; obtain explicit PO authorization naming VS-02A and its synthetic-only boundary.
- [ ] Map MOD-001/011, API-006, RULE-024/026/027, AC-039–041/045–046 and SEC-001–008/021/023; record nonpublic bootstrap authority and rollback/recovery impact.
- [ ] Threat-model browser → Supabase Auth → Go → internal Account/role/audit; record trusted issuer plus subject linking, audience/key/algorithm selection, expiration/not-before and clock/rotation/outage rules. Do not trust unverified provider defaults or client role metadata.
- [ ] Specify active/restricted/deleting account behavior; a valid old token must not bypass the deletion access guard. Full durable cleanup/restore belongs to VS-06A; no real Student/Admin data before that prerequisite.
- [ ] Verify internal Student/Admin authorization and own-object checks, issuer/subject collision/confusion prevention, cross-account denial and a trusted, nonpublic, explicitly authorized/audited Admin bootstrap. No self-signup role grant.
- [ ] Review isolated synthetic Auth tenant/accounts, per-environment trusted configuration, least-privilege secrets, token storage/transport/log redaction, relevant CORS/CSRF and no browser core-database/service-key bypass.
- [ ] Review Account/audit persistence and migration constraints, provider-link consistency, rollback compatibility and safe failure/retry; require applicable real PostgreSQL evidence, not the VS-01A fixture as proof.
- [ ] Plan and execute FT-005/020, ST-001–006 and applicable ST-011/012/015/016/019/020; cover missing/forged/expired/early/wrong-issuer/audience/key, role tampering, bootstrap replay and deleted-account token reuse with unchanged protected state.
- [ ] Obtain independent qualified human identity/security review under proposed Tier B, resolve findings and capture exact-candidate hosted CI and reviewer dispositions before acceptance; PO decides policy and acceptance separately.
- [ ] Reclassify and obtain Tier C authorization before real-data or externally consequential work; keep deployment/beta decisions separate and GAP-001/002/003/007 unresolved branches blocked.

This is a readiness checklist, not a finding that those controls exist or a VS-02A implementation authorization.

## O. Migration and effective-date strategy

Preserve approved snapshots, original source classifications and later administrative addenda. Use a new approved amendment record that names exactly which review-modality clauses are superseded, for which tiers/candidates, and from what actual effective time. Synchronize future adoption addenda in §U; do not rewrite historical gate tables or suggest AG-01–AG-06 approved this proposal.

The recommended pilot requires a PO-specified expiry/review date before it can become effective; no calendar deadline is invented here. It ends on the named candidate's accept/reject decision or earlier expiry, scope/obligation change, incident or §K trigger. Any subsequent slice/candidate needs a renewed applicability decision; no automatic grandfathering. A previously implemented candidate receives a new prospective assessment/decision after adoption, not retroactive approval of implementation, merge or former missing sign-off. Historical evidence stays tied to its actual revision/time.

## P. Reversal and rollback procedure

On a hard-gate concern, invalid authority, scope escalation, evidence tampering/loss, expired condition or material regression, stop use of the proposed alternate acceptance path for the affected candidate. Record the trigger, actual time, evidence and accountable owner; obtain the authorized withdrawal/supersession decision and revert future review modality to the prior human-review requirement until validly reassessed.

Natural completion of the pilot ends future applicability; it does not automatically invalidate an otherwise valid historical candidate decision. Expired candidate-specific risk conditions, invalid evidence or new findings require their own reassessment and attributable disposition.

Preserve original approvals and dissent; mark affected acceptance reopened/suspended through an authorized new record, never delete it. Reassess downstream predecessor claims and pause ungranted implementation/release decisions. For the disposable proof, discard/reload synthetic state and cursor key if needed. Policy reversal is distinct from application rollback; do not automatically reverse irreversible personal-data deletion, evidence changes or migrations. Any production response follows authorized incident/recovery and DEL-018–021 controls.

## Q. Risks and tradeoffs

| Risk / tradeoff | Proposed mitigation / residual limitation |
|---|---|
| Correlated AI errors and weak independence | Disclose prior work, use source-based adversarial and second-channel challenges, retain disagreements, escalate material uncertainty; multiple AI outputs remain non-human. |
| PO conflict and circular certification | Establish amendment authority separately; human policy review in Option C; auditable PO decision and scope/expiry; no AI approval authority. |
| Tier A scope creep | Explicit exclusion checklist and highest-tier rule; bind the pilot to one SHA; reassess before additional candidates. |
| Green tests masking omissions or flakes | Keep negative tests, failed executions, test-assertion review and coverage gaps; repetitions are bounded evidence, not a proof of absence. |
| Missing human accessibility/operational observation | Keep NOT RUN visible and require appropriate review before the milestone that depends on it; block critical barriers, do not claim full WCAG/production readiness. |
| Dependency/adversarial-content risk in public reads | Preserve relevant security gates and dependency dispositions; no assumption that synthetic or read-only means harmless. |
| Artifact expiry and local-only evidence | Verify retained bytes/checksums/access and assign retention owner; local private copies do not establish off-device backup or durable public availability. |
| Cost and feasibility | Option C adds a one-time policy review and second-channel work but avoids pretending every disposable increment needs a staffed human panel; Tier B/C specialist cost remains deliberate. If unavailable, retain current rules rather than invent approval. |

## R. Proposed exact policy wording

**The following text is proposed only. Its normative verbs apply solely after valid adoption under §E/L/O and the explicit option chosen by the authorized decision maker.**

1. GOV-AI-001 governs review modality only. It does not waive applicable functional, security, privacy, data-integrity, evidence, accessibility, implementation-authorization, deployment or beta requirements. Requirements and open GAPs retain their existing authority.
2. A candidate SHALL be assigned the highest applicable assurance tier using §§F–G. Unresolved eligibility or authority SHALL remain pending. Identity/privilege/official-state and privacy-lifecycle capabilities SHALL NOT use Tier A merely because their fixtures are synthetic.
3. The authorized governance decision SHALL identify approved text/version, authority source/concurrence, selected option, candidates, scope/exclusions, required review separation, retention, expiry and actual effective time. Proposal preparation, documentation merge, repeated tests and CI SHALL NOT constitute adoption.
4. Under Option A, existing independent human sign-off SHALL remain for all candidates. Under Option B, only explicitly eligible Tier A candidates MAY substitute disclosed AI technical assessment plus explicit PO acceptance for the named development-slice human-review condition, after all applicable evidence and escalation requirements are satisfied. Tier B/C SHALL require qualified independent human specialist review and their separate authorization gates.
5. Under Option C, the substitution in clause 4 SHALL additionally require independent human governance/security review of adoption, an explicitly named one-candidate pilot, and a separate second assessment channel. The second assessment SHALL examine approved source/candidate evidence before receiving the first assessment's conclusions and SHALL preserve conflicts and disagreements. An AI second channel SHALL NOT be described as independent human review. The initial candidate is only the VS-01A revision expressly named in the eventual adoption/applicability decision; this proposal names no effective exception.
6. An AI assessor SHALL disclose AI identity, model/tool/channel where known, implementation/testing/documentation contributions, methods and limitations. It SHALL NOT assign itself governance authority, fabricate a human identity/signature, accept PO risk, change gate status or authorize another slice.
7. Every candidate SHALL retain the §I evidence dossier, actual exact-candidate required hosted CI outcomes, negative tests, failures/retests, unrun coverage and attributable reviewer/decision records. Artifact metadata alone SHALL NOT be described as preserved execution bytes. Unresolved Critical/High findings, applicable hard-gate failures or missing mandatory evidence SHALL block acceptance.
8. Tier A eligibility SHALL end when a §K trigger applies. Tier B/C SHALL obtain the relevant human specialist dispositions; externally imposed assurance obligations SHALL be honored by their authorized parties. PO risk acceptance SHALL NOT override a nonwaivable control or invent an exception path.
9. The PO's candidate acceptance SHALL be explicit, attributable and separate from technical recommendations and amendment approval. Formal DD-001 PASS SHALL require all then-effective mandatory conditions and a separately recorded authorized candidate decision. No technical PASS or proposal status SHALL close a slice.
10. Deployment, production access, migrations and beta SHALL remain subject to QUAL-005/006, DEL controls and DP-05 release gates. Accepting a Tier A predecessor SHALL NOT authorize VS-02A or satisfy its DR-001.
11. Already-implemented work MAY be reassessed only by explicit prospective applicability to a named revision after policy effectiveness. Prior decisions and their original PENDING status/time SHALL be preserved; any later superseding decision SHALL be a distinct auditable record. No backdated approval is permitted.
12. The alternate modality SHALL be withdrawn/reassessed under §P on expiry, invalid authority/evidence, material change, incident or escalation trigger. Future applicability SHALL revert to existing human-review rules until a valid new decision exists; no automatic irreversible data rollback is authorized.

## S. Open questions and decision options

### S.1 Alternatives

| Criterion | Option A — retain strict human-independent review | Option B — risk-tiered AI-assisted acceptance | Option C — hybrid conditional pilot (recommended) |
|---|---|---|---|
| Assurance / independence | Existing human separation remains; human review quality still depends on expertise/evidence. | Tier A loses human independence explicitly; AI evidence plus accountable PO decision only after valid amendment. | Human review of governance plus two disclosed assessment channels; per-candidate AI channels still not human independence. Human specialist review for B/C. |
| Cost / solo feasibility | Highest recurring reviewer coordination; no alternate route if unavailable. | Lowest recurring eligible Tier A review cost, with more residual correlated-error/PO-conflict risk. | Intermediate cost: one-time policy review, second channel and narrow pilot; more feasible than a permanent multi-role panel but not zero human involvement. |
| Auditability / security | Existing trail and specialist controls; no review-modality change. | Exact eligibility/evidence/PO records essential; broad adoption raises classification/exception pressure. | Narrow exact-candidate scope, retained challenges/dissent, expiry and human escalations reduce but do not eliminate that pressure. |
| VS-01A closure impact | Requires currently mandatory human implementation sign-off and explicit PO acceptance. | A future eligible prospective decision could use substituted review, only after authority/adoption and all conditions. No immediate closure. | Future named pilot could support prospective acceptance after policy review, second channel, eligibility/risk/evidence and PO decision. No immediate closure. |
| VS-02A impact | Current independent-review/readiness duties persist. | Tier B minimum; no Tier A shortcut; human specialist review and explicit implementation authorization. | Same Tier B/C boundary, with a deliberate specialist checkpoint before identity/privilege acceptance. |
| Approval needed now | PO may retain existing approach; no waiver assumed. | Full §E material-change authority and adoption required. | Full §E adoption plus the additional human policy-review and pilot controls required. |

Recommend C because current evidence supports a narrow disposable proof while the author/assessor conflict and amendment authority remain material uncertainties. A provides the strongest continuity with current governance. B is a legitimate alternative to discuss, but broader eligibility creates more reliance on the PO's classification and correlated AI assessment. This recommendation does not select an option.

### S.2 Questions requiring explicit disposition

- Who holds authority to amend this particular reviewer-separation condition, on what source, and whose concurrence is required? **AUTHORITY CLARIFICATION REQUIRED.**
- Do organizational, contractual, legal or external assurance obligations constrain the proposal, and who can verify/approve their disposition?
- Which qualified independent human reviewer can assess adoption under Option C, with what conflict disclosure and scope? Reviewing this policy alone does not sign off code.
- What qualifies as the second assessment channel, who supplies it, and how are independent preparation and disagreements recorded without overstating human independence?
- What exact candidate/pilot scope, expiry/review date and evidence-retention/access owner will be approved? No unspecified date or unbounded exception is implied.
- What permitted dispositions and follow-up milestones apply to manual screen-reader/browser gaps and Moderate development-tool advisories? What additional evidence is required before deciding the current candidate?
- Who verifies the retained local evidence and current merge-run artifact bytes before candidate acceptance, and how is later loss handled?

## T. Product Owner approval checklist

All boxes are intentionally unselected. Completing this drafting task checks none of them.

- [ ] Establish amendment authority, required concurrence and external-obligation inventory; do not use this proposal as its own authority source.
- [ ] Review exact affected clauses and confirm security/privacy/integrity and release controls are preserved.
- [ ] Select A, B, C or reject/defer; record exact wording/version/digest, rationale, conditions and dissent.
- [ ] Obtain required current-process reviewer dispositions and, for recommended C, qualified independent human governance/security review.
- [ ] Define second-channel qualification/separation, named candidate/pilot, expiry and evidence-retention/access ownership.
- [ ] Explicitly authorize subsequent adoption-document updates; record actual approval/effective UTC dates only when events occur.
- [ ] Separately decide prospective VS-01A applicability, verify current SHA/CI and available retained evidence, and dispose of residual risks where permitted.
- [ ] Separately make any candidate DD-001 decision after all effective mandatory conditions are satisfied.
- [ ] Keep Git operations, implementation, deployment, beta and VS-02A decisions separate; preserve historical PENDING entries and open GAPs.

## U. Follow-up documentation only after valid approval

This proposal task changes only this document and additive proposal references in the two DP-01 registers. The following are future adoption work requiring separate authorization; none is performed now.

| Document | Later required update if the selected option is validly adopted |
|---|---|
| R01 Decision Registry | Record actual authority clarification, selected option, approved version/digest, effective time and precise prospective supersession. Preserve §9 and original §17 history. |
| R02 Open Decisions Register | Record the actual proposal decision and unresolved conditions; add later candidate applicability/disposition without overwriting §15 or AG/GAP rows. |
| R11 DP-06 backlog | Add approved DD-001 review-modality applicability and tier boundaries; keep DR-001 and source/test requirements. |
| R12 DP-06 delivery | Align DEL-003/004 review roles/confirmation with the approved exception; preserve DEL-001/005/011 and secure delivery/migration rules. |
| R13 DP-06 quality gates | Add explicit conditional modality for QUAL-003/004; preserve QUAL-001/002/005–017 obligations and all historical outcomes. |
| R14 DP-06 handoff | Add approved modality, exact candidate/evidence and new decision references to HAND-004/EXEC-001 lineage; do not infer predecessor clearance. |
| R15 VS-01A closure | Add the new prospective decision/evidence after required approvals; preserve original accepted SHA, PENDING sign-off fields and historical ledger. |
| R16 remediation / earlier evidence | Preserve original reports and execution records; reference newer hosted CI through a new dated record rather than editing old NOT RUN statements. |
| R08–R10 DP-05 | No security/release requirement change proposed. Add cross-references only if needed and authorized; changing evidence, EXC-001 or release-review rules would require separate impact analysis/change control. |

**Final proposal status: GOV-AI-001 — PROPOSED / NOT EFFECTIVE. AUTHORITY CLARIFICATION REQUIRED. VS01A-CLOSE-001 and DD-001 remain PENDING SIGN-OFF. VS-02A remains NOT AUTHORIZED.**
