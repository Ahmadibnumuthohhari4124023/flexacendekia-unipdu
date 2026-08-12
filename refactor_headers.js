const fs = require('fs');
const path = require('path');

const srcDir = __dirname;

function findHtmlFiles(dir) {
    let results = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && item !== '.git' && item !== 'node_modules' && item !== '01_login' && !item.includes('server')) {
            results = results.concat(findHtmlFiles(fullPath));
        } else if (item.endsWith('.html') && !fullPath.includes('01_login')) {
            results.push(fullPath);
        }
    }
    return results;
}

function refactorHeaders(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // 1. Remove Cross-Role Navigation Tabs
    // This regex targets <nav> or <div> elements containing "hidden md:flex" and the word "Guru" or "Siswa" or "Orang Tua"
    // that are inside the header area.
    
    // Pattern to match <nav class="hidden md:flex... "> ... </nav> containing Siswa/Guru/Orang Tua
    const navPattern = /<(nav|div)[^>]*class="[^"]*hidden md:flex[^"]*"[^>]*>[\s\S]*?(?:Siswa|Guru|Orang Tua|dashboard-siswa|dashboard-guru)[\s\S]*?<\/\1>/gi;
    
    content = content.replace(navPattern, (match) => {
        // Only replace if it actually contains the cross role links to be safe
        if (match.includes('Guru') && (match.includes('Siswa') || match.includes('Orang Tua') || match.includes('16_dashboard-ortu'))) {
            return `<div class="hidden md:flex items-center h-full">
                    <span class="px-4 py-1.5 font-label-caps text-[11px] font-bold text-primary bg-primary/5 rounded-full border border-primary/10 tracking-widest uppercase">Aplikasi Aktif</span>
                </div>`;
        }
        return match; // return unchanged if it doesn't match the specific criteria
    });

    // 2. Inject Logout Button
    // We look for the profile/notification icon container. Typically it has `id="realtime-clock"` or `notifications`.
    // Let's add the logout button right before `</header>` to be safe and broadly applicable, or inside the rightmost flex container.
    // A safer way is to find the last `</div>` inside the `<header ...>` block.
    
    // Instead of complex regex, let's inject it into the right-side icons div.
    // They usually have: `<div class="flex items-center gap-1">` or `gap-4` right before `</header>`
    const rightIconsPattern = /(<div[^>]*class="[^"]*flex items-center gap-[1-4][^"]*"[^>]*>[\s\S]*?)(<\/div>\s*<\/div>\s*<\/header>)/i;
    
    const logoutBtn = `
                <!-- Logout Button -->
                <button onclick="if(window.flexaLogout) flexaLogout(); else if(window.firebase) firebase.auth().signOut().then(()=>window.location.href='../01_login/code.html');" class="ml-2 flex items-center justify-center p-2 text-error hover:bg-error/10 rounded-full transition-colors group relative" title="Keluar">
                    <span class="material-symbols-outlined">logout</span>
                    <span class="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-surface text-on-surface px-2 py-1 shadow-md rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-on-surface/10">Keluar</span>
                </button>
            `;

    if (!content.includes('logout') && !content.includes('Keluar')) {
        content = content.replace(/(<div class="flex items-center gap-[1-4][^>]*>[\s\S]*?)((?:<\/a>|<\/div>|<\/button>)\s*)(<\/div>\s*(?:<\/div>\s*)?<\/(?:header|nav)>)/i, 
            `$1$2${logoutBtn}$3`);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Refactored: ${filePath}`);
        return true;
    }
    return false;
}

const htmlFiles = findHtmlFiles(srcDir);
let refactoredCount = 0;

console.log(`Found ${htmlFiles.length} HTML files.`);
htmlFiles.forEach(file => {
    if (refactorHeaders(file)) {
        refactoredCount++;
    }
});

console.log(`\nDone! Refactored headers in ${refactoredCount} files.`);
