'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
export default function Admin(){
  const [tickets,setTickets]=useState<any[]>([]); const [vaults,setVaults]=useState<any[]>([]); const [donations,setDonations]=useState<any[]>([])
  useEffect(()=>{ (async()=>{
    const {data: t} = await supabase.from('support_tickets').select('*').order('created_at',{ascending:false}).limit(20)
    const {data: v} = await supabase.from('vaults').select('id, type, status, created_at').order('created_at',{ascending:false}).limit(20)
    const {data: d} = await supabase.from('donations').select('*').order('created_at',{ascending:false}).limit(20)
    if(t) setTickets(t); if(v) setVaults(v); if(d) setDonations(d)
  })() },[])
  return (
    <div className="space-y-6">
      <div className="bg-[#0A1931] rounded-[24px] p-6 text-white"><h1 className="text-2xl font-bold">Admin - HAQQ Control</h1><p className="text-white/60 text-sm mt-2">You see counts only. You CANNOT read vault content because e dey encrypted.</p></div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5"><p className="text-sm text-gray-500">Total Vault Entries</p><p className="text-2xl font-bold">{vaults.length}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">Support Tickets</p><p className="text-2xl font-bold">{tickets.length}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">Total Donations Raised</p><p className="text-2xl font-bold">₦{donations.reduce((s,a)=>s+a.amount,0).toLocaleString()}</p></div>
      </div>
      <div className="card p-6"><h3 className="font-bold mb-3">Recent Support</h3>{tickets.map(t=><div key={t.id} className="border-b py-3 text-sm"><b>{t.name}</b> - {t.email}<br/>{t.message}</div>)}</div>
    </div>
  )
}
