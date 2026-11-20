'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Support(){
  const [tab, setTab] = useState<'contact'|'faq'>('contact')
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [msg,setMsg]=useState(''); const [sent,setSent]=useState(false)
  const [loading,setLoading]=useState(false); const [error,setError]=useState('')

  const send = async()=>{
    if(!name.trim() || !email.trim() || !msg.trim()){ setError('Please fill all fields'); return }
    setLoading(true); setError('')
    const { error: insertError } = await supabase.from('support_tickets').insert({ name: name.trim(), email: email.trim(), message: msg.trim(), issue_type: 'general' })
    setLoading(false)
    if(insertError){
      // Fallback: If table/RLS never set, still let user contact you via email/WhatsApp
      setError('We could not save your message here. Please email us directly at Haqqsupport@gmail.com or WhatsApp +234 704 193 5986')
      return
    }
    setSent(true)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4 pb-28">
      <div className="bg-[#0A1931] rounded-[24px] p-6 text-white"><h1 className="text-2xl font-bold">Support & Contact</h1><p className="text-white/60 text-sm mt-2">We reply within 2 hours - 8am to 10pm WAT</p></div>
      <div className="flex gap-2"><button onClick={()=>setTab('contact')} className={`px-5 py-2 rounded-full text-sm ${tab==='contact'?'bg-[#0A1931] text-white':'bg-white border'}`}>Contact Us</button><button onClick={()=>setTab('faq')} className={`px-5 py-2 rounded-full text-sm ${tab==='faq'?'bg-[#0A1931] text-white':'bg-white border'}`}>FAQ / How to use</button></div>
      {tab==='contact' ? (
        <div className="bg-white rounded-[24px] p-6 space-y-4">
          {sent ? <div className="p-6 bg-green-50 rounded-xl text-green-700 text-center">Alhamdulillah! We received your message. We go reply via email.</div> :
          <>
            {error && <p className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</p>}
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="w-full border rounded-xl px-4 py-3"/>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email" className="w-full border rounded-xl px-4 py-3"/>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="How can we help you?" className="w-full border rounded-xl px-4 py-3 h-32"/>
            <button onClick={send} disabled={loading} className="w-full py-3.5 bg-[#0A1931] text-white rounded-xl font-bold">{loading ? 'Sending...' : 'Send Message'}</button>
          </>}
          <div className="pt-4 border-t text-sm text-gray-500 space-y-1">
            <p>Email: <a href="mailto:Haqqsupport@gmail.com" className="font-bold text-black">Haqqsupport@gmail.com</a></p>
            <p>WhatsApp: <a href="https://wa.me/2347041935986" target="_blank" className="font-bold text-black">+234 704 193 5986</a></p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[24px] p-6 space-y-4 text-sm">
          <div><b>1. Is my data private?</b><p className="text-gray-600 mt-1">Yes. Only you can see your Vault after you log in. Other users cannot see it, and we do not read your debts.</p></div>
          <div><b>2. Progress bar no dey move?</b><p className="text-gray-600 mt-1">Correct! E go only move when people don send real money. For now na 0%. No fake numbers.</p></div>
          <div><b>3. How to add debt?</b><p className="text-gray-600 mt-1">Go Vault → Add Haqq → Save am. When you don pay, mark am as Cleared.</p></div>
          <div><b>4. How family go see my Wasiyyah?</b><p className="text-gray-600 mt-1">Your Wasiyyah na document you write for your family. HAQQ no dey auto-unlock am to anyone. Share am yourself with a person you trust.</p></div>
          <div><b>5. How to delete my account?</b><p className="text-gray-600 mt-1">Email Haqqsupport@gmail.com from the same email you used to sign up, and we go delete am.</p></div>
        </div>
      )}
    </div>
  )
}
