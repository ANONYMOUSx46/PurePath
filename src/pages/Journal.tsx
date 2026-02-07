import { Plus, Calendar, Search, Lock } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const journalEntries = [
  { 
    date: "Today", 
    title: "Grateful for peace", 
    preview: "Woke up feeling centered. The morning prayer really helped...",
    mood: "peaceful"
  },
  { 
    date: "Yesterday", 
    title: "A challenging day", 
    preview: "Had some difficult moments but stayed strong. Reminded myself...",
    mood: "reflective"
  },
  { 
    date: "Feb 5", 
    title: "New beginnings", 
    preview: "Started this journey with hope and faith. God is good...",
    mood: "hopeful"
  },
];

const moodColors: Record<string, string> = {
  peaceful: "bg-spiritual-sage text-spiritual-teal",
  reflective: "bg-spiritual-lavender text-purple-700",
  hopeful: "bg-golden-light/20 text-golden-glow",
};

const Journal = () => {
  return (
    <div className="min-h-screen gradient-peace pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between animate-fade-in">
          <h1 className="font-serif text-3xl font-bold text-foreground">Journal</h1>
          <Button variant="golden" size="icon">
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input 
            placeholder="Search entries..."
            className="pl-12 h-12 rounded-xl bg-card border-border"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-6">
        {/* Stats */}
        <div className="flex gap-4 animate-fade-in">
          <div className="flex-1 gradient-card rounded-xl p-4 shadow-soft text-center">
            <p className="text-2xl font-bold text-foreground">12</p>
            <p className="text-xs text-muted-foreground">Entries</p>
          </div>
          <div className="flex-1 gradient-card rounded-xl p-4 shadow-soft text-center">
            <p className="text-2xl font-bold text-foreground">5</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </div>
          <div className="flex-1 gradient-card rounded-xl p-4 shadow-soft text-center">
            <div className="flex items-center justify-center gap-1">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground">Private</p>
          </div>
        </div>

        {/* Entries */}
        <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-semibold text-foreground">Recent Entries</h2>
          </div>
          <div className="space-y-3">
            {journalEntries.map((entry, index) => (
              <div 
                key={index}
                className="gradient-card rounded-xl p-4 shadow-soft"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{entry.date}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${moodColors[entry.mood]}`}>
                    {entry.mood}
                  </span>
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-1">{entry.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{entry.preview}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Prompt */}
        <div className="gradient-card rounded-xl p-4 shadow-soft border-l-4 border-primary animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <p className="text-sm text-muted-foreground mb-2">Today's Prompt</p>
          <p className="font-serif text-foreground">What are you grateful for today? How did you see God's hand in your life?</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Journal;
