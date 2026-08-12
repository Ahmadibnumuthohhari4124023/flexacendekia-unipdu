const fs = require('fs');
let content = fs.readFileSync('07_hasil-roadmap/code.html', 'utf8');

const oldJs = `    document.addEventListener('DOMContentLoaded', () => {
        let careerTitle = localStorage.getItem('selectedCareer') || 'Arsitek';
        const careerData = careerRoadmaps[careerTitle.toLowerCase()] || defaultCareer;`;

const newJs = `    document.addEventListener('DOMContentLoaded', () => {
        // We will wait for auth-ready instead
    });

    window.addEventListener('auth-ready', async (e) => {
        const user = e.detail;
        
        let careerTitle = localStorage.getItem('selectedCareer') || 'Arsitek';
        
        // Fetch from Firestore
        if (window.DataStore && window.DataStore.getRoadmapBelajar) {
            const roadmap = await window.DataStore.getRoadmapBelajar(user.uid);
            if (roadmap && roadmap.targetProfesi) {
                careerTitle = roadmap.targetProfesi;
            }
        }
        
        const careerData = careerRoadmaps[careerTitle.toLowerCase()] || careerRoadmaps['arsitek'] || defaultCareer;`;

content = content.replace(oldJs, newJs);

// Find the end of DOMContentLoaded block and change it to end of auth-ready
const closingOld = `        }
    });
</script>

    <script>
        window.addEventListener('auth-ready', function(e) {
            const user = e.detail;
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
            }
        });
    </script>`;

const closingNew = `        }
        
        // Update user name as well
        if (user && user.nama) {
            document.querySelectorAll('.user-display-name').forEach(el => {
                el.textContent = user.nama;
            });
        }
    });
</script>`;

content = content.replace(closingOld, closingNew);

fs.writeFileSync('07_hasil-roadmap/code.html', content);
console.log('07_hasil-roadmap Replacement complete.');
