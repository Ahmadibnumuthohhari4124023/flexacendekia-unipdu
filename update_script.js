const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const folders = [
    '02_intro-diagnosis', '03_soal-diagnosis', '04_hasil-diagnosis', 
    '05_pilih-cita-cita', '06_roadmap-disusun', '07_hasil-roadmap', 
    '08_dashboard-siswa', '09_krs-siswa', '10_detail-roadmap', 
    '11_checkpoint-jumat', '12_ganti-cita-cita', '13_riwayat-semester',
    '14_dashboard-guru', '15_tinjauan-guru', '16_dashboard-ortu', '17_notifikasi'
];

function processHtml(filePath, role) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Bug 3: Replace links to 18_profil/code.html
    let profilTarget = '../18_profil/profil-siswa.html';
    if (role === 'Guru') profilTarget = '../18_profil/profil-guru.html';
    if (role === 'OrangTua') profilTarget = '../18_profil/profil-ortu.html';
    
    content = content.replace(/\.\.\/18_profil\/code\.html/g, profilTarget);

    // Bug 2: Replace hardcoded names
    // Remove "Ahmad Fauzi" and "Elsa Dwi Listari"
    content = content.replace(/>\s*Ahmad Fauzi\s*</g, '><span class="user-display-name"></span><');
    content = content.replace(/>\s*Elsa Dwi Listari\s*</g, '><span class="user-display-name"></span><');
    // For attributes like alt="Ahmad Fauzi"
    content = content.replace(/(alt|title)="Ahmad Fauzi"/g, '$1="User Profile"');
    
    // Also if it's in a title
    content = content.replace(/<title>([^<]*)(Ahmad Fauzi|Elsa Dwi Listari)([^<]*)<\/title>/ig, '<title>$1Siswa$3</title>');

    // Inject a listener script right before </body> if not exists
    if (!content.includes('document.querySelectorAll(\'.user-display-name\')')) {
        const script = `
    <script>
        window.addEventListener('auth-ready', function(e) {
            const user = e.detail;
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
            }
        });
    </script>
</body>`;
        content = content.replace(/<\/body>/i, script);
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
}

folders.forEach(folder => {
    let role = 'Siswa';
    if (folder.includes('14_') || folder.includes('15_')) role = 'Guru';
    if (folder.includes('16_')) role = 'OrangTua';
    
    // Process code.html
    const codePath = path.join(srcDir, folder, 'code.html');
    if (fs.existsSync(codePath)) {
        processHtml(codePath, role);
    }
});

// Update the actual profile pages
['profil-siswa.html', 'profil-guru.html', 'profil-ortu.html'].forEach(p => {
    const pPath = path.join(srcDir, '18_profil', p);
    if (fs.existsSync(pPath)) {
        let content = fs.readFileSync(pPath, 'utf8');
        content = content.replace(/>\s*Ahmad Fauzi\s*</g, '><span class="user-display-name"></span><');
        content = content.replace(/>\s*Elsa Dwi Listari\s*</g, '><span class="user-display-name"></span><');
        
        if (!content.includes('document.querySelectorAll(\'.user-display-name\')')) {
            const script = `
    <script>
        window.addEventListener('auth-ready', function(e) {
            const user = e.detail;
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
            }
        });
    </script>
</body>`;
            content = content.replace(/<\/body>/i, script);
        }
        
        fs.writeFileSync(pPath, content, 'utf8');
        console.log(`Updated ${pPath}`);
    }
});
