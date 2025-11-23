import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../lib/supabase'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function SigninForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: signInError } = await auth.signInWithEmail(email, password)

    if (signInError) {
      setError(signInError.message)
    } else {
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to sign in to your account
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>
      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="underline underline-offset-4 hover:text-primary">
          Sign up
        </Link>
      </div>
    </div>
  )
}
