require('dotenv').config();
const mysql = require('mysql2/promise');

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

    console.log('Generating mock data for pending KRS...');
    // Create a mock student user
    await connection.query(`INSERT IGNORE INTO Users (id, email, nama, peran, jenjang, kelas) VALUES ('mock-siswa-1', 'siswa1@flexacendekia.edu', 'Budi Santoso', 'siswa', 'SMA', '11')`);
    await connection.query(`INSERT IGNORE INTO Users (id, email, nama, peran, jenjang, kelas) VALUES ('mock-siswa-2', 'siswa2@flexacendekia.edu', 'Sinta Permata', 'siswa', 'SMA', '10')`);
    await connection.query(`INSERT IGNORE INTO Users (id, email, nama, peran, jenjang, kelas) VALUES ('mock-siswa-3', 'siswa3@flexacendekia.edu', 'Rio Pratama', 'siswa', 'SMA', '10')`);

    // Create Cita_Cita
    await connection.query(`INSERT IGNORE INTO Cita_Cita (id, userId, profesiTarget, status) VALUES ('mock-cita-1', 'mock-siswa-1', 'Data Scientist', 'Aktif')`);
    await connection.query(`INSERT IGNORE INTO Cita_Cita (id, userId, profesiTarget, status) VALUES ('mock-cita-2', 'mock-siswa-2', 'UI/UX Design', 'Aktif')`);
    await connection.query(`INSERT IGNORE INTO Cita_Cita (id, userId, profesiTarget, status) VALUES ('mock-cita-3', 'mock-siswa-3', 'Software Engineer', 'Aktif')`);

    // Create Roadmap
    await connection.query(`INSERT IGNORE INTO Roadmap (id, userId, citaCitaId, tahunMulai, tahunSelesai, status) VALUES ('mock-rm-1', 'mock-siswa-1', 'mock-cita-1', 2024, 2030, 'Aktif')`);
    await connection.query(`INSERT IGNORE INTO Roadmap (id, userId, citaCitaId, tahunMulai, tahunSelesai, status) VALUES ('mock-rm-2', 'mock-siswa-2', 'mock-cita-2', 2024, 2030, 'Aktif')`);
    await connection.query(`INSERT IGNORE INTO Roadmap (id, userId, citaCitaId, tahunMulai, tahunSelesai, status) VALUES ('mock-rm-3', 'mock-siswa-3', 'mock-cita-3', 2024, 2030, 'Aktif')`);

    // Create Semester_KRS
    await connection.query(`INSERT IGNORE INTO Semester_KRS (id, roadmapId, semesterKe, status) VALUES ('mock-krs-1', 'mock-rm-1', 5, 'Menunggu Persetujuan')`);
    await connection.query(`INSERT IGNORE INTO Semester_KRS (id, roadmapId, semesterKe, status) VALUES ('mock-krs-2', 'mock-rm-2', 3, 'Menunggu Persetujuan')`);
    await connection.query(`INSERT IGNORE INTO Semester_KRS (id, roadmapId, semesterKe, status) VALUES ('mock-krs-3', 'mock-rm-3', 1, 'Menunggu Persetujuan')`);
    
    // Default user Ahmad Fauzi (mock-id if used in dashboard)
    await connection.query(`INSERT IGNORE INTO Users (id, email, nama, peran, jenjang, kelas) VALUES ('mock-id', 'siswa@flexacendekia.edu', 'Ahmad Fauzi', 'siswa', 'SMA', '11')`);
    await connection.query(`INSERT IGNORE INTO Cita_Cita (id, userId, profesiTarget, status) VALUES ('mock-cita-af', 'mock-id', 'Arsitek', 'Aktif')`);
    await connection.query(`INSERT IGNORE INTO Roadmap (id, userId, citaCitaId, tahunMulai, tahunSelesai, status) VALUES ('mock-rm-af', 'mock-id', 'mock-cita-af', 2024, 2030, 'Aktif')`);
    await connection.query(`INSERT IGNORE INTO Semester_KRS (id, roadmapId, semesterKe, status) VALUES ('mock-krs-af', 'mock-rm-af', 1, 'Menunggu Persetujuan')`);


    console.log('Mock data created successfully!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

run();
