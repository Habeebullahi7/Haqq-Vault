"use client"
import { useState } from "react"

export default function DonatePage(){
  const [amount, setAmount] = useState(2000)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const handleDonate = async () => {
    if(!email){ alert("Add your email first"); return; }
    setLoading(true)
    try{
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, email, name: "HAQQ Supporter" })
      })
      const data = await res.json()
      console.log(data)
      const link = data?.data?.link || data?.data?.checkout_url
      if(link){
        window.location.href = link
      } else {
        alert("Error: " + JSON.stringify(data))
      }
    } catch(e){
      alert("Failed, check Vercel env FLW_V4_SECRET_KEY")
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md bg-[#112240] border border-[#D4AF37]/20 rounded-[28px] p-7 shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] text-xl">💛</div>
        <h1 className="mt-4 text-2xl font-extrabold text-white">Support <span className="text-[#D4AF37]">HAQQ</span></h1>
        <p className="mt-2 text-sm text-[#E8EDF5]/60">Your Sadaqah keeps this amanah tool free. Quran 2:282</p>

        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.com" className="w-full mt-6 bg-[#0A1931] border border-white/10 rounded-xl p-3.5 text-white text-sm focus:border-[#D4AF37]/50 outline-none"/>

        <div className="grid grid-cols-3 gap-2 mt-4">
          {[1000,2000,5000,10000,20000,50000].map(v=>(
            <button key={v} onClick={()=>setAmount(v)} className={`py-3 rounded-xl text-sm font-bold border transition ${amount===v ? 'bg-[#D4AF37] text-[#0A1931] border-[#D4AF37]' : 'bg-[#0A1931] text-white/80 border-white/10 hover:border-[#D4AF37]/30'}`}>₦{v.toLocaleString()}</button>
          ))}
        </div>

        <button onClick={handleDonate} disabled={loading} className="w-full mt-6 bg-[#D4AF37] text-[#0A1931] font-extrabold py-4 rounded-xl hover:scale-[1.02] transition disabled:opacity-50">
          {loading ? "Opening Flutterwave..." : `Donate ₦${amount.toLocaleString()}`}
        </button>
        
        <p className="text-center text-[11px] text-white/30 mt-4 tracking-widest">SECURED BY FLUTTERWAVE V4 • 100% AMANAH</p>
      </div>
    </div>
  )
}
