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
    // 1. FAST HYDRATION FROM LOCAL STORAGE CACHE (per-UID)
    // =============================================
    var cachedUser = null;
    var _fastHydrationDone = false;
    try {
        // Pertama, coba baca dari key global untuk mendapat UID terakhir
        var rawCache = localStorage.getItem('currentUser');
        if (rawCache) {
            var globalCache = JSON.parse(rawCache);
            if (globalCache && globalCache.uid) {
                // Baca dari cache per-UID yang lebih akurat
                var perUidRaw = localStorage.getItem('flexa_user_' + globalCache.uid);
                if (perUidRaw) {
                    cachedUser = JSON.parse(perUidRaw);
                } else {
                    cachedUser = globalCache;
                }
            }
        }
        if (cachedUser && cachedUser.uid) {
            window.currentFirebaseUser = cachedUser;
            _fastHydrationDone = true;
            showPageContent();
            window.getCurrentUserProfile = function() { return window.currentFirebaseUser; };
            window.dispatchEvent(new CustomEvent('auth-ready', { detail: window.currentFirebaseUser }));
            
            document.addEventListener('DOMContentLoaded', function() {
                if (window.currentFirebaseUser) {
                    window.dispatchEvent(new CustomEvent('auth-ready', { detail: window.currentFirebaseUser }));
                }
            });
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

                    // Baca cache per-UID untuk user yang benar-benar aktif di Firebase Auth
                    var uidCache = null;
                    try {
                        var uidRaw = localStorage.getItem('flexa_user_' + user.uid);
                        if (uidRaw) uidCache = JSON.parse(uidRaw);
                    } catch(e) {}

                    // Ambil profil terbaru dari Firestore
                    window.firebaseDb.collection('users').doc(user.uid).get()
                        .then(function(doc) {
                            // Prioritas: Firestore > cache per-UID > cache global
                            var data = doc.exists ? doc.data() : (uidCache || cachedUser || {});
                            var baseCache = uidCache || cachedUser || {};
                            var role = normalizeRole(data.role || baseCache.role || 'Siswa');
                            
                            window.currentFirebaseUser = Object.assign({}, baseCache, data, {
                                uid: user.uid,
                                email: user.email,
                                role: role
                            });

                            try {
                                var userJson = JSON.stringify(window.currentFirebaseUser);
                                // Simpan ke cache per-UID (isolasi per akun)
                                localStorage.setItem('flexa_user_' + user.uid, userJson);
                                // Simpan juga ke key global (backward-compat)
                                localStorage.setItem('currentUser', userJson);
                            } catch(e) {}

                            var allowed = checkRoleAccess(role);
                            if (!allowed) {
                                window.location.href = getRedirectUrlForRole(role);
                                return;
                            }

                            showPageContent();
                            window.getCurrentUserProfile = function() { return window.currentFirebaseUser; };
                            // Dispatch ulang auth-ready dengan data yang sudah terverifikasi
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
    // 3. GLOBAL PROFILE & AVATAR DOM SYNCHRONIZER
    // =============================================
    window.flexaSyncProfileElements = function(user) {
        var defaultName = user.role === 'Guru' ? 'Tutor & Pendidik' : (user.role === 'OrangTua' ? 'Wali Siswa' : 'Siswa Flexa');
        var nama = user.nama || (user.email ? user.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : defaultName);
        var initials = nama.split(' ').filter(Boolean).map(function(n){ return n[0]; }).slice(0, 2).join('').toUpperCase() || 'FC';
        var fotoUrl = user.fotoUrl || user.avatar || localStorage.getItem('userAvatar') || '';
        var jenjang = (user.jenjang || localStorage.getItem('userJenjang') || 'SMA').toUpperCase();
        var kelas = user.kelas || localStorage.getItem('userKelas') || (jenjang === 'SD' ? '1' : (jenjang === 'SMP' ? '7' : '10'));
        var career = user.citaCita || localStorage.getItem('selectedCareer') || 'Arsitek';

        // Update all text names
        var nameSelectors = [
            '#user-display-name', '#display-student-name', '#sidebar-student-name', 
            '#top-user-name', '#menu-user-name', '#hero-nama', '.user-display-name', 
            '.user-nama', '#profile-user-name', '#navbar-user-name'
        ];
        nameSelectors.forEach(function(sel) {
            document.querySelectorAll(sel).forEach(function(el) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    if (!el.value) el.value = nama;
                } else if (sel === '#top-user-name') {
                    el.textContent = nama.split(' ')[0];
                } else {
                    el.textContent = nama;
                }
            });
        });

        // Update all avatars (Hero, Topbar, Sidebar, Dropdown)
        var avatarIds = [
            'top-user-avatar', 'hero-user-avatar', 'user-avatar-large', 
            'user-avatar-small', 'user-initials', 'top-avatar', 'sidebar-avatar',
            'navbar-avatar'
        ];
        avatarIds.forEach(function(id) {
            var el = document.getElementById(id);
            if (el) {
                if (fotoUrl) {
                    el.innerHTML = '<img src="' + fotoUrl + '" alt="' + nama + '" class="w-full h-full object-cover rounded-full" onerror="this.parentElement.textContent=\'' + initials + '\'" />';
                    el.classList.add('overflow-hidden');
                } else {
                    el.textContent = initials;
                }
            }
        });

        // Update hero photo image if present
        var heroFoto = document.getElementById('hero-foto');
        if (heroFoto && fotoUrl) {
            heroFoto.src = fotoUrl;
        }

        // Update level and career text
        document.querySelectorAll('#user-jenjang, .user-jenjang-kelas, #hero-jenjang-kelas, #krs-jenjang-kelas').forEach(function(el) {
            el.textContent = jenjang + ' — Kelas ' + kelas;
        });

        document.querySelectorAll('#user-citacita, .user-cita-cita, #hero-cita-cita, #krs-cita-cita').forEach(function(el) {
            el.textContent = career;
        });
    };

    // Auto-sync on DOMContentLoaded & auth-ready
    document.addEventListener('DOMContentLoaded', function() {
        try {
            var u = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (u && (u.nama || u.email || localStorage.getItem('userNama'))) {
                window.flexaSyncProfileElements(u);
            }
        } catch(e) {}
    });

    window.addEventListener('auth-ready', function(e) {
        if (e.detail) {
            window.flexaSyncProfileElements(e.detail);
        }
    });

    // =============================================
    // 4. GLOBAL LOGOUT & COMPLETE RESET UTILITIES
    // =============================================
    window.flexaLogout = function() {
        try {
            // Hapus cache per-UID untuk user aktif
            var cu = window.currentFirebaseUser || {};
            if (cu.uid) {
                localStorage.removeItem('flexa_user_' + cu.uid);
            }
            localStorage.removeItem('currentUser');
            localStorage.removeItem('selectedCareer');
            localStorage.removeItem('userAvatar');
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
            // 1. Bersihkan seluruh penyimpanan lokal (termasuk semua flexa_user_* keys)
            localStorage.clear();
            sessionStorage.clear();
        } catch(e) {
            console.warn('[Reset] Local storage clear error:', e);
        }

        const user = window.firebaseAuth ? window.firebaseAuth.currentUser : null;
        const db = window.firebaseDb;

        // 2. Jika ada user aktif dan firestore, bersihkan dokumen user dari database
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
                
                // Jalankan penghapusan paralel dengan timeout protection
                await Promise.race([
                    Promise.all(collections.map(col => db.collection(col).doc(uid).delete().catch(() => {}))),
                    new Promise(resolve => setTimeout(resolve, 2000))
                ]);
            } catch(dbErr) {
                console.warn('[Reset] Firestore cleanup error:', dbErr);
            }

            // 3. Coba hapus akun dari Firebase Auth
            try {
                await user.delete();
            } catch(authErr) {
                console.warn('[Reset] User delete error (falling back to signOut):', authErr);
                try {
                    await window.firebaseAuth.signOut();
                } catch(signErr) {}
            }
        } else if (window.firebaseAuth) {
            try {
                await window.firebaseAuth.signOut();
            } catch(signErr) {}
        }

    // =============================================
    // 5. SMART DIAGNOSIS STATUS & SIDEBAR ROUTING
    // =============================================
    window.flexaHasCompletedDiagnosis = function() {
        var u = window.currentFirebaseUser;
        if (!u) {
            try {
                u = JSON.parse(localStorage.getItem('currentUser') || '{}');
            } catch(e) { u = {}; }
        }
        if (u.sudahTesDiagnostik || u.hasilDiagnostik || u.citaCita || u.roadmapBelajar) {
            return true;
        }
        if (localStorage.getItem('hasCompletedDiagnosis') === 'true' || localStorage.getItem('aiDiagnosisResult') || localStorage.getItem('selectedCareer')) {
            return true;
        }
        if (u.uid && localStorage.getItem('flexa_diagnosis_' + u.uid)) {
            return true;
        }
        return false;
    };

    window.flexaGetDiagnosisUrl = function() {
        return window.flexaHasCompletedDiagnosis() ? '/?page=04_hasil-diagnosis' : '/?page=02_intro-diagnosis';
    };

    // Auto-update all sidebar and link hrefs pointing to 02_intro-diagnosis
    window.flexaSyncDiagnosisLinks = function() {
        if (!window.flexaHasCompletedDiagnosis()) return;
        document.querySelectorAll('a[href*="02_intro-diagnosis"]').forEach(function(link) {
            link.href = '/?page=04_hasil-diagnosis';
            var spans = link.querySelectorAll('span');
            spans.forEach(function(sp) {
                if (!sp.classList.contains('material-symbols-outlined') && sp.textContent.trim().toLowerCase().includes('tes diagnostik')) {
                    sp.textContent = 'Hasil Diagnostik';
                }
            });
        });
    };

    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(window.flexaSyncDiagnosisLinks, 100);
    });
    window.addEventListener('auth-ready', function() {
        setTimeout(window.flexaSyncDiagnosisLinks, 100);
    });
})();
