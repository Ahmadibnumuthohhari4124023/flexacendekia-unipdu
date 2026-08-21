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

  // Helpers
  getSiswaList: function() { return JSON.parse(localStorage.getItem('siswaList')) || []; },
  getSiswaById: function(id) { return this.getSiswaList().find(s => s.id === id); },
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
