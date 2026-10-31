"use client";
import { useState } from "react";

export default function WelcomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-x-hidden">
      {/* Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#D4AF37]/15 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[40%] -right-40 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      {/* NAV */}
      <nav className="relative z-20 flex justify-between items-center px-6 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-[#0f172a] flex items-center justify-center font-extrabold">H</div>
          <span className="font-bold tracking-[0.2em] text-sm">HAQQ</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-gray-300">
          <a href="#how" className="hover:text-white">How it Works</a>
          <a href="#support" className="hover:text-white">Support</a>
          <a href="/vault" className="hover:text-white">My Vault</a>
          <a href="/vault" className="bg-[#D4AF37] text-[#0f172a] px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform">Open Vault</a>
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          <div className="space-y-1.5"><div className="w-6 h-0.5 bg-white"></div><div className="w-6 h-0.5 bg-white"></div><div className="w-6 h-0.5 bg-[#D4AF37]"></div></div>
        </button>
      </nav>

      {menuOpen && (
        <div className="relative z-20 md:hidden bg-[#0f172a] border-y border-white/10 px-6 py-6 space-y-4 animate-[fadeDown_0.3s]">
          <a href="#how" onClick={()=>setMenuOpen(false)} className="block py-2 text-gray-300">How it Works</a>
          <a href="#support" onClick={()=>setMenuOpen(false)} className="block py-2 text-gray-300">Support</a>
          <a href="/vault" onClick={()=>setMenuOpen(false)} className="block mt-4 bg-[#D4AF37] text-[#0f172a] text-center py-3.5 rounded-xl font-bold">Open Vault 🔒</a>
        </div>
      )}

      {/* HERO */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-12 pb-20 md:pt-20 md:pb-28 text-center">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-[#D4AF37]/30 rounded-full px-4 py-1.5 text-[11px] tracking-widest text-[#D4AF37] animate-[fadeUp_0.6s]">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> QURAN 2:282 • BUILT FOR AMANAH
        </div>

        <h1 className="mt-8 text-5xl md:text-7xl font-extrabold leading-[0.9] tracking-tight animate-[fadeUp_0.7s_0.1s_both]">
          Never Forget <br /> <span className="text-[#D4AF37]">A Haqq.</span> <span className="inline-block animate-[float_3s_infinite]">🔒</span>
        </h1>

        <p className="mt-6 text-gray-300 max-w-xl mx-auto leading-relaxed text-[15px] md:text-[16px] animate-[fadeUp_0.7s_0.2s_both]">
          Your private Islamic debt vault. Record who you owe, who owes you, set reminders, and keep your trust with Allah. Secure, encrypted, for His sake.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3 animate-[fadeUp_0.7s_0.3s_both]">
          <a href="/vault" className="px-8 py-4 bg-[#D4AF37] text-[#0f172a] rounded-full font-bold text-[15px] shadow-lg shadow-[#D4AF37]/20 hover:scale-105 transition-transform">Enter Vault — It's Free</a>
          <a href="#how" className="px-8 py-4 bg-white/10 backdrop-blur border border-white/10 rounded-full font-semibold text-[15px] hover:bg-white/20 transition-colors">How it Works</a>
        </div>

        {/* Vault Preview Card - Floating */}
        <div className="mt-16 md:mt-20 mx-auto max-w-sm bg-white text-[#0f172a] rounded-[24px] p-4 shadow-2xl shadow-black/50 animate-[fadeUp_0.8s_0.5s_both] rotate-1 hover:rotate-0 transition-transform">
          <div className="flex justify-between items-center text-[11px] tracking-widest opacity-60"><span>VAULT PREVIEW</span><span className="text-green-600">● LIVE</span></div>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between bg-gray-50 p-3 rounded-xl"><span className="text-sm font-bold">Musa</span><span className="text-sm font-bold text-red-600">₦50,000 • I Owe</span></div>
            <div className="flex justify-between bg-[#D4AF37]/15 p-3 rounded-xl border border-[#D4AF37]/30"><span className="text-sm font-bold">Ahmed</span><span className="text-sm font-bold text-green-700">₦20,000 • Owes Me</span></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="relative z-10 bg-white text-[#0f172a] rounded-t-[32px] md:rounded-t-[48px] px-6 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center">Amanah, Made Simple</h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              { n: "01", t: "Record", d: "Add who you owe or who owes you in 10 seconds with witness & due date." },
              { n: "02", t: "Remind", d: "Get nudges before due date. Never miss a Haqq. Auto dua for ease." },
              { n: "03", t: "Clear", d: "Mark as paid, keep proof, export PDF for legacy & inheritance." },
            ].map((s, i) => (
              <div key={i} className="bg-[#f8f9fb] border border-gray-100 rounded-[20px] p-6">
                <div className="w-10 h-10 rounded-full bg-[#0f172a] text-[#D4AF37] flex items-center justify-center font-bold text-sm">{s.n}</div>
                <h3 className="mt-4 font-bold text-lg">{s.t}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="support" className="relative z-10 bg-white border-t border-gray-100 text-center py-8 text-xs text-gray-500">
        Built for Amanah • Quran 2:282 • <a href="/vault" className="text-[#0f172a] font-bold underline">Open Vault</a>
      </footer>

      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeDown{from{opacity:0;transform:translateY(-15px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
      `}</style>
    </div>
  )
      }
