# 📝 CATATAN PENGEMBANGAN & SPESIFIKASI PROYEK
## Homeschooling Flexa Cendekia — Powered by UNIPDU

> **Struktur Kelembagaan & Jenjang Pendidikan:**
> - 🏛️ **UNIPDU (Universitas Pesantren Tinggi Darul Ulum Jombang):** **Pengembang Sistem (System Developer & Provider)**, penyedia platform sistem informasi akademik, personalisasi AI psikometrik, dan program integrasi pendidikan tinggi (Sarjana S1 UNIPDU).
> - 🏡 **Homeschooling Flexa Cendekia:** **Institusi Pengguna (Client Institution)** yang menyelenggarakan pendidikan fleksibel terpadu untuk 3 jenjang:
>   - 🎒 **Jenjang SD:** Kelas 1 s.d. Kelas 6 (Fase A, B, C)
>   - 📘 **Jenjang SMP:** Kelas 7 s.d. Kelas 9 (Fase D)
>   - 🎓 **Jenjang SMA:** Kelas 10 s.d. Kelas 12 (Fase E & F — Matrikulasi Persiapan S1 UNIPDU)

---

## 🛠️ 1. Tech Stack & Arsitektur Teknologi

| Komponen | Teknologi | Detail & Implementasi |
|---|---|---|
| **Frontend** | **HTML5 & Vanilla JavaScript (ES6+)** | Struktur modular tanpa build-step rumit, disajikan langsung dari `server/views/`. |
| | **Tailwind CSS (CDN)** | Styling utilitas dengan dukungan `@tailwindcss/forms` dan `container-queries`. |
| | **Typography & Icons** | Google Fonts (*Source Serif 4, Libre Franklin, JetBrains Mono*) dan *Material Symbols Outlined*. |
| | **Client Data Layer** | Firebase Web SDK (v9/v10 compat) terhubung ke Firestore & Auth. |
| **Framework** | **Express.js (v4.21+)** | Routing halaman dinamis (`/?page=...`), REST API endpoints (`/api/...`), dan middleware CORS/Static file. |
| **Backend** | **Node.js** | Runtime server utama pada `server/app.js` yang dikembangkan oleh UNIPDU. |
| | **Google Gemini AI API** | Analisis hasil tes diagnostik SD, SMP, SMA & rekomendasi peta minat bakat menuju S1 UNIPDU. |
| **Database** | **Firebase Firestore & Auth** *(Realtime)* | Data akun, autentikasi sesi, jawaban tes (SD/SMP/SMA), status KRS/Modul Belajar, Checkpoint Jumat, dan notifikasi real-time. |
| | **MySQL 8.0 / MariaDB** *(Relasional)* | Database relasional untuk skema terstruktur (tabel pengguna, jenjang kelas, modul ajar, nilai) di `database/schema.sql`. |

---

## 🏛️ 2. Standar Arsitektur (Single Source of Truth)

- **Direktori Utama Frontend Aktif:** `server/views/`
  - Seluruh perubahan UI, alur logic, dan script halaman **hanya diedit** pada file di dalam folder `server/views/`.
- **Direktori Backup / Arsip:** `_legacy_backup/`
  - Folder ini menyimpan prototipe lama (Google Apps Script, static prototype) dan tidak dieksekusi oleh server aktif.

---

## 📜 3. Cakupan Sistem per Jenjang Homeschooling Flexa Cendekia

### 🎒 1. Jenjang SD (Kelas 1 s.d. 6)
- **Fokus:** Penemuan bakat alami, modalitas gaya belajar VAK (Visual, Auditori, Kinestetik), pembiasaan refleksi mingguan, dan penguatan karakter islami.
- **Tes Diagnostik:** Soal visual tematik anak (`03_soal-diagnosis_sd.html`).

### 📘 2. Jenjang SMP (Kelas 7 s.d. 9)
- **Fokus:** Eksplorasi minat dasar RIASEC, pemetaan proyek mandiri, penguatan literasi sains & komputasi.
- **Tes Diagnostik:** Soal studi kasus eksploratif (`03_soal-diagnosis_smp.html`).

### 🎓 3. Jenjang SMA (Kelas 10 s.d. 12)
- **Fokus:** Spesialisasi karir terpadu, pemilihan mata pelajaran Merdeka, matrikulasi SKS Sarjana S1 UNIPDU, portofolio karya profesional.
- **Tes Diagnostik:** Tes komprehensif RIASEC 40 pertanyaan & analisis AI rekomendasi 18+ prodi S1 UNIPDU (`03_soal-diagnosis.html`).

---

## 🔑 4. Akun Demo & Uji Coba

| Peran | Email | Password | URL Akses Langsung |
|---|---|---|---|
| **Siswa** | `siswa@flexa.test` | `password123` / `123456` | `http://localhost:3000/?page=08_dashboard-siswa` |
| **Guru Pembimbing** | `guru@flexa.test` | `password123` / `123456` | `http://localhost:3000/?page=14_dashboard-guru` |
| **Orang Tua** | `ortu@flexa.test` | `password123` / `123456` | `http://localhost:3000/?page=16_dashboard-ortu` |

---

## 🚀 5. Cara Menjalankan Aplikasi

```bash
# 1. Masuk ke direktori server
cd server

# 2. Install dependensi
npm install

# 3. Jalankan server (Mode Dev / Watch)
npm run dev
# Server aktif di http://localhost:3000
```
