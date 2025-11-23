import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { solveScreen, supabase } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

function Solve() {
  const { questionId } = useParams()
  const navigate = useNavigate()
  const [questionData, setQuestionData] = useState(null)
  const [userQuestionData, setUserQuestionData] = useState(null)
  const [userQuestionId, setUserQuestionId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      if (!questionId) {
        setError('No question ID provided')
        setLoading(false)
        return
      }

      try {
        // Load question data
        const { data: qData, error: qError } = await solveScreen.getQuestionData(questionId)
        
        if (qError) {
          throw qError
        }
        setQuestionData(qData)

        // Check for existing user question
        const { data: userQuestion, error: uqError } = await solveScreen.getUserQuestion(questionId)
        
        if (uqError) {
          throw uqError
        }

        if (!userQuestion) {
          // Create new user question if it doesn't exist
          const { data: newUserQuestion, error: createError } = await solveScreen.createUserQuestion(questionId)
          
          if (createError) {
            throw createError
          }

          if (newUserQuestion?.id) {
            setUserQuestionId(newUserQuestion.id)
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
              // Create initial empty data structure
              const initialData = {
                user_id: user.id,
                question_id: questionId,
                submission: {
                  solution: {
                    lines: []
                  },
                  timestamp: new Date().toISOString()
                },
                hint_chat: {
                  messages: []
                }
              }
              setUserQuestionData(initialData)
            }
          }
        } else {
          setUserQuestionId(userQuestion.user_question_id || userQuestion.id)
          
          // Load user question data
          const { data: uqData, error: uqdError } = await solveScreen.getUserQuestionData(
            userQuestion.user_question_id || userQuestion.id
          )
          
          if (uqdError) {
            // If error loading, create initial data
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
              const initialData = {
                user_id: user.id,
                question_id: questionId,
                submission: {
                  solution: {
                    lines: []
                  },
                  timestamp: new Date().toISOString()
                },
                hint_chat: {
                  messages: []
                }
              }
              setUserQuestionData(initialData)
            }
          } else {
            setUserQuestionData(uqData)
          }
        }
      } catch (err) {
        console.error('Error loading data:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [questionId])

  const getDifficultyVariant = (difficulty) => {
    const lower = difficulty?.toLowerCase()
    if (lower === 'easy') return 'success'
    if (lower === 'medium') return 'secondary'
    if (lower === 'hard') return 'destructive'
    return 'default'
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="text-center py-12 text-muted-foreground">Loading question data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive mb-4">Error: {error}</div>
            <Button onClick={() => navigate('/')}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!questionData) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive mb-4">Failed to load question data</div>
            <Button onClick={() => navigate('/')}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <Button variant="outline" onClick={() => navigate('/')}>
        ← Back
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4 flex-wrap">
            <CardTitle className="text-3xl flex-1">
              {questionData.title || 'Question'}
            </CardTitle>
            {questionData.metadata?.difficulty && (
              <Badge variant={getDifficultyVariant(questionData.metadata.difficulty)} className="text-sm">
                {questionData.metadata.difficulty}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{questionData.description}</p>
          </div>

          {questionData.constraints && questionData.constraints.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Constraints</h2>
              <ul className="list-none space-y-2">
                {questionData.constraints.map((constraint, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <span className="text-primary mt-1">•</span>
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {questionData.boilerplate_solution && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Boilerplate Solution</h2>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono border">
                {questionData.boilerplate_solution.pseudocode}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {userQuestionData && (
            <>
              <div>
                <h3 className="text-lg font-semibold mb-3">Submission</h3>
                {userQuestionData.submission?.solution?.lines && 
                 userQuestionData.submission.solution.lines.length > 0 ? (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono border">
                    {userQuestionData.submission.solution.lines.join('\n')}
                  </pre>
                ) : (
                  <p className="text-muted-foreground italic">No solution submitted yet</p>
                )}
                {userQuestionData.submission?.timestamp && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Last updated: {new Date(userQuestionData.submission.timestamp).toLocaleString()}
                  </p>
                )}
              </div>

              {userQuestionData.hint_chat?.messages && 
               userQuestionData.hint_chat.messages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Hints</h3>
                  <div className="space-y-3">
                    {userQuestionData.hint_chat.messages.map((message, index) => (
                      <Card 
                        key={index} 
                        className={message.from === 'hint_bot' 
                          ? 'border-l-4 border-l-primary' 
                          : 'border-l-4 border-l-success'
                        }
                      >
                        <CardContent className="pt-4">
                          <div className="font-semibold text-sm mb-1">
                            {message.from === 'hint_bot' ? 'Bot' : 'You'}
                          </div>
                          <div className="text-muted-foreground mb-2">{message.message}</div>
                          {message.timestamp && (
                            <div className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleString()}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {userQuestionData?.submission?.evaluation && (
            <div className="pt-4">
              <Button 
                onClick={() => navigate(`/result/${questionId}`)}
                className="w-full"
              >
                View Results
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Solve
