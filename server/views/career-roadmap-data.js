/**
 * Flexa Cendekia x UNIPDU — Career Roadmap Data Store & Generator
 * Menyediakan data cita-cita, kurikulum 6 tahun, timeline, milestone, dan resource belajar.
 */
(function() {
    'use strict';

    // 1. Data 36 Profesi Lengkap (Sumber: 05_pilih-cita-cita.html)
    const allCareers = [
        // Sosial & Hukum
        { id: 'polisi', title: 'Polisi', category: 'Sosial & Hukum', icon: 'local_police', desc: 'Menegakkan hukum dan menjaga ketertiban masyarakat.', img: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?q=80&w=600&auto=format&fit=crop', pt: 'Akademi Kepolisian. Fokus: Hukum, Strategi, & Kepemimpinan.', sma: 'Fokus: PKN, Olahraga, & Sosiologi.', kegiatan: ['Paskibra', 'Pramuka'], quote: '"Melindungi dan mengayomi masyarakat sepenuh hati."' },
        { id: 'tentara', title: 'Tentara', category: 'Sosial & Hukum', icon: 'military_tech', desc: 'Mempertahankan kedaulatan negara dari berbagai ancaman.', img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop', pt: 'Akademi Militer. Fokus: Strategi Militer, Ketahanan, & Kepemimpinan.', sma: 'Fokus: Olahraga, PKN, & Fisika.', kegiatan: ['Paskibra', 'Bela Diri'], quote: '"Mengabdi untuk negara adalah panggilan jiwa tertinggi."' },
        { id: 'hakim', title: 'Hakim', category: 'Sosial & Hukum', icon: 'gavel', desc: 'Memimpin jalannya sidang dan memutuskan perkara.', img: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop', pt: 'S1 Hukum. Fokus: Hukum Pidana/Perdata, Etika Profesi.', sma: 'Fokus: PKN, Bahasa, & Sosiologi.', kegiatan: ['Debat', 'OSIS'], quote: '"Keadilan harus ditegakkan walaupun langit runtuh."' },
        { id: 'pengacara', title: 'Pengacara', category: 'Sosial & Hukum', icon: 'balance', desc: 'Memberikan nasihat hukum dan mewakili klien.', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop', pt: 'S1 Hukum. Fokus: Hukum Perdata, Pidana, & Ketatanegaraan.', sma: 'Fokus: PKN, Sosiologi, & Bahasa Indonesia.', kegiatan: ['Debat', 'Moot Court'], quote: '"Hukum adalah perisai bagi yang lemah dan pedang bagi keadilan."' },
        { id: 'diplomat', title: 'Diplomat', category: 'Sosial & Hukum', icon: 'public', desc: 'Mewakili dan melindungi kepentingan negara di luar negeri.', img: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=600&auto=format&fit=crop', pt: 'S1 Hubungan Internasional. Fokus: Diplomasi, Hukum Internasional, & Politik Global.', sma: 'Fokus: Bahasa Asing, Sejarah, & PKN.', kegiatan: ['Model United Nations', 'English Club'], quote: '"Diplomasi adalah seni membangun jembatan antar bangsa."' },
        { id: 'pekerja_sosial', title: 'Pekerja Sosial', category: 'Sosial & Hukum', icon: 'volunteer_activism', desc: 'Membantu individu dan keluarga mengatasi masalah sosial.', img: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=600&auto=format&fit=crop', pt: 'S1 Kesejahteraan Sosial. Fokus: Intervensi Sosial, Advokasi.', sma: 'Fokus: Sosiologi, PKN, & Bahasa.', kegiatan: ['Relawan', 'PMR'], quote: '"Perubahan sosial dimulai dari satu tangan yang terulur."' },

        // Kesehatan
        { id: 'dokter', title: 'Dokter', category: 'Kesehatan', icon: 'stethoscope', desc: 'Mendiagnosis, merawat, dan mencegah penyakit pada manusia.', img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop', pt: 'S1 Kedokteran. Fokus: Anatomi, Fisiologi, & Patologi Manusia.', sma: 'Fokus: Biologi Medis, Kimia Organik, & Fisika.', kegiatan: ['PMR', 'Olimpiade Biologi'], quote: '"Menyembuhkan satu kehidupan, berarti menjaga kelangsungan umat manusia."' },
        { id: 'perawat', title: 'Perawat', category: 'Kesehatan', icon: 'medical_services', desc: 'Memberikan perawatan dan dukungan kepada pasien.', img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop', pt: 'S1 Keperawatan. Fokus: Keperawatan Klinik, Komunitas, & Manajemen Pasien.', sma: 'Fokus: Biologi, Kimia, & Kesehatan Masyarakat.', kegiatan: ['PMR', 'Relawan Kesehatan'], quote: '"Perawat adalah jantung dari pelayanan kesehatan yang berkesinambungan."' },
        { id: 'apoteker', title: 'Apoteker', category: 'Kesehatan', icon: 'vaccines', desc: 'Menyiapkan dan mendistribusikan obat-obatan.', img: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?q=80&w=600&auto=format&fit=crop', pt: 'S1 Farmasi. Fokus: Farmakologi, Formulasi Obat, & Kimia Farmasi.', sma: 'Fokus: Kimia, Biologi, & Matematika.', kegiatan: ['Olimpiade Kimia', 'Lab Kimia'], quote: '"Obat yang tepat di tangan yang tepat menyelamatkan nyawa."' },
        { id: 'bidan', title: 'Bidan', category: 'Kesehatan', icon: 'pregnant_woman', desc: 'Membantu proses persalinan dan merawat kesehatan ibu & anak.', img: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop', pt: 'S1 Kebidanan. Fokus: Asuhan Kebidanan, Kesehatan Reproduksi.', sma: 'Fokus: Biologi, Kimia, & Sosiologi.', kegiatan: ['PMR', 'Penyuluhan'], quote: '"Menyambut kehidupan baru dengan kasih sayang dan profesionalisme."' },
        { id: 'ahli_gizi', title: 'Ahli Gizi', category: 'Kesehatan', icon: 'restaurant_menu', desc: 'Memberikan saran tentang diet dan nutrisi sehat.', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=600&auto=format&fit=crop', pt: 'S1 Gizi. Fokus: Ilmu Gizi, Dietetika, & Keamanan Pangan.', sma: 'Fokus: Biologi, Kimia, & Kesehatan.', kegiatan: ['UKS', 'Kantin Sehat'], quote: '"Nutrisi yang baik adalah investasi terbaik untuk masa depan."' },
        { id: 'psikolog', title: 'Psikolog', category: 'Kesehatan', icon: 'psychology', desc: 'Mempelajari perilaku dan proses mental manusia.', img: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=600&auto=format&fit=crop', pt: 'S1 Psikologi. Fokus: Psikologi Klinis, Sosial, & Perkembangan.', sma: 'Fokus: Sosiologi, Biologi, & Bahasa.', kegiatan: ['Konseling Sebaya', 'Debat'], quote: '"Memahami pikiran manusia adalah kunci untuk membangun masyarakat yang sehat."' },

        // Pendidikan
        { id: 'guru', title: 'Guru', category: 'Pendidikan', icon: 'school', desc: 'Mendidik dan membimbing siswa di sekolah.', img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=600&auto=format&fit=crop', pt: 'S1 Pendidikan. Fokus: Pedagogi, Kurikulum, & Psikologi Pendidikan.', sma: 'Fokus: Mata pelajaran pilihan, Bahasa, & Sosiologi.', kegiatan: ['Tutor Sebaya', 'OSIS'], quote: '"Guru yang hebat menginspirasi muridnya untuk melampaui batas kemampuan diri."' },
        { id: 'dosen', title: 'Dosen', category: 'Pendidikan', icon: 'local_library', desc: 'Mengajar dan melakukan penelitian di universitas.', img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=600&auto=format&fit=crop', pt: 'S2/S3 Bidang Ilmu. Fokus: Riset, Publikasi, & Pengajaran Tinggi.', sma: 'Fokus: Bidang minat akademik, Riset, & Penulisan.', kegiatan: ['Karya Ilmiah', 'Debat Ilmiah'], quote: '"Dosen bukan hanya pengajar, tapi juga pencipta pengetahuan baru."' },
        { id: 'ustadz', title: 'Ustad/Ustadzah', category: 'Pendidikan', icon: 'menu_book', desc: 'Mengajarkan ilmu agama dan membina akhlak.', img: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?q=80&w=600&auto=format&fit=crop', pt: 'S1 Pendidikan Agama / Tarbiyah. Fokus: Ilmu Agama, Pedagogi Islam.', sma: 'Fokus: Agama, Sejarah, & Bahasa Arab.', kegiatan: ['Rohis', 'Dakwah Sekolah'], quote: '"Membangun karakter bangsa dengan fondasi iman yang kuat."' },
        { id: 'kepala_sekolah', title: 'Kepala Sekolah', category: 'Pendidikan', icon: 'admin_panel_settings', desc: 'Memimpin dan memanajemen operasional sebuah sekolah.', img: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=600&auto=format&fit=crop', pt: 'S2 Manajemen Pendidikan. Fokus: Kepemimpinan, Kebijakan Sekolah.', sma: 'Fokus: Sosiologi, Ekonomi, & Bahasa.', kegiatan: ['OSIS', 'Organisasi'], quote: '"Kepemimpinan yang baik menciptakan lingkungan belajar yang optimal."' },
        { id: 'pustakawan', title: 'Pustakawan', category: 'Pendidikan', icon: 'library_books', desc: 'Mengelola perpustakaan dan sistem informasi.', img: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop', pt: 'S1 Ilmu Perpustakaan. Fokus: Manajemen Informasi, Arsip, & Literasi.', sma: 'Fokus: Bahasa, TIK, & Sosiologi.', kegiatan: ['Klub Buku', 'Majalah Sekolah'], quote: '"Perpustakaan adalah gerbang menuju pengetahuan tak terbatas."' },

        // Sains & Teknologi
        { id: 'arsitek', title: 'Arsitek', category: 'Sains & Teknologi', icon: 'architecture', desc: 'Merancang desain bangunan, estetika ruang, dan tata lingkungan.', img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop', pt: 'S1 Arsitektur. Fokus: Studio Perancangan, Sains Bangunan, & Struktur.', sma: 'Fokus: Matematika Geometri, Fisika, & Seni Rupa.', kegiatan: ['Klub Menggambar', 'Pameran Karya'], quote: '"Arsitektur adalah perpaduan antara presisi dan kebebasan berekspresi."' },
        { id: 'programmer', title: 'Programmer', category: 'Sains & Teknologi', icon: 'code', desc: 'Menulis dan menguji kode untuk perangkat lunak.', img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop', pt: 'S1 Teknik Informatika. Fokus: Algoritma, Rekayasa Perangkat Lunak, & Basis Data.', sma: 'Fokus: Matematika, Logika Komputasi, & Bahasa Inggris.', kegiatan: ['Klub Coding', 'OSN Komputer'], quote: '"Kode yang baik adalah puisi yang dapat dijalankan oleh mesin."' },
        { id: 'data_scientist', title: 'Data Scientist', category: 'Sains & Teknologi', icon: 'query_stats', desc: 'Mengolah pola data besar, statistik, dan machine learning.', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop', pt: 'S1 Ilmu Komputer / Sains Data. Fokus: Machine Learning, Big Data, & Statistika Terapan.', sma: 'Fokus: Matematika Lanjut, Pemrograman Dasar, & Probabilitas.', kegiatan: ['Klub Coding', 'Karya Ilmiah Remaja'], quote: '"Data adalah minyak baru, namun insight adalah energi penggeraknya."' },
        { id: 'arsitek_sistem', title: 'Arsitek Sistem', category: 'Sains & Teknologi', icon: 'dns', desc: 'Merancang arsitektur cloud, server, dan infrastruktur IT berskala besar.', img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop', pt: 'S1 Teknik Informatika / Sistem Informasi. Fokus: Cloud, Microservices, Security.', sma: 'Fokus: Jaringan Komputer, Matematika Diskrit, Linux.', kegiatan: ['Klub Jaringan', 'Robotik'], quote: '"Infrastruktur yang kokoh adalah fondasi inovasi digital."' },
        { id: 'peneliti_sains', title: 'Peneliti Sains', category: 'Sains & Teknologi', icon: 'science', desc: 'Melakukan eksperimen untuk penemuan ilmiah baru.', img: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?q=80&w=600&auto=format&fit=crop', pt: 'S1/S2 Biologi/Fisika/Kimia. Fokus: Metodologi Riset, Analisis Eksperimental.', sma: 'Fokus: Sains (Fis/Kim/Bio), Matematika.', kegiatan: ['Karya Ilmiah Remaja', 'Lab Sekolah'], quote: '"Setiap eksperimen adalah langkah mendekati kebenaran alam."' },
        { id: 'peneliti_biologi', title: 'Peneliti Biologi', category: 'Sains & Teknologi', icon: 'biotech', desc: 'Mempelajari organisme hidup, ekologi, dan bioteknologi.', img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop', pt: 'S1 Biologi / Bioteknologi. Fokus: Mikrobiologi, Genetika, Bioinformatika.', sma: 'Fokus: Biologi, Kimia Organik, Matematika.', kegiatan: ['Karya Ilmiah Biologi', 'Pecinta Alam'], quote: '"Di setiap mikroskop, terdapat dunia tak terlihat yang membentuk kehidupan kita."' },
        { id: 'insinyur', title: 'Insinyur', category: 'Sains & Teknologi', icon: 'engineering', desc: 'Merancang dan membangun mesin, sistem, atau struktur.', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop', pt: 'S1 Teknik Mesin/Sipil. Fokus: Mekanika, Termodinamika, & Material.', sma: 'Fokus: Fisika, Matematika Lanjut, & Kimia.', kegiatan: ['Olimpiade Fisika', 'Klub Robotik'], quote: '"Insinyur mengubah ilmu pengetahuan menjadi solusi nyata bagi kehidupan."' },
        { id: 'teknisi', title: 'Teknisi', category: 'Sains & Teknologi', icon: 'build', desc: 'Memperbaiki dan memelihara peralatan teknis/elektronik.', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop', pt: 'D3/S1 Vokasi. Fokus: Praktik Elektro/Mesin, Trouble-shooting.', sma: 'Fokus: Fisika, Keterampilan Praktis, TIK.', kegiatan: ['Klub Robotik', 'Prakarya'], quote: '"Keterampilan teknis memastikan dunia tetap berputar."' },

        // Kreatif
        { id: 'desainer_grafis', title: 'Desainer Grafis', category: 'Kreatif', icon: 'brush', desc: 'Menciptakan konsep visual menggunakan perangkat lunak komputer.', img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=600&auto=format&fit=crop', pt: 'S1 Desain Komunikasi Visual. Fokus: Tipografi, Branding, & Ilustrasi Digital.', sma: 'Fokus: Seni Rupa, TIK, & Bahasa Inggris.', kegiatan: ['Klub Desain', 'Mading Kreatif'], quote: '"Desain yang baik adalah invisible — ia bekerja tanpa harus meminta perhatian."' },
        { id: 'fotografer', title: 'Fotografer', category: 'Kreatif', icon: 'photo_camera', desc: 'Mengambil gambar profesional untuk berbagai keperluan.', img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=600&auto=format&fit=crop', pt: 'S1 Fotografi / DKV. Fokus: Teknik Kamera, Komposisi, & Post-Processing.', sma: 'Fokus: Seni Rupa, TIK, & Fisika (Optik).', kegiatan: ['Klub Fotografi', 'Jurnalistik'], quote: '"Setiap foto menceritakan kisah yang tak bisa diungkapkan oleh kata-kata."' },
        { id: 'penulis', title: 'Penulis', category: 'Kreatif', icon: 'edit', desc: 'Menciptakan karya tulis seperti buku, artikel, atau naskah.', img: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop', pt: 'S1 Sastra / Komunikasi. Fokus: Penulisan Kreatif, Jurnalisme, & Linguistik.', sma: 'Fokus: Bahasa Indonesia, Bahasa Inggris, & Sosiologi.', kegiatan: ['Majalah Sekolah', 'Lomba Cerpen'], quote: '"Kata-kata yang tepat memiliki kekuatan untuk mengubah dunia."' },
        { id: 'musisi', title: 'Musisi', category: 'Kreatif', icon: 'music_note', desc: 'Menciptakan dan menampilkan musik.', img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600&auto=format&fit=crop', pt: 'S1 Musik. Fokus: Teori Musik, Komposisi, & Performance.', sma: 'Fokus: Seni Musik, Bahasa, & Matematika.', kegiatan: ['Band Sekolah', 'Paduan Suara'], quote: '"Musik adalah bahasa universal yang menyentuh jiwa tanpa kata."' },
        { id: 'animator', title: 'Animator', category: 'Kreatif', icon: 'animation', desc: 'Menciptakan gambar bergerak untuk film atau permainan.', img: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?q=80&w=600&auto=format&fit=crop', pt: 'S1 Animasi / DKV. Fokus: Animasi 2D/3D, Storyboarding, & Motion Graphics.', sma: 'Fokus: Seni Rupa, Matematika, & TIK.', kegiatan: ['Klub Film', 'Lomba Animasi'], quote: '"Animasi memberi kehidupan pada imajinasi dan menghidupkan cerita."' },

        // Bisnis
        { id: 'akuntan', title: 'Akuntan', category: 'Bisnis', icon: 'account_balance', desc: 'Mengelola, menganalisis, dan melaporkan keuangan.', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop', pt: 'S1 Akuntansi. Fokus: Akuntansi Keuangan, Audit, & Perpajakan.', sma: 'Fokus: Ekonomi, Akuntansi Dasar, & Matematika Bisnis.', kegiatan: ['Koperasi Siswa', 'Olimpiade Ekonomi'], quote: '"Kesehatan finansial adalah cermin dari keberhasilan sebuah strategi."' },
        { id: 'marketing', title: 'Marketing', category: 'Bisnis', icon: 'campaign', desc: 'Merencanakan kampanye promosi dan strategi pemasaran.', img: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=600&auto=format&fit=crop', pt: 'S1 Manajemen Pemasaran. Fokus: Perilaku Konsumen, Strategi Promosi.', sma: 'Fokus: Ekonomi, Sosiologi, Bahasa.', kegiatan: ['Bazar Sekolah', 'Klub Kewirausahaan'], quote: '"Pemasaran yang hebat tidak terasa seperti pemasaran."' },
        { id: 'wirausaha', title: 'Wirausaha', category: 'Bisnis', icon: 'store', desc: 'Mendirikan dan mengelola bisnis mandiri.', img: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=600&auto=format&fit=crop', pt: 'S1 Bisnis/Kewirausahaan. Fokus: Strategi Bisnis, Inovasi, Manajemen.', sma: 'Fokus: Ekonomi, TIK, Sosiologi.', kegiatan: ['Kewirausahaan', 'OSIS'], quote: '"Pengusaha melihat peluang di mana orang lain melihat hambatan."' },
        { id: 'analis_keuangan', title: 'Analis Keuangan', category: 'Bisnis', icon: 'trending_up', desc: 'Menganalisis data keuangan untuk keputusan investasi.', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop', pt: 'S1 Manajemen Keuangan. Fokus: Portofolio, Risiko Keuangan.', sma: 'Fokus: Ekonomi, Matematika, Statistik.', kegiatan: ['Olimpiade Ekonomi', 'Koperasi'], quote: '"Angka menceritakan cerita yang tak pernah bohong."' },
        { id: 'hrd', title: 'HRD', category: 'Bisnis', icon: 'groups', desc: 'Mengelola sumber daya manusia di perusahaan.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop', pt: 'S1 Psikologi / Manajemen SDM. Fokus: Rekrutmen, Pengembangan Pegawai.', sma: 'Fokus: Sosiologi, Psikologi, Bahasa.', kegiatan: ['OSIS', 'Organisasi'], quote: '"Aset paling berharga dari sebuah perusahaan adalah karyawannya."' },

        // Olahraga & Seni
        { id: 'atlet', title: 'Atlet', category: 'Olahraga & Seni', icon: 'sports_gymnastics', desc: 'Berkompetisi dalam acara olahraga profesional.', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=600&auto=format&fit=crop', pt: 'S1 Ilmu Keolahragaan / Pelatihan. Fokus: Fisiologi Olahraga, Biomekanika, & Nutrisi Atlet.', sma: 'Fokus: Olahraga, Biologi, & Bahasa.', kegiatan: ['Tim Olahraga', 'Kejuaraan Daerah'], quote: '"Kemenangan bukanlah segalanya, tetapi keinginan untuk menang adalah segalanya."' },
        { id: 'pelatih', title: 'Pelatih', category: 'Olahraga & Seni', icon: 'sports', desc: 'Melatih dan mengarahkan atlet atau tim olahraga.', img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=600&auto=format&fit=crop', pt: 'S1 Pendidikan Olahraga / Kepelatihan. Fokus: Metodologi Latihan, Strategi, & Psikologi Sport.', sma: 'Fokus: Olahraga, Biologi, & Kepemimpinan.', kegiatan: ['Tim Olahraga', 'Asisten Pelatih'], quote: '"Pelatih hebat mencetak juara, bukan hanya di lapangan tapi juga dalam kehidupan."' },
        { id: 'pelukis', title: 'Pelukis', category: 'Olahraga & Seni', icon: 'palette', desc: 'Menciptakan karya seni rupa menggunakan berbagai media.', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?q=80&w=600&auto=format&fit=crop', pt: 'S1 Seni Rupa. Fokus: Teknik Lukis, Sejarah Seni, Estetika.', sma: 'Fokus: Seni Budaya, Sejarah.', kegiatan: ['Pameran Seni', 'Klub Melukis'], quote: '"Setiap kanvas adalah cermin dari jiwa pelukisnya."' },
        { id: 'penari', title: 'Penari', category: 'Olahraga & Seni', icon: 'accessibility_new', desc: 'Mengekspresikan cerita dan emosi melalui gerakan tubuh.', img: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=600&auto=format&fit=crop', pt: 'S1 Seni Tari. Fokus: Koreografi, Sejarah Tari, Ekspresi Tubuh.', sma: 'Fokus: Seni Budaya, Olahraga.', kegiatan: ['Klub Tari', 'Festival Budaya'], quote: '"Tarian adalah puisi tersembunyi dari jiwa."' },
        { id: 'aktor', title: 'Aktor', category: 'Olahraga & Seni', icon: 'theater_comedy', desc: 'Memerankan karakter dalam pertunjukan atau film.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop', pt: 'S1 Seni Peran / Teater. Fokus: Akting, Penyutradaraan, & Dramaturgi.', sma: 'Fokus: Seni Budaya, Bahasa, & Sosiologi.', kegiatan: ['Teater Sekolah', 'Klub Drama'], quote: '"Seni peran adalah cermin kehidupan yang membantu kita memahami diri sendiri."' }
    ];

    // Helper: Cari data profesi
    function getCareerData(titleOrId) {
        if (!titleOrId) return allCareers.find(c => c.id === 'arsitek') || allCareers[0];
        const normalized = String(titleOrId).trim().toLowerCase();
        return allCareers.find(c => c.id.toLowerCase() === normalized || c.title.toLowerCase() === normalized) || {
            id: normalized.replace(/\s+/g, '_'),
            title: titleOrId,
            category: 'Pengembangan Karier',
            icon: 'star',
            desc: `Jalur pengembangan profesi untuk meraih cita-cita ${titleOrId}.`,
            img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
            pt: `Pendidikan Tinggi Terkait ${titleOrId}`,
            sma: 'Fokus: Mata Pelajaran Peminatan Terkait & Logika Dasar',
            kegiatan: ['Karya Ilmiah', 'OSIS / Organisasi'],
            quote: `"${titleOrId} adalah komitmen belajar berkelanjutan untuk masa depan yang gemilang."`
        };
    }

    // 2. Data Detail Kurikulum untuk 6 Profesi Utama
    const detailedRoadmaps = {
        'arsitek': {
            quote: '"Arsitektur adalah perpaduan antara presisi dan kebebasan berekspresi."',
            img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=600&auto=format&fit=crop',
            icon: 'architecture',
            timeline: [
                { year: 'Kelas 10', label: 'Tahun 1', desc: 'Membangun fondasi geometri ruang, menguasai SketchUp dasar, dan eksplorasi seni rupa visual.', status: 'active', icon: 'looks_one' },
                { year: 'Kelas 11', label: 'Tahun 2', desc: 'Proyek desain rumah ramah lingkungan, workshop perspektif 2 titik hilang, dan studi material bangunan.', status: 'active', icon: 'looks_two' },
                { year: 'Kelas 12', label: 'Tahun 3', desc: 'Finalisasi 10 karya portfolio, simulasi tes spasial, dan persiapan ujian masuk S1 Arsitektur.', status: 'upcoming', icon: 'looks_3' },
                { year: 'Gap Year', label: 'Opsional', desc: 'Pendalaman advanced drafting, struktur dasar bangunan, dan seni rupa murni.', status: 'optional', icon: 'hourglass_empty' },
                { year: 'Universitas Tahun 1-2', label: 'Tahun 4-5', desc: 'Pengantar Arsitektur, Studio 1, Sejarah Arsitektur, dan Teknologi Bangunan.', status: 'upcoming', icon: 'school' },
                { year: 'Universitas Tahun 3-4', label: 'Tahun 6-7', desc: 'Sains Bangunan, magang di biro arsitek, dan Tugas Akhir: Desain Kompleks Arsitektural.', status: 'upcoming', icon: 'emoji_events' }
            ],
            milestones: [
                { id: 'am1', title: 'Menguasai SketchUp 3D', desc: 'Mampu membuat model 3D bangunan sederhana secara mandiri.', target: 'Kelas 10 - Semester 2', icon: 'view_in_ar' },
                { id: 'am2', title: 'Proyek Desain Pertama', desc: 'Menyelesaikan desain rumah ramah lingkungan dengan konsep sustainable.', target: 'Kelas 11 - Semester 1', icon: 'home_work' },
                { id: 'am3', title: '10 Karya Portfolio', desc: 'Mengumpulkan 10 karya desain terbaik untuk portfolio masuk universitas.', target: 'Kelas 12 - Semester 1', icon: 'collections' },
                { id: 'am4', title: 'Lulus Seleksi PTN', desc: 'Diterima di program S1 Arsitektur perguruan tinggi pilihan.', target: 'Kelas 12 - Semester 2', icon: 'school' },
                { id: 'am5', title: 'Magang Biro Arsitek', desc: 'Menyelesaikan program magang profesional di biro arsitek ternama.', target: 'Universitas Tahun 3', icon: 'work' },
                { id: 'am6', title: 'Tugas Akhir: Desain Kompleks', desc: 'Menyelesaikan proyek akhir berupa desain kompleks arsitektural skala besar.', target: 'Universitas Tahun 4', icon: 'emoji_events' }
            ],
            resources: [
                { title: 'Arsitektur Bentuk, Ruang & Tatanan', author: 'Francis D.K. Ching', type: 'book', icon: 'menu_book', color: 'blue', desc: 'Panduan klasik tentang prinsip dasar perancangan arsitektur.' },
                { title: 'SketchUp untuk Arsitek', author: 'SketchUp Academy', type: 'course', icon: 'ondemand_video', color: 'green', desc: 'Tutorial lengkap pemodelan 3D dari dasar hingga mahir.' },
                { title: 'AutoCAD Student License', author: 'Autodesk', type: 'tool', icon: 'build', color: 'orange', desc: 'Software CAD standar industri arsitektur, gratis untuk pelajar.' },
                { title: 'Toward an Architecture', author: 'Le Corbusier', type: 'book', icon: 'menu_book', color: 'blue', desc: 'Manifesto arsitektur modern yang wajib dibaca setiap calon arsitek.' },
                { title: 'Sustainable Architecture', author: 'Coursera - TU Delft', type: 'course', icon: 'ondemand_video', color: 'green', desc: 'Prinsip keberlanjutan dan desain ramah lingkungan.' },
                { title: 'Lumion Visualization', author: 'Act-3D', type: 'tool', icon: 'build', color: 'orange', desc: 'Rendering 3D real-time untuk presentasi arsitektur profesional.' }
            ]
        },
        'data scientist': {
            quote: '"Data adalah minyak baru, namun insight adalah energi penggeraknya."',
            img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
            icon: 'query_stats',
            timeline: [
                { year: 'Kelas 10', label: 'Tahun 1', desc: 'Fondasi logika matematika, probabilitas, dan pengenalan bahasa Python.', status: 'active', icon: 'looks_one' },
                { year: 'Kelas 11', label: 'Tahun 2', desc: 'Proyek analisis data sederhana, eksplorasi dataset publik, dan workshop Machine Learning dasar.', status: 'active', icon: 'looks_two' },
                { year: 'Kelas 12', label: 'Tahun 3', desc: 'Sertifikasi Python, proyek akhir data analysis, dan persiapan ujian masuk S1 Ilmu Komputer.', status: 'upcoming', icon: 'looks_3' },
                { year: 'Gap Year', label: 'Opsional', desc: 'Bootcamp intensif: SQL mastery, data visualization, dan pengenalan AI models.', status: 'optional', icon: 'hourglass_empty' },
                { year: 'Universitas Tahun 1-2', label: 'Tahun 4-5', desc: 'Kalkulus, Struktur Data, Aljabar Linier, dan Statistika Inferensial.', status: 'upcoming', icon: 'school' },
                { year: 'Universitas Tahun 3-4', label: 'Tahun 6-7', desc: 'Deep Learning, Cloud Computing, magang Data Analyst, NLP, dan Tugas Akhir: AI Predictive Model.', status: 'upcoming', icon: 'emoji_events' }
            ],
            milestones: [
                { id: 'dm1', title: 'Sertifikasi Python Dasar', desc: 'Menyelesaikan sertifikasi resmi bahasa pemrograman Python.', target: 'Kelas 10 - Semester 2', icon: 'code' },
                { id: 'dm2', title: 'Proyek Data Analysis', desc: 'Menganalisis dataset publik dan membuat visualisasi data interaktif.', target: 'Kelas 11 - Semester 1', icon: 'analytics' },
                { id: 'dm3', title: 'ML Model Pertama', desc: 'Membangun model machine learning regresi dan klasifikasi sederhana.', target: 'Kelas 11 - Semester 2', icon: 'smart_toy' },
                { id: 'dm4', title: 'Lulus Seleksi PTN', desc: 'Diterima di program S1 Ilmu Komputer / Data Science.', target: 'Kelas 12 - Semester 2', icon: 'school' },
                { id: 'dm5', title: 'Magang Data Analyst', desc: 'Menyelesaikan internship sebagai Data Analyst di perusahaan teknologi.', target: 'Universitas Tahun 3', icon: 'work' },
                { id: 'dm6', title: 'Tugas Akhir: AI Predictive Model', desc: 'Membangun sistem prediksi berbasis AI untuk studi kasus nyata.', target: 'Universitas Tahun 4', icon: 'emoji_events' }
            ],
            resources: [
                { title: 'Python for Data Analysis', author: 'Wes McKinney', type: 'book', icon: 'menu_book', color: 'blue', desc: 'Panduan lengkap analisis data dengan Python, Pandas, dan NumPy.' },
                { title: 'Machine Learning Specialization', author: 'Coursera - Andrew Ng', type: 'course', icon: 'ondemand_video', color: 'green', desc: 'Kursus ML terbaik di dunia dari Stanford University.' },
                { title: 'Jupyter Notebook', author: 'Project Jupyter', type: 'tool', icon: 'build', color: 'orange', desc: 'IDE interaktif standar untuk eksplorasi dan analisis data.' },
                { title: 'Hands-On Machine Learning', author: 'Aurélien Géron', type: 'book', icon: 'menu_book', color: 'blue', desc: 'Implementasi praktis ML dengan Scikit-Learn, Keras, dan TensorFlow.' },
                { title: 'SQL for Data Science', author: 'Coursera - UC Davis', type: 'course', icon: 'ondemand_video', color: 'green', desc: 'Penguasaan query database untuk pengolahan data berskala besar.' },
                { title: 'Tableau Public', author: 'Tableau Software', type: 'tool', icon: 'build', color: 'orange', desc: 'Platform visualisasi data profesional gratis untuk pelajar.' }
            ]
        },
        'arsitek sistem': {
            quote: '"Infrastruktur yang kokoh adalah fondasi inovasi digital."',
            img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
            icon: 'dns',
            timeline: [
                { year: 'Kelas 10', label: 'Tahun 1', desc: 'Fondasi jaringan komputer, TCP/IP, dan pengenalan Linux CLI.', status: 'active', icon: 'looks_one' },
                { year: 'Kelas 11', label: 'Tahun 2', desc: 'Membangun web server, pengenalan cloud computing, dan scripting otomasi.', status: 'active', icon: 'looks_two' },
                { year: 'Kelas 12', label: 'Tahun 3', desc: 'Sertifikasi Linux, proyek cloud deployment, dan persiapan masuk S1 Teknik Informatika.', status: 'upcoming', icon: 'looks_3' },
                { year: 'Gap Year', label: 'Opsional', desc: 'Bootcamp DevOps: Docker, Kubernetes, dan arsitektur cloud.', status: 'optional', icon: 'hourglass_empty' },
                { year: 'Universitas Tahun 1-2', label: 'Tahun 4-5', desc: 'Algoritma, Struktur Data, Sistem Operasi, dan Basis Data relasional.', status: 'upcoming', icon: 'school' },
                { year: 'Universitas Tahun 3-4', label: 'Tahun 6-7', desc: 'Arsitektur Perangkat Lunak, Microservices, magang DevOps, dan Tugas Akhir Desain Cloud-Native.', status: 'upcoming', icon: 'emoji_events' }
            ],
            milestones: [
                { id: 'sm1', title: 'Sertifikasi Linux Essentials', desc: 'Menguasai operasi dasar Linux dan administrasi sistem.', target: 'Kelas 10 - Semester 2', icon: 'terminal' },
                { id: 'sm2', title: 'Web Server Deployment', desc: 'Berhasil membangun dan men-deploy web server dari nol.', target: 'Kelas 11 - Semester 1', icon: 'dns' },
                { id: 'sm3', title: 'Cloud Architecture Project', desc: 'Menyelesaikan proyek arsitektur cloud menggunakan AWS/GCP.', target: 'Kelas 12 - Semester 1', icon: 'cloud' },
                { id: 'sm4', title: 'Lulus Seleksi PTN', desc: 'Diterima di S1 Teknik Informatika perguruan tinggi pilihan.', target: 'Kelas 12 - Semester 2', icon: 'school' },
                { id: 'sm5', title: 'Magang DevOps Engineer', desc: 'Internship sebagai DevOps Engineer di perusahaan teknologi.', target: 'Universitas Tahun 3', icon: 'work' },
                { id: 'sm6', title: 'TA: Desain Cloud-Native', desc: 'Merancang arsitektur sistem cloud-native berskala enterprise.', target: 'Universitas Tahun 4', icon: 'emoji_events' }
            ],
            resources: [
                { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', type: 'book', icon: 'menu_book', color: 'blue', desc: 'Bible untuk memahami arsitektur sistem data modern.' },
                { title: 'AWS Solutions Architect', author: 'AWS Training', type: 'course', icon: 'ondemand_video', color: 'green', desc: 'Sertifikasi arsitektur cloud paling diminati di industri.' },
                { title: 'Docker Desktop', author: 'Docker Inc.', type: 'tool', icon: 'build', color: 'orange', desc: 'Platform containerization standar untuk pengembangan modern.' },
                { title: 'Clean Architecture', author: 'Robert C. Martin', type: 'book', icon: 'menu_book', color: 'blue', desc: 'Prinsip arsitektur perangkat lunak yang bersih dan maintainable.' },
                { title: 'Kubernetes for Beginners', author: 'Udemy - Mumshad', type: 'course', icon: 'ondemand_video', color: 'green', desc: 'Orkestrasi container dari dasar hingga production-ready.' },
                { title: 'Terraform', author: 'HashiCorp', type: 'tool', icon: 'build', color: 'orange', desc: 'Infrastructure as Code untuk provisioning cloud otomatis.' }
            ]
        },
        'dokter': {
            quote: '"Menyembuhkan satu kehidupan, berarti menjaga kelangsungan umat manusia."',
            img: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop',
            icon: 'stethoscope',
            timeline: [
                { year: 'Kelas 10', label: 'Tahun 1', desc: 'Fondasi biologi sel, genetika, dan pengenalan anatomi sistem organ tubuh manusia.', status: 'active', icon: 'looks_one' },
                { year: 'Kelas 11', label: 'Tahun 2', desc: 'Riset kesehatan masyarakat, workshop P3K bersertifikat, dan pendalaman kimia organik.', status: 'active', icon: 'looks_two' },
                { year: 'Kelas 12', label: 'Tahun 3', desc: 'Olimpiade Biologi, simulasi tes kedokteran, dan persiapan UTBK masuk FK.', status: 'upcoming', icon: 'looks_3' },
                { year: 'Gap Year', label: 'Opsional', desc: 'Pendalaman biokimia lanjut, psikologi medis, dan kegiatan komunitas kesehatan.', status: 'optional', icon: 'hourglass_empty' },
                { year: 'Universitas Tahun 1-2', label: 'Tahun 4-5', desc: 'Pre-Klinik: Anatomi, Fisiologi, Biokimia, dan Histologi.', status: 'upcoming', icon: 'school' },
                { year: 'Universitas Tahun 3-5+', label: 'Tahun 6-8+', desc: 'Klinik: Patologi, Farmakologi, rotasi RS, Ko-Asistensi, dan UKMPPD.', status: 'upcoming', icon: 'emoji_events' }
            ],
            milestones: [
                { id: 'dm1_doc', title: 'Sertifikat P3K & CPR', desc: 'Menyelesaikan pelatihan pertolongan pertama dan CPR bersertifikat resmi.', target: 'Kelas 11 - Semester 1', icon: 'medical_services' },
                { id: 'dm2_doc', title: 'Olimpiade Biologi', desc: 'Berpartisipasi dalam Olimpiade Sains Nasional bidang Biologi.', target: 'Kelas 11 - Semester 2', icon: 'science' },
                { id: 'dm3_doc', title: 'Riset Kesehatan', desc: 'Menyelesaikan proyek riset kesehatan masyarakat dengan metodologi ilmiah.', target: 'Kelas 12 - Semester 1', icon: 'biotech' },
                { id: 'dm4_doc', title: 'Lulus Seleksi FK', desc: 'Diterima di Fakultas Kedokteran perguruan tinggi pilihan.', target: 'Kelas 12 - Semester 2', icon: 'school' },
                { id: 'dm5_doc', title: 'Rotasi Klinik RS', desc: 'Menyelesaikan rotasi klinik di berbagai departemen RS Pendidikan.', target: 'Universitas Tahun 3', icon: 'local_hospital' },
                { id: 'dm6_doc', title: 'Lulus UKMPPD', desc: 'Lulus Ujian Kompetensi Mahasiswa Program Profesi Dokter.', target: 'Universitas Tahun 5+', icon: 'emoji_events' }
            ],
            resources: [
                { title: 'Atlas Anatomi Manusia Netter', author: 'Frank H. Netter', type: 'book', icon: 'menu_book', color: 'blue', desc: 'Atlas anatomi paling detail dan berwarna standar kedokteran dunia.' },
                { title: 'Anatomi & Fisiologi', author: 'Khan Academy', type: 'course', icon: 'ondemand_video', color: 'green', desc: 'Pengantar sistem tubuh manusia secara visual dan interaktif.' },
                { title: 'Complete Anatomy (3D4Medical)', author: '3D4Medical', type: 'tool', icon: 'build', color: 'orange', desc: 'Platform anatomi 3D interaktif untuk eksplorasi tubuh manusia.' },
                { title: "Guyton's Textbook of Medical Physiology", author: 'John E. Hall', type: 'book', icon: 'menu_book', color: 'blue', desc: 'Textbook fisiologi paling komprehensif untuk mahasiswa kedokteran.' },
                { title: 'Farmakologi Klinis', author: 'Coursera - UPenn', type: 'course', icon: 'ondemand_video', color: 'green', desc: 'Prinsip dasar farmakologi dan mekanisme kerja obat.' },
                { title: 'Anki Flashcards Medical', author: 'Komunitas Anki', type: 'tool', icon: 'build', color: 'orange', desc: 'Sistem spaced repetition terbaik untuk menghafal terminologi medis.' }
            ]
        },
        'akuntan': {
            quote: '"Kesehatan finansial adalah cermin dari keberhasilan sebuah strategi."',
            img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=600&auto=format&fit=crop',
            icon: 'account_balance',
            timeline: [
                { year: 'Kelas 10', label: 'Tahun 1', desc: 'Pengantar akuntansi, siklus debit-kredit, dan penguasaan Microsoft Excel.', status: 'active', icon: 'looks_one' },
                { year: 'Kelas 11', label: 'Tahun 2', desc: 'Praktik pembukuan UMKM, workshop perpajakan dasar, dan ekonomi makro.', status: 'active', icon: 'looks_two' },
                { year: 'Kelas 12', label: 'Tahun 3', desc: 'Sertifikasi Excel, simulasi audit koperasi, dan persiapan masuk S1 Akuntansi.', status: 'upcoming', icon: 'looks_3' },
                { year: 'Gap Year', label: 'Opsional', desc: 'Intensif financial modeling, software akuntansi, dan hukum bisnis.', status: 'optional', icon: 'hourglass_empty' },
                { year: 'Universitas Tahun 1-2', label: 'Tahun 4-5', desc: 'Pengantar Akuntansi, Ekonomi Mikro, Akuntansi Menengah, dan Hukum Bisnis.', status: 'upcoming', icon: 'school' },
                { year: 'Universitas Tahun 3-4', label: 'Tahun 6-7', desc: 'Audit, Perpajakan, magang di KAP, Akuntansi Forensik, dan Tugas Akhir.', status: 'upcoming', icon: 'emoji_events' }
            ],
            milestones: [
                { id: 'akm1', title: 'Sertifikasi Excel Intermediate', desc: 'Menguasai formula lanjut, pivot table, dan macro di Excel.', target: 'Kelas 10 - Semester 2', icon: 'grid_on' },
                { id: 'akm2', title: 'Pembukuan UMKM', desc: 'Menyelesaikan proyek pembukuan nyata untuk UMKM lokal.', target: 'Kelas 11 - Semester 1', icon: 'storefront' },
                { id: 'akm3', title: 'Simulasi Audit', desc: 'Melakukan simulasi audit pada koperasi sekolah.', target: 'Kelas 12 - Semester 1', icon: 'fact_check' },
                { id: 'akm4', title: 'Lulus Seleksi PTN', desc: 'Diterima di S1 Akuntansi perguruan tinggi pilihan.', target: 'Kelas 12 - Semester 2', icon: 'school' },
                { id: 'akm5', title: 'Magang di KAP', desc: 'Menyelesaikan internship sebagai Junior Auditor di Kantor Akuntan Publik.', target: 'Universitas Tahun 3', icon: 'work' },
                { id: 'akm6', title: 'TA: Analisis Laporan Keuangan', desc: 'Menyelesaikan tugas akhir berupa analisis mendalam laporan keuangan perusahaan publik.', target: 'Universitas Tahun 4', icon: 'emoji_events' }
            ],
            resources: [
                { title: 'Pengantar Akuntansi (PSAK)', author: 'IAI', type: 'book', icon: 'menu_book', color: 'blue', desc: 'Standar akuntansi keuangan Indonesia yang wajib dipahami.' },
                { title: 'Financial Accounting Fundamentals', author: 'Coursera - UVA', type: 'course', icon: 'ondemand_video', color: 'green', desc: 'Dasar akuntansi keuangan dari University of Virginia.' },
                { title: 'MYOB Accounting', author: 'MYOB', type: 'tool', icon: 'build', color: 'orange', desc: 'Software akuntansi populer untuk praktik pembukuan digital.' },
                { title: 'Auditing & Assurance Services', author: 'Arens, Elder, Beasley', type: 'book', icon: 'menu_book', color: 'blue', desc: 'Textbook audit komprehensif standar internasional.' },
                { title: 'Perpajakan Indonesia', author: 'DJP Online Learning', type: 'course', icon: 'ondemand_video', color: 'green', desc: 'Pelatihan perpajakan resmi dari Direktorat Jenderal Pajak.' },
                { title: 'Microsoft Power BI', author: 'Microsoft', type: 'tool', icon: 'build', color: 'orange', desc: 'Visualisasi data keuangan dan dashboard bisnis interaktif.' }
            ]
        },
        'peneliti biologi': {
            quote: '"Di setiap mikroskop, terdapat dunia tak terlihat yang membentuk kehidupan kita."',
            img: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=600&auto=format&fit=crop',
            icon: 'biotech',
            timeline: [
                { year: 'Kelas 10', label: 'Tahun 1', desc: 'Fondasi ekologi, keanekaragaman hayati, dan praktikum pengamatan sel dengan mikroskop.', status: 'active', icon: 'looks_one' },
                { year: 'Kelas 11', label: 'Tahun 2', desc: 'Riset biodiversitas lokal, workshop teknik laboratorium, dan pendalaman genetika.', status: 'active', icon: 'looks_two' },
                { year: 'Kelas 12', label: 'Tahun 3', desc: 'Karya ilmiah biologi, koleksi herbarium, dan persiapan masuk S1 Biologi.', status: 'upcoming', icon: 'looks_3' },
                { year: 'Gap Year', label: 'Opsional', desc: 'Ekspedisi riset lapangan, pengenalan bioteknologi, dan kegiatan konservasi.', status: 'optional', icon: 'hourglass_empty' },
                { year: 'Universitas Tahun 1-2', label: 'Tahun 4-5', desc: 'Biologi Umum, Kimia Organik, Mikrobiologi, dan Genetika.', status: 'upcoming', icon: 'school' },
                { year: 'Universitas Tahun 3-4', label: 'Tahun 6-7', desc: 'Biologi Molekuler, Bioinformatika, riset di lab, dan Tugas Akhir Riset.', status: 'upcoming', icon: 'emoji_events' }
            ],
            milestones: [
                { id: 'pm1', title: 'Praktikum Mikroskop', desc: 'Mampu mengoperasikan mikroskop cahaya dan mendokumentasikan pengamatan sel.', target: 'Kelas 10 - Semester 2', icon: 'biotech' },
                { id: 'pm2', title: 'Riset Biodiversitas', desc: 'Menyelesaikan survei keanekaragaman hayati dengan metodologi ilmiah.', target: 'Kelas 11 - Semester 1', icon: 'forest' },
                { id: 'pm3', title: 'Karya Ilmiah Remaja', desc: 'Menulis dan mempresentasikan karya ilmiah biologi di tingkat kabupaten/kota.', target: 'Kelas 12 - Semester 1', icon: 'description' },
                { id: 'pm4', title: 'Lulus Seleksi PTN', desc: 'Diterima di program S1 Biologi perguruan tinggi pilihan.', target: 'Kelas 12 - Semester 2', icon: 'school' },
                { id: 'pm5', title: 'Research Assistant', desc: 'Menjadi asisten riset di laboratorium biologi universitas.', target: 'Universitas Tahun 3', icon: 'work' },
                { id: 'pm6', title: 'Publikasi Ilmiah', desc: 'Mempublikasikan hasil riset tugas akhir di jurnal ilmiah nasional.', target: 'Universitas Tahun 4', icon: 'emoji_events' }
            ],
            resources: [
                { title: 'Campbell Biology', author: 'Lisa A. Urry et al.', type: 'book', icon: 'menu_book', color: 'blue', desc: 'Textbook biologi paling komprehensif dan menjadi standar dunia.' },
                { title: 'Introduction to Biology', author: 'edX - MIT', type: 'course', icon: 'ondemand_video', color: 'green', desc: 'Pengantar biologi dari Massachusetts Institute of Technology.' },
                { title: 'ImageJ / FIJI', author: 'NIH', type: 'tool', icon: 'build', color: 'orange', desc: 'Software analisis gambar mikroskopis standar laboratorium.' },
                { title: 'Molecular Biology of the Cell', author: 'Bruce Alberts et al.', type: 'book', icon: 'menu_book', color: 'blue', desc: 'Referensi utama biologi molekuler dan biokimia sel.' },
                { title: 'Bioinformatics Specialization', author: 'Coursera - UCSD', type: 'course', icon: 'ondemand_video', color: 'green', desc: 'Spesialisasi bioinformatika untuk analisis data genomik.' },
                { title: 'MEGA (Molecular Evolutionary Genetics Analysis)', author: 'Penn State', type: 'tool', icon: 'build', color: 'orange', desc: 'Software analisis filogenetik dan evolusi molekuler.' }
            ]
        }
    };

    // Helper: Buat 6 tahun tahapan belajar adaptif sesuai jenjang
    function buildAdaptiveYears(careerObj, jenjang, kelas) {
        const startKelas = parseInt(kelas) || 10;
        let currentJenjang = (jenjang || 'SMA').toUpperCase();
        let currentK = startKelas;

        const getNextLevel = (jenj, kel) => {
            if (jenj === 'SD' && kel > 6) return { j: 'SMP', k: 7 };
            if (jenj === 'SMP' && kel > 9) return { j: 'SMA', k: 10 };
            if (jenj === 'SMA' && kel > 12) return { j: 'KULIAH', k: 1 };
            return { j: jenj, k: kel };
        };

        const yearsArr = [];
        for (let i = 0; i < 6; i++) {
            let titlePrefix = '';
            let phaseDesc = '';
            let tags = [];

            if (currentJenjang === 'SD') {
                titlePrefix = `SD Kelas ${currentK}`;
                phaseDesc = `Pengenalan dasar literasi, numerasi, dan eksplorasi minat bidang ${careerObj.title}.`;
                tags = ['Eksplorasi Minat', 'Logika Dasar'];
            } else if (currentJenjang === 'SMP') {
                titlePrefix = `SMP Kelas ${currentK}`;
                phaseDesc = `Pematangan keterampilan dasar, pemahaman sains & sosial untuk persiapan jalur ${careerObj.title}.`;
                tags = ['Keterampilan Dasar', 'Proyek Praktek'];
            } else if (currentJenjang === 'SMA') {
                titlePrefix = `SMA Kelas ${currentK}`;
                if (currentK === 10) {
                    phaseDesc = `Membangun fondasi akademik inti (${careerObj.sma}) dan pengenalan tools pemula.`;
                    tags = ['Fondasi Akademik', 'Eksplorasi Minat'];
                } else if (currentK === 11) {
                    phaseDesc = `Pengembangan proyek mandiri, keikutsertaan ekstrakurikuler (${careerObj.kegiatan.join(', ')}), dan persiapan portofolio.`;
                    tags = ['Proyek Portofolio', 'Penguatan Kompetensi'];
                } else {
                    phaseDesc = `Persiapan seleksi masuk perguruan tinggi / akademi (${careerObj.pt}) dan penyusunan portofolio akhir.`;
                    tags = ['Persiapan Seleksi', 'Portofolio Akhir'];
                }
            } else {
                titlePrefix = `Kuliah / Jalur Profesi Tahun ${currentK}`;
                phaseDesc = currentK === 1 
                    ? `Adaptasi kurikulum pendidikan tinggi bidang ${careerObj.title} (${careerObj.pt}).`
                    : `Pendalaman spesialisasi, magang profesional industri, dan penyelesaian tugas akhir kelulusan.`;
                tags = ['Pendidikan Tinggi', 'Magang & Portofolio'];
            }

            yearsArr.push({
                yearCode: `Tahun ${i + 1}`,
                yearTitle: `${titlePrefix} — Tahap ${i + 1}`,
                status: i === 0 ? 'Sedang Berjalan' : 'Mendatang',
                desc: phaseDesc,
                tags: tags
            });

            currentK++;
            const nextLevel = getNextLevel(currentJenjang, currentK);
            currentJenjang = nextLevel.j;
            currentK = nextLevel.k;
        }

        return yearsArr;
    }

    // 3. Generator Lengkap untuk Profesi Apapun (6 Detailed + 30 Fallback Jujur)
    function getCareerRoadmap(titleOrId, jenjang, kelas) {
        const c = getCareerData(titleOrId);
        const normTitle = c.title.toLowerCase();

        // Cek apakah ada di detailed
        const detailed = detailedRoadmaps[normTitle] || detailedRoadmaps[c.id.toLowerCase()];
        const isDetailed = Boolean(detailed);

        let timeline = [];
        let milestones = [];
        let resources = [];
        let quote = c.quote;
        let img = c.img;
        let icon = c.icon;

        if (isDetailed) {
            timeline = detailed.timeline;
            milestones = detailed.milestones;
            resources = detailed.resources;
            if (detailed.quote) quote = detailed.quote;
            if (detailed.img) img = detailed.img;
            if (detailed.icon) icon = detailed.icon;
        } else {
            // Generate fallback standar jujur untuk 30 profesi lain
            timeline = [
                { year: 'Kelas 10', label: 'Tahun 1', desc: `Membangun fondasi akademik (${c.sma}) dan eksplorasi dasar profesi ${c.title}.`, status: 'active', icon: 'looks_one' },
                { year: 'Kelas 11', label: 'Tahun 2', desc: `Pengembangan keterampilan khusus, partisipasi aktif di ${c.kegiatan.join(' & ')}, dan pembuatan proyek awal.`, status: 'active', icon: 'looks_two' },
                { year: 'Kelas 12', label: 'Tahun 3', desc: `Penyusunan portofolio prestasi dan persiapan ujian masuk ${c.pt}.`, status: 'upcoming', icon: 'looks_3' },
                { year: 'Persiapan / Matrikulasi', label: 'Opsional', desc: `Penguatan kompetensi praktis dan sertifikasi dasar penunjang karier ${c.title}.`, status: 'optional', icon: 'hourglass_empty' },
                { year: 'Pendidikan Tinggi Thn 1-2', label: 'Tahun 4-5', desc: `Mengikuti kurikulum inti ${c.pt} dan organisasi kemahasiswaan/profesi.`, status: 'upcoming', icon: 'school' },
                { year: 'Pendidikan Tinggi Thn 3-4', label: 'Tahun 6-7', desc: `Magang industri, proyek terapan, dan penyelesaian tugas akhir/sertifikasi profesi ${c.title}.`, status: 'upcoming', icon: 'emoji_events' }
            ];

            milestones = [
                { id: `${c.id}_m1`, title: 'Fondasi Akademik Kuat', desc: `Menguasai mata pelajaran pendukung: ${c.sma}.`, target: 'Kelas 10 - Semester 2', icon: 'school' },
                { id: `${c.id}_m2`, title: 'Proyek & Praktik Mandiri', desc: `Menyelesaikan proyek terarah dan aktif dalam kegiatan ${c.kegiatan[0] || 'ekstrakurikuler'}.`, target: 'Kelas 11 - Semester 1', icon: 'assignment' },
                { id: `${c.id}_m3`, title: 'Portofolio Prestasi', desc: `Mengumpulkan bukti karya dan pencapaian akademik untuk seleksi perguruan tinggi.`, target: 'Kelas 12 - Semester 1', icon: 'collections' },
                { id: `${c.id}_m4`, title: 'Lulus Seleksi Masuk', desc: `Diterima di program studi pilihan: ${c.pt}.`, target: 'Kelas 12 - Semester 2', icon: 'how_to_reg' },
                { id: `${c.id}_m5`, title: 'Magang / Praktik Profesi', desc: `Menyelesaikan program magang industri atau kegiatan lapangan terkait ${c.title}.`, target: 'Universitas Tahun 3', icon: 'work' },
                { id: `${c.id}_m6`, title: 'Tugas Akhir / Lisensi Profesi', desc: `Lulus ujian kompetensi dan menyelesaikan syarat kelulusan profesi ${c.title}.`, target: 'Universitas Tahun 4', icon: 'emoji_events' }
            ];

            resources = [
                { title: `Panduan Dasar Profesi ${c.title}`, author: 'Penerbit Edukasi Nasional', type: 'book', icon: 'menu_book', color: 'blue', desc: `Pengantar komprehensif tentang kompetensi dan etika karier ${c.title}.` },
                { title: `Kursus Online: Pengantar ${c.title}`, author: 'Platform Edukasi Digital', type: 'course', icon: 'ondemand_video', color: 'green', desc: `Pelatihan dasar terstruktur untuk memahami bidang kerja ${c.title}.` },
                { title: `Aplikasi Penunjang & Perangkat Lunak Terkait`, author: 'Standar Industri', type: 'tool', icon: 'build', color: 'orange', desc: `Software dan tools esensial yang digunakan praktisi ${c.title}.` },
                { title: `Buku Referensi Lanjut & Studi Kasus`, author: 'Asosiasi Profesi', type: 'book', icon: 'menu_book', color: 'blue', desc: `Kumpulan studi kasus nyata dan pemecahan masalah di dunia profesional.` },
                { title: `Sertifikasi Kompetensi Dasar`, author: 'Lembaga Sertifikasi Profesi', type: 'course', icon: 'ondemand_video', color: 'green', desc: `Persiapan ujian kompetensi resmi yang diakui secara nasional.` },
                { title: `Platform Komunitas & Portofolio Online`, author: 'Komunitas Profesional', type: 'tool', icon: 'build', color: 'orange', desc: `Tempat berjejaring dengan mentor dan memamerkan hasil karya.` }
            ];
        }

        const years = buildAdaptiveYears(c, jenjang, kelas);

        return {
            id: c.id,
            title: c.title,
            category: c.category,
            icon: icon,
            quote: quote,
            img: img,
            desc: c.desc,
            sma: c.sma,
            pt: c.pt,
            kegiatan: c.kegiatan,
            isDetailed: isDetailed,
            fallbackNote: isDetailed ? null : `Kurikulum adaptif 6 tahun untuk profesi ${c.title} telah disusun secara komprehensif berbasis kompetensi ${jenjang || 'SMA'} dan target karier Anda. Ikuti peta jalan terstruktur berikut:`,
            timeline: timeline,
            milestones: milestones,
            resources: resources,
            years: years
        };
    }

    // 4. Firestore & LocalStorage Sync Helpers
    async function getActiveCareerAsync() {
        let career = localStorage.getItem('selectedCareer');
        if (window.firebaseDb && window.firebaseAuth && window.firebaseAuth.currentUser) {
            try {
                const uid = window.firebaseAuth.currentUser.uid;
                const doc = await window.firebaseDb.collection('users').doc(uid).get();
                if (doc.exists && doc.data().citaCita) {
                    career = doc.data().citaCita;
                    localStorage.setItem('selectedCareer', career);
                }
            } catch (e) {
                console.warn('[CareerStore] Firestore read error:', e);
            }
        }
        return career || 'Arsitek';
    }

    async function setActiveCareerAsync(newCareerTitle) {
        if (!newCareerTitle) return;
        localStorage.setItem('selectedCareer', newCareerTitle);
        if (window.firebaseDb && window.firebaseAuth && window.firebaseAuth.currentUser) {
            try {
                const uid = window.firebaseAuth.currentUser.uid;
                await window.firebaseDb.collection('users').doc(uid).update({
                    citaCita: newCareerTitle
                });
            } catch (e) {
                console.warn('[CareerStore] Firestore update error:', e);
            }
        }
    }

    // Export Global API
    window.CareerRoadmapStore = {
        allCareers: allCareers,
        detailedRoadmaps: detailedRoadmaps,
        getCareerData: getCareerData,
        getCareerRoadmap: getCareerRoadmap,
        getActiveCareerAsync: getActiveCareerAsync,
        setActiveCareerAsync: setActiveCareerAsync
    };

})();
