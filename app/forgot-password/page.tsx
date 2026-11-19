"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Forgot() {
  const [email, setEmail] = useState('')
  const send = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    if (error) alert(error.message)
    else alert('Check your email for reset link')
  }
  return (
    <div>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <button onClick={send}>Send Reset Link</button>
    </div>
  )
}
