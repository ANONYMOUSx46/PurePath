import { useState, useEffect } from "react"
import { Search, BookOpen, Bookmark, Clock, ChevronRight, BookMarked, Sparkles, Heart } from "lucide-react"
import { BottomNav } from "@/components/BottomNav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"
import { bibleService, BIBLE_BOOKS, type BibleVerse, type BibleChapter } from "@/lib/bible"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

type ViewMode = 'browse' | 'read' | 'search' | 'bookmarks'

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

  return null
}

export default ScriptureNew
