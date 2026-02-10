import { useState, useEffect } from "react";
import { TrendingUp, Calendar, BookOpen, PenLine, Flame, Trophy, Target, Activity } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { supabase, type Profile } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface GrowthStats {
  streakCurrent: number;
  streakLongest: number;
  daysActive: number;
  versesRead: number;
  journalEntries: number;
  lastActiveDate: string | null;
}

const GrowthDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<GrowthStats>({
    streakCurrent: 0,
    streakLongest: 0,
    daysActive: 0,
    versesRead: 0,
    journalEntries: 0,
    lastActiveDate: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [weekActivity, setWeekActivity] = useState<boolean[]>([]);

  useEffect(() => {
    if (user) {
      fetchGrowthStats();
      fetchWeekActivity();
    }
  }, [user]);

  const fetchGrowthStats = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setStats({
        streakCurrent: data.streak_current || 0,
        streakLongest: data.streak_longest || 0,
        daysActive: data.days_active || 0,
        versesRead: data.verses_read || 0,
        journalEntries: data.journal_entries_count || 0,
        lastActiveDate: data.last_active_date,
      });
    } catch (error: any) {
      toast.error('Failed to load growth stats', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeekActivity = async () => {
    if (!user) return;

    try {
      // Get last 7 days
      const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      const { data, error } = await supabase
        .from('user_activity')
        .select('activity_date')
        .eq('user_id', user.id)
        .in('activity_date', dates);

      if (error) throw error;

      const activeDates = new Set(data?.map(d => d.activity_date) || []);
      setWeekActivity(dates.map(date => activeDates.has(date)));
    } catch (error) {
      console.error('Error fetching week activity:', error);
    }
  };

  const calculateProgress = (current: number, goal: number): number => {
    return Math.min((current / goal) * 100, 100);
  };

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆';
    if (streak >= 14) return '💎';
    if (streak >= 7) return '⭐';
    if (streak >= 3) return '🔥';
    return '✨';
  };

  const getMilestoneText = (streak: number): string => {
    if (streak >= 365) return 'Legend!';
    if (streak >= 100) return 'Century Club';
    if (streak >= 30) return 'Month Strong';
    if (streak >= 14) return 'Two Weeks';
    if (streak >= 7) return 'One Week';
    return 'Getting Started';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-peace flex items-center justify-center pb-24">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full gradient-golden animate-pulse mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-peace pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h1 className="font-serif text-3xl font-bold text-foreground">Growth</h1>
          </div>
          <p className="text-muted-foreground">Track your spiritual journey</p>
        </div>
      </header>

      {/* Main Stats Grid */}
      <main className="px-6 space-y-6">
        {/* Current Streak - Hero */}
        <div className="gradient-card rounded-2xl p-8 shadow-card text-center animate-fade-in">
          <div className="text-6xl mb-4">{getStreakEmoji(stats.streakCurrent)}</div>
          <div className="text-5xl font-bold text-foreground mb-2">{stats.streakCurrent}</div>
          <p className="text-lg text-muted-foreground mb-1">Day Streak</p>
          <p className="text-sm text-primary font-medium">{getMilestoneText(stats.streakCurrent)}</p>
          
          {/* Progress to next milestone */}
          {stats.streakCurrent < 365 && (
            <div className="mt-6">
              <div className="flex justify-between text-xs text-muted-foreground mb-2">
                <span>Current: {stats.streakCurrent}</span>
                <span>Next: {stats.streakCurrent < 7 ? 7 : stats.streakCurrent < 14 ? 14 : stats.streakCurrent < 30 ? 30 : stats.streakCurrent < 100 ? 100 : 365}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-golden transition-all duration-500"
                  style={{ 
                    width: `${calculateProgress(
                      stats.streakCurrent,
                      stats.streakCurrent < 7 ? 7 : stats.streakCurrent < 14 ? 14 : stats.streakCurrent < 30 ? 30 : stats.streakCurrent < 100 ? 100 : 365
                    )}%` 
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Activity Stats Grid */}
        <div className="grid grid-cols-2 gap-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          {/* Days Active */}
          <div className="gradient-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-spiritual-blue/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-spiritual-teal" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-foreground">{stats.daysActive}</p>
                <p className="text-xs text-muted-foreground">Days Active</p>
              </div>
            </div>
          </div>

          {/* Longest Streak */}
          <div className="gradient-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-golden-light/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-golden-glow" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-foreground">{stats.streakLongest}</p>
                <p className="text-xs text-muted-foreground">Best Streak</p>
              </div>
            </div>
          </div>

          {/* Verses Read */}
          <div className="gradient-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-spiritual-lavender/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-foreground">{stats.versesRead}</p>
                <p className="text-xs text-muted-foreground">Verses Read</p>
              </div>
            </div>
          </div>

          {/* Journal Entries */}
          <div className="gradient-card rounded-xl p-6 shadow-soft">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-spiritual-ember/20 flex items-center justify-center">
                <PenLine className="w-6 h-6 text-spiritual-ember" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-foreground">{stats.journalEntries}</p>
                <p className="text-xs text-muted-foreground">Journal Entries</p>
              </div>
            </div>
          </div>
        </div>

        {/* Week Activity */}
        <div className="gradient-card rounded-xl p-6 shadow-soft animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">This Week</h3>
          </div>
          <div className="flex justify-between gap-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-xs text-muted-foreground">{day}</span>
                <div 
                  className={cn(
                    "w-full aspect-square rounded-lg transition-all",
                    weekActivity[index]
                      ? "gradient-golden shadow-soft"
                      : "bg-muted"
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Goals Section */}
        <div className="gradient-card rounded-xl p-6 shadow-soft animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">Weekly Goals</h3>
          </div>
          
          <div className="space-y-4">
            {/* Journal Goal */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground">Journal 5x this week</span>
                <span className="text-muted-foreground">3/5</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-spiritual-ember transition-all duration-500"
                  style={{ width: '60%' }}
                />
              </div>
            </div>

            {/* Reading Goal */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground">Read Scripture daily</span>
                <span className="text-muted-foreground">4/7</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: '57%' }}
                />
              </div>
            </div>

            {/* Streak Goal */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-foreground">Maintain 7-day streak</span>
                <span className="text-muted-foreground">{stats.streakCurrent}/7</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full gradient-golden transition-all duration-500"
                  style={{ width: `${Math.min((stats.streakCurrent / 7) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="gradient-card rounded-xl p-6 shadow-soft border-l-4 border-primary animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="font-serif text-foreground text-lg leading-relaxed">
            "Every day is a new opportunity to grow closer to God. Keep going!"
          </p>
          <p className="text-sm text-muted-foreground mt-2">— Your Progress Speaks</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default GrowthDashboard;
