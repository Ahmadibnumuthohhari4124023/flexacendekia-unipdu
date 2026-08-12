const fs = require('fs');
const path = require('path');

/**
 * Inject Guard Script — Versi Baru (tanpa loading overlay)
 * 
 * Sebelumnya, script ini menyuntikkan CSS "belum-terverifikasi" dan
 * loading screen "Memverifikasi Akses..." ke semua halaman dashboard.
 * 
 * SEKARANG: Loading overlay DIHAPUS dari semua halaman dashboard.
 * Auth guard tetap bekerja via firebase-auth-guard.js (redirect ke login
 * jika belum login), tapi tanpa blocking CSS overlay yang bisa stuck.
 * 
 * Script ini sekarang hanya memastikan bahwa firebase scripts
 * (firebase-config.js, firebase-auth-guard.js, firebase-data-store.js)
 * sudah ter-include di halaman dashboard.
 */

const srcDir = __dirname;
const folders = [
    '02_intro-diagnosis', '03_soal-diagnosis', '04_hasil-diagnosis', 
    '05_pilih-cita-cita', '06_roadmap-disusun', '07_hasil-roadmap', 
    '08_dashboard-siswa', '09_krs-siswa', '10_detail-roadmap', 
    '11_checkpoint-jumat', '12_ganti-cita-cita', '13_riwayat-semester',
    '14_dashboard-guru', '15_tinjauan-guru', '16_dashboard-ortu', '17_notifikasi'
];

function ensureFirebaseScripts(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    // Check if firebase scripts are already included
    if (!content.includes('firebase-config.js')) {
        // Add before </body>
        const scripts = `
    <!-- Firebase SDK & Auth -->
    <script src="../firebase-config.js"></script>
    <script src="../firebase-auth-guard.js"></script>
    <script src="../firebase-data-store.js"></script>
    <script src="../notification-sync.js"></script>
`;
        content = content.replace(/<\/body>/i, scripts + '</body>');
        updated = true;
    }

    if (updated) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated firebase scripts in: ${filePath}`);
    } else {
        console.log(`Already has firebase scripts: ${filePath}`);
    }
}

folders.forEach(folder => {
    const codePath = path.join(srcDir, folder, 'code.html');
    if (fs.existsSync(codePath)) {
        ensureFirebaseScripts(codePath);
    }
});

// Update the actual profile pages
['profil-siswa.html', 'profil-guru.html', 'profil-ortu.html'].forEach(p => {
    const pPath = path.join(srcDir, '18_profil', p);
    if (fs.existsSync(pPath)) {
        ensureFirebaseScripts(pPath);
    }
});

// Update sub-pages of 07_hasil-roadmap
['timeline.html', 'milestones.html', 'resources.html', 'settings.html'].forEach(p => {
    const pPath = path.join(srcDir, '07_hasil-roadmap', p);
    if (fs.existsSync(pPath)) {
        ensureFirebaseScripts(pPath);
    }
});

// Update sub-pages of 03_soal-diagnosis
['sd.html', 'smp.html'].forEach(p => {
    const pPath = path.join(srcDir, '03_soal-diagnosis', p);
    if (fs.existsSync(pPath)) {
        ensureFirebaseScripts(pPath);
    }
});
