'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getSession()
      if (data.session) window.location.href = '/vault'
    }
    setTimeout(check, 1000)
  }, [])

  async function sendLink(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true, emailRedirectTo: window.location.origin + '/vault' }
    })
    if (error) alert(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto', padding: 20, background: '#fff', minHeight: '80vh' }}>
      <h1 style={{ textAlign: 'center', fontSize: 34, fontWeight: '900', color: '#000' }}>HAQQ</h1>
      <p style={{ textAlign: 'center', color: '#555' }}>Enter your email to continue</p>
      {!sent ? (
        <form onSubmit={sendLink} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your Gmail" required style={{ padding: 14, borderRadius: 10, border: '1px solid #ccc', fontSize: 16, width: '100%' }} />
          <button disabled={loading} style={{ padding: 15, borderRadius: 10, background: '#000', color: '#fff', fontSize: 16, fontWeight: 'bold', border: 'none' }}>
            {loading ? 'Sending...' : 'Send Login Link →'}
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center', background: '#f0fdf4', border: '2px solid #000', borderRadius: 10, padding: 20 }}>
          <p style={{ color: '#000', fontWeight: 'bold' }}>Check your Gmail!</p>
          <p style={{ color: '#333', fontSize: 14 }}>We sent link to <b>{email}</b><br/>Open email and click <b>Sign in</b></p>
          <button onClick={() => setSent(false)} style={{ background: 'none', border: 'none', color: '#0070f3', textDecoration: 'underline' }}>Use different email</button>
        </div>
      )}
      <p style={{ textAlign: 'center', color: '#888', fontSize: 12, marginTop: 20 }}>No password. Just click link from Gmail.</p>
    </div>
  )
}
