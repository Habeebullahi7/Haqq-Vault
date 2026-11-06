'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function sendCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const cleanEmail = email.trim().toLowerCase()
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: { shouldCreateUser: true }
    })
    if (error) {
      setMessage('Failed: ' + error.message)
    } else {
      setMessage('Code sent to ' + cleanEmail + '. Check your Gmail / Spam.')
      setStep('code')
    }
    setLoading(false)
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: code.trim(),
      type: 'email'
    })
    if (error) {
      setMessage('Wrong code: ' + error.message)
      setLoading(false)
      return
    }
    if (data.session) {
      setMessage('Welcome! Entering Vault...')
      window.location.href = '/vault'
    }
  }

  async function loginWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/vault' }
    })
  }

  const inputStyle: React.CSSProperties = {
    padding: 14, borderRadius: 10, border: '1px solid #ccc',
    fontSize: 16, background: '#fff', color: '#000', width: '100%', boxSizing: 'border-box', outline: 'none'
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, minHeight: '80vh', background: '#fff' }}>
      <h1 style={{ textAlign: 'center', fontSize: 34, fontWeight: '900', color: '#000' }}>HAQQ</h1>
      <p style={{ textAlign: 'center', color: '#555', marginBottom: 20, fontSize: 16 }}>
        {step === 'email' ? 'Enter your email to continue' : 'Enter the 6-digit code from your email'}
      </p>

      {step === 'email' ? (
        <form onSubmit={sendCode} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Gmail" required style={inputStyle} />
          <button type="submit" disabled={loading} style={{ padding: 15, borderRadius: 10, background: '#000', color: '#fff', fontSize: 16, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
            {loading ? 'Sending...' : 'Send Login Code →'}
          </button>
        </form>
      ) : (
        <form onSubmit={verifyCode} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="123456" required style={{ ...inputStyle, textAlign: 'center', fontSize: 24, letterSpacing: 5 }} />
          <button type="submit" disabled={loading} style={{ padding: 15, borderRadius: 10, background: '#000', color: '#fff', fontSize: 16, fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
            {loading ? 'Checking...' : 'Verify & Enter Vault'}
          </button>
          <button type="button" onClick={() => setStep('email')} style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', textDecoration: 'underline' }}>
            Use different email
          </button>
        </form>
      )}

      <div style={{ textAlign: 'center', color: '#999', margin: '20px 0 12px', fontSize: 13 }}>OR</div>

      <button onClick={loginWithGoogle} style={{ width: '100%', padding: 14, borderRadius: 10, background: '#fff', color: '#000', border: '1px solid #000', fontSize: 15, fontWeight: 'bold', cursor: 'pointer' }}>
        Continue with Google
      </button>

      {message && (
        <p style={{ marginTop: 16, textAlign: 'center', background: '#fff', color: '#000', padding: 14, borderRadius: 10, fontSize: 15, fontWeight: 'bold', border: '2px solid #000', lineHeight: 1.5 }}>
          {message}
        </p>
      )}

      <p style={{ textAlign: 'center', color: '#888', fontSize: 12, marginTop: 20 }}>
        No password to remember. We send you a code each time.
      </p>
    </div>
  )
}
