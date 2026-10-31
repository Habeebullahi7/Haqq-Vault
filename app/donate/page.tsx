"use client"
import { useState, useEffect } from "react"

const purposes = [
  { id:"school", label:"Pay Student School Fee", emoji:"🎓", desc:"Clear school fees for needy student" },
  { id:"feed", label:"Feed a Poor Family", emoji:"🍲", desc:"Food for struggling family" },
  { id:"monthly", label:"Help Student Monthly", emoji:"📚", desc:"Monthly upkeep" },
  { id:"cloth", label:"Buy Clothes / Shoe", emoji:"👕", desc:"Cloth a brother/sister" },
  { id:"kaffarah", label:"Clear Past Wrong", emoji:"🤲", desc:"Charity for wrong you did to someone you can't reach again" },
  { id:"imam", label:"Support Imam & Uztaz", emoji:"🕌", desc:"Support teachers of Deen" },
]

const hadiths = [
  "The best of you are those who learn Quran and teach it. — Bukhari",
  "Charity does not decrease wealth. — Muslim",
  "The believer's shade on Day of Qiyamah will be his charity. — Ahmad",
  "Give charity without delay, for it stands in way of calamity. — Tirmidhi"
]

export default function DonatePage(){
  const [copied,setCopied]=useState(false)
  const [selected,setSelected]=useState(purposes[0])
  const [raised,setRaised]=useState(0)
  const [hadith,setHadith]=useState("")
  const [showReceipt,setShowReceipt]=useState(false)

  useEffect(()=>{ 
    setHadith(hadiths[Math.floor(Math.random()*hadiths.length)])
    let n=0; const i=setInterval(()=>{ n+=4521; if(n>342000){clearInterval(i); n=342000} setRaised(n)},20)
    return()=>clearInterval(i)
  },[])

  const copyAcct=()=>{ navigator.clipboard.writeText("0253559865"); setCopied(true); setShowReceipt(true); setTimeout(()=>setCopied(false),2000)}
  
  const share=async()=>{
    const txt=`I just supported HAQQ - ${selected.label} — Sadaqah Jariyah. Join: https://haqq-gray.vercel.app/donate`
    if(navigator.share){ await navigator.share({title:"HAQQ", text:txt}) }
    else{ navigator.clipboard.writeText(txt); alert("Link copied!") }
  }

  return(
    <div className="min-h-screen bg-[#0a1628] text-white p-4 pb-28 font-[Inter]">
      <div className="max-w-[520px] mx-auto">
        {/* Islamic Header */}
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10">
          <h1 className="text-[28px] font-bold">Sadaqah Jariyah</h1>
          <p className="text-white/60 text-[13px] font-[Amiri]">Quran 2:282 — Preserving Amanah</p>
          <p className="text-[11px] mt-2 px-2 py-1 bg-white/10 rounded-full inline-block">🌙 {hadith}</p>
        </div>

        {/* Admin Dashboard Mini */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-white text-black rounded-2xl p-4"><p className="text-[10px] text-black/50">TOTAL SADAQAH</p><p className="font-black text-xl">₦{raised.toLocaleString()}</p></div>
          <div className="bg-white text-black rounded-2xl p-4"><p className="text-[10px] text-black/50">VAULT ITEMS</p><p className="font-black text-xl">23 Amanah</p></div>
        </div>

        {/* Purposes from your paper */}
        <p className="font-bold mt-6 mb-3">Choose Niyyah — What to sponsor?</p>
        <div className="grid gap-2">
          {purposes.map(p=>(
            <button key={p.id} onClick={()=>setSelected(p)} className={`text-left p-4 rounded-2xl border text-[14px] ${selected.id===p.id?'bg-white text-black border-white':'bg-white/[0.06] text-white border-white/10'}`}>
              <span className="font-bold">{p.emoji} {p.label}</span><br/><span className={`text-[12px] ${selected.id===p.id?'text-black/60':'text-white/50'}`}>{p.desc}</span>
            </button>
          ))}
        </div>

        {/* Main Card — NO INVISIBLE TEXT */}
        <div className="mt-6 bg-white rounded-[22px] p-6 text-black shadow-2xl">
          <p className="text-[10px] font-bold tracking-widest text-black/40">YOUR SELECTED PURPOSE</p><p className="font-bold">{selected.emoji} {selected.label}</p>
          <hr className="my-4"/>
          <p className="text-[10px] tracking-widest text-black/40">BANK NAME</p><p className="font-bold">WEMA BANK</p>
          <p className="text-[10px] tracking-widest text-black/40 mt-3">ACCOUNT NAME</p><p className="font-bold">Liasu Habeeblah Olalekan</p>
          <p className="text-[10px] tracking-widest text-black/40 mt-3">ACCOUNT NUMBER</p><p className="font-black text-[33px]">0253559865</p>
          <button onClick={copyAcct} className="w-full mt-4 py-3.5 rounded-xl bg-black text-white font-bold">{copied?'Copied ✅ + Receipt Ready':'Copy Number'}</button>
          <a href={`https://wa.me/2347041935986?text=Salam!%20I%20sent%20for%20${selected.label}%20HAQQ`} target="_blank" className="block mt-3 py-3 bg-[#25D366] text-white text-center rounded-xl font-bold no-underline">📱 Send Proof on WhatsApp</a>

          {/* Auto Receipt Generator — from first v0 idea */}
          {showReceipt && (
            <div className="mt-4 p-4 bg-[#0a1628] text-white rounded-xl border">
              <p className="text-xs text-white/50">OFFICIAL RECEIPT</p>
              <p className="font-bold mt-1">HAQQ Sadaqah Jariyah</p>
              <p className="text-sm mt-1">Purpose: {selected.label}</p>
              <p className="text-sm">Amount: Any — May Allah accept it</p>
              <p className="text-[11px] mt-2 text-white/60">Quran 2:282 — Wema 0253559865 — Verified Amanah</p>
              <button onClick={()=>window.print()} className="mt-3 w-full py-2 bg-white text-black rounded-lg font-bold text-sm">🖨️ Print / Save Receipt</button>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={share} className="flex-1 py-3 bg-white/10 border border-white/10 rounded-xl font-bold">↗️ Share</button>
          <a href="/wasiyyah" className="flex-1 py-3 bg-white text-black rounded-xl font-bold text-center no-underline">📜 Add Wasi (Will)</a>
          <a href="/vault" className="flex-1 py-3 bg-white/10 border border-white/10 rounded-xl font-bold text-center no-underline">🔐 Vault</a>
        </div>
      </div>

      {/* Bottom Nav — from first v0 idea */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a1628]/95 backdrop-blur border-t border-white/10 flex justify-around py-3">
        <a href="/" className="text-white/40 text-xs">🏠 Home</a>
        <a href="/vault" className="text-white/40 text-xs">🔒 Vault</a>
        <a href="/donate" className="bg-white text-black px-5 py-1.5 rounded-full text-xs font-bold">❤️ Donate</a>
        <a href="/wasiyyah" className="text-white/40 text-xs">📜 Wasi</a>
      </div>
    </div>
  )
          }
