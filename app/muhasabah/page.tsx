"use client"
import { useState, useEffect } from "react"

export default function MuhasabahPage(){
  const [streak,setStreak]=useState(0)
  const [todayDone,setTodayDone]=useState(false)
  const [checked,setChecked]=useState<boolean[]>([false,false,false,false,false])

  const questions = [
    "Did you owe anyone today and fail to pay?",
    "Did you backbite anyone today?",
    "Did you break any promise today?",
    "Did you take something without permission?",
    "Did you delay someone's salary or right?",
  ]

  useEffect(()=>{
    const s = Number(localStorage.getItem("haqq_streak")||0)
    setStreak(s)
    const last = localStorage.getItem("muhasabah_last")
    const today = new Date().toDateString()
    setTodayDone(last === today)

    // Reset checkboxes daily
    const savedDay = localStorage.getItem("muhasabah_day")
    if(savedDay !== today){
      localStorage.setItem("muhasabah_day", today)
      setChecked([false,false,false,false,false])
    } else {
      const saved = localStorage.getItem("muhasabah_checked")
      if(saved) setChecked(JSON.parse(saved))
    }
  },[])

  const toggle = (i:number) => {
    const next = [...checked]
    next[i] = !next[i]
    setChecked(next)
    localStorage.setItem("muhasabah_checked", JSON.stringify(next))
  }

  const complete = ()=>{
    const today = new Date()
    const todayStr = today.toDateString()
    const lastStr = localStorage.getItem("muhasabah_last")

    if(lastStr === todayStr) return // already done today

    let newStreak = 1
    if(lastStr){
      const last = new Date(lastStr)
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)
      // If last was yesterday -> continue streak, else reset to 1
      if(last.toDateString() === yesterday.toDateString()){
        newStreak = streak + 1
      }
    }

    localStorage.setItem("muhasabah_last", todayStr)
    localStorage.setItem("haqq_streak", newStreak.toString())
    setStreak(newStreak)
    setTodayDone(true)
  }

  const rememberedSomething = checked.some(Boolean)

  return(
    <div className="min-h-screen bg-[#0a1628] text-white p-4 pb-28">
      <div className="max-w-[520px] mx-auto">
        <div className="mt-6 bg-white text-black rounded-[24px] p-6">
          <p className="text-[11px] tracking-widest opacity-50">DAILY MUHASABAH • 9PM AUDIT</p>
          <h1 className="text-2xl font-black mt-2">Did you clear your heart today?</h1>
          <p className="text-sm mt-2 opacity-70">Umar (RA) said: &quot;Hold yourselves accountable before you are held accountable.&quot;</p>
          <div className="mt-4 flex gap-2 flex-wrap">
            <div className="bg-black text-white px-4 py-2 rounded-full font-bold">🔥 {streak} Day Streak</div>
            <div className="bg-yellow-100 px-4 py-2 rounded-full text-sm">{todayDone ? "✅ Done Today" : "⏳ Pending"}</div>
          </div>
          <p className="text-[11px] mt-3 text-black/50">Tick the box only if you did it. Honesty is the whole point.</p>
        </div>

        <div className="mt-6 bg-white/[0.06] border border-white/10 rounded-[24px] p-5">
          <h3 className="font-bold">5 Questions Before Sleep:</h3>
          <div className="mt-4 space-y-3">
            {questions.map((q,i)=>(
              <label key={i} className={`flex gap-3 p-3 rounded-xl cursor-pointer ${checked[i] ? 'bg-yellow-100 text-black border-2 border-[#D4AF37]' : 'bg-white text-black'}`}>
                <input type="checkbox" checked={checked[i]} onChange={()=>toggle(i)} className="mt-1 w-4 h-4 accent-black"/>
                <span className="flex-1">
                  <p className="text-sm font-medium">{q}</p>
                  {checked[i] && <p className="text-[11px] text-red-600 font-bold mt-1">Yes — I need to fix this → Add to Vault</p>}
                </span>
              </label>
            ))}
          </div>

          {rememberedSomething && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-sm font-bold text-red-200">You remembered {checked.filter(Boolean).length} thing(s). Don&apos;t sleep with it.</p>
              <p className="text-xs text-white/60 mt-1">Add it to your Vault now so you don&apos;t forget by morning.</p>
            </div>
          )}

          {!todayDone ? (
            <button onClick={complete} className="w-full mt-5 py-3.5 bg-[#D4AF37] text-black rounded-xl font-bold">
              {rememberedSomething ? "I Have Checked Myself → Add to Vault" : "I Have Checked Myself — I Am Clear Today"}
            </button>
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
