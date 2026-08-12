const fs = require('fs');
const pages = ['02_intro-diagnosis', '03_soal-diagnosis', '04_hasil-diagnosis', '05_pilih-cita-cita', '06_roadmap-disusun', '07_hasil-roadmap', '09_krs-siswa', '10_detail-roadmap', '11_checkpoint-jumat', '12_ganti-cita-cita', '13_riwayat-semester', '14_dashboard-guru', '15_tinjauan-guru', '16_dashboard-ortu', '17_notifikasi', '18_profil'];

pages.forEach(p => {
    try {
        const codePath = p === '18_profil' ? '18_profil/profil-siswa.html' : p + '/code.html';
        const html = fs.readFileSync(codePath, 'utf8');
        const mainMatches = html.match(/<main/g);
        const scriptMatches = html.match(/<script src="\.\.\/firebase-config\.js/g);
        const authMatches = html.match(/auth-ready/g);
        
        if (mainMatches && mainMatches.length > 1) {
            console.log(p + ' HAS DUPLICATE <main>: ' + mainMatches.length);
        }
        if (scriptMatches && scriptMatches.length > 1) {
            console.log(p + ' HAS DUPLICATE FIREBASE SCRIPTS: ' + scriptMatches.length);
        }
        if (authMatches && authMatches.length > 1) {
            console.log(p + ' HAS DUPLICATE AUTH READY: ' + authMatches.length);
        }
    } catch(e) {
        console.error('Error reading ' + p, e.message);
    }
});
console.log('Check complete.');
