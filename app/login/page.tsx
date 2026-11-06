'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [checking, setChecking] = useState(true)

  // If user don already login before, carry am go Vault straight
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        window.location.href = '/vault'
      } else {
        setChecking(false)
      }
    }
    checkSession()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const cleanEmail = email.trim().toLowerCase()

    if (isSignup) {
      const { error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: { data: { full_name: name } }
      })
      if (error) {
        setMessage('Signup failed: ' + error.message)
      } else {
        setMessage('Account created! Now click Sign In below.')
        setIsSignup(false)
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      })
      if (error) {
        if (error.message.toLowerCase().includes('email not confirmed')) {
          setMessage('Email not confirmed. Go Supabase > Users > Confirm this user, or turn OFF Confirm email.')
        } else if (error.message.toLowerCase().includes('invalid login')) {
          setMessage('Login failed: Wrong email or password. Try again or create new account.')
        } else {
          setMessage('Login failed: ' + error.message)
        }
      } else if (data.session) {
        setMessage('Login successful! Entering Vault...')
        // Force full reload - this na wetin dey fix "Sign in no carry me enter"
        setTimeout(() => {
          window.location.href = '/vault'
        }, 800)
      } else {
        setMessage('Login failed: No session. Try again.')
      }
    }
    setLoading(false)
  }

  if (checking) {
    return (
      <div style={{ maxWidth: 400, margin: '60px auto', padding: 20, textAlign: 'center' }}>
        <p style={{ color: '#000', fontSize: 16, fontWeight: 'bold' }}>Checking login...</p>
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    padding: 14,
    borderRadius: 10,
    border: '1px solid #ccc',
    fontSize: 16,
    background: '#ffffff',
    color: '#000000',
    width: '100%',
    boxSizing: 'border-box',
    outline: 'none'
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, minHeight: '80vh', background: '#ffffff' }}>
      <h1 style={{ textAlign: 'center', fontSize: 34, fontWeight: '900', color: '#000000', marginBottom: 4 }}>HAQQ</h1>
      <p style={{ textAlign: 'center', color: '#333333', marginBottom: 22, fontSize: 16 }}>
        {isSignup ? 'Create your account' : 'Welcome back'}
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {isSignup && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full Name"
            required
            style={inputStyle}
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={inputStyle}
        />
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ ...inputStyle, paddingRight: 60 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#0070f3', fontSize: 13, fontWeight: 'bold', cursor: 'pointer' }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ padding: 15, borderRadius: 10, background: '#000000', color: '#ffffff', fontSize: 16, fontWeight: 'bold', border: 'none', cursor: 'pointer', width: '100%', opacity: loading ? 0.6 : 1 }}
        >
          {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: 16, textAlign: 'center', background: '#ffffff', color: '#000000', padding: 14, borderRadius: 10, fontSize: 15, fontWeight: 'bold', border: '2px solid #000000', lineHeight: 1.5 }}>
          {message}
        </p>
      )}

      <button
        onClick={() => { setIsSignup(!isSignup); setMessage('') }}
        style={{ marginTop: 16, width: '100%', background: 'none', border: 'none', color: '#0070f3', fontSize: 15, cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }}
      >
        {isSignup ? 'Already have account? Sign In' : "No account? Create Account"}
      </button>

      <p style={{ textAlign: 'center', color: '#888', fontSize: 12, marginTop: 20 }}>
        Your Wasiyyah is private & secure.
      </p>
    </div>
  )
}
