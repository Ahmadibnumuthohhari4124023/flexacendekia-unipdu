const fs = require('fs');
let content = fs.readFileSync('08_dashboard-siswa/code.html', 'utf8');

content = content.replace(
  '<span class="material-symbols-outlined text-[18px]">school</span> SMA Kelas 11',
  '<span class="material-symbols-outlined text-[18px]">school</span> <span id="siswa-kelas-jenjang">SMA Kelas 11</span>'
);

content = content.replace(
  '<span class="material-symbols-outlined text-[18px]">architecture</span> Cita-cita: Arsitek',
  '<span class="material-symbols-outlined text-[18px]">architecture</span> Cita-cita: <span id="siswa-citacita">Arsitek</span>'
);

const oldCards = `        <!-- 2. Baris Statistik (3 Cards) -->
        <section class="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- Streak Harian -->
            <div class="ledger-card p-6 flex flex-col justify-center items-center text-center">
                <span class="font-mono text-xs font-bold tracking-widest text-on-surface-variant mb-2">STREAK
                    HARIAN</span>
                <div class="flex items-baseline gap-2">
                    <span class="font-mono text-4xl md:text-5xl font-bold text-brand-gold">14</span>
                    <span class="font-mono text-xs text-on-surface-variant font-medium">HARI</span>
                </div>
            </div>

            <!-- Poin Terkumpul -->
            <div class="ledger-card p-6 flex flex-col justify-center items-center text-center">
                <span class="font-mono text-xs font-bold tracking-widest text-on-surface-variant mb-2">POIN
                    TERKUMPUL</span>
                <div class="flex items-baseline gap-2">
                    <span class="font-mono text-4xl md:text-5xl font-bold text-primary">1.250</span>
                    <span class="font-mono text-xs text-on-surface-variant font-medium">XP</span>
                </div>
            </div>

            <!-- Level -->
            <div class="ledger-card p-6 flex flex-col justify-center items-center text-center">
                <span class="font-mono text-xs font-bold tracking-widest text-on-surface-variant mb-2">LEVEL</span>
                <div class="flex flex-col items-center">
                    <span class="font-serif text-2xl md:text-3xl font-bold text-primary mb-1">Penjelajah</span>
                    <div class="w-24 h-1.5 bg-brand-gold mt-1"></div>
                </div>
            </div>
        </section>`;

const newTugas = `        <!-- 2. Tugas Mendatang -->
        <section class="col-span-12 ledger-card p-6 md:p-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="font-serif text-xl md:text-2xl font-bold text-primary">Tugas & Tenggat Mendatang</h2>
                <span class="material-symbols-outlined text-primary text-xl">event_available</span>
            </div>
            <div id="tugas-mendatang-container" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="text-sm text-on-surface-variant animate-pulse">Memuat tugas...</div>
            </div>
        </section>`;

content = content.replace(oldCards, newTugas);
fs.writeFileSync('08_dashboard-siswa/code.html', content);
console.log('Replacement complete.');
