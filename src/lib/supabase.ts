import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export type Profile = {
  id: string
  email: string
  created_at: string
  streak_current: number
  streak_longest: number
  notification_settings: boolean
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
