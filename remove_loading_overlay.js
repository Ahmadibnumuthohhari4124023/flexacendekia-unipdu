/**
 * Script to remove ALL remaining "Memverifikasi Akses..." remnants
 * from dashboard HTML pages.
 * 
 * The original loading screen structure was:
 *   <div id="loading-screen-auth">
 *       <div class="spinner"></div>
 *       <h2 style="font-weight: bold; font-size: 1.2rem;">Memverifikasi Akses...</h2>
 *   </div>
 *
 * The first script removed the outer div but left the h2 and closing </div> orphaned.
 * This script cleans up those remnants.
 */

const fs = require('fs');
const path = require('path');
const glob = require('path');

const srcDir = __dirname;

function findHtmlFiles(dir) {
    let results = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && item !== '.git' && item !== 'node_modules' && item !== '_arsip_versi_lama') {
            results = results.concat(findHtmlFiles(fullPath));
        } else if (item.endsWith('.html') && !fullPath.includes('01_login')) {
            results.push(fullPath);
        }
    }
    return results;
}

function cleanRemnants(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Remove orphaned spinner div line
    content = content.replace(/\s*<div class="spinner"><\/div>\s*/g, '');
    
    // Remove orphaned h2 "Memverifikasi Akses..." line and its surrounding whitespace
    content = content.replace(/\s*<h2 style="font-weight: bold; font-size: 1\.2rem;">Memverifikasi Akses\.\.\.<\/h2>\s*/g, '');
    
    // Remove orphaned closing </div> that was part of the loading screen
    // This is tricky — we look for the pattern: empty line + </div> + empty line after the body tag
    // More safely: remove lines that have only whitespace + </div> that are right after where the loading screen was
    
    // Clean up any remaining "belum-terverifikasi" references  
    content = content.replace(/belum-terverifikasi\s*/g, '');
    
    // Clean up any remaining auth-guard-style references
    content = content.replace(/<style id="auth-guard-style">[\s\S]*?<\/style>\s*/g, '');
    
    // Clean up any remaining loading-screen-auth div
    content = content.replace(/<div id="loading-screen-auth">[\s\S]*?<\/div>\s*/g, '');
    
    // Clean up orphaned </div> that immediately follows the <body> tag (remnant of loading screen wrapper)
    // Pattern: <body ...>\n    </div>
    content = content.replace(/(<body[^>]*>)\s*<\/div>/g, '$1');
    
    // Clean up multiple consecutive empty lines (more than 2)
    content = content.replace(/\n{3,}/g, '\n\n');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Cleaned: ${filePath}`);
        return true;
    }
    return false;
}

const htmlFiles = findHtmlFiles(srcDir);
let cleaned = 0;

htmlFiles.forEach(file => {
    if (cleanRemnants(file)) {
        cleaned++;
    }
});

console.log(`\nDone! Cleaned ${cleaned} files out of ${htmlFiles.length} total HTML files.`);
