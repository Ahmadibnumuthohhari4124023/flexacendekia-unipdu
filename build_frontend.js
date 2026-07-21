/**
 * build_frontend.js - Comprehensive build script for Flexa Cendekia Apps Script
 * 
 * This script:
 * 1. Copies all 18 HTML pages into the appsscript/pages/ directory
 * 2. Rewrites all navigation links to use Apps Script routing with target="_top"
 * 3. Injects navigation JavaScript into buttons, sidebar links, and bottom nav
 * 4. Removes the dev-only navigation bar at the top of each page
 */

const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'appsscript', 'pages');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Global script that handles all standard navigation
const GLOBAL_NAV_SCRIPT = `
<script>
(function(){
  var BASE = '<?= getWebAppUrl() ?>';
  
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
    if (text === 'siswa') window.top.location.href = BASE + '?page=08_dashboard-siswa';
    else if (text === 'guru') window.top.location.href = BASE + '?page=14_dashboard-guru';
    else if (text === 'orang tua') window.top.location.href = BASE + '?page=16_dashboard-ortu';
  });

  // 2. Header Icons & Avatar
  bindClick('header button, header div.rounded-full.bg-primary', function(e, b) {
    var iconText = '';
    if (b.classList.contains('material-symbols-outlined')) iconText = b.textContent.trim();
    else {
      var icon = b.querySelector('.material-symbols-outlined');
      if (icon) iconText = icon.textContent.trim();
    }
    
    if (iconText === 'notifications') window.top.location.href = BASE + '?page=17_notifikasi';
    else if (iconText === 'settings' || iconText === 'account_circle' || iconText === 'person' || b.classList.contains('rounded-full')) {
      window.top.location.href = BASE + '?page=18_profil';
    }
  });

  // 3. Sidebar, Bottom Nav, and generic # links
  bindClick('aside a, div.fixed.bottom-0 button, div[class*="md:hidden"] button, a[href="#"]', function(e, el) {
    var text = el.textContent.trim().toLowerCase();
    if (!text) {
        var icon = el.querySelector('.material-symbols-outlined');
        if (icon) text = icon.textContent.trim().toLowerCase();
    }
    
    if (text === 'beranda' || text === 'dashboard' || text === 'home') window.top.location.href = BASE + '?page=08_dashboard-siswa';
    else if (text.includes('krs') || text.includes('rencana studi') || text.includes('study plans')) window.top.location.href = BASE + '?page=09_krs-siswa';
    else if (text.includes('roadmap') || text.includes('detail roadmap')) window.top.location.href = BASE + '?page=10_detail-roadmap';
    else if (text.includes('checkpoint') || text.includes('jumat')) window.top.location.href = BASE + '?page=11_checkpoint-jumat';
    else if (text.includes('riwayat') || text === 'grades') window.top.location.href = BASE + '?page=13_riwayat-semester';
    else if (text.includes('ganti cita')) window.top.location.href = BASE + '?page=12_ganti-cita-cita';
    else if (text.includes('profil') || text === 'settings' || text === 'person') window.top.location.href = BASE + '?page=18_profil';
    else if (text.includes('notifikasi') || text === 'notifications') window.top.location.href = BASE + '?page=17_notifikasi';
    else if (text.includes('tinjauan') || text.includes('review') || text.includes('tinjau')) window.top.location.href = BASE + '?page=15_tinjauan-guru';
    else if (text.includes('keluar') || text.includes('logout')) window.top.location.href = BASE + '?page=01_login';
    else if (text.includes('tes diagnostik')) window.top.location.href = BASE + '?page=02_intro-diagnosis';
  });
  
  document.querySelectorAll('header div.rounded-full.bg-primary').forEach(function(el){ el.style.cursor = 'pointer'; });
})();
</script>
`;

const SPECIFIC_NAV_SCRIPT = {
    '01_login': `
    <script>
    (function(){
      var BASE = '<?= getWebAppUrl() ?>';
      var ssoBtn = document.querySelector('button.bg-primary');
      if(ssoBtn) ssoBtn.addEventListener('click', function(){ window.top.location.href = BASE + '?page=02_intro-diagnosis'; });
      var roleChips = document.querySelectorAll('.role-chip');
      if(roleChips[0]) roleChips[0].addEventListener('click', function(){ window.top.location.href = BASE + '?page=02_intro-diagnosis'; });
      if(roleChips[1]) roleChips[1].addEventListener('click', function(){ window.top.location.href = BASE + '?page=14_dashboard-guru'; });
      if(roleChips[2]) roleChips[2].addEventListener('click', function(){ window.top.location.href = BASE + '?page=16_dashboard-ortu'; });
    })();
    </script>`,
    '02_intro-diagnosis': `
    <script>
    (function(){
      var BASE = '<?= getWebAppUrl() ?>';
      var ctaBtn = document.querySelector('button.bg-academic-accent');
      if(ctaBtn) ctaBtn.addEventListener('click', function(){ window.top.location.href = BASE + '?page=03_soal-diagnosis'; });
    })();
    </script>`,
    '03_soal-diagnosis': `
    <script>
    (function(){
      var BASE = '<?= getWebAppUrl() ?>';
      var userId = '<?= (typeof userData !== "undefined" && userData) ? userData.id : "mock-id" ?>';
      document.querySelectorAll('button').forEach(function(b){
        var text = b.textContent.trim().toLowerCase();
        if(text.includes('selanjutnya') || text.includes('kirim') || text.includes('selesai') || text.includes('lanjut')) {
          b.addEventListener('click', function(e){ 
            e.preventDefault();
            b.innerHTML = 'Menyimpan...';
            b.disabled = true;
            try {
              google.script.run.withSuccessHandler(function(res) {
                window.top.location.href = BASE + '?page=04_hasil-diagnosis';
              }).withFailureHandler(function(err) {
                alert('Gagal menyimpan: ' + err);
                b.innerHTML = 'Coba Lagi';
                b.disabled = false;
              }).simpanDiagnosis(userId, 85, 90, 'Visual', 'Sains');
            } catch(e) {
               window.top.location.href = BASE + '?page=04_hasil-diagnosis';
            }
          });
        }
      });
    })();
    </script>`,
    '04_hasil-diagnosis': `
    <script>
    (function(){
      var BASE = '<?= getWebAppUrl() ?>';
      document.querySelectorAll('button, a').forEach(function(el){
        var text = el.textContent.trim().toLowerCase();
        if(text.includes('pilih cita') || text.includes('lanjut') || text.includes('selanjutnya') || text.includes('tentukan')) {
          el.addEventListener('click', function(e){ e.preventDefault(); window.top.location.href = BASE + '?page=05_pilih-cita-cita'; });
        }
      });
    })();
    </script>`,
    '05_pilih-cita-cita': `
    <script>
    (function(){
      var BASE = '<?= getWebAppUrl() ?>';
      var userId = '<?= (typeof userData !== "undefined" && userData) ? userData.id : "mock-id" ?>';
      document.querySelectorAll('button, a').forEach(function(el){
        var text = el.textContent.trim().toLowerCase();
        if(text.includes('konfirmasi') || text.includes('simpan') || text.includes('lanjut') || text.includes('pilih') || text.includes('selanjutnya') || text.includes('generate')) {
          el.addEventListener('click', function(e){ 
            e.preventDefault();
            el.innerHTML = 'Membuat Roadmap...';
            
            try {
              google.script.run.withSuccessHandler(function(res) {
                window.top.location.href = BASE + '?page=06_roadmap-disusun';
              }).withFailureHandler(function(err) {
                alert('Gagal membuat roadmap: ' + err);
                el.innerHTML = 'Coba Lagi';
              }).generateRoadmap(userId, 'Arsitek');
            } catch(e) {
               window.top.location.href = BASE + '?page=06_roadmap-disusun';
            }
          });
        }
      });
    })();
    </script>`,
    '06_roadmap-disusun': `
    <script>
    (function(){
      var BASE = '<?= getWebAppUrl() ?>';
      document.querySelectorAll('button, a').forEach(function(el){
        var text = el.textContent.trim().toLowerCase();
        if(text.includes('lihat') || text.includes('roadmap') || text.includes('lanjut') || text.includes('selesai')) {
          el.addEventListener('click', function(e){ e.preventDefault(); window.top.location.href = BASE + '?page=07_hasil-roadmap'; });
        }
      });
      setTimeout(function(){
        var btns = document.querySelectorAll('button');
        if(btns.length === 0){
          window.top.location.href = BASE + '?page=07_hasil-roadmap';
        }
      }, 5000);
    })();
    </script>`,
    '07_hasil-roadmap': `
    <script>
    (function(){
      var BASE = '<?= getWebAppUrl() ?>';
      document.querySelectorAll('button, a').forEach(function(el){
        var text = el.textContent.trim().toLowerCase();
        if(text.includes('dashboard') || text.includes('mulai belajar') || text.includes('lanjut') || text.includes('beranda')) {
          el.addEventListener('click', function(e){ e.preventDefault(); window.top.location.href = BASE + '?page=08_dashboard-siswa'; });
        }
      });
    })();
    </script>`,
    '08_dashboard-siswa': `
    <script>
    (function(){
      var BASE = '<?= getWebAppUrl() ?>';
      document.querySelectorAll('button, a').forEach(function(el){
        var text = el.textContent.trim().toLowerCase();
        if(text.includes('ambil tes') || text.includes('mulai tes')) {
          el.addEventListener('click', function(e){ e.preventDefault(); window.top.location.href = BASE + '?page=02_intro-diagnosis'; });
        }
      });
    })();
    </script>`,
    '11_checkpoint-jumat': `
    <script>
    (function(){
      var BASE = '<?= getWebAppUrl() ?>';
      document.querySelectorAll('button').forEach(function(b){
        var text = b.textContent.trim().toLowerCase();
        if(text.includes('kirim') || text.includes('submit') || text.includes('selesai')) {
          b.addEventListener('click', function(){ window.top.location.href = BASE + '?page=08_dashboard-siswa'; });
        }
      });
    })();
    </script>`,
    '12_ganti-cita-cita': `
    <script>
    (function(){
      var BASE = '<?= getWebAppUrl() ?>';
      document.querySelectorAll('button').forEach(function(b){
        var text = b.textContent.trim().toLowerCase();
        if(text.includes('ajukan') || text.includes('kirim') || text.includes('konfirmasi')) {
          b.addEventListener('click', function(){ window.top.location.href = BASE + '?page=08_dashboard-siswa'; });
        }
        if(text.includes('batal') || text.includes('kembali')) {
          b.addEventListener('click', function(){ window.top.location.href = BASE + '?page=08_dashboard-siswa'; });
        }
      });
    })();
    </script>`,
    '15_tinjauan-guru': `
    <script>
    (function(){
      var BASE = '<?= getWebAppUrl() ?>';
      document.querySelectorAll('button').forEach(function(b){
        var text = b.textContent.trim().toLowerCase();
        if(text.includes('setujui') || text.includes('approve') || text.includes('simpan') || text.includes('kembali')) {
          b.addEventListener('click', function(){ window.top.location.href = BASE + '?page=14_dashboard-guru'; });
        }
      });
    })();
    </script>`
};

const folders = fs.readdirSync(srcDir).filter(f => {
    return fs.statSync(path.join(srcDir, f)).isDirectory() && /^\d{2}_/.test(f);
});

folders.forEach(folder => {
    const codeFile = path.join(srcDir, folder, 'code.html');
    if (fs.existsSync(codeFile)) {
        let content = fs.readFileSync(codeFile, 'utf8');
        
        // Remove dev nav
        content = content.replace(/<div style="background:#17223B;color:#EAEDE2;font-family:'JetBrains Mono'[^>]*>[\s\S]*?<\/div>\s*\n?/i, '');
        
        // Replace relative paths with GS routing
        content = content.replace(/href="\.\.\/(\d{2}_[a-zA-Z0-9-]+)\/code\.html"/g, 'target="_top" href="<?= getWebAppUrl() ?>?page=$1"');
        content = content.replace(/href="(\d{2}_[a-zA-Z0-9-]+)\/code\.html"/g, 'target="_top" href="<?= getWebAppUrl() ?>?page=$1"');
        content = content.replace(/href="\.\.\/index\.html"/g, 'target="_top" href="<?= getWebAppUrl() ?>?page=01_login"');
        content = content.replace(/href="panduan\.html"/g, 'target="_top" href="<?= getWebAppUrl() ?>?page=01_login_panduan"');
        content = content.replace(/href="bantuan\.html"/g, 'target="_top" href="<?= getWebAppUrl() ?>?page=01_login_bantuan"');
        content = content.replace(/href="kontak\.html"/g, 'target="_top" href="<?= getWebAppUrl() ?>?page=01_login_kontak"');
        
        // Ensure other valid hrefs get target="_top"
        content = content.replace(/<a\s+([^>]*?)href="([^#"][^"]*)"([^>]*?)>/g, function(match, before, href, after) {
            if (match.includes('target=')) return match;
            if (href.startsWith('http') || href.startsWith('<?=')) {
                return '<a ' + before + 'target="_top" href="' + href + '"' + after + '>';
            }
            return match;
        });
        
        const navScript = GLOBAL_NAV_SCRIPT + (SPECIFIC_NAV_SCRIPT[folder] || '');
        if (navScript) {
            content = content.replace('</body>', navScript + '\n</body>');
        }

        const destFile = path.join(destDir, `${folder}.html`);
        fs.writeFileSync(destFile, content);
        console.log(`✓ ${folder}.html - processed`);
    }
});

// Process sub-pages from 01_login (panduan, bantuan, kontak)
const subPages = ['panduan', 'bantuan', 'kontak'];
subPages.forEach(subPage => {
    const subFile = path.join(srcDir, '01_login', `${subPage}.html`);
    if (fs.existsSync(subFile)) {
        let content = fs.readFileSync(subFile, 'utf8');
        
        // Rewrite internal links: code.html -> Apps Script routing for 01_login
        content = content.replace(/href="code\.html"/g, 'target="_top" href="<?= getWebAppUrl() ?>?page=01_login"');
        
        // Rewrite links between sub-pages
        content = content.replace(/href="panduan\.html"/g, 'target="_top" href="<?= getWebAppUrl() ?>?page=01_login_panduan"');
        content = content.replace(/href="bantuan\.html"/g, 'target="_top" href="<?= getWebAppUrl() ?>?page=01_login_bantuan"');
        content = content.replace(/href="kontak\.html"/g, 'target="_top" href="<?= getWebAppUrl() ?>?page=01_login_kontak"');
        
        // Ensure external links get target="_top"
        content = content.replace(/<a\s+([^>]*?)href="([^#"][^"]*)"([^>]*?)>/g, function(match, before, href, after) {
            if (match.includes('target=')) return match;
            if (href.startsWith('http') || href.startsWith('<?=')) {
                return '<a ' + before + 'target="_top" href="' + href + '"' + after + '>';
            }
            return match;
        });
        
        const destFile = path.join(destDir, `01_login_${subPage}.html`);
        fs.writeFileSync(destFile, content);
        console.log(`✓ 01_login_${subPage}.html - processed (sub-page)`);
    }
});

console.log("\n✅ Done! All pages built with full navigation (including panduan, bantuan, kontak).");

