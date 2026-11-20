"use client"
import { useState, useEffect } from "react"

// --- YOUR REAL DETAILS ---
const BANK_NAME = "WEMA BANK"
const ACCOUNT_NAME = "Liasu Habeeblah Olalekan"
const ACCOUNT_NUMBER = "0253559865"
const WHATSAPP_NUMBER = "2347041935986"

const purposes = [
  // STUDENTS
  { id:"monthly", label:"Help Student Monthly", emoji:"📚", desc:"Monthly upkeep - Sadaqah Jariyah", cat:"STUDENTS" },
  { id:"school", label:"Pay Student School Fee", emoji:"🎓", desc:"Clear school fees for a needy student", cat:"STUDENTS" },
  { id:"books", label:"Buy Books / Data for Student", emoji:"📖", desc:"Books, data, laptop for knowledge", cat:"STUDENTS" },
  { id:"project", label:"Final Year Project Support", emoji:"🎓", desc:"Project printing and defense", cat:"STUDENTS" },

  // FAMILIES
  { id:"feed", label:"Feed a Poor Family", emoji:"🍲", desc:"Monthly food pack", cat:"FAMILIES" },
  { id:"iftar", label:"Feed a Fasting Person (Iftar)", emoji:"🌙", desc:"Iftar / Suhoor - reward like their fast", cat:"FAMILIES" },
  { id:"cloth", label:"Buy Clothes / Shoes", emoji:"👕", desc:"Eid clothes, school uniform", cat:"FAMILIES" },
  { id:"rent", label:"Pay House Rent for a Family", emoji:"🏠", desc:"Prevent eviction, keep shelter", cat:"FAMILIES" },
  { id:"hospital", label:"Pay Hospital Bill", emoji:"🏥", desc:"For a sick person who cannot pay", cat:"FAMILIES" },

  // DEEN
  { id:"imam", label:"Support Imam & Ustadh", emoji:"🕌", desc:"Monthly support for teachers of Deen", cat:"DEEN" },
  { id:"mosque", label:"Build / Repair Mosque", emoji:"🕌", desc:"Mosque, borehole, toilet", cat:"DEEN" },
  { id:"mushaf", label:"Buy Mushaf / Quran for the Masjid", emoji:"📖", desc:"Every letter read = reward", cat:"DEEN" },
  { id:"orphan", label:"Support Orphan's Hifz", emoji:"👶", desc:"Orphan memorizing Quran", cat:"DEEN" },
  { id:"dawah", label:"Support HAQQ Project", emoji:"📢", desc:"Keep HAQQ vault free for the Ummah", cat:"DEEN" },

  // KAFFARAH / OLD WRONGS
  { id:"kaffarah", label:"Clear Past Wrong", emoji:"🤲", desc:"Charity for a wrong you did to someone you can't reach again", cat:"KAFFARAH" },
  { id:"kaffarah-oath", label:"Kaffarah for Broken Oath", emoji:"🤲", desc:"Feed 10 poor people - Quran 5:89", cat:"KAFFARAH" },
  { id:"ghibah", label:"Sadaqah for Ghibah I Did", emoji:"🗣️", desc:"Clean tongue sins", cat:"KAFFARAH" },
  { id:"deceased", label:"Pay Debt of Deceased", emoji:"⚰️", desc:"Soul suspended by debt", cat:"KAFFARAH" },

  { id:"general", label:"General Sadaqah", emoji:"❤️", desc:"Any good cause - small but consistent", cat:"GENERAL" },
]

const hadiths = [
  "The best of you are those who learn the Quran and teach it. — Bukhari",
  "Charity does not decrease wealth. — Muslim",
  "The believer's shade on the Day of Qiyamah will be his charity. — Ahmad",
  "Give charity without delay, for it stands in the way of calamity. — Tirmidhi",
  "The most beloved deeds to Allah are consistent ones, even if small. — Bukhari & Muslim",
]

export default function DonatePage(){
  const [copied,setCopied]=useState(false)
  const [selected,setSelected]=useState(purposes[0])
  const [hadith,setHadith]=useState("")
  const [showReceipt,setShowReceipt]=useState(false)
  const [filter,setFilter]=useState("ALL")

  useEffect(()=>{ 
    setHadith(hadiths[Math.floor(Math.random()*hadiths.length)])
  },[])

  const copyAcct=()=>{ navigator.clipboard.writeText(ACCOUNT_NUMBER); setCopied(true); setShowReceipt(true); setTimeout(()=>setCopied(false),2000)}
  
  const share=async()=>{
    const txt=`I just supported HAQQ - ${selected.label} — Sadaqah Jariyah. Join: https://haqq-gray.vercel.app/donate`
    if(navigator.share){ await navigator.share({title:"HAQQ", text:txt}) }
    else{ navigator.clipboard.writeText(txt); alert("Link copied!") }
  }

  const filtered = filter==="ALL" ? purposes : purposes.filter(p=>p.cat===filter)
  const cats = ["ALL","STUDENTS","FAMILIES","DEEN","KAFFARAH","GENERAL"]

  return(
    <div className="min-h-screen bg-[#0a1628] text-white p-4 pb-28 font-[Inter]">
      <div className="max-w-[520px] mx-auto">
        <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10">
          <h1 className="text-[28px] font-bold">Sadaqah Jariyah</h1>
          <p className="text-white/60 text-[13px] font-[Amiri]">Quran 2:282 — Preserving Amanah</p>
          <p className="text-[11px] mt-2 px-3 py-1.5 bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-full inline-block">🌙 {hadith}</p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-white text-black rounded-2xl p-4"><p className="text-[10px] text-black/50">TOTAL SADAQAH</p><p className="font-black text-xl">Verified Only</p><p className="text-[11px] text-black/50">Updated when donations are confirmed</p></div>
          <div className="bg-white text-black rounded-2xl p-4"><p className="text-[10px] text-black/50">SADAQAH OPTIONS</p><p className="font-black text-xl">{purposes.length} Ways</p></div>
        </div>

        <p className="font-bold mt-6 mb-3">Choose Your Niyyah — What do you want to sponsor?</p>
        
        <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
          {cats.map(c=>(
            <button key={c} onClick={()=>setFilter(c)} className={`text-[11px] px-3 py-1.5 rounded-full font-bold whitespace-nowrap border ${filter===c ? 'bg-white text-black border-white' : 'bg-white/10 text-white/60 border-white/10'}`}>{c}</button>
          ))}
        </div>

        <div className="grid gap-2">
          {filtered.map(p=>(
            <button key={p.id} onClick={()=>setSelected(p)} className={`text-left p-4 rounded-2xl border text-[14px] ${selected.id===p.id?'bg-white text-black border-white shadow-lg':'bg-white/[0.06] text-white border-white/10 hover:border-[#D4AF37]/30'}`}>
              <div className="flex justify-between items-start"><span className="font-bold">{p.emoji} {p.label}</span><span className="text-[9px] px-2 py-0.5 rounded-full bg-black/10 border">{p.cat}</span></div>
              <span className={`text-[12px] mt-1 block ${selected.id===p.id?'text-black/60':'text-white/50'}`}>{p.desc}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-[22px] p-6 text-black shadow-2xl">
          <p className="text-[10px] font-bold tracking-widest text-black/40">YOUR SELECTED PURPOSE</p><p className="font-bold text-[16px] mt-1">{selected.emoji} {selected.label}</p><p className="text-xs text-black/60 mt-1">{selected.desc}</p>
          <hr className="my-4"/>
          <p className="text-[10px] tracking-widest text-black/40">BANK NAME</p><p className="font-bold">{BANK_NAME}</p>
          <p className="text-[10px] tracking-widest text-black/40 mt-3">ACCOUNT NAME</p><p className="font-bold">{ACCOUNT_NAME}</p>
          <p className="text-[10px] tracking-widest text-black/40 mt-3">ACCOUNT NUMBER</p><p className="font-black text-[33px] tracking-wide">{ACCOUNT_NUMBER}</p>
          <button onClick={copyAcct} className="w-full mt-4 py-3.5 rounded-xl bg-black text-white font-bold">{copied?'Copied ✅ + Receipt Ready':'Copy Number'}</button>
          <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=Salam!%20I%20sent%20for%20${encodeURIComponent(selected.label)}%20HAQQ`} target="_blank" className="block mt-3 py-3 bg-[#25D366] text-white text-center rounded-xl font-bold no-underline">📱 Send Proof on WhatsApp</a>

          {showReceipt && (
            <div className="mt-4 p-4 bg-[#0a1628] text-white rounded-xl border border-white/10">
              <p className="text-xs text-white/50">OFFICIAL RECEIPT</p>
              <p className="font-bold mt-1">HAQQ Sadaqah Jariyah</p>
              <p className="text-sm mt-1">Purpose: {selected.label}</p>
              <p className="text-sm">Category: {selected.cat}</p>
              <p className="text-sm">Amount: Any — May Allah accept it</p>
              <p className="text-[11px] mt-2 text-white/60">Quran 2:282 — {BANK_NAME} {ACCOUNT_NUMBER} — Verified Amanah — {new Date().toLocaleDateString()}</p>
              <button onClick={()=>window.print()} className="mt-3 w-full py-2 bg-white text-black rounded-lg font-bold text-sm">🖨️ Print / Save Receipt</button>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={share} className="flex-1 py-3 bg-white/10 border border-white/10 rounded-xl font-bold text-sm">↗️ Share</button>
          <a href="/wasiyyah" className="flex-1 py-3 bg-white text-black rounded-xl font-bold text-center no-underline text-sm">📜 Add Wasiyyah</a>
          <a href="/vault" className="flex-1 py-3 bg-white/10 border border-white/10 rounded-xl font-bold text-center no-underline text-sm">🔐 Vault</a>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0a1628]/95 backdrop-blur border-t border-white/10 flex justify-around py-3">
        <a href="/" className="text-white/40 text-xs">🏠 Home</a>
        <a href="/vault" className="text-white/40 text-xs">🔒 Vault</a>
        <a href="/donate" className="bg-white text-black px-5 py-1.5 rounded-full text-xs font-bold">❤️ Donate</a>
        <a href="/wasiyyah" className="text-white/40 text-xs">📜 Wasiyyah</a>
      </div>
    </div>
  )
      }
