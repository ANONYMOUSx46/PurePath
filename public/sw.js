// Service Worker - Offline-First PWA



const CACHE_NAME = 'guardian-v3-offline';
const BIBLE_CACHE = 'guardian-bible-v1';
const DYNAMIC_CACHE = 'guardian-dynamic-v1';

// Core static assets - always cached
const STATIC_ASSETS = [
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
];

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing offline-first service worker');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => ![CACHE_NAME, BIBLE_CACHE, DYNAMIC_CACHE].includes(key))
          .map((key) => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    )
  );
  self.clients.claim();
});

// ── Fetch ─────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // ════════════════════════════════════════════════════════════════════════════
  // NAVIGATION REQUESTS (page loads) - Network first, cache fallback
  // ════════════════════════════════════════════════════════════════════════════
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache the successful response
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // Offline - serve cached version or index.html for SPA routing
          return caches.match(request).then((cached) => 
            cached || caches.match('/index.html')
          );
        })
    );
    return;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // STATIC ASSETS - Cache first
  // ════════════════════════════════════════════════════════════════════════════
  if (
    url.pathname.startsWith('/icon') ||
    url.pathname === '/manifest.json' ||
    url.pathname.startsWith('/badge') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.svg')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        
        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
    return;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // BIBLE API REQUESTS - Cache with network update (stale-while-revalidate)
  // ════════════════════════════════════════════════════════════════════════════
  if (url.hostname === 'bible-api.com' || url.pathname.includes('/bible/')) {
    event.respondWith(
      caches.open(BIBLE_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          const fetchPromise = fetch(request)
            .then((response) => {
              // Update cache with fresh data
              cache.put(request, response.clone());
              return response;
            })
            .catch(() => {
              // Network failed, return cached version if available
              return cached;
            });

          // Return cached immediately, update in background
          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SUPABASE API - Network only with cache fallback for read operations
  // ════════════════════════════════════════════════════════════════════════════
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache GET requests for offline viewing
          if (request.method === 'GET' && response.ok) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline - return cached data if available
          return caches.match(request).then((cached) => {
            if (cached) {
              console.log('[SW] Serving cached Supabase data (offline mode)');
              return cached;
            }
            // Return offline response
            return new Response(
              JSON.stringify({ 
                offline: true, 
                error: 'No internet connection',
                message: 'You are offline. Some features may be limited.'
              }),
              { 
                headers: { 'Content-Type': 'application/json' },
                status: 503
              }
            );
          });
        })
    );
    return;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // APP BUNDLE (JS/CSS) - Network first, cache fallback
  // ════════════════════════════════════════════════════════════════════════════
  if (url.pathname.startsWith('/assets/') || url.pathname.endsWith('.js') || url.pathname.endsWith('.css')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            if (cached) {
              console.log('[SW] Serving cached bundle (offline mode)');
              return cached;
            }
            throw new Error('Asset not in cache and offline');
          });
        })
    );
    return;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // EVERYTHING ELSE - Network with cache fallback
  // ════════════════════════════════════════════════════════════════════════════
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});

// Push event - show notification
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  let payload = {
    title: 'PurePath',
    body: 'You have a new notification',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    tag: 'default',
    data: {},
  };

  if (event.data) {
    try {
      const data = event.data.json();
      payload = { ...payload, ...data };
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const notificationPromise = self.registration.showNotification(
    payload.title,
    {
      body: payload.body,
      icon: payload.icon,
      badge: payload.badge,
      tag: payload.tag,
      requireInteraction: payload.requireInteraction || false,
      vibrate: [200, 100, 200],
      data: payload.data,
      actions: [
        {
          action: 'open',
          title: 'Open App',
        },
        {
          action: 'close',
          title: 'Dismiss',
        },
      ],
    }
  );

  event.waitUntil(notificationPromise);
});

// Notification click event - handle actions
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  // Get the action URL from notification data
  const urlToOpen = event.notification.data?.action || '/';
  
  event.waitUntil(
    clients
      .matchAll({
        type: 'window',
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === self.location.origin + urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync event (for future use)
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  try {
    console.log('[SW] Syncing data in background');
    // Add background sync logic here
  } catch (error) {
    console.error('[SW] Sync failed:', error);
  }
}

console.log('[SW] Service worker script loaded');
