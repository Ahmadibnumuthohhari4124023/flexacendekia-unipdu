const fs = require('fs');
const path = require('path');

const filesToCheck = [
    'server/views/09_krs-siswa.html',
    'server/views/15_tinjauan-guru.html',
    'server/views/16_dashboard-ortu.html',
    'server/views/17_notifikasi.html'
];

filesToCheck.forEach(f => {
    const content = fs.readFileSync(path.join(__dirname, f), 'utf8');
    const hasDataStore = content.includes('/data-store.js');
    const hasNotifSync = content.includes('/notification-sync.js');
    const hasOldPath = content.includes('../data-store.js');
    const hasDataStoreClass = content.includes('DataStore.getCurrentUser');
    console.log(f + ':');
    console.log('  Has /data-store.js: ' + hasDataStore);
    console.log('  Has /notification-sync.js: ' + hasNotifSync);
    console.log('  Old relative path still exists: ' + hasOldPath);
    console.log('  Has DataStore.getCurrentUser: ' + hasDataStoreClass);
    console.log('');
});
