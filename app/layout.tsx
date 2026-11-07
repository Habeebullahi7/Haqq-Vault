import './globals.css'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import TopAppBar from '@/components/TopAppBar'

export const metadata = { 
  title: 'HAQQ - Rights Clearing Vault', 
  description: 'Clear your rights before you meet your Lord', 
  manifest: '/manifest.webmanifest', 
  themeColor: '#0A1931' 
}

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <body className="bg-[#0A1931] text-[#E8EDF5] min-h-screen pb-[96px] md:pb-0 antialiased">
        <TopAppBar/>
        <Navbar/>
        <main className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </main>
        <BottomNav/>
      </body>
    </html>
  )
}
