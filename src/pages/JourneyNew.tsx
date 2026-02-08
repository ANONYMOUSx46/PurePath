import { useState, useEffect } from "react"
import { Plus, Play, Trash2, Youtube, Music, Search, X } from "lucide-react"
import { BottomNav } from "@/components/BottomNav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAuth } from "@/contexts/AuthContext"
import { supabase, type Video } from "@/lib/supabase"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// Helper functions to extract video IDs
const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

const getTikTokId = (url: string): string | null => {
  const match = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/)
  return match ? match[1] : null
}

const getYouTubeThumbnail = (videoId: string) => {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
}

const JourneyNew = () => {
  const { user } = useAuth()
  const [videos, setVideos] = useState<Video[]>([])
  const [isAddingVideo, setIsAddingVideo] = useState(false)
  const [newVideo, setNewVideo] = useState({
    url: '',
    title: '',
  })
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (user) {
      fetchVideos()
    }
  }, [user])

  const fetchVideos = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setVideos(data || [])
    } catch (error: any) {
      toast.error('Failed to load videos', {
        description: error.message,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddVideo = async () => {
    if (!newVideo.url.trim()) {
      toast.error('Please enter a video URL')
      return
    }

    try {
      let platform: 'youtube' | 'tiktok'
      let videoId: string | null
      let thumbnailUrl: string | undefined

      // Determine platform and extract ID
      if (newVideo.url.includes('youtube.com') || newVideo.url.includes('youtu.be')) {
        platform = 'youtube'
        videoId = getYouTubeId(newVideo.url)
        if (!videoId) {
          toast.error('Invalid YouTube URL')
          return
        }
        thumbnailUrl = getYouTubeThumbnail(videoId)
      } else if (newVideo.url.includes('tiktok.com')) {
        platform = 'tiktok'
        videoId = getTikTokId(newVideo.url)
        if (!videoId) {
          toast.error('Invalid TikTok URL')
          return
        }
      } else {
        toast.error('Please enter a valid YouTube or TikTok URL')
        return
      }

      const { data, error } = await supabase
        .from('videos')
        .insert({
          user_id: user!.id,
          title: newVideo.title.trim() || 'Untitled Video',
          url: newVideo.url.trim(),
          platform,
          thumbnail_url: thumbnailUrl,
        })
        .select()
        .single()

      if (error) throw error

      setVideos([data, ...videos])
      setNewVideo({ url: '', title: '' })
      setIsAddingVideo(false)
      toast.success('Video added!')
    } catch (error: any) {
      toast.error('Failed to add video', {
        description: error.message,
      })
    }
  }

  const handleDeleteVideo = async (id: string) => {
    if (!confirm('Are you sure you want to remove this video?')) return

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', id)

      if (error) throw error

      setVideos(videos.filter((v) => v.id !== id))
      toast.success('Video removed')
    } catch (error: any) {
      toast.error('Failed to delete video', {
        description: error.message,
      })
    }
  }

  const renderVideoPlayer = (video: Video) => {
    if (video.platform === 'youtube') {
      const videoId = getYouTubeId(video.url)
      return (
        <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    } else {
      const videoId = getTikTokId(video.url)
      return (
        <div className="aspect-[9/16] max-h-[600px] w-full max-w-sm mx-auto rounded-xl overflow-hidden bg-black">
          <blockquote
            className="tiktok-embed"
            cite={video.url}
            data-video-id={videoId}
            style={{ maxWidth: '100%', minWidth: '325px' }}
          >
            <section>
              <a target="_blank" rel="noopener noreferrer" href={video.url}>
                View on TikTok
              </a>
            </section>
          </blockquote>
          <script async src="https://www.tiktok.com/embed.js"></script>
        </div>
      )
    }
  }

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen gradient-peace pb-24">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between animate-fade-in mb-4">
          <h1 className="font-serif text-3xl font-bold text-foreground">Watch</h1>
          <Button
            variant="golden"
            size="icon"
            onClick={() => setIsAddingVideo(true)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Search */}
        {videos.length > 0 && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search videos..."
              className="pl-12 h-12 rounded-xl bg-card border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="px-6 space-y-6">
        {/* Stats */}
        {videos.length > 0 && (
          <div className="grid grid-cols-3 gap-4 animate-fade-in">
            <div className="gradient-card rounded-xl p-4 shadow-soft text-center">
              <p className="text-2xl font-bold text-foreground">{videos.length}</p>
              <p className="text-xs text-muted-foreground">Videos</p>
            </div>
            <div className="gradient-card rounded-xl p-4 shadow-soft text-center">
              <p className="text-2xl font-bold text-foreground">
                {videos.filter(v => v.platform === 'youtube').length}
              </p>
              <p className="text-xs text-muted-foreground">YouTube</p>
            </div>
            <div className="gradient-card rounded-xl p-4 shadow-soft text-center">
              <p className="text-2xl font-bold text-foreground">
                {videos.filter(v => v.platform === 'tiktok').length}
              </p>
              <p className="text-xs text-muted-foreground">TikTok</p>
            </div>
          </div>
        )}

        {/* Videos Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading videos...</p>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <Play className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No videos found' : 'No videos yet'}
            </p>
            {!searchQuery && (
              <Button variant="golden" onClick={() => setIsAddingVideo(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Video
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="gradient-card rounded-xl overflow-hidden shadow-soft group"
              >
                {/* Thumbnail */}
                <div
                  className="relative aspect-video bg-muted cursor-pointer"
                  onClick={() => setSelectedVideo(video)}
                >
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-spiritual-sage to-spiritual-blue">
                      {video.platform === 'youtube' ? (
                        <Youtube className="w-12 h-12 text-white" />
                      ) : (
                        <Music className="w-12 h-12 text-white" />
                      )}
                    </div>
                  )}
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center">
                      <Play className="w-8 h-8 text-primary ml-1" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-foreground truncate mb-1">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {video.platform === 'youtube' ? (
                          <Youtube className="w-4 h-4 text-red-500" />
                        ) : (
                          <Music className="w-4 h-4 text-foreground" />
                        )}
                        <span className="text-xs text-muted-foreground capitalize">
                          {video.platform}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDeleteVideo(video.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        {videos.length === 0 && !isLoading && (
          <div className="gradient-card rounded-xl p-6 shadow-soft border-l-4 border-primary">
            <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
              💡 How to Add Videos
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Copy the URL from YouTube or TikTok</li>
              <li>• Click the + button above</li>
              <li>• Paste the URL and add a title</li>
              <li>• Save inspiring content for later!</li>
            </ul>
          </div>
        )}
      </main>

      {/* Add Video Dialog */}
      <Dialog open={isAddingVideo} onOpenChange={setIsAddingVideo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="url">Video URL</Label>
              <Input
                id="url"
                placeholder="https://youtube.com/watch?v=... or https://tiktok.com/..."
                value={newVideo.url}
                onChange={(e) => setNewVideo({ ...newVideo, url: e.target.value })}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                YouTube or TikTok links supported
              </p>
            </div>
            <div>
              <Label htmlFor="title">Title (optional)</Label>
              <Input
                id="title"
                placeholder="What's this video about?"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                variant="golden"
                className="flex-1"
                onClick={handleAddVideo}
              >
                Add Video
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddingVideo(false)
                  setNewVideo({ url: '', title: '' })
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Player Dialog */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="sm:max-w-4xl p-0">
          {selectedVideo && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
                onClick={() => setSelectedVideo(null)}
              >
                <X className="w-5 h-5" />
              </Button>
              <div className="p-6">
                {renderVideoPlayer(selectedVideo)}
                <h2 className="font-serif text-xl font-semibold text-foreground mt-4">
                  {selectedVideo.title}
                </h2>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  )
}

export default JourneyNew
