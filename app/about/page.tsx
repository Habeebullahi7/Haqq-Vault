export default function About(){
  return (
    <div className="min-h-screen bg-[#0a1628] text-white p-4 pb-28">
      <div className="bg-white text-black rounded-[24px] p-8 max-w-3xl mx-auto space-y-4 mt-4">
        <p className="text-[11px] tracking-widest text-gray-400">QURAN 2:282 • BUILT FOR AMANAH</p>
        <h1 className="text-2xl font-bold">About HAQQ</h1>

        <p className="text-gray-600 leading-relaxed">
          HAQQ was built because Rasulullah ﷺ said: <i>&quot;The martyr is forgiven for all his sins except debt.&quot;</i> — Sahih Muslim
        </p>

        <p className="text-gray-600 leading-relaxed">
          Many Muslims pray and fast but forget the rights of people. Debt is not just money. It can be Ghibah you never apologised for, a promise you broke, or a right you delayed.
        </p>

        <p className="text-gray-600 leading-relaxed">
          We want to help you clear your slate before you meet Allah. Record it, check yourself nightly, and clear it — while you still can.
        </p>

        <div className="bg-[#0a1628] text-white rounded-2xl p-5">
          <p className="font-bold">Our Promise</p>
          <p className="text-sm text-white/70 mt-1">Your Vault is private. We will never read your Haqq. We only help you remember it.</p>
        </div>

        <p className="text-sm text-gray-400">Built with love in Lagos, Nigeria.</p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a href="/vault" className="flex-1 text-center py-3.5 bg-[#0a1628] text-white rounded-xl font-bold no-underline">Open Vault</a>
          <a href="/donate" className="flex-1 text-center py-3.5 bg-[#D4AF37] text-black rounded-xl font-bold no-underline">Support HAQQ</a>
        </div>
      </div>
    </div>
  )
}
