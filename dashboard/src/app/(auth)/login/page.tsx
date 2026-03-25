'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
          <span className="text-white text-2xl font-bold">PS</span>
        </div>
        <h1 className="text-2xl font-bold text-text">Planet Studio</h1>
        <p className="text-text-muted mt-1">Sign in to your school dashboard</p>
      </div>

      <form onSubmit={handleLogin} className="card space-y-4">
        {error && (
          <div className="bg-red-50 text-danger text-sm p-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@school.com"
            required
          />
        </div>

        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-text-muted mt-4">
        Setting up a new school?{' '}
        <a href="/signup" className="text-primary font-medium hover:underline">
          Get started
        </a>
      </p>
    </div>
  )
}
