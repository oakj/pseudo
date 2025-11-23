import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { auth } from '../lib/supabase'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'

export function SignupForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { data, error: signUpError } = await auth.signUpWithEmail(email, password)

    if (signUpError) {
      setError(signUpError.message)
    } else {
      setSuccess('Sign up successful! Check your email for verification.')
      setTimeout(() => {
        navigate('/signin')
      }, 2000)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to create your account
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
            minLength={6}
          />
        </div>
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}
        {success && (
          <div className="text-sm text-green-600">{success}</div>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/signin" className="underline underline-offset-4 hover:text-primary">
          Sign in
        </Link>
      </div>
    </div>
  )
}
