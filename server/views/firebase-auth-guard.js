/**
 * Flexa Cendekia — Firebase Auth Guard
 * 
 * Include di SEMUA halaman dashboard (02–18).
 * Fungsi:
 * 1. Cek apakah user sudah login. Jika belum → redirect ke login.
 * 2. Ambil profil user dari Firestore (role, nama, dsb).
 * 3. Simpan ke window.currentFirebaseUser untuk dipakai script lain.
 * 4. Menyediakan fungsi global flexaLogout().
 * 5. Timeout fallback (10 detik) → jika Firebase tidak merespons, redirect ke login.
 */

(function() {
    var _authResolved = false;

    // Tentukan halaman login berdasarkan konteks (lokal vs server)
    function getLoginUrl() {
        if (window.location.pathname.includes('server') || window.location.search.includes('page=')) {
            return '/?page=01_login';
        }
        return '../01_login/code.html';
    }

    // Helper untuk mengembalikan user ke dashboard asalnya
    function getRedirectUrlForRole(role) {
        if (window.location.pathname.includes('server') || window.location.search.includes('page=')) {
            if (role === 'Siswa') return '/?page=08_dashboard-siswa';
            if (role === 'Guru') return '/?page=14_dashboard-guru';
            if (role === 'OrangTua') return '/?page=16_dashboard-ortu';
            return '/?page=01_login';
        }
        if (role === 'Siswa') return '../08_dashboard-siswa/code.html';
        if (role === 'Guru') return '../14_dashboard-guru/code.html';
        if (role === 'OrangTua') return '../16_dashboard-ortu/code.html';
        return '../01_login/code.html';
    }

    // Hapus loading screen dan tampilkan konten halaman
    function showPageContent() {
        if (document.body) {
            document.body.classList.remove("belum-terverifikasi");
        }
        var loader = document.getElementById("loading-screen-auth");
        if (loader) {
            loader.remove();
        }
    }

    // Tunggu Firebase ready
    function onFirebaseReady() {
        if (!window.firebaseAuth) {
            console.error('[AuthGuard] Firebase Auth belum tersedia.');
            window.location.href = getLoginUrl(); // Fail closed
            return;
        }

        firebaseAuth.onAuthStateChanged(function(user) {
            if (_authResolved) return; // Cegah duplikasi
            _authResolved = true;

            if (!user) {
                // Belum login → redirect ke login
                console.warn('[AuthGuard] Pengguna belum login. Redirect ke halaman login.');
                window.location.href = getLoginUrl();
                return;
            }

            // User sudah login — ambil profil dari Firestore
            window.firebaseDb.collection('users').doc(user.uid).get()
                .then(function(doc) {
                    if (doc.exists) {
                        window.currentFirebaseUser = Object.assign({}, doc.data(), {
                            uid: user.uid,
                            email: user.email
                        });
                    } else {
                        // User tidak ditemukan di Firestore, fail closed to login
                        console.error('[AuthGuard] Profil pengguna tidak ditemukan di Firestore.');
                        window.location.href = getLoginUrl();
                        return;
                    }

                    // --- ROLE GUARD LOGIC ---
                    var role = window.currentFirebaseUser.role;
                    var path = window.location.pathname.toLowerCase();
                    var query = window.location.search.toLowerCase();
                    var fullPath = path + query;
                    
                    var isAllowed = true;

                    // Cek berdasarkan path direktori atau parameter page
                    if (fullPath.includes('14_') || fullPath.includes('15_')) {
                        if (role !== 'Guru') isAllowed = false;
                    } else if (fullPath.includes('16_')) {
                        if (role !== 'OrangTua') isAllowed = false;
                    } else if (
                        fullPath.includes('02_') || fullPath.includes('03_') || fullPath.includes('04_') ||
                        fullPath.includes('05_') || fullPath.includes('06_') || fullPath.includes('07_') ||
                        fullPath.includes('08_') || fullPath.includes('09_') || fullPath.includes('10_') ||
                        fullPath.includes('11_') || fullPath.includes('12_') || fullPath.includes('13_')
                    ) {
                        if (role !== 'Siswa') isAllowed = false;
                    } else if (fullPath.includes('18_profil')) {
                        if (fullPath.includes('profil-siswa') && role !== 'Siswa') isAllowed = false;
                        if (fullPath.includes('profil-guru') && role !== 'Guru') isAllowed = false;
                        if (fullPath.includes('profil-ortu') && role !== 'OrangTua') isAllowed = false;
                    }

                    if (!isAllowed) {
                        console.warn('[AuthGuard] Akses ditolak. Role', role, 'tidak diizinkan mengakses halaman ini.');
                        window.location.replace(getRedirectUrlForRole(role));
                        return; // Hentikan eksekusi script ini
                    }
                    
                    // --- END ROLE GUARD ---

                    // LOLOS VALIDASI — tampilkan konten halaman
                    showPageContent();

                    window.getCurrentUserProfile = function() {
                        return window.currentFirebaseUser;
                    };

                    // Dispatch event so page scripts know user is authenticated and allowed
                    window.dispatchEvent(new CustomEvent('auth-ready', {
                        detail: window.currentFirebaseUser
                    }));
                })
                .catch(function(err) {
                    console.error('[AuthGuard] Gagal mengambil profil:', err);
                    // Fail closed
                    window.location.href = getLoginUrl();
                });
        });
    }

    // Listen for firebase-ready event or check if already ready
    if (window.firebaseAuth) {
        onFirebaseReady();
    } else {
        window.addEventListener('firebase-ready', onFirebaseReady);
    }

    // =============================================
    // TIMEOUT FALLBACK (10 detik)
    // Jika Firebase tidak pernah merespons (gagal load, koneksi putus, dll),
    // redirect ke login daripada stuck selamanya di "Memverifikasi Akses..."
    // =============================================
    setTimeout(function() {
        if (!_authResolved) {
            console.error('[AuthGuard] Timeout 10 detik. Firebase tidak merespons. Redirect ke login.');
            window.location.href = getLoginUrl();
        }
    }, 10000);

    // Global logout function
    window.flexaLogout = function() {
        if (window.firebaseAuth) {
            firebaseAuth.signOut().then(function() {
                window.location.href = getLoginUrl();
            }).catch(function(err) {
                console.error('[AuthGuard] Logout gagal:', err);
                alert('Gagal logout. Coba lagi.');
            });
        }
    };
})();

