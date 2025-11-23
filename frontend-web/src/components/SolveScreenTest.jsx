import { useState } from 'react'
import { solveScreen } from '../lib/supabase'

export function SolveScreenTest() {
  const [questionId, setQuestionId] = useState('')
  const [userQuestionId, setUserQuestionId] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState({})

  const testCall = async (name, fn) => {
    setLoading(true)
    setResults(prev => ({ ...prev, [name]: 'Loading...' }))
    
    try {
      const result = await fn()
      setResults(prev => ({
        ...prev,
        [name]: result.error 
          ? `Error: ${result.error.message}` 
          : JSON.stringify(result.data, null, 2)
      }))
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: `Error: ${error.message}`
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
      <h2>Solve Screen Test</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Question ID"
          value={questionId}
          onChange={(e) => setQuestionId(e.target.value)}
          style={{ padding: '8px', width: '200px', marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="User Question ID"
          value={userQuestionId}
          onChange={(e) => setUserQuestionId(e.target.value)}
          style={{ padding: '8px', width: '200px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => testCall('questionData', () => solveScreen.getQuestionData(questionId))}
          disabled={loading || !questionId}
        >
          Get Question Data
        </button>
        <button 
          onClick={() => testCall('userQuestion', () => solveScreen.getUserQuestion(questionId))}
          disabled={loading || !questionId}
        >
          Get User Question
        </button>
        <button 
          onClick={() => testCall('createUserQuestion', () => solveScreen.createUserQuestion(questionId))}
          disabled={loading || !questionId}
        >
          Create User Question
        </button>
        <button 
          onClick={() => testCall('userQuestionData', () => solveScreen.getUserQuestionData(userQuestionId))}
          disabled={loading || !userQuestionId}
        >
          Get User Question Data
        </button>
      </div>

      <div>
        {Object.entries(results).map(([name, result]) => (
          <div key={name} style={{ marginBottom: '15px' }}>
            <h3>{name}</h3>
            <pre style={{ 
              background: '#f5f5f5', 
              padding: '10px', 
              borderRadius: '4px',
              overflow: 'auto',
              maxHeight: '300px',
              color: 'black'
            }}>
              {result}
            </pre>
          </div>
        ))}
      </div>
    </div>
  )
}
