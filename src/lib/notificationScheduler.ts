// Notification Scheduler
// Add this file: src/lib/notificationScheduler.ts

import { supabase } from './supabase';
import { pushNotificationService } from './pushNotifications';

/**
 * Initialize push notifications for user
 */
export async function initializePushNotifications(userId: string): Promise<void> {
  try {
    // Check if already subscribed
    const { data: profile } = await supabase
      .from('profiles')
      .select('push_token')
      .eq('id', userId)
      .single();

    if (!profile?.push_token) {
      // Not subscribed yet - user needs to enable manually
      return;
    }

    // Register service worker if not already
    await pushNotificationService.registerServiceWorker();
    
    console.log('Push notifications initialized');
  } catch (error) {
    console.error('Error initializing push notifications:', error);
  }
}

/**
 * Track user activity and update stats
 */
export async function trackActivity(
  userId: string,
  activityType: 'verse_read' | 'journal_entry' | 'video_watched' | 'check_in',
  metadata?: any
): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Insert activity record
    await supabase.from('user_activity').insert({
      user_id: userId,
      activity_type: activityType,
      activity_date: today,
      metadata: metadata || {},
    });

    // Update days active
    await supabase.rpc('update_days_active', {
      user_id_param: userId,
    });

    console.log(`Activity tracked: ${activityType}`);
  } catch (error: any) {
    // Ignore duplicate key errors (activity already recorded today)
    if (!error.message?.includes('duplicate key')) {
      console.error('Error tracking activity:', error);
    }
  }
}

/**
 * Increment verses read counter
 */
export async function trackVerseRead(userId: string, verseReference?: string): Promise<void> {
  try {
    await supabase.rpc('increment_verses_read', {
      user_id_param: userId,
    });

    await trackActivity(userId, 'verse_read', { verse: verseReference });
  } catch (error) {
    console.error('Error tracking verse read:', error);
  }
}

/**
 * Schedule smart notifications based on user activity
 */
export async function scheduleSmartNotifications(userId: string): Promise<void> {
  try {
    // Get user profile with preferences
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile || !profile.push_token) return;

    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Check if user wrote journal today
    const { data: journalToday } = await supabase
      .from('journal_entries')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00`)
      .maybeSingle();

    // Send journal reminder if they haven't written and it's enabled
    if (!journalToday && profile.notification_journal_reminder) {
      const reminderTime = profile.streak_reminder_time || '20:00';
      const [hours, minutes] = reminderTime.split(':');
      
      if (now.getHours() >= parseInt(hours)) {
        await pushNotificationService.sendJournalReminderNotification();
      }
    }

    // Check for streak milestones
    if (profile.streak_current > 0 && profile.notification_streak_milestone) {
      const milestones = [7, 14, 30, 60, 100, 365];
      if (milestones.includes(profile.streak_current)) {
        await pushNotificationService.sendStreakMilestoneNotification(
          profile.streak_current
        );
      }
    }

    // Daily verse notification (based on user's set time)
    if (profile.notification_daily_verse) {
      const verseTime = profile.daily_verse_time || '09:00';
      const [hours, minutes] = verseTime.split(':');
      
      if (now.getHours() === parseInt(hours) && now.getMinutes() < 5) {
        await pushNotificationService.sendDailyVerseNotification();
      }
    }
  } catch (error) {
    console.error('Error scheduling smart notifications:', error);
  }
}

/**
 * Check and send streak reminder if needed
 */
export async function checkStreakReminder(userId: string): Promise<void> {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!profile || !profile.push_token) return;

    const today = new Date().toISOString().split('T')[0];

    // Check if user has checked in today
    const { data: checkInToday } = await supabase
      .from('user_activity')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_type', 'check_in')
      .eq('activity_date', today)
      .maybeSingle();

    // Send reminder if they haven't checked in and it's evening
    if (!checkInToday) {
      const now = new Date();
      if (now.getHours() >= 20) {
        await pushNotificationService.sendStreakReminderNotification();
      }
    }
  } catch (error) {
    console.error('Error checking streak reminder:', error);
  }
}

/**
 * Update user's last active date
 */
export async function updateLastActive(userId: string): Promise<void> {
  try {
    await supabase.rpc('update_days_active', {
      user_id_param: userId,
    });

    await trackActivity(userId, 'check_in');
  } catch (error) {
    console.error('Error updating last active:', error);
  }
}
