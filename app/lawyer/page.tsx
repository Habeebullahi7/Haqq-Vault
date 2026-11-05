'use client'
import { useState } from 'react'

export default function LawyerPage() {
  const [code, setCode] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [lawyerName, setLawyerName] = useState('')

  const LAWYERS: any = {
    'LAWYER-001': 'Barr. Yusuf Emiola',
    'LAWYER-002': 'Barr. Fatima Bello',
    'HAQQ-ADMIN': 'HAQQ Admin Lawyer'
  }

  const login = () => {
    if (LAWYERS[code]) { setLawyerName(LAWYERS[code]); setLoggedIn(true) }
    else alert('Invalid lawyer code. Contact HAQQ Admin.')
  }

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#0A1931] flex items-center justify-center px-4">
        <div className="bg-white rounded-[24px] p-6 w-full max-w-[400px] text-black text-center">
          <h1 className="text-[24px] font-black">HAQQ For Lawyers ⚖️</h1>
          <p className="text-sm text-gray-600 mt-1">Enter your Lawyer Access Code to view assigned Wasiyyahs.</p>
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. LAWYER-001" className="w-full mt-4 p-3 border rounded-xl text-center font-bold outline-none" />
          <button onClick={login} className="w-full mt-3 bg-black text-white py-3.5 rounded-full font-bold">Login As Lawyer</button>
          <p className="text-[11px] text-gray-400 mt-3">Don&apos;t have a code? WhatsApp HAQQ Admin: +234 801 234 5678</p>
        </div>
      </div>
    )
  }

  const assigned = [
    { id: 1, name: 'Alhaji Musa Ibrahim', city: 'Kano', net: '₦45,000,000', status: 'Waiting For Review', date: 'Nov 2, 2026', type: 'HAQQ Lawyer - ₦25,000 Paid' },
    { id: 2, name: 'Mrs. Aisha Bello', city: 'Lagos', net: '₦12,000,000', status: 'Reviewed - Approved', date: 'Oct 28, 2026', type: 'My Own Lawyer' },
  ]

  return (
    <div className="min-h-screen bg-[#0A1931] text-white pb-20">
      <div className="max-w-[600px] mx-auto px-4 pt-6">
        <h1 className="text-[20px] font-black">Welcome, {lawyerName}</h1>
        <p className="text-white/60 text-sm">You have {assigned.length} Wasiyyah(s) assigned to you.</p>
        <div className="mt-5 space-y-3">
          {assigned.map((w) => (
            <div key={w.id} className="bg-white text-black rounded-[20px] p-4">
              <div className="flex justify-between"><h3 className="font-extrabold">{w.name}</h3><span className="text-[11px] bg-yellow-100 px-2 py-1 rounded-full font-bold">{w.status}</span></div>
              <p className="text-sm text-gray-600 mt-1">{w.city} • Net: {w.net} • {w.date}</p>
              <p className="text-[12px] text-gray-500">{w.type}</p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 bg-black text-white py-2.5 rounded-full font-bold text-sm">Review Wasiyyah</button>
                <button onClick={() => alert('Approved & Signed! Your name will appear on the Final PDF.')} className="flex-1 bg-green-600 text-white py-2.5 rounded-full font-bold text-sm">Approve & Sign</button>
              </div>
              <button onClick={() => window.open(`https://wa.me/2348012345678?text=${encodeURIComponent(`Hello, I am ${lawyerName} reviewing your Wasiyyah on HAQQ.`)}`, '_blank')} className="w-full mt-2 py-2 rounded-full border font-bold text-sm">Message Client On WhatsApp</button>
            </div>
          ))}
        </div>
        <div className="bg-white text-black rounded-[20px] p-4 mt-5">
          <h3 className="font-bold">What Lawyer Must Do:</h3>
          <ol className="text-[13px] text-gray-600 mt-2 space-y-1 list-decimal pl-4">
            <li>Read the Wasiyyah & Faraid calculation</li>
            <li>Check witnesses & video verification</li>
            <li>Ask client any question on WhatsApp</li>
            <li>Click Approve & Sign - Your name go enter PDF</li>
            <li>HAQQ go lock am for Vault - Nobody fit edit again except owner</li>
          </ol>
        </div>
      </div>
    </div>
  )
          }
