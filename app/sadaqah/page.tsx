'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const projects = [
  { id: 'masjid_roof', title: 'Masjid Roof Repair', goal: 2000000, desc: 'Help fix leaking roof before Ramadan' },
  { id: 'water_well', title: 'Water Well in Borno', goal: 500000, desc: 'Provide clean water' },
]

export default function Donate(){
  const [donations, setDonations] = useState<any[]>([])
  useEffect(()=>{ supabase.from('donations').select('*').then(({data})=>{ if(data) setDonations(data) }) },[])

  const getRaised = (pid: string) => donations.filter(d=>d.project===pid).reduce((s,a)=>s+a.amount,0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sadaqah Projects</h1>
      <p className="text-sm text-gray-500">No fake progress — bar dey at 0% because no money don enter yet. When you donate, e go move.</p>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map(p=>{
          const raised = getRaised(p.id)
          const percent = p.goal > 0 ? Math.min(100, Math.round((raised / p.goal)*100)) : 0
          return (
            <div key={p.id} className="card p-6">
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{p.desc}</p>
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#0A1931] transition-all duration-700" style={{width: `${percent}%`}}/></div>
              <div className="flex justify-between text-xs mt-2"><span>₦{raised.toLocaleString()} raised</span><span>{percent}%</span></div>
              <button onClick={()=>alert('Connect Paystack / Flutterwave here - only when you ready')} className="mt-4 btn-navy w-full">Donate Now</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
