import { useState } from 'react'
import { collectionScreen } from '../lib/supabase'

export function CollectionTest() {
  const [collectionId, setCollectionId] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleGetCollection = async () => {
    if (!collectionId) {
      setResult('Please enter a collection ID')
      return
    }

    setLoading(true)
    setResult('Loading...')
    
    try {
      const { data, error } = await collectionScreen.getCollectionById(collectionId, isDefault)
      
      if (error) {
        setResult(`Error: ${error.message}`)
      } else {
        setResult(JSON.stringify(data, null, 2))
      }
    } catch (error) {
      setResult(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
      <h2>Collection Test</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Collection ID"
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          style={{ padding: '8px', width: '200px', marginRight: '10px' }}
        />
        <label style={{ marginRight: '10px' }}>
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
            style={{ marginRight: '5px' }}
          />
          Is Default
        </label>
        <button onClick={handleGetCollection} disabled={loading || !collectionId}>
          Get Collection
        </button>
      </div>

      {result && (
        <div>
          <h3>Result</h3>
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '400px',
            color: 'black'
          }}>
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}
