'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [mode, setMode] = useState<'check' | 'create' | 'enter'>('check')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('haqq_user')
    if (saved) window.location.href = '/vault'
  }, [])

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail.includes('@')) { setErrorMsg('Please enter a valid email address.'); return }
    setLoading(true)
    setErrorMsg('')
    const { data } = await supabase.from('haqq_users').select('email').eq('email', cleanEmail).maybeSingle()
    if (data) setMode('enter')
    else setMode('create')
    setLoading(false)
  }

  async function handlePin(e: React.FormEvent) {
    e.preventDefault()
    if (pin.length !== 4) { setErrorMsg('PIN must be 4 digits.'); return }
    setLoading(true)
    setErrorMsg('')
    const cleanEmail = email.trim().toLowerCase()
    if (mode === 'create') {
      const { error } = await supabase.from('haqq_users').insert({ email: cleanEmail, pin: pin })
      if (error) { setErrorMsg('Something went wrong. Please try again.'); setLoading(false); return }
      localStorage.setItem('haqq_user', cleanEmail)
      window.location.href = '/vault'
    } else {
      const { data } = await supabase.from('haqq_users').select('pin').eq('email', cleanEmail).maybeSingle()
      if (data && data.pin === pin) {
        localStorage.setItem('haqq_user', cleanEmail)
        window.location.href = '/vault'
      } else {
        setErrorMsg('Wrong PIN. Please try again.')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', padding: '0 20px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 900, letterSpacing: 3, fontSize: 16 }}>HAQQ 🔒</span>
        <span style={{ fontSize: 11, background: '#D4AF37', color: '#0f172a', padding: '6px 12px', borderRadius: 20, fontWeight: 800 }}>SECURE VAULT</span>
      </div>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', color: '#0f172a', borderRadius: 24, padding: 24, marginTop: 10, border: '2px solid #D4AF37' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 44 }}>🔐</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: '8px 0 0', letterSpacing: 2 }}>HAQQ</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0 0' }}>Your Private Haqq &amp; Wasiyyah Vault</p>
          <p style={{ fontSize: 12, color: '#D4AF37', fontWeight: 800, marginTop: 10, background: '#fefce8', padding: '6px 10px', borderRadius: 20, display: 'inline-block' }}>NO PASSWORD NEEDED - JUST A 4-DIGIT PIN</p>
        </div>
        {mode === 'check' && (
          <form onSubmit={handleEmail} style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <label style={{ fontSize: 11, fontWeight: 800, color: '#64748b' }}>YOUR EMAIL ADDRESS</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="e.g. musa@gmail.com" required style={{ padding: 16, borderRadius: 14, border: '2px solid #e2e8f0', fontSize: 16, width: '100%', boxSizing: 'border-box', background: '#f8fafc', color: '#0f172a' }} />
            <button disabled={loading} style={{ padding: 16, borderRadius: 14, background: '#0f172a', color: '#fff', fontSize: 16, fontWeight: 800, border: 'none', cursor: 'pointer' }}>{loading ? 'Checking...' : 'Continue'}</button>
            {errorMsg && <p style={{ background: '#fef2f2', color: '#dc2626', padding: 12, borderRadius: 12, fontSize: 13, textAlign: 'center' }}>{errorMsg}</p>}
            <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, lineHeight: 1.5 }}>First time? You will create a PIN.<br/>Returning? You will enter your PIN.</p>
          </form>
        )}
        {(mode === 'create' || mode === 'enter') && (
          <form onSubmit={handlePin} style={{ marginTop: 22, display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'center' }}>
            <p style={{ fontWeight: 800, fontSize: 15, margin: 0 }}>{mode === 'create' ? 'Create Your 4-Digit PIN' : 'Welcome Back'}</p>
            <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{mode === 'create' ? 'Choose a PIN you will remember.' : `Enter your PIN for ${email}`}</p>
            <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))} placeholder="••••" required autoFocus style={{ padding: 16, borderRadius: 14, border: '2px solid #e2e8f0', fontSize: 24, letterSpacing: 12, textAlign: 'center', width: '100%', boxSizing: 'border-box', background: '#f8fafc', color: '#0f172a', fontWeight: 900 }} />
            <button disabled={loading} style={{ padding: 16, borderRadius: 14, background: '#0f172a', color: '#fff', fontSize: 16, fontWeight: 800, border: 'none', cursor: 'pointer' }}>{loading ? 'Please wait...' : mode === 'create' ? 'Create PIN & Enter Vault' : 'Enter Vault'}</button>
            {errorMsg && <p style={{ background: '#fef2f2', color: '#dc2626', padding: 12, borderRadius: 12, fontSize: 13 }}>{errorMsg}</p>}
            <button type="button" onClick={() => { setMode('check'); setPin(''); setErrorMsg('') }} style={{ background: 'none', border: 'none', color: '#64748b', textDecoration: 'underline', cursor: 'pointer' }}>Use a different email</button>
          </form>
        )}
        <div style={{ marginTop: 18, borderTop: '1px solid #f1f5f9', paddingTop: 14, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#94a3b8' }}>
          <span>Private</span><span>Quran 2:282</span><span>Secure PIN Login</span>
        </div>
      </div>
      <p style={{ textAlign: 'center', color: '#64748b', fontSize: 12, marginTop: 16, maxWidth: 340, lineHeight: 1.6 }}>Next time you open HAQQ, you will stay logged in. If you log out, just enter your email and PIN again.</p>
    </div>
  )
            }
