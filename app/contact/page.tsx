import Link from 'next/link'
export default function Contact(){
  return (
    <div className="max-w-2xl mx-auto card p-8 space-y-4">
      <h1 className="text-2xl font-bold">Contact HAQQ</h1>
      <p className="text-sm text-gray-600">We are building in public from Lagos, Nigeria.</p>
      <div className="space-y-2 text-sm"><p><b>Email:</b> support@haqq.app</p><p><b>WhatsApp:</b> +2347041935986</p><p><b>Hours:</b> 8am - 10pm WAT daily</p></div>
      <Link href="/support" className="inline-block mt-4 btn-navy">Go to Support Page</Link>
    </div>
  )
}
