const fs = require('fs');

// ==== 06_roadmap-disusun ====
let content06 = fs.readFileSync('06_roadmap-disusun/code.html', 'utf8');

const oldRoadmapSave = `            localStorage.setItem('aiRoadmapResult', JSON.stringify(roadmapData));

            setTimeout(() => {
                updateProgress("Selesai! Mengalihkan ke Roadmap...", 100);`;
const newRoadmapSave = `            localStorage.setItem('aiRoadmapResult', JSON.stringify(roadmapData));

            if (window.firebaseDb && window._authUid) {
                try {
                    await window.firebaseDb.collection('roadmapBelajar').doc(window._authUid).set(Object.assign({
                        siswaId: window._authUid,
                        updatedAt: new Date().toISOString()
                    }, roadmapData));
                    console.log('[06] Roadmap saved to Firestore');
                } catch(e) {
                    console.error('[06] Failed to save roadmap to Firestore', e);
                }
            }

            setTimeout(() => {
                updateProgress("Selesai! Mengalihkan ke Roadmap...", 100);`;
content06 = content06.replace(oldRoadmapSave, newRoadmapSave);

const oldAuth06 = `    <script>
        window.addEventListener('auth-ready', function(e) {
            const user = e.detail;
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
            }
        });
    </script>
</body></html>`;
const newAuth06 = `    <script>
        window.addEventListener('auth-ready', function(e) {
            const user = e.detail;
            window._authUid = user.uid;
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
            }
        });
    </script>
</body></html>`;
content06 = content06.replace(oldAuth06, newAuth06);
fs.writeFileSync('06_roadmap-disusun/code.html', content06);
console.log('06_roadmap-disusun updated.');

// ==== 12_ganti-cita-cita ====
let content12 = fs.readFileSync('12_ganti-cita-cita/code.html', 'utf8');
const oldSubmit12 = `            // Event Listener Submit
            form.addEventListener('submit', (e) => {
                e.preventDefault(); 
                alert('Berhasil! Pengajuan ganti cita-cita Anda telah dikirim dan direkam oleh sistem.');
            });`;
const newSubmit12 = `            // Event Listener Submit
            form.addEventListener('submit', async (e) => {
                e.preventDefault(); 
                const selectedText = select.options[select.selectedIndex].text;
                
                if (window.firebaseDb && window._authUid) {
                    try {
                        await window.firebaseDb.collection('users').doc(window._authUid).update({
                            citaCita: selectedText
                        });
                        alert('Berhasil! Pengajuan ganti cita-cita ke ' + selectedText + ' telah direkam oleh sistem.');
                        window.location.href = '../08_dashboard-siswa/code.html';
                    } catch(err) {
                        console.error('Error saving new career', err);
                        alert('Gagal merekam perubahan.');
                    }
                } else {
                    alert('Berhasil! Pengajuan ganti cita-cita Anda telah dikirim (Lokal).');
                    window.location.href = '../08_dashboard-siswa/code.html';
                }
            });`;
content12 = content12.replace(oldSubmit12, newSubmit12);

const oldAuth12 = `    <script>
        window.addEventListener('auth-ready', function(e) {
            const user = e.detail;
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
            }
        });
    </script>
</body>
</html>`;
const newAuth12 = `    <script>
        window.addEventListener('auth-ready', function(e) {
            const user = e.detail;
            window._authUid = user.uid;
            
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
            }
            
            // Set current career if available
            if (user && user.citaCita) {
                const currentDisplay = document.querySelector('.font-headline-md.text-xl.text-primary.font-semibold.leading-none');
                if(currentDisplay) currentDisplay.textContent = user.citaCita;
            }
        });
    </script>
</body>
</html>`;
content12 = content12.replace(oldAuth12, newAuth12);
fs.writeFileSync('12_ganti-cita-cita/code.html', content12);
console.log('12_ganti-cita-cita updated.');
