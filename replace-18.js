const fs = require('fs');
let content = fs.readFileSync('18_profil/profil-siswa.html', 'utf8');

const oldJs = `window.onload = function(){

    let namaTersimpan = localStorage.getItem("namaProfil");

if(namaTersimpan){

    document.getElementById("profileName").textContent = namaTersimpan
    }
}
let fotoTersimpan = localStorage.getItem("fotoProfil");

if(fotoTersimpan){

    document.getElementById("fotoProfil").src = fotoTersimpan;
    document.getElementById("fotoNavbar").src = fotoTersimpan;

}

window.onload = function(){

    let nama = localStorage.getItem("namaProfil");
    let nisn = localStorage.getItem("nisn");
    let institusi = localStorage.getItem("institusi");
    let email = localStorage.getItem("email");


    if(nama){
        document.getElementById("profileName").textContent = nama;
    }

    if(nisn){
        document.getElementById("nisn").value = nisn;
    }

    if(institusi){
        document.getElementById("institution").value = institusi;
    }

    if(email){
        document.getElementById("email").value = email;
    }

}
    </script>

    <script>
        window.addEventListener('auth-ready', function(e) {
            const user = e.detail;
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
            }
        });
    </script>`;

const newJs = `    </script>

    <script>
        window.addEventListener('auth-ready', function(e) {
            const user = e.detail;
            
            // Set navbar generic display names
            if (user && user.nama) {
                document.querySelectorAll('.user-display-name').forEach(el => {
                    el.textContent = user.nama;
                });
                
                // Form fields and profile names
                document.getElementById('profileName').textContent = user.nama;
                document.getElementById('fullName').value = user.nama;
                document.getElementById('nisn').value = user.nisn || '';
                document.getElementById('institution').value = user.sekolah || 'SMA Flexa Cendekia';
                document.getElementById('email').value = user.email || '';
                
                // Update avatar if any
                if (user.avatar) {
                    // Update avatar visually if there's a simple way, e.g. text or image source
                    // (Currently no clear img src mapping from Firestore to avatar logic other than initials)
                }
                
                // Bind the save button
                const btnUpdate = document.getElementById('btnUpdate');
                if (btnUpdate) {
                    btnUpdate.onclick = async function() {
                        try {
                            btnUpdate.textContent = 'Menyimpan...';
                            await window.firebaseDb.collection('users').doc(user.uid).update({
                                nama: document.getElementById('fullName').value,
                                sekolah: document.getElementById('institution').value,
                                email: document.getElementById('email').value
                            });
                            alert('Profil berhasil diperbarui!');
                        } catch(e) {
                            console.error(e);
                            alert('Gagal memperbarui profil');
                        } finally {
                            btnUpdate.textContent = 'Simpan Perubahan';
                        }
                    };
                }
            }
        });
    </script>`;

content = content.replace(oldJs, newJs);

fs.writeFileSync('18_profil/profil-siswa.html', content);
console.log('18_profil Replacement complete.');
