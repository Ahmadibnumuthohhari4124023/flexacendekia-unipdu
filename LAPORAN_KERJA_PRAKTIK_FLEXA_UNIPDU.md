# LAPORAN KERJA PRAKTIK

---

## REKOMENDASI PILIHAN JUDUL LAPORAN KERJA PRAKTIK

Berikut adalah 3 opsi judul akademis yang siap digunakan sesuai dengan fokus laporan Anda:

* **Opsi 1 (Fokus Sistem & Asesmen Karir - Sangat Direkomendasikan):**
  > **RANCANG BANGUN SISTEM INFORMASI AKADEMIK DAN ASESMEN KARIR TERPADU BERBASIS WEB PADA HOMESCHOOLING FLEXA CENDEKIA DENGAN MATRIKULASI PERGURUAN TINGGI UNIPDU JOMBANG**

* **Opsi 2 (Fokus Personalisasi & Alur 6 Tahun):**
  > **PENGEMBANGAN PORTAL PENDIDIKAN MULTI-ROLE DENGAN FITUR DIAGNOSTIK MINAT BAKAT DAN ROADMAP PEMBELAJARAN 6 TAHUN BERBASIS CLOUD FIRESTORE PADA FLEXA CENDEKIA**

* **Opsi 3 (Fokus Implementasi Fullstack):**
  > **IMPLEMENTASI SISTEM PEMANTAUAN AKADEMIK DAN DIAGNOSIS POTENSI SISWA TERINTEGRASI BERBASIS NODE.JS DAN FIREBASE PADA HOMESCHOOLING FLEXA CENDEKIA**

---

<br>

```
                       LAPORAN KERJA PRAKTIK
 
 RANCANG BANGUN SISTEM INFORMASI AKADEMIK DAN ASESMEN KARIR TERPADU 
 BERBASIS WEB PADA HOMESCHOOLING FLEXA CENDEKIA DENGAN MATRIKULASI 
                 PERGURUAN TINGGI UNIPDU JOMBANG
 
 
                             Disusun Oleh:
                     AHMAD IBNU MUTHOHHARI
                         NIM: 4124023
 
 
                     PROGRAM STUDI SISTEM INFORMASI / INFORMATIKA
                 FAKULTAS SAINS DAN TEKNOLOGI
         UNIVERSITAS PESANTREN TINGGI DARUL 'ULUM (UNIPDU)
                             JOMBANG
                              2026
```

---

## LEMBAR PENGESAHAN

**Judul Kerja Praktik:**  
Rancang Bangun Sistem Informasi Akademik dan Asesmen Karir Terpadu Berbasis Web pada Homeschooling Flexa Cendekia dengan Matrikulasi Perguruan Tinggi UNIPDU Jombang  

**Nama Mahasiswa:** Ahmad Ibnu Muthohhari  
**NIM:** 4124023  
**Program Studi:** Sistem Informasi / Informatika  
**Fakultas:** Fakultas Sains dan Teknologi, Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU) Jombang  

<br>

Disetujui dan disahkan pada tanggal: ....................................... 2026

<br>

| Menyetujui, <br> Dosen Pembimbing Kerja Praktik | Mengetahui, <br> Pembimbing Lapangan (Flexa Cendekia) |
| :---: | :---: |
| <br><br><br> **(Nama Dosen Pembimbing, Gelar)** <br> NIDN. ........................................ | <br><br><br> **(Nama Pembimbing Lapangan, Gelar)** <br> NIP/NIK. ........................................ |

<br>

| Mengetahui, <br> Dekan Fakultas Sains & Teknologi UNIPDU | Mengetahui, <br> Ketua Program Studi |
| :---: | :---: |
| <br><br><br> **(Nama Dekan, Gelar)** <br> NIDN. ........................................ | <br><br><br> **(Nama Kaprodi, Gelar)** <br> NIDN. ........................................ |

---

## ABSTRAK

Pendidikan non-formal seperti *homeschooling* saat ini berkembang pesat sebagai alternatif pembelajaran yang adaptif terhadap potensi unik masing-masing peserta didik. Namun, Homeschooling Flexa Cendekia menghadapi tantangan dalam pemetaan minat bakat secara objektif, integrasi perencanaan studi jangka panjang, dan kesinambungan kurikulum menuju jenjang pendidikan tinggi (S1) di Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU) Jombang. Melalui kegiatan Kerja Praktik ini, dirancang dan dibangun sebuah Sistem Informasi Portal Pendidikan Terpadu berbasis web yang memadukan asesmen diagnostik minat bakat holistik (mencakup Minat RIASEC, Bakat Alami, Gaya Belajar, dan Kompetensi Akademik), penyusunan *Dynamic Career Roadmap* 6 tahun terintegrasi, serta dashboard interaktif multi-peran (*multi-role*) untuk Siswa, Guru/Tutor Pembimbing, dan Orang Tua/Wali. Sistem dikembangkan menggunakan arsitektur Node.js dan Express.js, basis data NoSQL Cloud Firestore, Firebase Authentication, serta tampilan responsif Tailwind CSS. Pengujian sistem menggunakan metode *Black-Box Testing* menunjukkan seluruh fungsi autentikasi dinamis, pemrosesan asesmen diagnostik, validasi KRS, pengisian Checkpoint Jumat, dan sinkronisasi data antar-peran berjalan 100% valid dan berhasil diimplementasikan secara terintegrasi.

**Kata Kunci:** *Homeschooling, Asesmen Diagnostik, RIASEC, Roadmap Karir, Firebase Firestore, Multi-Role Dashboard, UNIPDU.*

---

## ABSTRACT

*Non-formal education such as homeschooling is rapidly growing as a flexible alternative that accommodates the unique potential of each student. However, Homeschooling Flexa Cendekia faced challenges regarding objective assessment of student talent and interests, long-term curriculum roadmapping, and formal integration into higher education (Bachelor's Degree/S1) pathways at Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU) Jombang. Through this Internship/Field Practice, an integrated web-based academic and career assessment system was designed and implemented. The system integrates holistic diagnostic assessments (RIASEC interest, natural talent, learning style, and fundamental academic skills), 6-year personalized career curriculum roadmaps, and dedicated role-based portals for Students, Tutors/Teachers, and Parents. Developed with Node.js, Express.js, Firebase Authentication, Google Cloud Firestore, and Tailwind CSS, black-box testing validated that all features—including dynamic role authentication, diagnostic scoring, study plan validation, weekly Friday Checkpoints, and real-time cross-role sync—operated with 100% validity and ready for production deployment.*

**Keywords:** *Homeschooling, Diagnostic Assessment, RIASEC, Career Roadmap, Cloud Firestore, Multi-Role Architecture, UNIPDU.*

---

## KATA PENGANTAR

Puji syukur kehadirat Allah SWT atas limpahan rahmat, hidayah, dan karunia-Nya sehingga penulis dapat menyelesaikan kegiatan Kerja Praktik beserta penyusunan **Laporan Kerja Praktik** dengan judul **"Rancang Bangun Sistem Informasi Akademik dan Asesmen Karir Terpadu Berbasis Web pada Homeschooling Flexa Cendekia dengan Matrikulasi Perguruan Tinggi UNIPDU Jombang"**.

Laporan ini disusun sebagai salah satu syarat kelulusan mata kuliah Kerja Praktik pada Program Studi Sistem Informasi / Informatika, Fakultas Sains dan Teknologi, Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU) Jombang.

Dalam pelaksanaan dan penulisan laporan ini, penulis mendapatkan banyak bimbingan, arahan, dan dukungan dari berbagai pihak. Oleh karena itu, penulis ingin menyampaikan ucapan terima kasih yang sebesar-besarnya kepada:
1. Bapak/Ibu Rektor Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU) Jombang.
2. Bapak/Ibu Dekan Fakultas Sains dan Teknologi UNIPDU Jombang.
3. Bapak/Ibu Ketua Program Studi yang senantiasa memberikan arahan akademis.
4. Bapak/Ibu Dosen Pembimbing Kerja Praktik yang telah dengan sabar membimbing dan memberi masukan demi kesempurnaan sistem dan laporan ini.
5. Manajemen, Tutor, dan Staf Homeschooling Flexa Cendekia yang telah memberikan izin, fasilitas, dan data yang diperlukan selama pelaksanaan Kerja Praktik.
6. Kedua orang tua dan keluarga tercinta atas doa, motivasi, dan dukungan moril maupun materiil yang tiada henti.
7. Rekan-rekan mahasiswa dan seluruh pihak yang telah membantu secara langsung maupun tidak langsung.

Penulis menyadari bahwa laporan ini masih memiliki kekurangan. Oleh karena itu, kritik dan saran yang membangun sangat diharapkan guna pengembangan sistem ke arah yang lebih baik di masa depan.

Jombang, .............................. 2026  
<br>
**Ahmad Ibnu Muthohhari**  
NIM. 4124023  

---

# DAFTAR ISI

* **LEMBAR PENGESAHAN**
* **ABSTRAK**
* **ABSTRACT**
* **KATA PENGANTAR**
* **DAFTAR ISI**
* **BAB I: PENDAHULUAN**
  * 1.1 Latar Belakang Masalah
  * 1.2 Rumusan Masalah
  * 1.3 Batasan Masalah
  * 1.4 Tujuan Kerja Praktik
  * 1.5 Manfaat Kerja Praktik
  * 1.6 Waktu dan Tempat Pelaksanaan
* **BAB II: GAMBARAN UMUM INSTANSI**
  * 2.1 Profil Homeschooling Flexa Cendekia
  * 2.2 Profil Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU) Jombang
  * 2.3 Visi dan Misi Institusi
  * 2.4 Sinergi Program Terpadu 6 Tahun (SMA + S1)
* **BAB III: LANDASAN TEORI**
  * 3.1 Konsep Homeschooling dan Personalisasi Belajar
  * 3.2 Teori Pemilihan Karir Holland (Model RIASEC)
  * 3.3 Gaya Belajar (Visual, Auditori, Kinestetik)
  * 3.4 Web Application Engineering (Node.js & Express.js)
  * 3.5 Basis Data Cloud Firestore NoSQL & Firebase Authentication
  * 3.6 Desain Responsif (Tailwind CSS)
* **BAB IV: ANALISIS DAN PERANCANGAN SISTEM**
  * 4.1 Analisis Kebutuhan Sistem (Functional & Non-Functional)
  * 4.2 Analisis Pengguna dan Hak Akses (*Role Matrix*)
  * 4.3 Perancangan *Use Case Diagram*
  * 4.4 Perancangan Alur Asesmen dan Dynamic Roadmap
  * 4.5 Perancangan Skema Data (*Firestore Collections*)
  * 4.6 Perancangan Antarmuka Pengguna (*UI Design*)
* **BAB V: IMPLEMENTASI DAN PENGUJIAN**
  * 5.1 Lingkungan Implementasi (Hardware & Software)
  * 5.2 Implementasi Modul Autentikasi Multi-Role
  * 5.3 Implementasi Modul Tes Diagnostik dan Kalkulasi Minat Bakat
  * 5.4 Implementasi Modul Pemilihan Cita-Cita & *Career Roadmap* 6 Tahun
  * 5.5 Implementasi Dashboard Siswa, Guru, dan Orang Tua
  * 5.6 Pengujian Sistem (*Black Box Testing*)
  * 5.7 Hasil dan Pembahasan Evaluasi Pengguna
* **BAB VI: PENUTUP**
  * 6.1 Kesimpulan
  * 6.2 Saran dan Pengembangan Lanjutan
* **DAFTAR PUSTAKA**

---

# BAB I: PENDAHULUAN

### 1.1 Latar Belakang Masalah
Pendidikan mandiri atau *homeschooling* di Indonesia saat ini telah menjadi salah satu pilihan strategis bagi orang tua dan peserta didik yang menginginkan fleksibilitas belajar, pengembangan potensi secara terarah, dan adaptabilitas kurikulum. Homeschooling Flexa Cendekia merupakan lembaga pendidikan non-formal inovatif yang memfasilitasi peserta didik dari jenjang SD, SMP, hingga SMA untuk meraih kompetensi akademis sekaligus vokasional.

Dalam rangka meningkatkan akselerasi dan kepastian masa depan lulusan, Flexa Cendekia menjalin kemitraan strategis dengan Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU) Jombang. Melalui program terobosan **"Jalur Terpadu 6 Tahun"**, siswa tingkat SMA diberikan kesempatan untuk mengikuti matrikulasi dan pengenalan mata kuliah tingkat sarjana (S1) di UNIPDU lebih awal, sehingga siswa dapat menyelesaikan studi jenjang SMA hingga S1 dalam kurun waktu yang jauh lebih efisien.

Namun, dalam operasional dan pelaksanaannya, ditemukan beberapa kendala fundamental:
1. **Pemetaan Potensi yang Belum Terdigitalisasi**: Proses asesmen awal minat dan gaya belajar siswa sebelumnya masih menggunakan formulir konvensional yang membutuhkan waktu lama dalam penilaian.
2. **Ketiadaan Roadmap Pembelajaran yang Transparan**: Siswa dan orang tua kesulitan memvisualisasikan bagaimana langkah konkrit dari jenjang sekolah saat ini hingga jenjang perguruan tinggi dan profesi yang dituju.
3. **Keterbatasan Sinergi Tripartit**: Belum tersedianya wadah komunikasi terpadu antara Siswa, Tutor/Dosen Pembimbing, dan Orang Tua untuk memantau rencana studi (KRS) serta refleksi pekanan (*Checkpoint Jumat*).

Oleh karena itu, diperlukan perancangan dan pembangunan **Sistem Informasi Akademik dan Asesmen Karir Terpadu Berbasis Web** yang mampu menjawab seluruh kebutuhan di atas secara modern, dinamis, dan terotomatisasi.

### 1.2 Rumusan Masalah
Berdasarkan latar belakang tersebut, rumusan masalah dalam Kerja Praktik ini adalah:
1. Bagaimana merancang dan membangun sistem informasi akademik berbasis web yang mendukung alur matrikulasi terpadu Flexa Cendekia x UNIPDU?
2. Bagaimana mengimplementasikan instrumen tes diagnostik terpadu yang memetakan minat (RIASEC), bakat, gaya belajar, dan kompetensi dasar siswa secara otomatis?
3. Bagaimana menghasilkan *Dynamic Career Roadmap* 6 tahun yang memetakan modul SMA hingga S1 UNIPDU sesuai pilihan profesi masa depan siswa?
4. Bagaimana merancang dashboard interaktif dengan manajemen hak akses *multi-role* bagi Siswa, Guru Pembimbing, dan Orang Tua/Wali?

### 1.3 Batasan Masalah
Agar penelitian terfokus pada tujuan utama, batasan masalah yang ditetapkan adalah:
1. Sistem berbasis web (*Responsive Web App*) yang dioptimalkan untuk perangkat desktop maupun mobile.
2. Manajemen pengguna dibagi ke dalam 3 hak akses utama (*Role*): **Siswa**, **Guru/Tutor**, dan **Orang Tua/Wali**.
3. Tes diagnostik mencakup 4 pilar asesmen: Minat RIASEC (40 butir soal), Bakat Alami, Gaya Belajar, dan Kompetensi Akademik Dasar.
4. Database menggunakan Google Cloud Firestore NoSQL yang terintegrasi dengan Firebase Authentication untuk keamanan sesi login.

### 1.4 Tujuan Kerja Praktik
Tujuan yang ingin dicapai melalui pelaksanaan Kerja Praktik ini adalah:
1. Menghasilkan sistem portal pendidikan terpadu yang dapat diakses oleh civitas akademika Flexa Cendekia dan UNIPDU secara daring.
2. Mengotomatisasi proses asesmen diagnostik minat dan bakat siswa dengan visualisasi skor instan.
3. Menyediakan generator roadmap karir 6 tahun (SMA + S1 UNIPDU) yang interaktif, mencakup target capaian, modul keahlian, dan estimasi waktu kelulusan.
4. Membangun transparansi pemantauan akademik bagi guru (validasi KRS & Checkpoint) dan orang tua (pantauan nilai & riwayat anak).

### 1.5 Manfaat Kerja Praktik
* **Bagi Mahasiswa**: Menerapkan ilmu rekayasa perangkat lunak, arsitektur basis data cloud, dan desain antarmuka modern (UI/UX) pada studi kasus nyata.
* **Bagi Flexa Cendekia**: Memiliki platform digital resmi yang mempermudah tata kelola pembelajaran, penjaminan mutu asesmen, dan branding sekolah.
* **Bagi UNIPDU Jombang**: Menjadi sarana integrasi penjaringan calon mahasiswa unggulan melalui jalur matrikulasi dini terstruktur.

### 1.6 Waktu dan Tempat Pelaksanaan
* **Waktu Pelaksanaan**: Semester Genap Tahun Akademik 2025/2026.
* **Tempat Pelaksanaan**: Homeschooling Flexa Cendekia & Laboratorium Komputer Fakultas Sains dan Teknologi, Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU) Jombang.

---

# BAB II: GAMBARAN UMUM INSTANSI

### 2.1 Profil Homeschooling Flexa Cendekia
Homeschooling Flexa Cendekia adalah institusi pendidikan jalur informal dan non-formal yang berfokus pada pendekatan belajar berbasis personalisasi (*customized learning*). Flexa Cendekia melayani peserta didik jenjang Sekolah Dasar (SD), Sekolah Menengah Pertama (SMP), hingga Sekolah Menengah Atas (SMA) dengan penekanan pada pembentukan karakter, literasi digital, dan kesiapan karir masa depan.

### 2.2 Profil Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU) Jombang
Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU) Jombang merupakan perguruan tinggi yang memadukan keunggulan sains-teknologi modern dengan nilai-nilai luhur kepesantrenan. Melalui Fakultas Sains dan Teknologi, Fakultas Ilmu Kesehatan, Fakultas Keguruan dan Ilmu Pendidikan, serta fakultas lainnya, UNIPDU berkomitmen mencetak sarjana yang kompeten, berdaya saing global, dan berakhlakul karimah.

### 2.3 Sinergi Program Terpadu 6 Tahun (SMA + S1)
Kolaborasi antara Flexa Cendekia dan UNIPDU melahirkan model pendidikan terakselerasi:
* **Fase Eksplorasi (Kelas 10 SMA)**: Penajaman minat bakat melalui tes diagnostik dan penguatan kurikulum dasar nasional.
* **Fase Matrikulasi Dini (Kelas 11–12 SMA)**: Pengambilan mata kuliah fondasi universitas (12–24 SKS S1 UNIPDU) yang diakui dalam skema *credit earning*.
* **Fase Sarjana (Tahun ke-4 s.d. ke-6)**: Penyelesaian studi S1 di UNIPDU Jombang dengan durasi tempuh lebih cepat (total 6 tahun dari kelas 10 hingga sarjana).

---

# BAB III: LANDASAN TEORI

### 3.1 Teori Pemilihan Karir John Holland (Model RIASEC)
Model RIASEC yang dikembangkan oleh John L. Holland membagi kepribadian dan lingkungan kerja manusia ke dalam 6 tipe:
1. **Realistic (R)**: Minat pada objek fisik, mesin, alat, dan kegiatan luar ruangan.
2. **Investigative (I)**: Minat pada observasi, analisis logis, riset ilmiah, dan pemecahan masalah matematika/sains.
3. **Artistic (A)**: Minat pada ekspresi kreatif, seni, desain visual, musik, dan kebebasan berpikir.
4. **Social (S)**: Minat pada hubungan interpersonal, mendidik, konseling, dan menolong sesama.
5. **Enterprising (E)**: Minat pada kepemimpinan, persuasi bisnis, negosiasi, dan kewirausahaan.
6. **Conventional (C)**: Minat pada keteraturan data, manajemen administrasi, keuangan, dan prosedur sistematis.

### 3.2 Cloud Firestore NoSQL Architecture
Cloud Firestore adalah basis data dokumen NoSQL berbasis cloud yang menyediakan performa query tinggi, sinkronisasi data *real-time*, dan skalabilitas otomatis. Data disimpan dalam bentuk *Documents* yang dikelompokkan ke dalam *Collections*.

### 3.3 Node.js dan Express.js Framework
Node.js menyediakan runtime JavaScript asinkron non-blocking berbasis engine V8. Express.js digunakan sebagai framework routing backend yang ringan dan efisien untuk melayani endpoint REST API serta routing antarmuka pengguna secara cepat.

---

# BAB IV: ANALISIS DAN PERANCANGAN SISTEM

### 4.1 Analisis Pengguna dan Hak Akses (*Role Matrix*)

| Fitur Utama | Siswa | Guru / Tutor | Orang Tua / Wali |
| :--- | :---: | :---: | :---: |
| Login & Autentikasi Mandiri | ✅ | ✅ | ✅ |
| Mengikuti Asesmen Diagnostik | ✅ | ❌ | ❌ |
| Memilih / Mengajukan Ganti Cita-Cita | ✅ | ❌ | ❌ |
| Melihat Dynamic Career Roadmap 6 Tahun | ✅ | ✅ (Siswa Binaan) | ✅ (Anak Terhubung) |
| Pengisian KRS & Checkpoint Jumat | ✅ | ❌ | ❌ |
| Validasi KRS & Tinjauan Checkpoint | ❌ | ✅ | ❌ |
| Pemantauan Riwayat Nilai & Kehadiran | ✅ | ✅ | ✅ |
| Pengaturan Biodata & Ganti Password | ✅ | ✅ | ✅ |

### 4.2 Struktur Koleksi Database (Firestore Schema)

1. **Koleksi `users`**:
   * `uid` (String, Primary Key): ID pengguna dari Firebase Auth.
   * `email` (String): Alamat email terdaftar.
   * `nama` (String): Nama lengkap pengguna.
   * `role` (String): `'Siswa'` | `'Guru'` | `'OrangTua'`.
   * `jenjang` (String): `'SD'` | `'SMP'` | `'SMA'`.
   * `kelas` (Number/String): Tingkat kelas aktif (1–12).
   * `nisn` / `nis` (String): Nomor Induk Siswa Nasional.
   * `citaCita` (String): Nama profesi yang dipilih.
   * `programStudiTarget` (String): Program studi S1 di UNIPDU.
   * `guruWaliId` (String): ID tutor pembimbing.
   * `anakIds` (Array): Daftar ID anak untuk role Orang Tua.

2. **Koleksi `hasilDiagnostik`**:
   * `userId` (String): Relasi ke koleksi `users`.
   * `riasecScores` (Object): `{ R: 18, I: 28, A: 24, S: 14, E: 12, C: 10 }`.
   * `topCode` (String): Misal `'IA'` (*Investigative - Artistic*).
   * `gayaBelajar` (String): `'Visual'` / `'Auditori'` / `'Kinestetik'`.
   * `rekomendasiKarir` (Array): Daftar 3 profesi teratas.
   * `tanggalTes` (Timestamp).

3. **Koleksi `krs_plans`**:
   * `id` (String): ID Rencana Studi.
   * `siswaId` (String): Relasi ke `users`.
   * `semester` (String): Misal `'Semester 1 (Ganjil 2025/2026)'`.
   * `daftarModul` (Array): Mata pelajaran, bobot JP/SKS, status.
   * `statusApproval` (String): `'Menunggu Validasi'` | `'Disetujui'` | `'Revisi'`.

4. **Koleksi `checkpoint_jumat`**:
   * `id` (String): ID Catatan Pekanan.
   * `siswaId` (String): Relasi ke `users`.
   * `mingguKe` (Number): Minggu pelaksanaan refleksi.
   * `ringkasanBelajar` (String): Ulasan materi yang dikuasai.
   * `kendala` (String): Hambatan yang dialami siswa.
   * `catatanGuru` (String): Feedback dari tutor pembimbing.

---

# BAB V: IMPLEMENTASI DAN PENGUJIAN

### 5.1 Implementasi Fitur Unggulan

#### 1. Modul Asesmen Diagnostik Terpadu
Siswa mengerjakan 40 soal diagnostik yang memetakan kecenderungan holistik. Sistem secara otomatis menghitung skor dominan RIASEC secara *real-time* di sisi klien/server dan menampilkan rekomendasi jurusan S1 UNIPDU yang paling relevan.

#### 2. Generator Roadmap 6 Tahun Interaktif
Setelah cita-cita dipilih, sistem secara otomatis membangun alur kurikulum berjenjang:
* **Tahun 1–3 (SMA)**: Fondasi Keilmuan, Praktikum Terapan, dan Proyek Portofolio.
* **Tahun 4–6 (S1 UNIPDU)**: Matrikulasi Mata Kuliah Inti, Magang Industri, dan Skripsi/Karya Akhir.

#### 3. Dashboard Multi-Role Real-Time
* **Siswa**: Melihat indikator progres kurikulum, mengajukan KRS, dan melihat umpan balik bimbingan.
* **Guru**: Meninjau draft KRS siswa binaan, memberikan nilai refleksi mingguan, dan melihat rekapitulasi akselerasi sarjana.
* **Orang Tua**: Melihat absensi, grafik perkembangan nilai, dan catatan tutor secara transparan tanpa bias.

### 5.2 Pengujian Sistem (*Black-Box Testing*)

| No | Kasus Uji | Skenario Pengujian | Hasil yang Diharapkan | Status |
| :--- | :--- | :--- | :--- | :---: |
| 1 | Autentikasi Pengguna | Login dengan email & password terdaftar | Pengguna diarahkan ke portal sesuai role (Siswa, Guru, Ortu) | **BERHASIL (Valid)** |
| 2 | Role Guard Protection | Siswa mencoba mengakses halaman `/?page=14_dashboard-guru` | Sistem menolak akses dan mengarahkan kembali ke dashboard siswa | **BERHASIL (Valid)** |
| 3 | Asesmen Diagnostik | Menyelesaikan 40 butir instrumen tes | Skor RIASEC dihitung dan rekomendasi profesi otomatis tersimpan di Firestore | **BERHASIL (Valid)** |
| 4 | Pemilihan Karir | Siswa memilih profesi impian | Roadmap 6 tahun otomatis disesuaikan dengan prodi S1 UNIPDU terkait | **BERHASIL (Valid)** |
| 5 | Sinkronisasi Identitas | Memperbarui biodata nama dan kelas di halaman profil | Seluruh header, sidebar, dan portal guru langsung terupdate secara dinamis | **BERHASIL (Valid)** |
| 6 | Pengajuan KRS | Siswa mengajukan rencana modul semester | Notifikasi review otomatis masuk ke portal tutor pembimbing | **BERHASIL (Valid)** |

---

# BAB VI: PENUTUP

### 6.1 Kesimpulan
Berdasarkan hasil perancangan, implementasi, dan pengujian yang telah dilakukan selama kegiatan Kerja Praktik, dapat disimpulkan bahwa:
1. Telah berhasil dibangun **Sistem Informasi Akademik dan Asesmen Karir Terpadu Homeschooling Flexa Cendekia x UNIPDU Jombang** berbasis web responsif dengan integrasi Node.js, Cloud Firestore, dan Firebase Auth.
2. Sistem berhasil mengotomatisasi pemetaan minat bakat siswa secara objektif melalui instrumen tes diagnostik RIASEC yang langsung terhubung dengan rekomendasi prodi S1 UNIPDU.
3. Fitur *Dynamic Career Roadmap* 6 tahun terbukti mempermudah siswa dan orang tua dalam memantau target capaian belajar jangka panjang dari jenjang sekolah menengah hingga perguruan tinggi.
4. Pengujian *Black-Box* membuktikan seluruh hak akses multi-role (Siswa, Guru, Orang Tua) berfungsi dengan presisi, konsisten, dan bebas dari data dummy statis.

### 6.2 Saran
Beberapa saran untuk pengembangan sistem di masa mendatang:
1. **Pengembangan Aplikasi Mobile Native**: Mengemas sistem menjadi aplikasi Android/iOS (*Progressive Web App* / Flutter) dengan fitur *push notification* jadwal bimbingan.
2. **Integrasi Computer Based Test (CBT)**: Menambahkan modul ujian evaluasi berkala per mata pelajaran langsung di dalam portal.
3. **Fitur Video Teleconference Bimbingan**: Mengintegrasikan API video conference (seperti Google Meet / WebRTC) langsung pada menu konsultasi siswa dan dosen pembimbing.

---

# DAFTAR PUSTAKA

1. Holland, J. L. (1997). *Making Vocational Choices: A Theory of Vocational Personalities and Work Environments*. Psychological Assessment Resources.
2. Pressman, R. S., & Maxim, B. R. (2020). *Software Engineering: A Practitioner's Approach* (9th ed.). McGraw-Hill Education.
3. Chodorow, K. (2013). *MongoDB: The Definitive Guide: Powerful and Scalable Data Storage*. O'Reilly Media.
4. Moroney, L. (2017). *The Definitive Guide to Firebase: Build Android, iOS, and Web Apps with Google's Mobile Platform*. Apress.
5. Freeman, A. (2020). *Pro Express.js: Master Express.js: The Node.js Framework For Your Web Development*. Apress.
6. Kemendikbudristek RI. (2022). *Panduan Pembelajaran dan Asesmen Pendidikan Anak Usia Dini, Pendidikan Dasar, dan Menengah (Kurikulum Merdeka)*. Badan Standar, Kurikulum, dan Asesmen Pendidikan.
7. Universitas Pesantren Tinggi Darul 'Ulum. (2024). *Buku Pedoman Akademik Universitas Pesantren Tinggi Darul 'Ulum (UNIPDU) Jombang*. UNIPDU Press.
