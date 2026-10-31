# DP-01 — MVP Scope Baseline

| Metadata | Nilai |
|---|---|
| Package | DP-01 — Traceable Product Baseline |
| Artifact | MVP Scope Baseline |
| Version | 0.1.3 — administrative governance synchronization |
| Status | **Approved product baseline v0.1.2; v0.1.3 records later governance decisions** |
| Approval gate | AG-01 — **Approved for v0.1.2 by current Product Owner approval** |
| Revision boundary | v0.1.2 product substance approved; v0.1.3 records AG-01, FA-004 B and FA-005 B without changing that substance |
| Last prepared | 2026-10-31 |

> **Scope authority:** dokumen ini mencatat committed versus deferred capabilities dari discovery dan klarifikasi Product Owner saat ini (PO-CLAR-D021, PO-CLAR-D018, PO-CLAR-D010-Q001). Klarifikasi tersebut menetapkan scope sekarang, bukan membuktikan wording keputusan historis. Perilaku domain yang tepat, user journeys dan kebijakan P1 diselesaikan dalam DP-02. Stable requirement IDs **belum diterbitkan**; ID pada tabel adalah decision references yang telah ada.

AG-01-EG-B menerima disposisi prospektif untuk kesenjangan bukti historis EG-001–EG-003. Isi historis yang belum diketahui tetap tidak terverifikasi. Persetujuan AG-01 untuk snapshot v0.1.2 dan otorisasi authoring DP-02 diberikan terpisah sesudah snapshot dibuat; revisi v0.1.3 ini mencatatnya.

## 1. MVP product release intent

Menghadirkan **satu flagship learning experience untuk pemula ChatGPT** yang terasa lengkap: discovery → Guest learning → sign-in → official enrollment/progress → mandatory interactive evidence → structured assessment → course completion; serta Admin CMS untuk membuat, mem-preview, memvalidasi dan memublikasikan kurikulum tersebut.

## 2. Committed MVP capabilities

| Area | Capability committed | Decision references / current clarifications | Boundary/notes |
|---|---|---|---|
| Public discovery | Landing, browse/search/filter katalog, course/path detail | D-021, G2-001, G2-002; PO-CLAR-D021 | Rule-based recommendations deferred setelah MVP |
| Guest learning | Seluruh lesson flagship course “Menguasai ChatGPT dari Nol” gratis dan dapat diakses Guest; local ungraded interactive practice tanpa akun | D-009, D-010, Q-001; PO-CLAR-D010-Q001 | Tidak ada official score/completion atau graded assessment untuk Guest; memerlukan autentikasi Student |
| Auth/roles | Supabase Auth, Guest (unauthenticated), Student dan Admin | D-011, G3-001, Q-006 | Admin bootstrap via trusted nonpublic privileged operation |
| Guest recovery | Optional explicit recovery posisi baca, draft, settings; safe merge | D-017, Q-002 | Browser evidence tidak diangkat menjadi verified passing/completion |
| Learning model | Learning Path → Course → Module → Lesson → Content Block | D-012, Q-004; FA-004 B | Course reusable lintas path; canonical course completion; partisipasi Path terpisah dari enrollment Course |
| Optional prerequisites | Admin dapat mengonfigurasi prerequisites bila didukung domain specification; Go API menegakkan prerequisites yang berlaku untuk official learning actions | D-018; PO-CLAR-D018 | Perilaku dan konfigurasi rinci milik DP-02 |
| Enrollment | Student intent-based course enrollment | G2-001A | Melihat course saja tidak mendaftarkan Student |
| Navigation/UX | Public, Student Workspace, Lesson Reader, Admin layouts | G2-002, D-019 | Responsive, error/empty/loading/unauthorized states |
| Interactive blocks | Rich text, media, code, callout, flashcards, single/multi knowledge checks, prompt practice, step-by-step, template diagram/timeline | D-014, Q-007 | Setiap block MVP memiliki CMS authoring, validation, preview, renderer dan tracking yang sesuai |
| Activity evidence | Local interaction, server participation, server-verified passing | FA-002 | Requiredness configured Admin; Go validates official completion |
| Official completion | Explicit complete action + mandatory activities/assessments; hierarchical and version-aware | D-013, Q-003, Q-004, FA-001 | Prospective by default; existing achievements preserved |
| Assessment | Structured graded single/multi-select with configurable passing score, weights, retries | D-016, Q-005 | Un/graded knowledge checks terpisah |
| Attempt lifecycle | Version lock, default 24h expiry, one active attempt, immutable grades, idempotent submission | FA-003 | Expired ≠ scored failure; passing evidence preserved |
| Admin content workflow | Hybrid visual editor + Markdown, draft/preview/publish/revisions | D-015, Q-007; FA-005 B | Enrollment dipin ke published Course version; migrasi manual dan terkontrol; retensi historis bergantung FA-006 |
| Student workspace | Basic dashboard/progress, resume, bookmarks, notes, reading preferences | D-019, D-024 | Full analytics/gamification deferred |
| Security/privacy | Go-side authz, ownership, audit, privacy controls, basic export/deletion lifecycle | D-025, G3-003 | Exact retention timelines FA-006 open |
| Operability | Managed services, local/staging/prod separation, CI, monitoring, backups/restore checks | D-027, G3-004 | Vendor, budget and quantitative recovery targets FA-008 open |
| Content | “Menguasai ChatGPT dari Nol”, seluruh lesson gratis bagi Guest, target ~4 modules / 12–16 lessons | G2-003; PO-CLAR-D010-Q001 | Content quality and sufficient coverage matter more than fixed count; no premium-locked flagship lessons in MVP |
| Release governance | R0 documentation, R1 prototype, R2 private alpha, R3 beta, R4 public; explicit evidence-based approvals | D-028, G2-004 | Thresholds FA-007 open |

## 3. Deferred or post-MVP capabilities

| Capability | MVP treatment | Decision reference / current clarification |
|---|---|---|
| Rule-based recommendations | Deferred until after MVP; not an optional MVP or release requirement | D-021; current scope disposition PO-CLAR-D021 |
| Codex full course / broader curriculum | Deferred; allow future learning paths/courses | G2-003, D-028 |
| Premium subscription, payments, paywalls | No billing MVP; remain premium-ready | D-010 |
| Verifiable digital certificates | Deferred | D-022 |
| XP, badges, streaks, advanced gamification | Deferred beyond baseline light experience | D-020 |
| Comprehensive Admin analytics & Student analytics | Deferred; basic views in MVP | D-024, D-026 |
| Broad notifications/automation | Deferred | D-023 |
| AI tutor/automated grading of prompt responses | Deferred | D-014, D-016 |
| Executable code sandbox | Deferred | D-014 |
| Matching/ordering graded question types and advanced exam control | Deferred | D-016, FA-003 |
| Kubernetes, microservices, complex distributed infrastructure | Not required for MVP | D-027, G3-002, G3-004 |

## 4. Role and authorization boundary

| Capability | Guest | Student | Admin |
|---|---|---|---|
| Browse free content | Yes | Yes | Subject to public access |
| Explore interactive lesson | Local/ungraded | Yes | Preview/authoring |
| Official completion | No | Yes, validated Go | Not a substitute for Student evidence |
| Graded assessment | No | Yes, validated Go | Author/manage assessments |
| Manage own progress/notes | Local only where relevant | Yes | No arbitrary Student ownership bypass |
| Publish content | No | No | Privileged, audited |

Detailed permission matrix is DP-04, not this baseline.

## 5. Course and completion scope invariants

- A **single canonical course** is reusable across learning paths; completing it must not create conflicting course-specific duplicates merely because a path differs.
- Required/optional lessons and graded assessments are controlled by versioned completion policy.
- Editorial-only changes do not invalidate previously earned completion.
- A policy-affecting change ordinarily applies prospectively; retroactive revalidation requires explicit policy, approval, audit and notification.
- Local/browser interaction records are not authoritative evidence for passing or official completion.
- Immutable submitted attempts and historically valid passing evidence must not be overwritten by later retries or grades.

## 6. Proposed rollout stages (approved at vision level, quantitative gates pending)

| Stage | Expected focus | Approval condition |
|---|---|---|
| R0 | Approved documentation baseline | AG-01–AG-06 where relevant, with explicit R0 release decision |
| R1 | Prototype of flagship interactive learning UX | Usability/accessibility evidence, no production claim |
| R2 | Integrated private alpha | Core auth/learning/assessment/CMS correctness, security and E2E evidence |
| R3 | Closed beta | Real-user UX, performance and content feedback; threshold FA-007 |
| R4 | Public MVP | No-Go criteria cleared, recovery/operations verified, explicit release approval |

A stage description is **not** a completion claim.

## 7. Scope change policy

New features, different role models, new scoring methods, a requirement to run user code, payment processing or novel Admin privileges are **out-of-scope changes**, not implicit implementation latitude. Changes need approval, Decision Registry update and impact check against DP-02–DP-06.

## 8. Known unresolved topics

- FA-004 B approved: Path participation independent from Course enrollment; DP-02 owns detailed contract.
- FA-005 B approved: version-pinned enrollment and controlled migration; DP-02 owns detailed contract. Historical retention still depends on FA-006.
- FA-006 exact retention/deletion policy; DP-03 blocker, DP-04 consistency.
- FA-007 measurable UX/performance/beta goals; DP-05 blocker.
- FA-008 capacity, hosting, RPO/RTO, costs and monitoring parameters; DP-04 blocker.

## 9. AG-01 approval record

Product Owner explicitly approved the four DP-01 **v0.1.2** documents through AG-01 after that draft snapshot. FA-004 B and FA-005 B were approved later as current Product Owner decisions. This v0.1.3 administrative revision records those events; it is not a claim that the post-approval edits were in the approved v0.1.2 snapshot. Historical source limits EG-001–EG-003 remain under AG-01-EG-B.

**Status:** AG-01 Approved for the v0.1.2 product baseline; AG-02 remains Not Approved.
