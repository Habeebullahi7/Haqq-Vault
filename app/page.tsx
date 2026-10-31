"use client";
import { useState } from "react";

export default function WelcomePage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col overflow-hidden relative">
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      {/* NAVBAR - FIXED FOR MOBILE */}
      <nav className="relative z-20 flex justify-between items-center px-6 py-5 text-white">
        <h2 className="font-bold text-xl tracking-wider">HAQQ</h2>
        
        {/* Desktop menu */}
        <div className="hidden md:flex gap-6 text-sm text-gray-300">
          <a href="/" className="hover:text-white">Home</a>
          <a href="/vault" className="hover:text-white">My Vault</a>
          <a href="#how" className="hover:text-white">How it Works</a>
          <a href="#support" className="hover:text-white">Support</a>
        </div>

        <div className="flex items-center gap-3">
          <a href="/vault" className="hidden md:block bg-white text-[#0f172a] px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform">Open Vault</a>
          
          {/* Hamburger button - mobile only */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white mb-1.5"></div>
            <div className="w-6 h-0.5 bg-white"></div>
          </button>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="relative z-20 md:hidden bg-[#0f172a] border-t border-white/10 px-6 py-4 space-y-4 text-white animate-[fadeDown_0.3s_ease-out]">
          <a href="/" onClick={()=>setMenuOpen(false)} className="block py-2">Home</a>
          <a href="/vault" onClick={()=>setMenuOpen(false)} className="block py-2">My Vault</a>
          <a href="#how" onClick={()=>setMenuOpen(false)} className="block py-2">How it Works</a>
          <a href="#support" onClick={()=>setMenuOpen(false)} className="block py-2">Support</a>
          <a href="/vault" className="block mt-4 bg-white text-[#0f172a] text-center py-3 rounded-xl font-bold">Open Vault</a>
        </div>
      )}

      {/* Hero */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white animate-[fadeUp_0.8s_ease-out]">HAQQ <span className="inline-block animate-[bounce_2s_infinite]">🔒</span></h1>
        <p className="mt-5 text-gray-300 max-w-md leading-relaxed animate-[fadeUp_0.8s_ease-out_0.2s_both]">Your private Islamic debt vault. Record who you owe, who owes you, and never forget a Haqq. Secure, encrypted, for Allah's sake.</p>
        <div className="mt-9 flex flex-col sm:flex-row gap-3 animate-[fadeUp_0.8s_ease-out_0.4s_both]">
          <a href="/vault" className="px-8 py-3.5 bg-white text-[#0f172a] rounded-xl font-bold">Enter Vault</a>
          <a href="/account" className="px-8 py-3.5 bg-white/10 border border-white/20 text-white rounded-xl">Create Account</a>
        </div>
        <p className="mt-12 text-[11px] tracking-widest text-gray-500 uppercase">Built for Amanah • Quran 2:282</p>
      </div>

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes fadeDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
