/* =========================================================
   AnRu Focus - Service Worker (PWA Offline & Push Engine)
   Version: 3.3.0
   ========================================================= */

const CACHE_NAME = 'anru-focus-v3.3';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './sidebar.css',
    './app.js',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
                console.warn('[SW] Cache prefetch notice:', err);
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// PWA Offline Capability - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;
    
    const url = event.request.url;
    // CRITICAL: DO NOT intercept Firebase, Firestore, Google APIs or external auth streams!
    if (url.includes('googleapis.com') ||
        url.includes('firebaseio.com') ||
        url.includes('identitytoolkit') ||
        url.includes('gstatic.com') ||
        url.includes('google.com')) {
        return; // Direct browser network handling without SW interference
    }

    // Only cache same-origin assets or specific CDN scripts
    if (!url.startsWith(self.location.origin) && !url.includes('cdnjs.cloudflare.com')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseToCache = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache).catch(() => {});
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) return cachedResponse;
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                    return null;
                });
            })
    );
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
                if (action) {
                    client.postMessage({
                        type: 'TIMER_ACTION',
                        action: action
                    });
                }
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
            silent: silent !== undefined ? silent : true,
            icon: 'icon.png',
            badge: 'icon.png',
            actions: actions || [],
            data: { url: 'focus.html' }
        });
    } else if (event.data.type === 'CLEAR_TIMER_NOTIFICATION') {
        self.registration.getNotifications({ tag: 'anru-focus-timer' }).then((notifications) => {
            notifications.forEach(n => n.close());
        });
    }
});
