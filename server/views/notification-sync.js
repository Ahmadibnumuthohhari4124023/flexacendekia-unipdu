/**
 * Flexa Cendekia - Notification Synchronization Script
 * Included on all pages to ensure the notification badge is up-to-date
 * based on the centralized data-store.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Determine current role based on URL or generic path
    const path = window.location.pathname;
    let activeRole = 'Siswa'; // Default
    if (path.includes('14_') || path.includes('15_')) {
        activeRole = 'Guru';
    } else if (path.includes('16_')) {
        activeRole = 'OrangTua';
    } else if (path.includes('17_')) {
        // Notification page itself might be accessed by anyone, 
        // we'll try to infer from a session variable if we had one.
        // For this demo, let's look at localStorage 'lastActiveRole' if we set it.
        activeRole = localStorage.getItem('lastActiveRole') || 'Siswa';
    }

    // Save active role so global pages (like profile/notifikasi) know who is viewing
    if (!path.includes('17_') && !path.includes('18_')) {
        localStorage.setItem('lastActiveRole', activeRole);
    } else {
        activeRole = localStorage.getItem('lastActiveRole') || 'Siswa';
    }

    // Get the current user for that role from DataStore
    const currentUser = DataStore.getCurrentUser(activeRole);

    function updateNotificationBadge() {
        if (!currentUser) return;
        
        const unreadCount = DataStore.getUnreadNotifikasiCount(activeRole, currentUser.id);
        
        // Find notification icons in the top navbar
        // It's usually an <a> or <div> with href to notifikasi or an icon with class 'notifications'
        // In the design, it's often a red dot span next to the notification icon
        const bellIcons = document.querySelectorAll('span.material-symbols-outlined');
        
        bellIcons.forEach(icon => {
            if (icon.textContent.trim() === 'notifications') {
                const parent = icon.parentElement;
                let badge = parent.querySelector('.bg-red-500, .bg-error'); // Look for the red dot
                
                if (unreadCount > 0) {
                    if (!badge) {
                        // Create badge if it doesn't exist
                        badge = document.createElement('span');
                        badge.className = 'absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full';
                        parent.appendChild(badge);
                    }
                    // Optional: show number if we want
                    // badge.textContent = unreadCount;
                    badge.style.display = 'block';
                } else {
                    if (badge) {
                        badge.style.display = 'none';
                    }
                }
            }
        });
    }

    // Initial update
    updateNotificationBadge();

    // Listen for global updates from DataStore
    window.addEventListener('datastore-updated', () => {
        updateNotificationBadge();
    });
});
