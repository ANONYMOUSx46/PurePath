import { useState, useEffect } from "react";
import { Shield, X, Heart, BookOpen, Timer, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface TemptationModeProps {
  isOpen: boolean;
  onClose: () => void;
}

const emergencyVerses = [
  { verse: "No temptation has overtaken you that is not common to man. God is faithful, and he will not let you be tempted beyond your ability.", reference: "1 Corinthians 10:13" },
  { verse: "Submit yourselves therefore to God. Resist the devil, and he will flee from you.", reference: "James 4:7" },
  { verse: "I can do all things through Christ who strengthens me.", reference: "Philippians 4:13" },
  { verse: "Create in me a clean heart, O God, and renew a right spirit within me.", reference: "Psalm 51:10" },
  { verse: "The Lord is my strength and my shield; my heart trusts in him, and he helps me.", reference: "Psalm 28:7" },
];

const calmingActivities = [
  "Take 5 deep breaths slowly",
  "Drink a glass of cold water",
  "Step outside for fresh air",
  "Do 20 jumping jacks",
  "Call a trusted friend",
];

export function TemptationMode({ isOpen, onClose }: TemptationModeProps) {
  const [currentVerse, setCurrentVerse] = useState(emergencyVerses[0]);
  const [breathePhase, setBreathePhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [breatheCount, setBreathCount] = useState(4);
  const [isBreathing, setIsBreathing] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * emergencyVerses.length);
      setCurrentVerse(emergencyVerses[randomIndex]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isBreathing) return;

    const timer = setInterval(() => {
      setBreathCount((prev) => {
        if (prev <= 1) {
          setBreathePhase((phase) => {
            if (phase === "inhale") return "hold";
            if (phase === "hold") return "exhale";
            return "inhale";
          });
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathing]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 gradient-emergency" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col px-6 py-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-accent-foreground/20 flex items-center justify-center animate-pulse-gentle">
              <Shield className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-accent-foreground">Stay Strong</h2>
              <p className="text-accent-foreground/70 text-sm">You've got this. Breathe.</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-accent-foreground/70 hover:text-accent-foreground hover:bg-accent-foreground/10"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Scripture Card */}
        <div className="bg-accent-foreground/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-golden-light" />
            <span className="text-sm text-accent-foreground/80">{currentVerse.reference}</span>
          </div>
          <blockquote className="font-serif text-xl leading-relaxed text-accent-foreground text-balance">
            "{currentVerse.verse}"
          </blockquote>
        </div>

        {/* Breathing Exercise */}
        <div className="bg-accent-foreground/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-golden-light" />
            <span className="text-sm font-medium text-accent-foreground">Breathing Exercise</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div 
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-all duration-1000",
                isBreathing && breathePhase === "inhale" && "scale-125",
                isBreathing && breathePhase === "hold" && "scale-125",
                isBreathing && breathePhase === "exhale" && "scale-100"
              )}
              style={{
                background: "linear-gradient(135deg, hsl(var(--golden-light) / 0.3), hsl(var(--deep-teal) / 0.3))",
              }}
            >
              {isBreathing ? (
                <div className="text-center">
                  <span className="text-2xl font-bold text-accent-foreground">{breatheCount}</span>
                  <p className="text-xs text-accent-foreground/70 capitalize">{breathePhase}</p>
                </div>
              ) : (
                <Timer className="w-8 h-8 text-accent-foreground" />
              )}
            </div>
            
            <Button
              variant={isBreathing ? "soft" : "golden"}
              onClick={() => setIsBreathing(!isBreathing)}
              className={cn(isBreathing && "bg-accent-foreground/20 text-accent-foreground")}
            >
              {isBreathing ? "Stop" : "Start Breathing"}
            </Button>
          </div>
        </div>

        {/* Quick Activities */}
        <div className="bg-accent-foreground/10 backdrop-blur-sm rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-golden-light" />
            <span className="text-sm font-medium text-accent-foreground">Quick Distraction</span>
          </div>
          
          <div className="space-y-2">
            {calmingActivities.map((activity, index) => (
              <button
                key={index}
                onClick={() => setSelectedActivity(activity)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl transition-all duration-200",
                  selectedActivity === activity
                    ? "bg-golden-light/20 text-accent-foreground"
                    : "bg-accent-foreground/5 text-accent-foreground/80 hover:bg-accent-foreground/10"
                )}
              >
                <span className="text-sm">{activity}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className="mt-auto text-center py-6">
          <p className="font-serif text-lg text-accent-foreground/90 mb-2">
            This moment will pass.
          </p>
          <p className="text-sm text-accent-foreground/60">
            Every time you resist, you grow stronger.
          </p>
        </div>
      </div>
    </div>
  );
}
