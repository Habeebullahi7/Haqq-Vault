"use client"
import { useState, useEffect } from "react"

export default function MuhasabahPage(){
  const [streak,setStreak]=useState(0)
  const [todayDone,setTodayDone]=useState(false)
  const questions = [
    "Did you owe anyone today and not pay?",
    "Did you backbite anyone today?",
    "Did you break any promise today?",
    "Did you take something without permission?",
    "Did you delay someone's salary/right?",
  ]

  useEffect(()=>{
    const s = Number(localStorage.getItem("haqq_streak")||0)
    setStreak(s)
    const last = localStorage.getItem("muhasabah_last")
    setTodayDone(last === new Date().toDateString())
  },[])

  const complete = ()=>{
    const today = new Date().toDateString()
    localStorage.setItem("muhasabah_last", today)
    const newStreak = streak+1
    localStorage.setItem("haqq_streak", newStreak.toString())
    setStreak(newStreak)
    setTodayDone(true)
  }

  return(
    <div className="min-h-screen bg-[#0a1628] text-white p-4 pb-28">
      <div className="max-w-[520px] mx-auto">
        <div className="mt-6 bg-white text-black rounded-[24px] p-6">
          <p className="text-[11px] tracking-widest opacity-50">DAILY MUHASABAH • 9PM AUDIT</p>
          <h1 className="text-2xl font-black mt-2">Did you clear your heart today?</h1>
          <p className="text-sm mt-2 opacity-70">Umar (RA) said: "Account yourself before you are accounted"</p>
          <div className="mt-4 flex gap-2">
            <div className="bg-black text-white px-4 py-2 rounded-full font-bold">🔥 {streak} Day Streak</div>
            <div className="bg-yellow-100 px-4 py-2 rounded-full text-sm">{todayDone ? "✅ Done Today" : "⏳ Pending"}</div>
          </div>
        </div>

        <div className="mt-6 bg-white/[0.06] border border-white/10 rounded-[24px] p-5">
          <h3 className="font-bold">5 Questions Before Sleep:</h3>
          <div className="mt-4 space-y-3">
            {questions.map((q,i)=>(
              <div key={i} className="flex gap-3 bg-white text-black p-3 rounded-xl">
                <input type="checkbox" className="mt-1"/>
                <p className="text-sm">{q}</p>
              </div>
            ))}
          </div>
          {!todayDone ? (
            <button onClick={complete} className="w-full mt-5 py-3.5 bg-[#D4AF37] text-black rounded-xl font-bold">I Have Checked Myself → Go to Vault</button>
          ) : (
            <a href="/vault" className="block text-center w-full mt-5 py-3.5 bg-white text-black rounded-xl font-bold no-underline">Add to Vault if You Remembered Something</a>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a1628] border-t border-white/10 flex justify-around py-3 text-[11px]">
        <a href="/muhasabah" className="text-[#D4AF37]">🌙 Muhasabah</a><a href="/vault" className="text-white/40">🔒 Vault</a><a href="/donate" className="text-white/40">❤️ Donate</a><a href="/tracker" className="text-white/40">📊 Tracker</a>
      </div>
    </div>
  )
      }
