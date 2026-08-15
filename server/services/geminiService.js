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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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

  // Normalize RIASEC to max 100
  const maxR = Math.max(...Object.values(rCount));
  if (maxR > 100) {
    const scaleR = 100 / maxR;
    Object.keys(rCount).forEach(k => rCount[k] = Math.round(rCount[k] * scaleR));
  } else {
    Object.keys(rCount).forEach(k => rCount[k] = Math.round(rCount[k]));
  }

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
async function generateRoadmap(career = 'Arsitek', diagnosisData = {}, jenjang = 'SMA', kelas = 10) {
  let startYearText = `${jenjang} Kelas ${kelas}`;
  const prompt = `Buatkan Roadmap Pendidikan & Pengembangan Karir 6 Tahun untuk cita-cita karir: "${career}", dimulai dari tahap ${startYearText} ke 6 tahun berikutnya.
Keluarkah format JSON dengan struktur berikut:
{
  "careerTitle": "${career}",
  "quote": "Quote inspiratif profesional untuk bidang ${career}.",
  "years": [
    {
      "yearCode": "Tahun 1",
      "yearTitle": "${startYearText} — Fondasi & Eksplorasi",
      "status": "Sedang Berjalan",
      "desc": "Penguatan materi dasar matematika, literasi, dan pembentukan kebiasaan belajar.",
      "tags": ["Penguatan Matematika", "Klub Sains"]
    },
    ... (tambahkan hingga 6 objek untuk 6 tahun ke depan, hitung level kelas secara rasional)
  ]
}`;

  const systemInst = `Anda adalah pakar penyusun kurikulum pendidikan 6 tahun di Flexa Cendekia x UNIPDU. Berikan respon murni JSON tanpa markdown backticks.`;

  const aiResult = await callGeminiApi(prompt, systemInst);
  if (aiResult && aiResult.years && aiResult.years.length > 0) {
    return { ...aiResult, source: 'Gemini AI' };
  }

  // --- FALLBACK HEURISTIC ROADMAP DYNAMIC 6-YEARS ---
  const yearsArr = [];
  const startKelas = parseInt(kelas) || 10;
  let currentJenjang = jenjang.toUpperCase();
  let currentK = startKelas;

  const labelsJenjang = { 'SD': 6, 'SMP': 3, 'SMA': 3, 'KULIAH': 4 };
  const getNextLevel = (jenj, kel) => {
    if (jenj === 'SD' && kel > 6) return { j: 'SMP', k: 7 };
    if (jenj === 'SMP' && kel > 9) return { j: 'SMA', k: 10 };
    if (jenj === 'SMA' && kel > 12) return { j: 'KULIAH', k: 1 };
    return { j: jenj, k: kel };
  };

  for (let i = 0; i < 6; i++) {
    let titlePrefix = '';
    let phaseDesc = '';
    let tags = [];

    if (currentJenjang === 'SD') {
      titlePrefix = `SD Kelas ${currentK}`;
      phaseDesc = `Pengenalan minat belajar dan fondasi logika berpikir dasar untuk ${career}.`;
      tags = ["Eksplorasi Minat", "Logika Dasar"];
    } else if (currentJenjang === 'SMP') {
      titlePrefix = `SMP Kelas ${currentK}`;
      phaseDesc = `Pematangan keterampilan pra-remaja dan pembentukan disiplin belajar terkait ${career}.`;
      tags = ["Penguatan Konsep", "Keterampilan Dasar"];
    } else if (currentJenjang === 'SMA') {
      titlePrefix = `SMA Kelas ${currentK}`;
      if (currentK === 10) phaseDesc = "Penguatan fondasi logika, sains dasar, dan pembentukan karakter belajar mandiri.";
      else if (currentK === 11) phaseDesc = `Pengembangan keterampilan khusus yang relevan dengan karir ${career} dan persiapan olimpiade.`;
      else phaseDesc = "Latihan intensif soal SNBT, pendaftaran perguruan tinggi pilihan, dan pendaftaran beasiswa.";
      tags = currentK === 12 ? ["Tryout SNBT", "Portofolio"] : ["Olimpiade Sains", "Proyek Praktek"];
    } else {
      titlePrefix = `Kuliah Tahun ${currentK}`;
      phaseDesc = currentK === 1 ? "Adaptasi kurikulum perkuliahan dan partisipasi klub mahasiswa." : "Proyek industri, magang, dan persiapan karir profesional.";
      tags = ["Keahlian Khusus", "Magang & Riset"];
    }

    yearsArr.push({
      yearCode: `Tahun ${i+1}`,
      yearTitle: `${titlePrefix} — Tahap ${i+1}`,
      status: i === 0 ? "Sedang Berjalan" : "Mendatang",
      desc: phaseDesc,
      tags: tags
    });

    currentK++;
    const nextLevel = getNextLevel(currentJenjang, currentK);
    currentJenjang = nextLevel.j;
    currentK = nextLevel.k;
  }

  return {
    source: 'Smart Engine (Fallback)',
    careerTitle: career,
    quote: `"${career} tidak hanya dibangun dalam sehari, tetapi melalui perencanaan terstruktur selama 6 tahun."`,
    years: yearsArr
  };
}

module.exports = {
  generateDiagnosis,
  generateRoadmap
};
