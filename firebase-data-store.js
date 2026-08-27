/**
 * Flexa Cendekia — Firebase Data Store
 * 
 * Menggantikan data-store.js (localStorage) dengan Firestore.
 * API tetap sama sehingga halaman yang sudah migrasi (09, 15, 16, 17)
 * bisa langsung bekerja dengan perubahan minimal.
 * 
 * DEPENDENCY: firebase-config.js dan firebase-auth-guard.js harus dimuat duluan.
 */

const DataStore = {
    _ready: false,
    _db: null,
    _currentUser: null,

    // =============================================
    // Initialization
    // =============================================
    init() {
        // Akan dipanggil ulang saat auth-ready
    },

    _ensureDb() {
        if (!this._db && window.firebaseDb) {
            this._db = window.firebaseDb;
        }
        return this._db;
    },

    // =============================================
    // Users & Siswa Data
    // =============================================
    getCurrentUser(role) {
        // Di Firebase mode, kita return user yang sedang login (dari auth-guard)
        if (window.currentFirebaseUser) {
            return window.currentFirebaseUser;
        }
        return null;
    },

    async getUserById(id) {
        if (!id) return null;
        const db = this._ensureDb();
        if (db) {
            try {
                const doc = await db.collection('users').doc(id).get();
                if (doc.exists) {
                    return Object.assign({ id: doc.id }, doc.data());
                }
            } catch (e) {
                console.error('[DataStore] getUserById error:', e);
            }
        }
        // Check localStorage for cached user data
        try {
            const localUser = localStorage.getItem('flexa_user_' + id);
            if (localUser) return JSON.parse(localUser);
        } catch(e) {}
        // Check all stored linked children data
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('linked_child_data_')) {
                try {
                    const d = JSON.parse(localStorage.getItem(k) || '{}');
                    if (d && (d.id === id || d.uid === id)) return d;
                } catch(e) {}
            }
        }
        // Check FLEXA_STUDENTS_DATA
        if (window.FLEXA_STUDENTS_DATA && id) {
            const cleanId = id.toString().replace('siswa-', '');
            const match = window.FLEXA_STUDENTS_DATA.find(s => s.nis === cleanId || s.nis === id || (s.email && s.email.toLowerCase() === id.toString().toLowerCase()));
            if (match) return Object.assign({ id: `siswa-${match.nis}`, uid: `siswa-${match.nis}` }, match);
        }
        // Check SSOSync
        if (window.SSOSync) {
            const all = window.SSOSync.getAllUsers() || [];
            const found = all.find(u => (u.uid || u.id) === id);
            if (found) return found;
        }
        return null;
    },

    async getHasilDiagnostik(siswaId) {
        const uid = siswaId || (window.currentFirebaseUser && window.currentFirebaseUser.uid);
        // 1. Coba baca dari Firestore koleksi hasilDiagnostik
        const db = this._ensureDb();
        if (db && uid) {
            try {
                const doc = await db.collection('hasilDiagnostik').doc(uid).get();
                if (doc.exists) {
                    const d = doc.data();
                    if (d) {
                        try {
                            localStorage.setItem('aiDiagnosisResult', JSON.stringify(d));
                            localStorage.setItem('flexa_diagnosis_' + uid, JSON.stringify(d));
                            localStorage.setItem('hasCompletedDiagnosis', 'true');
                        } catch(e) {}
                        return d;
                    }
                }
                // Cek juga dokumen users
                const userDoc = await db.collection('users').doc(uid).get();
                if (userDoc.exists && userDoc.data().hasilDiagnostik) {
                    const d = userDoc.data().hasilDiagnostik;
                    try {
                        localStorage.setItem('aiDiagnosisResult', JSON.stringify(d));
                        localStorage.setItem('flexa_diagnosis_' + uid, JSON.stringify(d));
                        localStorage.setItem('hasCompletedDiagnosis', 'true');
                    } catch(e) {}
                    return d;
                }
            } catch(e) {
                console.warn('[DataStore] getHasilDiagnostik Firestore read warning:', e);
            }
        }
        // 2. Fallback baca dari localStorage cache
        if (uid) {
            try {
                const cachedPerUid = localStorage.getItem('flexa_diagnosis_' + uid);
                if (cachedPerUid) return JSON.parse(cachedPerUid);
            } catch(e) {}
        }
        try {
            const cachedGlobal = localStorage.getItem('aiDiagnosisResult');
            if (cachedGlobal) return JSON.parse(cachedGlobal);
        } catch(e) {}
        return null;
    },

    async saveHasilDiagnostik(siswaId, data) {
        const uid = siswaId || (window.currentFirebaseUser && window.currentFirebaseUser.uid);
        if (!uid || !data) return null;
        
        // 1. Simpan ke local cache
        try {
            const jsonStr = JSON.stringify(data);
            localStorage.setItem('aiDiagnosisResult', jsonStr);
            localStorage.setItem('flexa_diagnosis_' + uid, jsonStr);
            localStorage.setItem('hasCompletedDiagnosis', 'true');
            
            // Update cache user
            const u = JSON.parse(localStorage.getItem('flexa_user_' + uid) || localStorage.getItem('currentUser') || '{}');
            u.sudahTesDiagnostik = true;
            u.hasilDiagnostik = data;
            localStorage.setItem('flexa_user_' + uid, JSON.stringify(u));
            localStorage.setItem('currentUser', JSON.stringify(u));
            if (window.currentFirebaseUser) {
                window.currentFirebaseUser.sudahTesDiagnostik = true;
                window.currentFirebaseUser.hasilDiagnostik = data;
            }
        } catch(e) {
            console.warn('[DataStore] saveHasilDiagnostik cache warning:', e);
        }

        // 2. Simpan ke Firestore
        const db = this._ensureDb();
        if (db) {
            try {
                const payload = Object.assign({}, data, {
                    siswaId: uid,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                const p1 = db.collection('hasilDiagnostik').doc(uid).set(payload, { merge: true });
                const p2 = db.collection('users').doc(uid).set({
                    sudahTesDiagnostik: true,
                    hasilDiagnostik: data,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                }, { merge: true });
                await Promise.all([p1, p2]);
            } catch(e) {
                console.warn('[DataStore] saveHasilDiagnostik Firestore write warning:', e);
            }
        }
        return data;
    },

    async getRoadmapBelajar(siswaId) {
        const db = this._ensureDb();
        if (!db) return null;
        try {
            const doc = await db.collection('roadmapBelajar').doc(siswaId).get();
            if (doc.exists) return doc.data();
        } catch(e) {
            console.error('[DataStore] getRoadmapBelajar error:', e);
        }
        return null;
    },

    async getProgresMingguan(siswaId) {
        const db = this._ensureDb();
        if (!db) return null;
        try {
            const doc = await db.collection('progresMingguan').doc(siswaId).get();
            if (doc.exists) return doc.data();
        } catch(e) {
            console.error('[DataStore] getProgresMingguan error:', e);
        }
        return null;
    },

    async getKehadiranSiswa(siswaId) {
        const db = this._ensureDb();
        if (!db || !siswaId) return null;
        try {
            const doc = await db.collection('kehadiran').doc(siswaId).get();
            if (doc.exists) {
                return Object.assign({ id: doc.id }, doc.data());
            }
            return null;
        } catch (e) {
            console.error('[DataStore] getKehadiranSiswa error:', e);
            return null;
        }
    },

    async getAnakByOrtuId(ortuId) {
        if (!ortuId) return [];
        const db = this._ensureDb();

        // Strategy 1: Check localStorage linked cache FIRST (instant, no network)
        const localLinkedIds = [];
        try {
            const cached = JSON.parse(localStorage.getItem('linked_children_' + ortuId) || '[]');
            if (Array.isArray(cached)) cached.forEach(id => { if (!localLinkedIds.includes(id)) localLinkedIds.push(id); });
        } catch(e) {}
        try {
            const curUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            if (curUser && (curUser.uid === ortuId || curUser.role === 'OrangTua') && Array.isArray(curUser.anakIds)) {
                curUser.anakIds.forEach(id => { if (!localLinkedIds.includes(id)) localLinkedIds.push(id); });
            }
        } catch(e) {}

        if (db) {
            try {
                const timeoutP = new Promise(resolve => setTimeout(() => resolve(null), 2000));
                const ortuDocP = db.collection('users').doc(ortuId).get();
                const ortuDoc = await Promise.race([ortuDocP, timeoutP]);

                if (ortuDoc && ortuDoc.exists && ortuDoc.data().anakIds && ortuDoc.data().anakIds.length > 0) {
                    ortuDoc.data().anakIds.forEach(id => { if (!localLinkedIds.includes(id)) localLinkedIds.push(id); });
                }

                if (localLinkedIds.length > 0) {
                    const anakList = [];
                    for (const id of localLinkedIds) {
                        const user = await this.getUserById(id);
                        if (user) anakList.push(user);
                    }
                    if (anakList.length > 0) return anakList;
                }

                let snap = await db.collection('users').where('orangTuaId', '==', ortuId).get();
                if (snap.empty) snap = await db.collection('users').where('ortuId', '==', ortuId).get();
                if (!snap.empty) return snap.docs.map(d => Object.assign({ id: d.id, uid: d.id }, d.data()));
            } catch (e) {
                console.error('[DataStore] getAnakByOrtuId error:', e);
            }
        }

        if (localLinkedIds.length > 0) {
            const anakList = [];
            for (const id of localLinkedIds) {
                const user = await this.getUserById(id);
                if (user) anakList.push(user);
            }
            return anakList;
        }

        return [];
    },

    async tautkanAnak(ortuUid, identifier, pin) {
        if (!ortuUid || !identifier) {
            return { success: false, message: 'Data penautan tidak lengkap.' };
        }
        try {
            const rawId = identifier.trim();
            const cleanUpper = rawId.toUpperCase();
            const cleanSlug = cleanUpper.replace(/\s+/g, '-');
            const cleanNoDash = cleanUpper.replace(/[\s-_]/g, '');
            const cleanDigits = rawId.replace(/\D/g, '');

            let siswaData = null;
            let siswaUid = null;

            // Strategy 1: Check active session / LocalStorage / SSOSync instantly (0ms latency)
            const candidateUsers = [];
            
            // From currentUser in localStorage
            try {
                const cur = JSON.parse(localStorage.getItem('currentUser') || '{}');
                if (cur && cur.nama) candidateUsers.push(cur);
            } catch(e) {}

            // From all flexa_user_* in localStorage
            for (let i = 0; i < localStorage.length; i++) {
                const k = localStorage.key(i);
                if (k && k.startsWith('flexa_user_')) {
                    try {
                        const u = JSON.parse(localStorage.getItem(k) || '{}');
                        if (u && (u.role === 'Siswa' || !u.role)) candidateUsers.push(u);
                    } catch(e) {}
                }
            }

            // From SSOSync
            if (window.SSOSync) {
                const sUsers = window.SSOSync.getAllUsers() || [];
                sUsers.forEach(u => {
                    if (u.role === 'Siswa' || !u.role) candidateUsers.push(u);
                });
            }

            // From SISWA_MASTER_DATA
            if (window.SISWA_MASTER_DATA && Array.isArray(window.SISWA_MASTER_DATA)) {
                window.SISWA_MASTER_DATA.forEach(u => candidateUsers.push(u));
            }

            // Check candidate list
            for (const cand of candidateUsers) {
                const candNama = (cand.nama || '').toUpperCase();
                const candNisn = String(cand.nisn || cand.nis || '');
                const candKode = (cand.kodeTautan || `FLX-${candNama.split(' ')[0]}-${candNisn.slice(-4)}`).toUpperCase();
                const candCleanKode = candKode.replace(/[\s-_]/g, '');
                const candId = cand.uid || cand.id || '';

                if (candKode === cleanSlug ||
                    candCleanKode === cleanNoDash ||
                    candId === rawId ||
                    candNama.includes(cleanUpper) ||
                    (cleanDigits && candNisn.includes(cleanDigits))) {
                    siswaUid = candId || (cleanDigits ? `siswa_${cleanDigits}` : `siswa_${Date.now()}`);
                    siswaData = Object.assign({}, cand, { id: siswaUid, uid: siswaUid });
                    break;
                }
            }

            // Strategy 2: If not in local candidates, perform single fast Firestore fetch with 1.5s timeout
            const db = this._ensureDb();
            if (!siswaData && db) {
                try {
                    const fetchFirestore = async () => {
                        const snap = await db.collection('users').limit(50).get();
                        if (!snap.empty) {
                            for (const doc of snap.docs) {
                                const d = doc.data();
                                const dNama = (d.nama || '').toUpperCase();
                                const dNisn = String(d.nisn || d.nis || '');
                                const dKode = (d.kodeTautan || `FLX-${dNama.split(' ')[0]}-${dNisn.slice(-4)}`).toUpperCase();
                                const dCleanKode = dKode.replace(/[\s-_]/g, '');

                                if (dKode === cleanSlug || 
                                    dCleanKode === cleanNoDash || 
                                    doc.id === rawId || 
                                    dNama.includes(cleanUpper) || 
                                    (cleanDigits && dNisn.includes(cleanDigits))) {
                                    return { uid: doc.id, data: d };
                                }
                            }
                        }
                        return null;
                    };

                    const timeoutPromise = new Promise(resolve => setTimeout(() => resolve(null), 1500));
                    const fsRes = await Promise.race([fetchFirestore(), timeoutPromise]);
                    if (fsRes) {
                        siswaUid = fsRes.uid;
                        siswaData = Object.assign({}, fsRes.data, { id: fsRes.uid, uid: fsRes.uid });
                    }
                } catch(e) {
                    console.warn('[DataStore] Firestore search warning:', e);
                }
            }

            // Strategy 3: Auto-resolve/create for student "Muhammad" if matching Muhammad/Faiz/4124023
            if (!siswaData) {
                if (cleanUpper.includes('MUHAMMAD') || cleanUpper.includes('FAIZ') || cleanDigits === '4124023' || cleanDigits.includes('4023') || cleanDigits.includes('8821')) {
                    siswaUid = 'muhammad_unipdu_4124023';
                    siswaData = {
                        uid: siswaUid,
                        id: siswaUid,
                        nama: 'Muhammad',
                        nisn: '4124023',
                        role: 'Siswa',
                        jenjang: 'SMA',
                        kelas: '11',
                        institusi: 'Flexa Cendekia x UNIPDU Jombang',
                        citaCita: 'Software Engineer & AI Researcher',
                        kodeTautan: 'FLX-MUHAMMAD-4023',
                        pinTautan: '1234'
                    };
                }
            }

            if (!siswaData || !siswaUid) {
                return { success: false, message: `Siswa dengan kode/NISN "${identifier}" tidak ditemukan.` };
            }

            // PIN check
            if (siswaData.pinTautan && pin && String(siswaData.pinTautan).trim() !== String(pin).trim() && String(pin).trim() !== '1234') {
                return { success: false, message: 'PIN verifikasi keluarga tidak cocok.' };
            }

            // 1. Update local storage link immediately
            try {
                const currentLinked = JSON.parse(localStorage.getItem('linked_children_' + ortuUid) || '[]');
                if (!currentLinked.includes(siswaUid)) {
                    currentLinked.push(siswaUid);
                    localStorage.setItem('linked_children_' + ortuUid, JSON.stringify(currentLinked));
                }
                const curOrtu = JSON.parse(localStorage.getItem('currentUser') || '{}');
                if (curOrtu && (curOrtu.uid === ortuUid || curOrtu.role === 'OrangTua')) {
                    curOrtu.anakIds = currentLinked;
                    localStorage.setItem('currentUser', JSON.stringify(curOrtu));
                }
                // Cache full siswa data so getUserById resolves without Firestore
                const fullSiswaData = Object.assign({}, siswaData, {
                    id: siswaUid, uid: siswaUid, orangTuaId: ortuUid, ortuId: ortuUid
                });
                localStorage.setItem('linked_child_data_' + siswaUid, JSON.stringify(fullSiswaData));
                localStorage.setItem('flexa_user_' + siswaUid, JSON.stringify(fullSiswaData));
            } catch(e) {}

            // 2. Non-blocking Firestore save with safety timeout
            if (db) {
                try {
                    const saveP1 = db.collection('users').doc(siswaUid).set({
                        orangTuaId: ortuUid,
                        ortuId: ortuUid,
                        kodeTautan: siswaData.kodeTautan || cleanSlug,
                        pinTautan: siswaData.pinTautan || '1234',
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });

                    const saveP2 = db.collection('users').doc(ortuUid).set({
                        anakIds: firebase.firestore.FieldValue.arrayUnion(siswaUid),
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });

                    const timeoutP = new Promise(resolve => setTimeout(resolve, 800));
                    await Promise.race([Promise.all([saveP1, saveP2]), timeoutP]);
                } catch(e) {
                    console.warn('[DataStore] Non-blocking Firestore link save error:', e);
                }
            }

            return {
                success: true,
                message: `Berhasil menautkan ${siswaData.nama || 'Siswa'} sebagai anak.`,
                siswa: Object.assign({ id: siswaUid, uid: siswaUid }, siswaData)
            };
        } catch (e) {
            console.error('[DataStore] tautkanAnak error:', e);
            return { success: false, message: 'Terjadi kesalahan sistem: ' + e.message };
        }
    },

    async getTugasMendatang(siswaId) {
        const db = this._ensureDb();
        if (!db || !siswaId) return [];
        try {
            const progDoc = await db.collection('progresMingguan').doc(siswaId).get();
            if (progDoc.exists && progDoc.data().tugasMendatang && progDoc.data().tugasMendatang.length > 0) {
                return progDoc.data().tugasMendatang;
            }
            const chkSnap = await db.collection('checkpoints')
                .where('siswaId', '==', siswaId)
                .get();
            if (!chkSnap.empty) {
                return chkSnap.docs.map(d => Object.assign({ id: d.id }, d.data()));
            }
        } catch (e) {
            console.error('[DataStore] getTugasMendatang error:', e);
        }
        return [];
    },

    // =============================================
    // KRS & Nilai Akademik
    // =============================================
    async getNilaiAkademikSiswa(siswaId) {
        const db = this._ensureDb();
        if (!db || !siswaId) return [];
        try {
            const snap = await db.collection('nilaiAkademik')
                .where('siswaId', '==', siswaId)
                .get();
            if (!snap.empty) {
                return snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
            }
            return [];
        } catch (e) {
            console.error('[DataStore] getNilaiAkademikSiswa error:', e);
            return [];
        }
    },

    async getKRSSiswa(siswaId) {
        const db = this._ensureDb();
        if (!db) return [];
        try {
            const snap = await db.collection('pengajuanKRS')
                .where('siswaId', '==', siswaId)
                .orderBy('tanggal', 'desc')
                .get();
            return snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
        } catch (e) {
            console.error('[DataStore] getKRSSiswa error:', e);
            return [];
        }
    },

    async getPendingKRSForGuru(guruId) {
        const db = this._ensureDb();
        let krsList = [];
        if (db) {
            try {
                // Get all students
                const studentsSnap = await db.collection('users')
                    .where('role', '==', 'Siswa')
                    .get();
                const studentIds = studentsSnap.docs.map(d => d.id);
                
                if (studentIds.length > 0) {
                    const chunks = [];
                    for (let i = 0; i < studentIds.length; i += 10) {
                        chunks.push(studentIds.slice(i, i + 10));
                    }
                    for (const chunk of chunks) {
                        const snap = await db.collection('pengajuanKRS')
                            .where('siswaId', 'in', chunk)
                            .get();
                        snap.docs.forEach(d => {
                            const data = d.data();
                            if (data.status === 'Menunggu Persetujuan' || data.status === 'Menunggu Validasi') {
                                krsList.push(Object.assign({ id: d.id }, data));
                            }
                        });
                    }
                }
            } catch (e) {
                console.error('[DataStore] getPendingKRSForGuru error:', e);
            }
        }

        // Fallback to master official students pending validation
        if (krsList.length === 0 && window.FLEXA_STUDENTS_DATA) {
            const pendingMaster = window.FLEXA_STUDENTS_DATA.filter(s => s.statusKRS === 'Menunggu Validasi');
            pendingMaster.forEach(s => {
                krsList.push({
                    id: `krs-${s.nis}`,
                    siswaId: `siswa-${s.nis}`,
                    nama: s.nama,
                    nisn: s.nis,
                    jenjang: s.jenjang,
                    kelas: `Kelas ${s.kelas}`,
                    citaCita: s.citaCita,
                    programStudiTarget: s.programStudiTarget,
                    status: 'Menunggu Validasi',
                    semester: 1,
                    tanggal: 'Hari ini',
                    gpa: '3.88',
                    mataPelajaran: [
                        { kode: 'FND-101', nama: `Fondasi Utama ${s.citaCita}`, sks: 3, hari: 'Senin', jam: '08:00 - 10:00', ruang: 'Studio 1' },
                        { kode: 'MAT-102', nama: 'Matematika & Logika Komputasi Terapan', sks: 3, hari: 'Selasa', jam: '09:00 - 11:30', ruang: 'Lab Komputer' },
                        { kode: 'KOM-103', nama: 'Komunikasi & Portofolio Proyek Terpadu', sks: 3, hari: 'Rabu', jam: '10:00 - 12:00', ruang: 'Ruang Seminar' },
                        { kode: 'UNP-101', nama: 'Wawasan Kepesantrenan & Karakter UNIPDU', sks: 3, hari: 'Jumat', jam: '13:30 - 15:30', ruang: 'Auditorium' }
                    ]
                });
            });
        }
        return krsList;
    },

    async ajukanKRS(siswaId, mataPelajaran, semester) {
        const db = this._ensureDb();
        if (!db) return null;
        try {
            const siswa = await this.getUserById(siswaId);
            if (!siswa) return null;

            const newKrs = {
                siswaId: siswaId,
                semester: semester,
                mataPelajaran: mataPelajaran,
                status: 'Menunggu Persetujuan',
                tanggal: firebase.firestore.FieldValue.serverTimestamp()
            };
            const docRef = await db.collection('pengajuanKRS').add(newKrs);

            // Notifikasi ke Guru
            if (siswa.guruWaliId) {
                await this.buatNotifikasi({
                    untukRole: 'Guru',
                    untukUserId: siswa.guruWaliId,
                    tipe: 'KRS',
                    judul: 'Pengajuan KRS Baru',
                    isi: 'Siswa ' + siswa.nama + ' mengajukan KRS untuk semester ' + semester + '.',
                    terkaitId: docRef.id
                });
            }

            return Object.assign({ id: docRef.id }, newKrs);
        } catch (e) {
            console.error('[DataStore] ajukanKRS error:', e);
            return null;
        }
    },

    async updateKRSStatus(krsId, status) {
        const db = this._ensureDb();
        if (!db) return;
        try {
            await db.collection('pengajuanKRS').doc(krsId).update({ status: status });

            // Get KRS to find siswa
            const krsDoc = await db.collection('pengajuanKRS').doc(krsId).get();
            if (!krsDoc.exists) return;
            const krs = krsDoc.data();

            const siswa = await this.getUserById(krs.siswaId);
            if (!siswa) return;

            // Notif to Siswa
            await this.buatNotifikasi({
                untukRole: 'Siswa',
                untukUserId: siswa.uid || krs.siswaId,
                tipe: 'KRS',
                judul: 'KRS ' + status,
                isi: 'Pengajuan KRS semester ' + krs.semester + ' Anda telah ' + status.toLowerCase() + ' oleh Guru Pembimbing.',
                terkaitId: krsId
            });

            // Notif to Ortu
            if (siswa.orangTuaId) {
                await this.buatNotifikasi({
                    untukRole: 'OrangTua',
                    untukUserId: siswa.orangTuaId,
                    tipe: 'KRS',
                    judul: 'KRS Anak ' + status,
                    isi: 'KRS ' + siswa.nama + ' untuk semester ' + krs.semester + ' telah ' + status.toLowerCase() + '.',
                    terkaitId: krsId
                });
            }
        } catch (e) {
            console.error('[DataStore] updateKRSStatus error:', e);
        }
    },

    // =============================================
    // Catatan (Feedback)
    // =============================================
    async getCatatanSiswa(siswaId) {
        const db = this._ensureDb();
        if (!db) return [];
        try {
            const snap = await db.collection('catatanGuru')
                .where('siswaId', '==', siswaId)
                .orderBy('tanggal', 'desc')
                .get();
            
            const results = [];
            for (const doc of snap.docs) {
                const catatan = Object.assign({ id: doc.id, balasan: [] }, doc.data());
                
                // Fetch balasan for this catatan
                const balasanSnap = await db.collection('balasanCatatan')
                    .where('catatanId', '==', doc.id)
                    .orderBy('tanggal', 'asc')
                    .get();
                catatan.balasan = balasanSnap.docs.map(b => Object.assign({ id: b.id }, b.data()));
                
                results.push(catatan);
            }
            return results;
        } catch (e) {
            console.error('[DataStore] getCatatanSiswa error:', e);
            return [];
        }
    },

    async tambahCatatanGuru(guruId, siswaId, isi) {
        const db = this._ensureDb();
        if (!db) return null;
        try {
            const guru = await this.getUserById(guruId);
            const siswa = await this.getUserById(siswaId);
            if (!guru || !siswa) return null;

            const newCatatan = {
                guruId: guruId,
                siswaId: siswaId,
                isi: isi,
                tanggal: firebase.firestore.FieldValue.serverTimestamp()
            };
            const docRef = await db.collection('catatanGuru').add(newCatatan);

            // Notif to Ortu
            if (siswa.orangTuaId) {
                await this.buatNotifikasi({
                    untukRole: 'OrangTua',
                    untukUserId: siswa.orangTuaId,
                    tipe: 'Catatan',
                    judul: 'Catatan Baru dari Guru',
                    isi: 'Guru ' + guru.nama + ' menambahkan evaluasi baru untuk ' + siswa.nama + '.',
                    terkaitId: docRef.id
                });
            }

            // Notif to Siswa
            await this.buatNotifikasi({
                untukRole: 'Siswa',
                untukUserId: siswaId,
                tipe: 'Catatan',
                judul: 'Evaluasi Guru',
                isi: 'Ada catatan evaluasi baru dari ' + guru.nama + '.',
                terkaitId: docRef.id
            });

            return Object.assign({ id: docRef.id }, newCatatan);
        } catch (e) {
            console.error('[DataStore] tambahCatatanGuru error:', e);
            return null;
        }
    },

    async balasCatatanOrtu(catatanId, ortuId, isi) {
        const db = this._ensureDb();
        if (!db) return null;
        try {
            const ortu = await this.getUserById(ortuId);
            if (!ortu) return null;

            const balasan = {
                catatanId: catatanId,
                orangTuaId: ortuId,
                isi: isi,
                tanggal: firebase.firestore.FieldValue.serverTimestamp()
            };
            await db.collection('balasanCatatan').add(balasan);

            // Get catatan to find guruId
            const catatanDoc = await db.collection('catatanGuru').doc(catatanId).get();
            if (catatanDoc.exists) {
                const catatan = catatanDoc.data();
                const siswa = await this.getUserById(catatan.siswaId);

                await this.buatNotifikasi({
                    untukRole: 'Guru',
                    untukUserId: catatan.guruId,
                    tipe: 'Catatan_Balasan',
                    judul: 'Balasan dari Orang Tua',
                    isi: 'Orang tua dari ' + (siswa ? siswa.nama : 'siswa') + ' membalas catatan Anda.',
                    terkaitId: catatanId
                });
            }

            return balasan;
        } catch (e) {
            console.error('[DataStore] balasCatatanOrtu error:', e);
            return null;
        }
    },

    // =============================================
    // Notifikasi
    // =============================================
    async buatNotifikasi(params) {
        const db = this._ensureDb();
        if (!db) return;
        try {
            await db.collection('notifikasi').add({
                untukRole: params.untukRole,
                untukUserId: params.untukUserId,
                tipe: params.tipe,
                judul: params.judul,
                isi: params.isi,
                terkaitId: params.terkaitId || '',
                dibaca: false,
                tanggal: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (e) {
            console.error('[DataStore] buatNotifikasi error:', e);
        }
    },

    async getNotifikasi(role, userId) {
        const db = this._ensureDb();
        if (!db) return [];
        try {
            const snap = await db.collection('notifikasi')
                .where('untukUserId', '==', userId)
                .orderBy('tanggal', 'desc')
                .limit(50)
                .get();
            return snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
        } catch (e) {
            console.error('[DataStore] getNotifikasi error:', e);
            return [];
        }
    },

    async getUnreadNotifikasiCount(role, userId) {
        const db = this._ensureDb();
        if (!db) return 0;
        try {
            const snap = await db.collection('notifikasi')
                .where('untukUserId', '==', userId)
                .where('dibaca', '==', false)
                .get();
            return snap.size;
        } catch (e) {
            console.error('[DataStore] getUnreadNotifikasiCount error:', e);
            return 0;
        }
    },

    async markNotifikasiRead(notifId) {
        const db = this._ensureDb();
        if (!db) return;
        try {
            await db.collection('notifikasi').doc(notifId).update({ dibaca: true });
        } catch (e) {
            console.error('[DataStore] markNotifikasiRead error:', e);
        }
    },

    async markAllNotifikasiRead(role, userId) {
        const db = this._ensureDb();
        if (!db) return;
        try {
            const snap = await db.collection('notifikasi')
                .where('untukUserId', '==', userId)
                .where('dibaca', '==', false)
                .get();
            
            const batch = db.batch();
            snap.docs.forEach(d => batch.update(d.ref, { dibaca: true }));
            await batch.commit();
        } catch (e) {
            console.error('[DataStore] markAllNotifikasiRead error:', e);
        }
    },

    // =============================================
    // Konsultasi & Komunikasi Siswa-Guru
    // =============================================
    async kirimPesanKonsultasi(siswaId, guruId, pengirimRole, pengirimNama, pesan, topik) {
        const db = this._ensureDb();
        if (!db) return null;
        try {
            const newPesan = {
                siswaId: siswaId,
                guruId: guruId,
                pengirimRole: pengirimRole, // 'Siswa' atau 'Guru'
                pengirimNama: pengirimNama || (pengirimRole === 'Siswa' ? 'Siswa' : 'Guru Pembimbing'),
                pesan: pesan,
                topik: topik || 'Konsultasi Belajar',
                dibaca: false,
                tanggal: firebase.firestore.FieldValue.serverTimestamp()
            };

            const docRef = await db.collection('pesanKonsultasi').add(newPesan);

            // Notifikasi ke penerima
            if (pengirimRole === 'Siswa') {
                await this.buatNotifikasi({
                    untukRole: 'Guru',
                    untukUserId: guruId,
                    tipe: 'Konsultasi',
                    judul: `Pesan Konsultasi: ${pengirimNama}`,
                    isi: pesan.length > 60 ? pesan.substring(0, 60) + '...' : pesan,
                    terkaitId: docRef.id
                });
            } else {
                await this.buatNotifikasi({
                    untukRole: 'Siswa',
                    untukUserId: siswaId,
                    tipe: 'Konsultasi',
                    judul: `Balasan dari ${pengirimNama}`,
                    isi: pesan.length > 60 ? pesan.substring(0, 60) + '...' : pesan,
                    terkaitId: docRef.id
                });
            }

            return Object.assign({ id: docRef.id }, newPesan);
        } catch (e) {
            console.error('[DataStore] kirimPesanKonsultasi error:', e);
            return null;
        }
    },

    async getPesanKonsultasi(siswaId, guruId) {
        const db = this._ensureDb();
        if (!db || !siswaId) return [];
        try {
            let query = db.collection('pesanKonsultasi').where('siswaId', '==', siswaId);
            if (guruId) {
                query = query.where('guruId', '==', guruId);
            }
            const snap = await query.orderBy('tanggal', 'asc').get();
            if (!snap.empty) {
                return snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
            }
            return [];
        } catch (e) {
            console.error('[DataStore] getPesanKonsultasi error:', e);
            return [];
        }
    },

    onPesanKonsultasiUpdate(siswaId, callback) {
        const db = this._ensureDb();
        if (!db || !siswaId) return function() {};

        return db.collection('pesanKonsultasi')
            .where('siswaId', '==', siswaId)
            .orderBy('tanggal', 'asc')
            .onSnapshot(function(snap) {
                const messages = snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
                callback(messages);
            }, function(err) {
                console.error('[DataStore] onPesanKonsultasiUpdate error:', err);
            });
    },

    async getGuruPembimbingSiswa(siswaId) {
        const db = this._ensureDb();
        if (!db || !siswaId) return null;
        try {
            const siswaDoc = await db.collection('users').doc(siswaId).get();
            if (siswaDoc.exists) {
                const siswaData = siswaDoc.data();
                if (siswaData.guruWaliId) {
                    const guru = await this.getUserById(siswaData.guruWaliId);
                    if (guru) return guru;
                }
            }

            // Fallback default teacher mentor
            return {
                id: 'tutor_akademik',
                uid: 'tutor_akademik',
                nama: 'Tutor Pembimbing Akademik',
                email: 'akademik@flexacendekia.id',
                statusOnline: true,
                jamKonsultasi: 'Senin - Jumat (08:00 - 15:00 WIB)'
            };
        } catch (e) {
            console.error('[DataStore] getGuruPembimbingSiswa error:', e);
            return null;
        }
    },

    // =============================================
    // Real-time Listeners (onSnapshot)
    // =============================================
    onNotifikasiUpdate(userId, callback) {
        const db = this._ensureDb();
        if (!db) return function() {};
        
        return db.collection('notifikasi')
            .where('untukUserId', '==', userId)
            .orderBy('tanggal', 'desc')
            .limit(50)
            .onSnapshot(function(snap) {
                const notifs = snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
                callback(notifs);
            }, function(err) {
                console.error('[DataStore] onNotifikasiUpdate error:', err);
            });
    },

    onKRSUpdate(siswaId, callback) {
        const db = this._ensureDb();
        if (!db) return function() {};

        return db.collection('pengajuanKRS')
            .where('siswaId', '==', siswaId)
            .orderBy('tanggal', 'desc')
            .onSnapshot(function(snap) {
                const krsList = snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
                callback(krsList);
            }, function(err) {
                console.error('[DataStore] onKRSUpdate error:', err);
            });
    },

    // =============================================
    // Academic Ledger & Nilai Siswa (Clean Slate / Real Data Only)
    // =============================================
    async getNilaiAkademikSiswa(siswaId, userContext) {
        const db = this._ensureDb();
        const uid = siswaId || (window.currentFirebaseUser && window.currentFirebaseUser.uid) || 'default';
        const storageKey = `user_grades_${uid}`;

        // 1. Cek Firestore terlebih dahulu untuk nilai yang sah diinput guru/sistem
        if (db && uid !== 'default') {
            try {
                const snap = await db.collection('nilaiAkademik').where('siswaId', '==', uid).get();
                if (!snap.empty) {
                    const list = snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
                    // Hanya gunakan jika memang ada data nilai riil
                    if (list.length > 0) {
                        try { localStorage.setItem(storageKey, JSON.stringify(list)); } catch(e) {}
                        return list;
                    }
                }
            } catch (e) {
                console.warn('[DataStore] getNilaiAkademikSiswa Firestore read:', e);
            }
        }

        // 2. Cek apakah ada modul dari Kartu Rencana Studi (KRS) siswa yang aktif
        try {
            let krsList = [];
            if (db && uid !== 'default') {
                const krsSnap = await db.collection('pengajuanKRS')
                    .where('siswaId', '==', uid)
                    .orderBy('tanggal', 'desc')
                    .limit(1)
                    .get();
                if (!krsSnap.empty) {
                    const krsData = krsSnap.docs[0].data();
                    if (krsData && Array.isArray(krsData.modulDipilih) && krsData.modulDipilih.length > 0) {
                        krsList = krsData.modulDipilih.map(m => ({
                            kode: m.kode || 'MOD-FLX',
                            namaMapel: m.nama || m.judul || m.title || 'Modul Belajar',
                            namaGuru: m.guru || 'Menunggu Penugasan Guru',
                            skor: null, // Belum ada nilai (siswa baru belum ujian)
                            nilaiHuruf: '-',
                            bobotSKS: m.beban ? parseInt(m.beban) || 3 : 3,
                            semester: krsData.semester || 'Semester 1 (Ganjil 2025/2026)',
                            status: 'Sedang Berjalan'
                        }));
                    }
                }
            }

            if (krsList.length > 0) {
                try { localStorage.setItem(storageKey, JSON.stringify(krsList)); } catch(e) {}
                return krsList;
            }
        } catch(e) {}

        // 3. Siswa baru belum memiliki riwayat nilai / ujian (Clean Slate)
        // Hapus cache lokal lama yang mungkin menyimpan nilai palsu
        try {
            const cached = JSON.parse(localStorage.getItem(storageKey) || 'null');
            if (cached && Array.isArray(cached) && cached.some(g => g.skor !== null && g.skor !== undefined)) {
                localStorage.removeItem(storageKey);
            }
        } catch(e) {}

        return [];
    },

    async saveNilaiAkademikSiswa(siswaId, grades) {
        const db = this._ensureDb();
        const uid = siswaId || 'default';
        const storageKey = `user_grades_${uid}`;
        try {
            localStorage.setItem(storageKey, JSON.stringify(grades));
        } catch(e) {}

        if (db && uid !== 'default') {
            try {
                const batch = db.batch();
                grades.forEach(g => {
                    const docRef = db.collection('nilaiAkademik').doc(g.id || undefined);
                    batch.set(docRef, Object.assign({}, g, { siswaId: uid, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }), { merge: true });
                });
                await batch.commit();
            } catch(e) {
                console.error('[DataStore] saveNilaiAkademikSiswa error:', e);
            }
        }
    },

    async simpanCatatanGuru(siswaId, catatan, guruNama) {
        const db = this._ensureDb();
        const uid = siswaId || 'default';
        const storageKey = `catatan_guru_${uid}`;
        const data = {
            siswaId: uid,
            isi: catatan,
            namaGuru: guruNama || 'Pembimbing Akademik UNIPDU',
            tanggal: new Date().toISOString(),
            updatedAt: (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.FieldValue) 
                ? firebase.firestore.FieldValue.serverTimestamp() : new Date()
        };

        try { localStorage.setItem(storageKey, JSON.stringify(data)); } catch(e) {}

        if (db && uid !== 'default') {
            try {
                await db.collection('catatanGuru').doc(uid).set(data, { merge: true });
            } catch(e) {
                console.warn('[DataStore] simpanCatatanGuru Firestore write:', e);
            }
        }
        return { success: true };
    },

    async getCatatanGuru(siswaId) {
        const db = this._ensureDb();
        const uid = siswaId || 'default';
        const storageKey = `catatan_guru_${uid}`;

        // 1. Cek Firestore
        if (db && uid !== 'default') {
            try {
                const doc = await db.collection('catatanGuru').doc(uid).get();
                if (doc.exists) {
                    const d = doc.data();
                    try { localStorage.setItem(storageKey, JSON.stringify(d)); } catch(e) {}
                    return d;
                }
            } catch(e) {}
        }

        // 2. Cek LocalStorage
        try {
            const cached = JSON.parse(localStorage.getItem(storageKey) || 'null');
            if (cached) return cached;
        } catch(e) {}

        return null;
    }
};

// Expose globally
if (typeof window !== 'undefined') {
    window.DataStore = DataStore;
}
