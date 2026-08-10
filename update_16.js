const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '16_dashboard-ortu', 'code.html');
let content = fs.readFileSync(file, 'utf8');

// 1. Inject ID to Teacher notes
content = content.replace(
    /<div class="p-4 bg-white hairline-border border-l-4 border-l-role-parent mb-4">/,
    '<div id="catatan-guru-container" class="p-4 bg-white hairline-border border-l-4 border-l-role-parent mb-4">'
);
content = content.replace(
    /<p class="font-body-sm text-body-sm text-on-surface-variant italic mb-2">"Ahmad sangat aktif dalam diskusi kelas minggu ini\. Saya menyarankan agar ia difasilitasi buku desain tambahan di rumah\."<\/p>/,
    '<p id="catatan-guru-isi" class="font-body-sm text-body-sm text-on-surface-variant italic mb-2">"Ahmad sangat aktif dalam diskusi kelas minggu ini. Saya menyarankan agar ia difasilitasi buku desain tambahan di rumah."</p>'
);
content = content.replace(
    /<p class="font-label-caps text-\[10px\] text-primary font-bold text-right">- Ibu Sari \(Guru Pembimbing\)<\/p>/,
    '<p id="catatan-guru-nama" class="font-label-caps text-[10px] text-primary font-bold text-right">- Ibu Sari (Guru Pembimbing)</p>'
);

// 2. Inject ID to Notification list
content = content.replace(
    /<div class="space-y-4">\s*<!-- Notif 1 -->/,
    '<div id="notifikasi-list" class="space-y-4">\n<!-- Notif 1 -->'
);

// 3. Replace script
const newScript = `
    <script>
        const currentUser = DataStore.getCurrentUser('OrangTua');
        let activeStudentId = null;
        let activeCatatanId = null;

        document.addEventListener('DOMContentLoaded', () => {
            if (currentUser) {
                document.getElementById('header-ortu-name').textContent = currentUser.nama;
                document.getElementById('navbar-ortu-name').textContent = currentUser.nama;
                if (currentUser.anakIds && currentUser.anakIds.length > 0) {
                    activeStudentId = currentUser.anakIds[0];
                }
            }

            renderDashboard();
            renderCatatanAndReplies();
            renderNotifikasi();
        });

        function renderDashboard() {
            // Kita biarkan statistik dummy agar UI tidak kosong (karena ini fokus pada Data Layer integrasi Catatan & Notif)
            const anak = DataStore.getUserById(activeStudentId);
            if (anak) {
                // Update nama anak jika diperlukan
            }
        }

        function renderCatatanAndReplies() {
            if (!activeStudentId) return;
            
            const catatanList = DataStore.getCatatanSiswa(activeStudentId);
            const container = document.getElementById('catatan-guru-container');
            const replyContainer = document.getElementById('reply-thread');
            const btnBalas = document.getElementById('btn-balas');
            
            if (catatanList.length > 0) {
                const catatan = catatanList[0]; // Ambil yang paling baru
                activeCatatanId = catatan.id;
                
                const guru = DataStore.getUserById(catatan.guruId);
                
                document.getElementById('catatan-guru-isi').textContent = '"' + catatan.isi + '"';
                document.getElementById('catatan-guru-nama').textContent = '- ' + (guru ? guru.nama : 'Guru') + ' (Pembimbing)';
                
                // Render balasan
                replyContainer.innerHTML = catatan.balasan.map(b => \`
                    <div class="p-3 bg-white hairline-border ml-6 border-l-4 border-l-primary/20">
                        <p class="font-body-sm text-body-sm text-on-surface-variant mb-1">\${b.isi}</p>
                        <p class="font-label-caps text-[10px] text-primary font-bold text-right">- Anda (Orang Tua)</p>
                    </div>
                \`).join('');
                
                btnBalas.style.display = 'flex';
                
            } else {
                if(document.getElementById('catatan-guru-isi')) {
                    document.getElementById('catatan-guru-isi').textContent = 'Belum ada catatan dari guru untuk semester ini.';
                    document.getElementById('catatan-guru-nama').textContent = '- Sistem';
                }
                if(replyContainer) replyContainer.innerHTML = '';
                if(btnBalas) btnBalas.style.display = 'none';
            }
        }

        function openReplyForm() {
            document.getElementById('reply-form').classList.remove('hidden');
            document.getElementById('btn-balas').classList.add('hidden');
            document.getElementById('reply-input').focus();
        }

        function cancelReply() {
            document.getElementById('reply-form').classList.add('hidden');
            document.getElementById('btn-balas').classList.remove('hidden');
            document.getElementById('reply-input').value = '';
        }

        function submitReply() {
            const input = document.getElementById('reply-input');
            const text = input.value.trim();
            if (!text || !activeCatatanId) return;

            DataStore.balasCatatanOrtu(activeCatatanId, currentUser.id, text);

            input.value = '';
            cancelReply();
            renderCatatanAndReplies();
            
            const toast = document.getElementById('toast');
            toast.classList.remove('hidden');
            setTimeout(() => toast.classList.add('hidden'), 3000);
        }

        function renderNotifikasi() {
            const list = document.getElementById('notifikasi-list');
            if (!list || !currentUser) return;
            
            const notifs = DataStore.getNotifikasi('OrangTua', currentUser.id);
            if (notifs.length === 0) {
                list.innerHTML = '<p class="font-body-sm text-on-surface-variant">Belum ada notifikasi.</p>';
                return;
            }
            
            list.innerHTML = notifs.map(n => \`
                <div class="p-4 hairline-border border-l-4 \${n.dibaca ? 'border-l-on-tertiary-container bg-surface-container-low' : 'border-l-secondary bg-secondary-container/5'} relative group">
                    <p class="font-body-md text-body-md font-bold text-primary mb-1">\${n.judul}</p>
                    <p class="font-body-sm text-body-sm text-on-surface-variant">\${n.isi}</p>
                </div>
            \`).join('');
            
            // Tandai sudah dibaca
            setTimeout(() => { DataStore.markAllNotifikasiRead('OrangTua', currentUser.id); }, 2000);
        }

        // Dummy fungsi filter dan modal
        function renderChildSelector() {}
        function openArsipModal() { alert('Fitur arsip lengkap ada di menu Notifikasi.'); }
        function closeArsipModal() {}
        function filterArsip() {}
    </script>
`;

content = content.replace(/<script>[\s\S]*?<\/script>\s*<!-- Central Data Store/m, newScript + '\n    <!-- Central Data Store');

fs.writeFileSync(file, content);
console.log("Updated 16_dashboard-ortu/code.html");
