import { SafeAreaView, ScrollView, View } from "react-native"
import { Text } from "../components/ui/text"
import { Header } from "../components/shared/Header"
import { Card } from "../components/ui/card"
import { testData } from "../../supabase"
import { useEffect, useState } from "react"

export default function TestingScreen() {
  const [profile, setProfile] = useState<any>(null)
  const [streak, setStreak] = useState<{streak_days: number[], week_start: Date} | null>(null)
  const [collections, setCollections] = useState<any[]>([])
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTestData() {
      try {
        setLoading(true)
        setError(null)

        // Fetch each piece of data separately to better handle errors
        const profileRes = await testData.getProfileByUserId('')
        if (profileRes.error) {
          console.error('Profile Error:', profileRes.error)
          setError(`Profile Error: ${profileRes.error.message}`)
          return
        }
        setProfile(Array.isArray(profileRes.data) ? profileRes.data[0] : profileRes.data)

        const streakRes = await testData.getStreakByUserId('')
        if (streakRes.error) {
          console.error('Streak Error:', streakRes.error)
          setError(`Streak Error: ${streakRes.error.message}`)
          return
        }
        // Convert week_start to Date and handle array case
        const streakData = Array.isArray(streakRes.data) && streakRes.data[0]
          ? {
              ...streakRes.data[0],
              week_start: new Date(streakRes.data[0].week_start)
            }
          : null
        setStreak(streakData)

        const collectionsRes = await testData.getCollectionsByUserId('')
        if (collectionsRes.error) {
          console.error('Collections Error:', collectionsRes.error)
          setError(`Collections Error: ${collectionsRes.error.message}`)
          return
        }
        setCollections(Array.isArray(collectionsRes.data) ? collectionsRes.data : [])

        const questionsRes = await testData.getQuestionsByUserId('')
        if (questionsRes.error) {
          console.error('Questions Error:', questionsRes.error)
          setError(`Questions Error: ${questionsRes.error.message}`)
          return
        }
        setQuestions(Array.isArray(questionsRes.data) ? questionsRes.data : [])

      } catch (err: any) {
        console.error('Fetch Error:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTestData()
  }, [])

  const renderData = (title: string, data: any) => (
    <Card className="mb-4 p-4">
      <Text className="text-lg font-bold mb-2">{title}</Text>
      {title === "Streak Data" ? (
        <>
          <Text className="text-sm">Streak Days: {data?.streak_days?.join(', ')}</Text>
          <Text className="text-sm">Week Start: {data?.week_start?.toLocaleDateString()}</Text>
        </>
      ) : Array.isArray(data) ? (
        <Text className="text-sm">Items: {data.length}</Text>
      ) : null}
      <Text className="text-sm" selectable>
        {JSON.stringify(data, null, 2)}
      </Text>
    </Card>
  )

  // Add this new function to format the datetime
  const getCurrentDateTime = () => {
    const now = new Date()
    return {
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <Header title="Test Data" />
      
      <ScrollView className="flex-1 p-4">
        <Card className="mb-4 p-4">
          <Text className="text-lg font-bold mb-2">Current DateTime (Local Device Time)</Text>
          <Text className="text-sm">Date: {getCurrentDateTime().date}</Text>
          <Text className="text-sm">Time: {getCurrentDateTime().time}</Text>
          <Text className="text-sm">Timezone: {getCurrentDateTime().timezone}</Text>
        </Card>

        {loading ? (
          <Text className="text-center">Loading test data...</Text>
        ) : error ? (
          <Text className="text-red-500 text-center">{error}</Text>
        ) : (
          <>
            {renderData("Profile Data", profile)}
            {renderData("Streak Data", streak)}
            {renderData("Collections", collections)}
            {renderData("Questions", questions)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}