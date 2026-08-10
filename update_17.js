const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '17_notifikasi', 'code.html');
let content = fs.readFileSync(file, 'utf8');

// Inject ID to notification list
content = content.replace(
    /<div class="divide-y divide-outline-variant\/10">/,
    '<div id="notifikasi-list" class="divide-y divide-outline-variant/10">'
);

const newScript = `
    <script>
        const activeRole = localStorage.getItem('lastActiveRole') || 'Siswa';
        const currentUser = DataStore.getCurrentUser(activeRole);

        document.addEventListener('DOMContentLoaded', () => {
            renderNotifikasi();
        });

        function renderNotifikasi() {
            const listContainer = document.getElementById('notifikasi-list');
            if (!listContainer || !currentUser) return;
            
            const notifs = DataStore.getNotifikasi(activeRole, currentUser.id);
            if (notifs.length === 0) {
                listContainer.innerHTML = '<div class="p-6 text-center text-on-surface-variant font-body-sm">Tidak ada notifikasi.</div>';
                document.querySelector('.font-stats-sm.text-stats-sm.text-on-surface-variant').textContent = 'Displaying 0 records';
                return;
            }
            
            document.querySelector('.font-stats-sm.text-stats-sm.text-on-surface-variant').textContent = 'Displaying ' + notifs.length + ' records';

            listContainer.innerHTML = notifs.map(n => \`
                <div class="ledger-row p-6 flex gap-6 hover:bg-surface-container-low transition-colors cursor-pointer group \${n.dibaca ? '' : 'bg-secondary/5 border-l-4 border-l-secondary'}">
                    <div class="w-10 h-10 rounded-full \${n.dibaca ? 'bg-surface-container border border-outline-variant/20' : 'bg-primary'} flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined \${n.dibaca ? 'text-primary' : 'text-on-primary'}">notifications</span>
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-start mb-1">
                            <h5 class="font-body-md text-body-md font-bold text-primary">\${n.judul}</h5>
                            <span class="font-stats-sm text-stats-sm \${n.dibaca ? 'text-outline' : 'text-secondary font-bold'}">\${new Date(n.tanggal).toLocaleTimeString()}</span>
                        </div>
                        <p class="font-body-sm text-body-sm text-on-surface-variant">\${n.isi}</p>
                    </div>
                    <div class="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        \${n.dibaca ? '' : \`<button class="p-1 hover:text-secondary" onclick="markRead('\${n.id}')" title="Tandai Dibaca"><span class="material-symbols-outlined text-sm">visibility</span></button>\`}
                    </div>
                </div>
            \`).join('');
        }

        window.markRead = function(id) {
            DataStore.markNotifikasiRead(id);
            renderNotifikasi();
            // dispatch event so navbar bell updates
            window.dispatchEvent(new Event('datastore-updated'));
        }
        
        // Expose a global mark all as read
        const btnMarkAll = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Mark all as read'));
        if (btnMarkAll) {
            btnMarkAll.addEventListener('click', () => {
                DataStore.markAllNotifikasiRead(activeRole, currentUser.id);
                renderNotifikasi();
                window.dispatchEvent(new Event('datastore-updated'));
            });
        }
    </script>
`;

content = content.replace(/<!-- Central Data Store/m, newScript + '\n    <!-- Central Data Store');

fs.writeFileSync(file, content);
console.log('Updated 17_notifikasi');
