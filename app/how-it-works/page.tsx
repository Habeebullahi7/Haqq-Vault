export default function How(){
  return (
    <div className="min-h-screen bg-[#0a1628] text-white p-4 pb-28">
      <div className="bg-white text-black rounded-[24px] p-8 max-w-3xl mx-auto space-y-6 mt-4">
        <h1 className="text-2xl font-bold">How HAQQ Works</h1>
        <p className="text-sm text-gray-500">Quran 2:282 — &quot;Let a scribe write it between you in justice...&quot;</p>

        <div className="space-y-4 text-sm">
          <div className="flex gap-3">
            <span className="w-8 h-8 shrink-0 bg-[#0a1628] text-white rounded-full flex items-center justify-center font-bold">1</span>
            <p><b>Create an Account</b> — Sign up with your email and password. Only you can log in.</p>
          </div>

          <div className="flex gap-3">
            <span className="w-8 h-8 shrink-0 bg-[#0a1628] text-white rounded-full flex items-center justify-center font-bold">2</span>
            <p><b>Add a Haqq</b> — Who you owe, what you owe, and how much. Money, Ghibah, a broken promise, or any wrong.</p>
          </div>

          <div className="flex gap-3">
            <span className="w-8 h-8 shrink-0 bg-[#0a1628] text-white rounded-full flex items-center justify-center font-bold">3</span>
            <p><b>Private by Design</b> — Your Vault is tied to your account. Only you can see your Haqq after you log in.</p>
          </div>

          <div className="flex gap-3">
            <span className="w-8 h-8 shrink-0 bg-[#0a1628] text-white rounded-full flex items-center justify-center font-bold">4</span>
            <p><b>Clear It</b> — When you pay, apologise, or fix it, mark it as cleared. Your heart stays light.</p>
          </div>

          <div className="flex gap-3">
            <span className="w-8 h-8 shrink-0 bg-[#0a1628] text-white rounded-full flex items-center justify-center font-bold">5</span>
            <p><b>Wasiyyah</b> — Write your will so your family knows your debts and your wishes if anything happens to you.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a href="/vault" className="flex-1 text-center py-3.5 bg-[#0a1628] text-white rounded-xl font-bold no-underline">Open Vault</a>
          <a href="/wasiyyah" className="flex-1 text-center py-3.5 bg-[#D4AF37] text-black rounded-xl font-bold no-underline">Write Wasiyyah</a>
        </div>
      </div>
    </div>
  )
}
