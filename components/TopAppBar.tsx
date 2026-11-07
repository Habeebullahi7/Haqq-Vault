'use client'
import Link from 'next/link'
import { Bell, Search } from 'lucide-react'

export default function TopAppBar() {
  return (
    <header className="sticky top-0 z-40 bg-[#0A1931] text-white lg:hidden">
      <div className="max-w-6xl mx-auto px-4 h-[56px] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-[#0A1931] flex items-center justify-center font-extrabold text-sm">
            H
          </div>
          <span className="font-bold tracking-[0.2em] text-sm">HAQQ</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
          >
            <Search size={18} />
          </button>
          <button
            aria-label="Notifications"
            className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#D4AF37] rounded-full" />
          </button>
          <Link
            href="/vault"
            className="ml-1 bg-[#D4AF37] text-[#0A1931] text-xs font-bold px-4 py-2 rounded-full"
          >
            Open Vault
          </Link>
        </div>
      </div>
    </header>
  )
}
