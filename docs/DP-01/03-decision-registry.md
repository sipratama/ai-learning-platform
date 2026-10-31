# DP-01 — Decision Registry

| Metadata | Nilai |
|---|---|
| Package | DP-01 — Traceable Product Baseline |
| Artifact | Decision Registry |
| Version | 0.1.5 — subsequent administrative governance synchronization |
| Status | **Approved product baseline v0.1.2; v0.1.3–v0.1.5 record later governance decisions** |
| Approval gate | AG-01 — **Approved for v0.1.2 by current Product Owner approval** |
| Revision boundary | v0.1.2 product substance approved; v0.1.3–v0.1.4 record prior governance; v0.1.5 records AG-03 conditional approval, FA-006-B1 B and FA-008 B without changing that substance |
| Prepared | 2026-10-31 |
| Source basis | Project conversation recap and reported user selections; current Product Owner clarifications and explicit AG-01-EG-B, AG-01, FA-004/005, AG-02 and FA-006 B dispositions |

> **Historical-evidence caution.** Ini **bukan transkrip asli** atau pengakuan bahwa sumber primer seluruh keputusan telah diverifikasi. Repo ini tidak menyertakan catatan persetujuan primer atau tautan sumber per keputusan; riwayat Git dokumen draft bukan bukti wording keputusan asli. `R` dan `P` tetap bersandar pada ringkasan; baris `U` mempertahankan klasifikasi laporan pemilihan langsung dari konteks sebelumnya, tetapi sumber primernya juga tidak tersedia di repo ini. Disposisi Product Owner saat ini dicatat terpisah sebagai `C`, bukan sebagai bukti wording historis. Tidak ada rationale, timestamp persetujuan, atau detail opsi yang direka.

## 1. Status & evidence legend

**Decision status**

- **Approved (reported)**: riwayat proyek menyebut keputusan sudah dipilih; wording historis baris `R` tetap belum terverifikasi. AG-01-EG-B sendiri menerima disposisi prospektif tanpa memverifikasi sumber primer atau memberikan persetujuan AG-01.
- **Approved (direct)**: pilihan disampaikan eksplisit oleh user dalam percakapan yang tersedia.
- **Approved (current clarification)**: klarifikasi Product Owner yang dicatat saat remediasi DP-01; tidak membuktikan wording historis ID yang diklarifikasi.
- **Approved (current disposition)**: persetujuan eksplisit Product Owner saat ini, dicatat tanpa menyatakan bukti wording historis.
- **Requires ID confirmation / Requires Confirmation**: mapping atau isi historis belum terbukti; bukan pernyataan approved per-ID.
- **Open**: belum diputuskan, bukan approval.
- **Superseded**: hanya digunakan bila penggantian eksplisit terbukti; tidak otomatis dipakai pada refinement.

**Evidence provenance**

- `V` — directly verified original decision with a checkable primary source. **No row currently qualifies.**
- `U` — previously reported explicit user selection in supplied conversation context; original source is not independently available in this repository. Existing `U` classifications remain unchanged.
- `R` — historical project recap / previous assistant decision summary; detail beyond summary not verified.
- `P` — partially verifiable: summary supports broad intent, original wording/rationale/choice not verified; do not expand normative detail.
- `C` — explicit current Product Owner approval, clarification or evidence-gap disposition; establishes current governance/substance prospectively, not historical wording.

**Important:** AG-01 disetujui secara eksplisit untuk empat dokumen v0.1.2 sesudah snapshot draft; otorisasi DP-02 terpisah. Revisi administratif v0.1.3 dan AG-01-EG-B tidak membuktikan wording historis.

## 2. Foundational product decisions (D-series)

| ID | Decision / conservative approved substance | Status | Evidence | Relationships / impact |
|---|---|---|---|---|
| D-001 | AI learning platform untuk masyarakat umum dan developer; positioning awal. **Exact title/rationale require primary verification.** | Requires ID confirmation | P | Charter; scope |
| D-002 | Platform interaktif terinspirasi mutu pengalaman produk referensi, tetapi produk orisinal. **Exact historical allocation between D-001–D-008 unverified.** | Requires ID confirmation | P | Charter; UX |
| D-003 | Go digunakan untuk backend. **Exact original wording unverified.** | Requires ID confirmation | P | G3-001, G3-002 |
| D-004 | React, TypeScript dan Tailwind CSS frontend. **Exact original wording unverified.** | Requires ID confirmation | P | G3-001 |
| D-005 | Supabase Auth untuk authentication. **Exact original wording unverified.** | Requires ID confirmation | P | Q-006, G3-001 |
| D-006 | Documentation-first sebelum implementasi. **Exact original wording unverified.** | Requires ID confirmation | P | G3-005, DP-PLAN |
| D-007 | **Source gap: individual decision contents not established.** Broad early decisions are known but must not be allocated speculatively to this ID. | Requires Confirmation | P | AG-01 historical review |
| D-008 | **Source gap: individual decision contents not established.** Broad early decisions are known but must not be allocated speculatively to this ID. | Requires Confirmation | P | AG-01 historical review |
| D-009 | Guest-first learning. | Approved (reported) | R | Q-001, D-017 |
| D-010 | Free MVP, architecture premium-ready; billing not MVP. | Approved (reported) | R | Scope baseline; current flagship access PO-CLAR-D010-Q001 |
| D-011 | Student and Admin roles; Guest unauthenticated. | Approved (reported) | R | Q-006; authz |
| D-012 | Learning Path → Course → Module → Lesson → Content Block; course reusable across paths. | Approved (reported) | R | Q-004, FA-004 |
| D-013 | Hybrid lesson completion: explicit action plus mandatory interactive activity/graded assessment, Go verification. | Approved (reported) | R | Q-003–Q-005, FA-001–FA-003 |
| D-014 | Rich interactive blocks; no automatic AI grading or executable code in MVP. | Approved (reported) | R | Q-007, FA-002 |
| D-015 | Hybrid visual editor + Markdown, draft/preview/publish/revision, CMS-driven content. | Approved (reported) | R | Q-007, FA-005 |
| D-016 | Structured graded single/multiple choice; separate ungraded knowledge check; advanced types deferred. | Approved (reported) | R | Q-005, FA-003 |
| D-017 | Local Guest progress and safe migration; browser evidence not authoritative for official results. | Approved (reported) | R | Q-002, FA-002 |
| D-018 | Hybrid navigation with optional prerequisites validated backend. | Approved (reported) | R | Q-004; current MVP classification PO-CLAR-D018 |
| D-019 | Personalized workspace: detail/concise reader, themes, typography, bookmarks, notes, sync. | Approved (reported) | R | Student UX |
| D-020 | Balanced gamification vision; most deferred post-MVP. | Approved (reported) | R | MVP baseline |
| D-021 | Discovery/search/filter and rule-based recommendations. | Approved (reported) | R | Public UX; current split of MVP versus deferred scope PO-CLAR-D021 |
| D-022 | Digital verifiable certificates, post-MVP. | Approved (reported) | R | Deferred scope |
| D-023 | Balanced notifications vision; most deferred post-MVP. | Approved (reported) | R | Deferred scope |
| D-024 | Comprehensive Student dashboard vision; simplified MVP. | Approved (reported) | R | Student UX, MVP scope |
| D-025 | Security/privacy-by-design. | Approved (reported) | R | G3-003, DP-04 |
| D-026 | Comprehensive Admin analytics vision; simplified MVP. | Approved (reported) | R | Deferred scope |
| D-027 | Lean production operations; no microservices/k8s prerequisite for MVP. | Approved (reported) | R | G3-002–G3-004 |
| D-028 | Balanced Interactive Learning First MVP: one ChatGPT flagship; R0 documentation, R1 prototype, R2 alpha, R3 beta, R4 public. | Approved (reported) | R | G2-003/G2-004 |
| D-029 | Discovery audit / transition into three gates and final audit. **Exact decision wording requires verification.** | Approved (reported) | P | Q/G2/G3/FA |

**Mapping caution for D-001–D-008:** Initial choices are collectively evidenced in the project recap, but individual ID-to-choice mapping is *not* wholly verified. The descriptive rows D-001–D-006 are **provisional retrieval aids, not authoritative per-ID transcriptions**; D-007 and D-008 deliberately remain confirmation-required. This is an **AG-01 source-evidence review item**, not an attempt to reopen settled choices.

**Current Product Owner scope dispositions (`C`, separate from historical D/Q evidence):**

| Clarification ID | Current approved disposition | Status | Evidence | Historical ID relationship |
|---|---|---|---|---|
| PO-CLAR-D021 | Public catalog discovery/search/filtering committed to MVP; rule-based recommendations deferred until after MVP and not an optional MVP or release requirement. | Approved (current clarification) | C | Clarifies current scope of D-021; original wording remains R |
| PO-CLAR-D018 | Optional prerequisites included in MVP; Admin may configure where supported by approved domain specification; Go API enforces applicable prerequisites for official learning actions. Detailed behavior belongs to DP-02. | Approved (current clarification) | C | Clarifies current scope of D-018; original wording remains R |
| PO-CLAR-D010-Q001 | Every lesson in “Menguasai ChatGPT dari Nol” is free and Guest-accessible; Guest learning and local ungraded practice need no login; official completion and graded assessment require Student authentication; no premium-locked flagship lessons in MVP. | Approved (current clarification) | C | Clarifies current scope of D-010/Q-001; original wording remains R |

These are current Product Owner dispositions supplied for DP-01 remediation, **not reconstructed historical decisions**. They do not close EG-001–EG-003 or approve AG-01.

## 3. Gate 1 — Business Rules (Q-series)

| ID | Approved decision | Status | Evidence | Refines / impacts |
|---|---|---|---|---|
| Q-001 | Open Free Learning: Guest may access free lessons and local ungraded practice; login for official completion, graded assessment and achievements. | Approved (reported) | R | D-009, D-013; current flagship access PO-CLAR-D010-Q001 |
| Q-002 | Explicit Recovery & Safe Merge: selective optional Guest recovery; preserve server authority; conflict handling/idempotency; no importing official passing/completion. | Approved (reported) | R | D-017 |
| Q-003 | Version-Aware Completion: preserve historic completion; editorial revisions nonretroactive; material policies versioned. | Approved (reported) | R | D-013; refined by FA-001 |
| Q-004 | Policy-Driven Hierarchical Completion: required/optional content and assessments; canonical course completion reusable across paths. | Approved (reported) | R | D-012, D-013; FA-004 |
| Q-005 | Version-Aware Structured Grading: configurable threshold/weights/retries, immutable attempts, passing evidence separated from best/latest. | Approved (reported) | R | D-016; refined by FA-003 |
| Q-006 | Secure One-Time Admin Bootstrap: trusted Supabase user ID via privileged nonpublic server operation; Go controls authorization and audit. | Approved (reported) | R | D-011, G3-001 |
| Q-007 | Balanced Interactive Blocks: rich text/media/code/callout, flashcards, single/multi knowledge checks, prompt practice, step-by-step explorer, template diagrams/timelines; CMS authoring/validation/preview/renderer/tracking. | Approved (reported) | R | D-014, D-015; FA-002 |

## 4. Gate 2 — MVP Experience (G2-series)

| ID | Approved decision | Status | Evidence | Impacts |
|---|---|---|---|---|
| G2-001 | Complete MVP Journeys: Guest, Student, Admin, including success, failure, auth, recovery, revision and retry. | Approved (reported) | R | DP-02, DP-05 |
| G2-001A | Intent-Based Enrollment: explicit “Ikuti Kursus” or first official learning action, not browsing; idempotent. | Approved (reported) | R | FA-004, completion |
| G2-002 | Contextual Navigation: distinct responsive Public, Student Workspace, Lesson Reader and Admin layouts; all key states. | Approved (reported) | R | UX |
| G2-003 | One Complete Flagship Course: “Menguasai ChatGPT dari Nol,” approximately 12–16 lessons in four modules; accessible rich UX. | Approved (reported) | R | MVP scope |
| G2-004 | Evidence-Based Release Gates: acceptance, tests/security/UX evidence, No-Go, explicit approval across R0–R4. | Approved (reported) | R | DP-05, DP-06 |

## 5. Gate 3 — Technical & Documentation (G3-series)

| ID | Approved decision | Status | Evidence | Impacts |
|---|---|---|---|---|
| G3-001 | Supabase managed Auth/PostgreSQL/Storage + Go-owned business layer; browser does not CRUD core LMS business data directly. | Approved (reported) | R | DP-03/04 |
| G3-002 | Modular Monolith + Pragmatic Hexagonal Boundaries; single Go API, domain modules, REST/OpenAPI, PostgreSQL transactions. | Approved (reported) | R | DP-03/04 |
| G3-003 | Privacy-by-Design Lifecycle: data classification, ownership, minimal access, controlled retention/deletion/export, backup reconciliation. | Approved (reported) | R | FA-006 |
| G3-004 | Lean Production-Ready Infrastructure: local/staging/production, isolated Supabase, managed hosting, GitHub Actions, release controls, secrets, monitoring and tested recovery. | Approved (reported) | R | FA-008 |
| G3-005 | Structured Documentation with Traceability: Registry, PRD, Domain Rules, UX, Architecture, Data Model, OpenAPI, Tests, stable IDs and approval/change control. | Approved (reported) | R | DP-01–DP-06 |
| G3-006 | Governed Vertical Slice Delivery: approved specs, bounded scope, focused branches, tests/evidence, review, approval, business ambiguity escalation. | Approved (reported) | R | DP-06 |

## 6. Final Decision Audit — P0 closed

| ID | Approved decision | Status | Evidence | Refines / invariants |
|---|---|---|---|---|
| FA-001 | **A — Prospective by Default.** New requirements normally apply to new completions; retroactive revalidation needs explicit policy, approval, audit and notification. | Approved (direct) | U | Refines Q-003 and Q-004; transition details in DP-02 |
| FA-002 | **B — Evidence-Tiered Activity Contract.** Local interaction vs server-recorded participation vs server-verified passing; Admin-configured requiredness; Go validates official completion. | Approved (direct) | U | Refines D-013, Q-007; browser signals not proof of competence |
| FA-003 | **B — Version-Locked Expiring Attempts.** Assessment version locked, expiry 24h default, one active attempt, terminal submitted/expired/abandoned, retry, idempotent submission, immutable grading, preserved passing evidence. | Approved (direct) | U | Refines Q-005; EXPIRED is not automatic failed score |

## 7. Documentation governance decisions

| ID | Approved substance | Status | Evidence |
|---|---|---|---|
| DP-PLAN | **B — Governed Documentation Packages**: DP-01–DP-06, AG-01–AG-06, iterative draft, stable traceability, P1 closure before dependent approvals. | Approved (direct) | U |
| DP-01-SCOPE | **B — Traceable Product Baseline**: Charter, MVP Scope Baseline, complete Decision Registry, Open Decisions Register, ID relationships, AG-01 criteria. | Approved (direct) | U |
| DP-02-SCOPE | **B — Comprehensive Domain & UX Contracts**, FA-004/005 before AG-02. | Approved (direct) | U |
| DP-03-SCOPE | **B — Domain-Aligned Architecture & Data Contracts**, FA-006 before AG-03. | Approved (direct) | U |
| DP-04-SCOPE | **B — Contract-First API, Security & Operational Readiness**, FA-006 consistent and FA-008 before AG-04. | Approved (direct) | U |
| DP-05-SCOPE | **B — Risk-Based Verification & Evidence-Driven Release**, FA-007 before AG-05. | Approved (direct) | U |
| DP-06-SCOPE | **B — Governed Vertical Slice Handoff**, explicit bounded work, PR governance, evidence, approvals. | Approved (direct) | U |
| DPA | Documentation Planning Audit accepted as Ready for Controlled Documentation Authoring, 5 P1 open. | Approved (direct) | U |
| DP-01-PRE | **B — Evidence-Grounded Controlled Authoring**; historical verification, statuses, IDs, change control, four artifacts, AG-01 review. | Approved (direct) | U |
| AAR-01 | Authorization **only to draft DP-01** (four artifacts); no application code, app repository or DP-02–DP-06 authoring. | Authorized (direct) | U |
| AG-01-EG-B | **Prospective Baseline Attestation:** Product Owner accepts a prospective disposition for EG-001–EG-003 in the current DP-01 baseline. Their historical content and source provenance remain unverified. This is neither historical evidence nor AG-01 approval. | Approved (current disposition) | C |
| AG-01 | Product Owner explicitly approved the four DP-01 v0.1.2 documents as the prospective normative product baseline after that snapshot was created; EG-001–EG-003 remain historical limitations under AG-01-EG-B. Does not approve AG-02 or code. | Approved (current disposition) | C |

## 8. Final audit decisions after AG-01

| ID | Subject | Status | Blocking gate |
|---|---|---|---|
| FA-004 | **B — Independent Path and Course Participation:** participation and enrollment independent; joining a Path does not enroll all member Courses; Course completion global and reusable; Path progress derives from member Course completion; official participation requires Student authentication. | Approved (current disposition, Option B) | DP-02 v0.1.1; AG-02 conditionally approved |
| FA-005 | **B — Version-Pinned Learning with Controlled Migration:** existing enrollment stays on pinned published Course version; new enrollment uses latest eligible published version; no silent migration; historical progress/completion/passing preserved; MVP migration manual, Admin-controlled, explicitly authorized, audited and communicated appropriately to learners; no automatic migration engine; retention depends on FA-006. | Approved (current disposition, Option B) | DP-02 v0.1.1; AG-02 conditionally approved |
| FA-006 | **B — Lifecycle-Based Deletion & Data Minimization:** valid authenticated Student deletion request starts controlled, idempotent, auditable, retry-safe lifecycle; invalidate access after acceptance; delete profile, notes and bookmarks; delete or irreversibly de-identify Student-linked learning data under applicable policy; protect active-account evidence without overriding deletion rights; security audit retention 180 days unless legitimate legal obligation requires otherwise; active data deletion within 30 days of valid request; backup expiry within 30 days; anonymous aggregates may remain; no self-service recovery after effective deletion begins; restored backups must not silently resurrect personal data. These are Product Owner targets, not statutory claims. | Approved (current disposition, Option B) | DP-03 v0.1.0; AG-03 conditionally approved; AG-04 consistency |
| FA-006-B1 | **B — Individual Student-linked learning records:** delete or irreversibly de-identify each individual linked record during account deletion; retain only genuinely anonymous aggregates. Pseudonymous replacement alone is not anonymization; historical evidence protection does not override FA-006 B. Preserve its 30-day active-data and backup targets and 180-day security-audit target. | Approved (current disposition, Option B) | DP-04 privacy/security consistency; AG-04 not approved |
| FA-007 | UX, accessibility verification, performance and beta thresholds | Open | AG-05 |
| FA-008 | **B — Balanced Production MVP:** INF-01–INF-14 in §13 define managed frontend/Go/Supabase services, environment/delivery/security/observability/backup/cost controls; Singapore is only conditionally preferred after legal and latency validation; availability is best-effort without commercial SLA. No named Go host, paid tier, instance size or numeric RPO/RTO is approved. | Approved (current disposition, Option B) | DP-04; AG-04 not approved |

Detailed unresolved questions in [04-open-decisions-register.md](04-open-decisions-register.md).

## 9. Decision relations & change control

- `refines`: FA-001 → Q-003/Q-004; FA-002 → Q-007/D-013; FA-003 → Q-005.
- `depends on`: AG-02 conditionally approved for DP-02 v0.1.1, with GAP-001/002/003/007 Open and dependent implementation unauthorized; AG-03 conditionally approved for DP-03 v0.1.0; AG-04 → approved FA-006 B/FA-006-B1 B/FA-008 B and DP-04 review; AG-05 → open FA-007.
- `verified by`: future requirement/test IDs in DP-05; no test evidence exists yet.
- `supersedes`: **none asserted** without explicit historical proof.

**ID policy:** Preserve historic IDs; no renumbering, ID reuse, or silent deletion. Requirement IDs are allocated in owner specifications (example namespaces `BR-`, `UX-`, `SEC-`, `AC-`); examples are not actual published IDs. Material changes require a new approved decision/change record, impact analysis, reviewer sign-off, and updates to dependent requirements/tests/roadmap.

## 10. Historical evidence gaps and prospective disposition

1. **EG-001 — Exact D-001–D-008 mapping:** available recap consolidates early choices; primary messages would be needed to determine what each ID specifically stated, especially D-007/008. Individual per-ID statements remain provisional (`P`). AG-01-EG-B accepts prospective disposition, not the unknown historical mapping.
2. **EG-002 — Exact D-029 statement:** recap indicates discovery audit but original title/choice/rationale are not established. AG-01-EG-B accepts prospective disposition without reconstructing D-029.
3. **EG-003 — Historical provenance:** original approval records, per-ID source pointers and exact wording/rationales are unavailable in this repository for `R`/`P` decisions, including Q/G2/G3 and some D entries. The original source behind existing `U` rows is also unavailable for independent repository verification. No row is classified `V`. AG-01-EG-B accepts a prospective disposition for the current baseline; it does not close this historical gap or turn `C` into original evidence.
4. **EG-004 — Formal AG-01 review:** Product Owner explicitly approved the four v0.1.2 documents after the draft snapshot. This closes the pending gate-status question; it does not resolve EG-001–EG-003 historically.

**Disposition:** EG-001–EG-003 remain historical evidence gaps under AG-01-EG-B. AG-01 separately approved the v0.1.2 baseline; neither approval invents missing decisions or verifies historical wording.

## 11. AG-01 approval record and limits

AG-01 was explicitly approved by the Product Owner for the four DP-01 v0.1.2 documents. v0.1.3/v0.1.4 recorded later governance decisions; this v0.1.5 revision records still later AG-03, FA-006-B1 B and FA-008 B decisions, none part of the original approved snapshot. AG-01-EG-B remains effective; EG-001–EG-003 remain unverified historically. FA-004 B, FA-005 B, FA-006 B, FA-006-B1 B and FA-008 B are current explicit approvals. FA-007 remains Open. AG-02 and AG-03 are conditionally approved for their named snapshots; AG-04 and later gates remain unapproved.

**Current disposition:** DP-01 v0.1.2 product baseline approved through AG-01; AG-02 conditionally approved for six DP-02 v0.1.1 documents; AG-03 conditionally approved for six DP-03 v0.1.0 documents. GAP-001/002/003/007 remain Open and dependent implementation unauthorized. DP-04 documentation authoring is separately authorized; AG-04 not approved; DP-05–DP-06 authoring and application code unauthorized. Material changes require the change control above.

## 12. Subsequent Product Owner governance dispositions (v0.1.4 record)

| ID | Current explicit disposition | Status | Evidence / boundary |
|---|---|---|---|
| AG-02 | Conditionally approved for the six DP-02 **v0.1.1** documents. GAP-001, GAP-002, GAP-003 and GAP-007 remain Open; their dependent requirements are not authorized for implementation. Material changes require change control. | Conditionally Approved (current disposition) | C; later approval, not part of the v0.1.1 draft snapshot and not historical source verification |
| FA-006 | Option B, Lifecycle-Based Deletion & Data Minimization, as specified in §8 and the [Open Decisions Register](04-open-decisions-register.md). | Approved (current disposition, Option B) | C; later Product Owner approval, not a statutory retention claim |

At the v0.1.4 record, AG-03 was Not Approved and FA-007/FA-008 remained Open. Current status follows in §13. The four AG-02 policy GAPs remain Open; no approval of their missing detail is implied.

## 13. Subsequent Product Owner governance dispositions (v0.1.5 record)

| ID | Current explicit disposition | Status / boundary |
|---|---|---|
| AG-03 | Conditionally approved for the six DP-03 **v0.1.0** documents. GAP-001/002/003/007 remain Open; dependent requirements are not implementation-authorized; material changes require change control. | Conditionally Approved, evidence `C`; later than the draft snapshot, not historical source verification |
| FA-006-B1 | Option B: individual Student-linked learning records must be deleted or irreversibly de-identified during account deletion; only genuinely anonymous aggregates may remain. Pseudonymization alone is insufficient. FA-006 B and its 30/30/180-day targets remain effective. | Approved (current disposition, Option B), evidence `C` |
| FA-008 | Option B: Balanced Production MVP as specified by INF-01–INF-14 below. | Approved (current disposition, Option B), evidence `C` |

| ID | Approved FA-008 B operational direction |
|---|---|
| INF-01 | Managed static frontend hosting and CDN. |
| INF-02 | Managed Go container deployment with pragmatic scaling; provider not selected. |
| INF-03 | Supabase managed PostgreSQL. |
| INF-04 | Supabase Auth and Storage. |
| INF-05 | Singapore is a conditional preferred region pending legal and latency validation; no final region decision. |
| INF-06 | Isolated Local, Staging and Production environments. |
| INF-07 | GitHub Actions CI/CD with production deployment approval. |
| INF-08 | Managed secrets; none in source control. |
| INF-09 | Structured logs, request correlation, basic metrics and error alerts. |
| INF-10 | Lightweight background worker capability. |
| INF-11 | Backup and restoration policies compatible with FA-006 B and FA-006-B1 B; managed backup alone is not proof. |
| INF-12 | Best-effort MVP availability without a commercial SLA. |
| INF-13 | Pragmatic horizontal scaling where supported; no Kubernetes requirement. |
| INF-14 | Budget alerts, resource controls and cost monitoring. |

AG-04 is **Not Approved**. FA-007 remains **Open** for AG-05. No cloud provider for Go, paid tier, exact instance size or numeric RPO/RTO is approved. The three dispositions above are current explicit Product Owner decisions and do not repair EG-001–EG-003 historical evidence gaps.
