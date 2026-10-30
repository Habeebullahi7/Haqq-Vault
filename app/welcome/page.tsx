'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
export default function Welcome(){
  const [show, setShow] = useState(false)
  useEffect(()=>{ const seen = sessionStorage.getItem('haqq_seen'); if(!seen){ setTimeout(()=>{setShow(true); sessionStorage.setItem('haqq_seen','1')},100)} else setShow(true) },[])
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className={`bg-[#0A1931] dot-grid w-full max-w-md rounded-[32px] p-10 text-center text-white transition-all duration-700 ${show ? 'opacity-100' : 'opacity-0 translate-y-8'}`}>
        <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto text-[#0A1931] font-bold text-3xl shadow-[0_0_30px_rgba(212,175,55,0.5)]">H</div>
        <h1 className="mt-6 text-3xl font-bold tracking-wide">HAQQ</h1>
        <p className="mt-8 text-lg leading-relaxed">Clear your rights before you meet your Lord</p>
        <div className="mt-10 flex flex-col gap-3">
          <Link href="/" className="bg-white text-[#0A1931] rounded-xl py-3.5 font-semibold">Enter App</Link>
          <Link href="/vault" className="border border-white/20 rounded-xl py-3.5">My Vault</Link>
        </div>
        <div className="flex justify-center gap-2 mt-8"><span className="w-2 h-2 bg-[#D4AF37] rounded-full animate-pulse"/><span className="w-2 h-2 bg-[#D4AF37]/60 rounded-full animate-pulse delay-100"/><span className="w-2 h-2 bg-[#D4AF37]/30 rounded-full animate-pulse delay-200"/></div>
      </div>
    </div>
  )
}
