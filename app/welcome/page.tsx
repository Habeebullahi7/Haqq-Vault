"use client";
import { useState } from "react";
export default function WelcomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#0A1931] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#D4AF37]/15 rounded-full blur-[120px] animate-pulse"></div>
      </div>
      <nav className="relative z-20 flex justify-between items-center px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-[#0A1931] flex items-center justify-center font-extrabold">H</div><span className="font-bold tracking-[0.2em] text-sm">HAQQ</span></div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a href="#how">How it Works</a>
          <a href="/account" className="bg-[#D4AF37] text-[#0A1931] px-6 py-2.5 rounded-full font-bold">Open Vault</a>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden"><div className="space-y-1.5"><div className="w-6 h-0.5 bg-white"></div><div className="w-6 h-0.5 bg-white"></div><div className="w-6 h-0.5 bg-[#D4AF37]"></div></div></button>
      </nav>
      {menuOpen && (<div className="relative z-20 md:hidden bg-[#0A1931] border-y border-[#D4AF37]/10 px-6 py-6 space-y-4"><a href="#how" onClick={()=>setMenuOpen(false)} className="block py-2 text-gray-300">How it Works</a><a href="/account" className="block mt-4 bg-[#D4AF37] text-[#0A1931] text-center py-3.5 rounded-xl font-bold">Open Vault 🔒</a></div>)}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 text-[11px] tracking-widest text-[#D4AF37]"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> QURAN 2:282 • BUILT FOR AMANAH</div>
        <h1 className="mt-8 text-5xl md:text-7xl font-extrabold leading-[0.9]">Never Forget <br /> <span className="text-[#D4AF37]">A Haqq.</span> 🔒</h1>
        <p className="mt-6 text-[#E8EDF5]/70 max-w-xl mx-auto leading-relaxed">Your private Islamic debt vault. Record who you owe, who owes you, set reminders, and keep your trust with Allah.</p>
        <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
          <a href="/account" className="px-8 py-4 bg-[#D4AF37] text-[#0A1931] rounded-full font-bold">Enter Vault — It's Free</a>
          <a href="#how" className="px-8 py-4 bg-white/10 border border-white/10 rounded-full font-semibold">How it Works</a>
        </div>
      </section>
      <footer className="text-center py-8 text-xs text-[#E8EDF5]/50">Built for Amanah • Quran 2:282 • <a href="/account" className="text-[#D4AF37] font-bold underline">Open Vault</a></footer>
    </div>
  )
}
