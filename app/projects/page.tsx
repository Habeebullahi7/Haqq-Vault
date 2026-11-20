'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

const projects = [
  { id: 'masjid_roof', title: 'Masjid Roof Repair', goal: 2000000, desc: 'Help fix the leaking roof before Ramadan' },
  { id: 'water_well', title: 'Water Well in Borno', goal: 500000, desc: 'Provide clean water' },
]

type Donation = { project: string; amount: number }

export default function ProjectsPage(){
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    async function load(){
      // Only fetch what we need for the progress bar - no names, no phones, no emails
      const { data, error } = await supabase
        .from('donations')
        .select('project, amount')
        .eq('status', 'verified') // only verified donations count

      if(!error && data) setDonations(data as Donation[])
      setLoading(false)
    }
    load()
  },[])

  const getRaised = (pid: string) => donations.filter(d=>d.project===pid).reduce((s,a)=>s+a.amount,0)

  if(loading) return <div className="p-6 text-center text-sm text-gray-500">Loading verified donations...</div>

  return (
    <div className="space-y-6 p-4 pb-28 max-w-[720px] mx-auto">
      <h1 className="text-2xl font-bold">Sadaqah Projects</h1>
      <p className="text-sm text-gray-500">Real progress only — the bar starts at 0% and moves only when a verified donation is confirmed.</p>
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map(p=>{
          const raised = getRaised(p.id)
          const percent = p.goal > 0 ? Math.min(100, Math.round((raised / p.goal)*100)) : 0
          return (
            <div key={p.id} className="bg-white rounded-2xl border p-6 shadow-sm">
              <h3 className="font-bold">{p.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{p.desc}</p>
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#0A1931] transition-all duration-700" style={{width: `${percent}%`}}/></div>
              <div className="flex justify-between text-xs mt-2"><span>₦{raised.toLocaleString()} raised of ₦{p.goal.toLocaleString()}</span><span>{percent}%</span></div>
              <a href="/donate" className="block text-center mt-4 py-3 bg-[#0A1931] text-white rounded-xl font-bold no-underline">Donate Now</a>
            </div>
          )
        })}
      </div>
      <p className="text-center text-xs text-gray-400">Donations are verified manually before the bar moves. May Allah accept it.</p>
    </div>
  )
}
