'use client'
import { useState, useMemo, useEffect } from 'react'
import BottomNav from '../../components/BottomNav'

// --- INPUT - FIXED: text-black so you go see wetin you dey type ---
const Input = ({ value, onChange, placeholder, type = "text" }: any) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full p-3 bg-white rounded-xl border border-gray-200 text-black placeholder:text-gray-400 placeholder:font-normal font-medium text-sm outline-none focus:border-black focus:ring-1 focus:ring-black"
  />
)

const Label = ({ children }: any) => (
  <div className="text-[11px] font-bold tracking-wider text-gray-500 uppercase mb-2 mt-5">{children}</div>
)

const Q = ({ title, children }: any) => (
  <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 text-black">
    <h2 className="text-[17px] font-extrabold text-black leading-tight">{title}</h2>
    {children}
  </div>
)

export default function WasiyyahPage() {
  const [step, setStep] = useState(1)

  // STEP 1 - ASSETS
  const [cashHome, setCashHome] = useState('')
  const [bank1Name, setBank1Name] = useState('')
  const [bank1Amt, setBank1Amt] = useState('')
  const [bank2Name, setBank2Name] = useState('')
  const [bank2Amt, setBank2Amt] = useState('')
  const [property, setProperty] = useState('')
  const [propertyAmt, setPropertyAmt] = useState('')
  const [car, setCar] = useState('')
  const [carAmt, setCarAmt] = useState('')
  const [business, setBusiness] = useState('')
  const [businessAmt, setBusinessAmt] = useState('')
  const [otherAsset, setOtherAsset] = useState('')
  const [otherAssetAmt, setOtherAssetAmt] = useState('')

  // STEP 2 - DEBTS
  const [debtLoan, setDebtLoan] = useState('')
  const [debtLoanAmt, setDebtLoanAmt] = useState('')
  const [debtPeople, setDebtPeople] = useState('')
  const [debtPeopleAmt, setDebtPeopleAmt] = useState('')
  const [kaffarahAmt, setKaffarahAmt] = useState('')
  const [funeralAmt, setFuneralAmt] = useState('500000')

  // STEP 3 - FAMILY
  const [hasSpouse, setHasSpouse] = useState('yes')
  const [spouseCount, setSpouseCount] = useState('1')
  const [sons, setSons] = useState('0')
  const [daughters, setDaughters] = useState('0')
  const [fatherAlive, setFatherAlive] = useState('no')
  const [motherAlive, setMotherAlive] = useState('no')
  const [brothers, setBrothers] = useState('0')
  const [sisters, setSisters] = useState('0')

  // STEP 4 - WASIYYAH (1/3)
  const [wasiyyahTo, setWasiyyahTo] = useState('')
  const [wasiyyahAmt, setWasiyyahAmt] = useState('')
  const [wasiyyahNote, setWasiyyahNote] = useState('')
  const [message, setMessage] = useState('')

  // Load from Vault if e dey
  useEffect(() => {
    try {
      const v = localStorage.getItem('haqq-vault')
      if (v) {
        const d = JSON.parse(v)
        if (d.totalDebt) setDebtLoanAmt(String(d.totalDebt))
      }
    } catch {}
  }, [])

  const num = (v: string) => parseFloat(v.replace(/[^0-9]/g, '')) || 0

  const totalAssets = useMemo(() => num(cashHome) + num(bank1Amt) + num(bank2Amt) + num(propertyAmt) + num(carAmt) + num(businessAmt) + num(otherAssetAmt), [cashHome, bank1Amt, bank2Amt, propertyAmt, carAmt, businessAmt, otherAssetAmt])
  const totalDebts = useMemo(() => num(debtLoanAmt) + num(debtPeopleAmt) + num(kaffarahAmt) + num(funeralAmt), [debtLoanAmt, debtPeopleAmt, kaffarahAmt, funeralAmt])
  const net = totalAssets - totalDebts
  const maxWasiyyah = Math.max(0, net / 3)
  const afterWasiyyah = net - num(wasiyyahAmt)
  const faraidPool = Math.max(0, afterWasiyyah)

  // Simple Faraid calc
  const faraid = useMemo(() => {
    let pool = faraidPool
    let out: any[] = []
    const sCount = parseInt(spouseCount) || 0
    const s = parseInt(sons) || 0
    const d = parseInt(daughters) || 0

    if (pool <= 0) return out

    // Spouse
    if (hasSpouse === 'yes' && sCount > 0) {
      const hasChildren = s + d > 0
      const spouseShare = hasChildren ? pool * 0.125 : pool * 0.25
      out.push({ name: `Wife${sCount > 1 ? 's' : ''} (${sCount})`, amt: spouseShare, pct: hasChildren ? '1/8' : '1/4' })
      pool -= spouseShare
    }
    // Mother
    if (motherAlive === 'yes') {
      const hasChildrenOrSiblings = s + d > 0 || (parseInt(brothers) + parseInt(sisters) > 1)
      const mShare = hasChildrenOrSiblings ? faraidPool * (1 / 6) : faraidPool * (1 / 3)
      out.push({ name: 'Mother', amt: mShare, pct: hasChildrenOrSiblings ? '1/6' : '1/3' })
      pool -= mShare
    }
    // Father
    if (fatherAlive === 'yes') {
      const fShare = s + d > 0 ? faraidPool * (1 / 6) : pool * 0.5
      out.push({ name: 'Father', amt: fShare, pct: s + d > 0 ? '1/6' : 'Remainder' })
      pool -= fShare
    }
    // Children - 2:1
    if (s + d > 0) {
      const units = s * 2 + d * 1
      const perUnit = pool / units
      if (s > 0) out.push({ name: `Son${s > 1 ? 's' : ''} (${s})`, amt: perUnit * 2 * s, pct: '2:1' })
      if (d > 0) out.push({ name: `Daughter${d > 1 ? 's' : ''} (${d})`, amt: perUnit * 1 * d, pct: '1 share' })
    } else if (pool > 0 && out.length > 0) {
      out.push({ name: 'Remaining to closest relatives', amt: pool, pct: 'Asaba' })
    }
    return out
  }, [faraidPool, hasSpouse, spouseCount, sons, daughters, fatherAlive, motherAlive, brothers, sisters])

  const fmt = (n: number) => '₦' + Math.round(n).toLocaleString()

  const save = () => {
    const data = { cashHome, bank1Amt, bank2Amt, propertyAmt, carAmt, businessAmt, totalAssets, totalDebts, net, wasiyyahAmt, wasiyyahTo, message, savedAt: new Date().toISOString() }
    localStorage.setItem('haqq-wasiyyah', JSON.stringify(data))
    alert('Wasiyyah saved!')
  }

  return (
    <div className="min-h-screen bg-[#0A1931] text-white pb-[140px]">
      {/* HEADER */}
      <div className="max-w-[520px] mx-auto px-4 pt-5">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-black tracking-tight text-white">HAQQ</h1>
          <a href="/vault" className="bg-white text-[#0A1931] px-4 py-1.5 rounded-full text-sm font-bold">Vault</a>
        </div>

        {/* SUMMARY CARD */}
        <div className="bg-white rounded-[20px] p-4 mt-4 text-black flex justify-between">
          <div>
            <p className="text-[11px] font-bold text-gray-500 uppercase">Faraid Pool</p>
            <p className="text-[20px] font-black text-black">{fmt(faraidPool)}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold text-gray-500 uppercase">Net Estate</p>
            <p className="text-[20px] font-black text-black">{fmt(net)}</p>
          </div>
        </div>

        {/* STEPS */}
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {['1. Assets', '2. Debts', '3. Family', '4. Faraid'].map((t, i) => (
            <button key={t} onClick={() => setStep(i + 1)} className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-bold ${step === i + 1 ? 'bg-black text-white' : 'bg-white text-black'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-[520px] mx-auto px-4 mt-4 space-y-4">
        {step === 1 && (
          <Q title="STEP 1 - Declare Your Whole Assets">
            <Label>💵 Cash & Bank</Label>
            <Input value={cashHome} onChange={(e: any) => setCashHome(e.target.value)} placeholder="Cash at home ₦" />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Input value={bank1Name} onChange={(e: any) => setBank1Name(e.target.value)} placeholder="Bank 1 Name" />
              <Input value={bank1Amt} onChange={(e: any) => setBank1Amt(e.target.value)} placeholder="Bank 1 ₦" />
              <Input value={bank2Name} onChange={(e: any) => setBank2Name(e.target.value)} placeholder="Bank 2 Name" />
              <Input value={bank2Amt} onChange={(e: any) => setBank2Amt(e.target.value)} placeholder="Bank 2 ₦" />
            </div>

            <Label>🏠 Property & Cars</Label>
            <Input value={property} onChange={(e: any) => setProperty(e.target.value)} placeholder="Property - e.g. House Ibadan" />
            <div className="mt-3"><Input value={propertyAmt} onChange={(e: any) => setPropertyAmt(e.target.value)} placeholder="Property Value ₦" /></div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Input value={car} onChange={(e: any) => setCar(e.target.value)} placeholder="Car - e.g. Camry" />
              <Input value={carAmt} onChange={(e: any) => setCarAmt(e.target.value)} placeholder="Car Value ₦" />
            </div>

            <Label>💼 Business & Other</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={business} onChange={(e: any) => setBusiness(e.target.value)} placeholder="Business Name" />
              <Input value={businessAmt} onChange={(e: any) => setBusinessAmt(e.target.value)} placeholder="Business Value ₦" />
              <Input value={otherAsset} onChange={(e: any) => setOtherAsset(e.target.value)} placeholder="Other Asset" />
              <Input value={otherAssetAmt} onChange={(e: any) => setOtherAssetAmt(e.target.value)} placeholder="Other Value ₦" />
            </div>

            <div className="mt-5 bg-gray-50 rounded-xl p-3 flex justify-between">
              <span className="font-bold text-sm text-black">Total Assets</span>
              <span className="font-black text-black">{fmt(totalAssets)}</span>
            </div>
            <button onClick={() => setStep(2)} className="w-full mt-4 bg-[#0A1931] text-white py-3.5 rounded-full font-bold">Next - Debts →</button>
          </Q>
        )}

        {step === 2 && (
          <Q title="STEP 2 - Debts & Rights">
            <Label>Debts</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={debtLoan} onChange={(e: any) => setDebtLoan(e.target.value)} placeholder="Loan From?" />
              <Input value={debtLoanAmt} onChange={(e: any) => setDebtLoanAmt(e.target.value)} placeholder="Loan Amount ₦" />
              <Input value={debtPeople} onChange={(e: any) => setDebtPeople(e.target.value)} placeholder="Owing Person" />
              <Input value={debtPeopleAmt} onChange={(e: any) => setDebtPeopleAmt(e.target.value)} placeholder="Amount ₦" />
            </div>
            <Label>Kaffarah / Funeral</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={kaffarahAmt} onChange={(e: any) => setKaffarahAmt(e.target.value)} placeholder="Kaffarah ₦" />
              <Input value={funeralAmt} onChange={(e: any) => setFuneralAmt(e.target.value)} placeholder="Funeral ₦" />
            </div>
            <div className="mt-5 space-y-2 text-black text-sm font-medium">
              <div className="flex justify-between"><span>Total Assets</span><span>{fmt(totalAssets)}</span></div>
              <div className="flex justify-between"><span>Total Debts</span><span className="text-red-600">-{fmt(totalDebts)}</span></div>
              <div className="flex justify-between border-t pt-2 font-black text-[16px]"><span>NET ESTATE</span><span>{fmt(net)}</span></div>
              <div className="flex justify-between bg-yellow-50 p-2 rounded-lg"><span>Max Wasiyyah (1/3)</span><span>{fmt(maxWasiyyah)}</span></div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-full border border-gray-200 font-bold text-black">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-[#0A1931] text-white py-3 rounded-full font-bold">Next - Family →</button>
            </div>
          </Q>
        )}

        {step === 3 && (
          <Q title="STEP 3 - Family (Faraid)">
            <Label>Spouse</Label>
            <div className="flex gap-2">
              <button onClick={() => setHasSpouse('yes')} className={`flex-1 py-2.5 rounded-xl border font-bold text-sm ${hasSpouse === 'yes' ? 'bg-black text-white' : 'bg-white text-black'}`}>Married</button>
              <button onClick={() => setHasSpouse('no')} className={`flex-1 py-2.5 rounded-xl border font-bold text-sm ${hasSpouse === 'no' ? 'bg-black text-white' : 'bg-white text-black'}`}>Not Married</button>
            </div>
            {hasSpouse === 'yes' && <div className="mt-3"><Input value={spouseCount} onChange={(e: any) => setSpouseCount(e.target.value)} placeholder="How many wives? 1" /></div>}

            <Label>Children</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={sons} onChange={(e: any) => setSons(e.target.value)} placeholder="Sons - 0" />
              <Input value={daughters} onChange={(e: any) => setDaughters(e.target.value)} placeholder="Daughters - 0" />
            </div>

            <Label>Parents Alive?</Label>
            <div className="grid grid-cols-2 gap-3">
              <select value={fatherAlive} onChange={(e) => setFatherAlive(e.target.value)} className="w-full p-3 bg-white rounded-xl border border-gray-200 text-black font-medium text-sm outline-none">
                <option value="no">Father - No</option><option value="yes">Father - Yes</option>
              </select>
              <select value={motherAlive} onChange={(e) => setMotherAlive(e.target.value)} className="w-full p-3 bg-white rounded-xl border border-gray-200 text-black font-medium text-sm outline-none">
                <option value="no">Mother - No</option><option value="yes">Mother - Yes</option>
              </select>
            </div>

            <Label>Siblings (if no children / parents)</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={brothers} onChange={(e: any) => setBrothers(e.target.value)} placeholder="Brothers" />
              <Input value={sisters} onChange={(e: any) => setSisters(e.target.value)} placeholder="Sisters" />
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-full border border-gray-200 font-bold text-black">Back</button>
              <button onClick={() => setStep(4)} className="flex-1 bg-[#0A1931] text-white py-3 rounded-full font-bold">Next - Faraid →</button>
            </div>
          </Q>
        )}

        {step === 4 && (
          <>
            <Q title="STEP 4 - Wasiyyah (Max 1/3)">
              <p className="text-[13px] text-gray-600 mt-1">You fit give up to <b className="text-black">{fmt(maxWasiyyah)}</b> to non-heirs / charity.</p>
              <div className="mt-3"><Input value={wasiyyahTo} onChange={(e: any) => setWasiyyahTo(e.target.value)} placeholder="Give to who? e.g. Mosque, Orphanage" /></div>
              <div className="mt-3"><Input value={wasiyyahAmt} onChange={(e: any) => setWasiyyahAmt(e.target.value)} placeholder="Wasiyyah Amount ₦" /></div>
              {num(wasiyyahAmt) > maxWasiyyah && <p className="text-red-600 text-[12px] font-bold mt-2">⚠️ E pass 1/3! Reduce am to {fmt(maxWasiyyah)} or less.</p>}
              <div className="mt-3">
                <textarea value={wasiyyahNote} onChange={(e) => setWasiyyahNote(e.target.value)} placeholder="Wasiyyah note..." className="w-full p-3 bg-white rounded-xl border border-gray-200 text-black placeholder:text-gray-400 text-sm outline-none min-h-[80px]" />
              </div>
            </Q>

            <Q title="Faraid Distribution - Live">
              <div className="mt-3 space-y-2">
                {faraid.length === 0 && <p className="text-gray-500 text-sm">Add family for Step 3 to see shares.</p>}
                {faraid.map((f: any, i: number) => (
                  <div key={i} className="flex justify-between bg-gray-50 p-3 rounded-xl text-black">
                    <div><p className="font-bold text-sm">{f.name}</p><p className="text-[11px] text-gray-500">{f.pct}</p></div>
                    <p className="font-black">{fmt(f.amt)}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t font-black text-black"><span>Faraid Pool</span><span>{fmt(faraidPool)}</span></div>
            </Q>

            <Q title="Final Message">
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write message to your family..." className="w-full mt-2 p-3 bg-white rounded-xl border border-gray-200 text-black placeholder:text-gray-400 text-sm outline-none min-h-[90px]" />
            </Q>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 py-3.5 rounded-full bg-white text-black font-bold">Back</button>
              <button onClick={save} className="flex-[2] py-3.5 rounded-full bg-black text-white font-bold">Save Wasiyyah ✅</button>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  )
                                                  }
