import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type Profile = {
  id: string
  email: string
  username?: string
  avatar_url?: string
  created_at: string
  streak_current: number
  streak_longest: number
  notification_settings: boolean
  daily_verse_time?: string
  streak_reminder_time?: string
  quiet_hours_start?: string
  quiet_hours_end?: string
  theme_preference?: string
  journal_pin?: string
  biometric_enabled?: boolean
  // Growth tracking fields
  verses_read: number
  journal_entries_count: number
  days_active: number
  last_active_date: string | null
  // Push notification settings
  push_token?: string | null
  notification_daily_verse: boolean
  notification_journal_reminder: boolean
  notification_streak_milestone: boolean
}

export type JournalEntry = {
  id: string
  user_id: string
  title: string
  content: string
  mood: string
  created_at: string
  updated_at: string
}

export type Video = {
  id: string
  user_id: string
  title: string
  url: string
  platform: 'youtube' | 'tiktok'
  thumbnail_url?: string
  created_at: string
}

export type ScriptureBookmark = {
  id: string
  user_id: string
  verse: string
  reference: string
  created_at: string
}

// New types for Video Channels feature
export type Channel = {
  id: string
  name: string
  description: string | null
  youtube_channel_id: string
  thumbnail_url: string | null
  subscriber_count: number
  video_count: number
  is_active: boolean
  last_synced_at: string | null
  created_at: string
  updated_at: string
}

export type ChannelVideo = {
  id: string
  channel_id: string
  youtube_video_id: string
  title: string
  description: string | null
  thumbnail_url: string | null
  duration: string | null
  view_count: number
  published_at: string | null
  created_at: string
  updated_at: string
}

export type UserWatchlist = {
  id: string
  user_id: string
  video_id: string
  added_at: string
  watched: boolean
  watch_progress: number
}

export type WatchHistory = {
  id: string
  user_id: string
  video_id: string
  watched_at: string
  watch_duration: number
  completed: boolean
}

// Combined type for video with channel info
export type VideoWithChannel = ChannelVideo & {
  channel: Channel
}

// Combined type for watchlist with video and channel
export type WatchlistItem = UserWatchlist & {
  video: VideoWithChannel
}

// Growth tracking types
export type UserActivity = {
  id: string
  user_id: string
  activity_type: 'verse_read' | 'journal_entry' | 'video_watched' | 'check_in'
  activity_date: string
  metadata: any
  created_at: string
}

export type ScheduledNotification = {
  id: string
  user_id: string
  notification_type: 'daily_verse' | 'journal_reminder' | 'streak_milestone'
  scheduled_for: string
  sent: boolean
  sent_at: string | null
  created_at: string
}
