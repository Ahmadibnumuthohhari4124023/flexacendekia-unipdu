/**
 * Gemini Service — Handles interactions with Google Gemini API
 * Supports real Gemini API calls + intelligent fallback if GEMINI_API_KEY is not set or fails.
 */

const https = require('https');

async function callGeminiApi(prompt, systemInstruction = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY') {
    return null; // Trigger fallback
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: 'application/json'
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  return new Promise((resolve) => {
    const dataString = JSON.stringify(payload);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
      },
      timeout: 15000
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const jsonRes = JSON.parse(body);
            const textContent = jsonRes?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (textContent) {
              const parsed = JSON.parse(textContent);
              resolve(parsed);
              return;
            }
          }
          console.warn(`[Gemini API] Request status ${res.statusCode}: ${body.slice(0, 150)}`);
          resolve(null);
        } catch (err) {
          console.error('[Gemini API] Parsing error:', err.message);
          resolve(null);
        }
      });
    });

    req.on('error', (err) => {
      console.warn('[Gemini API] Network error, using fallback:', err.message);
      resolve(null);
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn('[Gemini API] Timeout, using fallback');
      resolve(null);
    });

    req.write(dataString);
    req.end();
  });
}

/**
 * Generate AI Diagnosis Result based on 40 answers
 */
async function generateDiagnosis(answers = {}) {
  const prompt = `Analisis 40 jawaban tes siswa berikut ini: ${JSON.stringify(answers)}.
Keluarkan format JSON dengan struktur persis seperti berikut:
{
  "riasec": {
    "Investigatif": 85,
    "Artistik": 78,
    "Sosial": 42,
    "Realistik": 35,
    "Konvensional": 28,
    "Enterprising": 54
  },
  "gayaBelajar": {
    "Visual": 72,
    "Auditori": 18,
    "Kinestetik": 10
  },
  "narasiRiasec": "Berdasarkan analisis Gemini AI, Anda memiliki kecenderungan analitis dan kreatif yang kuat...",
  "narasiGayaBelajar": "Anda paling efektif menyerap informasi melalui peta konsep, diagram visual, dan video interaktif...",
  "rekomendasiKarir": [
    {
      "id": "arsitek",
      "title": "Arsitek",
      "icon": "architecture",
      "tag": "Presisi & Seni",
      "desc": "Gabungan presisi sains, matematika terapan, dan kebebasan desain arsitektur visual."
    },
    {
      "id": "data_scientist",
      "title": "Data Scientist",
      "icon": "query_stats",
      "tag": "Analisis & AI",
      "desc": "Menganalisis pola data besar, statistik lanjut, dan membangun pemodelan Machine Learning."
    },
    {
      "id": "system_architect",
      "title": "Arsitek Sistem",
      "icon": "hub",
      "tag": "Teknologi & Infrastruktur",
      "desc": "Merancang struktur piranti lunak, skalabilitas cloud, dan arsitektur ekosistem digital."
    }
  ]
}`;

  const systemInst = `Anda adalah konselor karir dan psikolog pendidikan berbasis AI di Flexa Cendekia x UNIPDU. Berikan respon murni JSON tanpa markdown backticks.`;

  const aiResult = await callGeminiApi(prompt, systemInst);
  if (aiResult && aiResult.riasec && aiResult.rekomendasiKarir) {
    return { ...aiResult, source: 'Gemini AI' };
  }

  // --- FALLBACK HEURISTIC GENERATOR ---
  let rCount = { 'Investigatif': 45, 'Artistik': 40, 'Sosial': 30, 'Realistik': 25, 'Konvensional': 20, 'Enterprising': 35 };
  let vCount = { 'Visual': 40, 'Auditori': 30, 'Kinestetik': 30 };

  Object.entries(answers).forEach(([qNum, ansIdx]) => {
    const q = parseInt(qNum);
    if (q <= 10) {
      if (ansIdx === 0) rCount['Investigatif'] += 8;
      else if (ansIdx === 1) rCount['Artistik'] += 8;
      else if (ansIdx === 2) rCount['Realistik'] += 8;
      else if (ansIdx === 3) rCount['Sosial'] += 8;
    } else if (q >= 21 && q <= 30) {
      if (ansIdx === 0) vCount['Visual'] += 10;
      else if (ansIdx === 1) vCount['Auditori'] += 10;
      else if (ansIdx >= 2) vCount['Kinestetik'] += 10;
    }
  });

  const totalV = vCount.Visual + vCount.Auditori + vCount.Kinestetik;
  const vPerc = {
    Visual: Math.round((vCount.Visual / totalV) * 100),
    Auditori: Math.round((vCount.Auditori / totalV) * 100),
    Kinestetik: Math.round((vCount.Kinestetik / totalV) * 100)
  };

  const sortedR = Object.entries(rCount).sort((a,b) => b[1] - a[1]);
  const top1 = sortedR[0][0];
  const top2 = sortedR[1][0];

  return {
    source: 'Smart Engine (Fallback)',
    riasec: rCount,
    gayaBelajar: vPerc,
    narasiRiasec: `Berdasarkan respons tes Anda, Anda memiliki profil kecenderungan utama di bidang <strong>${top1}</strong> dan <strong>${top2}</strong>. Kombinasi ini menunjukkan bakat pemecahan masalah serta dorongan eksplorasi yang tinggi.`,
    narasiGayaBelajar: `Gaya belajar dominan Anda adalah <strong>${Object.entries(vPerc).sort((a,b)=>b[1]-a[1])[0][0]}</strong>. Anda paling cepat menyerap materi dengan visualisasi peta konsep, ilustrasi terstruktur, dan contoh studi kasus nyata.`,
    rekomendasiKarir: [
      {
        id: "arsitek",
        title: "Arsitek",
        icon: "architecture",
        tag: "Presisi & Seni",
        desc: "S1 Arsitektur. Gabungan presisi sains, estetika lingkungan, dan desain struktur."
      },
      {
        id: "data_scientist",
        title: "Data Scientist",
        icon: "query_stats",
        tag: "Analisis & AI",
        desc: "S1 Ilmu Data / Statistika. Mengolah data analitis, machine learning, & visualisasi."
      },
      {
        id: "system_architect",
        title: "Arsitek Sistem",
        icon: "hub",
        tag: "Teknologi",
        desc: "S1 Teknik Informatika. Merancang struktur software, cloud, & jaringan komputer."
      }
    ]
  };
}

/**
 * Generate AI 6-Year Roadmap based on Selected Career
 */
async function generateRoadmap(career = 'Arsitek', diagnosisData = {}) {
  const prompt = `Buatkan Roadmap Pendidikan & Pengembangan Karir 6 Tahun untuk cita-cita karir: "${career}".
Keluarkah format JSON dengan struktur berikut:
{
  "careerTitle": "${career}",
  "quote": "Quote inspiratif profesional untuk bidang ${career}.",
  "years": [
    {
      "yearCode": "10",
      "yearTitle": "SMA Kelas 10 — Fondasi & Eksplorasi",
      "status": "Selesai",
      "desc": "Penguatan materi dasar matematika, literasi, dan pembentukan kebiasaan belajar.",
      "tags": ["Penguatan Matematika", "Klub Sains"]
    },
    {
      "yearCode": "11",
      "yearTitle": "SMA Kelas 11 — Spesialisasi & Portofolio (Sekarang)",
      "status": "Sedang Berjalan",
      "desc": "Fokus pada mata pelajaran pendukung utama karir ${career} dan keterlibatan proyek lomba.",
      "tags": ["Olimpiade", "Proyek Mandiri", "Keterampilan Digital"]
    },
    {
      "yearCode": "12",
      "yearTitle": "SMA Kelas 12 — Persiapan SNBT & Mandiri",
      "status": "Mendatang",
      "desc": "Intensifikasi soal latihan, tryout nasional, dan penentuan jurusan target di universitas.",
      "tags": ["Tryout SNBT", "Bimbingan PTN"]
    },
    {
      "yearCode": "K1",
      "yearTitle": "Kuliah Tahun 1 — Penguasaan Dasar Prodi",
      "status": "Mendatang",
      "desc": "Masuk ke jurusan perkuliahan pilihan dan menguasai mata kuliah dasar prodi.",
      "tags": ["Pemrograman/Dasar Desain", "Adaptasi Kampus"]
    },
    {
      "yearCode": "K2",
      "yearTitle": "Kuliah Tahun 2 — Magang & Proyek Industri",
      "status": "Mendatang",
      "desc": "Mengikuti program magang industri dan membangun jejaring profesional.",
      "tags": ["Magang Industri", "Sertifikasi Profesional"]
    },
    {
      "yearCode": "K3",
      "yearTitle": "Kuliah Tahun 3-4 — Tugas Akhir & Karir",
      "status": "Mendatang",
      "desc": "Penyelesaian tugas akhir/skripsi dan persiapan memasuki dunia kerja profesional.",
      "tags": ["Tugas Akhir", "Kesiapan Karir"]
    }
  ]
}`;

  const systemInst = `Anda adalah pakar penyusun kurikulum pendidikan 6 tahun di Flexa Cendekia x UNIPDU. Berikan respon murni JSON tanpa markdown backticks.`;

  const aiResult = await callGeminiApi(prompt, systemInst);
  if (aiResult && aiResult.years && aiResult.years.length > 0) {
    return { ...aiResult, source: 'Gemini AI' };
  }

  // --- FALLBACK HEURISTIC ROADMAP ---
  return {
    source: 'Smart Engine (Fallback)',
    careerTitle: career,
    quote: `"${career} tidak hanya dibangun dalam sehari, tetapi melalui perencanaan terstruktur selama 6 tahun."`,
    years: [
      {
        yearCode: "10",
        yearTitle: "SMA Kelas 10 — Fondasi & Eksplorasi Dasar",
        status: "Selesai",
        desc: "Penguatan fondasi logika, sains dasar, dan pembentukan karakter belajar mandiri.",
        tags: ["Dasar Matematika", "Literasi Digital"]
      },
      {
        yearCode: "11",
        yearTitle: `SMA Kelas 11 — Spesialisasi & Portofolio (${career})`,
        status: "Sedang Berjalan",
        desc: `Pengembangan keterampilan khusus yang relevan dengan karir ${career} dan persiapan olimpiade.`,
        tags: ["Proyek Praktek", "Olimpiade Sains", "Mentoring Guru"]
      },
      {
        yearCode: "12",
        yearTitle: "SMA Kelas 12 — Strategi Kelulusan & SNBT PTN",
        status: "Mendatang",
        desc: "Latihan intensif soal SNBT, pendaftaran perguruan tinggi pilihan, dan pendaftaran beasiswa.",
        tags: ["Tryout SNBT", "Portofolio Prestasi"]
      },
      {
        yearCode: "K1",
        yearTitle: "Kuliah Th 1 — Adaptasi Akademik Perguruan Tinggi",
        status: "Mendatang",
        desc: "Memahami kurikulum perkuliahan dasar dan aktif di organisasi mahasiswa terkemuka.",
        tags: ["Dasar Keahlian", "Klub Mahasiswa"]
      },
      {
        yearCode: "K2",
        yearTitle: "Kuliah Th 2 — Proyek Industri & Keterampilan Praktis",
        status: "Mendatang",
        desc: "Keterlibatan langsung dalam riset dosen dan program magang kerja profesional.",
        tags: ["Riset & Magang", "Sertifikasi Bidang"]
      },
      {
        yearCode: "K3",
        yearTitle: "Kuliah Th 3-4 — Kelulusan & Transisi Karir",
        status: "Mendatang",
        desc: "Penyusunan tugas akhir/skripsi dan persiapan rekrutmen perusahaan kerja.",
        tags: ["Skripsi", "Karir Profesional"]
      }
    ]
  };
}

module.exports = {
  generateDiagnosis,
  generateRoadmap
};
