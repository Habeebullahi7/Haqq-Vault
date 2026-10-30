'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
export default function Account(){
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [user,setUser]=useState<any>(null)
  useEffect(()=>{ supabase.auth.getUser().then(({data})=>setUser(data.user)) },[])
  const signup = async()=>{ const {error} = await supabase.auth.signUp({email,password}); if(error) alert(error.message); else alert('Check email to confirm!') }
  const login = async()=>{ const {error} = await supabase.auth.signInWithPassword({email,password}); if(error) alert(error.message); else window.location.href='/vault' }
  const logout = async()=>{ await supabase.auth.signOut(); window.location.href='/' }
  if(user) return <div className="card p-8 max-w-md mx-auto text-center"><h2 className="font-bold">Salaam, {user.email}</h2><p className="text-sm text-gray-500 mt-2">Your vault is secured</p><button onClick={logout} className="mt-6 btn-navy w-full">Logout</button></div>
  return (
    <div className="card p-8 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Create Account / Login</h1>
      <p className="text-sm text-gray-500">Your email unlocks your encrypted vault.</p>
      <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full border rounded-xl px-4 py-3"/>
      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password (min 6)" className="w-full border rounded-xl px-4 py-3"/>
      <button onClick={login} className="btn-navy w-full">Login</button>
      <button onClick={signup} className="border rounded-xl w-full py-3">Create New Account</button>
    </div>
  )
}
