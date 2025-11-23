import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase, userData } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { WeeklyStreak } from '../components/WeeklyStreak'

function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [questions, setQuestions] = useState([])
  const [weeklyStreak, setWeeklyStreak] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkUser()
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchData()
      } else {
        setQuestions([])
        setWeeklyStreak(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchData()
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [questionsResult, streakResult] = await Promise.all([
        userData.getQuestionsByUserId(),
        userData.getStreakByUserId()
      ])
      
      if (questionsResult.error) {
        setError(questionsResult.error.message)
        setQuestions([])
      } else {
        setQuestions(questionsResult.data || [])
        setError(null)
      }

      if (streakResult.error) {
        console.error('Error fetching streak:', streakResult.error)
        setWeeklyStreak(null)
      } else {
        // The data comes as an array, get the first item
        const streakData = Array.isArray(streakResult.data) && streakResult.data.length > 0
          ? streakResult.data[0]
          : null
        setWeeklyStreak(streakData)
      }
    } catch (err) {
      setError(err.message)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyVariant = (difficulty) => {
    const lower = difficulty?.toLowerCase()
    if (lower === 'easy') return 'success'
    if (lower === 'medium') return 'secondary'
    if (lower === 'hard') return 'destructive'
    return 'default'
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12 text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-md mx-auto mt-12">
          <CardHeader>
            <CardTitle className="text-center">Welcome to Pseudo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              Please log in to view your questions.
            </p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate('/signin')}>Sign In</Button>
              <Button variant="outline" onClick={() => navigate('/signup')}>Sign Up</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Weekly Streak Section */}
      {weeklyStreak && (
        <div className="flex justify-center">
          <WeeklyStreak streakData={weeklyStreak} />
        </div>
      )}

      {/* Questions Section */}
      <div>
        <h2 className="text-xl font-bold mb-6">Your Questions</h2>
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
            Error: {error}
          </div>
        )}
        {questions.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <p className="text-center text-muted-foreground">
                No questions found. Start solving to see your questions here!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((question) => (
              <Card 
                key={question.question_id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/solve/${question.question_id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-xl flex-1">
                      {question.title || question.question_title}
                    </CardTitle>
                    {question.is_solved && (
                      <Badge variant="success">Solved</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {question.difficulty && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Difficulty:</span>
                      <Badge variant={getDifficultyVariant(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                    </div>
                  )}
                  {question.design_patterns && question.design_patterns.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Design Patterns:</span>
                      <div className="flex flex-wrap gap-2">
                        {question.design_patterns.map((pattern, index) => (
                          <Badge key={index} variant="outline">
                            {pattern}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
