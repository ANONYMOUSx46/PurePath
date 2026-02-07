import { Flame, Trophy, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  label?: string;
}

export function StreakCounter({ currentStreak, longestStreak, label = "Days Strong" }: StreakCounterProps) {
  const progress = Math.min((currentStreak / Math.max(longestStreak, 30)) * 100, 100);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="gradient-card rounded-2xl p-6 shadow-card animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-spiritual-ember/15 flex items-center justify-center">
            <Flame className="w-5 h-5 text-spiritual-ember" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">Your Journey</h3>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Trophy className="w-4 h-4 text-golden-glow" />
          <span>Best: {longestStreak}</span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            {/* Progress circle */}
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
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-serif text-4xl font-bold text-foreground">{currentStreak}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">days</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <TrendingUp className="w-4 h-4 text-spiritual-teal" />
        <span>
          {currentStreak === longestStreak && currentStreak > 0 
            ? "You're at your best! Keep going!" 
            : `${longestStreak - currentStreak} days to beat your record`}
        </span>
      </div>
    </div>
  );
}
