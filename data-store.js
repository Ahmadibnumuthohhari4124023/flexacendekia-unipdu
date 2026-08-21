/**
 * Flexa Cendekia - Centralized Data Store
 * Handles all entity relationships, data persistence via localStorage, and central notification dispatch.
 */

const STORAGE_KEY = 'flexa_cendekia_db_v1';

// Initial Clean Data (Start from 0)
const DEFAULT_DATA = {
    users: [],
    krs: [],
    catatan: [],
    notifikasi: []
};

// Singleton DataStore Object
const DataStore = {
    _data: null,

    // Initialize the DB
    init() {
        if (this._data) return; // Already initialized in this session
        
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                this._data = JSON.parse(stored);
            } catch (e) {
                console.error("Failed to parse DataStore from localStorage", e);
                this._data = JSON.parse(JSON.stringify(DEFAULT_DATA));
            }
        } else {
            this._data = JSON.parse(JSON.stringify(DEFAULT_DATA));
            this.save();
        }
    },

    // Save changes to localStorage
    save() {
        if (this._data) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
            // Dispatch a global event so other tabs/scripts can listen for changes
            window.dispatchEvent(new Event('datastore-updated'));
        }
    },

    generateId(prefix) {
        return prefix + '-' + Math.random().toString(36).substr(2, 9);
    },

    // --- Users ---
    
    // For demo purposes, we allow hardcoding the active user per dashboard
    getCurrentUser(role) {
        this.init();
        // Since we don't have a real login system, we just return the first user of the requested role
        return this._data.users.find(u => u.role === role);
    },

    getUserById(id) {
        this.init();
        return this._data.users.find(u => u.id === id);
    },

    // --- KRS ---

    getKRSSiswa(siswaId) {
        this.init();
        return this._data.krs.filter(k => k.siswaId === siswaId).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    },

    getPendingKRSForGuru(guruId) {
        this.init();
        // Find all students for this guru
        const studentIds = this._data.users.filter(u => u.role === 'Siswa' && u.guruWaliId === guruId).map(u => u.id);
        return this._data.krs.filter(k => studentIds.includes(k.siswaId) && k.status === 'Menunggu Persetujuan');
    },

    ajukanKRS(siswaId, mataPelajaran, semester) {
        this.init();
        const siswa = this.getUserById(siswaId);
        if (!siswa) return null;

        const newKrs = {
            id: this.generateId('KRS'),
            siswaId: siswaId,
            semester: semester,
            mataPelajaran: mataPelajaran,
            status: 'Menunggu Persetujuan',
            tanggal: new Date().toISOString()
        };
        this._data.krs.push(newKrs);

        // Notif to Guru
        if (siswa.guruWaliId) {
            this.buatNotifikasi({
                untukRole: 'Guru',
                untukUserId: siswa.guruWaliId,
                tipe: 'KRS',
                judul: 'Pengajuan KRS Baru',
                isi: `Siswa ${siswa.nama} mengajukan KRS untuk semester ${semester}.`,
                terkaitId: newKrs.id
            });
        }
        
        this.save();
        return newKrs;
    },

    updateKRSStatus(krsId, status) {
        this.init();
        const krs = this._data.krs.find(k => k.id === krsId);
        if (!krs) return;
        krs.status = status;

        const siswa = this.getUserById(krs.siswaId);
        if (siswa) {
            // Notif to Siswa
            this.buatNotifikasi({
                untukRole: 'Siswa',
                untukUserId: siswa.id,
                tipe: 'KRS',
                judul: `KRS ${status}`,
                isi: `Pengajuan KRS semester ${krs.semester} Anda telah ${status.toLowerCase()} oleh Guru Pembimbing.`,
                terkaitId: krs.id
            });

            // Notif to Ortu
            if (siswa.orangTuaId) {
                this.buatNotifikasi({
                    untukRole: 'OrangTua',
                    untukUserId: siswa.orangTuaId,
                    tipe: 'KRS',
                    judul: `KRS Anak ${status}`,
                    isi: `KRS ${siswa.nama} untuk semester ${krs.semester} telah ${status.toLowerCase()}.`,
                    terkaitId: krs.id
                });
            }
        }
        this.save();
    },

    // --- Catatan (Feedback) ---

    getCatatanSiswa(siswaId) {
        this.init();
        return this._data.catatan.filter(c => c.siswaId === siswaId).sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    },

    tambahCatatanGuru(guruId, siswaId, isi) {
        this.init();
        const guru = this.getUserById(guruId);
        const siswa = this.getUserById(siswaId);
        if (!guru || !siswa) return null;

        const newCatatan = {
            id: this.generateId('C'),
            guruId: guruId,
            siswaId: siswaId,
            isi: isi,
            tanggal: new Date().toISOString(),
            balasan: []
        };
        this._data.catatan.push(newCatatan);

        // Notif to Ortu
        if (siswa.orangTuaId) {
            this.buatNotifikasi({
                untukRole: 'OrangTua',
                untukUserId: siswa.orangTuaId,
                tipe: 'Catatan',
                judul: 'Catatan Baru dari Guru',
                isi: `Guru ${guru.nama} menambahkan evaluasi baru untuk ${siswa.nama}.`,
                terkaitId: newCatatan.id
            });
        }
        
        // Notif to Siswa (optional, depending on design)
        this.buatNotifikasi({
            untukRole: 'Siswa',
            untukUserId: siswa.id,
            tipe: 'Catatan',
            judul: 'Evaluasi Guru',
            isi: `Ada catatan evaluasi baru dari ${guru.nama}.`,
            terkaitId: newCatatan.id
        });

        this.save();
        return newCatatan;
    },

    balasCatatanOrtu(catatanId, ortuId, isi) {
        this.init();
        const catatan = this._data.catatan.find(c => c.id === catatanId);
        const ortu = this.getUserById(ortuId);
        if (!catatan || !ortu) return null;

        const balasanBaru = {
            orangTuaId: ortuId,
            isi: isi,
            tanggal: new Date().toISOString()
        };
        catatan.balasan.push(balasanBaru);

        // Notif to Guru
        const siswa = this.getUserById(catatan.siswaId);
        this.buatNotifikasi({
            untukRole: 'Guru',
            untukUserId: catatan.guruId,
            tipe: 'Catatan_Balasan',
            judul: 'Balasan dari Orang Tua',
            isi: `Orang tua dari ${siswa ? siswa.nama : 'siswa'} membalas catatan Anda.`,
            terkaitId: catatan.id
        });

        this.save();
        return balasanBaru;
    },

    // --- Notifikasi ---

    buatNotifikasi({untukRole, untukUserId, tipe, judul, isi, terkaitId}) {
        this.init();
        const newNotif = {
            id: this.generateId('N'),
            untukRole,
            untukUserId,
            tipe,
            judul,
            isi,
            terkaitId,
            dibaca: false,
            tanggal: new Date().toISOString()
        };
        this._data.notifikasi.push(newNotif);
        // We don't call save() here, assume the calling function (ajukanKRS etc) will call save()
    },

    getNotifikasi(role, userId) {
        this.init();
        return this._data.notifikasi
            .filter(n => n.untukRole === role && n.untukUserId === userId)
            .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    },

    getUnreadNotifikasiCount(role, userId) {
        return this.getNotifikasi(role, userId).filter(n => !n.dibaca).length;
    },

    markNotifikasiRead(notifId) {
        this.init();
        const notif = this._data.notifikasi.find(n => n.id === notifId);
        if (notif && !notif.dibaca) {
            notif.dibaca = true;
            this.save();
        }
    },
    
    markAllNotifikasiRead(role, userId) {
        this.init();
        let changed = false;
        this._data.notifikasi.forEach(n => {
            if (n.untukRole === role && n.untukUserId === userId && !n.dibaca) {
                n.dibaca = true;
                changed = true;
            }
        });
        if (changed) this.save();
    }
};

// Initialize immediately on load so it's ready
DataStore.init();

// Export for module usage (if needed) or global attachment
if (typeof window !== 'undefined') {
    window.DataStore = DataStore;
}
