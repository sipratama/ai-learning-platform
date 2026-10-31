# DP-01 — Product Charter

| Metadata | Nilai |
|---|---|
| Package | DP-01 — Traceable Product Baseline |
| Artifact | Product Charter |
| Version | 0.1.4 — subsequent administrative governance synchronization |
| Status | **Approved product baseline v0.1.2; later revisions record governance only** |
| Authoring authorization | AAR-01 — explicitly authorized by product owner |
| Approval gate | AG-01 — **Approved for v0.1.2 by current Product Owner approval** |
| Revision boundary | v0.1.2 product substance approved; v0.1.3 recorded AG-01/FA-004 B/FA-005 B; v0.1.4 records AG-02 conditional approval/FA-006 B without changing that substance |
| Source-of-truth scope | Visi produk, audiens, positioning, prinsip dan sasaran produk |
| Last prepared | 2026-10-31 |

> **Governance notice.** Product Owner menyetujui empat dokumen DP-01 v0.1.2 melalui AG-01 sesudah snapshot draft dibuat. v0.1.3 mencatat AG-01/FA-004 B/FA-005 B; revisi administratif v0.1.4 ini mencatat AG-02 Conditionally Approved untuk enam dokumen DP-02 v0.1.1 dan FA-006 B. Substansi baseline v0.1.2 tidak berubah. AG-01-EG-B tetap berlaku; EG-001–EG-003 tetap keterbatasan bukti historis. GAP-001/002/003/007 tetap Open dan implementasi yang bergantung padanya tidak diizinkan. DP-03 authoring diizinkan terpisah; AG-03 belum disetujui. Lihat [Decision Registry](03-decision-registry.md).

## 1. Product vision

Membangun platform belajar AI interaktif yang membantu **masyarakat umum dan developer** memahami dan menerapkan alat serta konsep AI secara bertahap, melalui learning path, course, module, lesson, dan content block yang dapat dikonfigurasi melalui Admin CMS. Pengalaman pembelajaran dibuat **guest-first**, kaya interaksi, dan didukung kemajuan serta evaluasi resmi bagi Student yang login.

Produk mengambil **inspirasi dari kualitas pengalaman belajar interaktif** platform referensi yang dibahas pada discovery, tanpa menyalin konten, identitas, atau desain proprieter. Ruang lingkup awal adalah AI learning platform yang orisinal, bukan general-purpose LMS untuk semua topik.

**Evidence:** D-009, D-012, D-014 dan G2-003 mendukung arah guest-first, struktur belajar, interaktivitas dan flagship dalam ringkasan historis. Asal visi/audiens awal masih berupa ringkasan umum; pemetaan individual D-001–D-008 belum terverifikasi (EG-001) dan tidak dipakai sebagai bukti per-ID untuk kalimat di atas.

## 2. Target audiences & roles

| Audiens/peran | Kebutuhan utama | Batas kewenangan MVP |
|---|---|---|
| Guest | Menjelajahi katalog dan belajar materi gratis tanpa membuat akun | Bisa mengakses free learning dan latihan lokal; tidak memiliki official completion, graded assessment, atau account achievements |
| Student | Melanjutkan pembelajaran, memperoleh kemajuan resmi, menyelesaikan assessment | Mengelola progres dan workspace milik sendiri; completion dan nilai divalidasi Go API |
| Admin | Menyusun, memvalidasi, mem-preview dan memublikasikan materi | Operasi privileged terproteksi, terdokumentasi dan diaudit; tidak boleh mengubah bukti nilai secara diam-diam |

Pemisahan learning path untuk pengguna umum dan developer adalah arah kurikulum, bukan dua identitas Student berbeda.

**Evidence:** D-011, Q-001, Q-006, G2-001; user context keputusan audiens masyarakat umum + developer.

## 3. Core value proposition

1. **Belajar sebelum login:** hambatan awal minimal; pembelajaran gratis dapat diakses Guest.
2. **Interaktivitas yang bermakna:** flashcards, knowledge checks, prompt practice, explorations, media dan konten terstruktur, dengan dukungan authoring Admin.
3. **Progress terpercaya:** official completion, evidence participation dan passing evidence ditentukan server, bukan flag browser.
4. **Kurikulum reusable:** satu canonical course dapat menjadi anggota beberapa learning path dan hanya memiliki satu canonical completion record per siswa/kebijakan yang relevan.
5. **Konten bisa berevolusi tanpa menghapus capaian:** version-aware completion, revision dan prospective changes.
6. **Rilis berbasis bukti:** milestone bukan sekadar kode selesai; perlu pengujian, review dan approval.

**Evidence:** D-009, D-012–D-018, Q-003–Q-007, FA-001–FA-003, G2-004.

## 4. Product principles

| Prinsip | Penerapan yang sudah diputuskan |
|---|---|
| Guest-first, account-when-needed | Login diperlukan untuk official milestones, bukan untuk mencoba free lessons |
| Learning quality over superficial clicks | Bukti lokal, participation dan passing dipisahkan |
| Secure by design | Supabase Auth untuk identitas; otorisasi, grading dan official progress melalui Go API |
| Version-aware fairness | Completion historis tetap sah; retroactive revalidation adalah pengecualian yang butuh approval, audit dan pemberitahuan |
| Authorable interactive content | Block MVP harus didukung editor, validator, preview dan renderer, bukan hardcode-only |
| Accessible and responsive experience | Public, Student, Lesson Reader dan Admin memiliki UX responsif dan state penanganan kesalahan |
| Lean MVP | Modular monolith, managed infrastructure, tanpa microservices/Kubernetes wajib dalam MVP |
| Governance & traceability | Approved decisions → requirements → contracts → tests → evidence → bounded slices |

## 5. Product success definition (qualitative baseline)

Keberhasilan MVP berarti seorang Guest dapat menemukan dan mempelajari **seluruh lesson** flagship course secara gratis, kemudian Student dapat melakukan enrollment, memenuhi aktivitas wajib, menjalankan assessment resmi, dan melihat progress yang benar; Admin dapat menerbitkan dan mengelola semua jenis konten MVP melalui CMS; dan sistem memenuhi release gates yang disetujui. Akses Guest dan latihan lokal tanpa login tidak menghasilkan official completion atau nilai assessment; keduanya memerlukan autentikasi Student (PO-CLAR-D010-Q001, klarifikasi Product Owner saat ini, bukan bukti wording historis D-010/Q-001).

**Belum ada target kuantitatif final** seperti jumlah beta participants, task success rate, latency p95 atau concurrency. Parameter tersebut adalah **FA-007 (Open)** dan tidak boleh diciptakan dalam charter ini.

## 6. Flagship learning scope

- Target awal: satu flagship course **“Menguasai ChatGPT dari Nol”**.
- Setiap lesson dalam course flagship ini gratis dan dapat diakses Guest; tidak ada lesson flagship yang dikunci premium dalam MVP (PO-CLAR-D010-Q001).
- Perencanaan kurikulum awal: kurang lebih **12–16 lesson dalam empat modul**; angka merupakan target planning, bukan keharusan menambah materi yang tidak diperlukan.
- Learning path untuk masyarakat umum dan developer dapat berkembang, tetapi **kursus Codex lengkap bukan bagian dari committed flagship MVP**.
- Evaluasi formal menggunakan structured assessment, bukan AI grading atau eksekusi kode otomatis.

**Evidence:** G2-003, D-028; detail modul dan daftar lesson final dimiliki DP-02.

## 7. MVP versus roadmap

**Committed MVP:** guest-first free learning, katalog/course discovery dengan pencarian dan filter, Auth Student/Admin, interactive lesson reader, optional prerequisites yang berlaku dan divalidasi Go API untuk official learning actions, authoring/validation/publishing CMS, course enrollment, progress/completion, graded single/multiple choice assessment, workspace inti, privacy/security/operations yang memadai, dan course flagship berkualitas. Detail konfigurasi dan perilaku prerequisites dimiliki DP-02 (PO-CLAR-D018).

**Deferred capabilities:** rule-based recommendations (PO-CLAR-D021), advanced gamification, digital verifiable certificates, advanced analytics/notifications, AI tutor/AI grading, executable code sandbox, payment/subscription processing, advanced assessment types, full Codex course. Rancangan tetap dapat *premium-ready* tanpa payment MVP. PO-CLAR-D021 adalah penetapan scope MVP saat ini, bukan verifikasi wording historis D-021.

Rincian scope dan batasnya terdapat pada [02-mvp-scope-baseline.md](02-mvp-scope-baseline.md).

## 8. Approved technical direction (constraints, not detailed design)

- Frontend: React, TypeScript, Tailwind CSS.
- Backend: Go, single modular monolith dengan pragmatic hexagonal boundaries.
- Managed services: Supabase Auth, PostgreSQL dan Storage.
- Contract-first REST/OpenAPI; business rules, authorization, grading dan completion dikelola Go API.
- Local, staging dan production terisolasi; CI/CD dan backup/restore diuji sebelum release yang relevan.

Detail data models, deployment vendor, RPO/RTO, endpoints dan security procedures **bukan milik Product Charter**. Lihat keputusan G3-001–G3-006.

## 9. Explicit non-goals for this artifact

Dokumen ini **tidak** menetapkan schema, state machine detail, endpoint HTTP, UX mockup, observability metric, daftar test case, estimasi biaya/tanggal, maupun izin penulisan kode.

## 10. Open questions & approval

- **FA-004 — Approved B:** partisipasi Path terpisah dari enrollment Course; progress Path berasal dari completion Course anggota. Rincian domain di DP-02.
- **FA-005 — Approved B:** enrollment tetap pada published Course version yang dipin; enrollment baru memakai versi published terbaru yang eligible; migrasi MVP manual, terotorisasi dan diaudit. Retensi konten historis bergantung FA-006.
- **FA-006 — Approved B:** lifecycle-based deletion dan data minimization, termasuk target deletion/retention yang dicatat di [Open Decisions Register](04-open-decisions-register.md); AG-03 tetap perlu review, AG-04 perlu konsistensi.
- **FA-007:** UX/performance/beta thresholds belum final (blocks AG-05).
- **FA-008:** operational vendor/capacity/RPO/RTO belum final (blocks AG-04).

**AG-01 status:** APPROVED untuk snapshot DP-01 v0.1.2, berdasarkan persetujuan eksplisit Product Owner setelah snapshot dibuat. AG-01-EG-B menerima disposisi prospektif EG-001–EG-003 tanpa memverifikasi wording historis. Revisi administratif v0.1.3 bukan bagian dari snapshot yang semula disetujui.

**Later governance:** v0.1.4 mencatat AG-02 Conditionally Approved untuk DP-02 v0.1.1, dengan GAP-001/002/003/007 Open; FA-006 B Approved; FA-007/008 Open; AG-03 Not Approved. v0.1.4 juga bukan bagian dari snapshot DP-01 v0.1.2 yang disetujui.
