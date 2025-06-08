import { useState, useEffect } from 'react'
import { testData } from '../../supabase'

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
        const [profileRes, streakRes, collectionsRes, questionsRes] = await Promise.all([
          testData.getProfileByUserId(''),
          testData.getStreakByUserId(''),
          testData.getCollectionsByUserId(''),
          testData.getQuestionsByUserId('')
        ])

        // Handle potential errors
        if (profileRes.error) throw new Error(profileRes.error.message)
        if (streakRes.error) throw new Error(streakRes.error.message)
        if (collectionsRes.error) throw new Error(collectionsRes.error.message)
        if (questionsRes.error) throw new Error(questionsRes.error.message)
        
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
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading, error }
}