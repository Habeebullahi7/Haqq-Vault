export default function Success(){
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="text-5xl">🤲</div>
      <h1 className="mt-4 text-3xl font-bold text-white">JazakAllahu Khairan!</h1>
      <p className="text-[#D4AF37] mt-2">Your Sadaqah Got Received. May Allah reward you.</p>
      <a href="/vault" className="mt-6 bg-[#D4AF37] text-[#0A1931] px-8 py-3 rounded-full font-bold">Back to Vault</a>
    </div>
  )
}
