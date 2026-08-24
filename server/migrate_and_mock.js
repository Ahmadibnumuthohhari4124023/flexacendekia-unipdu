require('dotenv').config();
const mysql = require('mysql2/promise');
const { FLEXA_STUDENTS_DATA } = require('./public/siswa_master_data');

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'flexa_cendekia'
  });

  try {
    console.log('Adding catatanGuru column if it does not exist...');
    try {
      await connection.query(`ALTER TABLE Semester_KRS ADD COLUMN catatanGuru TEXT DEFAULT NULL`);
      console.log('Column catatanGuru added.');
    } catch (err) {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log('Column catatanGuru already exists.');
      } else {
        throw err;
      }
    }

    console.log('Generating 9 official Flexa Cendekia students data...');
    
    // Insert Guru & Ortu
    await connection.query(`INSERT IGNORE INTO Users (id, email, nama, peran, jenjang, kelas) VALUES ('guru-sari-1', 'guru@flexa.test', 'Ibu Sari Rahayu, M.Pd.', 'guru', 'SMA', '10')`);
    await connection.query(`INSERT IGNORE INTO Users (id, email, nama, peran, jenjang, kelas) VALUES ('ortu-hendra-1', 'ortu@flexa.test', 'Bpk. Hendra Pratama', 'ortu', 'SMA', '10')`);

    // Insert 9 Students in clean initial state (no diagnosis, no krs yet)
    for (const s of FLEXA_STUDENTS_DATA) {
      const uId = `siswa-${s.nis}`;

      await connection.query(
        `INSERT INTO Users (id, email, nama, peran, jenjang, kelas) VALUES (?, ?, ?, 'siswa', ?, ?) ON DUPLICATE KEY UPDATE email=VALUES(email), nama=VALUES(nama), peran=VALUES(peran), jenjang=VALUES(jenjang), kelas=VALUES(kelas)`,
        [uId, s.email, s.nama, s.jenjang, String(s.kelas)]
      );

      await connection.query(
        `INSERT INTO Siswa_Profil (id, userId, gayaBelajar, minatBakat, kompetensiDasar, roadmapAktifId) VALUES (?, ?, ?, ?, ?, NULL) ON DUPLICATE KEY UPDATE gayaBelajar=VALUES(gayaBelajar), minatBakat=VALUES(minatBakat), kompetensiDasar=VALUES(kompetensiDasar)`,
        [`prof-${s.nis}`, uId, '', '', '']
      );
    }

    console.log('✅ 9 official Flexa Cendekia students data reset to clean initial state in MySQL successfully!');
  } catch (err) {
    console.error('Error during MySQL mock migration:', err);
  } finally {
    await connection.end();
  }
}

run();
