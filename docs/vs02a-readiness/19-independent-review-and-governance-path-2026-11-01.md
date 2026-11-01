# VS-02A — Independent review path and prospective governance proposal

Prepared 2026-11-01, Asia/Jakarta, against `0b80442f8430753d21e187287ab705a95998dcd5`. **PROPOSAL ONLY / NOT EFFECTIVE.** The current task delegates drafting and GitHub delivery, not amendment adoption, predecessor closure, merge or implementation. This document does not alter normative DP records.

## 1. Current rules and solo-maintainer conflict

The [Decision Registry §9](../DP-01/03-decision-registry.md#9-decision-relations--change-control), [DEL-003/004](../DP-06/04-secure-delivery-and-change-management.md#2-git-ownership-and-future-review-flow), [DR-001/DD-001](../DP-06/03-vertical-slice-backlog-and-acceptance-contracts.md#1-authority-scope-and-shared-gates), [QUAL-002–004](../DP-06/05-implementation-readiness-and-quality-gates.md#2-six-separate-decisions) and [VS01A-CLOSE-001](../DP-06/07-vs-01a-formal-closure-and-acceptance.md) require explicit accountable decisions and applicable review. Later [conditional AG-06 disposition](../DP-01/03-decision-registry.md#16-subsequent-product-owner-ag-06-disposition-2026-10-31-administrative-addendum) qualifies original Draft/Not Approved snapshots; it does not waive independent review or authorize identity implementation.

The PO's earlier [Issue #13 disposition](https://github.com/sipratama/ai-learning-platform/issues/13#issuecomment-6551979025) was conditional on mandatory independent review. The [current predecessor candidate review](../DP-06/08-vs-01a-current-main-closure-candidate-review-2026-11-01.md) records `d12727edc92170dc0bc3c27060786ca37a504b0b`, pending human review and PO DD-001. Fetched `origin/main` is `91080f45e1aba38316eeecca6eeba3f618bd7f3a`; its delta from that candidate is four documentation files, not a new Guest implementation. A reviewer must still identify the exact candidate and disposition relevant later deltas; historical conditions are not erased.

[GOV-AI-001](../DP-01/05-gov-ai-001-ai-assisted-technical-acceptance-proposal.md) remains **PROPOSED / NOT EFFECTIVE / AUTHORITY CLARIFICATION REQUIRED**. Its recommended hybrid Option C permits consideration of only a named eligible Tier A pilot after valid adoption and additional safeguards. Identity/token/roles work remains at least **Tier B**, including when synthetic; mandatory qualified human specialist review is retained by that proposal.

The same maintainer/AI workflow contributed to implementation, tests, documentation and technical assessment. CI, another AI prompt or self-signoff does not remove that authorship conflict. This review is AI-assisted preparation by the same workflow, not an independent human opinion. No rule requires an invented committee; an actual appropriately qualified independent person may cover multiple disciplines if their competence, separation, scope and conflicts are documented.

## 2. Recommended current-policy path — no amendment required

| Step | Required actor/action and completion evidence | Current status |
|---|---|---|
| IR-01 | PO names a real human reviewer independent of material implementation authorship; record qualification for relevant domain/security/QA, affiliations, conflicts, exact scope and evidence access | OPEN — no appointment supplied |
| IR-02 | Reviewer assesses named VS-01A candidate/deltas, actual source/tests/CI, pagination/focus remediations, manual accessibility limitations, dependency findings and preserved artifact bytes; records their own findings and attributable disposition | OPEN — PR #14/#15 review timelines inspected, no review supplied; earlier author/AI records remain distinct |
| IR-03 | Resolve blocking findings and record allowed bounded residuals with owner/milestone; verify retained evidence and dates, then PO separately decides prospective VS01A-CLOSE-001/DD-001 for the exact candidate | OPEN — conditional PO approval is not final closure |
| IR-04 | Independent Go/identity-security specialist reviews [O04/O05/O06](18-o04-o05-o06-decision-records-2026-11-01.md), threat matrix, real proof and missing coverage; relevant frontend/data owners assess their portions | OPEN — PR #17 has no review record |
| IR-05 | PO separately dispositions product/risk choices; human readiness reviewer checks HAND-001/DR-001 and G0–G3 against exact source; only then PO may issue a separately scoped QUAL-002 authorization | BLOCKED — prerequisites incomplete |

A reviewer may be an external collaborator; no message/invitation has been sent on the operator's behalf. Their report must include identity/role, candidate/evidence digests, qualifications/separation, actual review time, coverage/limitations, findings/retests and approve/revise/reject disposition. A signature field prepared by AI stays blank. PO appointment is not the specialist's signed technical conclusion.

Evidence retention is substantive: the predecessor [artifact 13064896022](https://github.com/sipratama/ai-learning-platform/actions/runs/41259647726) was previously reported to expire **2026-11-15 01:08:22 UTC (08:08:22 WIB)**. This task has not re-downloaded or independently hashed that archive. A named evidence owner must retain/verify required bytes and availability before acceptance; metadata alone is not the archive. Earlier manual screen-reader/zoom/browser and target-platform gaps stay visible; no automated accessibility certification is claimed.

## 3. Optional explicit amendment text — prospective and conditional

The recommended action now is the current-policy path above. If the PO instead requests a GOV-AI-001 Option C adoption review, the following is proposed operative wording, **not a decision**. No effective time or amendment authority is inferred from preparing or merging it.

> **GOV-AI-001 applicability amendment, proposed version C1.**
>
> 1. This amendment becomes effective only after a recorded governing authority source establishes power to amend the named reviewer-separation clauses, required concurrence/current material-change reviewer dispositions are complete, applicable external obligations are identified, the exact text/version/digest is expressly adopted, affected normative addenda are authorized and an actual effective UTC time is recorded. If any prerequisite is missing, existing independent human review remains in force.
> 2. A permitted exception is limited to a prospectively named, single VS-01A disposable Guest candidate meeting every Tier A eligibility test in GOV-AI-001. A separate applicability decision must identify its exact SHA, evidence, exclusions, retention/access owner, expiry and permitted residuals. It ends at that candidate's acceptance/rejection, the recorded expiry, or an escalation trigger, whichever occurs first. No indefinite or automatically renewed exception exists.
> 3. The policy adoption requires qualified independent human governance/security review. Candidate assessment requires two disclosed assessment channels prepared against source/evidence with the separation defined by GOV-AI-001, retained disagreements, complete mandatory tests and explicit PO candidate acceptance. A second AI channel is not independent human approval. No historical PENDING field or prior review time is changed; any later reassessment and superseding decision is recorded prospectively.
> 4. Authentication, token trust, Account/role/ownership, Admin bootstrap and other Tier B capabilities remain subject to qualified independent human specialist review. **VS-02A is excluded from the Tier A exception**, including this synthetic identity proof. Tier C/release and all nonwaivable security/privacy/integrity/evidence controls remain unchanged.
> 5. This amendment grants no QUAL-002 implementation, QUAL-004 merge, QUAL-005 deployment, QUAL-006 beta, schema migration, production or real-data authority. Material candidate/dependency/configuration changes, incident, invalid evidence, disputed authority or expired approval suspend its applicability pending a new accountable decision.

| Adoption field | Required value before effectiveness / current disposition |
|---|---|
| Authority source and authorized adopter | Governing source, role, scope, required concurrence and limits: **PENDING**. PO product-policy authority alone does not establish unilateral amendment authority |
| Current-process reviewer disposition | Material-change impact/review/sign-off under Registry §9 and DEL controls: **PENDING** |
| Independent policy reviewer | Identifiable qualified human, separation/conflicts, report and disposition: **PENDING** |
| External-obligation inventory | Accountable owner's applicability assessment/concurrence as required: **PENDING**; no assumption that missing repository references means none exist |
| Exact adopted wording and option | Text/version/digest, A/C/reject/defer choice and rationale: **PENDING** |
| Candidate and time limits | No candidate approved here. If used, explicitly name exact eligible VS-01A revision, prospective applicability time, expiry/review date and triggers: **PENDING** |
| Effective date and evidence owner | Actual adoption/effective UTC time, evidence retention/access owner and receipt locations: **PENDING** |

Affected records needing a separately approved additive adoption/applicability update are Registry §9/§17/§18, Open Decisions §15/§16, DD-001, DEL-003/004, QUAL-003/004, HAND-004 and VS01A-CLOSE-001. Product requirements, API/SEC contracts, QUAL-002/005/006 and GAP statuses are unchanged. Those source files are untouched in this task. Once an adoption is genuinely requested with authority/review evidence, a dedicated narrowly scoped governance PR is appropriate; this PR contains a readiness proposal only.

## 4. Exact pending decisions

O01/O02 remain OPEN; O13 remains OPEN but is not a blocker if current-policy human review is followed. The PO can appoint reviewers without adopting a new policy. An amendment is not a route to remove VS-02A specialist review under this proposal. Choosing, approving or rejecting policy requires an attributable actual instruction; this task requests preparation only. No retrospective human approval, predecessor closure or implementation authorization has been invented.
