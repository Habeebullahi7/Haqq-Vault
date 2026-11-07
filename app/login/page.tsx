'use client'
import { useState, useEffect } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [pin, setPin] = useState('')
  const [step, setStep] = useState<'email' | 'pin-create' | 'pin-enter'>('email')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('haqq_user')
    if (saved) window.location.href = '/vault'
  }, [])

  function goToPin() {
    const clean = email.trim().toLowerCase()
    if (!clean.includes('@') || !clean.includes('.')) {
      setMsg('Please type a correct email like musa@gmail.com')
      return
    }
    setMsg('')
    const savedPin = localStorage.getItem('haqq_pin_' + clean)
    if (savedPin) setStep('pin-enter')
    else setStep('pin-create')
  }

  function goToVault() {
    const clean = email.trim().toLowerCase()
    if (pin.length !== 4) { setMsg('PIN must be 4 numbers'); return }
    if (step === 'pin-create') {
      localStorage.setItem('haqq_pin_' + clean, pin)
      localStorage.setItem('haqq_user', clean)
      window.location.href = '/vault'
    } else {
      const savedPin = localStorage.getItem('haqq_pin_' + clean)
      if (savedPin === pin) {
        localStorage.setItem('haqq_user', clean)
        window.location.href = '/vault'
      } else {
        setMsg('Wrong PIN. Try again.')
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A1931', padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', color: '#0f172a', borderRadius: 24, padding: 24, marginTop: 20, border: '3px solid #D4AF37' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 44 }}>🔐</div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: '8px 0 0' }}>HAQQ</h1>
          <p style={{ color: '#64748b', fontSize: 14, margin: '6px 0' }}>Your Private Haqq & Wasiyyah Vault</p>
          <p style={{ fontSize: 12, color: '#92400e', fontWeight: 800, background: '#fefce8', padding: '8px 10px', borderRadius: 20, display: 'inline-block' }}>NO PASSWORD NEEDED - JUST A 4-DIGIT PIN</p>
        </div>

        {step === 'email' && (
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#64748b' }}>YOUR EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="musa@gmail.com"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              style={{ padding: 18, borderRadius: 14, border: '2px solid #0A1931', fontSize: 18, width: '100%', boxSizing: 'border-box', background: '#fff', color: '#000' }}
            />
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>You typed: <b style={{ color: '#000' }}>{email || '---'}</b></p>
            <button onClick={goToPin} style={{ padding: 18, borderRadius: 14, background: '#0A1931', color: '#fff', fontSize: 17, fontWeight: 800, border: 'none', cursor: 'pointer' }}>Continue →</button>
            {msg && <p style={{ background: '#fef2f2', color: '#dc2626', padding: 12, borderRadius: 12, fontSize: 13, textAlign: 'center' }}>{msg}</p>}
          </div>
        )}

        {(step === 'pin-create' || step === 'pin-enter') && (
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14, textAlign: 'center' }}>
            <p style={{ fontWeight: 800, fontSize: 16, margin: 0 }}>{step === 'pin-create' ? 'Create Your 4-Digit PIN' : 'Welcome Back'}</p>
            <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>{email}</p>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="1234"
              autoFocus
              style={{ padding: 18, borderRadius: 14, border: '2px solid #0A1931', fontSize: 28, letterSpacing: 14, textAlign: 'center', width: '100%', boxSizing: 'border-box', background: '#fff', color: '#000', fontWeight: 900 }}
            />
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>PIN you typed: <b style={{ color: '#000' }}>{pin || '---'}</b></p>
            <button onClick={goToVault} style={{ padding: 18, borderRadius: 14, background: '#0A1931', color: '#fff', fontSize: 17, fontWeight: 800, border: 'none', cursor: 'pointer' }}>{step === 'pin-create' ? 'Create PIN & Enter Vault' : 'Enter Vault'}</button>
            {msg && <p style={{ background: '#fef2f2', color: '#dc2626', padding: 12, borderRadius: 12, fontSize: 13 }}>{msg}</p>}
            <button onClick={() => { setStep('email'); setPin(''); setMsg('') }} style={{ background: 'none', border: 'none', color: '#64748b', textDecoration: 'underline', cursor: 'pointer' }}>Use a different email</button>
          </div>
        )}
      </div>
      <p style={{ color: '#64748b', fontSize: 12, marginTop: 16, textAlign: 'center' }}>If you no see wetin you type for the “You typed” line, close Safari and open am again.</p>
    </div>
  )
      }
