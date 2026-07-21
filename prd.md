
FLEXA CENDEKIA  ×  UNIPDU
Ekosistem Belajar Homeschooling
PRODUCT REQUIREMENTS DOCUMENT (PRD)
Generator Roadmap 6 Tahun Adaptif Menuju Cita-Cita Profesi
Versi Dokumen
0.1 — Draf Awal
Status
Untuk Diskusi Internal — Belum Final
Tanggal
12 Juli 2026
 
Daftar Isi
Daftar Isi	2
1. Ringkasan Eksekutif	3
2. Latar Belakang & Problem Statement	3
2.1 Masalah yang Dihadapi	3
2.2 Peluang	3
3. Visi & Tujuan Produk	4
3.1 Visi	4
3.2 Tujuan Produk	4
4. Target Pengguna & Peran	4
5. Ruang Lingkup Produk	5
5.1 Termasuk dalam Lingkup (In-Scope)	5
5.2 Di Luar Lingkup (Out-of-Scope) untuk Versi Awal	5
6. Alur Pengguna Utama (User Flow)	5
7. Struktur Waktu Roadmap	6
8. Jenjang Pendidikan	6
9. Tes Diagnosis	7
9.1 Apa yang Diukur	7
9.2 Format	7
10. Mesin Generate Roadmap	7
10.1 Pendekatan	7
10.2 Cara Kerja	7
11. Model KRS Semester & Sistem Adaptif	8
11.1 Model KRS per Semester	8
11.2 Aturan Perubahan Cita-Cita per Jenjang	8
12. Sumber Materi Belajar	8
13. Validasi Progres & Checkpoint Mingguan	8
14. Sistem Poin & Gamifikasi	9
15. Notifikasi	9
16. SSO & Integrasi Akun	10
17. Kurikulum	10
18. Legalitas Homeschooling	10
19. Data Pribadi & Persetujuan (Consent)	11
20. Platform & Aksesibilitas	11
21. Model Bisnis	11
22. Metrik Keberhasilan Produk (KPI)	12
23. Struktur Data (Data Model) — Gambaran Awal	13
24. Asumsi & Pertanyaan Terbuka	14
25. Lampiran: Glosarium	15

Catatan: klik kanan pada daftar isi di atas lalu pilih "Update Field" saat pertama kali membuka dokumen ini di Microsoft Word agar nomor halaman tampil.
 
1. Ringkasan Eksekutif
Aplikasi ini adalah generator roadmap belajar 6 tahun yang dirancang khusus untuk siswa homeschooling jenjang SD, SMP, dan SMA. Roadmap disusun otomatis setelah siswa mengikuti tes diagnosis, lalu diterjemahkan menjadi target bertingkat — harian, mingguan (checkpoint setiap hari Jumat), bulanan, semester (model KRS), hingga tahunan — yang seluruhnya mengarah pada satu tujuan akhir: profesi cita-cita siswa.
Roadmap bersifat adaptif. Ketika cita-cita siswa berubah, sistem menyusun ulang rencana ke depan tanpa mengubah riwayat yang sudah berjalan, dengan persetujuan guru pembimbing. Aplikasi terintegrasi dengan aplikasi utama perusahaan, Flexa Cendekia, melalui Single Sign-On (SSO) sehingga satu akun dapat digunakan di kedua aplikasi tanpa pendaftaran ulang.
Produk ini dikembangkan sebagai kolaborasi Flexa Cendekia dan UNIPDU, dengan tiga peran pengguna utama: Siswa, Guru Pembimbing, dan Orang Tua, serta dilengkapi sistem gamifikasi dan notifikasi untuk mendorong konsistensi belajar harian.
2. Latar Belakang & Problem Statement
2.1 Masalah yang Dihadapi
•	Siswa homeschooling sering belajar tanpa arah yang jelas menuju cita-cita profesi yang mereka inginkan.
•	Orang tua kesulitan memantau perkembangan belajar anak secara terstruktur dan berkelanjutan.
•	Guru pembimbing kesulitan menyusun dan menyesuaikan kurikulum secara individual untuk setiap siswa, terutama saat minat atau cita-cita siswa berubah.
•	Belum ada alat yang menghubungkan hasil diagnosis minat/bakat siswa dengan rencana belajar konkret jangka panjang (multi-tahun).
2.2 Peluang
•	Basis pengguna yang sudah ada di ekosistem Flexa Cendekia dapat langsung diaktifkan lewat SSO tanpa akuisisi pengguna baru dari nol.
•	Kolaborasi dengan UNIPDU memberi kredibilitas akademik pada bank soal tes diagnosis dan validasi kurikulum.
•	Model KRS per semester yang familiar bagi guru mempermudah adopsi tanpa kurva belajar yang curam.
 
3. Visi & Tujuan Produk
3.1 Visi
Menjadi pendamping belajar mandiri yang mengubah cita-cita profesi setiap siswa homeschooling menjadi langkah nyata yang bisa dijalani setiap hari, terintegrasi penuh dalam ekosistem Flexa Cendekia.
3.2 Tujuan Produk
1.	Menghasilkan roadmap belajar 6 tahun yang personal, berbasis hasil tes diagnosis dan cita-cita profesi siswa.
2.	Memecah tujuan jangka panjang menjadi target harian, mingguan, bulanan, semester, dan tahunan yang dapat dijalankan dan dipantau.
3.	Memungkinkan penyesuaian roadmap secara adaptif ketika cita-cita siswa berubah, tanpa kehilangan riwayat capaian sebelumnya.
4.	Melibatkan guru dan orang tua dalam proses pemantauan dan persetujuan perubahan rencana belajar.
5.	Mendorong konsistensi belajar harian melalui gamifikasi dan notifikasi.
4. Target Pengguna & Peran
Terdapat tiga peran utama dalam aplikasi ini, masing-masing dengan akses dan kewenangan yang berbeda.
Peran	Deskripsi	Akses & Kewenangan Utama
Siswa	Pengguna utama, jenjang SD/SMP/SMA, homeschooling	Mengikuti tes diagnosis; menjalani & mencentang target harian; mengajukan perubahan cita-cita; melihat poin/badge
Guru Pembimbing	Pendamping akademik siswa	Meninjau & menyetujui KRS semester; menyetujui perubahan cita-cita; menilai/meninjau checkpoint mingguan; menyesuaikan roadmap
Orang Tua	Wali siswa	Melihat progres anak (read-only); menerima notifikasi keterlambatan & perubahan cita-cita; memantau lebih dari satu anak dalam satu akun
 
5. Ruang Lingkup Produk
5.1 Termasuk dalam Lingkup (In-Scope)
•	Tes diagnosis minat, bakat, gaya belajar, dan level kompetensi dasar per jenjang.
•	Mesin generate roadmap 6 tahun otomatis berbasis hasil diagnosis dan cita-cita profesi.
•	Struktur target bertingkat: harian, mingguan (checkpoint Jumat), bulanan, semester (KRS), tahunan.
•	Alur adaptif untuk perubahan cita-cita, lengkap dengan persetujuan guru.
•	Login SSO dengan aplikasi Flexa Cendekia (satu akun, dua aplikasi).
•	Dashboard untuk tiga peran: Siswa, Guru, Orang Tua.
•	Sistem poin, badge, streak, dan leaderboard opsional.
•	Notifikasi pengingat harian, checkpoint mingguan, keterlambatan, dan pengajuan perubahan cita-cita.
5.2 Di Luar Lingkup (Out-of-Scope) untuk Versi Awal
•	Aplikasi tidak menerbitkan ijazah atau menggantikan jalur pendidikan formal/kesetaraan.
•	Aplikasi bukan Learning Management System (LMS) penuh — tidak memproduksi konten belajar sendiri di versi awal, hanya mengkurasi dan menautkan.
•	Fitur pembayaran/monetisasi pihak ketiga belum termasuk di versi awal.
6. Alur Pengguna Utama (User Flow)
6.	Siswa login menggunakan akun Flexa Cendekia melalui SSO — tanpa pendaftaran ulang.
7.	Jika siswa baru pertama kali menggunakan aplikasi roadmap, sistem mengarahkan ke Tes Diagnosis sesuai jenjang (SD / SMP–SMA).
8.	Siswa memilih atau memasukkan cita-cita profesi yang diinginkan.
9.	Sistem menghasilkan roadmap 6 tahun: milestone tahunan penuh, dengan rincian semester berjalan (model KRS) yang siap dijalankan.
10.	Guru pembimbing meninjau dan menyetujui KRS semester pertama sebelum aktif.
11.	Siswa menjalani target harian; setiap hari Jumat ada checkpoint mingguan untuk validasi capaian.
12.	Orang tua memantau progres melalui dashboard read-only dan menerima notifikasi relevan.
13.	Jika cita-cita berubah, siswa mengajukan perubahan → guru meninjau → semester berjalan direvisi sebagian, semester berikutnya digenerate ulang.
14.	Di akhir semester, hasil menjadi riwayat permanen; siklus KRS berlanjut ke semester berikutnya.
 
7. Struktur Waktu Roadmap
Roadmap 6 tahun disusun berlapis dari unit waktu terbesar ke terkecil, sehingga rencana jangka panjang tetap bisa diterjemahkan menjadi aktivitas nyata sehari-hari.
Tingkat	Fungsi	Titik Kunci
Tahun Ajaran	Milestone besar menuju cita-cita profesi	1 dari 6 tahun roadmap
Semester (KRS)	Unit rencana yang bisa disusun ulang tanpa mengacak seluruh roadmap	Ditinjau & disetujui guru di awal semester
Bulan	Kelompok tema belajar dalam semester	Evaluasi progres bulanan
Minggu	Siklus target dengan checkpoint validasi	Checkpoint jatuh setiap hari Jumat
Harian	Aktivitas belajar konkret dan tercentang	Self-report progres + poin gamifikasi
Checkpoint mingguan di hari Jumat berfungsi sebagai batas evaluasi: progres Senin–Jumat diarahkan untuk memenuhi target mingguan yang divalidasi pada hari itu, baik lewat kuis singkat maupun tinjauan guru.
8. Jenjang Pendidikan
Roadmap 6 tahun dipetakan mengikuti struktur jenjang pendidikan Indonesia (SD, SMP, SMA) dengan kurikulum bebas/fleksibel, tidak terikat pada satu kurikulum baku.
Jenjang	Durasi Roadmap	Titik Mulai
SD	6 tahun (kelas 1–6)	Tes diagnosis di awal masuk aplikasi
SMP–SMA	6 tahun berkelanjutan (kelas 7–12)	Tes diagnosis ulang saat masuk SMP
Siswa yang bergabung di tengah jenjang (misalnya mulai di kelas 8) akan mendapat roadmap yang otomatis menyesuaikan sisa tahun yang tersedia, bukan dipaksakan penuh 6 tahun.
 
9. Tes Diagnosis
9.1 Apa yang Diukur
•	Minat & bakat (kerangka sederhana mirip RIASEC/Holland Code).
•	Gaya belajar: visual, auditori, atau kinestetik.
•	Level kompetensi dasar literasi dan numerasi sesuai jenjang.
9.2 Format
•	SD: soal pilihan ganda bergaya visual dan gamified.
•	SMP–SMA: kombinasi pilihan ganda dan skenario situasional yang lebih tekstual.
•	Durasi 20–40 menit tergantung jenjang.
•	Bank soal disusun tim internal bersama pihak akademik UNIPDU untuk menjaga validitas psikometrik.
•	Tes dapat diulang maksimal satu kali per semester, atau atas rekomendasi guru pembimbing.
10. Mesin Generate Roadmap
10.1 Pendekatan
Mesin roadmap menggunakan pendekatan hybrid: rule-based dari basis data "peta profesi menuju kompetensi per jenjang" yang dikurasi tim kurikulum dan guru, dipadukan dengan personalisasi pacing (kecepatan belajar) berdasarkan hasil tes diagnosis siswa.
10.2 Cara Kerja
15.	Sistem melakukan backward mapping dari profesi cita-cita: kompetensi apa yang dibutuhkan di jenjang akhir, lalu diturunkan mundur ke kompetensi per tahun, semester, hingga minggu.
16.	Kerangka 6 tahun digenerate sekaligus sebagai milestone tahunan agar arah besar terlihat jelas sejak awal.
17.	Rincian sampai tingkat harian hanya digenerate per semester berjalan, selaras dengan model KRS, agar roadmap tetap mudah disesuaikan bila terjadi perubahan cita-cita.
18.	Pacing (kecepatan & beban target) disesuaikan dengan hasil diagnosis gaya belajar dan level kompetensi awal siswa.
 
11. Model KRS Semester & Sistem Adaptif
11.1 Model KRS per Semester
Setiap semester berfungsi sebagai unit rencana mandiri, mengikuti pola Kartu Rencana Studi (KRS) yang familiar bagi guru. Ini memungkinkan roadmap disusun ulang secara parsial tanpa mengacak seluruh rencana 6 tahun.
•	Semester yang sudah lewat tetap menjadi riwayat/rapor tetap dan tidak berubah.
•	Semester yang sedang berjalan dapat disesuaikan sebagian, yaitu untuk sisa minggu ke depan.
•	Semester berikutnya digenerate ulang secara otomatis mengikuti cita-cita terbaru.
•	Guru pembimbing meninjau dan menyetujui KRS baru sebelum aktif dijalankan siswa.
11.2 Aturan Perubahan Cita-Cita per Jenjang
Jenjang	Frekuensi Perubahan	Alasan
SD	Lebih longgar, dapat diajukan tiap semester	Fase eksplorasi minat, wajar sering berubah
SMP–SMA	Dibatasi, maksimal 1–2 kali per tahun ajaran	Roadmap makin spesifik, investasi waktu belajar lebih besar
Seluruh pengajuan perubahan cita-cita tetap melalui proses persetujuan guru pembimbing, dengan tingkat ketat yang berbeda sesuai jenjang.
12. Sumber Materi Belajar
Aplikasi berperan sebagai planner dan kurator, bukan Learning Management System (LMS) penuh di versi awal. Setiap target harian berisi rekomendasi topik atau aktivitas belajar yang ditautkan ke sumber materi, antara lain:
•	Konten yang tersedia di aplikasi Flexa Cendekia (lewat integrasi akun SSO).
•	Sumber terbuka resmi, misalnya platform belajar milik Kemdikbud.
•	Buku pegangan atau materi yang dipakai keluarga homeschooling masing-masing.
•	Materi tambahan yang diunggah atau ditautkan sendiri oleh guru pembimbing atau orang tua.
13. Validasi Progres & Checkpoint Mingguan
•	Target harian divalidasi lewat self-report checklist sederhana oleh siswa.
•	Target mingguan divalidasi pada checkpoint hari Jumat, melalui kuis atau tugas singkat yang dinilai otomatis atau ditinjau guru.
•	Target yang tidak tercapai pada minggu berjalan otomatis digeser sebagian ke minggu berikutnya, tetap tercatat dalam riwayat untuk bahan evaluasi guru — tidak menumpuk tanpa batas.
 
14. Sistem Poin & Gamifikasi
•	Poin diperoleh dari: menyelesaikan target harian, mencapai checkpoint mingguan (Jumat), menyelesaikan tes diagnosis, dan konsistensi (streak harian/mingguan).
•	Level dan badge terkait progres menuju profesi cita-cita, misalnya "Pemula", "Konsisten", hingga "Calon [nama profesi]".
•	Leaderboard bersifat opsional, per kelas atau per jenjang, dengan fokus tetap pada progres individu, bukan kompetisi murni antar siswa.
15. Notifikasi
Jenis Notifikasi	Penerima	Pemicu
Pengingat target harian	Siswa	Target harian belum diselesaikan menjelang akhir hari
Pengingat checkpoint mingguan	Siswa	H-1 atau pagi hari Jumat
Alert keterlambatan	Orang Tua	Anak tertinggal target beberapa hari berturut-turut
Alert pengajuan perubahan cita-cita	Guru	Siswa mengajukan perubahan cita-cita yang perlu ditinjau
 
16. SSO & Integrasi Akun
Aplikasi menggunakan Single Sign-On (SSO) dengan aplikasi utama perusahaan, Flexa Cendekia. Satu akun pengguna dapat login di kedua aplikasi tanpa perlu mendaftar ulang.
•	Autentikasi terpusat dikelola oleh Flexa Cendekia sebagai identity provider.
•	Data profil dasar (nama, jenjang, kelas) disinkronkan otomatis dari akun Flexa Cendekia saat login pertama.
•	Akun orang tua dapat terhubung ke satu atau lebih akun anak dalam satu dashboard.
17. Kurikulum
Aplikasi menganut prinsip kurikulum bebas/fleksibel — tidak terikat pada satu kurikulum resmi tunggal. Target belajar diturunkan dari kompetensi yang dibutuhkan menuju profesi cita-cita, bukan dari mengikuti buku teks tertentu secara kaku, sehingga cocok dengan beragam pendekatan homeschooling yang dianut keluarga siswa.
18. Legalitas Homeschooling
Di Indonesia, pendidikan homeschooling umumnya perlu terdaftar di Pusat Kegiatan Belajar Masyarakat (PKBM) agar siswa dapat mengikuti ujian kesetaraan Paket A/B/C dan memperoleh ijazah resmi. Aplikasi ini diposisikan sebagai alat pengembangan diri dan pendamping belajar mandiri — bukan pengganti jalur pendidikan formal.
•	Roadmap dapat diselaraskan secara garis besar dengan Standar Kompetensi Lulusan (SKL) agar tetap relevan bila siswa mengikuti ujian kesetaraan lewat PKBM.
•	Aplikasi tidak menerbitkan ijazah atau dokumen kelulusan resmi.
 
19. Data Pribadi & Persetujuan (Consent)
Karena pengguna utama adalah anak-anak, pengelolaan data pribadi mengikuti prinsip kehati-hatian ekstra dan tunduk pada Undang-Undang Pelindungan Data Pribadi (UU PDP).
•	Wajib persetujuan orang tua/wali pada saat pendaftaran akun siswa.
•	Kebijakan privasi disampaikan secara eksplisit dan mudah dipahami, termasuk oleh orang tua.
•	Data disimpan selama akun aktif, dengan opsi orang tua mengajukan penghapusan data anak.
•	Akses data dibatasi sesuai peran — guru dan orang tua hanya melihat data yang relevan dengan siswa yang diampu/diasuh.
20. Platform & Aksesibilitas
•	Prioritas awal: web app responsif, selaras dengan alur SSO dari aplikasi utama.
•	Aplikasi mobile (Android/iOS) menyusul pada fase berikutnya.
•	Dukungan offline minimal: pengisian target harian tetap bisa dilakukan tanpa koneksi internet, lalu tersinkronisasi otomatis saat kembali online.
•	Satu akun orang tua dapat terhubung dan memantau lebih dari satu anak sekaligus (dashboard multi-anak).
21. Model Bisnis
Diposisikan sebagai fitur/bundel dalam ekosistem Flexa Cendekia, bukan produk berbayar terpisah — siswa yang sudah terdaftar di Flexa Cendekia otomatis mendapat akses lewat SSO. UNIPDU berperan dalam validasi konten kurikulum dan psikometri tes diagnosis.
Catatan: bagian ini masih berupa asumsi awal dan perlu dikonfirmasi oleh tim bisnis sebelum menjadi keputusan final.
 
22. Metrik Keberhasilan Produk (KPI)
Metrik	Definisi
Tingkat penyelesaian target harian	Persentase target harian yang ditandai selesai oleh siswa
Tingkat pencapaian checkpoint mingguan	Persentase checkpoint Jumat yang berhasil divalidasi tepat waktu
Retensi mingguan/bulanan	Proporsi siswa yang tetap aktif menggunakan aplikasi dari waktu ke waktu
Waktu rata-rata approval guru	Kecepatan guru meninjau & menyetujui KRS semester atau perubahan cita-cita
Kepuasan orang tua	Diukur lewat survei berkala terhadap fitur pemantauan
Pencapaian milestone tahunan	Jumlah/persentase siswa yang mencapai milestone tahunan sesuai roadmap
 
23. Struktur Data (Data Model) — Gambaran Awal
Tabel berikut merupakan gambaran entitas utama pada tingkat konsep, sebagai titik awal untuk tim teknis merancang skema basis data secara detail.
Entitas	Deskripsi Singkat	Relasi Utama
Akun (User)	Identitas terpusat dari SSO Flexa Cendekia	1 akun → banyak peran (siswa/guru/orang tua)
Siswa	Profil siswa: jenjang, kelas, jenjang aktif	1 siswa → 1 roadmap aktif per jenjang
Hasil Diagnosis	Skor minat/bakat, gaya belajar, kompetensi dasar	1 siswa → banyak riwayat tes (per jenjang/semester)
Cita-Cita (Profesi)	Profesi target siswa saat ini & riwayat perubahan	1 siswa → banyak riwayat cita-cita
Peta Profesi–Kompetensi	Basis data kompetensi yang dibutuhkan per profesi & jenjang	1 profesi → banyak kompetensi bertingkat
Roadmap	Rencana 6 tahun: milestone tahunan	1 siswa → 1 roadmap aktif
Semester (KRS)	Unit rencana per semester	1 roadmap → banyak semester
Target Mingguan	Target dengan checkpoint di hari Jumat	1 semester → banyak minggu
Target Harian	Aktivitas belajar harian tercentang	1 minggu → banyak target harian
Poin & Badge	Catatan poin, level, dan badge siswa	1 siswa → banyak transaksi poin
Notifikasi	Log pengingat & alert ke tiap peran	1 akun → banyak notifikasi
Approval Guru	Catatan persetujuan KRS/perubahan cita-cita	1 guru → banyak approval, tertaut ke siswa
 
24. Asumsi & Pertanyaan Terbuka
Poin-poin berikut adalah usulan/asumsi awal dari proses diskusi penyusunan PRD ini dan perlu dikonfirmasi bersama tim sebelum masuk ke tahap desain teknis rinci.
Area	Asumsi / Usulan Awal	Perlu Konfirmasi Dari
Target pasar awal	Siswa homeschooling yang sudah punya akun Flexa Cendekia	Tim Produk & Bisnis
Penyusun bank soal diagnosis	Tim internal bersama pihak akademik UNIPDU	Tim UNIPDU
Sumber materi belajar	Kurasi & tautan, bukan LMS penuh di versi awal	Tim Produk
Batas perubahan cita-cita SMP–SMA	Maksimal 1–2 kali per tahun ajaran	Tim Kurikulum & Guru
Model bisnis	Bundel dalam ekosistem Flexa Cendekia, bukan produk berbayar terpisah	Tim Bisnis
Keselarasan dengan PKBM/SKL	Selaras garis besar, tidak menerbitkan ijazah	Tim Legal & Akademik
Platform awal	Web app responsif terlebih dahulu, mobile menyusul	Tim Teknis
 
25. Lampiran: Glosarium
Istilah	Penjelasan
Roadmap	Rencana belajar 6 tahun menuju profesi cita-cita siswa
Checkpoint Mingguan	Titik evaluasi target mingguan, jatuh setiap hari Jumat
KRS (Kartu Rencana Studi)	Model pengambilan rencana belajar per semester, dapat disusun ulang tiap periode
Tes Diagnosis	Tes awal untuk mengukur minat, bakat, gaya belajar, dan kompetensi dasar siswa
SSO (Single Sign-On)	Mekanisme satu akun untuk login ke lebih dari satu aplikasi
Backward Mapping	Teknik menyusun roadmap dengan memetakan mundur dari tujuan akhir (profesi) ke langkah-langkah awal
Kurikulum Bebas	Pendekatan belajar yang tidak terikat pada satu kurikulum resmi tunggal
PKBM	Pusat Kegiatan Belajar Masyarakat, lembaga penyelenggara jalur pendidikan kesetaraan

