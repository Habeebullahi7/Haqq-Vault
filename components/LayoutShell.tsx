'use client'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Pages where we should NOT show any nav - clean full screen
  const hideNav = pathname === '/' || pathname === '/login'

  if (hideNav) {
    return <>{children}</>
  }

  // Inside Vault and other pages - show only the 2 floating navs
  return (
    <div className="min-h-screen pb-[110px]">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 pt-[84px] pb-6">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
