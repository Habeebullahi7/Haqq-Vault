'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Bell, Search, X } from 'lucide-react'

export default function TopAppBar() {
  const [showSearch, setShowSearch] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  const [query, setQuery] = useState('')

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#0A1931] text-white lg:hidden">
        <div className="max-w-6xl mx-auto px-4 h-[56px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37] text-[#0A1931] flex items-center justify-center font-extrabold text-sm">H</div>
            <span className="font-bold tracking-[0.2em] text-sm">HAQQ</span>
          </Link>

          <div className="flex items-center gap-2">
            <button onClick={() => { setShowSearch(true); setShowNotif(false) }} aria-label="Search" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <Search size={18} />
            </button>
            <button onClick={() => { setShowNotif(!showNotif); setShowSearch(false) }} aria-label="Notifications" className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
              <Bell size={18} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#D4AF37] rounded-full" />
            </button>
            <Link href="/vault" className="ml-1 bg-[#D4AF37] text-[#0A1931] text-xs font-bold px-4 py-2 rounded-full">Open Vault</Link>
          </div>
        </div>

        {/* Notification dropdown */}
        {showNotif && (
          <div className="absolute top-[56px] left-0 right-0 bg-white text-black mx-4 rounded-2xl shadow-2xl p-4 z-50">
            <div className="flex justify-between items-center">
              <p className="font-bold text-sm">Notifications</p>
              <button onClick={() => setShowNotif(false)}><X size={16} /></button>
            </div>
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex gap-2"><span>🌙</span><div><p className="font-medium">Hadith of the Day is ready</p><p className="text-xs text-black/50">Today • Vault</p></div></div>
              <div className="flex gap-2"><span>🔐</span><div><p className="font-medium">Remember your Amanah - Quran 2:282</p><p className="text-xs text-black/50">Yesterday</p></div></div>
              <div className="flex gap-2"><span>🤲</span><div><p className="font-medium">Wasiyyah reminder: Write your Will</p><p className="text-xs text-black/50">2 days ago</p></div></div>
            </div>
            <Link href="/vault" onClick={() => setShowNotif(false)} className="block mt-4 bg-black text-white text-center py-3 rounded-xl text-sm font-bold">Open Vault</Link>
          </div>
        )}
      </header>

      {/* Search popup */}
      {showSearch && (
        <div className="fixed inset-0 z-[60] bg-black/60 p-4" onClick={() => setShowSearch(false)}>
          <div className="bg-white rounded-2xl p-4 mt-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <p className="font-bold">Search HAQQ</p>
              <button onClick={() => setShowSearch(false)}><X size={18} /></button>
            </div>
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search Vault, Wasiyyah, Muhasabah..." className="w-full mt-3 border rounded-xl p-3.5 outline-none text-black" />
            <div className="mt-3 space-y-2">
              {['Vault', 'Wasiyyah', 'Muhasabah', 'Kaffarah', 'Donate'].filter(x => x.toLowerCase().includes(query.toLowerCase())).map(x => (
                <Link key={x} href={x === 'Vault' ? '/vault' : x === 'Wasiyyah' ? '/wasiyyah' : x === 'Muhasabah' ? '/muhasabah' : x === 'Kaffarah' ? '/kaffarah' : '/donate'} onClick={() => setShowSearch(false)} className="block p-3 bg-gray-50 rounded-xl text-sm font-medium text-black">{x}</Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
      }
