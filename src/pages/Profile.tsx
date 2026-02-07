import { useState, useEffect } from "react";
import { User, Settings, Bell, Shield, Moon, LogOut, ChevronRight, Heart, Sparkles } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Profile = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if dark mode is already enabled
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

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

  const handleNotificationsToggle = (checked: boolean) => {
    setNotifications(checked);
    toast.success(checked ? "Notifications enabled" : "Notifications disabled", {
      description: checked ? "You'll receive daily reminders" : "You won't receive reminders"
    });
  };

  const handleMenuClick = (label: string) => {
    toast.info(`${label}`, { description: "Coming soon in the next update!" });
  };

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
            <h2 className="font-serif text-2xl font-bold text-foreground mb-1">Guest User</h2>
            <p className="text-sm text-muted-foreground mb-4">Member since February 2026</p>
            <Button variant="golden" size="sm" className="shadow-glow">
              Create Account
            </Button>
          </div>
        </div>

        {/* Stats - Enhanced with individual colors */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="relative overflow-hidden rounded-xl p-4 shadow-soft text-center bg-gradient-to-br from-card to-spiritual-cream">
            <div className="absolute top-0 right-0 w-12 h-12 gradient-golden opacity-20 rounded-bl-full" />
            <p className="text-2xl font-bold text-primary">7</p>
            <p className="text-xs text-muted-foreground font-medium">Day Streak</p>
          </div>
          <div className="relative overflow-hidden rounded-xl p-4 shadow-soft text-center bg-gradient-to-br from-card to-spiritual-sage">
            <div className="absolute top-0 right-0 w-12 h-12 gradient-calm opacity-20 rounded-bl-full" />
            <p className="text-2xl font-bold text-accent">12</p>
            <p className="text-xs text-muted-foreground font-medium">Journal Entries</p>
          </div>
          <div className="relative overflow-hidden rounded-xl p-4 shadow-soft text-center bg-gradient-to-br from-card to-spiritual-lavender">
            <div className="absolute top-0 right-0 w-12 h-12 bg-spiritual-ember opacity-20 rounded-bl-full" />
            <p className="text-2xl font-bold text-spiritual-ember">45</p>
            <p className="text-xs text-muted-foreground font-medium">Verses Read</p>
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
              <span className="font-medium text-foreground">About Guardian</span>
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
          onClick={() => toast.info("Sign out", { description: "You're currently using a guest account" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>

        {/* Version */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          Guardian v1.0.0 • Made with ❤️
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
