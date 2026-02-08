import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { DailyVerse } from "@/components/DailyVerse";
import { TemptationMode } from "@/components/TemptationMode";
import { QuickActions } from "@/components/QuickActions";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { Flame, Check, Trophy, TrendingUp, Calendar, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string | null;
  canCheckInToday: boolean;
  todayCheckedIn: boolean;
}

const IndexNew = () => {
  const { user } = useAuth();
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastCheckIn: null,
    canCheckInToday: true,
    todayCheckedIn: false,
  });
  const [showTemptationMode, setShowTemptationMode] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get current time for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    if (user) {
      fetchStreak();
    }
  }, [user]);

  const fetchStreak = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('streak_current, streak_longest')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile error:', profileError);
        // If profile doesn't exist, create it
        if (profileError.code === 'PGRST116') {
          await createProfile();
          return;
        }
        throw profileError;
      }

      // Get today's check-in
      const today = new Date().toISOString().split('T')[0];
      const { data: todayLog } = await supabase
        .from('streak_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', today)
        .maybeSingle();

      // Get last check-in
      const { data: lastLog } = await supabase
        .from('streak_logs')
        .select('log_date')
        .eq('user_id', user.id)
        .order('log_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      setStreak({
        currentStreak: profile?.streak_current || 0,
        longestStreak: profile?.streak_longest || 0,
        lastCheckIn: lastLog?.log_date || null,
        canCheckInToday: !todayLog,
        todayCheckedIn: !!todayLog,
      });
    } catch (error: any) {
      console.error('Error fetching streak:', error);
      toast.error('Failed to load streak data', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          streak_current: 0,
          streak_longest: 0,
          notification_settings: true,
        });

      if (error) throw error;

      // Retry fetching
      await fetchStreak();
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast.error('Failed to create profile', {
        description: error.message,
      });
    }
  };

  const handleCheckIn = async () => {
    if (!user || !streak.canCheckInToday) {
      toast.error('Already checked in today!');
      return;
    }

    setIsCheckingIn(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

      // Insert today's log
      const { error: insertError } = await supabase
        .from('streak_logs')
        .insert({
          user_id: user.id,
          log_date: today,
        });

      if (insertError) throw insertError;

      // Check if yesterday was logged
      const { data: yesterdayLog } = await supabase
        .from('streak_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('log_date', yesterday)
        .maybeSingle();

      // Calculate new streak
      let newCurrentStreak = 1;
      if (yesterdayLog) {
        newCurrentStreak = streak.currentStreak + 1;
      }

      const newLongestStreak = Math.max(newCurrentStreak, streak.longestStreak);

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          streak_current: newCurrentStreak,
          streak_longest: newLongestStreak,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setStreak({
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastCheckIn: today,
        canCheckInToday: false,
        todayCheckedIn: true,
      });

      // Show celebration message
      if (newCurrentStreak === 1) {
        toast.success('Great start!', {
          description: 'You\'ve started your journey. Come back tomorrow!',
        });
      } else if (newCurrentStreak === 7) {
        toast.success('🎉 One week strong!', {
          description: 'You\'re building a great habit!',
        });
      } else if (newCurrentStreak === 30) {
        toast.success('🏆 30 days! Incredible!', {
          description: 'You\'re a champion of consistency!',
        });
      } else if (newCurrentStreak % 10 === 0) {
        toast.success(`${newCurrentStreak} days!`, {
          description: 'You\'re amazing! Keep it up!',
        });
      } else {
        toast.success(`Day ${newCurrentStreak}!`, {
          description: 'Another day of faithfulness ✨',
        });
      }
    } catch (error: any) {
      console.error('Error checking in:', error);
      toast.error('Failed to check in', {
        description: error.message,
      });
    } finally {
      setIsCheckingIn(false);
    }
  };

  // Calculate progress for circular progress
  const progress = Math.min((streak.currentStreak / Math.max(streak.longestStreak, 30)) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-peace pb-24 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-peace pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="animate-fade-in">
          <p className="text-muted-foreground text-sm mb-1">{greeting}</p>
          <h1 className="font-serif text-3xl font-bold text-foreground">Guardian</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-6">
        {/* Streak Card - Enhanced */}
        <div className="gradient-card rounded-2xl p-6 shadow-card animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-spiritual-ember/15 flex items-center justify-center">
                <Flame className="w-5 h-5 text-spiritual-ember" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-semibold text-foreground">Your Journey</h3>
                <p className="text-sm text-muted-foreground">Purity Streak</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Trophy className="w-4 h-4 text-golden-glow" />
              <span>Best: {streak.longestStreak}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Circular Progress */}
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--golden-light))" />
                    <stop offset="100%" stopColor="hsl(var(--ember))" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-4xl font-bold text-foreground">{streak.currentStreak}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">days</span>
              </div>
            </div>

            {/* Check-in Button */}
            <div className="flex-1 ml-6">
              {streak.todayCheckedIn ? (
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground mb-1">Checked In!</p>
                  <p className="text-xs text-muted-foreground">Come back tomorrow</p>
                </div>
              ) : (
                <div className="text-center">
                  <Button
                    variant="golden"
                    size="lg"
                    className="w-full mb-2"
                    onClick={handleCheckIn}
                    disabled={isCheckingIn}
                  >
                    {isCheckingIn ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Checking in...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4 mr-2" />
                        Check In Today
                      </>
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Stay accountable to your goals
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Encouragement */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground border-t border-border pt-4">
            <TrendingUp className="w-4 h-4 text-spiritual-teal" />
            <span>
              {streak.currentStreak === streak.longestStreak && streak.currentStreak > 0
                ? "You're at your best! Keep going!"
                : streak.longestStreak > 0
                ? `${streak.longestStreak - streak.currentStreak} days to beat your record`
                : "Start your journey today!"}
            </span>
          </div>
        </div>

        {/* Daily Verse */}
        <DailyVerse 
          verse="The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul."
          reference="Psalm 23:1-3"
          reflection="Today, rest in knowing that God is guiding your every step. You are not alone in this journey."
        />

        {/* Quick Actions */}
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <QuickActions onTemptationMode={() => setShowTemptationMode(true)} />
        </div>

        {/* Recommended Talk Preview */}
        <div className="gradient-card rounded-2xl p-6 shadow-card animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <h3 className="font-serif text-lg font-semibold text-foreground mb-2">Today's Reflection</h3>
          <p className="text-sm text-muted-foreground mb-4">
            "Finding Peace in the Storm" — A 5-minute meditation on trusting God's plan.
          </p>
          <div className="w-full h-32 rounded-xl bg-muted flex items-center justify-center">
            <div className="w-12 h-12 rounded-full gradient-golden flex items-center justify-center shadow-glow">
              <div className="w-0 h-0 border-l-[12px] border-l-primary-foreground border-y-[8px] border-y-transparent ml-1" />
            </div>
          </div>
        </div>
      </main>

      {/* Temptation Mode Overlay */}
      <TemptationMode 
        isOpen={showTemptationMode} 
        onClose={() => setShowTemptationMode(false)} 
      />

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default IndexNew;
