import { useState, useEffect } from "react"
import { Search, BookOpen, Bookmark, Clock, ChevronRight, BookMarked, Sparkles, Heart, GraduationCap, Shield, LifeBuoy, ChevronDown } from "lucide-react"
import { BottomNav } from "@/components/BottomNav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { bibleService, BIBLE_BOOKS, type BibleVerse, type BibleChapter } from "@/lib/bible"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type ViewMode = 'browse' | 'read' | 'search' | 'bookmarks' | 'guide'

// ── Bible Guide Data ──────────────────────────────────────────────────────────

interface GuideRef {
  label: string
  book: string
  chapter: number
  verses?: string   // display only e.g. "3" or "4-5"
  reference: string // full human label
}

interface GuideItem {
  title: string
  refs: GuideRef[]
  note?: string
}

interface GuideSection {
  id: string
  title: string
  subtitle: string
  icon: 'shield' | 'heart' | 'lifebuoy'
  color: string
  items: GuideItem[]
}

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: 'rules',
    title: "God's Game Plan",
    subtitle: "The Ten Commandments & the law of love",
    icon: 'shield',
    color: 'text-golden-glow',
    items: [
      {
        title: "The Ten Commandments",
        note: "God gave us these rules to live by — not to restrict us, but to protect us and help us thrive.",
        refs: [
          { label: "Rule 1 — No other gods", book: "Exodus", chapter: 20, verses: "3",     reference: "Exodus 20:3" },
          { label: "Rule 2 — No idols",       book: "Exodus", chapter: 20, verses: "4-5",   reference: "Exodus 20:4-5" },
          { label: "Rule 3 — God's name",      book: "Exodus", chapter: 20, verses: "7",     reference: "Exodus 20:7" },
          { label: "Rule 4 — Keep the Sabbath",book: "Exodus", chapter: 20, verses: "8-10",  reference: "Exodus 20:8-10" },
          { label: "Rule 5 — Honour parents",  book: "Exodus", chapter: 20, verses: "12",    reference: "Exodus 20:12" },
          { label: "Rule 6 — Do not murder",   book: "Exodus", chapter: 20, verses: "13",    reference: "Exodus 20:13" },
          { label: "Rule 7 — Do not commit adultery", book: "Exodus", chapter: 20, verses: "14", reference: "Exodus 20:14" },
          { label: "Rule 8 — Do not steal",    book: "Exodus", chapter: 20, verses: "15",    reference: "Exodus 20:15" },
          { label: "Rule 9 — Do not lie",      book: "Exodus", chapter: 20, verses: "16",    reference: "Exodus 20:16" },
          { label: "Rule 10 — Do not covet",   book: "Exodus", chapter: 20, verses: "17",    reference: "Exodus 20:17" },
        ],
      },
      {
        title: "Jesus' Summary of the Law",
        note: "Jesus condensed all the commandments into two great principles.",
        refs: [
          { label: "Love God & love your neighbour", book: "Matthew", chapter: 22, verses: "37-40", reference: "Matthew 22:37-40" },
        ],
      },
      {
        title: "Understanding Sin",
        note: "Paul uses the image of an athlete to help us think about self-discipline and avoiding sin.",
        refs: [
          { label: "Run to win — self-discipline", book: "1 Corinthians", chapter: 9, verses: "24-27", reference: "1 Corinthians 9:24-27" },
        ],
      },
      {
        title: "God's Grace & Forgiveness",
        note: "God is not waiting to condemn us — He is waiting to forgive us.",
        refs: [
          { label: "The blessing of forgiveness", book: "Psalms", chapter: 32, verses: "1-5", reference: "Psalm 32:1-5" },
          { label: "How many times to forgive?",   book: "Matthew", chapter: 18, verses: "21-22", reference: "Matthew 18:21-22" },
          { label: "Forgiving others",             book: "2 Corinthians", chapter: 2, verses: "7",    reference: "2 Corinthians 2:7" },
        ],
      },
    ],
  },
  {
    id: 'help',
    title: "Help & Advice",
    subtitle: "What the Bible says when life gets hard",
    icon: 'lifebuoy',
    color: 'text-spiritual-teal',
    items: [
      { title: "Anger",         refs: [{ label: "Let go of bitterness & rage", book: "Ephesians",      chapter: 4, verses: "31",    reference: "Ephesians 4:31" }] },
      { title: "Anxiety",       refs: [{ label: "God is our refuge and strength", book: "Psalms",      chapter: 46, verses: "",     reference: "Psalm 46" }] },
      { title: "Body",          refs: [
          { label: "Your body is a temple",           book: "1 Corinthians", chapter: 6,  verses: "19-20",  reference: "1 Corinthians 6:19-20" },
          { label: "The resurrection body",           book: "1 Corinthians", chapter: 15, verses: "35-57",  reference: "1 Corinthians 15:35-57" },
        ]},
      { title: "Depression",    refs: [{ label: "Nothing can separate us from God's love", book: "Romans",         chapter: 8,  verses: "28-39",  reference: "Romans 8:28-39" }] },
      { title: "Gossip",        refs: [{ label: "Only words that build up",                book: "Ephesians",      chapter: 4,  verses: "29",     reference: "Ephesians 4:29" }] },
      { title: "Loneliness",    refs: [{ label: "He lifted me out of the pit",             book: "Psalms",         chapter: 40, verses: "1-3",    reference: "Psalm 40:1-3" }] },
      { title: "Loose Morals",  refs: [{ label: "Be careful how you live",                 book: "Ephesians",      chapter: 5,  verses: "15-18",  reference: "Ephesians 5:15-18" }] },
      { title: "Love for Each Other", refs: [{ label: "Love covers a multitude of sins",  book: "1 Peter",        chapter: 4,  verses: "8",      reference: "1 Peter 4:8" }] },
      { title: "Peer Pressure", refs: [{ label: "Wisdom from parents, warning against bad crowds", book: "Proverbs", chapter: 1, verses: "8-19", reference: "Proverbs 1:8-19" }] },
      { title: "Swearing",      refs: [{ label: "Taming the tongue",                       book: "James",          chapter: 3,  verses: "8-9",    reference: "James 3:8-9" }] },
      { title: "Temptation",    refs: [{ label: "Flee youthful lusts",                     book: "2 Timothy",      chapter: 2,  verses: "22",     reference: "2 Timothy 2:22" }] },
      { title: "Witnessing",    refs: [{ label: "You will be my witnesses",                book: "Acts",           chapter: 1,  verses: "8",      reference: "Acts 1:8" }] },
    ],
  },
]

// Map display book names to the keys used by bibleService / BIBLE_BOOKS
const BOOK_NAME_MAP: Record<string, string> = {
  "Exodus":         "Exodus",
  "Matthew":        "Matthew",
  "1 Corinthians":  "1 Corinthians",
  "2 Corinthians":  "2 Corinthians",
  "Psalms":         "Psalms",
  "Romans":         "Romans",
  "Ephesians":      "Ephesians",
  "1 Peter":        "1 Peter",
  "Proverbs":       "Proverbs",
  "James":          "James",
  "2 Timothy":      "2 Timothy",
  "Acts":           "Acts",
}

const ScriptureNew = () => {
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<ViewMode>('browse')
  const [selectedBook, setSelectedBook] = useState<string>('')
  const [selectedChapter, setSelectedChapter] = useState<number>(1)
  const [currentChapter, setCurrentChapter] = useState<BibleChapter | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([])
  const [bookmarks, setBookmarks] = useState<Array<{ id: string; verse: string; reference: string }>>([])
  const [recentReads, setRecentReads] = useState<Array<{ reference: string; timestamp: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null)

  useEffect(() => {
    fetchDailyVerse()
    fetchBookmarks()
    loadRecentReads()
  }, [])

  useEffect(() => {
    if (selectedBook && selectedChapter) {
      loadChapter()
    }
  }, [selectedBook, selectedChapter])

  const fetchDailyVerse = async () => {
    const verse = await bibleService.getRandomVerse()
    if (verse) setDailyVerse(verse)
  }

  const fetchBookmarks = async () => {
    if (!user) return
    try {
      const { data, error } = await supabase
        .from('scripture_bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks(data || [])
    } catch (error: any) {
      console.error('Error fetching bookmarks:', error)
    }
  }

  const loadRecentReads = () => {
    const saved = localStorage.getItem('recentReads')
    if (saved) {
      setRecentReads(JSON.parse(saved))
    }
  }

  const saveRecentRead = (reference: string) => {
    const updated = [
      { reference, timestamp: new Date().toISOString() },
      ...recentReads.filter(r => r.reference !== reference)
    ].slice(0, 10)
    setRecentReads(updated)
    localStorage.setItem('recentReads', JSON.stringify(updated))
  }

  const loadChapter = async () => {
    if (!selectedBook || !selectedChapter) return

    setIsLoading(true)
    try {
      const chapter = await bibleService.getChapter(selectedBook, selectedChapter)
      if (chapter) {
        setCurrentChapter(chapter)
        setViewMode('read')
        saveRecentRead(chapter.reference)
      } else {
        toast.error('Chapter not found')
      }
    } catch (error) {
      toast.error('Failed to load chapter')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      // Try to search by keyword
      const results = await bibleService.searchVerses(searchQuery)
      if (results.length > 0) {
        setSearchResults(results)
        setViewMode('search')
      } else {
        // Try to fetch as direct reference
        const verse = await bibleService.getVerse(searchQuery)
        if (verse) {
          setSearchResults([verse])
          setViewMode('search')
        } else {
          toast.error('No results found')
        }
      }
    } catch (error) {
      toast.error('Search failed')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleBookmark = async (verse: string, reference: string) => {
    if (!user) return

    try {
      const existing = bookmarks.find(b => b.reference === reference)
      
      if (existing) {
        // Remove bookmark
        const { error } = await supabase
          .from('scripture_bookmarks')
          .delete()
          .eq('id', existing.id)

        if (error) throw error
        setBookmarks(bookmarks.filter(b => b.id !== existing.id))
        toast.success('Bookmark removed')
      } else {
        // Add bookmark
        const { data, error } = await supabase
          .from('scripture_bookmarks')
          .insert({
            user_id: user.id,
            verse,
            reference,
          })
          .select()
          .single()

        if (error) throw error
        setBookmarks([data, ...bookmarks])
        toast.success('Verse bookmarked!')
      }
    } catch (error: any) {
      toast.error('Failed to update bookmark', {
        description: error.message,
      })
    }
  }

  const isBookmarked = (reference: string) => {
    return bookmarks.some(b => b.reference === reference)
  }

  // Browse view
  if (viewMode === 'browse') {
    const oldTestament = BIBLE_BOOKS.filter(b => b.testament === 'Old')
    const newTestament = BIBLE_BOOKS.filter(b => b.testament === 'New')

    return (
      <div className="min-h-screen gradient-peace pb-24">
        <header className="px-6 pt-12 pb-6">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-4 animate-fade-in">Scripture</h1>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search verses or enter reference..."
              className="pl-12 h-12 rounded-xl bg-card border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </header>

        <main className="px-6 space-y-6">
          {/* Daily Verse */}
          {dailyVerse && (
            <div className="gradient-card rounded-2xl p-6 shadow-card animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-golden-glow" />
                <h3 className="font-serif text-lg font-semibold text-foreground">Verse of the Day</h3>
              </div>
              <blockquote className="font-serif text-lg leading-relaxed text-foreground mb-3">
                "{dailyVerse.text}"
              </blockquote>
              <div className="flex items-center justify-between">
                <p className="text-sm text-primary font-medium">{dailyVerse.reference}</p>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => toggleBookmark(dailyVerse.text, dailyVerse.reference)}
                >
                  <Heart className={cn("w-4 h-4", isBookmarked(dailyVerse.reference) && "fill-current text-spiritual-ember")} />
                </Button>
              </div>
            </div>
          )}

          {/* Quick Access */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6">
            <Button variant="soft" onClick={() => setViewMode('bookmarks')}>
              <Bookmark className="w-4 h-4 mr-2" />
              Bookmarks
            </Button>
            <Button variant="soft" onClick={() => setViewMode('guide')}>
              <GraduationCap className="w-4 h-4 mr-2" />
              Bible Guide
            </Button>
            <Button variant="soft" onClick={() => {
              setSelectedBook('Psalms')
              setSelectedChapter(23)
            }}>
              Psalms
            </Button>
            <Button variant="soft" onClick={() => {
              setSelectedBook('Proverbs')
              setSelectedChapter(3)
            }}>
              Proverbs
            </Button>
            <Button variant="soft" onClick={() => {
              setSelectedBook('John')
              setSelectedChapter(3)
            }}>
              John
            </Button>
          </div>

          {/* Recent Readings */}
          {recentReads.length > 0 && (
            <section className="animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-primary" />
                <h2 className="font-serif text-xl font-semibold text-foreground">Recent</h2>
              </div>
              <div className="space-y-3">
                {recentReads.slice(0, 5).map((reading, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const parts = reading.reference.split(' ')
                      const chapter = parseInt(parts[parts.length - 1])
                      const book = parts.slice(0, -1).join(' ')
                      setSelectedBook(book)
                      setSelectedChapter(chapter)
                    }}
                    className="w-full gradient-card rounded-xl p-4 shadow-soft flex items-center justify-between hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-primary" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-foreground">{reading.reference}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(reading.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Old Testament */}
          <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2 mb-4">
              <BookMarked className="w-5 h-5 text-spiritual-teal" />
              <h2 className="font-serif text-xl font-semibold text-foreground">Old Testament</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {oldTestament.map((book) => (
                <button
                  key={book.name}
                  onClick={() => {
                    setSelectedBook(book.name)
                    setSelectedChapter(1)
                  }}
                  className="gradient-card rounded-xl p-4 shadow-soft text-left hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-foreground mb-1">{book.name}</h3>
                  <p className="text-xs text-muted-foreground">{book.chapters} chapters</p>
                </button>
              ))}
            </div>
          </section>

          {/* New Testament */}
          <section className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2 mb-4">
              <BookMarked className="w-5 h-5 text-golden-glow" />
              <h2 className="font-serif text-xl font-semibold text-foreground">New Testament</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {newTestament.map((book) => (
                <button
                  key={book.name}
                  onClick={() => {
                    setSelectedBook(book.name)
                    setSelectedChapter(1)
                  }}
                  className="gradient-card rounded-xl p-4 shadow-soft text-left hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-foreground mb-1">{book.name}</h3>
                  <p className="text-xs text-muted-foreground">{book.chapters} chapters</p>
                </button>
              ))}
            </div>
          </section>
        </main>

        <BottomNav />
      </div>
    )
  }

  // Read chapter view
  if (viewMode === 'read' && currentChapter) {
    const book = BIBLE_BOOKS.find(b => b.name === selectedBook)

    return (
      <div className="min-h-screen gradient-peace pb-24">
        <header className="px-6 pt-12 pb-6 sticky top-0 bg-background/95 backdrop-blur-lg z-10 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => setViewMode('browse')}>
              ← Back
            </Button>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {currentChapter.reference}
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBookmark(currentChapter.verses.map(v => v.text).join(' '), currentChapter.reference)}
            >
              <Heart className={cn("w-5 h-5", isBookmarked(currentChapter.reference) && "fill-current text-spiritual-ember")} />
            </Button>
          </div>

          {/* Chapter selector */}
          <div className="flex gap-3">
            <Select value={selectedChapter.toString()} onValueChange={(v) => setSelectedChapter(parseInt(v))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chapter" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: book?.chapters || 1 }, (_, i) => i + 1).map((ch) => (
                  <SelectItem key={ch} value={ch.toString()}>
                    Chapter {ch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedChapter(Math.max(1, selectedChapter - 1))}
                disabled={selectedChapter === 1}
              >
                ←
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSelectedChapter(Math.min(book?.chapters || 1, selectedChapter + 1))}
                disabled={selectedChapter === (book?.chapters || 1)}
              >
                →
              </Button>
            </div>
          </div>
        </header>

        <main className="px-6 py-6 max-w-3xl mx-auto">
          <div className="gradient-card rounded-2xl p-6 shadow-card space-y-4">
            {currentChapter.verses.map((verse) => (
              <div key={verse.verse} className="flex gap-3 group">
                <span className="text-sm font-medium text-primary min-w-[2rem] mt-1">
                  {verse.verse}
                </span>
                <p className="font-serif text-lg leading-relaxed text-foreground flex-1">
                  {verse.text}
                </p>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toggleBookmark(verse.text, `${currentChapter.reference}:${verse.verse}`)}
                >
                  <Heart className={cn(
                    "w-4 h-4",
                    isBookmarked(`${currentChapter.reference}:${verse.verse}`) && "fill-current text-spiritual-ember"
                  )} />
                </Button>
              </div>
            ))}
          </div>
        </main>

        <BottomNav />
      </div>
    )
  }

  // Search results view
  if (viewMode === 'search') {
    return (
      <div className="min-h-screen gradient-peace pb-24">
        <header className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => setViewMode('browse')}>
              ← Back
            </Button>
            <h1 className="font-serif text-2xl font-bold text-foreground">Search Results</h1>
            <div className="w-10" />
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search verses or enter reference..."
              className="pl-12 h-12 rounded-xl bg-card border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
        </header>

        <main className="px-6 space-y-4">
          {searchResults.map((result, index) => (
            <div key={index} className="gradient-card rounded-xl p-4 shadow-soft">
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-medium text-primary">{result.reference}</p>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => toggleBookmark(result.text, result.reference)}
                >
                  <Heart className={cn(
                    "w-4 h-4",
                    isBookmarked(result.reference) && "fill-current text-spiritual-ember"
                  )} />
                </Button>
              </div>
              <p className="font-serif text-foreground">{result.text}</p>
            </div>
          ))}
        </main>

        <BottomNav />
      </div>
    )
  }

  // Bookmarks view
  if (viewMode === 'bookmarks') {
    return (
      <div className="min-h-screen gradient-peace pb-24">
        <header className="px-6 pt-12 pb-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setViewMode('browse')}>
              ← Back
            </Button>
            <h1 className="font-serif text-2xl font-bold text-foreground">Bookmarks</h1>
            <div className="w-10" />
          </div>
        </header>

        <main className="px-6 space-y-4">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No bookmarked verses yet</p>
            </div>
          ) : (
            bookmarks.map((bookmark) => (
              <div key={bookmark.id} className="gradient-card rounded-xl p-4 shadow-soft">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-primary">{bookmark.reference}</p>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => toggleBookmark(bookmark.verse, bookmark.reference)}
                  >
                    <Heart className="w-4 h-4 fill-current text-spiritual-ember" />
                  </Button>
                </div>
                <p className="font-serif text-foreground">{bookmark.verse}</p>
              </div>
            ))
          )}
        </main>

        <BottomNav />
      </div>
    )
  }

  // ── Guide view ──────────────────────────────────────────────────────────────
  if (viewMode === 'guide') {
    return <BibleGuideView
      onBack={() => setViewMode('browse')}
      onOpenChapter={(book, chapter) => {
        setSelectedBook(BOOK_NAME_MAP[book] ?? book)
        setSelectedChapter(chapter)
        // loadChapter is triggered by the useEffect watching selectedBook/selectedChapter
      }}
    />
  }

  return null
}

// ── Bible Guide sub-component ─────────────────────────────────────────────────

function BibleGuideView({
  onBack,
  onOpenChapter,
}: {
  onBack: () => void
  onOpenChapter: (book: string, chapter: number) => void
}) {
  const [openSection, setOpenSection] = useState<string | null>('rules')
  const [openItem, setOpenItem] = useState<string | null>(null)

  const toggleSection = (id: string) =>
    setOpenSection(prev => (prev === id ? null : id))

  const toggleItem = (key: string) =>
    setOpenItem(prev => (prev === key ? null : key))

  const IconComponent = ({ icon, className }: { icon: GuideSection['icon']; className?: string }) => {
    if (icon === 'shield')    return <Shield    className={className} />
    if (icon === 'lifebuoy')  return <LifeBuoy  className={className} />
    return <GraduationCap className={className} />
  }

  return (
    <div className="min-h-screen gradient-peace pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 sticky top-0 bg-background/95 backdrop-blur-lg z-10 border-b border-border">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            ←
          </Button>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">Bible Guide</h1>
            <p className="text-sm text-muted-foreground">Where to find what you need</p>
          </div>
        </div>
      </header>

      <main className="px-6 py-6 space-y-4">
        {/* Intro card */}
        <div className="gradient-card rounded-2xl p-5 shadow-card border-l-4 border-primary animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            <span className="font-medium text-foreground">Your Bible Companion</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Not sure where to turn in the Bible? Tap any reference below to open it directly, or explore God's rules and His advice for everyday life.
          </p>
        </div>

        {/* Sections */}
        {GUIDE_SECTIONS.map((section) => {
          const isOpen = openSection === section.id

          return (
            <div key={section.id} className="gradient-card rounded-2xl shadow-card overflow-hidden animate-fade-in">
              {/* Section header */}
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    section.id === 'rules'  ? "bg-golden-light/20"       : "bg-spiritual-teal/15"
                  )}>
                    <IconComponent icon={section.icon} className={cn("w-5 h-5", section.color)} />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-semibold text-foreground">{section.title}</h2>
                    <p className="text-xs text-muted-foreground">{section.subtitle}</p>
                  </div>
                </div>
                <ChevronDown className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform duration-300",
                  isOpen && "rotate-180"
                )} />
              </button>

              {/* Section body */}
              {isOpen && (
                <div className="border-t border-border divide-y divide-border">
                  {section.items.map((item, itemIdx) => {
                    const itemKey = `${section.id}-${itemIdx}`
                    const isItemOpen = openItem === itemKey

                    return (
                      <div key={itemKey}>
                        {/* Item header — click to expand if it has >1 ref or a note */}
                        {(item.refs.length > 1 || item.note) ? (
                          <button
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors"
                            onClick={() => toggleItem(itemKey)}
                          >
                            <div className="flex-1 pr-3">
                              <p className="font-medium text-foreground text-sm">{item.title}</p>
                              {!isItemOpen && (
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {item.refs.map(r => r.reference).join(' · ')}
                                </p>
                              )}
                            </div>
                            <ChevronDown className={cn(
                              "w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0",
                              isItemOpen && "rotate-180"
                            )} />
                          </button>
                        ) : (
                          /* Single ref, no note — tap goes straight to the chapter */
                          <button
                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/40 transition-colors"
                            onClick={() => onOpenChapter(item.refs[0].book, item.refs[0].chapter)}
                          >
                            <div>
                              <p className="font-medium text-foreground text-sm">{item.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{item.refs[0].reference}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                          </button>
                        )}

                        {/* Expanded item */}
                        {isItemOpen && (
                          <div className="px-5 pb-4 space-y-3 bg-muted/20">
                            {item.note && (
                              <p className="text-sm text-muted-foreground leading-relaxed pt-2 italic">
                                {item.note}
                              </p>
                            )}
                            <div className="space-y-2">
                              {item.refs.map((ref, refIdx) => (
                                <button
                                  key={refIdx}
                                  className="w-full flex items-center justify-between p-3 rounded-xl bg-card hover:bg-card/80 shadow-soft transition-all text-left"
                                  onClick={() => onOpenChapter(ref.book, ref.chapter)}
                                >
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{ref.label}</p>
                                    <p className="text-xs text-primary font-medium mt-0.5">{ref.reference}</p>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <BookOpen className="w-3 h-3" />
                                    <span>Read</span>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground pb-2">
          Tap any reference to open it in the Bible reader
        </p>
      </main>

      <BottomNav />
    </div>
  )
}

export default ScriptureNew
