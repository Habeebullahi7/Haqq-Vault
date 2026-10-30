import Link from 'next/link'
export default function Home(){
  return (
    <div className="space-y-12">
      <section className="bg-[#0A1931] dot-grid rounded-[32px] p-8 md:p-16 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"/>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight relative z-10">You Pray. You Fast.<br/>But Will Your Debts Be Forgiven?</h1>
        <p className="mt-6 text-white/70 max-w-2xl mx-auto relative z-10">Martyr forgiven except debt. HAQQ is your private encrypted vault to record every right before you meet Allah.</p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 relative z-10">
          <Link href="/vault" className="bg-white text-[#0A1931] rounded-xl px-8 py-4 font-semibold">Unlock My Vault - Free</Link>
          <Link href="/how-it-works" className="border border-white/20 rounded-xl px-8 py-4">How it Works</Link>
        </div>
      </section>
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card p-6"><h3 className="font-bold">Quran 4:48</h3><p className="text-sm text-gray-600 mt-2">Rights of people need their forgiveness.</p></div>
        <div className="card p-6"><h3 className="font-bold">Why Debts Matter</h3><p className="text-sm text-gray-600 mt-2">If you die without record, family won't know. Your Wasi will.</p></div>
        <div className="card p-6"><h3 className="font-bold">100% Private</h3><p className="text-sm text-gray-600 mt-2">Encrypted on your device. We cannot read it.</p></div>
      </section>
    </div>
  )
}
