const fs = require('fs');

let content14 = fs.readFileSync('14_dashboard-guru/code.html', 'utf8');
const oldJs14 = `        // Fetch pending KRS using SSOSync mock data instead of API
        function loadPendingKRS() {
            try {
                // Mock data since API doesn't exist
                const data = [
                    { krsId: '1', nama: 'Budi Santoso', semesterKe: 3, profesiTarget: 'Software Engineer' },
                    { krsId: '2', nama: 'Siti Aminah', semesterKe: 5, profesiTarget: 'Data Scientist' },
                    { krsId: '3', nama: 'Arif Hidayat', semesterKe: 1, profesiTarget: 'Desainer Grafis' }
                ];

                const listContainer = document.getElementById('krs-pending-list');
                const countBadge = document.getElementById('krs-queue-count');

                countBadge.textContent = \`\${data.length} ANTRIAN\`;

                if (data.length === 0) {
                    listContainer.innerHTML = '<div class="text-center text-sm text-on-surface-variant py-8">Tidak ada antrean KRS saat ini.</div>';
                    return;
                }

                let html = '';
                data.forEach(item => {
                    const initial = item.nama.charAt(0).toUpperCase();
                    html += \`
                <div class="px-6 py-5 flex items-center justify-between hover:bg-on-surface/5 transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">\${initial}</div>
                        <div>
                            <p class="font-bold">\${item.nama}</p>
                            <p class="text-xs text-on-surface-variant">Semester \${item.semesterKe} • \${item.profesiTarget}</p>
                        </div>
                    </div>
                    <a href="../15_tinjauan-guru/code.html?krsId=\${item.krsId}" class="text-role-teacher font-bold border-2 border-role-teacher px-4 py-1.5 rounded hover:bg-role-teacher hover:text-white transition-all text-xs inline-block text-center mt-2 md:mt-0">Tinjau/Setujui</a>
                </div>
                \`;
                });

                listContainer.innerHTML = html;
            } catch (err) {
                console.error('Failed to load pending KRS:', err);
                document.getElementById('krs-pending-list').innerHTML = '<div class="text-center text-sm text-error py-8">Gagal memuat data.</div>';
            }
        }

        // Auto load on mount
        loadPendingKRS();
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

const newJs14 = `    </script>
    <!-- Firebase SDK & Auth -->
    <script src="../firebase-config.js"></script>
    <script src="../firebase-auth-guard.js"></script>
    <script src="../firebase-data-store.js"></script>
    <script src="../notification-sync.js"></script>

    <script>
        // Fetch pending KRS using DataStore
        async function loadPendingKRS(guruId) {
            try {
                if(!window.DataStore || !window.DataStore.getPendingKRSForGuru) return;
                
                const data = await window.DataStore.getPendingKRSForGuru(guruId);
                const listContainer = document.getElementById('krs-pending-list');
                const countBadge = document.getElementById('krs-queue-count');

                countBadge.textContent = \`\${data.length} ANTRIAN\`;

                if (data.length === 0) {
                    listContainer.innerHTML = '<div class="text-center text-sm text-on-surface-variant py-8">Tidak ada antrean KRS saat ini.</div>';
                    return;
                }

                let html = '';
                data.forEach(item => {
                    const studentName = item.namaSiswa || 'Siswa';
                    const initial = studentName.charAt(0).toUpperCase();
                    html += \`
                <div class="px-6 py-5 flex items-center justify-between hover:bg-on-surface/5 transition-colors">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">\${initial}</div>
                        <div>
                            <p class="font-bold">\${studentName}</p>
                            <p class="text-xs text-on-surface-variant">Semester \${item.semester || 1}</p>
                        </div>
                    </div>
                    <a href="../15_tinjauan-guru/code.html?krsId=\${item.id}" class="text-role-teacher font-bold border-2 border-role-teacher px-4 py-1.5 rounded hover:bg-role-teacher hover:text-white transition-all text-xs inline-block text-center mt-2 md:mt-0">Tinjau/Setujui</a>
                </div>
                \`;
                });

                listContainer.innerHTML = html;
            } catch (err) {
                console.error('Failed to load pending KRS:', err);
                document.getElementById('krs-pending-list').innerHTML = '<div class="text-center text-sm text-error py-8">Gagal memuat data.</div>';
            }
        }
        
        window.addEventListener('auth-ready', function(e) {
            const user = e.detail;
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
                
                // Set guru name
                const guruNameEl = document.getElementById('guru-name');
                if (guruNameEl) guruNameEl.textContent = user.nama;
                
                // Load pending KRS
                loadPendingKRS(user.uid);
            }
        });
    </script>`;

content14 = content14.replace(oldJs14, newJs14);
fs.writeFileSync('14_dashboard-guru/code.html', content14);
console.log('14_dashboard-guru Replacement complete.');
