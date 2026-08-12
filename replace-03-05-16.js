const fs = require('fs');

// ==== 05_pilih-cita-cita ====
let content05 = fs.readFileSync('05_pilih-cita-cita/code.html', 'utf8');

// 1. Update confirmCareer to save to Firestore
const oldConfirm = `        function confirmCareer() {
            localStorage.setItem('selectedCareer', selectedCareerTitle);
            window.location.href = '../06_roadmap-disusun/code.html';
        }`;
const newConfirm = `        async function confirmCareer() {
            localStorage.setItem('selectedCareer', selectedCareerTitle);
            
            // Save to Firestore
            if (window.firebaseDb && window._authUid) {
                try {
                    await window.firebaseDb.collection('users').doc(window._authUid).update({
                        citaCita: selectedCareerTitle
                    });
                    console.log('[05] Saved citaCita to Firestore:', selectedCareerTitle);
                } catch(e) {
                    console.error('[05] Failed to save citaCita:', e);
                }
            }
            
            window.location.href = '../06_roadmap-disusun/code.html';
        }`;
content05 = content05.replace(oldConfirm, newConfirm);

// 2. Update DOMContentLoaded to use auth-ready for name
const oldDCL = `            const siswa = SSOSync.getSiswaList()[0];
            if (siswa) {
                document.getElementById('user-name-display').innerText = siswa.nama;
            }`;
const newDCL = `            // User name will be set by auth-ready event
            const siswa = typeof SSOSync !== 'undefined' ? SSOSync.getSiswaList()[0] : null;
            if (siswa) {
                document.getElementById('user-name-display').innerText = siswa.nama;
            }`;
content05 = content05.replace(oldDCL, newDCL);

// 3. Augment the existing auth-ready listener to also fetch AI diagnosis from Firestore
const oldAuthReady05 = `    <script>
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

const newAuthReady05 = `    <script>
        window.addEventListener('auth-ready', async function(e) {
            const user = e.detail;
            window._authUid = user.uid;
            
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
                const nameEl = document.getElementById('user-name-display');
                if (nameEl) nameEl.innerText = user.nama;
            }
            
            // Load AI diagnosis from Firestore to populate recommended careers
            if (window.DataStore && window.DataStore.getHasilDiagnostik) {
                const hasil = await window.DataStore.getHasilDiagnostik(user.uid);
                if (hasil && hasil.rekomendasiKarir && hasil.rekomendasiKarir.length > 0) {
                    // Store for the DOMContentLoaded handler to pick up
                    localStorage.setItem('aiDiagnosisResult', JSON.stringify({
                        rekomendasiKarir: hasil.rekomendasiKarir,
                        source: 'Flexa AI Diagnostik'
                    }));
                }
            }
        });
    </script>
</body></html>`;
content05 = content05.replace(oldAuthReady05, newAuthReady05);

fs.writeFileSync('05_pilih-cita-cita/code.html', content05);
console.log('05_pilih-cita-cita Replacement complete.');


// ==== 03_soal-diagnosis ====
// This page is a quiz form with timer. The only dynamic part needed is:
// 1. Saving answers to Firestore instead of just localStorage
let content03 = fs.readFileSync('03_soal-diagnosis/code.html', 'utf8');

const oldFinish = `    function finish() {
        localStorage.setItem('diagnosisAnswers', JSON.stringify(answers));
        window.location.href = '/?page=04_hasil-diagnosis';
    }`;
const newFinish = `    async function finish() {
        localStorage.setItem('diagnosisAnswers', JSON.stringify(answers));
        
        // Save to Firestore if available
        if (window.firebaseDb && window._authUid) {
            try {
                await window.firebaseDb.collection('jawabanDiagnostik').doc(window._authUid).set({
                    siswaId: window._authUid,
                    jawaban: answers,
                    tanggalSubmit: new Date().toISOString()
                });
                console.log('[03] Saved diagnosis answers to Firestore');
            } catch(e) {
                console.error('[03] Failed to save answers:', e);
            }
        }
        
        window.location.href = '/?page=04_hasil-diagnosis';
    }`;
content03 = content03.replace(oldFinish, newFinish);

// Augment auth-ready to capture uid
const oldAuthReady03 = `    <script>
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
const newAuthReady03 = `    <script>
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
content03 = content03.replace(oldAuthReady03, newAuthReady03);

fs.writeFileSync('03_soal-diagnosis/code.html', content03);
console.log('03_soal-diagnosis Replacement complete.');


// ==== 16_dashboard-ortu ====
// Already dynamic, just remove the duplicate auth-ready listener
let content16 = fs.readFileSync('16_dashboard-ortu/code.html', 'utf8');

const oldDuplicateAuth16 = `    <script>
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
const newClean16 = `</body></html>`;
content16 = content16.replace(oldDuplicateAuth16, newClean16);
fs.writeFileSync('16_dashboard-ortu/code.html', content16);
console.log('16_dashboard-ortu cleanup complete.');
