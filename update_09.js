const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '09_krs-siswa', 'code.html');
let content = fs.readFileSync(file, 'utf8');

const newScript = `
    <script>
        // Micro-interaction for table rows
        document.querySelectorAll('tbody tr').forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.transform = 'translateX(4px)';
                row.style.transition = 'transform 0.2s ease-out';
                row.style.borderLeft = '2px solid #B9862F';
            });
            row.addEventListener('mouseleave', () => {
                row.style.transform = 'translateX(0)';
                row.style.borderLeft = 'none';
            });
        });

        const currentUser = DataStore.getCurrentUser('Siswa');

        // Fetch KRS Status
        function loadKrsStatus() {
            if (!currentUser) return;
            
            const nameEl = document.getElementById('display-student-name');
            if (nameEl) nameEl.textContent = currentUser.nama;
            
            const listKRS = DataStore.getKRSSiswa(currentUser.id);
            const activeKrs = listKRS.length > 0 ? listKRS[0] : null;

            const badge = document.getElementById('krs-status-badge');
            const badgeIcon = badge.querySelector('.material-symbols-outlined');
            const badgeText = badge.querySelector('span:nth-child(2)');
            const catatanText = document.getElementById('krs-catatan-guru');
            
            // Default mockup modules for display
            const mockModules = [
                { kode: 'TKA-201', nama: 'Matematika Terapan', kompetensi: 'Analisis Spasial', pacing: 'REGULAR', status: 'WAJIB' },
                { kode: 'FIS-102', nama: 'Fisika Mekanika', kompetensi: 'Struktur Dasar', pacing: 'AKSELERASI', status: 'WAJIB' },
                { kode: 'SEN-105', nama: 'Seni Rupa/Desain', kompetensi: 'Estetika Visual', pacing: 'REGULAR', status: 'PILIHAN' }
            ];
            
            // Update Cita-Cita
            document.getElementById('krs-cita-cita').textContent = currentUser.citaCita;
            
            // Update Modul List
            const tbody = document.getElementById('modul-list');
            let html = '';
            mockModules.forEach(m => {
                const wajibClass = m.status === 'WAJIB' ? 'text-secondary' : 'text-on-surface-variant';
                html += \`
                <tr>
                    <td class="px-6 py-4 font-stats-sm text-stats-sm">\${m.kode}</td>
                    <td class="px-6 py-4 font-body-md font-bold text-primary">\${m.nama}</td>
                    <td class="px-6 py-4 font-body-sm text-on-surface-variant">\${m.kompetensi}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 bg-primary/5 text-primary border border-primary/10 text-[11px] font-bold uppercase">\${m.pacing}</span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <span class="font-label-caps text-[10px] \${wajibClass}">\${m.status}</span>
                    </td>
                </tr>\`;
            });
            tbody.innerHTML = html;

            const btnRevisi = document.getElementById('btn-revisi');
            const btnCetak = document.getElementById('btn-cetak');
            
            if (!activeKrs) {
                // No KRS yet
                badge.className = "inline-flex items-center px-4 py-2 bg-outline-variant/20 border border-outline-variant text-on-surface-variant rounded-sm";
                badgeIcon.textContent = "pending_actions";
                badgeText.textContent = "Belum Mengajukan";
                
                btnRevisi.innerHTML = '<span class="material-symbols-outlined mr-2">send</span>AJUKAN KRS';
                btnRevisi.style.display = 'flex';
                btnRevisi.onclick = function() {
                    const mk = mockModules.map(m => m.nama);
                    DataStore.ajukanKRS(currentUser.id, mk, 3);
                    alert('KRS berhasil diajukan!');
                    window.location.reload();
                };
            } else {
                // Has KRS
                if (activeKrs.status === 'Disetujui') {
                    badge.className = "inline-flex items-center px-4 py-2 bg-[#adefe1] border border-[#005046] text-[#005046] rounded-sm";
                    badgeIcon.textContent = "check_circle";
                    badgeText.textContent = "Disetujui Guru";
                    
                    btnRevisi.style.display = 'none';
                    btnCetak.innerHTML = '<span class="material-symbols-outlined mr-2">print</span>CETAK KRS RESMI';
                    btnCetak.className = "w-full py-4 bg-[#005046] text-surface-container-lowest font-bold text-label-caps hover:brightness-110 transition-all duration-150 flex items-center justify-center cursor-pointer";
                } else if (activeKrs.status === 'Ditolak') {
                    badge.className = "inline-flex items-center px-4 py-2 bg-error/10 border border-error text-error rounded-sm";
                    badgeIcon.textContent = "cancel";
                    badgeText.textContent = "Ditolak - Perlu Revisi";
                    
                    btnRevisi.innerHTML = '<span class="material-symbols-outlined mr-2">edit_note</span>AJUKAN REVISI';
                    btnRevisi.style.display = 'flex';
                    btnRevisi.onclick = function() {
                        const mk = mockModules.map(m => m.nama);
                        DataStore.ajukanKRS(currentUser.id, mk, 3);
                        alert('Revisi KRS berhasil diajukan!');
                        window.location.reload();
                    };
                } else {
                    // Menunggu Persetujuan
                    badge.className = "inline-flex items-center px-4 py-2 bg-[#FDC265]/20 border border-brand-gold text-brand-gold-dark rounded-sm";
                    badgeIcon.textContent = "schedule";
                    badgeText.textContent = "Menunggu Persetujuan";
                    
                    btnRevisi.style.display = 'none';
                }
            }

            // Find feedback notes
            const allNotes = DataStore.getCatatanSiswa(currentUser.id);
            if (allNotes.length > 0) {
                catatanText.textContent = '"' + allNotes[0].isi + '"';
            } else {
                catatanText.textContent = '"Menunggu ulasan dari pembimbing akademik Anda."';
            }
        }
        
        loadKrsStatus();

        // Download Action
        const btnCetak = document.getElementById('btn-cetak');
        if (btnCetak) {
            btnCetak.addEventListener('click', function() {
                alert('Fungsi cetak KRS sedang dinonaktifkan dalam mode sinkronisasi ini.');
            });
        }
    </script>
`;

// Replace script from <script> to </script> before <!-- Central Data Store -->
// The existing file has <script> followed by // Micro-interaction... ending at </script> just before <!-- Central Data Store
content = content.replace(/<script>[\s\S]*?<\/script>\s*<!-- Central Data Store/m, newScript + '\n    <!-- Central Data Store');
// Add id to student name for easier dom updating
content = content.replace(/<p class="font-headline-md text-headline-md text-primary">Ahmad Fauzi<\/p>/, '<p class="font-headline-md text-headline-md text-primary" id="display-student-name">Ahmad Fauzi</p>');

fs.writeFileSync(file, content);
console.log("Updated 09_krs-siswa/code.html");
