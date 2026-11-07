'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export default function Navbar(){
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-24px)] max-w-6xl hidden md:block">
      <div className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_8px_32px_rgba(10,25,49,0.15)] rounded-full px-4 h-[56px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0A1931] rounded-lg flex items-center justify-center text-white font-bold text-sm">H</div>
          <span className="font-bold text-lg text-[#0A1931]">HAQQ</span>
          <span className="text-[10px] bg-[#D4AF37] text-[#0A1931] px-2 py-0.5 rounded-full font-bold">VAULT</span>
        </Link>
        <div className="flex items-center gap-6 text-sm text-[#0A1931]">
          <Link href="/" className="hover:text-[#D4AF37] font-medium">Home</Link>
          <Link href="/vault" className="hover:text-[#D4AF37] font-medium">My Vault</Link>
          <Link href="/how-it-works" className="hover:text-[#D4AF37] font-medium">How it Works</Link>
          <Link href="/support" className="hover:text-[#D4AF37] font-medium">Support</Link>
          <Link href="/admin" className="hover:text-[#D4AF37] font-medium">Admin</Link>
          <div className="relative group"><button className="font-medium hover:text-[#D4AF37]">More ▾</button>
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-white shadow-xl rounded-xl border w-48 py-2 z-50">
              <Link href="/about" className="block px-4 py-2 hover:bg-gray-50">About</Link>
              <Link href="/privacy" className="block px-4 py-2 hover:bg-gray-50">Privacy</Link>
              <Link href="/contact" className="block px-4 py-2 hover:bg-gray-50">Contact</Link>
              <Link href="/donate" className="block px-4 py-2 hover:bg-gray-50">Donate</Link>
              <Link href="/sadaqah" className="block px-4 py-2 hover:bg-gray-50">Sadaqah</Link>
              <Link href="/welcome" className="block px-4 py-2 hover:bg-gray-50">Cover</Link>
            </div>
          </div>
          <Link href="/vault" className="bg-[#0A1931] text-white text-sm py-2 px-4 rounded-full font-bold hover:bg-[#1a2f52] transition">Open Vault</Link>
        </div>
      </div>
    </nav>
  )
}
