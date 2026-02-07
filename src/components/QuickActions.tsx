import { Shield, BookOpen, PenLine, Play } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

interface QuickActionsProps {
  onTemptationMode: () => void;
}

export function QuickActions({ onTemptationMode }: QuickActionsProps) {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <Button
        variant="emergency"
        size="xl"
        className="flex-col h-auto py-5 gap-2 relative overflow-hidden group"
        onClick={onTemptationMode}
      >
        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <Shield className="w-6 h-6 relative z-10" />
        <span className="text-sm font-medium relative z-10">Temptation Mode</span>
      </Button>
      
      <Button
        variant="soft"
        size="xl"
        className="flex-col h-auto py-5 gap-2 bg-gradient-to-br from-spiritual-sage to-spiritual-blue hover:from-spiritual-blue hover:to-spiritual-sage transition-all duration-300"
        onClick={() => navigate('/scripture')}
      >
        <BookOpen className="w-6 h-6 text-accent" />
        <span className="text-sm font-medium">Read Scripture</span>
      </Button>
      
      <Button
        variant="soft"
        size="xl"
        className="flex-col h-auto py-5 gap-2 bg-gradient-to-br from-spiritual-lavender to-spiritual-cream hover:from-spiritual-cream hover:to-spiritual-lavender transition-all duration-300"
        onClick={() => navigate('/journal')}
      >
        <PenLine className="w-6 h-6 text-spiritual-ember" />
        <span className="text-sm font-medium">Write Journal</span>
      </Button>
      
      <Button
        variant="soft"
        size="xl"
        className="flex-col h-auto py-5 gap-2 bg-gradient-to-br from-golden-light/30 to-spiritual-cream hover:from-spiritual-cream hover:to-golden-light/30 transition-all duration-300"
        onClick={() => navigate('/journey')}
      >
        <Play className="w-6 h-6 text-primary" />
        <span className="text-sm font-medium">Watch Talk</span>
      </Button>
    </div>
  );
}
