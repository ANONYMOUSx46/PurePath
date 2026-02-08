import { useState, useEffect } from 'react'
import { supabase } from './supabase'
import { toast } from 'sonner'

export interface StreakData {
  currentStreak: number
  longestStreak: number
  lastCheckIn: string | null
  canCheckInToday: boolean
  todayCheckedIn: boolean
}

export const useStreak = (userId: string | undefined) => {
  const [streak, setStreak] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastCheckIn: null,
    canCheckInToday: true,
    todayCheckedIn: false,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      fetchStreak()
    }
  }, [userId])

  const fetchStreak = async () => {
    if (!userId) return

    try {
      setIsLoading(true)

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('streak_current, streak_longest')
        .eq('id', userId)
        .single()

      if (profileError) throw profileError

      // Get today's check-in
      const today = new Date().toISOString().split('T')[0]
      const { data: todayLog, error: logError } = await supabase
        .from('streak_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('log_date', today)
        .maybeSingle()

      if (logError && logError.code !== 'PGRST116') throw logError

      // Get last check-in
      const { data: lastLog, error: lastError } = await supabase
        .from('streak_logs')
        .select('log_date')
        .eq('user_id', userId)
        .order('log_date', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (lastError && lastError.code !== 'PGRST116') throw lastError

      setStreak({
        currentStreak: profile.streak_current,
        longestStreak: profile.streak_longest,
        lastCheckIn: lastLog?.log_date || null,
        canCheckInToday: !todayLog,
        todayCheckedIn: !!todayLog,
      })
    } catch (error: any) {
      console.error('Error fetching streak:', error)
      toast.error('Failed to load streak data')
    } finally {
      setIsLoading(false)
    }
  }

  const checkIn = async (): Promise<boolean> => {
    if (!userId || !streak.canCheckInToday) {
      toast.error('Already checked in today!')
      return false
    }

    try {
      const today = new Date().toISOString().split('T')[0]
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

      // Insert today's log
      const { error: insertError } = await supabase
        .from('streak_logs')
        .insert({
          user_id: userId,
          log_date: today,
        })

      if (insertError) throw insertError

      // Check if yesterday was logged
      const { data: yesterdayLog } = await supabase
        .from('streak_logs')
        .select('*')
        .eq('user_id', userId)
        .eq('log_date', yesterday)
        .maybeSingle()

      // Calculate new streak
      let newCurrentStreak = 1
      if (yesterdayLog) {
        newCurrentStreak = streak.currentStreak + 1
      }

      const newLongestStreak = Math.max(newCurrentStreak, streak.longestStreak)

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          streak_current: newCurrentStreak,
          streak_longest: newLongestStreak,
        })
        .eq('id', userId)

      if (updateError) throw updateError

      setStreak({
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastCheckIn: today,
        canCheckInToday: false,
        todayCheckedIn: true,
      })

      // Show celebration message based on streak
      if (newCurrentStreak === 1) {
        toast.success('Great start!', {
          description: 'You\'ve started your journey. Come back tomorrow!',
        })
      } else if (newCurrentStreak === 7) {
        toast.success('🎉 One week strong!', {
          description: 'You\'re building a great habit!',
        })
      } else if (newCurrentStreak === 30) {
        toast.success('🏆 30 days! Incredible!', {
          description: 'You\'re a champion of consistency!',
        })
      } else if (newCurrentStreak % 10 === 0) {
        toast.success(`${newCurrentStreak} days!`, {
          description: 'You\'re amazing! Keep it up!',
        })
      } else {
        toast.success(`Day ${newCurrentStreak}!`, {
          description: 'Another day of faithfulness ✨',
        })
      }

      return true
    } catch (error: any) {
      console.error('Error checking in:', error)
      toast.error('Failed to check in', {
        description: error.message,
      })
      return false
    }
  }

  const resetStreak = async (): Promise<boolean> => {
    if (!userId) return false

    if (!confirm('Are you sure you want to reset your streak? This cannot be undone.')) {
      return false
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          streak_current: 0,
        })
        .eq('id', userId)

      if (error) throw error

      setStreak({
        ...streak,
        currentStreak: 0,
        canCheckInToday: true,
        todayCheckedIn: false,
      })

      toast.success('Streak reset', {
        description: 'Starting fresh! You can check in again.',
      })

      return true
    } catch (error: any) {
      console.error('Error resetting streak:', error)
      toast.error('Failed to reset streak')
      return false
    }
  }

  return {
    streak,
    isLoading,
    checkIn,
    resetStreak,
    refresh: fetchStreak,
  }
}

// Helper function to check if streak needs to be broken
export const checkStreakContinuity = async (userId: string): Promise<boolean> => {
  try {
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    // Get yesterday's log
    const { data: yesterdayLog } = await supabase
      .from('streak_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('log_date', yesterday)
      .maybeSingle()

    // Get today's log
    const { data: todayLog } = await supabase
      .from('streak_logs')
      .select('*')
      .eq('user_id', userId)
      .eq('log_date', today)
      .maybeSingle()

    // Get current profile streak
    const { data: profile } = await supabase
      .from('profiles')
      .select('streak_current')
      .eq('id', userId)
      .single()

    // If no check-in yesterday and no check-in today, and we have a streak, break it
    if (!yesterdayLog && !todayLog && profile && profile.streak_current > 0) {
      await supabase
        .from('profiles')
        .update({ streak_current: 0 })
        .eq('id', userId)

      return false // Streak broken
    }

    return true // Streak continues
  } catch (error) {
    console.error('Error checking streak continuity:', error)
    return true // Don't break streak on error
  }
}
