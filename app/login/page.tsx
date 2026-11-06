'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot' | 'otp'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  const handleGoogle = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/vault` }
    })
    if (error) setMessage(error.message)
    setLoading(false)
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else router.push('/vault')
    }
    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } }
      })
      if (error) setMessage(error.message)
      else setMessage('Account created. Please check your email to confirm your account, then sign in.')
    }
    if (mode === 'forgot') {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`
      })
      if (error) setMessage(error.message)
      else setMessage('Password reset link sent to your email.')
    }
    setLoading(false)
  }

  const sendOtp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) setMessage(error.message)
    else setMessage('6-digit code sent to your email.')
    setLoading(false)
  }

  const verifyOtp = async () => {
    setLoading(true)
    const { error } = await supabase.auth.verifyOtp({ email, token: otpCode, type: 'email' })
    if (error) setMessage(error.message)
    else router.push('/vault')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0A1A2F] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <p className="text-xs tracking-[0.2em] text-slate-400 font-semibold">HAQQ • QURAN 2:282</p>
          <h1 className="text-3xl font-bold text-[#0A1A2F] mt-2">Welcome to HAQQ</h1>
          <p className="text-slate-500 text-sm mt-2">Securely access your vault and Wasiyyah. Your data is encrypted and private.</p>
        </div>

        <div className="flex bg-slate-100 rounded-full p-1 mb-6">
          <button onClick={() => setMode('signin')} className={`flex-1 py-2.5 rounded-full text-sm font-semibold ${mode === 'signin' ? 'bg-[#0A1A2F] text-white' : 'text-slate-600'}`}>Sign In</button>
          <button onClick={() => setMode('signup')} className={`flex-1 py-2.5 rounded-full text-sm font-semibold ${mode === 'signup' ? 'bg-[#0A1A2F] text-white' : 'text-slate-600'}`}>Create Account</button>
        </div>

        <button onClick={handleGoogle} disabled={loading} className="w-full border-2 border-slate-200 rounded-xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-slate-50">
          <span className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">G</span>
          Continue with Google
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-slate-200 flex-1" />
          <span className="text-xs text-slate-400">OR WITH EMAIL</span>
          <div className="h-px bg-slate-200 flex-1" />
        </div>

        {mode !== 'otp' ? (
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {mode === 'signup' && (
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" required className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#0A1A2F]" />
            )}
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" required className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#0A1A2F]" />
            {mode !== 'forgot' && (
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (min 8 characters)" required minLength={8} className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none focus:border-[#0A1A2F]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-xs font-semibold text-slate-500">{showPassword ? 'HIDE' : 'SHOW'}</button>
              </div>
            )}
            <button disabled={loading} className="w-full bg-[#0A1A2F] text-white rounded-xl py-3.5 font-semibold">
              {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="space-y-3">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none" />
            <button onClick={sendOtp} disabled={loading} className="w-full bg-[#0A1A2F] text-white rounded-xl py-3.5 font-semibold">Send OTP Code</button>
            <input value={otpCode} onChange={e => setOtpCode(e.target.value)} placeholder="Enter 6-digit code" className="w-full border border-slate-200 rounded-xl px-4 py-3.5 outline-none text-center tracking-[0.3em]" />
            <button onClick={verifyOtp} disabled={loading} className="w-full border-2 border-[#0A1A2F] rounded-xl py-3.5 font-semibold">Verify & Sign In</button>
          </div>
        )}

        {message && <p className="mt-4 text-sm text-center bg-slate-50 border rounded-xl p-3 text-slate-700">{message}</p>}

        <div className="flex justify-between mt-5 text-sm">
          <button onClick={() => setMode(mode === 'otp' ? 'signin' : 'otp')} className="text-[#0A1A2F] font-semibold underline">{mode === 'otp' ? 'Use Password Instead' : 'Use Email OTP Instead'}</button>
          <button onClick={() => setMode(mode === 'forgot' ? 'signin' : 'forgot')} className="text-slate-500 underline">{mode === 'forgot' ? 'Back to Sign In' : 'Forgot Password?'}</button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">Secure • Encrypted • For His Sake<br />By continuing, you agree to HAQQ Terms & Privacy Policy.</p>
      </div>
    </div>
  )
    }
