import { useState } from 'react'
import { userData } from '../lib/supabase'

export function UserDataTest() {
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
      <h2>User Data Test</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => testCall('profile', userData.getProfileByUserId)}
          disabled={loading}
        >
          Get Profile
        </button>
        <button 
          onClick={() => testCall('streak', userData.getStreakByUserId)}
          disabled={loading}
        >
          Get Streak
        </button>
        <button 
          onClick={() => testCall('collections', userData.getCollectionsByUserId)}
          disabled={loading}
        >
          Get Collections
        </button>
        <button 
          onClick={() => testCall('questions', userData.getQuestionsByUserId)}
          disabled={loading}
        >
          Get Questions
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
