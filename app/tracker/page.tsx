"use client"
import { useEffect, useState } from "react"

export default function TrackerPage(){
  const [stats,setStats]=useState({students:12, families:5, imam:3, ghibahCleared:8})
  const duas = [
    "May Allah bless the one who paid my school fee - Amin - Anonymous Student",
    "Jazakallah for feeding my family last month - Umm Aisha",
    "Allah will pay you back in Jannah - Imam from Ibadan",
  ]

  return(
    <div className="min-h-screen bg-[#0a1628] text-white p-4 pb-28">
      <div className="max-w-[520px] mx-auto mt-6">
        <h1 className="text-2xl font-black">Barakah Tracker</h1>
        <p className="text-xs opacity-60">Your Sadaqah Jariyah Dashboard</p>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-white text-black p-5 rounded-2xl"><p className="text-[10px] opacity-50">STUDENTS HELPED</p><p className="text-2xl font-black mt-1">{stats.students}</p></div>
          <div className="bg-[#D4AF37] text-black p-5 rounded-2xl"><p className="text-[10px] opacity-70">FAMILIES FED</p><p className="text-2xl font-black mt-1">{stats.families}</p></div>
          <div className="bg-white/10 border border-white/10 p-5 rounded-2xl"><p className="text-[10px] opacity-50">IMAMS SUPPORTED</p><p className="text-2xl font-black mt-1">{stats.imam}</p></div>
          <div className="bg-white/10 border border-white/10 p-5 rounded-2xl"><p className="text-[10px] opacity-50">GHIBAH CLEARED</p><p className="text-2xl font-black mt-1">{stats.ghibahCleared}</p></div>
        </div>

        <div className="mt-8 bg-white text-black rounded-[24px] p-6">
          <h2 className="font-bold">🤲 Dua Wall — Anonymous</h2>
          <p className="text-xs opacity-60 mt-1">Duas from people you helped</p>
          <div className="mt-4 space-y-3">
            {duas.map((d,i)=>(
              <div key={i} className="p-3 bg-gray-50 rounded-xl border"><p className="text-sm">"{d}"</p></div>
            ))}
          </div>
          <p className="text-[11px] mt-4 text-center opacity-50">When you donate, beneficiary can leave anonymous dua for you</p>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 rounded-2xl">
          <p className="font-bold text-sm">🕌 Masjid Board (Verified)</p>
          <p className="text-xs mt-1 opacity-70">Imams verify students/families so your Sadaqah reaches real needy. Coming soon — Imam login.</p>
        </div>
      </div>
    </div>
  )
}
