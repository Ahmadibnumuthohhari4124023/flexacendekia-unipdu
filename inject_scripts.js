const fs = require('fs');
const path = require('path');

const dirs = [
    '08_dashboard-siswa',
    '09_krs-siswa',
    '10_detail-roadmap',
    '11_checkpoint-jumat',
    '12_ganti-cita-cita',
    '13_riwayat-semester',
    '14_dashboard-guru',
    '15_tinjauan-guru',
    '16_dashboard-ortu',
    '17_notifikasi',
    '18_profil'
];

const scriptTags = `
    <!-- Central Data Store & Notification Sync -->
    <script src="../data-store.js"></script>
    <script src="../notification-sync.js"></script>
`;

dirs.forEach(dir => {
    const file = path.join(__dirname, dir, 'code.html');
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        // Prevent double injection
        if (!content.includes('data-store.js')) {
            // Find closing body tag and inject just before it
            content = content.replace('</body>', scriptTags + '\n</body>');
            fs.writeFileSync(file, content);
            console.log('Injected scripts into ' + dir);
        } else {
            console.log('Already injected in ' + dir);
        }
    }
});
