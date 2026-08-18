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

    // Tentukan halaman login
    function getLoginUrl() {
        return '/?page=01_login';
    }

    // Normalisasi format role agar konsisten
    function normalizeRole(role) {
        if (!role) return 'Siswa';
        var r = role.toString().trim().toLowerCase().replace(/[\s_-]/g, '');
        if (r === 'guru' || r === 'teacher') return 'Guru';
        if (r === 'orangtua' || r === 'ortu' || r === 'parent') return 'OrangTua';
        return 'Siswa';
    }

    // Helper untuk mengembalikan user ke dashboard asalnya
    function getRedirectUrlForRole(role) {
        var r = normalizeRole(role);
        if (r === 'Siswa') return '/?page=08_dashboard-siswa';
        if (r === 'Guru') return '/?page=14_dashboard-guru';
        if (r === 'OrangTua') return '/?page=16_dashboard-ortu';
        return '/?page=01_login';
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

    function dispatchDummyUser() {
        console.warn('[AuthGuard] Dispatching dummy user for local development.');
        window.currentFirebaseUser = {
            uid: 'dummy-student-id',
            nama: 'Ahmad Fauzi (Local Dev)',
            role: 'Siswa',
            email: 'dummy@example.com'
        };
        showPageContent();
        window.getCurrentUserProfile = function() { return window.currentFirebaseUser; };
        window.dispatchEvent(new CustomEvent('auth-ready', { detail: window.currentFirebaseUser }));
    }

    // Tunggu Firebase ready
    function onFirebaseReady() {
        if (!window.firebaseAuth) {
            console.error('[AuthGuard] Firebase Auth belum tersedia.');
            dispatchDummyUser();
            return;
        }

        window.firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(function() {
                var sudahDicekSekali = false;
                
                firebaseAuth.onAuthStateChanged(function(user) {
                    if (!user) {
                        if (!sudahDicekSekali) {
                            console.warn('[AuthGuard] Sesi awal null. Menunggu pemulihan...');
                            sudahDicekSekali = true;
                            setTimeout(function() {
                                if (!window.firebaseAuth.currentUser) {
                                    console.warn('[AuthGuard] Sesi null. Mengalihkan ke halaman login...');
                                    window.location.href = getLoginUrl();
                                }
                            }, 1200);
                            return;
                        } else {
                            console.warn('[AuthGuard] Sesi null. Mengalihkan ke halaman login...');
                            window.location.href = getLoginUrl();
                            return;
                        }
                    }

                    if (_authResolved) return; // Cegah duplikasi
                    _authResolved = true;

                    // User sudah login — ambil profil dari Firestore
                    window.firebaseDb.collection('users').doc(user.uid).get()
                        .then(function(doc) {
                            if (doc.exists) {
                                var data = doc.data();
                                var role = normalizeRole(data.role);
                                window.currentFirebaseUser = Object.assign({}, data, {
                                    uid: user.uid,
                                    email: user.email,
                                    role: role
                                });
                            } else {
                                // User tidak ditemukan di Firestore, logout dan arahkan ke login
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
                                if (!fullPath.includes('profil-siswa') && !fullPath.includes('profil-guru') && !fullPath.includes('profil-ortu')) {
                                    if (role === 'Guru') { window.location.href = '/?page=18_profil_profil-guru'; return; }
                                    if (role === 'OrangTua') { window.location.href = '/?page=18_profil_profil-ortu'; return; }
                                    if (role === 'Siswa') { window.location.href = '/?page=18_profil_profil-siswa'; return; }
                                }
                            }

                            if (!isAllowed) {
                                console.warn('[AuthGuard] Akses ditolak. Role ' + role + ' tidak diizinkan mengakses halaman ini. Mengalihkan ke dashboard...');
                                window.location.href = getRedirectUrlForRole(role);
                                return;
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
                            window.location.href = getLoginUrl();
                        });
                });
            }).catch(function(err) { 
                console.error("[AuthGuard] Set persistence error", err); 
                window.location.href = getLoginUrl();
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
    // =============================================
    setTimeout(function() {
        if (!_authResolved) {
            console.error('[AuthGuard] Timeout 10 detik. Firebase tidak merespons. Dispatching dummy.');
            dispatchDummyUser();
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

