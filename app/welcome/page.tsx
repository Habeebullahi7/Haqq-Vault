'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
export default function Welcome(){
  const [ready, setReady] = useState(false)
  useEffect(()=>{ setTimeout(()=>setReady(true), 300) },[])
  return (
    <div className="min-h-[75vh] flex items-center justify-center">
      <div className={`bg-[#0A1931] dot-grid w-full max-w-[420px] rounded-[32px] p-10 text-center text-white transition-all duration-700 ${ready ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="w-20 h-20 bg-white rounded-[20px] flex items-center justify-center mx-auto font-bold text-3xl text-[#0A1931] shadow-[0_0_40px_rgba(212,175,55,0.5)]">H</div>
        <h1 className="mt-6 text-3xl font-bold tracking-[0.2em]">HAQQ</h1>
        <p className="mt-3 text-white/60 text-sm tracking-wide">The Rights Clearing Vault</p>
        <p className="mt-8 text-[18px] leading-relaxed font-light">Clear your rights before you meet your Lord</p>
        <div className="mt-10 flex flex-col gap-3">
          <Link href="/" className="bg-white text-[#0A1931] rounded-xl py-4 font-semibold">Enter App</Link>
          <Link href="/vault" className="border border-white/20 rounded-xl py-4 text-white/80">Open My Vault</Link>
        </div>
        <div className="flex justify-center gap-2 mt-8"><span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"/><span className="w-2 h-2 bg-[#D4AF37]/60 rounded-full animate-pulse delay-100"/><span className="w-2 h-2 bg-[#D4AF37]/30 rounded-full animate-pulse delay-200"/></div>
      </div>
    </div>
  )
}
