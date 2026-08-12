/**
 * Flexa Cendekia - Notification Synchronization Script
 * Included on all pages to ensure the notification badge is up-to-date
 * based on the centralized data-store.
 */

window.addEventListener('auth-ready', function(e) {
    const currentUser = e.detail;
    if (!currentUser) return;

    function updateBadge(unreadCount) {
        // Find notification icons in the top navbar
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
                    badge.style.display = 'block';
                } else {
                    if (badge) {
                        badge.style.display = 'none';
                    }
                }
            }
        });
    }

    DataStore.onNotifikasiUpdate(currentUser.uid || currentUser.id, function(notifs) {
        const unreadCount = notifs.filter(n => !n.dibaca).length;
        updateBadge(unreadCount);
    });
});
