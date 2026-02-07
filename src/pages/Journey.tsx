import { Flame, Calendar, Check, Trophy, Target } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];
const streakData = [true, true, true, true, true, false, true]; // Example: past week

const milestones = [
  { days: 7, label: "First Week", achieved: true },
  { days: 14, label: "Two Weeks", achieved: false },
  { days: 30, label: "One Month", achieved: false },
  { days: 90, label: "Three Months", achieved: false },
];

const Journey = () => {
  const currentStreak = 7;

  return (
    <div className="min-h-screen gradient-peace pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="animate-fade-in">
          <h1 className="font-serif text-3xl font-bold text-foreground">Your Journey</h1>
          <p className="text-muted-foreground">Stay strong, stay faithful</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-6">
        {/* Main Streak Display */}
        <div className="gradient-card rounded-2xl p-8 shadow-card text-center animate-fade-in">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full gradient-golden flex items-center justify-center shadow-glow animate-breathe">
            <Flame className="w-12 h-12 text-primary-foreground" />
          </div>
          <h2 className="font-serif text-5xl font-bold text-foreground mb-2">{currentStreak}</h2>
          <p className="text-muted-foreground">Days of Purity</p>
          
          <Button variant="golden" className="mt-6">
            <Check className="w-4 h-4 mr-2" />
            Log Today as Clean
          </Button>
        </div>

        {/* Week View */}
        <div className="gradient-card rounded-xl p-4 shadow-soft animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-medium text-foreground">This Week</h3>
          </div>
          <div className="flex justify-between">
            {weekDays.map((day, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{day}</span>
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    streakData[index] 
                      ? "gradient-golden shadow-soft" 
                      : index === 5 
                        ? "bg-destructive/20 border-2 border-destructive/30"
                        : "bg-muted"
                  )}
                >
                  {streakData[index] ? (
                    <Check className="w-5 h-5 text-primary-foreground" />
                  ) : index === 5 ? (
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-golden-glow" />
            <h3 className="font-serif text-xl font-semibold text-foreground">Milestones</h3>
          </div>
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className={cn(
                  "gradient-card rounded-xl p-4 shadow-soft flex items-center gap-4",
                  milestone.achieved && "border-2 border-primary/30"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  milestone.achieved 
                    ? "gradient-golden shadow-soft" 
                    : "bg-muted"
                )}>
                  {milestone.achieved ? (
                    <Trophy className="w-6 h-6 text-primary-foreground" />
                  ) : (
                    <Target className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{milestone.label}</h4>
                  <p className="text-sm text-muted-foreground">{milestone.days} days</p>
                </div>
                {milestone.achieved && (
                  <Check className="w-5 h-5 text-primary" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Encouragement */}
        <div className="gradient-card rounded-xl p-4 shadow-soft border-l-4 border-spiritual-teal animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <p className="font-serif text-foreground">
            "Every day you stay strong is a victory. Keep going—God sees your effort."
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Journey;
