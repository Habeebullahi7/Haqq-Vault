'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
export default function TopAppBar(){
  const router = useRouter(); const path = usePathname()
  const showBack = path !== '/' && path !== '/welcome'
  return (
    <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 h-[56px] flex items-center px-4 justify-between lg:hidden">
      <div className="flex items-center gap-3">
        {showBack && <button onClick={()=>router.back()} className="p-2 rounded-full hover:bg-gray-100"><ArrowLeft size={20}/></button>}
        <Link href="/" className="font-bold text-[#0A1931] tracking-wide">HAQQ</Link>
      </div>
      <Link href="/vault" className="text-sm bg-[#0A1931] text-white px-4 py-1.5 rounded-full">Vault</Link>
    </div>
  )
}
