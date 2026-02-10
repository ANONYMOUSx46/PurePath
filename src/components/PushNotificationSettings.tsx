// Push Notification Settings Component
// Add this to Settings page

import { useState } from "react";
import { Bell, BellOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { pushNotificationService } from "@/lib/pushNotifications";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface PushNotificationSettingsProps {
  userId: string;
  dailyVerse: boolean;
  journalReminder: boolean;
  streakMilestone: boolean;
  onUpdate: (settings: { 
    notification_daily_verse: boolean;
    notification_journal_reminder: boolean;
    notification_streak_milestone: boolean;
  }) => void;
}

export function PushNotificationSettings({
  userId,
  dailyVerse,
  journalReminder,
  streakMilestone,
  onUpdate,
}: PushNotificationSettingsProps) {
  const [isEnabling, setIsEnabling] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [dailyVerseEnabled, setDailyVerseEnabled] = useState(dailyVerse);
  const [journalReminderEnabled, setJournalReminderEnabled] = useState(journalReminder);
  const [streakMilestoneEnabled, setStreakMilestoneEnabled] = useState(streakMilestone);

  // Check if push is already enabled
  useState(() => {
    const checkPushStatus = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('push_token')
        .eq('id', userId)
        .single();
      
      setIsEnabled(!!data?.push_token);
    };
    checkPushStatus();
  });

  const handleEnablePush = async () => {
    if (!pushNotificationService.isSupported()) {
      toast.error('Push notifications not supported', {
        description: 'Your browser does not support push notifications',
      });
      return;
    }

    try {
      setIsEnabling(true);

      // Request permission
      const granted = await pushNotificationService.requestPermission();
      
      if (!granted) {
        toast.error('Permission denied', {
          description: 'Please allow notifications in your browser settings',
        });
        return;
      }

      // Subscribe to push
      const subscribed = await pushNotificationService.subscribeToPush(userId);
      
      if (subscribed) {
        setIsEnabled(true);
        toast.success('Push notifications enabled!', {
          description: 'You\'ll receive reminders even when the app is closed',
        });

        // Send test notification
        setTimeout(() => {
          pushNotificationService.showNotification({
            title: '✅ Notifications Enabled',
            body: 'You\'ll receive reminders like this one',
            tag: 'test',
          });
        }, 1000);
      } else {
        toast.error('Failed to enable push notifications');
      }
    } catch (error: any) {
      toast.error('Error enabling push notifications', {
        description: error.message,
      });
    } finally {
      setIsEnabling(false);
    }
  };

  const handleDisablePush = async () => {
    try {
      await pushNotificationService.unsubscribeFromPush(userId);
      setIsEnabled(false);
      toast.success('Push notifications disabled');
    } catch (error: any) {
      toast.error('Error disabling push notifications', {
        description: error.message,
      });
    }
  };

  const handleUpdateSettings = async (
    field: 'notification_daily_verse' | 'notification_journal_reminder' | 'notification_streak_milestone',
    value: boolean
  ) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ [field]: value })
        .eq('id', userId);

      if (error) throw error;

      // Update local state
      if (field === 'notification_daily_verse') setDailyVerseEnabled(value);
      if (field === 'notification_journal_reminder') setJournalReminderEnabled(value);
      if (field === 'notification_streak_milestone') setStreakMilestoneEnabled(value);

      onUpdate({
        notification_daily_verse: field === 'notification_daily_verse' ? value : dailyVerseEnabled,
        notification_journal_reminder: field === 'notification_journal_reminder' ? value : journalReminderEnabled,
        notification_streak_milestone: field === 'notification_streak_milestone' ? value : streakMilestoneEnabled,
      });

      toast.success('Notification settings updated');
    } catch (error: any) {
      toast.error('Error updating settings', {
        description: error.message,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Enable/Disable Push */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
        <div className="flex items-center gap-3">
          {isEnabled ? (
            <Bell className="w-5 h-5 text-primary" />
          ) : (
            <BellOff className="w-5 h-5 text-muted-foreground" />
          )}
          <div>
            <p className="font-medium">
              {isEnabled ? 'Push Notifications Enabled' : 'Enable Push Notifications'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isEnabled 
                ? 'You\'ll receive notifications even when the app is closed'
                : 'Get reminders even when the app is not open'
              }
            </p>
          </div>
        </div>
        {isEnabled ? (
          <Button variant="outline" size="sm" onClick={handleDisablePush}>
            Disable
          </Button>
        ) : (
          <Button 
            variant="default" 
            size="sm" 
            onClick={handleEnablePush}
            disabled={isEnabling}
          >
            {isEnabling ? 'Enabling...' : 'Enable'}
          </Button>
        )}
      </div>

      {/* Notification Types (only show if push is enabled) */}
      {isEnabled && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Notification Types</Label>
          
          {/* Daily Verse */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium text-sm">Daily Verse</p>
              <p className="text-xs text-muted-foreground">
                Morning scripture reminder
              </p>
            </div>
            <Switch
              checked={dailyVerseEnabled}
              onCheckedChange={(checked) => 
                handleUpdateSettings('notification_daily_verse', checked)
              }
            />
          </div>

          {/* Journal Reminder */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium text-sm">Journal Reminder</p>
              <p className="text-xs text-muted-foreground">
                Evening reminder if you haven't written
              </p>
            </div>
            <Switch
              checked={journalReminderEnabled}
              onCheckedChange={(checked) => 
                handleUpdateSettings('notification_journal_reminder', checked)
              }
            />
          </div>

          {/* Streak Milestones */}
          <div className="flex items-center justify-between p-3 rounded-lg border">
            <div>
              <p className="font-medium text-sm">Streak Milestones</p>
              <p className="text-xs text-muted-foreground">
                Celebrate when you hit 7, 14, 30 days
              </p>
            </div>
            <Switch
              checked={streakMilestoneEnabled}
              onCheckedChange={(checked) => 
                handleUpdateSettings('notification_streak_milestone', checked)
              }
            />
          </div>
        </div>
      )}

      {/* Install PWA Prompt */}
      {!isEnabled && (
        <div className="p-4 rounded-lg bg-spiritual-sage/20 border border-spiritual-teal/30">
          <p className="text-sm font-medium mb-2">💡 Pro Tip:</p>
          <p className="text-xs text-muted-foreground">
            Install Guardian to your home screen for the best experience with push notifications!
          </p>
        </div>
      )}
    </div>
  );
}
