/**
 * Flexa Cendekia — Integration Verifier (Node.js)
 * Checks that all migrated HTML files have the correct DataStore references.
 */
const fs = require('fs');
const path = require('path');

const viewsDir = path.join(__dirname, 'server', 'views');

const checks = [
    {
        file: '09_krs-siswa.html',
        role: 'Siswa',
        mustContain: [
            'DataStore.getCurrentUser',
            'DataStore.getKRSSiswa',
            'DataStore.ajukanKRS',
            'DataStore.getCatatanSiswa',
            '/data-store.js',
            '/notification-sync.js'
        ]
    },
    {
        file: '15_tinjauan-guru.html',
        role: 'Guru',
        mustContain: [
            'DataStore.getCurrentUser',
            'DataStore.getPendingKRSForGuru',
            'DataStore.updateKRSStatus',
            'DataStore.tambahCatatanGuru',
            '/data-store.js',
            '/notification-sync.js'
        ]
    },
    {
        file: '16_dashboard-ortu.html',
        role: 'OrangTua',
        mustContain: [
            'DataStore.getCurrentUser',
            'DataStore.getCatatanSiswa',
            'DataStore.balasCatatanOrtu',
            'DataStore.getNotifikasi',
            '/data-store.js',
            '/notification-sync.js'
        ]
    },
    {
        file: '17_notifikasi.html',
        role: 'All',
        mustContain: [
            'DataStore.getNotifikasi',
            'DataStore.markNotifikasiRead',
            'DataStore.markAllNotifikasiRead',
            '/data-store.js',
            '/notification-sync.js'
        ]
    }
];

let allPassed = true;
console.log('=== Flexa Cendekia — Integration Verification ===\n');

checks.forEach(check => {
    const filePath = path.join(viewsDir, check.file);
    if (!fs.existsSync(filePath)) {
        console.log(`❌ MISSING: ${check.file}`);
        allPassed = false;
        return;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    let allPass = true;
    const failures = [];
    
    check.mustContain.forEach(token => {
        if (!content.includes(token)) {
            allPass = false;
            failures.push('  MISSING: ' + token);
        }
    });
    
    if (allPass) {
        console.log(`✅ PASS: ${check.file} (${check.role})`);
    } else {
        console.log(`❌ FAIL: ${check.file} (${check.role})`);
        failures.forEach(f => console.log(f));
        allPassed = false;
    }
});

// Verify data-store.js has proper API
console.log('\n=== Verifying data-store.js API ===');
const dsPath = path.join(viewsDir, 'data-store.js');
if (fs.existsSync(dsPath)) {
    const ds = fs.readFileSync(dsPath, 'utf8');
    const apiMethods = [
        'getCurrentUser', 'getUserById',
        'getKRSSiswa', 'getPendingKRSForGuru', 'ajukanKRS', 'updateKRSStatus',
        'getCatatanSiswa', 'tambahCatatanGuru', 'balasCatatanOrtu',
        'buatNotifikasi', 'getNotifikasi', 'getUnreadNotifikasiCount',
        'markNotifikasiRead', 'markAllNotifikasiRead'
    ];
    
    const missingMethods = apiMethods.filter(m => !ds.includes(m));
    if (missingMethods.length === 0) {
        console.log('✅ All API methods present in data-store.js');
    } else {
        console.log('❌ Missing methods:', missingMethods.join(', '));
        allPassed = false;
    }
} else {
    console.log('❌ data-store.js not found in server/views/');
    allPassed = false;
}

// Verify notification-sync.js
const nsPath = path.join(viewsDir, 'notification-sync.js');
if (fs.existsSync(nsPath)) {
    console.log('✅ notification-sync.js present in server/views/');
} else {
    console.log('❌ notification-sync.js not found in server/views/');
    allPassed = false;
}

console.log('\n' + (allPassed ? '🎉 ALL CHECKS PASSED!' : '⚠️  Some checks failed — review above.'));
