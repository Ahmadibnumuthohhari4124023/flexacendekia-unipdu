const fs = require('fs');
let lines = fs.readFileSync('08_dashboard-siswa/code.html', 'utf8').split('\n');
// Remove duplicate block
lines.splice(126, 55);
let html = lines.join('\n');
// Add IDs
html = html.replace('<a href="../18_profil/code.html"\r\n                    class="w-9 h-9', '<a href="../18_profil/code.html" id="user-avatar-small"\r\n                    class="w-9 h-9');
html = html.replace('<a href="../18_profil/code.html"\n                    class="w-9 h-9', '<a href="../18_profil/code.html" id="user-avatar-small"\n                    class="w-9 h-9');

html = html.replace('<div\r\n                        class="w-20 h-20 md:w-24 md:h-24', '<div id="user-avatar-large"\r\n                        class="w-20 h-20 md:w-24 md:h-24');
html = html.replace('<div\n                        class="w-20 h-20 md:w-24 md:h-24', '<div id="user-avatar-large"\n                        class="w-20 h-20 md:w-24 md:h-24');

fs.writeFileSync('08_dashboard-siswa/code.html', html);
console.log('Fixed 08');
