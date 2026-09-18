/* =========================================================
   AnRu Focus - Service Worker (Background & Push Notifications)
   Version: 3.0.0
   ========================================================= */

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Handle Notification Actions and Clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const action = event.action;
    const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : 'focus.html';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            let matchingClient = null;
            
            for (const client of windowClients) {
                // If action button was clicked (pause/resume/finish)
                if (action) {
                    client.postMessage({
                        type: 'TIMER_ACTION',
                        action: action
                    });
                }
                
                // Find open tab
                if (client.url.includes('focus.html') || client.url.includes('index.html')) {
                    matchingClient = client;
                }
            }

            if (matchingClient) {
                return matchingClient.focus();
            } else if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});

// Listen for messages from client windows
self.addEventListener('message', (event) => {
    if (!event.data) return;

    if (event.data.type === 'SHOW_TIMER_NOTIFICATION') {
        const { title, body, actions, tag, silent } = event.data;
        self.registration.showNotification(title, {
            body: body,
            tag: tag || 'anru-focus-timer',
            renotify: false,
            silent: silent !== undefined ? silent : true, // 100% silent - No audio ducking!
            icon: 'https://img.icons8.com/fluency/192/brain.png',
            badge: 'https://img.icons8.com/fluency/96/brain.png',
            actions: actions || [],
            data: { url: 'focus.html' }
        });
    } else if (event.data.type === 'CLEAR_TIMER_NOTIFICATION') {
        self.registration.getNotifications({ tag: 'anru-focus-timer' }).then((notifications) => {
            notifications.forEach(n => n.close());
        });
    }
});
