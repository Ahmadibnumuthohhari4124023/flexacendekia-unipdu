const fs = require('fs');
let content = fs.readFileSync('09_krs-siswa/code.html', 'utf8');

const oldJs = `            // Update Modul List
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
            
            // Listen for Real-Time KRS updates
            DataStore.onKRSUpdate(currentUser.uid || currentUser.id, function(listKRS) {
                const activeKrs = listKRS.length > 0 ? listKRS[0] : null;

                if (!activeKrs) {`;

const newJs = `            const btnRevisi = document.getElementById('btn-revisi');
            const btnCetak = document.getElementById('btn-cetak');
            const tbody = document.getElementById('modul-list');
            
            // Listen for Real-Time KRS updates
            DataStore.onKRSUpdate(currentUser.uid || currentUser.id, function(listKRS) {
                const activeKrs = listKRS.length > 0 ? listKRS[0] : null;

                // Update Modul List dynamically based on activeKrs or use mock if none
                let html = '';
                if (activeKrs && activeKrs.mataKuliah && activeKrs.mataKuliah.length > 0) {
                    activeKrs.mataKuliah.forEach((mk, idx) => {
                        html += \`
                        <tr>
                            <td class="px-6 py-4 font-stats-sm text-stats-sm">MDK-\${100 + idx}</td>
                            <td class="px-6 py-4 font-body-md font-bold text-primary">\${mk}</td>
                            <td class="px-6 py-4 font-body-sm text-on-surface-variant">Inti Akademik</td>
                            <td class="px-6 py-4">
                                <span class="px-2 py-1 bg-primary/5 text-primary border border-primary/10 text-[11px] font-bold uppercase">REGULAR</span>
                            </td>
                            <td class="px-6 py-4 text-right">
                                <span class="font-label-caps text-[10px] text-secondary">WAJIB</span>
                            </td>
                        </tr>\`;
                    });
                } else {
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
                }
                tbody.innerHTML = html;

                if (!activeKrs) {`;

content = content.replace(oldJs, newJs);

fs.writeFileSync('09_krs-siswa/code.html', content);
console.log('09_krs-siswa Replacement complete.');
