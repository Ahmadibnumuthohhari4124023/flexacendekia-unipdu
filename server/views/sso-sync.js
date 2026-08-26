/**
 * SSO Sync Engine
 * Sumber kebenaran (Source of Truth) data Flexa Cendekia.
 * Berbasis localStorage dan terintegrasi dengan Firebase DataStore.
 */

const SSOSync = {
  // Initialize storage if needed (clean baseline)
  init: function() {
    if (!localStorage.getItem('sso_initialized')) {
      this._seedData();
      localStorage.setItem('sso_initialized', 'true');
    }
  },

  _seedData: function() {
    // Inisialisasi awal bersih (titik 0)
    if (!localStorage.getItem('guruNoteReplies')) {
      localStorage.setItem('guruNoteReplies', JSON.stringify([]));
    }
  },

  // Helpers Data
  getAbsensi: function(studentId) {
    const data = JSON.parse(localStorage.getItem('absensiData')) || {};
    return data[studentId] || null;
  },

  getNilaiMapel: function(studentId) {
    const data = JSON.parse(localStorage.getItem('nilaiMapel')) || {};
    return data[studentId] || [];
  },

  getNotifikasiArsip: function(studentId) {
    const data = JSON.parse(localStorage.getItem('notifikasiArsip')) || [];
    if (studentId) return data.filter(n => n.studentId === studentId);
    return data;
  },

  getGuruNoteReplies: function() {
    return JSON.parse(localStorage.getItem('guruNoteReplies')) || [];
  },

  replyGuruNote: function(replyText, ortuNama) {
    const replies = this.getGuruNoteReplies();
    replies.push({
      id: 'REPLY-' + Date.now(),
      text: replyText,
      pengirim: ortuNama || 'Orang Tua',
      waktu: this.getRealtimeDate('long')
    });
    localStorage.setItem('guruNoteReplies', JSON.stringify(replies));
  },

  // --- Multi-Account Registry (Persistent Local Hybrid Store) ---
  saveUser: function(user) {
    if (!user || !user.nama) return;
    const users = this.getAllUsers();
    const id = user.uid || user.id || user.nisn || user.nis || user.email || 'user_' + Date.now();
    const idx = users.findIndex(u => (u.uid && u.uid === id) || (u.id && u.id === id) || (u.email && u.email.toLowerCase() === (user.email||'').toLowerCase()) || (u.nama && u.nama.toLowerCase() === user.nama.toLowerCase()));
    const updated = Object.assign({}, idx !== -1 ? users[idx] : {}, user, { id: id, uid: id });
    if (idx !== -1) {
      users[idx] = updated;
    } else {
      users.push(updated);
    }
    localStorage.setItem('flexa_all_registered_users', JSON.stringify(users));
    window.dispatchEvent(new CustomEvent('flexa-users-updated', { detail: users }));
    return updated;
  },

  getAllUsers: function() {
    try {
      return JSON.parse(localStorage.getItem('flexa_all_registered_users') || '[]');
    } catch(e) {
      return [];
    }
  },

  getAllStudents: function() {
    const users = this.getAllUsers();
    return users.filter(u => {
      if (!u) return false;
      const r = (u.role || '').toLowerCase();
      if (r === 'guru' || r === 'orangtua' || r === 'orang_tua' || r === 'admin') return false;
      if (u.nip || u.bidang) return false; // Guru specific properties
      return r === 'siswa' || (!r && (u.jenjang || u.citaCita || u.statusKRS || u.nis || u.nisn));
    });
  },

  saveKRS: function(krs) {
    if (!krs) return;
    const list = this.getAllKRS();
    const id = krs.id || `krs_${krs.siswaId || Date.now()}`;
    const idx = list.findIndex(k => k.id === id || (k.siswaId && k.siswaId === krs.siswaId));
    const updated = Object.assign({}, idx !== -1 ? list[idx] : {}, krs, { id: id });
    if (idx !== -1) {
      list[idx] = updated;
    } else {
      list.push(updated);
    }
    localStorage.setItem('flexa_all_krs_submissions', JSON.stringify(list));
    window.dispatchEvent(new CustomEvent('flexa-krs-updated', { detail: list }));

    // Auto-update student user statusKRS in user registry
    if (krs.siswaId || krs.nama) {
      this.saveUser({
        uid: krs.siswaId,
        id: krs.siswaId,
        nama: krs.nama,
        jenjang: krs.jenjang,
        kelas: krs.kelas,
        citaCita: krs.citaCita,
        statusKRS: krs.status || 'Menunggu Validasi',
        role: 'Siswa'
      });
    }
    return updated;
  },

  getAllKRS: function() {
    try {
      return JSON.parse(localStorage.getItem('flexa_all_krs_submissions') || '[]');
    } catch(e) {
      return [];
    }
  },

  approveKRS: function(krsId, guruId, guruNama) {
    const list = this.getAllKRS();
    const item = list.find(k => k.id === krsId || k.siswaId === krsId);
    if (item) {
      item.status = 'Disetujui';
      item.verifiedBy = guruId;
      item.guruNama = guruNama;
      localStorage.setItem('flexa_all_krs_submissions', JSON.stringify(list));
      window.dispatchEvent(new CustomEvent('flexa-krs-updated', { detail: list }));

      if (item.siswaId) {
        this.saveUser({
          uid: item.siswaId,
          statusKRS: 'Disetujui',
          guruWaliId: guruId,
          guruWaliNama: guruNama
        });
      }
    }
  },

  // Helpers
  getSiswaList: function() { return this.getAllStudents(); },
  getSiswaById: function(id) { return this.getAllStudents().find(s => s.id === id || s.uid === id); },
  getGuru: function() { return JSON.parse(localStorage.getItem('guru')); },
  getOrtu: function() { return JSON.parse(localStorage.getItem('ortu')); },
  
  getKRSPending: function() { return JSON.parse(localStorage.getItem('krsPending')) || []; },
  approveKRS: function(id) {
    let pending = this.getKRSPending();
    pending = pending.filter(k => k.id !== id);
    localStorage.setItem('krsPending', JSON.stringify(pending));
  },
  rejectKRS: function(id) {
    let pending = this.getKRSPending();
    let krs = pending.find(k => k.id === id);
    if(krs) krs.status = 'Ditolak';
    localStorage.setItem('krsPending', JSON.stringify(pending));
  },

  getAspirasiPending: function() { return JSON.parse(localStorage.getItem('aspirasiPending')) || []; },
  approveAspirasi: function(id) {
    let pending = this.getAspirasiPending();
    pending = pending.filter(a => a.id !== id);
    localStorage.setItem('aspirasiPending', JSON.stringify(pending));
  },
  rejectAspirasi: function(id) {
    let pending = this.getAspirasiPending();
    let asp = pending.find(a => a.id === id);
    if(asp) asp.status = 'Ditolak';
    localStorage.setItem('aspirasiPending', JSON.stringify(pending));
  },

  getRiskStudents: function() { return JSON.parse(localStorage.getItem('riskStudents')) || []; },
  
  getGuruNotes: function(studentId) {
    const notes = JSON.parse(localStorage.getItem('guruNotes')) || [];
    if (studentId) return notes.filter(n => n.studentId === studentId);
    return notes;
  },

  getDiagnosisResult: function(studentId) {
    return JSON.parse(localStorage.getItem('diagnosisResult'));
  },

  // Realtime Generators
  getCurrentSemester: function() {
    const d = new Date();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const isGanjil = month >= 7 || month <= 12; // Ganjil: Jul-Dec, Genap: Jan-Jun
    const tahunAjaran = isGanjil ? `${year}/${year+1}` : `${year-1}/${year}`;
    return `Semester ${isGanjil ? 'Ganjil' : 'Genap'} ${tahunAjaran}`;
  },

  getCurrentAcademicYear: function() {
    const d = new Date();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return month >= 7 ? year : year - 1;
  },

  getRealtimeDate: function(format = 'short') {
    const d = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    if (format === 'short') return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')} WIB`;
  },
  
  getRoadmapStartYear: function() {
      return this.getCurrentAcademicYear() - 1;
  }
};

// Auto-init on load
SSOSync.init();
