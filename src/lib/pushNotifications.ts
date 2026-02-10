// Enhanced Push Notification Service with Service Worker
// Add this file: src/lib/pushNotifications.ts

import { supabase } from './supabase';

export interface NotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  data?: any;
}

class PushNotificationService {
  private vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
  private registration: ServiceWorkerRegistration | null = null;

  /**
   * Check if push notifications are supported
   */
  isSupported(): boolean {
    return (
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window
    );
  }

  /**
   * Get current permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  /**
   * Request permission for notifications
   */
  async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      console.error('Push notifications not supported');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  /**
   * Register service worker
   */
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!this.isSupported()) {
      console.error('Service workers not supported');
      return null;
    }

    try {
      // Register the service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('Service Worker registered:', this.registration);

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      return this.registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribeToPush(userId: string): Promise<boolean> {
    try {
      // Ensure we have permission
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        console.error('Push notification permission denied');
        return false;
      }

      // Ensure service worker is registered
      if (!this.registration) {
        this.registration = await this.registerServiceWorker();
      }

      if (!this.registration) {
        console.error('Failed to register service worker');
        return false;
      }

      // Subscribe to push
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      });

      console.log('Push subscription:', subscription);

      // Save subscription to database
      const subscriptionJson = JSON.stringify(subscription);
      
      const { error } = await supabase
        .from('profiles')
        .update({ push_token: subscriptionJson })
        .eq('id', userId);

      if (error) {
        console.error('Error saving push token:', error);
        return false;
      }

      console.log('Push subscription saved to database');
      return true;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      return false;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPush(userId: string): Promise<boolean> {
    try {
      if (!this.registration) {
        return true; // Already unsubscribed
      }

      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
      }

      // Remove from database
      const { error } = await supabase
        .from('profiles')
        .update({ push_token: null })
        .eq('id', userId);

      if (error) {
        console.error('Error removing push token:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error unsubscribing from push:', error);
      return false;
    }
  }

  /**
   * Show a local notification (works immediately)
   */
  async showNotification(payload: NotificationPayload): Promise<void> {
    if (!this.isSupported()) {
      console.error('Notifications not supported');
      return;
    }

    if (Notification.permission !== 'granted') {
      console.error('Notification permission not granted');
      return;
    }

    try {
      if (!this.registration) {
        this.registration = await this.registerServiceWorker();
      }

      if (this.registration) {
        await this.registration.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon || '/icon-192.png',
          badge: payload.badge || '/badge-72.png',
          tag: payload.tag || 'default',
          requireInteraction: payload.requireInteraction || false,
          data: payload.data,
          vibrate: [200, 100, 200],
        });
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  /**
   * Schedule a notification
   */
  async scheduleNotification(
    userId: string,
    type: string,
    scheduledFor: Date
  ): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('scheduled_notifications')
        .insert({
          user_id: userId,
          notification_type: type,
          scheduled_for: scheduledFor.toISOString(),
          sent: false,
        });

      if (error) {
        console.error('Error scheduling notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return false;
    }
  }

  /**
   * Smart notification helpers
   */
  async sendDailyVerseNotification(): Promise<void> {
    await this.showNotification({
      title: '📖 Today\'s Verse is Ready',
      body: 'Start your day with God\'s word',
      tag: 'daily-verse',
      requireInteraction: false,
      data: { type: 'daily_verse', action: '/scripture' },
    });
  }

  async sendJournalReminderNotification(): Promise<void> {
    await this.showNotification({
      title: '✍️ Journal Reminder',
      body: 'You haven\'t written in your journal today',
      tag: 'journal-reminder',
      requireInteraction: false,
      data: { type: 'journal_reminder', action: '/journal' },
    });
  }

  async sendStreakMilestoneNotification(day: number): Promise<void> {
    await this.showNotification({
      title: `🔥 Stay Strong — Day ${day}!`,
      body: `You're ${day} days strong. Keep going!`,
      tag: 'streak-milestone',
      requireInteraction: true,
      data: { type: 'streak_milestone', day, action: '/' },
    });
  }

  async sendStreakReminderNotification(): Promise<void> {
    await this.showNotification({
      title: '⏰ Don\'t Break Your Streak!',
      body: 'Check in today to keep your streak alive',
      tag: 'streak-reminder',
      requireInteraction: false,
      data: { type: 'streak_reminder', action: '/' },
    });
  }

  /**
   * Helper: Convert VAPID key
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

export const pushNotificationService = new PushNotificationService();
