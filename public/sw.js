// Service Worker for Push Notifications
// public/sw.js

/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'guardian-v2';

// Only cache these static assets — NOT the app shell HTML or JS bundles.
// Vite hashes JS/CSS filenames on every build, so caching them here causes
// the PWA to serve stale bundles → white screen after a redeploy.
const STATIC_ASSETS = [
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
];

// ── Install ───────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[SW] Installing');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  // Take control immediately — don't wait for old SW to die
  self.skipWaiting();
});

// ── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
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
// Strategy:
//   • Navigation requests (page loads) → always go to network.
//     This ensures the latest index.html + hashed JS/CSS are always loaded.
//     Falls back to cached /index.html only when fully offline.
//   • Static assets (icons, manifest) → cache-first.
//   • Everything else (API, Supabase, Bible API) → network-only.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin requests (Supabase, APIs, etc.)
  if (request.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;

  // Navigation requests → network first, fallback to '/' for SPA routing
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() =>
        caches.match('/index.html').then((cached) => cached || fetch('/'))
      )
    );
    return;
  }

  // Static assets → cache first, then network
  if (
    url.pathname.startsWith('/icon') ||
    url.pathname === '/manifest.json' ||
    url.pathname.startsWith('/badge')
  ) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
    return;
  }

  // JS/CSS bundles (hashed by Vite) → network always, no caching
  // Returning without calling event.respondWith() lets the browser handle it normally
});

// Push event - show notification
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
  
  let payload = {
    title: 'Guardian',
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
