import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { solveScreen } from '../lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

function Result() {
  const { questionId } = useParams()
  const navigate = useNavigate()
  const [evaluation, setEvaluation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadEvaluation() {
      if (!questionId) {
        setError('No question ID provided')
        setLoading(false)
        return
      }

      try {
        const { data: userQuestion, error: uqError } = await solveScreen.getUserQuestion(questionId)
        if (uqError) throw uqError

        if (userQuestion?.user_question_id || userQuestion?.id) {
          const userQuestionId = userQuestion.user_question_id || userQuestion.id
          const { data: uqData, error: uqdError } = await solveScreen.getUserQuestionData(userQuestionId)
          if (uqdError) throw uqdError
          
          setEvaluation(uqData?.submission?.evaluation)
        } else {
          setError('No user question found')
        }
      } catch (err) {
        console.error('Error loading evaluation:', err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    loadEvaluation()
  }, [questionId])

  // Helper function to format keys (snake_case to Title Case)
  const formatKey = (key) => {
    return key.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ')
  }

  // Helper function to render objects recursively
  const renderObject = (obj, level = 0) => {
    if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) {
      return null
    }

    return (
      <div className={`space-y-2 ${level > 0 ? 'ml-4 pl-4 border-l-2 border-border' : ''}`}>
        {Object.entries(obj).map(([k, v]) => {
          // If value is a number, render key and value on the same line
          if (typeof v === 'number') {
            return (
              <div key={k} className="flex items-center gap-2">
                <span className="font-semibold text-sm">{formatKey(k)}:</span>
                <span className="text-muted-foreground">{v.toFixed(2)}</span>
              </div>
            )
          }
          // If value is a boolean
          if (typeof v === 'boolean') {
            return (
              <div key={k} className="flex items-center gap-2">
                <span className="font-semibold text-sm">{formatKey(k)}:</span>
                <span className="text-muted-foreground">{v ? 'Yes' : 'No'}</span>
              </div>
            )
          }
          // If value is an object, render recursively
          if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
            return (
              <div key={k} className="space-y-2">
                <span className="font-semibold text-sm">{formatKey(k)}:</span>
                <div className="ml-4">
                  {renderObject(v, level + 1)}
                </div>
              </div>
            )
          }
          // For arrays and other types
          return (
            <div key={k} className="flex items-center gap-2">
              <span className="font-semibold text-sm">{formatKey(k)}:</span>
              <span className="text-muted-foreground">
                {Array.isArray(v) ? JSON.stringify(v) : String(v)}
              </span>
            </div>
          )
        })}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <div className="text-center py-12 text-muted-foreground">Loading results...</div>
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

  if (!evaluation) {
    return (
      <div className="container mx-auto p-6 max-w-5xl">
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="text-destructive mb-4">No evaluation data available</div>
            <Button onClick={() => navigate(`/solve/${questionId}`)}>Go Back to Solve</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl space-y-6">
      <Button variant="outline" onClick={() => navigate(`/solve/${questionId}`)}>
        ← Back to Solve
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(evaluation).map(([key, value]) => {
            // Special handling for suggestions array
            if (key.toLowerCase() === 'suggestions' && Array.isArray(value)) {
              return (
                <div key={key} className="space-y-3 pb-6 border-b last:border-b-0">
                  <h2 className="text-xl font-semibold">{formatKey(key)}</h2>
                  <div className="space-y-2">
                    {value.map((suggestion, idx) => (
                      <Card key={idx} className="border-l-4 border-l-primary">
                        <CardContent className="pt-4">
                          <p className="text-muted-foreground">{suggestion}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            }

            // Render objects recursively
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              return (
                <div key={key} className="space-y-3 pb-6 border-b last:border-b-0">
                  <h2 className="text-xl font-semibold">{formatKey(key)}</h2>
                  <Card>
                    <CardContent className="pt-4">
                      {renderObject(value)}
                    </CardContent>
                  </Card>
                </div>
              )
            }

            // Render primitive values
            return (
              <div key={key} className="space-y-2 pb-6 border-b last:border-b-0">
                <h2 className="text-xl font-semibold">{formatKey(key)}</h2>
                <div className="text-muted-foreground">
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                   typeof value === 'number' ? value.toFixed(2) :
                   Array.isArray(value) ? (
                     <div className="space-y-2">
                       {value.map((item, idx) => (
                         <Card key={idx}>
                           <CardContent className="py-2">
                             <span>{String(item)}</span>
                           </CardContent>
                         </Card>
                       ))}
                     </div>
                   ) :
                   String(value)}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

export default Result
