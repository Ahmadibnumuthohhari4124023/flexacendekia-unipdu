const fs = require('fs');

// ==== 11_checkpoint-jumat ====
let content11 = fs.readFileSync('11_checkpoint-jumat/code.html', 'utf8');
const oldJs11 = `        if (saveProgressBtn) {
            saveProgressBtn.addEventListener('click', () => {
                const selectedOption = document.querySelector('input[name="q7"]:checked');
                const reflectionValue = textarea ? textarea.value.trim() : '';
                const progressState = {
                    section: 'Checkpoint Friday',
                    savedAt: new Date().toISOString(),
                    selectedAnswer: selectedOption ? selectedOption.closest('label')?.querySelector('span')?.textContent?.trim() : null,
                    reflection: reflectionValue
                };
                localStorage.setItem('checkpoint-11-progress', JSON.stringify(progressState));
                showToast('Progress Saved', 'Your checkpoint data has been stored locally.');
            });
        }`;

const newJs11 = `        if (saveProgressBtn) {
            saveProgressBtn.addEventListener('click', async () => {
                const selectedOption = document.querySelector('input[name="q7"]:checked');
                const reflectionValue = textarea ? textarea.value.trim() : '';
                const progressState = {
                    section: 'Checkpoint Friday',
                    savedAt: new Date().toISOString(),
                    selectedAnswer: selectedOption ? selectedOption.closest('label')?.querySelector('span')?.textContent?.trim() : null,
                    reflection: reflectionValue
                };
                localStorage.setItem('checkpoint-11-progress', JSON.stringify(progressState));
                
                // Save dynamically to Firestore if available
                if (window.firebaseDb && window.currentUserInfo) {
                    try {
                        const uid = window.currentUserInfo.uid;
                        await window.firebaseDb.collection('progresMingguan').doc(uid + '_checkpoint').set({
                            siswaId: uid,
                            mingguKe: 14,
                            status: 'Selesai',
                            catatanRefleksi: reflectionValue,
                            tanggalSubmit: new Date().toISOString()
                        });
                    } catch(e) {
                        console.error('Failed to save to Firestore', e);
                    }
                }
                showToast('Progress Saved', 'Your checkpoint data has been saved.');
            });
        }
        
        // Expose user info for save function
        window.addEventListener('auth-ready', function(e) {
            window.currentUserInfo = e.detail;
        });`;
content11 = content11.replace(oldJs11, newJs11);
fs.writeFileSync('11_checkpoint-jumat/code.html', content11);
console.log('11_checkpoint-jumat Replacement complete.');


// ==== 13_riwayat-semester ====
let content13 = fs.readFileSync('13_riwayat-semester/code.html', 'utf8');
const oldJs13 = `// EXPORT
document.getElementById('export-btn')?.addEventListener('click',()=>{
    const data={student:'Ahmad Fauzi',id:'FCX-UN-2023-A00421',gpa:3.88,honor:'Cum Laude',semesters:3,modules:34,exported:new Date().toISOString()};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='Academic_Ledger_Ahmad_Fauzi.json';
    a.click();
});
</script>
    <!-- Firebase SDK & Auth -->
    <script src="../firebase-config.js"></script>
    <script src="../firebase-auth-guard.js"></script>
    <script src="../firebase-data-store.js"></script>
    <script src="../notification-sync.js"></script>

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

const newJs13 = `// EXPORT
document.getElementById('export-btn')?.addEventListener('click',()=>{
    const namaSiswa = window.currentUserInfo ? window.currentUserInfo.nama : 'Siswa';
    const idSiswa = window.currentUserInfo ? window.currentUserInfo.nisn : 'FCX-000';
    const data={student:namaSiswa,id:idSiswa,gpa:3.88,honor:'Cum Laude',semesters:3,modules:34,exported:new Date().toISOString()};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
    const a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download=\`Academic_Ledger_\${namaSiswa.replace(/\\s+/g, '_')}.json\`;
    a.click();
});
</script>
    <!-- Firebase SDK & Auth -->
    <script src="../firebase-config.js"></script>
    <script src="../firebase-auth-guard.js"></script>
    <script src="../firebase-data-store.js"></script>
    <script src="../notification-sync.js"></script>

    <script>
        window.addEventListener('auth-ready', function(e) {
            const user = e.detail;
            window.currentUserInfo = user; // Export for use in chart/export
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
            }
        });
    </script>`;
content13 = content13.replace(oldJs13, newJs13);
fs.writeFileSync('13_riwayat-semester/code.html', content13);
console.log('13_riwayat-semester Replacement complete.');
