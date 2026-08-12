const fs = require('fs');
let content = fs.readFileSync('10_detail-roadmap/code.html', 'utf8');

// Update HTML to have target IDs
content = content.replace(
    '<span class="font-label-caps text-[10px] text-primary">PETA JALAN ARSITEKTUR</span>',
    '<span class="font-label-caps text-[10px] text-primary" id="peta-jalan-title">PETA JALAN ARSITEKTUR</span>'
);
content = content.replace(
    '<p class="font-body-sm text-body-sm text-on-primary-container" id="vision-year">Studi Paviliun Hunian 2024</p>',
    '<p class="font-body-sm text-body-sm text-on-primary-container" id="vision-year">Studi 2024</p>'
);

// Update JS
const oldJs = `        // Realtime integration
        document.addEventListener('DOMContentLoaded', () => {
            const currentYear = new Date().getFullYear();
            
            // Sidebar and vision year
            document.getElementById('academic-year-sidebar').innerText = \`Tahun Akademik \${currentYear}\`;
            document.getElementById('vision-year').innerText = \`Studi Paviliun Hunian \${currentYear}\`;
            
            // Career projection years
            document.getElementById('grad-year').innerText = currentYear + 3;
            document.getElementById('prof-year').innerText = currentYear + 5;
            
            document.getElementById('footer-year').innerText = currentYear;

            // Verified Date logic (Simulate current date minus a few days)
            const date = new Date();
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const dateString = date.toLocaleDateString('id-ID', options);
            document.getElementById('verified-date').innerText = \`Terakhir diverifikasi oleh Konselor Akademik pada \${dateString}\`;
        });`;

const newJs = `        // Realtime integration
        document.addEventListener('DOMContentLoaded', () => {
            const currentYear = new Date().getFullYear();
            
            // Sidebar and vision year
            document.getElementById('academic-year-sidebar').innerText = \`Tahun Akademik \${currentYear}\`;
            
            // Career projection years
            document.getElementById('grad-year').innerText = currentYear + 3;
            document.getElementById('prof-year').innerText = currentYear + 5;
            
            document.getElementById('footer-year').innerText = currentYear;

            // Verified Date logic (Simulate current date minus a few days)
            const date = new Date();
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const dateString = date.toLocaleDateString('id-ID', options);
            document.getElementById('verified-date').innerText = \`Terakhir diverifikasi oleh Konselor Akademik pada \${dateString}\`;
        });
        
        window.addEventListener('auth-ready', async function(e) {
            const user = e.detail;
            const currentYear = new Date().getFullYear();
            
            // Fetch roadmap data
            if (window.DataStore && window.DataStore.getRoadmapBelajar) {
                const roadmap = await window.DataStore.getRoadmapBelajar(user.uid);
                if (roadmap && roadmap.targetProfesi) {
                    const profesi = roadmap.targetProfesi;
                    const elTitle = document.getElementById('peta-jalan-title');
                    if (elTitle) elTitle.innerText = \`PETA JALAN \${profesi.toUpperCase()}\`;
                    
                    const elVision = document.getElementById('vision-year');
                    if (elVision) elVision.innerText = \`Fokus Studi \${profesi} \${currentYear}\`;
                }
            }
        });`;

content = content.replace(oldJs, newJs);

fs.writeFileSync('10_detail-roadmap/code.html', content);
console.log('10_detail-roadmap Replacement complete.');
