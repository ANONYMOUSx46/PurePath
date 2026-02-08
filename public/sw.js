// Service Worker for push notifications
// Place this file in /public/sw.js

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  event.waitUntil(clients.claim())
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event.notification.tag)
  event.notification.close()

  // Open the app when notification is clicked
  event.waitUntil(
    clients.openWindow('/')
  )
})

// Handle push events (for server-sent notifications)
self.addEventListener('push', (event) => {
  console.log('Push received:', event)

  const data = event.data ? event.data.json() : {}
  const title = data.title || 'Guardian'
  const options = {
    body: data.body || 'You have a new notification',
    icon: data.icon || '/icon-192.png',
    badge: data.badge || '/icon-72.png',
    data: data.url || '/',
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})
