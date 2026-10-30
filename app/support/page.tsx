'use client
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
export default function Support(){
  const [tab, setTab] = useState<'contact'|'faq'>('contact')
  const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [msg,setMsg]=useState(''); const [sent,setSent]=useState(false)
  const send = async()=>{
    if(!name || !email || !msg) return alert('Fill all')
    await supabase.from('support_tickets').insert({ name, email, message: msg, issue_type: 'general' })
    setSent(true)
  }
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[#0A1931] rounded-[24px] p-6 text-white"><h1 className="text-2xl font-bold">Support & Contact</h1><p className="text-white/60 text-sm mt-2">We reply within 2 hours - 8am to 10pm WAT</p></div>
      <div className="flex gap-2"><button onClick={()=>setTab('contact')} className={`px-5 py-2 rounded-full text-sm ${tab==='contact'?'bg-[#0A1931] text-white':'bg-white border'}`}>Contact Us</button><button onClick={()=>setTab('faq')} className={`px-5 py-2 rounded-full text-sm ${tab==='faq'?'bg-[#0A1931] text-white':'bg-white border'}`}>FAQ / How to use</button></div>
      {tab==='contact' ? (
        <div className="card p-6 space-y-4">
          {sent ? <div className="p-6 bg-green-50 rounded-xl text-green-700 text-center">Alhamdulillah! We received your message. We go reply via email.</div> :
          <>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" className="w-full border rounded-xl px-4 py-3"/>
            <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Your email" className="w-full border rounded-xl px-4 py-3"/>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="How can we help you?" className="w-full border rounded-xl px-4 py-3 h-32"/>
            <button onClick={send} className="btn-navy w-full">Send Message</button>
          </>}
          <div className="pt-4 border-t text-sm text-gray-500">Email: support@haqq.vault • WhatsApp: +2347041935986</div>
        </div>
      ) : (
        <div className="card p-6 space-y-4 text-sm">
          <div><b>1. Is my data private?</b><p className="text-gray-600 mt-1">Yes. We encrypt on your device before saving. Even us no fit read am.</p></div>
          <div><b>2. Progress bar no dey move?</b><p className="text-gray-600 mt-1">Correct! E go only move when people don send real money. For now na 0%. No fake numbers.</p></div>
          <div><b>3. How to add debt?</b><p className="text-gray-600 mt-1">Go Vault → Add Haqq → Lock am.</p></div>
          <div><b>4. How family go see my Wasi?</b><p className="text-gray-600 mt-1">We are building Wasi vault that will unlock with next-of-kin email after verification.</p></div>
        </div>
      )}
    </div>
  )
}
