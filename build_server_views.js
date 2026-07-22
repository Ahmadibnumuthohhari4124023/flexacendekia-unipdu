/**
 * build_server_views.js — Build script untuk migrasi ke Express server
 * 
 * Script ini:
 * 1. Menyalin semua code.html dari folder 01-18 ke server/views/
 * 2. Menghapus dev navigation bar
 * 3. Mengubah link navigasi untuk menggunakan /?page=xxx
 * 4. Mengganti google.script.run dengan fetch('/api/...')
 * 5. Menghapus tag template Apps Script (<?= ... ?>)
 */

const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'server', 'views');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// ==========================================
// Navigation script (pengganti GLOBAL_NAV_SCRIPT)
// Menggunakan link biasa, bukan google.script.run
// ==========================================
const GLOBAL_NAV_SCRIPT = `
<script>
(function(){
  function bindClick(selectors, handler) {
    document.querySelectorAll(selectors).forEach(function(el) {
      el.addEventListener('click', function(e) {
        if (el.tagName.toLowerCase() === 'a' && el.getAttribute('href') !== '#') {
            return;
        }
        e.preventDefault();
        handler(e, el);
      });
    });
  }

  // 1. Top Navbar Role Tabs
  bindClick('header nav a', function(e, a) {
    var text = a.textContent.trim().toLowerCase();
    if (text === 'siswa') window.location.href = '/?page=08_dashboard-siswa';
    else if (text === 'guru') window.location.href = '/?page=14_dashboard-guru';
    else if (text === 'orang tua') window.location.href = '/?page=16_dashboard-ortu';
  });

  // 2. Header Icons & Avatar
  bindClick('header button, header div.rounded-full.bg-primary', function(e, b) {
    var iconText = '';
    if (b.classList.contains('material-symbols-outlined')) iconText = b.textContent.trim();
    else {
      var icon = b.querySelector('.material-symbols-outlined');
      if (icon) iconText = icon.textContent.trim();
    }
    
    if (iconText === 'notifications') window.location.href = '/?page=17_notifikasi';
    else if (iconText === 'settings' || iconText === 'account_circle' || iconText === 'person' || b.classList.contains('rounded-full')) {
      window.location.href = '/?page=18_profil';
    }
  });

  // 3. Sidebar, Bottom Nav, and generic # links
  bindClick('aside a, div.fixed.bottom-0 button, div[class*="md:hidden"] button, a[href="#"]', function(e, el) {
    var text = el.textContent.trim().toLowerCase();
    if (!text) {
        var icon = el.querySelector('.material-symbols-outlined');
        if (icon) text = icon.textContent.trim().toLowerCase();
    }
    
    if (text === 'beranda' || text === 'dashboard' || text === 'home') window.location.href = '/?page=08_dashboard-siswa';
    else if (text.includes('krs') || text.includes('rencana studi') || text.includes('study plans')) window.location.href = '/?page=09_krs-siswa';
    else if (text.includes('roadmap') || text.includes('detail roadmap')) window.location.href = '/?page=10_detail-roadmap';
    else if (text.includes('checkpoint') || text.includes('jumat')) window.location.href = '/?page=11_checkpoint-jumat';
    else if (text.includes('riwayat') || text === 'grades') window.location.href = '/?page=13_riwayat-semester';
    else if (text.includes('ganti cita')) window.location.href = '/?page=12_ganti-cita-cita';
    else if (text.includes('profil') || text === 'settings' || text === 'person') window.location.href = '/?page=18_profil';
    else if (text.includes('notifikasi') || text === 'notifications') window.location.href = '/?page=17_notifikasi';
    else if (text.includes('tinjauan') || text.includes('review') || text.includes('tinjau')) window.location.href = '/?page=15_tinjauan-guru';
    else if (text.includes('keluar') || text.includes('logout')) window.location.href = '/?page=01_login';
    else if (text.includes('tes diagnostik')) window.location.href = '/?page=02_intro-diagnosis';
  });
  
  document.querySelectorAll('header div.rounded-full.bg-primary').forEach(function(el){ el.style.cursor = 'pointer'; });
})();
</script>
`;

// ==========================================
// Page-specific scripts (menggunakan fetch API, bukan google.script.run)
// ==========================================
const SPECIFIC_NAV_SCRIPT = {
    '01_login': `
    <script>
    (function(){
      var ssoBtn = document.querySelector('button.bg-primary');
      if(ssoBtn) ssoBtn.addEventListener('click', function(){ window.location.href = '/?page=02_intro-diagnosis'; });
      var roleChips = document.querySelectorAll('.role-chip');
      if(roleChips[0]) roleChips[0].addEventListener('click', function(){ window.location.href = '/?page=02_intro-diagnosis'; });
      if(roleChips[1]) roleChips[1].addEventListener('click', function(){ window.location.href = '/?page=14_dashboard-guru'; });
      if(roleChips[2]) roleChips[2].addEventListener('click', function(){ window.location.href = '/?page=16_dashboard-ortu'; });
    })();
    </script>`,
    '02_intro-diagnosis': `
    <script>
    (function(){
      var ctaBtn = document.querySelector('button.bg-academic-accent');
      if(ctaBtn) ctaBtn.addEventListener('click', function(){ window.location.href = '/?page=03_soal-diagnosis'; });
    })();
    </script>`,
    '03_soal-diagnosis': `
    <script>
    (function(){
      document.querySelectorAll('button').forEach(function(b){
        var text = b.textContent.trim().toLowerCase();
        if(text.includes('selanjutnya') || text.includes('kirim') || text.includes('selesai') || text.includes('lanjut')) {
          b.addEventListener('click', function(e){ 
            e.preventDefault();
            b.innerHTML = 'Menyimpan...';
            b.disabled = true;
            
            fetch('/api/diagnosis', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: 'mock-id',
                skorMinat: 85,
                skorBakat: 90,
                gayaBelajar: 'Visual',
                kompetensi: 'Sains'
              })
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
              window.location.href = '/?page=04_hasil-diagnosis';
            })
            .catch(function(err) {
              console.error(err);
              window.location.href = '/?page=04_hasil-diagnosis';
            });
          });
        }
      });
    })();
    </script>`,
    '04_hasil-diagnosis': `
    <script>
    (function(){
      document.querySelectorAll('button, a').forEach(function(el){
        var text = el.textContent.trim().toLowerCase();
        if(text.includes('pilih cita') || text.includes('lanjut') || text.includes('selanjutnya') || text.includes('tentukan')) {
          el.addEventListener('click', function(e){ e.preventDefault(); window.location.href = '/?page=05_pilih-cita-cita'; });
        }
      });
    })();
    </script>`,
    '05_pilih-cita-cita': `
    <script>
    (function(){
      document.querySelectorAll('button, a').forEach(function(el){
        var text = el.textContent.trim().toLowerCase();
        if(text.includes('konfirmasi') || text.includes('simpan') || text.includes('lanjut') || text.includes('pilih') || text.includes('selanjutnya') || text.includes('generate')) {
          el.addEventListener('click', function(e){ 
            e.preventDefault();
            el.innerHTML = 'Membuat Roadmap...';
            
            fetch('/api/roadmap', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: 'mock-id', profesi: 'Arsitek' })
            })
            .then(function(res) { return res.json(); })
            .then(function(data) {
              window.location.href = '/?page=06_roadmap-disusun';
            })
            .catch(function(err) {
              console.error(err);
              window.location.href = '/?page=06_roadmap-disusun';
            });
          });
        }
      });
    })();
    </script>`,
    '06_roadmap-disusun': `
    <script>
    (function(){
      document.querySelectorAll('button, a').forEach(function(el){
        var text = el.textContent.trim().toLowerCase();
        if(text.includes('lihat') || text.includes('roadmap') || text.includes('lanjut') || text.includes('selesai')) {
          el.addEventListener('click', function(e){ e.preventDefault(); window.location.href = '/?page=07_hasil-roadmap'; });
        }
      });
      setTimeout(function(){
        var btns = document.querySelectorAll('button');
        if(btns.length === 0){
          window.location.href = '/?page=07_hasil-roadmap';
        }
      }, 5000);
    })();
    </script>`,
    '07_hasil-roadmap': `
    <script>
    (function(){
      document.querySelectorAll('button, a').forEach(function(el){
        var text = el.textContent.trim().toLowerCase();
        if(text.includes('dashboard') || text.includes('mulai belajar') || text.includes('lanjut') || text.includes('beranda')) {
          el.addEventListener('click', function(e){ e.preventDefault(); window.location.href = '/?page=08_dashboard-siswa'; });
        }
      });
    })();
    </script>`,
    '08_dashboard-siswa': `
    <script>
    (function(){
      document.querySelectorAll('button, a').forEach(function(el){
        var text = el.textContent.trim().toLowerCase();
        if(text.includes('ambil tes') || text.includes('mulai tes')) {
          el.addEventListener('click', function(e){ e.preventDefault(); window.location.href = '/?page=02_intro-diagnosis'; });
        }
      });
    })();
    </script>`,
    '11_checkpoint-jumat': `
    <script>
    (function(){
      document.querySelectorAll('button').forEach(function(b){
        var text = b.textContent.trim().toLowerCase();
        if(text.includes('kirim') || text.includes('submit') || text.includes('selesai')) {
          b.addEventListener('click', function(){ window.location.href = '/?page=08_dashboard-siswa'; });
        }
      });
    })();
    </script>`,
    '12_ganti-cita-cita': `
    <script>
    (function(){
      document.querySelectorAll('button').forEach(function(b){
        var text = b.textContent.trim().toLowerCase();
        if(text.includes('ajukan') || text.includes('kirim') || text.includes('konfirmasi')) {
          b.addEventListener('click', function(){ window.location.href = '/?page=08_dashboard-siswa'; });
        }
        if(text.includes('batal') || text.includes('kembali')) {
          b.addEventListener('click', function(){ window.location.href = '/?page=08_dashboard-siswa'; });
        }
      });
    })();
    </script>`,
    '15_tinjauan-guru': `
    <script>
    (function(){
      document.querySelectorAll('button').forEach(function(b){
        var text = b.textContent.trim().toLowerCase();
        if(text.includes('setujui') || text.includes('approve') || text.includes('simpan') || text.includes('kembali')) {
          b.addEventListener('click', function(){ window.location.href = '/?page=14_dashboard-guru'; });
        }
      });
    })();
    </script>`
};

// ==========================================
// Process main pages (01 - 18)
// ==========================================
const folders = fs.readdirSync(srcDir).filter(f => {
    return fs.statSync(path.join(srcDir, f)).isDirectory() && /^\d{2}_/.test(f);
});

let processedCount = 0;

folders.forEach(folder => {
    const codeFile = path.join(srcDir, folder, 'code.html');
    if (fs.existsSync(codeFile)) {
        let content = fs.readFileSync(codeFile, 'utf8');
        
        // 1. Remove dev nav
        content = content.replace(/<div style="background:#17223B;color:#EAEDE2;font-family:'JetBrains Mono'[^>]*>[\s\S]*?<\/div>\s*\n?/i, '');
        
        // 2. Replace relative paths with Express routing (/?page=xxx)
        content = content.replace(/href="\.\.\/(\d{2}_[a-zA-Z0-9-]+)\/code\.html"/g, 'href="/?page=$1"');
        content = content.replace(/href="(\d{2}_[a-zA-Z0-9-]+)\/code\.html"/g, 'href="/?page=$1"');
        content = content.replace(/href="\.\.\/index\.html"/g, 'href="/?page=01_login"');
        content = content.replace(/href="panduan\.html"/g, 'href="/?page=01_login_panduan"');
        content = content.replace(/href="bantuan\.html"/g, 'href="/?page=01_login_bantuan"');
        content = content.replace(/href="kontak\.html"/g, 'href="/?page=01_login_kontak"');
        content = content.replace(/href="\.\.\/01_login\/panduan\.html"/g, 'href="/?page=01_login_panduan"');
        content = content.replace(/href="\.\.\/01_login\/bantuan\.html"/g, 'href="/?page=01_login_bantuan"');
        content = content.replace(/href="\.\.\/01_login\/kontak\.html"/g, 'href="/?page=01_login_kontak"');

        // 3. Remove Apps Script template tags (<?= ... ?>)
        content = content.replace(/<\?=\s*getWebAppUrl\(\)\s*\?>/g, '');
        content = content.replace(/<\?=\s*[^?]*\s*\?>/g, '');
        
        // 4. Remove target="_top" (not needed in Express)
        content = content.replace(/\s*target="_top"\s*/g, ' ');
        
        // 5. Inject navigation scripts
        const navScript = GLOBAL_NAV_SCRIPT + (SPECIFIC_NAV_SCRIPT[folder] || '');
        content = content.replace('</body>', navScript + '\n</body>');

        const destFile = path.join(destDir, `${folder}.html`);
        fs.writeFileSync(destFile, content);
        console.log(`✓ ${folder}.html — processed`);
        processedCount++;
    }
});

// ==========================================
// Process sub-pages (panduan, bantuan, kontak)
// ==========================================
const subPages = ['panduan', 'bantuan', 'kontak'];
subPages.forEach(subPage => {
    const subFile = path.join(srcDir, '01_login', `${subPage}.html`);
    if (fs.existsSync(subFile)) {
        let content = fs.readFileSync(subFile, 'utf8');
        
        // Rewrite internal links
        content = content.replace(/href="code\.html"/g, 'href="/?page=01_login"');
        content = content.replace(/href="panduan\.html"/g, 'href="/?page=01_login_panduan"');
        content = content.replace(/href="bantuan\.html"/g, 'href="/?page=01_login_bantuan"');
        content = content.replace(/href="kontak\.html"/g, 'href="/?page=01_login_kontak"');
        
        // Remove Apps Script template tags
        content = content.replace(/<\?=\s*[^?]*\s*\?>/g, '');
        content = content.replace(/\s*target="_top"\s*/g, ' ');

        const destFile = path.join(destDir, `01_login_${subPage}.html`);
        fs.writeFileSync(destFile, content);
        console.log(`✓ 01_login_${subPage}.html — processed (sub-page)`);
        processedCount++;
    }
});

console.log(`\n✅ Selesai! ${processedCount} halaman telah di-build ke server/views/`);
