/**
 * Flexa Cendekia — Master Data Siswa (Clean Slate / Start from Zero)
 * Seluruh akun siswa dummy bawaan telah dihapus.
 * Data siswa hanya akan terisi saat pengguna mendaftarkan akun Siswa baru.
 */

const FLEXA_STUDENTS_DATA = [];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FLEXA_STUDENTS_DATA };
}
if (typeof window !== 'undefined') {
    window.FLEXA_STUDENTS_DATA = FLEXA_STUDENTS_DATA;
}
