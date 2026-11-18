import './globals.css'
import AppShell from '@/components/AppShell'

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
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  )
}
