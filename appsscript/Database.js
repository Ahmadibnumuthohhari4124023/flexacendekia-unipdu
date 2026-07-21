const APP_NAME = "Flexa Cendekia x UNIPDU";

/**
 * Mendapatkan atau membuat Spreadsheet sebagai database.
 */
function getDatabase() {
  const props = PropertiesService.getScriptProperties();
  let dbId = props.getProperty('DB_ID');
  
  if (dbId) {
    try {
      return SpreadsheetApp.openById(dbId);
    } catch(e) {
      // ID invalid atau terhapus
      dbId = null;
    }
  }
  
  if (!dbId) {
    const ss = SpreadsheetApp.create(APP_NAME + " - Database");
    props.setProperty('DB_ID', ss.getId());
    setupDatabaseTables(ss);
    return ss;
  }
}

/**
 * Menyiapkan sheet (tabel) beserta header-nya.
 * Jalankan fungsi ini (atau jalankan getDatabase()) sekali saat awal deploy.
 */
function setupDatabaseTables(ss) {
  const tables = {
    'Users': ['id', 'email', 'nama', 'peran', 'jenjang', 'kelas', 'createdAt'],
    'Siswa_Profil': ['userId', 'gayaBelajar', 'minatBakat', 'kompetensiDasar', 'roadmapAktifId'],
    'Hasil_Diagnosis': ['id', 'userId', 'tanggal', 'skorMinat', 'skorBakat', 'gayaBelajar', 'kompetensi'],
    'Cita_Cita': ['id', 'userId', 'profesiTarget', 'status', 'tanggalPengajuan', 'tanggalDisetujui', 'disetujuiOlehId'],
    'Roadmap': ['id', 'userId', 'citaCitaId', 'tahunMulai', 'tahunSelesai', 'status'],
    'Semester_KRS': ['id', 'roadmapId', 'semesterKe', 'status', 'disetujuiOlehId'],
    'Target_Mingguan': ['id', 'semesterId', 'mingguKe', 'deskripsi', 'status', 'tanggalCheckpoint'],
    'Target_Harian': ['id', 'mingguId', 'tanggal', 'deskripsi', 'tautanMateri', 'status']
  };

  let sheet1 = ss.getSheetByName('Sheet1');
  
  for (const tableName in tables) {
    let sheet = ss.getSheetByName(tableName);
    if (!sheet) {
      sheet = ss.insertSheet(tableName);
      sheet.appendRow(tables[tableName]);
      sheet.setFrozenRows(1);
      sheet.getRange(1, 1, 1, tables[tableName].length).setFontWeight('bold');
    }
  }

  if (sheet1) {
    try { ss.deleteSheet(sheet1); } catch(e) {}
  }
}

function INITIALIZE_DATABASE() {
  const ss = getDatabase();
  Logger.log("Database berhasil disiapkan. URL Spreadsheet: " + ss.getUrl());
}
