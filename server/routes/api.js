/**
 * API Routes — REST endpoints pengganti google.script.run
 */
const express = require('express');
const router = express.Router();
const { getRecords, getRecordByField, addRecord, updateRecord } = require('../models');
<<<<<<< HEAD
=======
const pool = require('../config/database');
>>>>>>> d9987a26ee64d14bf5c2746ff3efc2d734945487
const { generateDiagnosis, generateRoadmap } = require('../services/geminiService');

// ==========================================
// POST /api/login — Menggantikan loginSso()
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { peran } = req.body;
    if (!peran) return res.status(400).json({ error: 'Peran wajib diisi' });

    // Cari user berdasarkan peran
    let user = await getRecordByField('Users', 'peran', peran);

    if (!user) {
      const email = peran + '@flexacendekia.edu';
      user = await addRecord('Users', {
        email: email,
        nama: 'Demo ' + peran.charAt(0).toUpperCase() + peran.slice(1),
        peran: peran,
        jenjang: 'SMA',
        kelas: '10'
      });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// POST /api/diagnosis — Menggantikan simpanDiagnosis()
// ==========================================
router.post('/diagnosis', async (req, res) => {
  try {
    const { userId, skorMinat, skorBakat, gayaBelajar, kompetensi } = req.body;

    if (!userId) return res.status(400).json({ error: 'userId wajib diisi' });

    const hasil = await addRecord('Hasil_Diagnosis', {
      userId,
      tanggal: new Date().toISOString().slice(0, 19).replace('T', ' '),
      skorMinat: skorMinat || 0,
      skorBakat: skorBakat || 0,
      gayaBelajar: gayaBelajar || '',
      kompetensi: kompetensi || ''
    });

    res.json({ success: true, data: hasil });
  } catch (err) {
    console.error('Diagnosis error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// POST /api/roadmap — Menggantikan generateRoadmap()
// ==========================================
router.post('/roadmap', async (req, res) => {
  try {
    const { userId, profesi } = req.body;

    if (!userId || !profesi) {
      return res.status(400).json({ error: 'userId dan profesi wajib diisi' });
    }

    // 1. Buat Cita-Cita
    const cita = await addRecord('Cita_Cita', {
      userId,
      profesiTarget: profesi,
      status: 'Aktif'
    });

    // 2. Buat Roadmap
    const now = new Date();
    const roadmap = await addRecord('Roadmap', {
      userId,
      citaCitaId: cita.id,
      tahunMulai: now.getFullYear(),
      tahunSelesai: now.getFullYear() + 6,
      status: 'Aktif'
    });

    // 3. Buat Semester KRS pertama
    await addRecord('Semester_KRS', {
      roadmapId: roadmap.id,
      semesterKe: 1,
      status: 'Menunggu Persetujuan'
    });

    res.json({ success: true, data: roadmap });
  } catch (err) {
    console.error('Roadmap error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// GET /api/dashboard/:userId — Menggantikan getDashboardData()
// ==========================================
router.get('/dashboard/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const roadmap = await getRecordByField('Roadmap', 'userId', userId);

    res.json({
      success: true,
      data: {
        roadmap: roadmap,
        progressHariIni: 50,
        poin: 1250
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// PUT /api/target/:targetId — Menggantikan updateTargetHarian()
// ==========================================
router.put('/target/:targetId', async (req, res) => {
  try {
    const { targetId } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ error: 'Status wajib diisi' });

    const success = await updateRecord('Target_Harian', targetId, { status });
    res.json({ success });
  } catch (err) {
    console.error('Update target error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// GET /api/user/:email — Mendapatkan data user
// ==========================================
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await getRecordByField('Users', 'email', email);
    
    if (!user) {
      return res.json({
        success: true,
        data: {
          id: 'mock-id',
          email: email,
          nama: 'Pengguna Baru',
          peran: 'siswa',
          jenjang: 'SMA',
          kelas: '10'
        }
      });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// POST /api/ai/generate-diagnosis — Gemini AI Diagnosis
// ==========================================
router.post('/ai/generate-diagnosis', async (req, res) => {
  try {
    const { answers } = req.body;
    const result = await generateDiagnosis(answers || {});
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('AI Diagnosis error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// POST /api/ai/generate-roadmap — Gemini AI 6-Year Roadmap
// ==========================================
router.post('/ai/generate-roadmap', async (req, res) => {
  try {
    const { career, diagnosisData } = req.body;
    const result = await generateRoadmap(career || 'Arsitek', diagnosisData || {});
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('AI Roadmap error:', err);
    res.status(500).json({ error: err.message });
  }
});

<<<<<<< HEAD
=======
// ==========================================
// GET /api/krs/pending — Ambil antrean KRS
// ==========================================
router.get('/krs/pending', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT krs.id as krsId, krs.semesterKe, krs.status, u.nama, u.id as studentId,
             c.profesiTarget, r.tahunMulai
      FROM Semester_KRS krs
      JOIN Roadmap r ON krs.roadmapId = r.id
      JOIN Cita_Cita c ON r.citaCitaId = c.id
      JOIN Users u ON r.userId = u.id
      WHERE krs.status = 'Menunggu Persetujuan'
    `);
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error('Get pending KRS error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// GET /api/krs/:krsId — Ambil detail KRS
// ==========================================
router.get('/krs/:krsId', async (req, res) => {
  try {
    const { krsId } = req.params;
    const [rows] = await pool.query(`
      SELECT krs.id as krsId, krs.semesterKe, krs.status, krs.catatanGuru, u.nama, u.id as studentId,
             c.profesiTarget, r.tahunMulai
      FROM Semester_KRS krs
      JOIN Roadmap r ON krs.roadmapId = r.id
      JOIN Cita_Cita c ON r.citaCitaId = c.id
      JOIN Users u ON r.userId = u.id
      WHERE krs.id = ?
    `, [krsId]);
    if (rows.length === 0) return res.status(404).json({ error: 'KRS not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    console.error('Get KRS detail error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// PUT /api/krs/approve/:krsId — Approve/Reject KRS
// ==========================================
router.put('/krs/approve/:krsId', async (req, res) => {
  try {
    const { krsId } = req.params;
    const { status, catatanGuru } = req.body;
    await updateRecord('Semester_KRS', krsId, { status, catatanGuru });
    res.json({ success: true });
  } catch (err) {
    console.error('Approve KRS error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// GET /api/krs/student/:userId — Ambil KRS aktif siswa
// ==========================================
router.get('/krs/student/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await pool.query(`
      SELECT krs.id as krsId, krs.semesterKe, krs.status, krs.catatanGuru,
             c.profesiTarget, u.nama, u.id as studentId
      FROM Semester_KRS krs
      JOIN Roadmap r ON krs.roadmapId = r.id
      JOIN Cita_Cita c ON r.citaCitaId = c.id
      JOIN Users u ON r.userId = u.id
      WHERE r.userId = ?
      ORDER BY krs.semesterKe DESC LIMIT 1
    `, [userId]);
    if (rows.length === 0) return res.json({ success: true, data: null });
    
    let data = rows[0];
    
    // Mapping Modul Dinamis Sederhana
    const moduleMap = {
      'Arsitek': [
        { kode: 'MAT-101', nama: 'Geometri Ruang', kompetensi: 'Analisis Spasial', pacing: 'Menengah', status: 'WAJIB' },
        { kode: 'ARS-202', nama: 'Sejarah Arsitektur Dunia', kompetensi: 'Literasi Budaya', pacing: 'Tinggi', status: 'PILIHAN' },
        { kode: 'DSN-105', nama: 'Sketsa Dasar', kompetensi: 'Teknik Visualisasi', pacing: 'Menengah', status: 'WAJIB' },
        { kode: 'FIS-103', nama: 'Fisika Bangunan I', kompetensi: 'Mekanika Struktur', pacing: 'Tinggi', status: 'WAJIB' }
      ],
      'Data Scientist': [
        { kode: 'MAT-201', nama: 'Aljabar Linier', kompetensi: 'Matematika Dasar', pacing: 'Tinggi', status: 'WAJIB' },
        { kode: 'KOM-101', nama: 'Algoritma & Pemrograman', kompetensi: 'Logika Komputasi', pacing: 'Menengah', status: 'WAJIB' },
        { kode: 'DS-101', nama: 'Pengantar Data Science', kompetensi: 'Analitik Data', pacing: 'Menengah', status: 'WAJIB' },
        { kode: 'STT-202', nama: 'Statistika Inferensial', kompetensi: 'Analitik Lanjut', pacing: 'Tinggi', status: 'PILIHAN' }
      ],
      'UI/UX Design': [
        { kode: 'DSN-101', nama: 'Prinsip Desain Visual', kompetensi: 'Estetika', pacing: 'Menengah', status: 'WAJIB' },
        { kode: 'UX-201', nama: 'Riset Pengguna', kompetensi: 'Psikologi Interaksi', pacing: 'Tinggi', status: 'WAJIB' },
        { kode: 'KOM-105', nama: 'HTML/CSS Dasar', kompetensi: 'Teknologi Web', pacing: 'Rendah', status: 'PILIHAN' }
      ]
    };
    
    data.modules = moduleMap[data.profesiTarget] || [
      { kode: 'UM-101', nama: 'Mata Pelajaran Umum Dasar', kompetensi: 'Pengetahuan Umum', pacing: 'Menengah', status: 'WAJIB' }
    ];

    res.json({ success: true, data: data });
  } catch (err) {
    console.error('Get Student KRS error:', err);
    res.status(500).json({ error: err.message });
  }
});

>>>>>>> d9987a26ee64d14bf5c2746ff3efc2d734945487
module.exports = router;
