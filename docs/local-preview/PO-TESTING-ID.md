# Panduan PO — uji manual preview Guest lokal

**Status lingkungan: siap untuk uji manual pada OrbStack yang Anda setujui. Docker Desktop belum diuji.** Hasil manual MT-01–MT-08 semuanya **NOT RUN** sampai PO sendiri mengisi hasil. Ini bukan persetujuan VS-01A/DD-001 atau izin Auth Bundle 1.

## Mulai

1. Pastikan OrbStack berjalan. Stack sudah dibiarkan hidup; buka **http://127.0.0.1:8088/catalog** di Chrome.
2. Bila perlu menjalankan ulang, buka Terminal di root repository lalu jalankan:

   ```sh
   docker compose -f compose.local.yaml up --build -d --wait --wait-timeout 120
   docker compose -f compose.local.yaml ps
   curl --fail http://127.0.0.1:8088/healthz
   ```

   Kedua layanan `api` dan `web` harus `healthy`; health mengembalikan `status: ok`. Port **8088** dipakai proyek ini pada `127.0.0.1`; tidak ada port API terpisah. Jika port dipakai proyek lain, jangan menghentikannya. Jalankan hanya satu engine/proyek preview yang dituju; tidak perlu mengubah konfigurasi Docker global.
3. Tidak ada login, akun uji, password, env produksi, database atau Supabase yang diperlukan. Preview berisi fixture sintetis dan latihan lokal tanpa nilai/kelulusan resmi.
4. Buka [rencana delapan tes](PO-MANUAL-TEST-PLAN.md), lalu jalankan satu per satu. Catat hasil di [lembar hasil](manual-test-results.json) atau salin ke catatan PO di luar Git.
5. Simpan bukti sendiri, misalnya `manual-evidence/MT-01/desktop.png`. Isi nama tester, waktu WIB/UTC, browser/versi, viewport, aktual, status dan lokasi bukti. Screenshot otomatis di folder evidence adalah bukti otomatis, bukan hasil manual Anda.

## Halaman yang diuji

| Fitur | URL |
|---|---|
| Katalog | http://127.0.0.1:8088/catalog |
| Pagination dua halaman | http://127.0.0.1:8088/catalog?limit=1 |
| Course | http://127.0.0.1:8088/catalog?type=courses |
| Learning Path | http://127.0.0.1:8088/paths/path-foundations |
| Course unggulan | http://127.0.0.1:8088/courses/course-flagship |
| Reader / flashcard | http://127.0.0.1:8088/courses/course-flagship/lessons/lesson-flagship-1 |
| Lesson kedua | http://127.0.0.1:8088/courses/course-flagship/lessons/lesson-flagship-2 |
| Health / API | http://127.0.0.1:8088/healthz dan http://127.0.0.1:8088/api/v1/catalog/paths |

Untuk MT-05 gunakan Chrome DevTools Device Toolbar dengan viewport 1440×1000, 834×1112, 390×844 dan 320×720; catat apakah ini emulasi atau perangkat fisik. MT-06 tetap memerlukan penilaian manusia, termasuk zoom dan screen reader. MT-07 menggunakan pemblokiran request pada DevTools di tab aplikasi; hapus blokir setelah tes agar stack tetap tersedia.

## Melaporkan dan memulihkan

- Gunakan PASS hanya jika semua ekspektasi kasus terpenuhi; FAIL untuk perilaku salah, BLOCKED untuk prasyarat yang belum tersedia, NOT RUN untuk belum dicoba. Tulis langkah reproduksi dan aktual spesifik; jangan menandatangani review independen yang belum dilakukan.
- Untuk log proyek: `docker compose -f compose.local.yaml logs --tail 80`. Error 400/404/405/406 yang sengaja dipicu MT-07/08 adalah bagian skenario; catat error tak terduga secara terpisah.
- Setelah reload, flashcard kembali tertutup. Restart API mengganti kunci cursor sintetis; bila muncul “Daftar perlu dimuat ulang”, klik “Muat ulang daftar”. Itu bukan logout akun.
- **Auth login, app logout, RBAC dan Admin UI: NOT IMPLEMENTED.** Halaman `/login` atau `/admin` tidak menyediakan fungsi tersebut. Bukti token operator dari VS-02A bukan integrasi Auth aplikasi.
- Jika Anda ingin berhenti nanti: `docker compose -f compose.local.yaml down`. Agen meninggalkan stack berjalan; jangan menjalankan `down` selama sedang menguji atau pada proyek lain.

[Laporan teknis, defect build dan batas governance](2026-11-01-docker-manual-acceptance-verification.md). Setelah hasil manual tersedia, PO masih perlu memberi disposisi terpisah; merge/CI/checklist tidak mengisi persetujuan keamanan atau QUAL-002.
