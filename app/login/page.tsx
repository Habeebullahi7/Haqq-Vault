'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (isSignup) {
      // CREATE ACCOUNT
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      })
      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Account created! Now click Sign In below.')
        setIsSignup(false)
      }
    } else {
      // SIGN IN
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setMessage('Login failed: ' + error.message)
      } else {
        router.push('/vault')
        router.refresh()
      }
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20 }}>
      <h1 style={{ textAlign: 'center', fontSize: 28, fontWeight: 'bold' }}>HAQQ</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: 20 }}>
        {isSignup ? 'Create your account' : 'Welcome back'}
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {isSignup && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            style={{ padding: 14, borderRadius: 10, border: '1px solid #ddd', fontSize: 16 }}
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={{ padding: 14, borderRadius: 10, border: '1px solid #ddd', fontSize: 16 }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ padding: 14, borderRadius: 10, border: '1px solid #ddd', fontSize: 16 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 15, borderRadius: 10, background: '#111', color: '#fff', fontSize: 16, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}
        >
          {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 15, textAlign: 'center', background: '#f5f5f5', padding: 12, borderRadius: 10, fontSize: 14 }}>
          {message}
        </p>
      )}

      <button
        onClick={() => { setIsSignup(!isSignup); setMessage('') }}
        style={{ marginTop: 15, width: '100%', background: 'none', border: 'none', color: '#0070f3', fontSize: 15, cursor: 'pointer', textDecoration: 'underline' }}
      >
        {isSignup ? 'Already have account? Sign In' : "No account? Create Account"}
      </button>
    </div>
  )
}
