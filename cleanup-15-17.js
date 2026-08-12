const fs = require('fs');

// ==== 15_tinjauan-guru ====
let content15 = fs.readFileSync('15_tinjauan-guru/code.html', 'utf8');
const duplicateAuth15 = `    <script>
        window.addEventListener('auth-ready', function(e) {
            const user = e.detail;
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
            }
        });
    </script>
</body></html>`;
const newEnd15 = `</body></html>`;
content15 = content15.replace(duplicateAuth15, newEnd15);
fs.writeFileSync('15_tinjauan-guru/code.html', content15);


// ==== 17_notifikasi ====
let content17 = fs.readFileSync('17_notifikasi/code.html', 'utf8');
const duplicateAuth17 = `    <script>
        window.addEventListener('auth-ready', function(e) {
            const user = e.detail;
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
            }
        });
    </script>
</body></html>`;
const newEnd17 = `</body></html>`;
content17 = content17.replace(duplicateAuth17, newEnd17);
fs.writeFileSync('17_notifikasi/code.html', content17);

console.log('15 and 17 cleanup complete.');
