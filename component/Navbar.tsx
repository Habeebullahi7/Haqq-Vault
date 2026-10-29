'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
export default function Navbar(){
  const [open, setOpen] = useState(false)
  return (
    <nav className="sticky top-0 z-30 bg-white border-b border-gray-100 hidden md:block">
      <div className="max-w-6xl mx-auto px-4 h-[64px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0A1931] rounded-lg flex items-center justify-center text-white font-bold text-sm">H</div>
          <span className="font-bold text-lg text-[#0A1931]">HAQQ</span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/">Home</Link><Link href="/vault">My Vault</Link><Link href="/how-it-works">How it Works</Link>
          <Link href="/support">Support</Link><Link href="/admin">Admin</Link>
          <div className="relative group"><button>More ▾</button>
            <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-white shadow-xl rounded-xl border w-48 py-2">
              <Link href="/about" className="block px-4 py-2 hover:bg-gray-50">About</Link>
              <Link href="/privacy" className="block px-4 py-2 hover:bg-gray-50">Privacy</Link>
              <Link href="/contact" className="block px-4 py-2 hover:bg-gray-50">Contact</Link>
              <Link href="/donate" className="block px-4 py-2 hover:bg-gray-50">Donate</Link>
              <Link href="/sadaqah" className="block px-4 py-2 hover:bg-gray-50">Sadaqah</Link>
              <Link href="/welcome" className="block px-4 py-2 hover:bg-gray-50">Cover</Link>
            </div>
          </div>
          <Link href="/vault" className="btn-navy text-sm py-2 px-4">Open Vault</Link>
        </div>
      </div>
    </nav>
  )
}
