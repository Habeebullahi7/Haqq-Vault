"use client"
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return alert(error.message)

    // Create profile row for this user
    await supabase.from('profiles').insert({
      id: data.user?.id,
      email: email,
      full_name: '',
    })
    router.push('/login')
  }

  return (
    <div>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>
    </div>
  )
}
