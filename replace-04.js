const fs = require('fs');
let content = fs.readFileSync('04_hasil-diagnosis/code.html', 'utf8');

const oldJs = `        // ==========================================
        // MAIN DOM LOADED — Fetch AI & Render All
        // ==========================================
        document.addEventListener('DOMContentLoaded', async () => {`;

const newJs = `        // ==========================================
        // MAIN DOM LOADED — Fetch AI & Render All
        // ==========================================
        document.addEventListener('DOMContentLoaded', async () => {
            // Kita akan menunggu event auth-ready untuk mengambil uid
        });

        window.addEventListener('auth-ready', async function(e) {
            const user = e.detail;
            
            // Set User Name
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
            }`;

content = content.replace(oldJs, newJs);

const oldAiLogic = `            let aiData = null;
            try {
                const res = await fetch('/api/ai/generate-diagnosis', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ answers })
                });
                const json = await res.json();
                if (json.success && json.data) {
                    aiData = json.data;
                }
            } catch (err) {
                console.warn('API error, falling back to smart client generator:', err);
            }

            // Fallback rich AI Data structure if API key missing or offline
            if (!aiData) {
                aiData = {
                    source: 'Gemini AI',
                    riasec: { 'Investigatif': 85, 'Artistik': 78, 'Sosial': 42, 'Realistik': 35, 'Konvensional': 28, 'Enterprising': 54 },
                    gayaBelajar: { 'Visual': 72, 'Auditori': 18, 'Kinestetik': 10 },
                    narasiRiasec: 'Berdasarkan respons tes Anda, Anda memiliki profil yang kuat di bidang <strong>Investigatif</strong> dan <strong>Artistik</strong>. Anda cenderung menikmati pemecahan masalah yang kompleks melalui pemikiran analitis sekaligus mengekspresikan ide secara kreatif.',
                    narasiGayaBelajar: 'Gaya belajar utama Anda adalah <strong>Visual (72%)</strong>. Anda paling efektif menyerap informasi melalui <strong>infografis, peta konsep, dan video tutorial</strong>.',
                    saranKarir: [
                        { title: 'Data Scientist', icon: 'query_stats', desc: 'Menganalisis pola data besar, statistik lanjut, & Machine Learning.' },
                        { title: 'Arsitek Sistem', icon: 'hub', desc: 'Merancang infrastruktur piranti lunak, cloud, & ekosistem digital.' },
                        { title: 'UI/UX Designer', icon: 'palette', desc: 'Mendesain antarmuka aplikasi dengan prinsip estetika & pengalaman pengguna.' },
                        { title: 'Peneliti Bioteknologi', icon: 'biotech', desc: 'Riset genetika, analisis bioinformatika, dan teknologi medis.' },
                        { title: 'Arsitek Bangunan', icon: 'architecture', desc: 'Memadukan seni perancangan ruang, estetika, dan ketahanan struktur.' },
                        { title: 'Insinyur Robotika', icon: 'precision_manufacturing', desc: 'Mengembangkan sistem mekanik cerdas dan otomatisasi berbasis AI.' },
                        { title: 'Pengembang AI', icon: 'smart_toy', desc: 'Membangun algoritma kecerdasan buatan & neural network.' },
                        { title: 'Game Developer', icon: 'sports_esports', desc: 'Menciptakan pengalaman game interaktif dengan grafis & logika terapan.' }
                    ],
                    rekomendasiPembelajaran: [
                        { title: 'Modul Visual: Logika Pemrograman', icon: 'menu_book', desc: 'Pelajari dasar logika dan algoritma komputer dengan bantuan flowchart dan visualiasi peta konsep.', link: 'Mulai Belajar' },
                        { title: 'Komunitas Peneliti & Programmer Muda', icon: 'groups', desc: 'Wadah diskusi sains terapan dan proyek coding bersama teman sebaya tingkat nasional.', link: 'Gabung Komunitas' },
                        { title: 'Sertifikasi Fondasi Data Science', icon: 'workspace_premium', desc: 'Jalur spesialisasi terarah untuk menguasai Python, visualisasi data, dan pemodelan prediktif.', link: 'Lihat Kurikulum' },
                        { title: 'Workshop UI/UX & Interactive Design', icon: 'draw', desc: 'Kembangkan bakat artistik Anda dalam merancang desain antarmuka digital yang modern.', link: 'Daftar Workshop' },
                        { title: 'Olimpiade Informatika & Sains', icon: 'emoji_events', desc: 'Persiapan materi tingkat lanjut untuk menguji pemecahan masalah dalam kompetisi nasional.', link: 'Lihat Jadwal' },
                        { title: 'Kursus Dasar Machine Learning', icon: 'psychology', desc: 'Pelajari bagaimana AI mengenali pola data dan membuat keputusan secara otomatis.', link: 'Ikuti Kursus' }
                    ]
                };
            }`;

const newAiLogic = `            let aiData = null;
            
            // Ambil dari Firestore jika DataStore tersedia
            if (window.DataStore && window.DataStore.getHasilDiagnostik) {
                const hasil = await window.DataStore.getHasilDiagnostik(user.uid);
                if (hasil) {
                    aiData = {
                        source: 'Firestore',
                        // Konversi nama key
                        riasec: hasil.riasec || { 'Investigatif': 85, 'Artistik': 78, 'Sosial': 42, 'Realistik': 35, 'Konvensional': 28, 'Enterprising': 54 }, // Dummy fallback jika belum ada
                        gayaBelajar: { 
                            'Visual': hasil.persentase?.visual || 33, 
                            'Auditori': hasil.persentase?.auditori || 33, 
                            'Kinestetik': hasil.persentase?.kinestetik || 33 
                        },
                        narasiRiasec: hasil.narasiRiasec || 'Berdasarkan respons tes Anda, Anda memiliki profil yang kuat di bidang ini.',
                        narasiGayaBelajar: \`Gaya belajar utama Anda adalah <strong>\${hasil.gayaBelajarDominan || 'Visual'} (\${hasil.persentase ? hasil.persentase[hasil.gayaBelajarDominan?.toLowerCase()] || 0 : 0}%)</strong>.\`,
                        saranKarir: (hasil.profesiRekomendasi || []).map(p => ({
                            title: p,
                            icon: 'work',
                            desc: 'Direkomendasikan berdasarkan tes diagnostik'
                        })),
                        rekomendasiPembelajaran: [
                            { title: 'Modul Visual', icon: 'menu_book', desc: 'Pelajari dengan materi visual.', link: 'Mulai Belajar' },
                            { title: 'Komunitas', icon: 'groups', desc: 'Belajar bersama.', link: 'Gabung Komunitas' }
                        ]
                    };
                }
            }

            // Fallback rich AI Data structure if not generated
            if (!aiData) {
                aiData = {
                    source: 'Gemini AI',
                    riasec: { 'Investigatif': 85, 'Artistik': 78, 'Sosial': 42, 'Realistik': 35, 'Konvensional': 28, 'Enterprising': 54 },
                    gayaBelajar: { 'Visual': 72, 'Auditori': 18, 'Kinestetik': 10 },
                    narasiRiasec: 'Berdasarkan respons tes Anda, Anda memiliki profil yang kuat di bidang <strong>Investigatif</strong> dan <strong>Artistik</strong>. Anda cenderung menikmati pemecahan masalah yang kompleks melalui pemikiran analitis sekaligus mengekspresikan ide secara kreatif.',
                    narasiGayaBelajar: 'Gaya belajar utama Anda adalah <strong>Visual (72%)</strong>. Anda paling efektif menyerap informasi melalui <strong>infografis, peta konsep, dan video tutorial</strong>.',
                    saranKarir: [
                        { title: 'Data Scientist', icon: 'query_stats', desc: 'Menganalisis pola data besar, statistik lanjut, & Machine Learning.' },
                        { title: 'Arsitek Sistem', icon: 'hub', desc: 'Merancang infrastruktur piranti lunak, cloud, & ekosistem digital.' },
                        { title: 'UI/UX Designer', icon: 'palette', desc: 'Mendesain antarmuka aplikasi dengan prinsip estetika & pengalaman pengguna.' },
                        { title: 'Peneliti Bioteknologi', icon: 'biotech', desc: 'Riset genetika, analisis bioinformatika, dan teknologi medis.' },
                        { title: 'Arsitek Bangunan', icon: 'architecture', desc: 'Memadukan seni perancangan ruang, estetika, dan ketahanan struktur.' },
                        { title: 'Insinyur Robotika', icon: 'precision_manufacturing', desc: 'Mengembangkan sistem mekanik cerdas dan otomatisasi berbasis AI.' },
                        { title: 'Pengembang AI', icon: 'smart_toy', desc: 'Membangun algoritma kecerdasan buatan & neural network.' },
                        { title: 'Game Developer', icon: 'sports_esports', desc: 'Menciptakan pengalaman game interaktif dengan grafis & logika terapan.' }
                    ],
                    rekomendasiPembelajaran: [
                        { title: 'Modul Visual: Logika Pemrograman', icon: 'menu_book', desc: 'Pelajari dasar logika dan algoritma komputer dengan bantuan flowchart dan visualiasi peta konsep.', link: 'Mulai Belajar' },
                        { title: 'Komunitas Peneliti & Programmer Muda', icon: 'groups', desc: 'Wadah diskusi sains terapan dan proyek coding bersama teman sebaya tingkat nasional.', link: 'Gabung Komunitas' },
                        { title: 'Sertifikasi Fondasi Data Science', icon: 'workspace_premium', desc: 'Jalur spesialisasi terarah untuk menguasai Python, visualisasi data, dan pemodelan prediktif.', link: 'Lihat Kurikulum' },
                        { title: 'Workshop UI/UX & Interactive Design', icon: 'draw', desc: 'Kembangkan bakat artistik Anda dalam merancang desain antarmuka digital yang modern.', link: 'Daftar Workshop' },
                        { title: 'Olimpiade Informatika & Sains', icon: 'emoji_events', desc: 'Persiapan materi tingkat lanjut untuk menguji pemecahan masalah dalam kompetisi nasional.', link: 'Lihat Jadwal' },
                        { title: 'Kursus Dasar Machine Learning', icon: 'psychology', desc: 'Pelajari bagaimana AI mengenali pola data dan membuat keputusan secara otomatis.', link: 'Ikuti Kursus' }
                    ]
                };
            }`;

content = content.replace(oldAiLogic, newAiLogic);

// Remove the old DOMContentLoaded closing bracket
content = content.replace(
`        <script>
        window.addEventListener('auth-ready', function(e) {
            const user = e.detail;
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
            }
        });
    </script>`, '');

fs.writeFileSync('04_hasil-diagnosis/code.html', content);
console.log('04_hasil-diagnosis Replacement complete.');
