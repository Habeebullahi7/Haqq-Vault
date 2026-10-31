'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Lock, Heart, User, Moon, BarChart3, ScrollText } from 'lucide-react'

const items = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/muhasabah', label: 'Muhasabah', icon: Moon },
  { href: '/vault', label: 'Vault', icon: Lock },
  { href: '/donate', label: 'Donate', icon: Heart },
  { href: '/tracker', label: 'Barakah', icon: BarChart3 },
]

const moreItems = [
  { href: '/kaffarah', label: 'Kaffarah', icon: ScrollText },
  { href: '/account', label: 'Account', icon: User },
]

export default function BottomNav(){
  const path = usePathname()
  
  // Check active - for subpages like /kaffarah, /account
  const isActive = (href:string) => path === href || path.startsWith(href + '/')

  return (
    <div className="lg:hidden fixed bottom-4 left-0 right-0 z-50 flex flex-col items-center gap-2 pointer-events-none">
      
      {/* Small top pill for extra pages when you are inside them */}
      {(path.startsWith('/kaffarah') || path.startsWith('/account') || path.startsWith('/wasiyyah')) && (
        <div className="pointer-events-auto bg-[#0A1931]/90 backdrop-blur-xl border border-white/10 rounded-full flex gap-1 px-2 py-1.5">
          {moreItems.map(i=>{
            const active = isActive(i.href)
            return (
              <Link key={i.href} href={i.href} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition ${active ? 'bg-white text-[#0A1931]' : 'text-white/60'}`}>
                <i.icon size={14}/> {i.label}
              </Link>
            )
          })}
          <Link href="/wasiyyah" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition ${isActive('/wasiyyah') ? 'bg-white text-[#0A1931]' : 'text-white/60'}`}>
            📜 Wasi
          </Link>
        </div>
      )}

      {/* Main pill - your original style */}
      <div className="pointer-events-auto bg-[#0A1931]/95 backdrop-blur-xl border border-white/10 rounded-full flex gap-1 px-2 py-2 shadow-[0_8px_32px_rgba(10,25,49,0.3)]">
        {items.map(i=>{
          const active = isActive(i.href)
          return (
            <Link key={i.href} href={i.href} className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition ${active ? 'bg-white text-[#0A1931]' : 'text-white/60'}`}>
              <i.icon size={18}/> {active && i.label}
            </Link>
          )
        })}
      </div>
    </div>
  )
      }
