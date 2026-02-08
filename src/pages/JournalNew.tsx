import { useState, useEffect } from "react"
import { Plus, Calendar, Search, Lock, Edit, Trash2, ArrowLeft } from "lucide-react"
import { BottomNav } from "@/components/BottomNav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type JournalEntry } from "@/lib/supabase"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

const moodColors: Record<string, string> = {
  peaceful: "bg-spiritual-sage text-spiritual-teal",
  reflective: "bg-spiritual-lavender text-purple-700",
  hopeful: "bg-golden-light/20 text-golden-glow",
  grateful: "bg-spiritual-cream text-spiritual-teal",
  struggling: "bg-destructive/10 text-destructive",
}

const moodOptions = ["peaceful", "reflective", "hopeful", "grateful", "struggling"]

const Journal = () => {
  const { user } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [newEntry, setNewEntry] = useState({
    title: "",
    content: "",
    mood: "peaceful",
  })

  // Fetch entries
  useEffect(() => {
    if (user) {
      fetchEntries()
    }
  }, [user])

  // Filter entries based on search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEntries(entries)
    } else {
      const query = searchQuery.toLowerCase()
      setFilteredEntries(
        entries.filter(
          (entry) =>
            entry.title.toLowerCase().includes(query) ||
            entry.content.toLowerCase().includes(query)
        )
      )
    }
  }, [searchQuery, entries])

  const fetchEntries = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (error: any) {
      toast.error('Failed to load entries', {
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user!.id,
          title: newEntry.title,
          content: newEntry.content,
          mood: newEntry.mood,
        })
        .select()
        .single()

      if (error) throw error

      setEntries([data, ...entries])
      setNewEntry({ title: "", content: "", mood: "peaceful" })
      setIsCreating(false)
      toast.success('Entry created!')
    } catch (error: any) {
      toast.error('Failed to create entry', {
        description: error.message,
      })
    }
  }

  const handleUpdateEntry = async () => {
    if (!editingEntry || !newEntry.title.trim() || !newEntry.content.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .update({
          title: newEntry.title,
          content: newEntry.content,
          mood: newEntry.mood,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editingEntry.id)
        .select()
        .single()

      if (error) throw error

      setEntries(entries.map((e) => (e.id === data.id ? data : e)))
      setEditingEntry(null)
      setNewEntry({ title: "", content: "", mood: "peaceful" })
      toast.success('Entry updated!')
    } catch (error: any) {
      toast.error('Failed to update entry', {
        description: error.message,
      })
    }
  }

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this entry?')) return

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id)

      if (error) throw error

      setEntries(entries.filter((e) => e.id !== id))
      toast.success('Entry deleted')
    } catch (error: any) {
      toast.error('Failed to delete entry', {
        description: error.message,
      })
    }
  }

  const startEditing = (entry: JournalEntry) => {
    setEditingEntry(entry)
    setNewEntry({
      title: entry.title,
      content: entry.content,
      mood: entry.mood,
    })
    setIsCreating(true)
  }

  const cancelEditing = () => {
    setIsCreating(false)
    setEditingEntry(null)
    setNewEntry({ title: "", content: "", mood: "peaceful" })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return "Today"
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return format(date, 'MMM d')
    }
  }

  // Creating/Editing view
  if (isCreating) {
    return (
      <div className="min-h-screen gradient-peace pb-24">
        <header className="px-6 pt-12 pb-6">
          <div className="flex items-center gap-3 animate-fade-in">
            <Button
              variant="ghost"
              size="icon"
              onClick={cancelEditing}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-serif text-3xl font-bold text-foreground">
              {editingEntry ? 'Edit Entry' : 'New Entry'}
            </h1>
          </div>
        </header>

        <main className="px-6 space-y-6">
          <div className="gradient-card rounded-2xl p-6 shadow-card space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What's on your mind?"
                value={newEntry.title}
                onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="mood">How are you feeling?</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {moodOptions.map((mood) => (
                  <button
                    key={mood}
                    type="button"
                    onClick={() => setNewEntry({ ...newEntry, mood })}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      newEntry.mood === mood
                        ? moodColors[mood]
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {mood}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="content">Your Thoughts</Label>
              <Textarea
                id="content"
                placeholder="Pour out your heart here..."
                value={newEntry.content}
                onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
                className="mt-1 min-h-[300px] resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="golden"
                className="flex-1"
                onClick={editingEntry ? handleUpdateEntry : handleCreateEntry}
              >
                {editingEntry ? 'Update Entry' : 'Save Entry'}
              </Button>
              <Button
                variant="outline"
                onClick={cancelEditing}
              >
                Cancel
              </Button>
            </div>
          </div>

          {/* Today's Prompt */}
          <div className="gradient-card rounded-xl p-4 shadow-soft border-l-4 border-primary">
            <p className="text-sm text-muted-foreground mb-2">Today's Prompt</p>
            <p className="font-serif text-foreground">
              What are you grateful for today? How did you see God's hand in your life?
            </p>
          </div>
        </main>

        <BottomNav />
      </div>
    )
  }

  // Main journal view
  return (
    <div className="min-h-screen gradient-peace pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between animate-fade-in">
          <h1 className="font-serif text-3xl font-bold text-foreground">Journal</h1>
          <Button
            variant="golden"
            size="icon"
            onClick={() => setIsCreating(true)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            className="pl-12 h-12 rounded-xl bg-card border-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-6">
        {/* Stats */}
        <div className="flex gap-4 animate-fade-in">
          <div className="flex-1 gradient-card rounded-xl p-4 shadow-soft text-center">
            <p className="text-2xl font-bold text-foreground">{entries.length}</p>
            <p className="text-xs text-muted-foreground">Entries</p>
          </div>
          <div className="flex-1 gradient-card rounded-xl p-4 shadow-soft text-center">
            <p className="text-2xl font-bold text-foreground">
              {entries.filter(e => {
                const date = new Date(e.created_at)
                const weekAgo = new Date()
                weekAgo.setDate(weekAgo.getDate() - 7)
                return date >= weekAgo
              }).length}
            </p>
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
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your entries...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No entries found' : 'No entries yet'}
            </p>
            {!searchQuery && (
              <Button variant="golden" onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Entry
              </Button>
            )}
          </div>
        ) : (
          <section className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-xl font-semibold text-foreground">
                {searchQuery ? 'Search Results' : 'Recent Entries'}
              </h2>
            </div>
            <div className="space-y-3">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="gradient-card rounded-xl p-4 shadow-soft group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(entry.created_at)}
                        </span>
                        <span className={cn("text-xs px-2 py-1 rounded-full", moodColors[entry.mood])}>
                          {entry.mood}
                        </span>
                      </div>
                      <h3 className="font-serif font-semibold text-foreground">{entry.title}</h3>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => startEditing(entry)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{entry.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <BottomNav />
    </div>
  )
}

export default Journal
