import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { DailyVerse } from "@/components/DailyVerse";
import { StreakCounter } from "@/components/StreakCounter";
import { TemptationMode } from "@/components/TemptationMode";
import { QuickActions } from "@/components/QuickActions";

const Index = () => {
  const [showTemptationMode, setShowTemptationMode] = useState(false);
  
  // Get current time for greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

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
        {/* Daily Verse */}
        <DailyVerse 
          verse="The Lord is my shepherd; I shall not want. He makes me lie down in green pastures. He leads me beside still waters. He restores my soul."
          reference="Psalm 23:1-3"
          reflection="Today, rest in knowing that God is guiding your every step. You are not alone in this journey."
        />

        {/* Streak Counter */}
        <StreakCounter 
          currentStreak={7}
          longestStreak={21}
          label="Purity Streak"
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

export default Index;
