'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Lock, Heart, User } from 'lucide-react'
const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/vault', label: 'Vault', icon: Lock },
  { href: '/donate', label: 'Donate', icon: Heart },
  { href: '/account', label: 'Account', icon: User },
]
export default function BottomNav(){
  const path = usePathname()
  return (
    <div className="lg:hidden fixed bottom-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-[#0A1931]/95 backdrop-blur-xl border border-white/10 rounded-full flex gap-1 px-2 py-2 shadow-[0_8px_32px_rgba(10,25,49,0.3)]">
        {items.map(i=>{
          const active = path === i.href
          return (
            <Link key={i.href} href={i.href} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition ${active ? 'bg-white text-[#0A1931]' : 'text-white/60'}`}>
              <i.icon size={18}/> {active && i.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
