/**
 * Script to inject Firebase scripts into all dashboard HTML pages.
 * Replaces the old data-store.js + notification-sync.js with:
 *   firebase-config.js → firebase-auth-guard.js → firebase-data-store.js → notification-sync.js
 */
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

const oldBlock = `
    <!-- Central Data Store & Notification Sync -->
    <script src="../data-store.js"></script>
    <script src="../notification-sync.js"></script>
`;

const newBlock = `
    <!-- Firebase SDK & Auth -->
    <script src="../firebase-config.js"></script>
    <script src="../firebase-auth-guard.js"></script>
    <script src="../firebase-data-store.js"></script>
    <script src="../notification-sync.js"></script>
`;

dirs.forEach(dir => {
    const file = path.join(__dirname, dir, 'code.html');
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        if (content.includes('firebase-config.js')) {
            console.log('Already has Firebase in ' + dir);
            return;
        }

        if (content.includes('data-store.js')) {
            // Replace old block with new block
            content = content.replace(
                /\s*<!-- Central Data Store & Notification Sync -->\s*\n\s*<script src="\.\.\/data-store\.js"><\/script>\s*\n\s*<script src="\.\.\/notification-sync\.js"><\/script>/,
                newBlock
            );
            fs.writeFileSync(file, content);
            console.log('Replaced in ' + dir);
        } else {
            // Inject before </body>
            content = content.replace('</body>', newBlock + '\n</body>');
            fs.writeFileSync(file, content);
            console.log('Injected into ' + dir);
        }
    }
});

console.log('\nDone! Firebase scripts injected into all dashboard pages.');
