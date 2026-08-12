const fs = require('fs');
let html = fs.readFileSync('13_riwayat-semester/code.html', 'utf8');

// Replace avatars with placeholders and ids
html = html.replace(/<div class="w-10 h-10 bg-primary text-white flex items-center justify-center font-serif font-bold text-sm flex-shrink-0">AF<\/div>/g, '<div id="user-avatar-large" class="w-10 h-10 bg-primary text-white flex items-center justify-center font-serif font-bold text-sm flex-shrink-0">--</div>');
html = html.replace(/<a href="\.\.\/18_profil\/profil-siswa\.html" class="w-9 h-9 bg-primary text-white font-serif font-bold text-sm flex items-center justify-center hover:ring-2 hover:ring-brand-gold\/50 transition-all">AF<\/a>/g, '<a href="../18_profil/profil-siswa.html" id="user-avatar-small" class="w-9 h-9 bg-primary text-white font-serif font-bold text-sm flex items-center justify-center hover:ring-2 hover:ring-brand-gold/50 transition-all">--</a>');

// Add js logic
const jsLogic = `// Update Avatar initials
                    const initials = user.nama.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                    const avatarSmall = document.getElementById('user-avatar-small');
                    const avatarLarge = document.getElementById('user-avatar-large');
                    if (avatarSmall) avatarSmall.textContent = initials;
                    if (avatarLarge) avatarLarge.textContent = initials;`;

html = html.replace(/el\.textContent = user\.nama;\r?\n                \}\);\r?\n            \}/, 'el.textContent = user.nama;\n                });\n                ' + jsLogic + '\n            }');

fs.writeFileSync('13_riwayat-semester/code.html', html);
console.log('Fixed 13');
