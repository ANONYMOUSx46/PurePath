import { useState, useEffect } from "react";
import { User, Settings, Bell, Shield, Moon, LogOut, ChevronRight, Heart, Sparkles, Clock } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, type Profile as ProfileType } from "@/lib/supabase";
import { pushNotificationService } from "@/lib/notifications";
import { toast } from "sonner";

const ProfileNew = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [notifications, setNotifications] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
    checkPushStatus();
  }, [user]);

  useEffect(() => {
    // Check if dark mode is already enabled
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const checkPushStatus = () => {
    if (pushNotificationService.isSupported()) {
      setPushEnabled(pushNotificationService.getPermissionStatus() === 'granted');
    }
  };

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (error) throw error;
      
      setProfile(data);
      setNotifications(data.notification_settings);
    } catch (error: any) {
      toast.error('Failed to load profile', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      toast.success("Dark mode enabled", { description: "Easier on the eyes during evening devotions" });
    } else {
      document.documentElement.classList.remove('dark');
      toast.success("Light mode enabled", { description: "Bright and uplifting" });
    }
  };

  const handleNotificationsToggle = async (checked: boolean) => {
    setNotifications(checked);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ notification_settings: checked })
        .eq('id', user!.id);

      if (error) throw error;

      toast.success(checked ? "Notifications enabled" : "Notifications disabled", {
        description: checked ? "You'll receive daily reminders" : "You won't receive reminders"
      });

      // If enabling, also set up daily reminder
      if (checked) {
        await pushNotificationService.scheduleDailyReminder(9, 0); // 9 AM
      }
    } catch (error: any) {
      toast.error('Failed to update settings', {
        description: error.message,
      });
      setNotifications(!checked); // Revert on error
    }
  };

  const handlePushToggle = async (checked: boolean) => {
    if (checked) {
      const granted = await pushNotificationService.requestPermission();
      if (granted) {
        setPushEnabled(true);
        await pushNotificationService.scheduleDailyReminder(9, 0);
        toast.success('Push notifications enabled!', {
          description: 'You\'ll receive daily reminders at 9 AM',
        });
      } else {
        toast.error('Permission denied', {
          description: 'Please enable notifications in your browser settings',
        });
      }
    } else {
      setPushEnabled(false);
      toast.success('Push notifications disabled');
    }
  };

  const testNotification = async () => {
    const success = await pushNotificationService.sendLocalNotification({
      title: 'Test Notification',
      body: 'Your notifications are working perfectly! 🎉',
      requireInteraction: false,
    });

    if (success) {
      toast.success('Test notification sent!');
    } else {
      toast.error('Failed to send notification');
    }
  };

  const handleMenuClick = (label: string) => {
    toast.info(`${label}`, { description: "Coming soon in the next update!" });
  };

  const handleSignOut = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-peace flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full gradient-golden animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-peace pb-24">
      {/* Header with gradient accent */}
      <header className="relative px-6 pt-12 pb-8 overflow-hidden">
        <div className="absolute inset-0 gradient-golden opacity-10" />
        <div className="relative animate-fade-in">
          <h1 className="font-serif text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Your spiritual journey</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-6">
        {/* User Card - Enhanced with gradient border */}
        <div className="relative rounded-2xl p-[2px] bg-gradient-to-br from-golden-light via-primary to-spiritual-teal shadow-card animate-fade-in">
          <div className="bg-card rounded-2xl p-6 text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full gradient-golden animate-pulse-gentle" />
              <div className="relative w-full h-full rounded-full gradient-golden flex items-center justify-center shadow-glow">
                <User className="w-12 h-12 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full gradient-calm flex items-center justify-center shadow-teal">
                <Sparkles className="w-4 h-4 text-accent-foreground" />
              </div>
            </div>
            <h2 className="font-serif text-2xl font-bold text-foreground mb-1">
              {user?.email?.split('@')[0] || 'User'}
            </h2>
            <p className="text-sm text-muted-foreground mb-2">{user?.email}</p>
            <p className="text-xs text-muted-foreground">
              Member since {profile ? formatMemberSince(profile.created_at) : '...'}
            </p>
          </div>
        </div>

        {/* Stats - Enhanced with individual colors */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative overflow-hidden rounded-xl p-4 shadow-soft text-center bg-gradient-to-br from-card to-spiritual-cream">
            <div className="absolute top-0 right-0 w-12 h-12 gradient-golden opacity-20 rounded-bl-full" />
            <p className="text-2xl font-bold text-primary">{profile?.streak_current || 0}</p>
            <p className="text-xs text-muted-foreground font-medium">Day Streak</p>
          </div>
          <div className="relative overflow-hidden rounded-xl p-4 shadow-soft text-center bg-gradient-to-br from-card to-spiritual-sage">
            <div className="absolute top-0 right-0 w-12 h-12 gradient-calm opacity-20 rounded-bl-full" />
            <p className="text-2xl font-bold text-accent">{profile?.streak_longest || 0}</p>
            <p className="text-xs text-muted-foreground font-medium">Best Streak</p>
          </div>
          <div className="relative overflow-hidden rounded-xl p-4 shadow-soft text-center bg-gradient-to-br from-card to-spiritual-lavender">
            <div className="absolute top-0 right-0 w-12 h-12 bg-spiritual-ember opacity-20 rounded-bl-full" />
            <p className="text-2xl font-bold text-spiritual-ember">✓</p>
            <p className="text-xs text-muted-foreground font-medium">Active</p>
          </div>
        </div>

        {/* Menu - Enhanced with icons and better styling */}
        <div className="rounded-2xl shadow-soft overflow-hidden animate-fade-in bg-card" style={{ animationDelay: "0.2s" }}>
          {/* Notifications */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-spiritual-sage to-accent/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-accent" />
              </div>
              <span className="font-medium text-foreground">Notifications</span>
            </div>
            <Switch checked={notifications} onCheckedChange={handleNotificationsToggle} />
          </div>

          {/* Push Notifications */}
          {pushNotificationService.isSupported() && (
            <div className="px-4 py-4 border-b border-border bg-muted/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-golden-light to-primary/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-foreground">Push Reminders</span>
                </div>
                <Switch checked={pushEnabled} onCheckedChange={handlePushToggle} />
              </div>
              {pushEnabled && (
                <div className="ml-[52px]">
                  <p className="text-xs text-muted-foreground mb-2">Daily reminder at 9:00 AM</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={testNotification}
                  >
                    Send Test Notification
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Privacy */}
          <button 
            onClick={() => handleMenuClick("Privacy & Security")}
            className="w-full flex items-center justify-between px-4 py-4 border-b border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-spiritual-blue to-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium text-foreground">Privacy & Security</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Dark Mode */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-spiritual-lavender to-muted flex items-center justify-center">
                <Moon className="w-5 h-5 text-foreground" />
              </div>
              <span className="font-medium text-foreground">Dark Mode</span>
            </div>
            <Switch checked={darkMode} onCheckedChange={handleDarkModeToggle} />
          </div>

          {/* About */}
          <button 
            onClick={() => handleMenuClick("About Guardian")}
            className="w-full flex items-center justify-between px-4 py-4 border-b border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg gradient-golden flex items-center justify-center">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-medium text-foreground">About PurePath</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Settings */}
          <button 
            onClick={() => handleMenuClick("Settings")}
            className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Settings className="w-5 h-5 text-muted-foreground" />
              </div>
              <span className="font-medium text-foreground">Settings</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Sign Out */}
        <Button 
          variant="ghost" 
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          PurePath v1.0.0 • Made with ❤️
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default ProfileNew;
