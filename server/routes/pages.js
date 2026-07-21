/**
 * Page Routes — Menampilkan halaman HTML (menggantikan doGet di Apps Script).
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const ALLOWED_PAGES = [
  '01_login', '01_login_panduan', '01_login_bantuan', '01_login_kontak',
  '02_intro-diagnosis', '03_soal-diagnosis', '04_hasil-diagnosis',
  '05_pilih-cita-cita', '06_roadmap-disusun', '07_hasil-roadmap', '08_dashboard-siswa',
  '09_krs-siswa', '10_detail-roadmap', '11_checkpoint-jumat', '12_ganti-cita-cita',
  '13_riwayat-semester', '14_dashboard-guru', '15_tinjauan-guru', '16_dashboard-ortu',
  '17_notifikasi', '18_profil'
];

router.get('/', (req, res) => {
  let page = req.query.page || '01_login';

  if (!ALLOWED_PAGES.includes(page)) {
    page = '01_login';
  }

  const filePath = path.join(__dirname, '..', 'views', page + '.html');

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send(`
      <div style="font-family:sans-serif;text-align:center;padding:80px 20px;">
        <h1 style="color:#ba1a1a;">404 — Halaman Tidak Ditemukan</h1>
        <p style="color:#666;">Halaman <code>${page}</code> tidak tersedia.</p>
        <a href="/" style="color:#020b24;">← Kembali ke Login</a>
      </div>
    `);
  }
});

module.exports = router;
