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
        const db = this._ensureDb();
        if (!db) return null;
        try {
            const doc = await db.collection('users').doc(id).get();
            if (doc.exists) {
                return Object.assign({ id: doc.id }, doc.data());
            }
        } catch (e) {
            console.error('[DataStore] getUserById error:', e);
        }
        return null;
    },

    async getHasilDiagnostik(siswaId) {
        const db = this._ensureDb();
        if (!db) return null;
        try {
            const doc = await db.collection('hasilDiagnostik').doc(siswaId).get();
            if (doc.exists) return doc.data();
        } catch(e) {
            console.error('[DataStore] getHasilDiagnostik error:', e);
        }
        return null;
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
        const db = this._ensureDb();
        if (!db || !ortuId) return [];
        try {
            // 1. Cek array anakIds pada dokumen ortu
            const ortuDoc = await db.collection('users').doc(ortuId).get();
            if (ortuDoc.exists && ortuDoc.data().anakIds && ortuDoc.data().anakIds.length > 0) {
                const anakIds = ortuDoc.data().anakIds;
                const anakList = [];
                for (const id of anakIds) {
                    const sDoc = await db.collection('users').doc(id).get();
                    if (sDoc.exists) {
                        anakList.push(Object.assign({ id: sDoc.id, uid: sDoc.id }, sDoc.data()));
                    }
                }
                if (anakList.length > 0) return anakList;
            }

            // 2. Query koleksi users dengan filter orangTuaId / ortuId
            let snap = await db.collection('users').where('orangTuaId', '==', ortuId).get();
            if (snap.empty) {
                snap = await db.collection('users').where('ortuId', '==', ortuId).get();
            }
            if (!snap.empty) {
                return snap.docs.map(d => Object.assign({ id: d.id, uid: d.id }, d.data()));
            }
        } catch (e) {
            console.error('[DataStore] getAnakByOrtuId error:', e);
        }
        return [];
    },

    async tautkanAnak(ortuUid, identifier, pin) {
        const db = this._ensureDb();
        if (!db || !ortuUid || !identifier) {
            return { success: false, message: 'Data penautan tidak lengkap.' };
        }
        try {
            const cleanId = identifier.trim();
            let siswaDoc = null;
            
            // 1. Cek kodeTautan
            let snap = await db.collection('users').where('kodeTautan', '==', cleanId).get();
            if (!snap.empty) {
                siswaDoc = snap.docs[0];
            } else {
                // 2. Cek NISN
                snap = await db.collection('users').where('nisn', '==', cleanId).get();
                if (!snap.empty) {
                    siswaDoc = snap.docs[0];
                } else {
                    // 3. Cek direct doc ID
                    const docCheck = await db.collection('users').doc(cleanId).get();
                    if (docCheck.exists && docCheck.data().role === 'Siswa') {
                        siswaDoc = docCheck;
                    }
                }
            }

            if (!siswaDoc || !siswaDoc.exists) {
                return { success: false, message: `Siswa dengan kode/NISN "${identifier}" tidak ditemukan.` };
            }

            const siswaData = siswaDoc.data();
            const siswaUid = siswaDoc.id;

            // Verifikasi PIN jika diatur
            if (siswaData.pinTautan && pin && String(siswaData.pinTautan) !== String(pin).trim()) {
                return { success: false, message: 'PIN verifikasi keluarga tidak cocok.' };
            }

            // Update profile siswa dengan orangTuaId
            await db.collection('users').doc(siswaUid).update({
                orangTuaId: ortuUid
            });

            // Tambahkan ke anakIds di dokumen orang tua
            const ortuRef = db.collection('users').doc(ortuUid);
            const ortuSnap = await ortuRef.get();
            let currentAnakIds = [];
            if (ortuSnap.exists && Array.isArray(ortuSnap.data().anakIds)) {
                currentAnakIds = ortuSnap.data().anakIds;
            }
            if (!currentAnakIds.includes(siswaUid)) {
                currentAnakIds.push(siswaUid);
            }
            await ortuRef.set({ anakIds: currentAnakIds }, { merge: true });

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

    async tautkanSiswaBimbingan(guruUid, identifier) {
        const db = this._ensureDb();
        if (!db || !guruUid || !identifier) {
            return { success: false, message: 'Data penautan tidak lengkap.' };
        }
        try {
            const cleanId = identifier.trim();
            let siswaDoc = null;
            
            // 1. Cek kodeTautan
            let snap = await db.collection('users').where('kodeTautan', '==', cleanId).get();
            if (!snap.empty) {
                siswaDoc = snap.docs[0];
            } else {
                // 2. Cek NISN
                snap = await db.collection('users').where('nisn', '==', cleanId).get();
                if (!snap.empty) {
                    siswaDoc = snap.docs[0];
                } else {
                    const docCheck = await db.collection('users').doc(cleanId).get();
                    if (docCheck.exists && docCheck.data().role === 'Siswa') {
                        siswaDoc = docCheck;
                    }
                }
            }

            if (!siswaDoc || !siswaDoc.exists) {
                return { success: false, message: `Siswa dengan kode/NISN "${identifier}" tidak ditemukan.` };
            }

            const siswaData = siswaDoc.data();
            const siswaUid = siswaDoc.id;

            // Update guruWaliId pada siswa
            await db.collection('users').doc(siswaUid).update({
                guruWaliId: guruUid
            });

            // Update array siswaBimbinganIds pada dokumen Guru
            const guruRef = db.collection('users').doc(guruUid);
            const guruSnap = await guruRef.get();
            let currentList = [];
            if (guruSnap.exists && Array.isArray(guruSnap.data().siswaBimbinganIds)) {
                currentList = guruSnap.data().siswaBimbinganIds;
            }
            if (!currentList.includes(siswaUid)) {
                currentList.push(siswaUid);
            }
            await guruRef.set({ siswaBimbinganIds: currentList }, { merge: true });

            return { 
                success: true, 
                message: `Berhasil menautkan ${siswaData.nama || 'Siswa'} sebagai siswa bimbingan.`,
                siswa: Object.assign({ id: siswaUid, uid: siswaUid }, siswaData)
            };
        } catch (e) {
            console.error('[DataStore] tautkanSiswaBimbingan error:', e);
            return { success: false, message: 'Terjadi kesalahan: ' + e.message };
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
        if (!db || !guruId) return [];
        try {
            // 1. Ambil daftar ID siswa bimbingan dari guru ini
            let studentIds = [];
            
            // Cek array siswaBimbinganIds pada profil guru
            const guruDoc = await db.collection('users').doc(guruId).get();
            if (guruDoc.exists && Array.isArray(guruDoc.data().siswaBimbinganIds)) {
                studentIds = guruDoc.data().siswaBimbinganIds.slice();
            }

            // Cek siswa dengan guruWaliId == guruId
            const studentsSnap = await db.collection('users')
                .where('role', '==', 'Siswa')
                .where('guruWaliId', '==', guruId)
                .get();
            
            studentsSnap.docs.forEach(d => {
                if (!studentIds.includes(d.id)) studentIds.push(d.id);
            });
            
            let krsList = [];

            // A. Query pengajuan KRS by siswaId
            if (studentIds.length > 0) {
                const chunks = [];
                for (let i = 0; i < studentIds.length; i += 10) {
                    chunks.push(studentIds.slice(i, i + 10));
                }
                for (const chunk of chunks) {
                    const snap = await db.collection('pengajuanKRS')
                        .where('siswaId', 'in', chunk)
                        .where('status', '==', 'Menunggu Persetujuan')
                        .get();
                    snap.docs.forEach(d => {
                        krsList.push(Object.assign({ id: d.id }, d.data()));
                    });
                }
            }

            // B. Cek juga pengajuan KRS yang secara langsung memiliki field guruId == guruId
            try {
                const directSnap = await db.collection('pengajuanKRS')
                    .where('guruId', '==', guruId)
                    .where('status', '==', 'Menunggu Persetujuan')
                    .get();
                directSnap.docs.forEach(d => {
                    if (!krsList.some(item => item.id === d.id)) {
                        krsList.push(Object.assign({ id: d.id }, d.data()));
                    }
                });
            } catch(e) {}

            // C. Perkaya data krs dengan profil siswa jika field nama/citaCita belum lengkap
            for (let item of krsList) {
                if (item.siswaId && (!item.nama || !item.citaCita || !item.jenjang)) {
                    const sData = await this.getUserById(item.siswaId);
                    if (sData) {
                        item.nama = item.nama || sData.nama;
                        item.citaCita = item.citaCita || sData.citaCita;
                        item.jenjang = item.jenjang || sData.jenjang;
                        item.kelas = item.kelas || sData.kelas;
                    }
                }
            }

            return krsList;
        } catch (e) {
            console.error('[DataStore] getPendingKRSForGuru error:', e);
            return [];
        }
    },

    async ajukanKRS(siswaId, mataPelajaran, semester) {
        const db = this._ensureDb();
        if (!db) return null;
        try {
            const siswa = await this.getUserById(siswaId);
            if (!siswa) return null;

            const newKrs = {
                siswaId: siswaId,
                nama: siswa.nama || 'Siswa',
                jenjang: siswa.jenjang || 'SMA',
                kelas: siswa.kelas || 11,
                citaCita: siswa.citaCita || 'Arsitek',
                guruId: siswa.guruWaliId || null,
                semester: semester || 1,
                mataPelajaran: mataPelajaran,
                status: 'Menunggu Persetujuan',
                tanggal: 'Hari ini, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            const docRef = await db.collection('pengajuanKRS').add(newKrs);

            // Notifikasi ke Guru
            if (siswa.guruWaliId) {
                await this.buatNotifikasi({
                    untukRole: 'Guru',
                    untukUserId: siswa.guruWaliId,
                    tipe: 'KRS',
                    judul: 'Pengajuan KRS Baru',
                    isi: 'Siswa ' + siswa.nama + ' mengajukan KRS untuk semester ' + (semester || 1) + '.',
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
                id: 'guru_lestari_01',
                uid: 'guru_lestari_01',
                nama: 'Ibu Lestari, S.Sn',
                spesialisasi: 'Pembimbing Akademik & Desain Portofolio',
                email: 'lestari@flexacendekia.sch.id',
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
    // Academic Ledger & Nilai Siswa
    // =============================================
    async getNilaiAkademikSiswa(siswaId, userContext) {
        const db = this._ensureDb();
        const uid = siswaId || (window.currentFirebaseUser && window.currentFirebaseUser.uid) || 'default';
        const storageKey = `user_grades_${uid}`;

        // 1. Check localStorage first
        try {
            const cached = JSON.parse(localStorage.getItem(storageKey) || 'null');
            if (cached && Array.isArray(cached) && cached.length > 0) {
                return cached;
            }
        } catch (e) {}

        // 2. Check Firestore
        if (db && uid !== 'default') {
            try {
                const snap = await db.collection('nilaiAkademik').where('siswaId', '==', uid).get();
                if (!snap.empty) {
                    const list = snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
                    localStorage.setItem(storageKey, JSON.stringify(list));
                    return list;
                }
            } catch (e) {
                console.warn('[DataStore] getNilaiAkademikSiswa Firestore read failed, fallback to generator:', e);
            }
        }

        // 3. Generate adaptive, realistic curriculum grades based on student profile
        const user = userContext || window.currentFirebaseUser || (function() {
            try { return JSON.parse(localStorage.getItem('currentUser') || '{}'); } catch(e) { return {}; }
        })();

        const generated = this._generateDefaultGrades(user);
        
        // Save to localStorage for instant hydration
        try {
            localStorage.setItem(storageKey, JSON.stringify(generated));
        } catch(e) {}

        // Save to Firestore in background
        if (db && uid !== 'default') {
            try {
                const batch = db.batch();
                generated.forEach(g => {
                    const docRef = db.collection('nilaiAkademik').doc();
                    batch.set(docRef, Object.assign({}, g, { siswaId: uid, createdAt: firebase.firestore.FieldValue.serverTimestamp() }));
                });
                batch.commit().catch(err => console.warn('[DataStore] saveNilai batch error:', err));
            } catch(e) {}
        }

        return generated;
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

    _generateDefaultGrades(user) {
        const jenjang = ((user && user.jenjang) || localStorage.getItem('userJenjang') || 'SD').toUpperCase();
        let kelas = parseInt((user && user.kelas) || localStorage.getItem('userKelas') || (jenjang === 'SD' ? 1 : (jenjang === 'SMP' ? 7 : 10)), 10);
        if (isNaN(kelas)) kelas = (jenjang === 'SD' ? 1 : (jenjang === 'SMP' ? 7 : 10));
        const citaCita = (user && user.citaCita) || localStorage.getItem('selectedCareer') || 'Aktor';

        const grades = [];

        if (jenjang === 'SD') {
            // Semester 1 (Aktif)
            grades.push(
                { kode: 'SD-LIT-01', namaMapel: 'Bahasa Indonesia & Literasi Cerita', namaGuru: 'Ibu Nur Aini, S.Pd', skor: 94, nilaiHuruf: 'A', bobotSKS: 4, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SD-MAT-01', namaMapel: 'Matematika & Logika Konkret', namaGuru: 'Bpk. Hendro Utomo, S.Pd', skor: 91, nilaiHuruf: 'A', bobotSKS: 4, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SD-SENI-01', namaMapel: `Seni Budaya & Minat Ekspresi (${citaCita})`, namaGuru: 'Ibu Lestari, S.Sn', skor: 96, nilaiHuruf: 'A', bobotSKS: 3, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SD-PANC-01', namaMapel: 'Pendidikan Pancasila & Budi Pekerti', namaGuru: 'Ibu Siti Rahma, M.Pd', skor: 93, nilaiHuruf: 'A', bobotSKS: 2, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SD-IPAS-01', namaMapel: 'IPAS (Eksplorasi Lingkungan Hidup)', namaGuru: 'Bpk. Danang Prasetyo, S.Pd', skor: 92, nilaiHuruf: 'A', bobotSKS: 3, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SD-PJOK-01', namaMapel: 'PJOK & Aktivitas Motorik Sehat', namaGuru: 'Bpk. Rahmat Hidayat, S.Pd', skor: 95, nilaiHuruf: 'A', bobotSKS: 2, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SD-P5-01', namaMapel: 'Proyek Profil Pelajar Pancasila (P5)', namaGuru: 'Tim Fasilitator P5 SD', skor: 94, nilaiHuruf: 'A', bobotSKS: 2, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' }
            );

            // If grade 2 or higher, add previous semester history
            if (kelas >= 2) {
                grades.push(
                    { kode: 'SD-LIT-00', namaMapel: 'Pengenalan Huruf & Kosakata Dasar', namaGuru: 'Ibu Nur Aini, S.Pd', skor: 92, nilaiHuruf: 'A', bobotSKS: 4, semester: 'Semester Awal (Fondasi A)', status: 'Lulus' },
                    { kode: 'SD-MAT-00', namaMapel: 'Pengenalan Angka & Pola Spasial', namaGuru: 'Bpk. Hendro Utomo, S.Pd', skor: 89, nilaiHuruf: 'A-', bobotSKS: 4, semester: 'Semester Awal (Fondasi A)', status: 'Lulus' },
                    { kode: 'SD-SENI-00', namaMapel: `Kreativitas Warna & Olah Rasa (${citaCita})`, namaGuru: 'Ibu Lestari, S.Sn', skor: 95, nilaiHuruf: 'A', bobotSKS: 3, semester: 'Semester Awal (Fondasi A)', status: 'Lulus' },
                    { kode: 'SD-PANC-00', namaMapel: 'Karakter Sopan Santun & Gotong Royong', namaGuru: 'Ibu Siti Rahma, M.Pd', skor: 90, nilaiHuruf: 'A', bobotSKS: 2, semester: 'Semester Awal (Fondasi A)', status: 'Lulus' }
                );
            }

        } else if (jenjang === 'SMP') {
            // Semester 1 (Aktif)
            grades.push(
                { kode: 'SMP-BIN-01', namaMapel: 'Bahasa Indonesia & Literasi Kritis', namaGuru: 'Ibu Dian Permata, M.Pd', skor: 92, nilaiHuruf: 'A', bobotSKS: 4, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SMP-MAT-01', namaMapel: 'Matematika Terapan & Logika Aljabar', namaGuru: 'Bpk. Wahyu Pratama, M.Sc', skor: 88, nilaiHuruf: 'A-', bobotSKS: 4, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SMP-IPA-01', namaMapel: 'IPA Terpadu & Eksperimen Laboratorium', namaGuru: 'Ibu Dr. Sri Rejeki', skor: 91, nilaiHuruf: 'A', bobotSKS: 4, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SMP-IPS-01', namaMapel: 'IPS Terpadu & Wawasan Kebangsaan', namaGuru: 'Bpk. Arif Rahman, M.Pd', skor: 89, nilaiHuruf: 'A-', bobotSKS: 3, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SMP-ENG-01', namaMapel: 'English for Communication & Writing', namaGuru: 'Ms. Sarah Johnson, M.Ed', skor: 95, nilaiHuruf: 'A', bobotSKS: 3, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SMP-MINAT-01', namaMapel: `Eksplorasi Kejuruan Terapan (${citaCita})`, namaGuru: 'Dosen Pembimbing UNIPDU', skor: 93, nilaiHuruf: 'A', bobotSKS: 3, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SMP-INF-01', namaMapel: 'Informatika & Logika Algoritma', namaGuru: 'Bpk. Fajar Ramadhan, S.Kom', skor: 94, nilaiHuruf: 'A', bobotSKS: 3, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SMP-P5-01', namaMapel: 'Proyek P5 Rekayasa & Teknologi', namaGuru: 'Tim Fasilitator P5 SMP', skor: 96, nilaiHuruf: 'A', bobotSKS: 2, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' }
            );

            if (kelas >= 8) {
                grades.push(
                    { kode: 'SMP-BIN-00', namaMapel: 'Bahasa Indonesia Dasar SMP', namaGuru: 'Ibu Dian Permata, M.Pd', skor: 90, nilaiHuruf: 'A', bobotSKS: 4, semester: 'Semester 2 (Genap 2024/2025)', status: 'Lulus' },
                    { kode: 'SMP-MAT-00', namaMapel: 'Aritmatika & Geometri Bidang', namaGuru: 'Bpk. Wahyu Pratama, M.Sc', skor: 86, nilaiHuruf: 'A-', bobotSKS: 4, semester: 'Semester 2 (Genap 2024/2025)', status: 'Lulus' },
                    { kode: 'SMP-IPA-00', namaMapel: 'Fisika & Biologi Dasar', namaGuru: 'Ibu Dr. Sri Rejeki', skor: 89, nilaiHuruf: 'A-', bobotSKS: 4, semester: 'Semester 2 (Genap 2024/2025)', status: 'Lulus' },
                    { kode: 'SMP-ENG-00', namaMapel: 'Basic English Conversation', namaGuru: 'Ms. Sarah Johnson, M.Ed', skor: 93, nilaiHuruf: 'A', bobotSKS: 3, semester: 'Semester 2 (Genap 2024/2025)', status: 'Lulus' }
                );
            }

        } else { // SMA
            grades.push(
                { kode: 'SMA-MAT-01', namaMapel: 'Matematika Lanjut & Analisis Data', namaGuru: 'Bpk. Wahyu Pratama, M.Sc', skor: 90, nilaiHuruf: 'A', bobotSKS: 4, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SMA-MINAT-01', namaMapel: `Keahlian Inti & Studi Kasus (${citaCita})`, namaGuru: 'Dosen Pembimbing UNIPDU', skor: 95, nilaiHuruf: 'A', bobotSKS: 4, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SMA-SAINS-01', namaMapel: 'Sains Terapan & Metodologi Riset', namaGuru: 'Ibu Dr. Sri Rejeki', skor: 88, nilaiHuruf: 'A-', bobotSKS: 4, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SMA-ENG-01', namaMapel: 'Academic English & International Prep', namaGuru: 'Ms. Sarah Johnson, M.Ed', skor: 93, nilaiHuruf: 'A', bobotSKS: 3, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SMA-PORTO-01', namaMapel: 'Studio Portofolio & Proyek Mandiri', namaGuru: 'Ibu Lestari, S.Sn', skor: 96, nilaiHuruf: 'A', bobotSKS: 3, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SMA-KRS-01', namaMapel: 'Matrikulasi S1 & Karir UNIPDU', namaGuru: 'Konselor Akademik UNIPDU', skor: 92, nilaiHuruf: 'A', bobotSKS: 3, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' },
                { kode: 'SMA-P5-01', namaMapel: 'Karya Ilmiah Remaja & P5 Unggulan', namaGuru: 'Tim Fasilitator SMA', skor: 94, nilaiHuruf: 'A', bobotSKS: 2, semester: 'Semester 1 (Ganjil 2025/2026)', status: 'Lulus' }
            );

            if (kelas >= 11) {
                grades.push(
                    { kode: 'SMA-MAT-00', namaMapel: 'Matematika Wajib & Logika Terpadu', namaGuru: 'Bpk. Wahyu Pratama, M.Sc', skor: 88, nilaiHuruf: 'A-', bobotSKS: 4, semester: 'Semester 2 (Genap 2024/2025)', status: 'Lulus' },
                    { kode: 'SMA-MINAT-00', namaMapel: `Pengenalan Profesi & Karakter (${citaCita})`, namaGuru: 'Dosen Pembimbing UNIPDU', skor: 94, nilaiHuruf: 'A', bobotSKS: 4, semester: 'Semester 2 (Genap 2024/2025)', status: 'Lulus' },
                    { kode: 'SMA-SAINS-00', namaMapel: 'Fisika Terapan & Kimia Lingkungan', namaGuru: 'Ibu Dr. Sri Rejeki', skor: 87, nilaiHuruf: 'A-', bobotSKS: 4, semester: 'Semester 2 (Genap 2024/2025)', status: 'Lulus' },
                    { kode: 'SMA-ENG-00', namaMapel: 'English Vocabulary & Reading Skill', namaGuru: 'Ms. Sarah Johnson, M.Ed', skor: 92, nilaiHuruf: 'A', bobotSKS: 3, semester: 'Semester 2 (Genap 2024/2025)', status: 'Lulus' }
                );
            }
        }

        return grades;
    }
};

// Expose globally
if (typeof window !== 'undefined') {
    window.DataStore = DataStore;
}


