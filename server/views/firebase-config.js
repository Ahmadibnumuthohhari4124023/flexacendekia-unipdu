/**
 * Flexa Cendekia — Firebase Configuration (Centralized)
 * 
 * Semua halaman meng-include file ini satu kali saja.
 * File ini memuat Firebase SDK (compat) via CDN dan menginisialisasi
 * App, Auth, dan Firestore sebagai variabel global.
 * 
 * PENTING: File ini HARUS dimuat SEBELUM firebase-auth-guard.js
 *          dan firebase-data-store.js.
 */

// =============================================
// Firebase SDK Loader (Compat — works without bundler)
// =============================================
(function() {
    // Cek apakah Firebase sudah dimuat (hindari duplikasi)
    if (window.firebase) return;

    // Daftar script Firebase yang perlu dimuat secara synchronous
    const scripts = [
        'https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js',
        'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js',
        'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js'
    ];

    scripts.forEach(src => {
        document.write('<script src="' + src + '"><\/script>');
    });
})();

// =============================================
// Firebase Init (berjalan setelah SDK dimuat)
// =============================================
function _initFirebase() {
    if (!window.firebase) {
        console.error('[Firebase] SDK gagal dimuat. Periksa koneksi internet.');
        return;
    }

    if (firebase.apps.length === 0) {
        firebase.initializeApp({
            apiKey: "AIzaSyBybYZrGTpgjr0UXTfYozN0K5btCXlFiIg",
            authDomain: "flexa-cendekia-960bf.firebaseapp.com",
            projectId: "flexa-cendekia-960bf",
            storageBucket: "flexa-cendekia-960bf.firebasestorage.app",
            messagingSenderId: "630837588259",
            appId: "1:630837588259:web:ab00ec0945b8eaad3adc96",
            measurementId: "G-PQ2CG8EX97"
        });
    }

    // Expose global references
    window.firebaseAuth = firebase.auth();
    window.firebaseDb = firebase.firestore();

    // Dispatch event so other scripts know Firebase is ready
    window.dispatchEvent(new Event('firebase-ready'));
}

// Jika DOM sudah loaded (script dimuat di akhir body), init langsung.
// Jika belum, tunggu DOMContentLoaded.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _initFirebase);
} else {
    _initFirebase();
}
