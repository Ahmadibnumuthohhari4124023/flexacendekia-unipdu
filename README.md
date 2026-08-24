# Flexa Cendekia x UNIPDU

Platform Pendidikan Terpadu 6 Tahun (SMA + Sarjana S1 UNIPDU) berbasis Kurikulum Merdeka & Personalisasi Karir.

---

## 🏛️ Struktur Arsitektur & Single Source of Truth

> [!IMPORTANT]
> **`server/views/` adalah SATU-SATUNYA sumber kode frontend aktif.**
> 
> Seluruh halaman aplikasi disajikan langsung oleh server Express dari folder `server/views/`. Folder `_legacy_backup/` di root berisi arsip/cadangan dari versi statis dan template lama (Google Apps Script / prototipe lama) dan **tidak digunakan saat runtime**.

```text
Flexa_Cendekia_Alur_Terurut/
├── server/                      # 🟢 BACKEND & SERVER UTAMA
│   ├── app.js                   # Entry point Express Server
│   ├── package.json             # Dependensi server (Express, MySQL, CORS)
│   ├── routes/
│   │   ├── pages.js             # Page Router (/?page=08_dashboard-siswa, dll)
│   │   └── api.js               # REST API endpoints
│   ├── config/                  # Konfigurasi database MySQL & environment
│   ├── services/                # Integrasi service (Gemini AI, Auth)
│   ├── public/                  # Asset publik (CSS, images, font)
│   └── views/                   # 🌟 SUMBER UTAMA KODE FRONTEND AKTIF
│       ├── 01_login.html
│       ├── 08_dashboard-siswa.html
│       ├── 09_krs-siswa.html
│       ├── 10_detail-roadmap.html
│       ├── 11_checkpoint-jumat.html
│       ├── 12_ganti-cita-cita.html
│       ├── 13_riwayat-semester.html
│       ├── 14_dashboard-guru.html
│       ├── 15_tinjauan-guru.html
│       ├── 16_dashboard-ortu.html
│       ├── 17_notifikasi.html
│       ├── 18_profil.html
│       ├── 18_profil_profil-siswa.html
│       ├── 18_profil_profil-guru.html
│       ├── 18_profil_profil-ortu.html
│       ├── firebase-config.js     # Inisialisasi Firebase Web SDK
│       ├── firebase-auth-guard.js # Auth Guard & Role Validator
│       ├── firebase-data-store.js # Data layer Firestore
│       └── sso-sync.js            # SSO & Session Sync
│
├── database/                    # Skema database MySQL (schema.sql)
├── _legacy_backup/              # 📦 ARSIP CADANGAN (Folder 01-18 lama, appsscript, kloning lama)
└── README.md                    # Dokumentasi proyek
```

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Prasyarat
- Node.js (v18+)
- MySQL (opsional untuk API lokal, Firebase Firestore aktif untuk real-time data)

### 2. Instalasi & Menjalankan Server
```bash
# Masuk ke direktori server
cd server

# Install dependencies
npm install

# Jalankan server development
npm run dev
# atau
npm start
```

Server akan berjalan di: **`http://localhost:3000`**

---

## 🔑 Daftar Akun Demo & Akun Siswa Resmi (2026)

### 1. Akun Demo Utama (1-Klik di Halaman Login)
| Role | Nama Akun | Email | Password | Halaman Tujuan |
|---|---|---|---|---|
| **Siswa Demo** | Ahmad Faiz | `siswa@flexa.test` | `flexa123` / `password123` | `http://localhost:3000/?page=08_dashboard-siswa` |
| **Guru Pembimbing** | Ibu Sari Rahayu, M.Pd. | `guru@flexa.test` | `flexa123` / `password123` | `http://localhost:3000/?page=14_dashboard-guru` |
| **Orang Tua** | Bpk. Hendra Pratama | `ortu@flexa.test` | `flexa123` / `password123` | `http://localhost:3000/?page=16_dashboard-ortu` |

### 2. Akun Siswa Resmi (9 Siswa - Basis Data 2026)
| No | NIS | Nama Siswa | Jenjang | Email | Password |
|---|---|---|---|---|---|
| 1 | `260001` | Aisha Syahida Amanina | SD 2 | `aisha@flexacendekia.com` | `flexa123` |
| 2 | `260002` | Zuran | SD 2 | `zuran@flexacendekia.com` | `flexa123` |
| 3 | `260003` | Muhammad Fatih | SD 4 | `fatih@flexacendekia.com` | `flexa123` |
| 4 | `260004` | Danella Adzkia Razani Setiawan | SD 5 | `adzkia@flexacendekia.com` | `flexa123` |
| 5 | `260005` | Muhammad Arshaka Afthar Rahma | SMP 7 | `arshaka@flexacendekia.com` | `flexa123` |
| 6 | `260006` | Naura Reihana Nun | SMP 7 | `nauranun@flexacendekia.com` | `flexa123` |
| 7 | `260007` | Muhammad Ega Nabil Manshurin | SMP 8 | `nabil@flexacendekia.com` | `flexa123` |
| 8 | `260008` | Caesar Mutiara Chandra | SMA 10 | `caesar12@flexacendekia.com` | `flexa123` |
| 9 | `260009` | Aurelia Putri Sujatmiko | SMA 11 | `aurelia@flexacendekia.com` | `flexa123` |

---

## 🛠️ Panduan Pemeliharaan & Pengembangan

1. **Mengedit Tampilan / Fitur Halaman**:
   * Selalu edit file di dalam `server/views/` (misal: `server/views/17_notifikasi.html`).
   * Tidak perlu lagi menyalin atau mengedit file di luar `server/views/`.
2. **Navigasi Antar Halaman**:
   * Gunakan format URL query standar: `/?page=nama_halaman` (contoh: `/?page=14_dashboard-guru`).
3. **Data Layer**:
   * Akses Firestore melalui method terpusat di `server/views/firebase-data-store.js`.
