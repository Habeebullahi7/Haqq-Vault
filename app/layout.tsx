import './globals.css'
import Navbar from '@/components/Navbar'
import BottomNav from '@/components/BottomNav'
import TopAppBar from '@/components/TopAppBar'
export const metadata = { title: 'HAQQ - Rights Clearing Vault', description: 'Clear your rights before you meet your Lord', manifest: '/manifest.json', themeColor: '#0A1931' }
export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en"><head><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/></head>
      <body className="bg-[#F5F7FB] min-h-screen pb-[96px] md:pb-0"><TopAppBar/><Navbar/><main className="max-w-6xl mx-auto px-4 py-6">{children}</main><BottomNav/></body></html>
  )
}
