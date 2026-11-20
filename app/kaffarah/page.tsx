"use client"
import { useState } from "react"

export default function KaffarahPage(){
  const [count, setCount] = useState(1)
  const [type, setType] = useState<"oath" | "fast" | "ghibah">("oath")
  const [name, setName] = useState("[Name]")
  const feedOne = 1500 // ₦1500 to feed one poor - you fit change am

  // Quran 5:89 - Oath: Feed 10 poor OR clothe them OR free slave, if no fit -> fast 3 days
  // Ramadan intentional break: Fast 60 days OR feed 60 poor
  const total = type === "oath" ? count * 10 * feedOne : type === "fast" ? count * 60 * feedOne : 0
  const safeCount = Math.max(1, count || 1)

  const letter = `Assalamu Alaikum ${name},

I am writing to seek your forgiveness for Allah's sake. I remember that I ${type === "ghibah" ? "backbit/gossiped about you" : "wronged you"} and I sincerely regret it.

Please forgive me, so Allah may forgive me on Qiyamah. If I owe you anything, tell me and I will pay.

Your brother/sister in Islam,
— From HAQQ Vault
Quran 2:282`

  return(
    <div className="min-h-screen bg-[#0a1628] text-white p-4 pb-28">
      <div className="max-w-[520px] mx-auto space-y-6 mt-4">
        <div className="bg-white text-black rounded-[24px] p-6">
          <h1 className="font-black text-xl">Kaffarah Calculator</h1>
          <p className="text-xs opacity-60 mt-1">Quran 5:89 - Expiation</p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button onClick={()=>setType("oath")} className={`p-3 rounded-xl border font-bold text-xs ${type==="oath"?"bg-black text-white":"bg-gray-50"}`}>Oath Broken</button>
            <button onClick={()=>setType("fast")} className={`p-3 rounded-xl border font-bold text-xs ${type==="fast"?"bg-black text-white":"bg-gray-50"}`}>Ramadan Fast</button>
            <button onClick={()=>setType("ghibah")} className={`p-3 rounded-xl border font-bold text-xs ${type==="ghibah"?"bg-black text-white":"bg-gray-50"}`}>Ghibah</button>
          </div>

          {type !== "ghibah" ? (
            <div className="mt-4">
              <label className="text-xs font-bold">{type === "oath" ? "How many oaths?" : "How many days missed?"}</label>
              <input type="number" min={1} value={count} onChange={e=>setCount(Math.max(1, Number(e.target.value) || 1))} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border font-bold"/>
              <div className="mt-4 p-4 bg-[#0a1628] text-white rounded-xl">
                <p className="text-xs opacity-60">YOU NEED TO PAY:</p>
                <p className="text-2xl font-black mt-1">₦{total.toLocaleString()}</p>
                <p className="text-xs mt-1 opacity-70">
                  {type==="oath" ? `Feed 10 poor x ${safeCount} oath(s) @ ₦${feedOne} = ₦${total.toLocaleString()} OR fast 3 days if you no fit pay` : `Feed 60 poor x ${safeCount} day(s) @ ₦${feedOne} OR fast 60 days`}
                </p>
                <a href="/donate" className="block mt-3 py-2.5 bg-[#D4AF37] text-black text-center rounded-xl font-bold no-underline">Pay as Sadaqah → Donate</a>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm font-bold">Ghibah no get money Kaffarah.</p>
              <p className="text-xs mt-1 text-gray-600">Kaffarah na: Seek forgiveness from the person + make dua for them + stop to talk about them. Use letter below.</p>
            </div>
          )}
        </div>

        <div className="bg-white/[0.06] border border-white/10 rounded-[24px] p-6">
          <h2 className="font-bold">📝 Forgiveness Letter Generator</h2>
          <p className="text-xs opacity-60 mt-1">For Ghibah, insult, broken trust</p>
          <label className="text-xs font-bold mt-3 block">Person name:</label>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="e.g. Musa" className="w-full mt-1 p-3 bg-white text-black rounded-xl text-sm font-bold" />
          <textarea value={letter} onChange={()=>{}} readOnly className="w-full mt-3 p-3 bg-white text-black rounded-xl text-sm min-h-[160px]"/>
          <p className="text-[11px] opacity-60 mt-1">Change name above, letter go update automatically.</p>
          <button onClick={()=>{navigator.clipboard.writeText(letter); alert("Copied!")}} className="w-full mt-3 py-3 bg-white text-black rounded-xl font-bold">Copy Letter</button>
          <a href={`https://wa.me/?text=${encodeURIComponent(letter)}`} target="_blank" className="block mt-2 py-3 bg-[#25D366] text-white text-center rounded-xl font-bold no-underline">Send via WhatsApp</a>
        </div>
      </div>
    </div>
  )
              }
