// Push notification service for web and mobile
// Uses Web Push API for browsers and can be extended for native apps

export interface NotificationConfig {
  title: string
  body: string
  icon?: string
  badge?: string
  tag?: string
  requireInteraction?: boolean
}

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null

  // Request permission for notifications
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }

  // Register service worker for push notifications
  async registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service workers are not supported')
      return false
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js')
      console.log('Service Worker registered:', this.registration)
      return true
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return false
    }
  }

  // Send a local notification (doesn't require server)
  async sendLocalNotification(config: NotificationConfig): Promise<boolean> {
    const hasPermission = await this.requestPermission()
    if (!hasPermission) {
      console.warn('Notification permission denied')
      return false
    }

    try {
      if (this.registration) {
        // Use service worker notification (better for mobile)
        await this.registration.showNotification(config.title, {
          body: config.body,
          icon: config.icon || '/icon-192.png',
          badge: config.badge || '/icon-72.png',
          tag: config.tag || 'guardian-notification',
          requireInteraction: config.requireInteraction || false,
          vibrate: [200, 100, 200],
        })
      } else {
        // Fallback to regular notification
        new Notification(config.title, {
          body: config.body,
          icon: config.icon || '/icon-192.png',
          tag: config.tag || 'guardian-notification',
        })
      }
      return true
    } catch (error) {
      console.error('Failed to send notification:', error)
      return false
    }
  }

  // Schedule a daily reminder
  async scheduleDailyReminder(hour: number = 9, minute: number = 0): Promise<boolean> {
    // Calculate time until next occurrence
    const now = new Date()
    const target = new Date()
    target.setHours(hour, minute, 0, 0)

    if (target <= now) {
      target.setDate(target.getDate() + 1)
    }

    const delay = target.getTime() - now.getTime()

    // Store in localStorage so we can restore on page load
    localStorage.setItem('dailyReminderTime', JSON.stringify({ hour, minute }))

    setTimeout(() => {
      this.sendLocalNotification({
        title: 'Guardian Daily Check-In',
        body: 'Don\'t forget to check in today and maintain your streak! 🔥',
        requireInteraction: false,
      })

      // Schedule next day's reminder
      this.scheduleDailyReminder(hour, minute)
    }, delay)

    return true
  }

  // Send encouragement notification
  async sendEncouragementNotification(): Promise<boolean> {
    const encouragements = [
      'You\'re doing great! Keep up the amazing work! 💪',
      'Every day is a victory. Stay strong! ✨',
      'God is proud of your faithfulness! 🙏',
      'You\'re building something beautiful! 🌟',
      'Your commitment is inspiring! Keep going! 🔥',
    ]

    const random = encouragements[Math.floor(Math.random() * encouragements.length)]

    return this.sendLocalNotification({
      title: 'You\'re Amazing!',
      body: random,
      requireInteraction: false,
    })
  }

  // Send streak milestone notification
  async sendStreakMilestone(days: number): Promise<boolean> {
    let message = ''
    let emoji = '🎉'

    if (days === 7) {
      message = 'One week strong! You\'re building a great habit!'
      emoji = '🎯'
    } else if (days === 30) {
      message = '30 days! That\'s incredible commitment!'
      emoji = '🏆'
    } else if (days === 100) {
      message = '100 days! You\'re a champion!'
      emoji = '👑'
    } else if (days % 10 === 0) {
      message = `${days} days of faithfulness! Amazing!`
      emoji = '⭐'
    }

    if (message) {
      return this.sendLocalNotification({
        title: `${emoji} Milestone Reached!`,
        body: message,
        requireInteraction: true,
      })
    }

    return false
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    if (!('Notification' in window)) {
      return 'denied'
    }
    return Notification.permission
  }
}

export const pushNotificationService = new PushNotificationService()

// Auto-initialize service worker on load
if (typeof window !== 'undefined') {
  pushNotificationService.registerServiceWorker()
  
  // Restore daily reminder if set
  const savedReminder = localStorage.getItem('dailyReminderTime')
  if (savedReminder) {
    const { hour, minute } = JSON.parse(savedReminder)
    pushNotificationService.scheduleDailyReminder(hour, minute)
  }
}
