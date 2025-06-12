import { useState, useEffect } from 'react'
import { userData } from '../../supabase'
import { supabase } from '../../supabase'

export interface HomeData {
  profile: {
    user_id: string
    email: string
    avatar_url: string | null
    dark_mode_preference: string
  } | null
  weeklyStreak: {
    streak_days: number[]
    week_start_utc: Date
  } | null
  collections: {
    collection_id: string
    collection_name: string
    is_default: boolean
    user_id: string | null
    default_collection_id: string | null
  }[]
  questions: {
    question_id: string
    title: string
    difficulty: string
    design_patterns: string[]
    is_solved: boolean
  }[]
}

export function useHomeData() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<HomeData | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // First check if we have a valid session
        const { data: session, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) {
          console.error('Session error:', sessionError)
          throw new Error('Failed to get session: ' + sessionError.message)
        }
        
        if (!session.session) {
          console.error('No active session found')
          throw new Error('No active session')
        }

        console.log('Fetching home data...')
        
        const [profileRes, streakRes, collectionsRes, questionsRes] = await Promise.all([
          userData.getProfileByUserId(),
          userData.getStreakByUserId(),
          userData.getCollectionsByUserId(),
          userData.getQuestionsByUserId()
        ])

        // Handle potential errors
        if (profileRes.error) throw new Error('Profile error: ' + profileRes.error.message)
        if (streakRes.error) throw new Error('Streak error: ' + streakRes.error.message)
        if (collectionsRes.error) throw new Error('Collections error: ' + collectionsRes.error.message)
        if (questionsRes.error) throw new Error('Questions error: ' + questionsRes.error.message)
        
        // Convert week_start string to Date if it exists
        const streakData = Array.isArray(streakRes.data) && streakRes.data[0] 
          ? {
              ...streakRes.data[0],
              week_start_utc: new Date(streakRes.data[0].week_start)
            }
          : null
        
        setData({
          profile: Array.isArray(profileRes.data) ? profileRes.data[0] : profileRes.data,
          weeklyStreak: streakData,
          collections: Array.isArray(collectionsRes.data) ? collectionsRes.data : [],
          questions: Array.isArray(questionsRes.data) ? questionsRes.data : []
        })
      } catch (err) {
        console.error('useHomeData error:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}