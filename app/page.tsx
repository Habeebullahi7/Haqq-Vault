export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col overflow-hidden relative">
      {/* Soft glow background animation */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] animate-pulse delay-1000"></div>
      </div>

      <nav className="relative z-10 flex justify-between items-center px-6 py-5 text-white animate-[fadeDown_0.6s_ease-out]">
        <h2 className="font-bold text-xl tracking-wider">HAQQ</h2>
        <a href="/vault" className="bg-white text-[#0f172a] px-5 py-2.5 rounded-full text-sm font-bold hover:scale-105 transition-transform">Open Vault</a>
      </nav>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Animated lock */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-white animate-[fadeUp_0.8s_ease-out]">
          HAQQ <span className="inline-block animate-[bounce_2s_infinite]">🔒</span>
        </h1>

        <p className="mt-5 text-gray-300 max-w-md leading-relaxed animate-[fadeUp_0.8s_ease-out_0.2s_both]">
          Your private Islamic debt vault. Record who you owe, who owes you, and never forget a Haqq. Secure, encrypted, for Allah's sake.
        </p>

        <div className="mt-9 flex gap-3 animate-[fadeUp_0.8s_ease-out_0.4s_both]">
          <a href="/vault" className="px-8 py-3.5 bg-white text-[#0f172a] rounded-xl font-bold shadow-lg shadow-white/10 hover:scale-105 hover:shadow-xl transition-all">Enter Vault</a>
          <a href="/account" className="px-8 py-3.5 bg-white/10 backdrop-blur border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all">Create Account</a>
        </div>

        <p className="mt-14 text-[11px] tracking-widest text-gray-500 uppercase animate-[fadeIn_1s_ease-out_0.8s_both]">Built for Amanah • Quran 2:282</p>
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0; transform:translateY(20px)} to{opacity:1; transform:translateY(0)} }
        @keyframes fadeDown { from{opacity:0; transform:translateY(-20px)} to{opacity:1; transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
      `}</style>
    </div>
  )
}
