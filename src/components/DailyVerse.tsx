import { BookOpen, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyVerseProps {
  verse: string
  reference: string
  reflection: string
}

export function DailyVerse({ verse, reference, reflection }: DailyVerseProps) {
  return (
    <div className="gradient-card rounded-2xl p-6 shadow-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-xl bg-spiritual-lavender/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-primary" />
        </div>
        <h3 className="font-serif text-lg font-semibold text-foreground">Psalm of Encouragement</h3>
      </div>
      
      <blockquote className="font-serif text-lg leading-relaxed text-foreground mb-3 border-l-4 border-primary pl-4">
        "{verse}"
      </blockquote>
      
      <p className="text-sm font-medium text-primary mb-3">{reference}</p>
      
      <p className="text-sm text-muted-foreground leading-relaxed italic">
        {reflection}
      </p>
    </div>
  )
}
