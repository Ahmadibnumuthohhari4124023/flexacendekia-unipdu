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
