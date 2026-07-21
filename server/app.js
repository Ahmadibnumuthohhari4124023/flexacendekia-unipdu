/**
 * Flexa Cendekia x UNIPDU — Express Server
 * Entry point utama, menggantikan Google Apps Script.
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const pool = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// Middleware
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (CSS, images, etc.)
app.use('/public', express.static(path.join(__dirname, 'public')));

// ==========================================
// Routes
// ==========================================
const apiRoutes = require('./routes/api');
const pageRoutes = require('./routes/pages');

app.use('/api', apiRoutes);
app.use('/', pageRoutes);

// ==========================================
// Start Server
// ==========================================
async function startServer() {
  // Tes koneksi database
  try {
    const connection = await pool.getConnection();
    console.log('✅ Koneksi MySQL berhasil!');
    connection.release();
  } catch (err) {
    console.error('❌ Gagal konek ke MySQL:', err.message);
    console.error('');
    console.error('   Pastikan MySQL sudah berjalan dan konfigurasi .env benar:');
    console.error('   DB_HOST=' + (process.env.DB_HOST || 'localhost'));
    console.error('   DB_PORT=' + (process.env.DB_PORT || '3306'));
    console.error('   DB_USER=' + (process.env.DB_USER || 'root'));
    console.error('   DB_NAME=' + (process.env.DB_NAME || 'flexa_cendekia'));
    console.error('');
    console.error('   Jalankan schema.sql terlebih dahulu:');
    console.error('   mysql -u root < ../database/schema.sql');
    console.error('');
    // Tetap jalankan server meskipun database gagal (untuk melihat frontend)
    console.warn('⚠️  Server tetap dijalankan tanpa database...');
  }

  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 Flexa Cendekia x UNIPDU Server');
    console.log(`   http://localhost:${PORT}`);
    console.log('');
    console.log('   Halaman tersedia:');
    console.log(`   • Login:     http://localhost:${PORT}/`);
    console.log(`   • Dashboard: http://localhost:${PORT}/?page=08_dashboard-siswa`);
    console.log(`   • API:       http://localhost:${PORT}/api/...`);
    console.log('');
  });
}

startServer();
