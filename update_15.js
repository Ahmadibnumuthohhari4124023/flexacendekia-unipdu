const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '15_tinjauan-guru', 'code.html');
let content = fs.readFileSync(file, 'utf8');

const newScript = `
    <script>
        // Simple micro-interaction for button states
        document.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('mousedown', () => {
                btn.style.transform = 'translate(1px, 1px)';
            });
            btn.addEventListener('mouseup', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });

        const currentUser = DataStore.getCurrentUser('Guru');
        let activeKrsId = null;
        let activeSiswaId = null;

        function loadPendingKrs() {
            if (!currentUser) return;
            
            const pendingList = DataStore.getPendingKRSForGuru(currentUser.id);
            if (pendingList.length > 0) {
                const krs = pendingList[0]; // Just take the first pending one for demo
                activeKrsId = krs.id;
                activeSiswaId = krs.siswaId;
                
                const siswa = DataStore.getUserById(activeSiswaId);
                
                document.getElementById('krs-status').textContent = 'Status: ' + krs.status;
                document.getElementById('krs-title').textContent = 'Persetujuan KRS Semester ' + (krs.semester || 3);
                
                if (siswa) {
                    document.getElementById('student-name').textContent = siswa.nama;
                    const requestedProfessionEls = document.querySelectorAll('h4.text-role-teacher.mb-1');
                    if (requestedProfessionEls.length > 0) {
                        requestedProfessionEls[0].textContent = siswa.citaCita;
                    }
                }
            } else {
                // No pending KRS
                document.getElementById('krs-title').textContent = 'Tidak Ada KRS Menunggu';
                document.getElementById('krs-status').textContent = 'Status: Bersih';
                document.getElementById('btn-approve').disabled = true;
                document.getElementById('btn-reject').disabled = true;
            }
        }

        function submitApproval(status) {
            if (!activeKrsId) {
                alert('Tidak ada pengajuan KRS yang aktif.');
                return;
            }
            const catatan = document.getElementById('catatan-guru').value;
            
            // 1. Update KRS status
            DataStore.updateKRSStatus(activeKrsId, status);
            
            // 2. Add Feedback note if not empty
            if (catatan && catatan.trim() !== '') {
                DataStore.tambahCatatanGuru(currentUser.id, activeSiswaId, catatan);
            }
            
            alert('KRS telah ' + status.toLowerCase() + '!');
            window.location.reload();
        }

        document.getElementById('btn-approve').addEventListener('click', () => submitApproval('Disetujui'));
        document.getElementById('btn-reject').addEventListener('click', () => submitApproval('Ditolak'));
        
        loadPendingKrs();
    </script>
`;

// Replace script from <script> to </script> before <!-- Central Data Store
content = content.replace(/<script>[\s\S]*?<\/script>\s*<!-- Central Data Store/m, newScript + '\n    <!-- Central Data Store');

// Add ids to elements we modify
// find: <span class="font-stats-sm text-stats-sm text-outline px-2 py-1 bg-surface-container rounded uppercase tracking-widest">Status: Menunggu Persetujuan</span>
content = content.replace(/<span class="font-stats-sm text-stats-sm text-outline px-2 py-1 bg-surface-container rounded uppercase tracking-widest">Status: Menunggu Persetujuan<\/span>/, '<span id="krs-status" class="font-stats-sm text-stats-sm text-outline px-2 py-1 bg-surface-container rounded uppercase tracking-widest">Status: Menunggu Persetujuan</span>');

// find: <h1 class="font-display-lg text-display-lg text-primary mb-2">Persetujuan KRS Semester 5</h1>
content = content.replace(/<h1 class="font-display-lg text-display-lg text-primary mb-2">Persetujuan KRS Semester 5<\/h1>/, '<h1 id="krs-title" class="font-display-lg text-display-lg text-primary mb-2">Persetujuan KRS Semester 5</h1>');

// find: <h2 class="font-headline-md text-headline-md text-primary">Ahmad Fauzi</h2>
content = content.replace(/<h2 class="font-headline-md text-headline-md text-primary">Ahmad Fauzi<\/h2>/, '<h2 id="student-name" class="font-headline-md text-headline-md text-primary">Ahmad Fauzi</h2>');

fs.writeFileSync(file, content);
console.log("Updated 15_tinjauan-guru");
