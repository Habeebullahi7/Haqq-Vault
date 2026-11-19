// app/lawyer/page.tsx
'use client'
import { useState } from 'react'
import { supabase } from "@/lib/supabase"

const LAWYER_CODES: any = {
  'YUSUF01': { name: 'Barr. Yusuf Emiola', id: 'lawyer-yusuf', phone: '2348171997051' },
  'AKANBI02': { name: 'Barr. Akanbi', id: 'lawyer-akanbi', phone: '2348163528607' },
  'HABEEB03': { name: 'Barr. Habeeb', id: 'lawyer-habeeb', phone: '2348169894541' },
}

export default function LawyerPage() {
  const [code, setCode] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [lawyerName, setLawyerName] = useState('')
  const [myLawyerId, setMyLawyerId] = useState('')
  const [assigned, setAssigned] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const login = () => {
    const key = code.trim().toUpperCase()
    const entry = LAWYER_CODES[key]
    if (entry) {
      setLawyerName(entry.name); setMyLawyerId(entry.id); setLoggedIn(true); fetchAssigned(entry.id)
    } else {
      alert('Invalid lawyer code. Contact HAQQ Admin.')
    }
  }

  async function fetchAssigned(lawyerId: string) {
    setLoading(true)
    const { data: wasiyyahs } = await supabase.from('wasiyyahs').select('*').eq('status', 'ACTIVE_LOCKED').order('updated_at', { ascending: false })
    const filtered = (wasiyyahs || []).filter((w: any) =>
      w.data?.lawyerChoice === 'haqq' &&
      w.data?.lawyerPaid === true &&
      w.data?.selectedLawyerId === lawyerId
    )
    setAssigned(filtered)
    setLoading(false)
  }

  async function markReviewed(id: string) {
    if (!confirm('Mark this Wasiyyah as Reviewed & Approved?')) return
    const { data: row } = await supabase.from('wasiyyahs').select('data').eq('id', id).single()
    const newData = { ...(row?.data || {}), lawyerApproved: true, lawyerApprovedBy: lawyerName, lawyerApprovedAt: new Date().toISOString() }
    await supabase.from('wasiyyahs').update({ data: newData }).eq('id', id)
    alert('Approved! Your name will appear on the Final PDF.')
    fetchAssigned(myLawyerId)
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#0A1931] flex items-center justify-center px-4">
        <div className="bg-white rounded-[24px] p-6 w-full max-w-[400px] text-black text-center">
          <h1 className="text-[24px] font-black">HAQQ For Lawyers ⚖️</h1>
          <p className="text-sm text-gray-600 mt-1">Enter your Lawyer Access Code to view Wasiyyahs assigned to YOU.</p>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. Yusuf01" className="w-full mt-4 p-3 border rounded-xl text-center font-bold outline-none" />
          <button onClick={login} className="w-full mt-3 bg-black text-white py-3.5 rounded-full font-bold">Login As Lawyer</button>
          <p className="text-[11px] text-gray-400 mt-3">Don&apos;t have a code? WhatsApp HAQQ Admin: +234 704 193 5986</p>
          <p className="text-[11px] text-gray-400 mt-1">Codes: Yusuf01 • Akanbi02 • Habeeb03</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A1931] text-white pb-20">
      <div className="max-w-[600px] mx-auto px-4 pt-6">
        <h1 className="text-[20px] font-black">Welcome, {lawyerName}</h1>
        <p className="text-white/60 text-sm">You have {assigned.length} Wasiyyah(s) assigned to YOU.</p>
        <button onClick={() => fetchAssigned(myLawyerId)} className="mt-3 bg-white text-black px-4 py-2 rounded-full text-sm font-bold">🔄 Refresh</button>
        <div className="mt-5 space-y-3">
          {loading && <p className="text-white/60 text-sm">Loading your cases...</p>}
          {!loading && assigned.length === 0 && (
            <div className="bg-white/10 rounded-[20px] p-6 text-center">
              <p className="font-bold">No Wasiyyah assigned to you yet</p>
              <p className="text-sm text-white/60 mt-1">When a user selects you and pays ₦25,000, e go show here + you go get WhatsApp notification.</p>
            </div>
          )}
          {assigned.map((w) => {
            const d = w.data || {}
            return (
              <div key={w.id} className="bg-white text-black rounded-[20px] p-4">
                <div className="flex justify-between"><h3 className="font-extrabold">{d.fullName || 'No Name'}</h3><span className="text-[11px] bg-yellow-100 px-2 py-1 rounded-full font-bold">{w.status}</span></div>
                <p className="text-sm text-gray-600 mt-1">{d.location || '-'} • Net: ₦{(d.net || 0).toLocaleString()} • {new Date(w.updated_at).toLocaleDateString('en-NG')}</p>
                <p className="text-[12px] text-gray-500">HAQQ Lawyer - {d.haqqLawyerType} • Paid ✓ • Version {w.version}</p>
                {d.selectedLawyerName && <p className="text-[12px] font-bold text-green-700">Assigned to: {d.selectedLawyerName}</p>}
                {d.lawyerApproved && <p className="text-[12px] font-bold text-green-600 mt-1">✓ Approved by {d.lawyerApprovedBy}</p>}
                <p className="text-[12px] text-gray-600 mt-2">Executor: {d.executorName} ({d.executorPhone}) • Witnesses: {d.witness1Name}, {d.witness2Name}</p>
                {d.haqqLawyerNote && <p className="text-[12px] bg-blue-50 p-2 rounded-lg mt-2">Client Note: {d.haqqLawyerNote}</p>}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => alert(`Wasiyyah Details:\n\nAssets: ₦${(d.totalAssets||0).toLocaleString()}\nDebts: ₦${(d.totalDebts||0).toLocaleString()}\nNet: ₦${(d.net||0).toLocaleString()}\nWasiyyah: ${d.wasiyyahTo} - ₦${d.wasiyyahAmt}\n\nFaraid: ${(d.faraid||[]).map((f:any)=>`${f.name}: ₦${f.amt.toLocaleString()}`).join(', ')}`)} className="flex-1 bg-black text-white py-2.5 rounded-full font-bold text-sm">Review Wasiyyah</button>
                  <button onClick={() => markReviewed(w.id)} className="flex-1 bg-green-600 text-white py-2.5 rounded-full font-bold text-sm">Approve & Sign</button>
                </div>
                {d.executorPhone && <button onClick={() => window.open(`https://wa.me/${String(d.executorPhone).replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello, I am ${lawyerName} reviewing your Wasiyyah on HAQQ.`)}`, '_blank')} className="w-full mt-2 py-2 rounded-full border font-bold text-sm">Message Client On WhatsApp</button>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
