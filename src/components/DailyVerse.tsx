import { BookOpen, Heart, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DailyVerseProps {
  verse: string;
  reference: string;
  reflection?: string;
}

export function DailyVerse({ verse, reference, reflection }: DailyVerseProps) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="gradient-card rounded-2xl p-6 shadow-card animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl gradient-golden flex items-center justify-center shadow-soft">
          <BookOpen className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-serif text-lg font-semibold text-foreground">Daily Psalm</h3>
          <p className="text-sm text-muted-foreground">{reference}</p>
        </div>
      </div>
      
      <blockquote className="font-serif text-xl leading-relaxed text-foreground mb-4 text-balance">
        "{verse}"
      </blockquote>
      
      {reflection && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 border-l-2 border-primary/30 pl-4">
          {reflection}
        </p>
      )}
      
      <div className="flex items-center gap-2">
        <Button 
          variant="icon" 
          size="icon-sm"
          onClick={() => setIsLiked(!isLiked)}
          className={cn(isLiked && "text-spiritual-ember bg-spiritual-ember/10")}
        >
          <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
        </Button>
        <Button variant="icon" size="icon-sm">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
