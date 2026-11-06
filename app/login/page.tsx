'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const checkedOnce = useRef(false)

  useEffect(() => {
    if (checkedOnce.current) return
    checkedOnce.current = true
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) window.location.href = '/vault'
    })
  }, [])

  async function sendLink(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) { setErrorMsg('Please enter a valid email address, e.g. musa@gmail.com'); return }
    setLoading(true)
    setErrorMsg('')
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true, emailRedirectTo: window.location.origin + '/auth/callback' }
    })
    if (error) setErrorMsg(error.message)
    else setSent(true)
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', padding: '0 20px 120px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 900, letterSpacing: 3, fontSize: 16 }}>HAQQ <span style={{ color: '#D4AF37' }}>🔒</span></span>
        <span style={{ fontSize: 11, background: '#D4AF37', color: '#0f172a', padding: '6px 12px', borderRadius: 20, fontWeight: 800 }}>SECURE VAULT</span>
      </div>

      <div style={{ width: '100%', maxWidth: 420, background: '#fff', color: '#0f172a', borderRadius: 24, padding: 24, marginTop: 10, boxShadow: '0 20px 50px rgba(0,0,0,0.4)', border: '2px solid #D4AF37' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 44 }}>🔐</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: '8px 0 0', letterSpacing: 2 }}>HAQQ</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0' }}>Your Private Haqq & Wasiyyah Vault</p>
          <p style={{ fontSize: 12, color: '#D4AF37', fontWeight: 800, marginTop: 8, background: '#fefce8', padding: '6px 10px', borderRadius: 20, display: 'inline-block' }}>NO PASSWORD NEEDED</p>
        </div>

        {!sent ? (
          <form onSubmit={sendLink} style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: '#64748b' }}>YOUR EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. musa@gmail.com"
              autoComplete="email"
              inputMode="email"
              required
              style={{ padding: 16, borderRadius: 14, border: '2px solid #e2e8f0', fontSize: 16, width: '100%', boxSizing: 'border-box', outline: 'none', background: '#f8fafc', color: '#0f172a', fontWeight: 600 }}
            />
            <button type="submit" disabled={loading} style={{ padding: 16, borderRadius: 14, background: '#0f172a', color: '#fff', fontSize: 16, fontWeight: 800, border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Sending Link...' : 'Send Login Link'}
            </button>
            {errorMsg && <p style={{ background: '#fef2f2', color: '#dc2626', padding: 12, borderRadius: 12, fontSize: 13, fontWeight: 600, textAlign: 'center' }}>{errorMsg}</p>}
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, lineHeight: 1.5 }}>We will send a secure link to your email.<br/>Open your email, tap <b style={{ color: '#0f172a' }}>Sign in</b>, and you will enter your Vault.</p>
          </form>
        ) : (
          <div style={{ marginTop: 22, textAlign: 'center', background: '#f0fdf4', border: '2px solid #22c55e', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 36 }}>📧</div>
            <p style={{ fontWeight: 900, fontSize: 16, margin: '8px 0 4px' }}>Check Your Email</p>
            <p style={{ color: '#475569', fontSize: 14, lineHeight: 1.5 }}>We sent a login link to<br/><b>{email}</b><br/>Open the email titled <b>“Your sign-in link”</b> and tap <b>Sign in</b>.<br/><span style={{ fontSize: 12 }}>Please check Spam if you do not see it.</span></p>
            <button onClick={() => { setSent(false); setEmail('') }} style={{ marginTop: 12, background: '#fff', border: '1px solid #0f172a', padding: '10px 16px', borderRadius: 20, fontWeight: 800, cursor: 'pointer' }}>Use a Different Email</button>
          </div>
        )}

        <div style={{ marginTop: 18, borderTop: '1px solid #f1f5f9', paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
          <span>Private</span><span>Quran 2:282</span><span>10 Second Login</span>
        </div>
      </div>

      <p style={{ textAlign: 'center', color: '#64748b', fontSize: 12, marginTop: 16, maxWidth: 340, lineHeight: 1.6 }}>
        Next time you open HAQQ, you will be remembered. You will not need to log in again unless you log out.
      </p>
    </div>
  )
}
