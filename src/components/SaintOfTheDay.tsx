import { useEffect, useState } from "react"
import { Calendar, Sparkles, Crown } from "lucide-react"
import { getTodaysSaint, type Saint } from "@/lib/saintsCalendar"
import { cn } from "@/lib/utils"

export function SaintOfTheDay() {
  const [saint, setSaint] = useState<Saint | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const todaysSaint = getTodaysSaint()
    setSaint(todaysSaint)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="gradient-card rounded-2xl p-6 shadow-card animate-pulse">
        <div className="h-6 bg-muted rounded w-1/2 mb-4" />
        <div className="h-4 bg-muted rounded w-full mb-2" />
        <div className="h-4 bg-muted rounded w-3/4" />
      </div>
    )
  }

  if (!saint) {
    return (
      <div className="gradient-card rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-golden-glow" />
          <h3 className="font-serif text-lg font-semibold text-foreground">Saint of the Day</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          No saint feast day for today. Check back tomorrow!
        </p>
      </div>
    )
  }

  // Get memorial rank styling
  const getMemorialColor = (memorial: string) => {
    switch (memorial) {
      case 'solemnity': return 'text-golden-glow bg-golden-light/20'
      case 'feast': return 'text-spiritual-ember bg-spiritual-ember/15'
      case 'memorial': return 'text-spiritual-teal bg-spiritual-teal/15'
      default: return 'text-muted-foreground bg-muted/50'
    }
  }

  const getMemorialLabel = (memorial: string) => {
    switch (memorial) {
      case 'solemnity': return 'Solemnity'
      case 'feast': return 'Feast Day'
      case 'memorial': return 'Memorial'
      default: return 'Optional Memorial'
    }
  }

  return (
    <div className="gradient-card rounded-2xl p-6 shadow-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-golden-light/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-golden-glow" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-semibold text-foreground">Saint of the Day</h3>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        
        {/* Memorial rank badge */}
        <div className={cn(
          "px-3 py-1 rounded-full text-xs font-medium",
          getMemorialColor(saint.memorial)
        )}>
          {getMemorialLabel(saint.memorial)}
        </div>
      </div>

      {/* Saint name with icon */}
      <div className="mb-3 pb-3 border-b border-border">
        <h4 className="font-serif text-xl font-bold text-foreground flex items-center gap-2">
          {saint.memorial === 'solemnity' && <Sparkles className="w-5 h-5 text-golden-glow" />}
          {saint.name}
        </h4>
      </div>

      {/* Biography */}
      <p className="text-sm text-foreground leading-relaxed mb-4">
        {saint.bio}
      </p>

      {/* Patron of */}
      {saint.patronOf.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex items-start gap-2">
            <Crown className="w-4 h-4 text-golden-glow mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                Patron Saint of
              </p>
              <p className="text-sm text-foreground">
                {saint.patronOf.join(' • ')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer note for non-Catholics */}
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground italic">
          Catholic tradition honors saints as heroes of faith whose lives inspire us to follow Christ more closely.
        </p>
      </div>
    </div>
  )
}
