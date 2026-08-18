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
            // Auto-provision initial attendance record directly in Firestore if missing
            const userDoc = await db.collection('users').doc(siswaId).get();
            const userData = userDoc.exists ? userDoc.data() : {};
            const isAhmad = (userData.email && userData.email.includes('siswa@')) || (userData.nama && userData.nama.toLowerCase().includes('ahmad'));
            
            const initialData = isAhmad ? {
                siswaId: siswaId,
                hadir: 80,
                izin: 6,
                sakit: 0,
                alpa: 8,
                total: 94,
                persentase: 85,
                status: 'Perlu Perhatian',
                semester: 'Semester Ganjil 2023/2024',
                catatan: 'Tingkat kehadiran di bawah 90%, perlu perhatian pada jam pertama.',
                updateTerakhir: new Date().toISOString()
            } : {
                siswaId: siswaId,
                hadir: 92,
                izin: 2,
                sakit: 0,
                alpa: 0,
                total: 94,
                persentase: 98,
                status: 'Sangat Baik',
                semester: 'Semester Ganjil 2023/2024',
                catatan: 'Kehadiran konsisten dan disiplin.',
                updateTerakhir: new Date().toISOString()
            };
            
            await db.collection('kehadiran').doc(siswaId).set(initialData);
            return Object.assign({ id: siswaId }, initialData);
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

            // 3. Fallback dev / dummy jika relasi belum diset
            const allSiswa = await db.collection('users').where('role', '==', 'Siswa').get();
            if (!allSiswa.empty) {
                return allSiswa.docs.map(d => Object.assign({ id: d.id, uid: d.id }, d.data()));
            }
        } catch (e) {
            console.error('[DataStore] getAnakByOrtuId error:', e);
        }
        return [];
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

            // Auto-provision realistic grades if not yet in Firestore
            let userData = {};
            try {
                const userDoc = await db.collection('users').doc(siswaId).get();
                if (userDoc.exists) userData = userDoc.data();
            } catch(_e) {}

            const citaCita = (userData.citaCita || 'arsitek').toLowerCase();
            const jenjang = (userData.jenjang || 'SMA').toUpperCase();
            const sampleGrades = [];
            
            if (citaCita.includes('arsitek') || citaCita.includes('desain') || citaCita.includes('seni')) {
                sampleGrades.push(
                    { siswaId, kode: 'ARTS-315', namaMapel: 'Perspektif 2 Titik Hilang & Sketsa', namaGuru: 'Ibu Lestari, S.Sn', nilaiHuruf: 'A', skor: 95, bobotSKS: 3, status: 'Lulus', semester: 'Semester 3 (2023/2024)', semesterNum: 3 },
                    { siswaId, kode: 'PHYS-301', namaMapel: 'Fisika Bangunan & Akustik', namaGuru: 'Drs. Amir Santoso', nilaiHuruf: 'B+', skor: 84, bobotSKS: 3, status: 'Berlangsung', semester: 'Semester 3 (2023/2024)', semesterNum: 3 },
                    { siswaId, kode: 'MATH-301', namaMapel: 'Matematika Geometri Ruang Lanjut', namaGuru: 'Dr. Aris Subagyo', nilaiHuruf: 'B', skor: 78, bobotSKS: 4, status: 'Berlangsung', semester: 'Semester 3 (2023/2024)', semesterNum: 3 },
                    { siswaId, kode: 'DSGN-302', namaMapel: 'CAD & Pemodelan 3D SketchUp', namaGuru: 'Bapak Hendra, M.T', nilaiHuruf: 'A', skor: 92, bobotSKS: 3, status: 'Lulus', semester: 'Semester 3 (2023/2024)', semesterNum: 3 },
                    
                    { siswaId, kode: 'MATH-202', namaMapel: 'Kalkulus & Trigonometri Dasar', namaGuru: 'Dr. Aris Subagyo', nilaiHuruf: 'A', skor: 96, bobotSKS: 4, status: 'Lulus', semester: 'Semester 2 (2022/2023)', semesterNum: 2 },
                    { siswaId, kode: 'PHYS-201', namaMapel: 'Mekanika Klasik & Vektor Gaya', namaGuru: 'Prof. Siti Aminah', nilaiHuruf: 'A-', skor: 89, bobotSKS: 3, status: 'Lulus', semester: 'Semester 2 (2022/2023)', semesterNum: 2 },
                    { siswaId, kode: 'ARTS-201', namaMapel: 'Prinsip Estetika & Teori Warna', namaGuru: 'Ibu Lestari, S.Sn', nilaiHuruf: 'A', skor: 93, bobotSKS: 3, status: 'Lulus', semester: 'Semester 2 (2022/2023)', semesterNum: 2 },
                    { siswaId, kode: 'ENG-201', namaMapel: 'English for Technical Presentation', namaGuru: 'Bapak John Davies', nilaiHuruf: 'B+', skor: 85, bobotSKS: 2, status: 'Lulus', semester: 'Semester 2 (2022/2023)', semesterNum: 2 },

                    { siswaId, kode: 'MATH-101', namaMapel: 'Aljabar & Logika Matematika', namaGuru: 'Dr. Aris Subagyo', nilaiHuruf: 'A', skor: 94, bobotSKS: 3, status: 'Arsip', semester: 'Semester 1 (2021/2022)', semesterNum: 1 },
                    { siswaId, kode: 'INDO-101', namaMapel: 'Bahasa Indonesia & Penulisan Ilmiah', namaGuru: 'Dra. Nurhayati, M.Pd', nilaiHuruf: 'A-', skor: 88, bobotSKS: 3, status: 'Arsip', semester: 'Semester 1 (2021/2022)', semesterNum: 1 },
                    { siswaId, kode: 'ARTS-101', namaMapel: 'Dasar Gambar Sketsa & Proporsi', namaGuru: 'Ibu Lestari, S.Sn', nilaiHuruf: 'A', skor: 98, bobotSKS: 3, status: 'Arsip', semester: 'Semester 1 (2021/2022)', semesterNum: 1 }
                );
            } else if (citaCita.includes('program') || citaCita.includes('data') || citaCita.includes('informatika') || citaCita.includes('komputer')) {
                sampleGrades.push(
                    { siswaId, kode: 'PROG-301', namaMapel: 'Struktur Data & Algoritma Lanjut', namaGuru: 'Ir. Ahmad Zaki, M.Kom', nilaiHuruf: 'A', skor: 95, bobotSKS: 4, status: 'Berlangsung', semester: 'Semester 3 (2023/2024)', semesterNum: 3 },
                    { siswaId, kode: 'MATH-302', namaMapel: 'Matematika Diskrit & Teori Graf', namaGuru: 'Dr. Aris Subagyo', nilaiHuruf: 'A-', skor: 89, bobotSKS: 3, status: 'Berlangsung', semester: 'Semester 3 (2023/2024)', semesterNum: 3 },
                    { siswaId, kode: 'DB-301', namaMapel: 'Basis Data Relasional & SQL', namaGuru: 'Ibu Rina, M.Kom', nilaiHuruf: 'A', skor: 94, bobotSKS: 3, status: 'Lulus', semester: 'Semester 3 (2023/2024)', semesterNum: 3 },
                    { siswaId, kode: 'AI-301', namaMapel: 'Pengantar Kecerdasan Buatan & ML', namaGuru: 'Dr. Teguh Santoso', nilaiHuruf: 'B+', skor: 83, bobotSKS: 3, status: 'Berlangsung', semester: 'Semester 3 (2023/2024)', semesterNum: 3 },

                    { siswaId, kode: 'PROG-201', namaMapel: 'Pemrograman Berorientasi Objek', namaGuru: 'Ir. Ahmad Zaki, M.Kom', nilaiHuruf: 'A', skor: 97, bobotSKS: 4, status: 'Lulus', semester: 'Semester 2 (2022/2023)', semesterNum: 2 },
                    { siswaId, kode: 'NET-201', namaMapel: 'Jaringan Komputer & Protokol Jaringan', namaGuru: 'Bapak Hendra, S.Kom', nilaiHuruf: 'B+', skor: 86, bobotSKS: 3, status: 'Lulus', semester: 'Semester 2 (2022/2023)', semesterNum: 2 },
                    { siswaId, kode: 'MATH-201', namaMapel: 'Kalkulus Diferensial Komputasi', namaGuru: 'Dr. Aris Subagyo', nilaiHuruf: 'A-', skor: 88, bobotSKS: 3, status: 'Lulus', semester: 'Semester 2 (2022/2023)', semesterNum: 2 },

                    { siswaId, kode: 'PROG-101', namaMapel: 'Dasar Pemrograman Python', namaGuru: 'Ir. Ahmad Zaki, M.Kom', nilaiHuruf: 'A', skor: 98, bobotSKS: 4, status: 'Arsip', semester: 'Semester 1 (2021/2022)', semesterNum: 1 },
                    { siswaId, kode: 'MATH-101', namaMapel: 'Logika & Aljabar Boolean', namaGuru: 'Dr. Aris Subagyo', nilaiHuruf: 'A', skor: 92, bobotSKS: 3, status: 'Arsip', semester: 'Semester 1 (2021/2022)', semesterNum: 1 }
                );
            } else if (citaCita.includes('dokter') || citaCita.includes('kesehatan') || citaCita.includes('perawat') || citaCita.includes('farmasi') || citaCita.includes('gizi')) {
                sampleGrades.push(
                    { siswaId, kode: 'BIO-301', namaMapel: 'Anatomi & Fisiologi Manusia', namaGuru: 'Dr. dr. Siti Rahayu, Sp.A', nilaiHuruf: 'A', skor: 94, bobotSKS: 4, status: 'Berlangsung', semester: 'Semester 3 (2023/2024)', semesterNum: 3 },
                    { siswaId, kode: 'CHEM-301', namaMapel: 'Biokimia & Metabolisme', namaGuru: 'Prof. Bambang Utomo', nilaiHuruf: 'A-', skor: 88, bobotSKS: 4, status: 'Berlangsung', semester: 'Semester 3 (2023/2024)', semesterNum: 3 },
                    { siswaId, kode: 'MED-301', namaMapel: 'Etika Medis & Komunikasi Pasien', namaGuru: 'dr. Haryono, M.Kes', nilaiHuruf: 'A', skor: 96, bobotSKS: 2, status: 'Lulus', semester: 'Semester 3 (2023/2024)', semesterNum: 3 },

                    { siswaId, kode: 'BIO-201', namaMapel: 'Biologi Sel & Genetika Molekuler', namaGuru: 'Dr. dr. Siti Rahayu, Sp.A', nilaiHuruf: 'A', skor: 95, bobotSKS: 4, status: 'Lulus', semester: 'Semester 2 (2022/2023)', semesterNum: 2 },
                    { siswaId, kode: 'CHEM-201', namaMapel: 'Kimia Organik Medis', namaGuru: 'Prof. Bambang Utomo', nilaiHuruf: 'B+', skor: 85, bobotSKS: 3, status: 'Lulus', semester: 'Semester 2 (2022/2023)', semesterNum: 2 },
                    { siswaId, kode: 'PHYS-201', namaMapel: 'Biofisika & Instrumentasi Medis', namaGuru: 'Drs. Amir Santoso', nilaiHuruf: 'A-', skor: 89, bobotSKS: 3, status: 'Lulus', semester: 'Semester 2 (2022/2023)', semesterNum: 2 },

                    { siswaId, kode: 'BIO-101', namaMapel: 'Biologi Umum & Mikrobiologi', namaGuru: 'Dr. dr. Siti Rahayu, Sp.A', nilaiHuruf: 'A', skor: 97, bobotSKS: 4, status: 'Arsip', semester: 'Semester 1 (2021/2022)', semesterNum: 1 },
                    { siswaId, kode: 'CHEM-101', namaMapel: 'Kimia Dasar & Stoikiometri', namaGuru: 'Prof. Bambang Utomo', nilaiHuruf: 'A', skor: 91, bobotSKS: 3, status: 'Arsip', semester: 'Semester 1 (2021/2022)', semesterNum: 1 }
                );
            } else {
                sampleGrades.push(
                    { siswaId, kode: 'KARIER-301', namaMapel: 'Keahlian Inti: ' + (userData.citaCita || 'Spesialisasi'), namaGuru: 'Drs. Pembimbing, M.Pd', nilaiHuruf: 'A', skor: 94, bobotSKS: 4, status: 'Berlangsung', semester: 'Semester 3 (2023/2024)', semesterNum: 3 },
                    { siswaId, kode: 'MATH-301', namaMapel: 'Matematika Terapan & Logika Analitik', namaGuru: 'Dr. Aris Subagyo', nilaiHuruf: 'A-', skor: 88, bobotSKS: 3, status: 'Berlangsung', semester: 'Semester 3 (2023/2024)', semesterNum: 3 },
                    { siswaId, kode: 'LANG-301', namaMapel: 'Bahasa Inggris Komunikasi Akademik', namaGuru: 'Bapak John Davies', nilaiHuruf: 'A', skor: 93, bobotSKS: 3, status: 'Lulus', semester: 'Semester 3 (2023/2024)', semesterNum: 3 },

                    { siswaId, kode: 'KARIER-201', namaMapel: 'Fondasi Karier ' + (userData.citaCita || 'Utama'), namaGuru: 'Drs. Pembimbing, M.Pd', nilaiHuruf: 'A', skor: 95, bobotSKS: 4, status: 'Lulus', semester: 'Semester 2 (2022/2023)', semesterNum: 2 },
                    { siswaId, kode: 'SAINS-201', namaMapel: 'Sains Eksperimental & Metode Riset', namaGuru: 'Prof. Siti Aminah', nilaiHuruf: 'B+', skor: 86, bobotSKS: 3, status: 'Lulus', semester: 'Semester 2 (2022/2023)', semesterNum: 2 },
                    { siswaId, kode: 'SOS-201', namaMapel: 'Kepemimpinan & Komunikasi Publik', namaGuru: 'Dra. Nurhayati, M.Pd', nilaiHuruf: 'A', skor: 92, bobotSKS: 3, status: 'Lulus', semester: 'Semester 2 (2022/2023)', semesterNum: 2 },

                    { siswaId, kode: 'DASAR-101', namaMapel: 'Pengantar Wawasan Profesi & Etika', namaGuru: 'Drs. Pembimbing, M.Pd', nilaiHuruf: 'A', skor: 97, bobotSKS: 3, status: 'Arsip', semester: 'Semester 1 (2021/2022)', semesterNum: 1 },
                    { siswaId, kode: 'INDO-101', namaMapel: 'Bahasa Indonesia & Literasi Kritis', namaGuru: 'Dra. Nurhayati, M.Pd', nilaiHuruf: 'A', skor: 90, bobotSKS: 3, status: 'Arsip', semester: 'Semester 1 (2021/2022)', semesterNum: 1 }
                );
            }

            // Save to Firestore in background
            try {
                for (const item of sampleGrades) {
                    await db.collection('nilaiAkademik').add(item);
                }
            } catch(_err) {}

            return sampleGrades;
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
        if (!db) return [];
        try {
            // Get all students for this guru
            const studentsSnap = await db.collection('users')
                .where('role', '==', 'Siswa')
                .where('guruWaliId', '==', guruId)
                .get();
            const studentIds = studentsSnap.docs.map(d => d.id);
            
            if (studentIds.length === 0) return [];

            // Firestore 'in' query supports max 30 items
            const snap = await db.collection('pengajuanKRS')
                .where('siswaId', 'in', studentIds)
                .where('status', '==', 'Menunggu Persetujuan')
                .get();
            return snap.docs.map(d => Object.assign({ id: d.id }, d.data()));
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

            // Auto-provision initial greeting if empty
            return [
                {
                    id: 'init_msg_1',
                    siswaId: siswaId,
                    guruId: guruId || 'guru_lestari_01',
                    pengirimRole: 'Guru',
                    pengirimNama: 'Ibu Lestari, S.Sn',
                    pesan: 'Halo! Selamat datang di sesi bimbingan Flexa Cendekia. Silakan tanyakan hal-hal seputar roadmap karir, mata pelajaran pilihan, atau checkpoint Jumat jika ada yang perlu didiskusikan ya.',
                    topik: 'Penyambutan Pembimbing',
                    tanggal: new Date(Date.now() - 86400000).toISOString()
                }
            ];
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
    }
};

// Expose globally
if (typeof window !== 'undefined') {
    window.DataStore = DataStore;
}

