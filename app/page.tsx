export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#f6f7f9] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold">HAQQ 🔒</h1>
      <p className="mt-3 text-gray-600 max-w-md">Your private Islamic debt vault. Record who you owe, who owes you, and never forget a Haqq. Secure, encrypted, for Allah's sake.</p>
      <div className="mt-8 flex gap-3">
        <a href="/account" className="px-6 py-3 bg-black text-white rounded-xl">Enter Vault</a>
        <a href="/account" className="px-6 py-3 bg-white border rounded-xl">Create Account</a>
      </div>
      <p className="mt-10 text-xs text-gray-400">Built for Amanah • Quran 2:282</p>
    </div>
  )
}
