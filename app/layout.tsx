import './globals.css'

export const metadata = { 
  title: 'HAQQ - Rights Clearing Vault', 
  description: 'Clear your rights before you meet your Lord', 
  manifest: '/manifest.webmanifest', 
  themeColor: '#0A1931' 
}

export default function RootLayout({ children }: { children: React.ReactNode }){
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0A1931', color: '#E8EDF5', fontFamily: 'Inter, system-ui, sans-serif' }}>
        {children}
        <style>{`
          ::-webkit-scrollbar { width: 8px; }
          ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 4px; }
          * { -webkit-tap-highlight-color: transparent; }
        `}</style>
      </body>
    </html>
  )
}
