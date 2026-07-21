/**
 * Entry point untuk Google Apps Script Web App.
 * URL web app bisa menerima parameter ?page=nama_halaman
 */
function doGet(e) {
  let page = (e && e.parameter && e.parameter.page) ? e.parameter.page : '01_login';
  
  const allowedPages = [
    '01_login', '01_login_panduan', '01_login_bantuan', '01_login_kontak',
    '02_intro-diagnosis', '03_soal-diagnosis', '04_hasil-diagnosis',
    '05_pilih-cita-cita', '06_roadmap-disusun', '07_hasil-roadmap', '08_dashboard-siswa',
    '09_krs-siswa', '10_detail-roadmap', '11_checkpoint-jumat', '12_ganti-cita-cita',
    '13_riwayat-semester', '14_dashboard-guru', '15_tinjauan-guru', '16_dashboard-ortu',
    '17_notifikasi', '18_profil'
  ];
  
  if (!allowedPages.includes(page)) {
    page = '01_login';
  }

  // 1. Dapatkan Email User (jika disetup "Execute as: User accessing")
  let email = '';
  try { email = Session.getActiveUser().getEmail(); } catch (err) {}
  if (!email || email === '') email = 'siswa@flexacendekia.edu'; // fallback
  
  // 2. Ambil data User dari Database
  let userData = null;
  try {
    userData = getRecordByField('Users', 'email', email);
  } catch (err) {
    console.warn("Database belum siap: " + err);
  }
  
  if (!userData) {
    userData = { id: "mock-id", email: email, nama: "Pengguna Baru", peran: "siswa", jenjang: "SMA", kelas: "10" };
  }
  
  const template = HtmlService.createTemplateFromFile('pages/' + page);
  
  // 3. Injeksi data ke Frontend
  template.userData = userData;
  
  if (page === '08_dashboard-siswa') {
    try {
      template.dashboardData = getDashboardData(userData.id) || { poin: 0, progressHariIni: 0 };
    } catch(err) {
      template.dashboardData = { poin: 0, progressHariIni: 0 };
    }
  }
  
  return template.evaluate()
      .setTitle('Flexa Cendekia x UNIPDU')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/**
 * Fungsi untuk include file CSS/JS atau komponen HTML lainnya
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Mendapatkan URL Web App ini.
 */
function getWebAppUrl() {
  return ScriptApp.getService().getUrl();
}

// ==========================================
// API / RPC ENDPOINTS (Untuk Frontend)
// ==========================================

function loginSso(peran) {
  let user = getRecordByField('Users', 'peran', peran);
  if (!user) {
    const email = peran + "@flexacendekia.edu";
    user = addRecord('Users', {
      email: email,
      nama: "Demo " + peran.charAt(0).toUpperCase() + peran.slice(1),
      peran: peran,
      jenjang: "SMA",
      kelas: "10",
      createdAt: new Date().toISOString()
    });
  }
  return user;
}

function simpanDiagnosis(userId, skorMinat, skorBakat, gayaBelajar, kompetensi) {
  const hasil = addRecord('Hasil_Diagnosis', {
    userId: userId,
    tanggal: new Date().toISOString(),
    skorMinat: skorMinat,
    skorBakat: skorBakat,
    gayaBelajar: gayaBelajar,
    kompetensi: kompetensi
  });
  return hasil;
}

function generateRoadmap(userId, profesi) {
  const cita = addRecord('Cita_Cita', {
    userId: userId,
    profesiTarget: profesi,
    status: 'Aktif',
    tanggalPengajuan: new Date().toISOString()
  });
  
  const roadmap = addRecord('Roadmap', {
    userId: userId,
    citaCitaId: cita.id,
    tahunMulai: new Date().getFullYear(),
    tahunSelesai: new Date().getFullYear() + 6,
    status: 'Aktif'
  });
  
  addRecord('Semester_KRS', {
    roadmapId: roadmap.id,
    semesterKe: 1,
    status: 'Menunggu Persetujuan'
  });
  
  return roadmap;
}

function getDashboardData(userId) {
  const roadmap = getRecordByField('Roadmap', 'userId', userId);
  return {
    roadmap: roadmap,
    progressHariIni: 50,
    poin: 1250
  };
}

function updateTargetHarian(targetId, status) {
  return updateRecord('Target_Harian', targetId, { status: status });
}
