/**
 * Flexa Cendekia — Firebase Auth Guard v2.2 (Clean State & Strict Protection)
 * 
 * FITUR UTAMA:
 * 1. Fast Hydration: Membaca cache LocalStorage seketika untuk rendering instan tanpa flicker/bounce.
 * 2. Asynchronous Session Verification: Memverifikasi token Firebase secara paralel.
 * 3. Graceful Recovery: Memberikan waktu 3.5 detik bagi Firebase untuk memulihkan sesi IndexedDB.
 * 4. Token Auto-Refresh: Memperbarui token autentikasi tiap 30 menit agar sesi tidak kedaluwarsa.
 * 5. Strict Role Protection: Mengarahkan Siswa (SD/SMP/SMA), Guru, dan Orang Tua ke portal masing-masing.
 * 6. Clean Reset Engine: Menyediakan fungsi global window.flexaResetAllData() untuk mereset seluruh data simulasi ke titik 0.
 */

(function() {
    'use strict';

    var _authResolved = false;
    var AUTH_TIMEOUT = 9000;
    var RECOVERY_WAIT = 3500;

    function getLoginUrl() {
        return '/?page=01_login';
    }

    function normalizeRole(role) {
        if (!role) return 'Siswa';
        var r = role.toString().trim().toLowerCase().replace(/[\s_-]/g, '');
        if (r === 'guru' || r === 'teacher') return 'Guru';
        if (r === 'orangtua' || r === 'ortu' || r === 'parent') return 'OrangTua';
        return 'Siswa';
    }

    function getRedirectUrlForRole(role) {
        var r = normalizeRole(role);
        if (r === 'Siswa') return '/?page=08_dashboard-siswa';
        if (r === 'Guru') return '/?page=14_dashboard-guru';
        if (r === 'OrangTua') return '/?page=16_dashboard-ortu';
        return '/?page=01_login';
    }

    function showPageContent() {
        if (document.body) {
            document.body.classList.remove("belum-terverifikasi");
        }
        var loader = document.getElementById("loading-screen-auth");
        if (loader) loader.remove();
    }

    function safeRedirectToLogin() {
        if (window.location.search.indexOf('01_login') !== -1) return;
        console.warn('[AuthGuard] Sesi kosong / tidak valid. Mengalihkan ke halaman login...');
        window.location.replace(getLoginUrl());
    }

    function checkRoleAccess(role) {
        var fullPath = (window.location.pathname + window.location.search).toLowerCase();
        var isAllowed = true;

        if (fullPath.indexOf('14_') !== -1 || fullPath.indexOf('15_') !== -1) {
            if (role !== 'Guru') isAllowed = false;
        } else if (fullPath.indexOf('16_') !== -1) {
            if (role !== 'OrangTua') isAllowed = false;
        } else if (
            fullPath.indexOf('02_') !== -1 || fullPath.indexOf('03_') !== -1 || fullPath.indexOf('04_') !== -1 ||
            fullPath.indexOf('05_') !== -1 || fullPath.indexOf('06_') !== -1 || fullPath.indexOf('07_') !== -1 ||
            fullPath.indexOf('08_') !== -1 || fullPath.indexOf('09_') !== -1 || fullPath.indexOf('10_') !== -1 ||
            fullPath.indexOf('11_') !== -1 || fullPath.indexOf('12_') !== -1 || fullPath.indexOf('13_') !== -1
        ) {
            if (role !== 'Siswa') isAllowed = false;
        } else if (fullPath.indexOf('18_profil') !== -1) {
            if (fullPath.indexOf('profil-siswa') !== -1 && role !== 'Siswa') isAllowed = false;
            if (fullPath.indexOf('profil-guru') !== -1 && role !== 'Guru') isAllowed = false;
            if (fullPath.indexOf('profil-ortu') !== -1 && role !== 'OrangTua') isAllowed = false;
            if (fullPath.indexOf('profil-siswa') === -1 && fullPath.indexOf('profil-guru') === -1 && fullPath.indexOf('profil-ortu') === -1) {
                if (role === 'Guru') { window.location.href = '/?page=18_profil_profil-guru'; return false; }
                if (role === 'OrangTua') { window.location.href = '/?page=18_profil_profil-ortu'; return false; }
                if (role === 'Siswa') { window.location.href = '/?page=18_profil_profil-siswa'; return false; }
            }
        }

        return isAllowed;
    }

    // =============================================
    // 1. FAST HYDRATION FROM LOCAL STORAGE CACHE
    // =============================================
    var cachedUser = null;
    try {
        var rawCache = localStorage.getItem('currentUser');
        if (rawCache) {
            cachedUser = JSON.parse(rawCache);
            if (cachedUser && cachedUser.uid) {
                window.currentFirebaseUser = cachedUser;
                showPageContent();
                window.getCurrentUserProfile = function() { return window.currentFirebaseUser; };
                window.dispatchEvent(new CustomEvent('auth-ready', { detail: window.currentFirebaseUser }));
            }
        }
    } catch(e) {}

    // =============================================
    // 2. PARALLEL SECURE AUTH VERIFICATION
    // =============================================
    function onFirebaseReady() {
        if (!window.firebaseAuth) {
            if (!cachedUser) {
                safeRedirectToLogin();
            }
            return;
        }

        window.firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
            .then(function() {
                var authCheckPromise = new Promise(function(resolve) {
                    var unsubscribe = firebaseAuth.onAuthStateChanged(function(user) {
                        if (user) {
                            unsubscribe();
                            resolve(user);
                        }
                    });

                    setTimeout(function() {
                        var currentUser = window.firebaseAuth.currentUser;
                        if (currentUser) {
                            resolve(currentUser);
                        } else {
                            resolve(null);
                        }
                    }, RECOVERY_WAIT);
                });

                authCheckPromise.then(function(user) {
                    if (_authResolved) return;
                    _authResolved = true;

                    if (!user) {
                        // Jika tidak ada sesi auth aktif dan cache kosong -> arahkan ke login
                        if (!cachedUser) {
                            safeRedirectToLogin();
                        }
                        return;
                    }

                    // Ambil profil terbaru dari Firestore
                    window.firebaseDb.collection('users').doc(user.uid).get()
                        .then(function(doc) {
                            var data = doc.exists ? doc.data() : (cachedUser || {});
                            var role = normalizeRole(data.role || (cachedUser ? cachedUser.role : 'Siswa'));
                            
                            window.currentFirebaseUser = Object.assign({}, cachedUser || {}, data, {
                                uid: user.uid,
                                email: user.email,
                                role: role
                            });

                            try {
                                localStorage.setItem('currentUser', JSON.stringify(window.currentFirebaseUser));
                            } catch(e) {}

                            var allowed = checkRoleAccess(role);
                            if (!allowed) {
                                window.location.href = getRedirectUrlForRole(role);
                                return;
                            }

                            showPageContent();
                            window.getCurrentUserProfile = function() { return window.currentFirebaseUser; };
                            window.dispatchEvent(new CustomEvent('auth-ready', { detail: window.currentFirebaseUser }));

                            // Token Refresh Timer (30 Menit)
                            setInterval(function() {
                                var u = window.firebaseAuth.currentUser;
                                if (u) {
                                    u.getIdToken(true).catch(function() {});
                                }
                            }, 30 * 60 * 1000);
                        })
                        .catch(function(err) {
                            console.warn('[AuthGuard] Firestore sync warning:', err);
                            showPageContent();
                        });
                });
            })
            .catch(function() {
                if (!cachedUser) {
                    safeRedirectToLogin();
                } else {
                    showPageContent();
                }
            });
    }

    if (window.firebaseAuth) {
        onFirebaseReady();
    } else {
        window.addEventListener('firebase-ready', onFirebaseReady);
    }

    setTimeout(function() {
        if (!_authResolved) {
            _authResolved = true;
            if (!cachedUser && !window.firebaseAuth?.currentUser) {
                safeRedirectToLogin();
            } else {
                showPageContent();
            }
        }
    }, AUTH_TIMEOUT);

    // =============================================
    // 3. GLOBAL LOGOUT & COMPLETE RESET UTILITIES
    // =============================================
    window.flexaLogout = function() {
        try {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('selectedCareer');
        } catch(e) {}
        
        if (window.firebaseAuth) {
            firebaseAuth.signOut().then(function() {
                window.location.replace(getLoginUrl());
            }).catch(function() {
                window.location.replace(getLoginUrl());
            });
        } else {
            window.location.replace(getLoginUrl());
        }
    };

    window.flexaResetAllData = async function() {
        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch(e) {}

        const user = window.firebaseAuth ? window.firebaseAuth.currentUser : null;
        const db = window.firebaseDb;

        if (user && db) {
            const uid = user.uid;
            try {
                const collections = [
                    'users',
                    'hasilDiagnostik',
                    'roadmapBelajar',
                    'progresMingguan',
                    'kehadiran',
                    'krs',
                    'catatan',
                    'notifikasi',
                    'targetHarian'
                ];
                await Promise.race([
                    Promise.all(collections.map(col => db.collection(col).doc(uid).delete().catch(() => {}))),
                    new Promise(resolve => setTimeout(resolve, 2000))
                ]);
            } catch(dbErr) {}

            try {
                await user.delete();
            } catch(authErr) {
                try {
                    await window.firebaseAuth.signOut();
                } catch(signErr) {}
            }
        } else if (window.firebaseAuth) {
            try {
                await window.firebaseAuth.signOut();
            } catch(signErr) {}
        }

        window.location.replace('/?page=01_login&reset=true');
    };
})();
