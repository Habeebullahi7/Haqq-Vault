'use client'
import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import TopAppBar from '@/components/TopAppBar'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNav = pathname === '/'

  if (hideNav) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen pb-[110px] md:pb-0">
      <TopAppBar />
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
