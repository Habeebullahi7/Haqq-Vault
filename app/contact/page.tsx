import Link from 'next/link'

export default function Contact(){
  return (
    <div className="min-h-screen bg-[#0a1628] text-white p-4 pb-28">
      <div className="max-w-2xl mx-auto bg-white text-black rounded-[24px] p-8 space-y-4 mt-4">
        <h1 className="text-2xl font-bold">Contact HAQQ</h1>
        <p className="text-sm text-gray-600">We are building in public from Lagos, Nigeria.</p>

        <div className="space-y-3 text-sm">
          <a href="mailto:Haqqsupport@gmail.com" className="flex justify-between items-center p-4 bg-gray-50 rounded-xl no-underline text-black">
            <span><b>Email:</b> Haqqsupport@gmail.com</span>
            <span>✉️</span>
          </a>

          <a href="https://wa.me/2347041935986?text=Salam!%20I%20need%20help%20with%20HAQQ" target="_blank" className="flex justify-between items-center p-4 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl no-underline text-black">
            <span><b>WhatsApp:</b> +234 704 193 5986</span>
            <span>📱</span>
          </a>

          <div className="p-4 bg-gray-50 rounded-xl">
            <p><b>Hours:</b> 8am - 10pm WAT daily</p>
            <p className="text-xs text-gray-500 mt-1">We reply on WhatsApp faster than email.</p>
          </div>
        </div>

        <a href="https://wa.me/2347041935986?text=Salam!%20I%20need%20help%20with%20HAQQ" target="_blank" className="block text-center mt-4 py-3.5 bg-[#0a1628] text-white rounded-xl font-bold no-underline">
          Chat on WhatsApp
        </a>
        <Link href="/" className="block text-center py-3 text-sm font-bold text-gray-500 no-underline">← Back to Home</Link>
      </div>
    </div>
  )
}
