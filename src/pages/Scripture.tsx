import { Search, BookOpen, Bookmark, Clock } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const recentReadings = [
  { title: "Psalm 23", subtitle: "The Lord is my shepherd", time: "Today" },
  { title: "Philippians 4:13", subtitle: "I can do all things...", time: "Yesterday" },
  { title: "Romans 8:28", subtitle: "All things work together...", time: "2 days ago" },
];

const bookmarkedVerses = [
  { verse: "For I know the plans I have for you...", reference: "Jeremiah 29:11" },
  { verse: "Be strong and courageous...", reference: "Joshua 1:9" },
  { verse: "Trust in the Lord with all your heart...", reference: "Proverbs 3:5" },
];

const Scripture = () => {
  return (
    <div className="min-h-screen gradient-peace pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="animate-fade-in">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4">Scripture</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search verses, chapters..."
              className="pl-12 h-12 rounded-xl bg-card border-border"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-6">
        {/* Quick Access */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
          {["Psalms", "Proverbs", "Gospels", "Epistles"].map((book) => (
            <Button key={book} variant="soft" className="flex-shrink-0">
              {book}
            </Button>
          ))}
        </div>

        {/* Recent Readings */}
        <section className="animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-semibold text-foreground">Recent</h2>
          </div>
          <div className="space-y-3">
            {recentReadings.map((reading, index) => (
              <div 
                key={index}
                className="gradient-card rounded-xl p-4 shadow-soft flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{reading.title}</h3>
                    <p className="text-sm text-muted-foreground">{reading.subtitle}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{reading.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Bookmarked Verses */}
        <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center gap-2 mb-4">
            <Bookmark className="w-5 h-5 text-golden-glow" />
            <h2 className="font-serif text-xl font-semibold text-foreground">Bookmarked</h2>
          </div>
          <div className="space-y-3">
            {bookmarkedVerses.map((item, index) => (
              <div 
                key={index}
                className="gradient-card rounded-xl p-4 shadow-soft"
              >
                <p className="font-serif text-foreground mb-2">"{item.verse}"</p>
                <p className="text-sm text-primary font-medium">{item.reference}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default Scripture;
