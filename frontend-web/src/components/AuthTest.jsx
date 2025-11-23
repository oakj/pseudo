import { useState, useEffect } from 'react'
import { auth, supabase } from '../lib/supabase'

export function AuthTest() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [user, setUser] = useState(null)

  // Check current session on mount
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    setUser(session?.user || null)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const { data, error } = await auth.signUpWithEmail(email, password)
    
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Sign up successful! Check your email for verification.')
      setUser(data.user)
    }
    setLoading(false)
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const { data, error } = await auth.signInWithEmail(email, password)
    
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Sign in successful!')
      setUser(data.user)
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    setLoading(true)
    const { error } = await auth.signOut()
    
    if (error) {
      setMessage(`Error: ${error.message}`)
    } else {
      setMessage('Signed out successfully')
      setUser(null)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginBottom: '20px' }}>
      <h2>Auth Test</h2>
      
      {user ? (
        <div>
          <p>Logged in as: {user.email}</p>
          <button onClick={handleSignOut} disabled={loading}>
            Sign Out
          </button>
        </div>
      ) : (
        <form>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: '8px', width: '200px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '8px', width: '200px' }}
            />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleSignUp} disabled={loading}>
              Sign Up
            </button>
            <button onClick={handleSignIn} disabled={loading}>
              Sign In
            </button>
          </div>
        </form>
      )}
      
      {message && (
        <p style={{ marginTop: '10px', color: message.includes('Error') ? 'red' : 'green' }}>
          {message}
        </p>
      )}
    </div>
  )
}
