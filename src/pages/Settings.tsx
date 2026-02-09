import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Key, 
  Bell, 
  Moon, 
  Lock, 
  Download,
  Camera,
  Save,
  Loader2,
  Clock,
  Shield,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase, type Profile as ProfileType } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileType | null>(null);

  // Profile settings
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // App settings
  const [notifications, setNotifications] = useState(true);
  const [dailyVerseTime, setDailyVerseTime] = useState("09:00");
  const [streakReminderTime, setStreakReminderTime] = useState("20:00");
  const [quietHoursStart, setQuietHoursStart] = useState("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00");

  // Privacy settings
  const [journalPin, setJournalPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showPinDialog, setShowPinDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setUsername(data.username || '');
      setEmail(user!.email || '');
      setAvatarUrl(data.avatar_url || '');
      setNotifications(data.notification_settings);
      setDailyVerseTime(data.daily_verse_time || '09:00');
      setStreakReminderTime(data.streak_reminder_time || '20:00');
      setQuietHoursStart(data.quiet_hours_start || '22:00');
      setQuietHoursEnd(data.quiet_hours_end || '08:00');
      setJournalPin(data.journal_pin || '');
      setBiometricEnabled(data.biometric_enabled || false);
      
      // Set theme from database
      if (data.theme_preference) {
        setTheme(data.theme_preference as 'light' | 'dark');
      }
    } catch (error: any) {
      toast.error('Failed to load settings', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!username.trim()) {
      toast.error('Username required', {
        description: 'Please enter a username',
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: username.trim(),
          avatar_url: avatarUrl,
        })
        .eq('id', user!.id);

      if (error) throw error;

      // Refetch the profile to get updated data
      await fetchProfile();

      toast.success('Profile updated!', {
        description: 'Your profile has been saved successfully.',
      });
    } catch (error: any) {
      toast.error('Failed to update profile', {
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAppSettings = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_settings: notifications,
          daily_verse_time: dailyVerseTime,
          streak_reminder_time: streakReminderTime,
          quiet_hours_start: quietHoursStart,
          quiet_hours_end: quietHoursEnd,
          theme_preference: theme,
        })
        .eq('id', user!.id);

      if (error) throw error;

      toast.success('Settings saved!', {
        description: 'Your app settings have been updated.',
      });
    } catch (error: any) {
      toast.error('Failed to save settings', {
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetPin = async () => {
    if (!newPin || !confirmPin) {
      toast.error('All fields required', {
        description: 'Please fill in all PIN fields',
      });
      return;
    }

    if (newPin.length < 4) {
      toast.error('PIN too short', {
        description: 'PIN must be at least 4 digits',
      });
      return;
    }

    if (newPin !== confirmPin) {
      toast.error('PINs do not match', {
        description: 'Please make sure both PINs are the same',
      });
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          journal_pin: newPin,
        })
        .eq('id', user!.id);

      if (error) throw error;

      setJournalPin(newPin);
      setNewPin('');
      setConfirmPin('');
      setShowPinDialog(false);

      toast.success('PIN set!', {
        description: 'Your journal is now protected with a PIN.',
      });
    } catch (error: any) {
      toast.error('Failed to set PIN', {
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePin = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          journal_pin: null,
        })
        .eq('id', user!.id);

      if (error) throw error;

      setJournalPin('');
      toast.success('PIN removed', {
        description: 'Your journal is no longer PIN protected.',
      });
    } catch (error: any) {
      toast.error('Failed to remove PIN', {
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportJournal = async () => {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const exportData = {
        exported_at: new Date().toISOString(),
        user_email: user!.email,
        total_entries: data.length,
        entries: data,
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `journal-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success('Journal exported!', {
        description: `${data.length} entries exported successfully.`,
      });
    } catch (error: any) {
      toast.error('Failed to export journal', {
        description: error.message,
      });
    }
  };

  const handlePasswordReset = async () => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user!.email!, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Password reset email sent!', {
        description: 'Check your email for the reset link.',
      });
    } catch (error: any) {
      toast.error('Failed to send reset email', {
        description: error.message,
      });
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File too large', {
        description: 'Please choose an image under 2MB',
      });
      return;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user!.id);

      if (updateError) throw updateError;

      toast.success('Avatar updated!', {
        description: 'Your profile picture has been changed.',
      });
    } catch (error: any) {
      toast.error('Failed to upload avatar', {
        description: error.message,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-peace flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-peace pb-6">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/profile')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-serif text-2xl font-bold text-foreground">Settings</h1>
        </div>
      </header>

      <div className="px-6 py-6 max-w-2xl mx-auto space-y-8">
        {/* Profile Section */}
        <section className="gradient-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-6">
            <User className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-semibold text-foreground">Profile</h2>
          </div>

          <div className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full gradient-golden flex items-center justify-center">
                    <User className="w-10 h-10 text-primary-foreground" />
                  </div>
                )}
                <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                </label>
              </div>
              <div>
                <p className="font-medium text-foreground">Profile Picture</p>
                <p className="text-sm text-muted-foreground">Max 2MB, JPG or PNG</p>
              </div>
            </div>

            <Separator />

            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
              />
            </div>

            {/* Email (view only) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  value={email}
                  disabled
                  className="pl-10 bg-muted cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            {/* Password Reset */}
            <div className="space-y-2">
              <Label>Password</Label>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handlePasswordReset}
              >
                <Key className="w-4 h-4 mr-2" />
                Send Password Reset Email
              </Button>
            </div>

            <Button
              variant="golden"
              className="w-full"
              onClick={handleSaveProfile}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </section>

        {/* App Settings */}
        <section className="gradient-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-semibold text-foreground">App Settings</h2>
          </div>

          <div className="space-y-6">
            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Notifications</p>
                <p className="text-sm text-muted-foreground">Receive daily reminders</p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>

            <Separator />

            {/* Daily Verse Time */}
            <div className="space-y-2">
              <Label htmlFor="daily-verse-time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Daily Verse Reminder
              </Label>
              <Input
                id="daily-verse-time"
                type="time"
                value={dailyVerseTime}
                onChange={(e) => setDailyVerseTime(e.target.value)}
              />
            </div>

            {/* Streak Reminder Time */}
            <div className="space-y-2">
              <Label htmlFor="streak-reminder-time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Streak Reminder
              </Label>
              <Input
                id="streak-reminder-time"
                type="time"
                value={streakReminderTime}
                onChange={(e) => setStreakReminderTime(e.target.value)}
              />
            </div>

            <Separator />

            {/* Quiet Hours */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Quiet Hours
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start" className="text-xs">Start</Label>
                  <Input
                    id="quiet-start"
                    type="time"
                    value={quietHoursStart}
                    onChange={(e) => setQuietHoursStart(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end" className="text-xs">End</Label>
                  <Input
                    id="quiet-end"
                    type="time"
                    value={quietHoursEnd}
                    onChange={(e) => setQuietHoursEnd(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">No notifications during quiet hours</p>
            </div>

            <Separator />

            {/* Theme Selection */}
            <div className="space-y-2">
              <Label htmlFor="theme" className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Theme
              </Label>
              <Select
                value={theme}
                onValueChange={(value: 'light' | 'dark') => setTheme(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="golden"
              className="w-full"
              onClick={handleSaveAppSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Privacy Section */}
        <section className="gradient-card rounded-2xl p-6 shadow-card">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-semibold text-foreground">Privacy</h2>
          </div>

          <div className="space-y-6">
            {/* Journal PIN */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Journal PIN Protection
              </Label>
              {journalPin ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">PIN is currently set</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowPinDialog(true)}
                    >
                      Change PIN
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="flex-1">
                          Remove PIN
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove PIN?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Your journal will no longer be protected with a PIN. Anyone with access to your device can view your entries.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleRemovePin}>
                            Remove PIN
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowPinDialog(true)}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Set Journal PIN
                </Button>
              )}
            </div>

            {/* PIN Setup Dialog */}
            <AlertDialog open={showPinDialog} onOpenChange={setShowPinDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {journalPin ? 'Change PIN' : 'Set Journal PIN'}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Create a 4-digit PIN to protect your journal entries
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-pin">New PIN</Label>
                    <Input
                      id="new-pin"
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 4-digit PIN"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-pin">Confirm PIN</Label>
                    <Input
                      id="confirm-pin"
                      type="password"
                      inputMode="numeric"
                      maxLength={6}
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                      placeholder="Confirm PIN"
                    />
                  </div>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => {
                    setNewPin('');
                    setConfirmPin('');
                  }}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleSetPin}>
                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Set PIN'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Separator />

            {/* Export Journal */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Journal
              </Label>
              <p className="text-sm text-muted-foreground mb-2">
                Download all your journal entries as JSON
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleExportJournal}
              >
                <Download className="w-4 h-4 mr-2" />
                Export All Entries
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
