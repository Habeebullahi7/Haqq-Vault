'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { encryptField, decryptField } from '@/lib/crypto'

type VaultRow = { id: string, user_id: string, person_enc: string, description_enc: string, amount_enc: string, type: string, status: string, created_at: string }

export default function VaultPage(){
  const [userId, setUserId] = useState<string|null>(null)
  const [rows, setRows] = useState<VaultRow[]>([])
  const [person, setPerson] = useState(''); const [desc, setDesc] = useState(''); const [amount, setAmount] = useState(''); const [type, setType] = useState('debt')
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    (async()=>{
      const { data } = await supabase.auth.getUser()
      if(!data.user){ window.location.href='/account'; return }
      setUserId(data.user.id)
      const { data: vault } = await supabase.from('vaults').select('*').eq('user_id', data.user.id).order('created_at', {ascending: false})
      if(vault) setRows(vault)
      setLoading(false)
    })()
  },[])

  const save = async()=>{
    if(!userId || !person || !desc) return alert('Fill all')
    const payload = {
      user_id: userId,
      person_enc: encryptField(person, userId),
      description_enc: encryptField(desc, userId),
      amount_enc: encryptField(amount, userId),
      type, status: 'owed'
    }
    const { data, error } = await supabase.from('vaults').insert(payload).select().single()
    if(error) return alert(error.message)
    setRows([data, ...rows]); setPerson(''); setDesc(''); setAmount('')
  }

  if(loading) return <div className="text-center py-20 text-gray-400">Unlocking your vault...</div>

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-[#0A1931] rounded-[24px] p-6 text-white dot-grid">
        <h1 className="text-2xl font-bold">My Private Vault</h1>
        <p className="text-white/60 text-sm mt-2">Encrypted on your device. Only you can read it. No money dey there yet - e safe.</p>
      </div>

      <div className="card p-6 space-y-4">
        <h3 className="font-semibold">Add New Haqq (Debt / Right)</h3>
        <div className="grid grid-cols-2 gap-3">
          <select value={type} onChange={e=>setType(e.target.value)} className="border rounded-xl px-4 py-3"><option value="debt">Debt I Owe</option><option value="borrowed">Borrowed Item</option><option value="promise">Unfulfilled Promise</option><option value="harmed">I Harmed Someone</option></select>
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount (optional)" className="border rounded-xl px-4 py-3"/>
        </div>
        <input value={person} onChange={e=>setPerson(e.target.value)} placeholder="Who? e.g. Ahmed" className="w-full border rounded-xl px-4 py-3"/>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What happened? e.g. Borrowed 5k in March" className="w-full border rounded-xl px-4 py-3 h-24"/>
        <button onClick={save} className="btn-navy w-full">Lock Inside Vault 🔒</button>
      </div>

      <div className="space-y-3">
        {rows.length===0 && <div className="card p-10 text-center"><p className="text-4xl">✨</p><p className="mt-4 font-semibold">Your slate is clean</p><p className="text-sm text-gray-500 mt-1">No haqq recorded yet. May Allah keep it so.</p></div>}
        {rows.map(r=>(
          <div key={r.id} className="card p-4 flex justify-between">
            <div>
              <p className="font-semibold text-[#0A1931]">{userId ? decryptField(r.person_enc, userId) : '...'}</p>
              <p className="text-sm text-gray-600 mt-1">{userId ? decryptField(r.description_enc, userId) : '...'}</p>
              <span className="inline-block mt-2 text-[11px] bg-[#F5F7FB] px-2 py-1 rounded-full uppercase tracking-wide">{r.type} • {r.status}</span>
            </div>
            <div className="text-right"><p className="font-bold text-[#0A1931]">{userId ? (decryptField(r.amount_enc, userId) || '-') : '-'}</p></div>
          </div>
        ))}
      </div>
    </div>
  )
}
