/**
 * SSO Sync Engine
 * Sumber kebenaran (Source of Truth) data simulasi Flexa Cendekia.
 * Berbasis localStorage untuk memungkinkan state persistence antar halaman statis.
 */

const SSOSync = {
  // Initialize mock data if not exists
  init: function() {
    if (!localStorage.getItem('sso_initialized')) {
      this._seedData();
      localStorage.setItem('sso_initialized', 'true');
    }
  },

  _seedData: function() {
    // Data Siswa
    const siswaList = [
      { id: 'S001', nama: 'Elsa Dwi Listari', nisn: '0012345678', kelas: '11', jenjang: 'SMA', semesterAktif: 3, citaCita: 'Arsitek', roadmapProgress: 75, ipk: 3.92, point: 1250, status: 'Aktif', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAA5GEUhRNZmbd9I2Y5uexlmtFaWQNh1M_2BXKVbxect_R5qH8Nph755oOB6ojuOh3badOp6NMZv-F6KwBtJ8Ewb3y02A3amohn5_I0YGitgKhuTvnziqdr72juzYNKIUt6AFcw-HYM8kzS3EQf5MpQtMgrUvf5zfnjpssYDjFM84nVrZjo1hGql5vdtp6T2PZ6tWEtblN8eExVl-Q1UALOFLZbEWCbitMsnf1a6tSDwSM0aeFhBPT6zvJ5APfW6p4tHPqUpoZG80' },
      { id: 'S002', nama: 'Ahmad Fauzi', nisn: '0012345679', kelas: '11', jenjang: 'SMA', semesterAktif: 3, citaCita: 'Software Engineer', roadmapProgress: 80, ipk: 3.85, point: 1100, status: 'Aktif', avatar: 'https://i.pravatar.cc/150?u=ahmad' },
      { id: 'S003', nama: 'Budi Santoso', nisn: '0012345680', kelas: '10', jenjang: 'SMA', semesterAktif: 1, citaCita: 'Dokter', roadmapProgress: 20, ipk: 3.50, point: 800, status: 'Aktif', avatar: 'https://i.pravatar.cc/150?u=budi' },
      { id: 'S004', nama: 'Sinta Wati', nisn: '0012345681', kelas: '12', jenjang: 'SMA', semesterAktif: 5, citaCita: 'Akuntan', roadmapProgress: 90, ipk: 3.95, point: 1500, status: 'Aktif', avatar: 'https://i.pravatar.cc/150?u=sinta' },
      { id: 'S005', nama: 'Rio Pratama', nisn: '0012345682', kelas: '10', jenjang: 'SMA', semesterAktif: 1, citaCita: 'Pilot', roadmapProgress: 10, ipk: 3.40, point: 500, status: 'Aktif', avatar: 'https://i.pravatar.cc/150?u=rio' }
    ];
    localStorage.setItem('siswaList', JSON.stringify(siswaList));

    // Data Guru
    const guru = {
      id: 'G001',
      nama: 'Ibu Sari Rahayu',
      nip: '19820412200903',
      alamat: 'Jl. Merdeka No. 45, Jombang',
      gelar: 'S.Pd, M.Pd.',
      pendidikan: [
        { tahun: '2004', instansi: 'Universitas Negeri Malang', jurusan: 'Pendidikan Matematika' },
        { tahun: '2010', instansi: 'Universitas Negeri Surabaya', jurusan: 'Magister Pendidikan' }
      ],
      prestasi: [
        { tahun: '2021', nama: 'Guru Teladan Tingkat Provinsi' }
      ],
      siswaBinaan: ['S001', 'S002', 'S003', 'S004', 'S005'],
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDFc1fM1V1Jj3R8E3X1j1N6P3l1F2nZ3s4A9aQj2O3g5tY4M5K6Z7X8C9V0B1N2M3L4K5J6H7G8F9D0S1A2D3F4G5H6J7K8L9Z0X1C2V3B4N5M6Q7W8E9R0T1Y2U3I4O5P6'
    };
    localStorage.setItem('guru', JSON.stringify(guru));

    // Data Orang Tua
    const ortu = {
      id: 'O001',
      nama: 'Bpk. Heru',
      pekerjaan: 'Pegawai Negeri Sipil',
      alamat: 'Jl. Pahlawan No. 12, Jombang',
      anakIds: ['S002', 'S001'],
      avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjmfn8Oohy461hHurqJW_tx7EO1KK_GsCSLNrvIcAjKQqi6thr-qSWyJo2sMZ2LBeImPB29S45uRu0KELXi8rGxxp60pAn-66EpAYo6w1wN8gm48FdVEw1gg6jHPzDZGTL5iM5Lz7pvMkq6RVTd1hXNrFgtREMnYu-k_wdAzBPsIBatMo9O-U75DE3BjBRGhm8UmCvfFLfkIqjGKSZOdN7runhNXzE_hV46TOa6NfoYHGtn5BUbPVMX28bXUwuWIseVlnpnFgldTE'
    };
    localStorage.setItem('ortu', JSON.stringify(ortu));

    // KRS Pending List
    const krsPending = [
      { id: 'KRS-001', studentId: 'S003', nama: 'Budi Santoso', semester: 2, profesi: 'Dokter', status: 'Menunggu Persetujuan', date: '2023-10-24' },
      { id: 'KRS-002', studentId: 'S004', nama: 'Sinta Wati', semester: 6, profesi: 'Akuntan', status: 'Menunggu Persetujuan', date: '2023-10-23' },
      { id: 'KRS-003', studentId: 'S005', nama: 'Rio Pratama', semester: 2, profesi: 'Pilot', status: 'Menunggu Persetujuan', date: '2023-10-22' },
      { id: 'KRS-004', studentId: 'S002', nama: 'Ahmad Fauzi', semester: 4, profesi: 'Software Engineer', status: 'Menunggu Persetujuan', date: '2023-10-21' }
    ];
    localStorage.setItem('krsPending', JSON.stringify(krsPending));

    // Aspirasi Pending List
    const aspirasiPending = [
      { id: 'ASP-001', studentId: 'S001', nama: 'Elsa Dwi Listari', citaLama: 'Arsitek', citaBaru: 'Desainer Interior', alasan: 'Lebih tertarik pada penataan ruang dalam.', status: 'Menunggu Persetujuan', date: '2023-10-25' }
    ];
    localStorage.setItem('aspirasiPending', JSON.stringify(aspirasiPending));
    
    // Target Terlambat / Risk Students
    const riskStudents = [
      { id: 'RSK-001', studentId: 'S002', nama: 'Ahmad Fauzi', masalah: 'Terlambat target: Matematika Dasar', waktu: '24 jam lalu' }
    ];
    localStorage.setItem('riskStudents', JSON.stringify(riskStudents));

    // Catatan Guru
    const guruNotes = [
      { id: 'N001', studentId: 'S002', catatan: 'Ahmad perlu lebih fokus pada Matematika Dasar. Coba berikan latihan tambahan di rumah.', date: '2023-10-24', dibaca: false }
    ];
    localStorage.setItem('guruNotes', JSON.stringify(guruNotes));

    // Diagnosis Results
    const diagnosisResult = {
      studentId: 'S002',
      minat: 85,
      bakat: 70,
      kompetensi: 90,
      gayaBelajar: 'Visual'
    };
    localStorage.setItem('diagnosisResult', JSON.stringify(diagnosisResult));

    // Data Absensi per siswa (semester ini)
    const absensiData = {
      'S001': { hadir: 88, izin: 4,  alpa: 2, total: 94 },
      'S002': { hadir: 80, izin: 6,  alpa: 8, total: 94 },
      'S003': { hadir: 92, izin: 2,  alpa: 0, total: 94 },
      'S004': { hadir: 90, izin: 3,  alpa: 1, total: 94 },
      'S005': { hadir: 75, izin: 8,  alpa: 11, total: 94 }
    };
    localStorage.setItem('absensiData', JSON.stringify(absensiData));

    // Data Nilai per Mapel per siswa
    const nilaiMapel = {
      'S001': [
        { mapel: 'Matematika',  nilai: 88, trend: 'naik' },
        { mapel: 'B. Indonesia', nilai: 92, trend: 'stabil' },
        { mapel: 'Fisika',       nilai: 75, trend: 'turun' },
        { mapel: 'Sejarah',      nilai: 85, trend: 'naik' },
        { mapel: 'Seni Budaya',  nilai: 90, trend: 'naik' }
      ],
      'S002': [
        { mapel: 'Matematika',  nilai: 64, trend: 'turun' },
        { mapel: 'B. Indonesia', nilai: 80, trend: 'stabil' },
        { mapel: 'Fisika',       nilai: 71, trend: 'stabil' },
        { mapel: 'B. Inggris',   nilai: 88, trend: 'naik' },
        { mapel: 'Informatika',  nilai: 95, trend: 'naik' }
      ],
      'S003': [
        { mapel: 'Matematika',  nilai: 82, trend: 'naik' },
        { mapel: 'Biologi',      nilai: 90, trend: 'naik' },
        { mapel: 'Kimia',        nilai: 78, trend: 'stabil' },
        { mapel: 'B. Indonesia', nilai: 85, trend: 'stabil' },
        { mapel: 'Fisika',       nilai: 74, trend: 'turun' }
      ],
      'S004': [
        { mapel: 'Ekonomi',      nilai: 93, trend: 'naik' },
        { mapel: 'Akuntansi',    nilai: 91, trend: 'naik' },
        { mapel: 'Matematika',   nilai: 88, trend: 'stabil' },
        { mapel: 'B. Indonesia', nilai: 86, trend: 'stabil' },
        { mapel: 'Sosiologi',    nilai: 79, trend: 'turun' }
      ],
      'S005': [
        { mapel: 'Matematika',   nilai: 70, trend: 'stabil' },
        { mapel: 'Fisika',        nilai: 65, trend: 'turun' },
        { mapel: 'B. Inggris',    nilai: 75, trend: 'naik' },
        { mapel: 'Geografi',      nilai: 68, trend: 'turun' },
        { mapel: 'B. Indonesia',  nilai: 78, trend: 'stabil' }
      ]
    };
    localStorage.setItem('nilaiMapel', JSON.stringify(nilaiMapel));

    // Arsip Notifikasi (untuk tombol "Lihat Semua Arsip")
    const notifikasiArsip = [
      { id: 'N001', type: 'keterlambatan', judul: 'Terlambat target: Matematika Dasar', pesan: 'Ahmad belum mengumpulkan tugas Logaritma yang jatuh tempo kemarin.', waktu: '24 jam lalu', studentId: 'S002' },
      { id: 'N002', type: 'pengajuan',     judul: 'Perubahan cita-cita dalam peninjauan', pesan: 'Draft perubahan minat karier menjadi Arsitek sedang ditinjau konselor.', waktu: '6 jam lalu', studentId: 'S002' },
      { id: 'N003', type: 'info',          judul: 'KRS Semester Ganjil Disetujui', pesan: 'Rencana studi untuk semester mendatang telah divalidasi sistem.', waktu: '2 hari lalu', studentId: 'S002' },
      { id: 'N004', type: 'info',          judul: 'Nilai Ujian Tengah Semester Keluar', pesan: 'Nilai UTS Ahmad telah diinput oleh guru mata pelajaran.', waktu: '3 hari lalu', studentId: 'S002' },
      { id: 'N005', type: 'keterlambatan', judul: 'Peringatan Kehadiran', pesan: 'Tingkat kehadiran Ahmad bulan ini di bawah 85%. Harap perhatikan.', waktu: '5 hari lalu', studentId: 'S002' },
      { id: 'N006', type: 'info',          judul: 'Jadwal Pertemuan Wali Murid', pesan: 'Pertemuan wali murid dijadwalkan pada 20 Oktober 2023 pukul 09.00 WIB.', waktu: '1 minggu lalu', studentId: 'S002' },
      { id: 'N007', type: 'pengajuan',     judul: 'Pengajuan Izin Disetujui', pesan: 'Pengajuan izin Ahmad pada 12 Oktober 2023 telah disetujui wali kelas.', waktu: '1 minggu lalu', studentId: 'S002' },
      { id: 'N008', type: 'info',          judul: 'Pengumuman Libur Sekolah', pesan: 'Sekolah libur pada 17-20 Oktober 2023 dalam rangka ujian akhir semester.', waktu: '2 minggu lalu', studentId: 'S002' },
      { id: 'N009', type: 'keterlambatan', judul: 'Tugas Fisika Belum Dikumpulkan', pesan: 'Ahmad belum mengumpulkan laporan praktikum Fisika minggu lalu.', waktu: '2 minggu lalu', studentId: 'S002' },
      { id: 'N010', type: 'info',          judul: 'Prestasi: Juara 2 Olimpiade Informatika', pesan: 'Selamat! Ahmad meraih juara 2 dalam Olimpiade Informatika Tingkat Kota.', waktu: '3 minggu lalu', studentId: 'S002' }
    ];
    localStorage.setItem('notifikasiArsip', JSON.stringify(notifikasiArsip));

    // Balasan catatan guru (thread percakapan)
    const guruNoteReplies = [];
    localStorage.setItem('guruNoteReplies', JSON.stringify(guruNoteReplies));
  },

  // Helpers Data Baru
  getAbsensi: function(studentId) {
    const data = JSON.parse(localStorage.getItem('absensiData')) || {};
    return data[studentId] || null;
  },

  getNilaiMapel: function(studentId) {
    const data = JSON.parse(localStorage.getItem('nilaiMapel')) || {};
    return data[studentId] || [];
  },

  getNotifikasiArsip: function(studentId) {
    const data = JSON.parse(localStorage.getItem('notifikasiArsip')) || [];
    if (studentId) return data.filter(n => n.studentId === studentId);
    return data;
  },

  getGuruNoteReplies: function() {
    return JSON.parse(localStorage.getItem('guruNoteReplies')) || [];
  },

  replyGuruNote: function(replyText, ortuNama) {
    const replies = this.getGuruNoteReplies();
    replies.push({
      id: 'REPLY-' + Date.now(),
      text: replyText,
      pengirim: ortuNama || 'Orang Tua',
      waktu: this.getRealtimeDate('long')
    });
    localStorage.setItem('guruNoteReplies', JSON.stringify(replies));
  },

  // Helpers
  getSiswaList: function() { return JSON.parse(localStorage.getItem('siswaList')) || []; },
  getSiswaById: function(id) { return this.getSiswaList().find(s => s.id === id); },
  getGuru: function() { return JSON.parse(localStorage.getItem('guru')); },
  getOrtu: function() { return JSON.parse(localStorage.getItem('ortu')); },
  
  getKRSPending: function() { return JSON.parse(localStorage.getItem('krsPending')) || []; },
  approveKRS: function(id) {
    let pending = this.getKRSPending();
    pending = pending.filter(k => k.id !== id);
    localStorage.setItem('krsPending', JSON.stringify(pending));
  },
  rejectKRS: function(id) {
    let pending = this.getKRSPending();
    let krs = pending.find(k => k.id === id);
    if(krs) krs.status = 'Ditolak';
    localStorage.setItem('krsPending', JSON.stringify(pending));
  },

  getAspirasiPending: function() { return JSON.parse(localStorage.getItem('aspirasiPending')) || []; },
  approveAspirasi: function(id) {
    let pending = this.getAspirasiPending();
    pending = pending.filter(a => a.id !== id);
    localStorage.setItem('aspirasiPending', JSON.stringify(pending));
  },
  rejectAspirasi: function(id) {
    let pending = this.getAspirasiPending();
    let asp = pending.find(a => a.id === id);
    if(asp) asp.status = 'Ditolak';
    localStorage.setItem('aspirasiPending', JSON.stringify(pending));
  },

  getRiskStudents: function() { return JSON.parse(localStorage.getItem('riskStudents')) || []; },
  
  getGuruNotes: function(studentId) {
    const notes = JSON.parse(localStorage.getItem('guruNotes')) || [];
    if (studentId) return notes.filter(n => n.studentId === studentId);
    return notes;
  },

  getDiagnosisResult: function(studentId) {
    return JSON.parse(localStorage.getItem('diagnosisResult'));
  },

  // Realtime Generators
  getCurrentSemester: function() {
    const d = new Date();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const isGanjil = month >= 7 || month <= 12; // Ganjil: Jul-Dec, Genap: Jan-Jun
    const tahunAjaran = isGanjil ? `${year}/${year+1}` : `${year-1}/${year}`;
    return `Semester ${isGanjil ? 'Ganjil' : 'Genap'} ${tahunAjaran}`;
  },

  getCurrentAcademicYear: function() {
    const d = new Date();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return month >= 7 ? year : year - 1;
  },

  getRealtimeDate: function(format = 'short') {
    const d = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    if (format === 'short') return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} WIB`;
  },
  
  getRoadmapStartYear: function() {
      // Assuming a default start year if not specified
      return this.getCurrentAcademicYear() - 1; // E.g., started last year
  }
};

// Auto-init on load
SSOSync.init();
