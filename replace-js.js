const fs = require('fs');
let content = fs.readFileSync('08_dashboard-siswa/code.html', 'utf8');

const oldJs = `        updateClock();
        updateGreeting();
        setInterval(updateClock, 1000);
        // Delay slight to allow UI render before calculation
        setTimeout(updateWeeklyTarget, 300);`;

const newJs = `        updateClock();
        setInterval(updateClock, 1000);

        window.addEventListener('auth-ready', async (e) => {
            const user = e.detail;
            
            // 1. Set Profil Dasar
            document.querySelectorAll('.user-display-name').forEach(el => el.textContent = user.nama || 'Siswa');
            updateGreeting(user.nama || 'Siswa');
            
            if (user.kelas) {
                const klsEl = document.getElementById('siswa-kelas-jenjang');
                if (klsEl) klsEl.textContent = user.kelas;
            }
            if (user.citaCita) {
                const citaEl = document.getElementById('siswa-citacita');
                if (citaEl) citaEl.textContent = user.citaCita;
            }

            // 2. Set Avatar Initial
            if (user.avatar) {
                const avatarEl = document.querySelector('.bg-primary.text-white.flex.items-center.justify-center.font-serif');
                if (avatarEl) avatarEl.textContent = user.avatar;
            }

            // 3. Load Tugas Mendatang & Progres
            if (window.DataStore && window.DataStore.getProgresMingguan) {
                const progres = await window.DataStore.getProgresMingguan(user.uid);
                if (progres && progres.tugasMendatang) {
                    const container = document.getElementById('tugas-mendatang-container');
                    if (container) {
                        let html = '';
                        if (progres.tugasMendatang.length === 0) {
                            html = '<div class="text-sm text-on-surface-variant col-span-3">Tidak ada tugas mendatang.</div>';
                        } else {
                            progres.tugasMendatang.forEach(tugas => {
                                const tgl = new Date(tugas.tenggatWaktu);
                                const tglStr = tgl.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                                
                                let statusBadge = '';
                                if (tugas.status === 'Belum') {
                                    statusBadge = '<span class="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold">BELUM</span>';
                                } else if (tugas.status === 'Berjalan') {
                                    statusBadge = '<span class="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded font-bold">PROSES</span>';
                                } else {
                                    statusBadge = '<span class="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold">SELESAI</span>';
                                }
                                
                                html += \`<div class="border border-outline-variant/30 rounded-lg p-4 hover:shadow-md transition-shadow bg-white flex flex-col justify-between gap-3">
                                    <div>
                                        \${statusBadge}
                                        <h3 class="font-bold text-primary text-sm mt-2">\${tugas.judul}</h3>
                                    </div>
                                    <div class="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                                        <span class="material-symbols-outlined text-[14px]">schedule</span>
                                        Tenggat: \${tglStr}
                                    </div>
                                </div>\`;
                            });
                        }
                        container.innerHTML = html;
                    }
                } else {
                    const container = document.getElementById('tugas-mendatang-container');
                    if (container) container.innerHTML = '<div class="text-sm text-on-surface-variant col-span-3">Belum ada data progres.</div>';
                }
            }

            // 4. Update Target Mingguan (fallback dari script lama)
            setTimeout(updateWeeklyTarget, 300);
        });

        // Modify updateGreeting to accept name
        function updateGreeting(nama = 'Siswa') {
            const hour = new Date().getHours();
            const el = document.getElementById('greeting-text');
            if (!el) return;
            const firstName = nama.split(' ')[0];
            if (hour < 10) el.textContent = \`Selamat Pagi, \${firstName}! ☀️ Semangat belajar hari ini.\`;
            else if (hour < 15) el.textContent = \`Selamat Siang, \${firstName}! 📚 Terus semangat ya.\`;
            else if (hour < 18) el.textContent = \`Selamat Sore, \${firstName}! 🌤️ Waktunya review materi.\`;
            else el.textContent = \`Selamat Malam, \${firstName}! 🌙 Jangan lupa istirahat.\`;
        }`;

content = content.replace(oldJs, newJs);

// Fix duplicate updateGreeting function by removing the old one
content = content.replace(
`        function updateGreeting() {
            const hour = new Date().getHours();
            const el = document.getElementById('greeting-text');
            if (!el) return;
            if (hour < 10) el.textContent = 'Selamat Pagi, Ahmad! ☀️ Semangat belajar hari ini.';
            else if (hour < 15) el.textContent = 'Selamat Siang, Ahmad! 📚 Terus semangat ya.';
            else if (hour < 18) el.textContent = 'Selamat Sore, Ahmad! 🌤️ Waktunya review materi.';
            else el.textContent = 'Selamat Malam, Ahmad! 🌙 Jangan lupa istirahat.';
        }`, '');

fs.writeFileSync('08_dashboard-siswa/code.html', content);
console.log('JS Replacement complete.');
