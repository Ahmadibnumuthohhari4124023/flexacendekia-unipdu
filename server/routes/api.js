/**
 * API Routes — REST endpoints pengganti google.script.run
 */
const express = require('express');
const router = express.Router();
const { getRecords, getRecordByField, addRecord, updateRecord } = require('../models');
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

module.exports = router;
