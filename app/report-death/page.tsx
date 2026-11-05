'use client'
import { useState } from 'react'

export default function ReportDeathPage() {
  const [fullName, setFullName] = useState('')
  const [executorName, setExecutorName] = useState('')
  const [executorPhone, setExecutorPhone] = useState('')
  const [deathDate, setDeathDate] = useState('')
  const [deathCert, setDeathCert] = useState<any>(null)
  const [executorId, setExecutorId] = useState<any>(null)
  const [submitted, setSubmitted] = useState(false)
  const [ref, setRef] = useState('')

  const submit = () => {
    if (!fullName || !executorName || !executorPhone || !deathCert) return alert('Please fill all fields and upload Death Certificate.')
    const r = `HAQQ-DEATH-${Date.now().toString().slice(-6)}`
    setRef(r); setSubmitted(true)
    localStorage.setItem('haqq-death-report', JSON.stringify({ fullName, executorName, executorPhone, deathDate, ref: r, status: 'pending_verification', date: new Date().toISOString() }))
    const text = `URGENT - DEATH REPORT ON HAQQ\n\nDeceased: ${fullName}\nExecutor: ${executorName} - ${executorPhone}\nDate of Death: ${deathDate}\nReference: ${r}\n\nDeath Certificate uploaded. Please verify urgently.`
    window.open(`https://wa.me/2348012345678?text=${encodeURIComponent(text)}`, '_blank')
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#0A1931] flex items-center justify-center px-4">
        <div className="bg-white rounded-[24px] p-6 text-black text-center max-w-[400px]">
          <h1 className="text-[22px] font-black">Inna Lillahi Wa Inna Ilayhi Raji&apos;un 🤲</h1>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">May Allah forgive {fullName} and grant them Jannah. We have received your report. HAQQ Admin and Lawyer will verify within 24-48 hours and contact you on {executorPhone}.</p>
          <p className="text-[12px] font-bold mt-3 bg-yellow-50 p-3 rounded-xl">Reference: {ref}<br/>Please keep this number safe.</p>
          <a href="/wasiyyah" className="block mt-4 bg-black text-white py-3 rounded-full font-bold text-sm">Back To HAQQ</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0A1931] text-white pb-20">
      <div className="max-w-[520px] mx-auto px-4 pt-6">
        <h1 className="text-[22px] font-black">Report Death - Release Wasiyyah</h1>
        <p className="text-white/60 text-sm mt-1">Only Executor, Witness or Family member should fill this. HAQQ will verify before releasing the Wasiyyah.</p>
        <div className="bg-white rounded-[24px] p-5 mt-4 text-black space-y-3">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name of Deceased (As on Wasiyyah)" className="w-full p-3 border rounded-xl outline-none text-sm" />
          <input value={executorName} onChange={(e) => setExecutorName(e.target.value)} placeholder="Your Full Name (Executor / Reporter)" className="w-full p-3 border rounded-xl outline-none text-sm" />
          <input value={executorPhone} onChange={(e) => setExecutorPhone(e.target.value)} placeholder="Your Phone / WhatsApp Number" className="w-full p-3 border rounded-xl outline-none text-sm" />
          <input type="date" value={deathDate} onChange={(e) => setDeathDate(e.target.value)} className="w-full p-3 border rounded-xl outline-none text-sm" />
          <div>
            <p className="text-[12px] font-bold mb-1">Upload Death Certificate *</p>
            <input type="file" accept="image/*,.pdf" onChange={(e) => setDeathCert(e.target.files?.[0])} className="w-full text-sm" />
            {deathCert && <p className="text-green-600 text-[12px] font-bold mt-1">✓ {deathCert.name} uploaded</p>}
          </div>
          <div>
            <p className="text-[12px] font-bold mb-1">Upload Your ID (To prove you are Executor)</p>
            <input type="file" accept="image/*,.pdf" onChange={(e) => setExecutorId(e.target.files?.[0])} className="w-full text-sm" />
            {executorId && <p className="text-green-600 text-[12px] font-bold mt-1">✓ {executorId.name} uploaded</p>}
          </div>
          <button onClick={submit} className="w-full bg-black text-white py-3.5 rounded-full font-bold">Submit Death Report For Verification</button>
          <p className="text-[11px] text-gray-500 text-center">HAQQ will NOT release Wasiyyah until verification is complete. This protects against fraud.</p>
        </div>
      </div>
    </div>
  )
            }
