'use client'
import { useState, useMemo } from 'react'
import BottomNav from '../../components/BottomNav'

const Input = ({ value, onChange, placeholder }: any) => (
  <input value={value} onChange={onChange} placeholder={placeholder}
    className="w-full p-3 bg-white rounded-xl border border-gray-200 text-black placeholder:text-gray-400 font-medium text-sm outline-none focus:border-black" />
)
const Label = ({ children }: any) => (
  <div className="text-[11px] font-bold tracking-wider text-gray-500 uppercase mb-2 mt-5">{children}</div>
)
const Q = ({ title, children }: any) => (
  <div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 text-black">
    <h2 className="text-[17px] font-extrabold text-black leading-tight">{title}</h2>{children}
  </div>
)
const AddBtn = ({ onClick, label }: any) => (
  <button onClick={onClick} className="mt-3 w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-black font-bold text-[13px] bg-gray-50">+ Add Another {label}</button>
)

export default function WasiyyahPage() {
  const [step, setStep] = useState(1)

  // ===== STEP 1 - ASSETS =====
  const [cashHome, setCashHome] = useState('')
  const [banks, setBanks] = useState([{ name: '', amt: '' }])
  const [properties, setProperties] = useState([{ name: '', amt: '' }])
  const [cars, setCars] = useState([{ name: '', amt: '' }])
  const [businesses, setBusinesses] = useState([{ name: '', amt: '' }])
  const [others, setOthers] = useState([{ name: '', amt: '' }])

  const upd = (list: any, setList: any, i: number, key: string, v: string) => {
    const n = [...list]; n[i][key] = v; setList(n)
  }
  const add = (list: any, setList: any) => setList([...list, { name: '', amt: '' }])
  const rem = (list: any, setList: any, i: number) => { if (list.length > 1) setList(list.filter((_: any, idx: number) => idx !== i)) }

  const renderList = (list: any, setList: any, namePh: string, amtPh: string, label: string) => (
    <div>
      {list.map((it: any, i: number) => (
        <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 mt-2 items-center">
          <Input value={it.name} onChange={(e: any) => upd(list, setList, i, 'name', e.target.value)} placeholder={namePh} />
          <Input value={it.amt} onChange={(e: any) => upd(list, setList, i, 'amt', e.target.value)} placeholder={amtPh} />
          {list.length > 1 && <button onClick={() => rem(list, setList, i)} className="text-red-500 font-black px-1 text-lg">×</button>}
        </div>
      ))}
      <AddBtn onClick={() => add(list, setList)} label={label} />
    </div>
  )

  // ===== STEP 2 - DEBTS =====
  const [loans, setLoans] = useState([{ from: '', amt: '' }])
  const [owing, setOwing] = useState([{ person: '', amt: '' }])
  const [kaffarahAmt, setKaffarahAmt] = useState('')
  const [funeralAmt, setFuneralAmt] = useState('500000')

  // ===== STEP 3 - FULL SHARIA FAMILY =====
  const [deceasedGender, setDeceasedGender] = useState<'male' | 'female'>('male')
  const [isMarried, setIsMarried] = useState('yes')
  const [wivesCount, setWivesCount] = useState('1')
  const [husbandAlive, setHusbandAlive] = useState('yes')
  const [sons, setSons] = useState('0')
  const [daughters, setDaughters] = useState('0')
  const [fatherAlive, setFatherAlive] = useState('no')
  const [motherAlive, setMotherAlive] = useState('no')
  const [pGrandFather, setPGrandFather] = useState('no')
  const [pGrandMother, setPGrandMother] = useState('no')
  const [mGrandMother, setMGrandMother] = useState('no')
  const [fullBrothers, setFullBrothers] = useState('0')
  const [fullSisters, setFullSisters] = useState('0')
  const [paternalBrothers, setPaternalBrothers] = useState('0')
  const [paternalSisters, setPaternalSisters] = useState('0')
  const [maternalBrothers, setMaternalBrothers] = useState('0')
  const [maternalSisters, setMaternalSisters] = useState('0')
  const [paternalUncles, setPaternalUncles] = useState('0')

  // ===== STEP 4 =====
  const [wasiyyahTo, setWasiyyahTo] = useState('')
  const [wasiyyahAmt, setWasiyyahAmt] = useState('')
  const [message, setMessage] = useState('')

  const num = (v: string) => parseFloat(String(v || '').replace(/[^0-9]/g, '')) || 0
  const sumList = (l: any) => l.reduce((s: number, x: any) => s + num(x.amt), 0)

  // Wealth Calculator
  const totalAssets = num(cashHome) + sumList(banks) + sumList(properties) + sumList(cars) + sumList(businesses) + sumList(others)
  const totalDebts = sumList(loans) + sumList(owing.map((o: any) => ({ amt: o.amt }))) + num(kaffarahAmt) + num(funeralAmt)
  const net = totalAssets - totalDebts
  const maxWasiyyah = Math.max(0, net / 3)
  const faraidPool = Math.max(0, net - num(wasiyyahAmt))
  const fmt = (n: number) => '₦' + Math.round(n).toLocaleString()

  // ===== FULL FARAID CALCULATION =====
  const faraid = useMemo(() => {
    const out: any[] = []
    if (faraidPool <= 0) return out
    let pool = faraidPool
    const s = parseInt(sons) || 0, d = parseInt(daughters) || 0
    const hasChildren = s + d > 0
    const hasFather = fatherAlive === 'yes'
    const hasMother = motherAlive === 'yes'
    const hasGrandFather = pGrandFather === 'yes'
    const totalSiblings = (parseInt(fullBrothers) || 0) + (parseInt(fullSisters) || 0) + (parseInt(paternalBrothers) || 0) + (parseInt(paternalSisters) || 0) + (parseInt(maternalBrothers) || 0) + (parseInt(maternalSisters) || 0)

    const take = (name: string, amt: number, pct: string) => {
      if (amt <= 0) return
      const real = Math.min(amt, pool)
      out.push({ name, amt: real, pct })
      pool -= real
    }

    // 1. SPOUSE
    if (isMarried === 'yes') {
      if (deceasedGender === 'male') {
        const w = parseInt(wivesCount) || 1
        take(w > 1 ? `Wives (${w} share together)` : 'Wife', hasChildren ? faraidPool * 0.125 : faraidPool * 0.25, hasChildren ? '1/8' : '1/4')
      } else {
        if (husbandAlive === 'yes') take('Husband', hasChildren ? faraidPool * 0.25 : faraidPool * 0.5, hasChildren ? '1/4' : '1/2')
      }
    }

    // 2. MOTHER / GRANDMOTHERS
    if (hasMother) {
      let mShare = faraidPool / 3
      if (hasChildren || totalSiblings >= 2) mShare = faraidPool / 6
      if (isMarried === 'yes' && hasFather && !hasChildren && totalSiblings === 0) mShare = pool / 3
      take('Mother', mShare, hasChildren || totalSiblings >= 2 ? '1/6' : '1/3')
    } else {
      if (pGrandMother === 'yes' || mGrandMother === 'yes') take('Grandmother', faraidPool / 6, '1/6')
    }

    // 3. FATHER / GRANDFATHER
    if (hasFather) {
      if (hasChildren) take('Father', faraidPool / 6, '1/6')
    } else if (hasGrandFather && !hasFather) {
      if (hasChildren) take('Paternal Grandfather', faraidPool / 6, '1/6')
    }

    // 4. CHILDREN - 2:1 Ratio
    if (hasChildren) {
      const units = s * 2 + d
      const perUnit = pool / units
      if (s > 0) take(s > 1 ? `Sons (${s})` : 'Son', perUnit * 2 * s, '2 shares for each son')
      if (d > 0) {
        if (s === 0) take(d > 1 ? `Daughters (${d})` : 'Daughter', d === 1 ? faraidPool * 0.5 : faraidPool * (2 / 3), d === 1 ? '1/2' : '2/3')
        else take(d > 1 ? `Daughters (${d})` : 'Daughter', perUnit * d, '1 share for each daughter')
      }
      if (hasFather && pool > 0) take('Father (Residuary - Remainder)', pool, 'Remainder')
      if (!hasFather && hasGrandFather && pool > 0) take('Grandfather (Residuary)', pool, 'Remainder')
      return out
    }

    // 5. NO CHILDREN - SIBLINGS
    const fb = parseInt(fullBrothers) || 0, fs = parseInt(fullSisters) || 0
    const pb = parseInt(paternalBrothers) || 0, ps = parseInt(paternalSisters) || 0
    const mb = parseInt(maternalBrothers) || 0, ms = parseInt(maternalSisters) || 0

    if (mb + ms > 0 && !hasFather && !hasGrandFather) {
      const matTotal = mb + ms
      take(matTotal > 1 ? `Maternal Siblings (${matTotal})` : 'Maternal Sibling', matTotal === 1 ? faraidPool / 6 : faraidPool / 3, matTotal === 1 ? '1/6' : '1/3 shared')
    }

    if (fb === 0 && pb === 0 && (fs > 0 || ps > 0) && !hasFather && !hasGrandFather) {
      if (fs > 0) take(fs > 1 ? `Full Sisters (${fs})` : 'Full Sister', fs === 1 ? faraidPool * 0.5 : faraidPool * (2 / 3), fs === 1 ? '1/2' : '2/3')
      else if (ps > 0) take(ps > 1 ? `Paternal Sisters (${ps})` : 'Paternal Sister', ps === 1 ? faraidPool * 0.5 : faraidPool * (2 / 3), ps === 1 ? '1/2' : '2/3')
    } else if ((fb > 0 || pb > 0) && !hasFather && !hasGrandFather) {
      const units = (fb + pb) * 2 + (fs + ps)
      const perUnit = pool / units
      if (fb > 0) take(fb > 1 ? `Full Brothers (${fb})` : 'Full Brother', perUnit * 2 * fb, '2 shares')
      if (fs > 0) take(fs > 1 ? `Full Sisters (${fs})` : 'Full Sister', perUnit * fs, '1 share')
      if (pb > 0) take(pb > 1 ? `Paternal Brothers (${pb})` : 'Paternal Brother', perUnit * 2 * pb, '2 shares')
      if (ps > 0) take(ps > 1 ? `Paternal Sisters (${ps})` : 'Paternal Sister', perUnit * ps, '1 share')
    }

    // 6. FATHER / GRANDFATHER / UNCLE AS RESIDUARY
    if (hasFather && pool > 0) take('Father (Residuary - Remainder)', pool, 'Remainder')
    else if (hasGrandFather && pool > 0) take('Grandfather (Residuary)', pool, 'Remainder')
    else if (pool > 0 && (parseInt(paternalUncles) || 0) > 0) take((parseInt(paternalUncles) || 0) > 1 ? `Paternal Uncles (${paternalUncles})` : 'Paternal Uncle', pool, 'Residuary')
    else if (pool > 0 && out.length > 0) take('Remaining to Nearest Residuary Heir', pool, 'Residuary')

    return out
  }, [faraidPool, deceasedGender, isMarried, wivesCount, husbandAlive, sons, daughters, fatherAlive, motherAlive, pGrandFather, pGrandMother, mGrandMother, fullBrothers, fullSisters, paternalBrothers, paternalSisters, maternalBrothers, maternalSisters, paternalUncles])

  return (
    <div className="min-h-screen bg-[#0A1931] text-white pb-[140px]">
      <div className="max-w-[520px] mx-auto px-4 pt-5">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-black text-white">HAQQ</h1>
          <a href="/vault" className="bg-white text-[#0A1931] px-4 py-1.5 rounded-full text-sm font-bold">Vault</a>
        </div>

        {/* Wealth Calculator Summary */}
        <div className="bg-white rounded-[20px] p-4 mt-4 text-black">
          <div className="flex justify-between">
            <div><p className="text-[11px] font-bold text-gray-500 uppercase">Amount for Faraid</p><p className="text-[20px] font-black">{fmt(faraidPool)}</p></div>
            <div className="text-right"><p className="text-[11px] font-bold text-gray-500 uppercase">Net Estate</p><p className="text-[20px] font-black">{fmt(net)}</p></div>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100 text-[12px] font-medium text-gray-600">
            <span>Total Assets: {fmt(totalAssets)}</span>
            <span>Total Debts: {fmt(totalDebts)}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {['1. Assets', '2. Debts', '3. Family', '4. Faraid'].map((t, i) => (
            <button key={t} onClick={() => setStep(i + 1)} className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-bold ${step === i + 1 ? 'bg-black text-white' : 'bg-white text-black'}`}>{t}</button>
          ))}
        </div>
      </div>

      <div className="max-w-[520px] mx-auto px-4 mt-4 space-y-4">
        {step === 1 && (
          <Q title="Step 1 - Declare Your Assets">
            <Label>Cash at Home</Label>
            <Input value={cashHome} onChange={(e: any) => setCashHome(e.target.value)} placeholder="Cash at home ₦" />
            <Label>Banks - Add as many as you have</Label>
            {renderList(banks, setBanks, 'Bank Name - e.g. GTBank', 'Bank Amount ₦', 'Bank')}
            <Label>Properties - Add as many as you have</Label>
            {renderList(properties, setProperties, 'Property - e.g. House in Ibadan', 'Property Value ₦', 'Property')}
            <Label>Cars - Add as many as you have</Label>
            {renderList(cars, setCars, 'Car - e.g. Toyota Camry', 'Car Value ₦', 'Car')}
            <Label>Businesses</Label>
            {renderList(businesses, setBusinesses, 'Business Name', 'Business Value ₦', 'Business')}
            <Label>Other Assets</Label>
            {renderList(others, setOthers, 'Other Asset - e.g. Gold', 'Other Value ₦', 'Other Asset')}
            <div className="mt-5 bg-gray-50 rounded-xl p-3 flex justify-between"><span className="font-bold text-sm">Total Assets</span><span className="font-black">{fmt(totalAssets)}</span></div>
            <button onClick={() => setStep(2)} className="w-full mt-4 bg-[#0A1931] text-white py-3.5 rounded-full font-bold">Next - Debts</button>
          </Q>
        )}

        {step === 2 && (
          <Q title="Step 2 - Debts and Rights">
            <Label>Loans - Where did you take a loan from? Add all loans</Label>
            {loans.map((it: any, i: number) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 mt-2 items-center">
                <Input value={it.from} onChange={(e: any) => { const n = [...loans]; n[i].from = e.target.value; setLoans(n) }} placeholder="Loan From - e.g. GTBank, Friend" />
                <Input value={it.amt} onChange={(e: any) => { const n = [...loans]; n[i].amt = e.target.value; setLoans(n) }} placeholder="Loan Amount ₦" />
                {loans.length > 1 && <button onClick={() => setLoans(loans.filter((_: any, idx: number) => idx !== i))} className="text-red-500 font-black px-1">×</button>}
              </div>
            ))}
            <AddBtn onClick={() => setLoans([...loans, { from: '', amt: '' }])} label="Loan" />

            <Label>People You Owe - Add all people</Label>
            {owing.map((it: any, i: number) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 mt-2 items-center">
                <Input value={it.person} onChange={(e: any) => { const n = [...owing]; n[i].person = e.target.value; setOwing(n) }} placeholder="Person's Name - e.g. Musa" />
                <Input value={it.amt} onChange={(e: any) => { const n = [...owing]; n[i].amt = e.target.value; setOwing(n) }} placeholder="Amount Owed ₦" />
                {owing.length > 1 && <button onClick={() => setOwing(owing.filter((_: any, idx: number) => idx !== i))} className="text-red-500 font-black px-1">×</button>}
              </div>
            ))}
            <AddBtn onClick={() => setOwing([...owing, { person: '', amt: '' }])} label="Person You Owe" />

            <Label>Kaffarah / Funeral Expenses</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={kaffarahAmt} onChange={(e: any) => setKaffarahAmt(e.target.value)} placeholder="Kaffarah ₦" />
              <Input value={funeralAmt} onChange={(e: any) => setFuneralAmt(e.target.value)} placeholder="Funeral Expenses ₦" />
            </div>

            {/* Wealth Calculator Breakdown */}
            <div className="mt-5 space-y-2 text-sm font-medium bg-gray-50 p-3 rounded-xl">
              <div className="flex justify-between"><span>Total Assets</span><span>{fmt(totalAssets)}</span></div>
              <div className="flex justify-between"><span>Total Debts</span><span className="text-red-600">-{fmt(totalDebts)}</span></div>
              <div className="flex justify-between border-t pt-2 font-black text-[16px]"><span>Net Estate</span><span>{fmt(net)}</span></div>
              <div className="flex justify-between bg-yellow-50 p-2 rounded-lg"><span>Maximum Wasiyyah (One-Third)</span><span>{fmt(maxWasiyyah)}</span></div>
            </div>

            <div className="flex gap-3 mt-4">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-full border font-bold">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 bg-[#0A1931] text-white py-3 rounded-full font-bold">Next - Family</button>
            </div>
          </Q>
        )}

        {step === 3 && (
          <Q title="Step 3 - Family (Faraid)">
            <Label>Who is the Deceased? - Select Gender</Label>
            <div className="flex gap-2">
              <button onClick={() => setDeceasedGender('male')} className={`flex-1 py-3 rounded-xl border font-bold ${deceasedGender === 'male' ? 'bg-black text-white' : 'bg-white text-black'}`}>Male</button>
              <button onClick={() => setDeceasedGender('female')} className={`flex-1 py-3 rounded-xl border font-bold ${deceasedGender === 'female' ? 'bg-black text-white' : 'bg-white text-black'}`}>Female</button>
            </div>

            <Label>{deceasedGender === 'male' ? 'Spouse - Wife(s)' : 'Spouse - Husband'}</Label>
            <div className="flex gap-2">
              <button onClick={() => setIsMarried('yes')} className={`flex-1 py-2.5 rounded-xl border font-bold text-sm ${isMarried === 'yes' ? 'bg-black text-white' : 'bg-white text-black'}`}>Married</button>
              <button onClick={() => setIsMarried('no')} className={`flex-1 py-2.5 rounded-xl border font-bold text-sm ${isMarried === 'no' ? 'bg-black text-white' : 'bg-white text-black'}`}>Not Married</button>
            </div>
            {isMarried === 'yes' && deceasedGender === 'male' && <div className="mt-3"><Input value={wivesCount} onChange={(e: any) => setWivesCount(e.target.value)} placeholder="Number of wives? 1 to 4" /></div>}
            {isMarried === 'yes' && deceasedGender === 'female' && (
              <div className="mt-3 flex gap-2">
                <button onClick={() => setHusbandAlive('yes')} className={`flex-1 py-2.5 rounded-xl border font-bold text-sm ${husbandAlive === 'yes' ? 'bg-black text-white' : 'bg-white text-black'}`}>Husband is Alive</button>
                <button onClick={() => setHusbandAlive('no')} className={`flex-1 py-2.5 rounded-xl border font-bold text-sm ${husbandAlive === 'no' ? 'bg-black text-white' : 'bg-white text-black'}`}>Husband is Deceased</button>
              </div>
            )}

            <Label>Children</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={sons} onChange={(e: any) => setSons(e.target.value)} placeholder="Number of Sons - 0" />
              <Input value={daughters} onChange={(e: any) => setDaughters(e.target.value)} placeholder="Number of Daughters - 0" />
            </div>

            <Label>Parents - Select if Alive</Label>
            <div className="grid grid-cols-2 gap-3">
              <select value={fatherAlive} onChange={(e) => setFatherAlive(e.target.value)} className="w-full p-3 bg-white rounded-xl border text-black font-medium text-sm outline-none"><option value="no">Father - Not Alive</option><option value="yes">Father - Alive</option></select>
              <select value={motherAlive} onChange={(e) => setMotherAlive(e.target.value)} className="w-full p-3 bg-white rounded-xl border text-black font-medium text-sm outline-none"><option value="no">Mother - Not Alive</option><option value="yes">Mother - Alive</option></select>
            </div>

            <Label>Grandparents - If Parents Are Not Alive</Label>
            <div className="grid grid-cols-1 gap-2">
              <select value={pGrandFather} onChange={(e) => setPGrandFather(e.target.value)} className="w-full p-3 bg-white rounded-xl border text-black text-sm font-medium outline-none"><option value="no">Paternal Grandfather - Not Alive</option><option value="yes">Paternal Grandfather - Alive</option></select>
              <select value={pGrandMother} onChange={(e) => setPGrandMother(e.target.value)} className="w-full p-3 bg-white rounded-xl border text-black text-sm font-medium outline-none"><option value="no">Paternal Grandmother - Not Alive</option><option value="yes">Paternal Grandmother - Alive</option></select>
              <select value={mGrandMother} onChange={(e) => setMGrandMother(e.target.value)} className="w-full p-3 bg-white rounded-xl border text-black text-sm font-medium outline-none"><option value="no">Maternal Grandmother - Not Alive</option><option value="yes">Maternal Grandmother - Alive</option></select>
            </div>

            <Label>Full Siblings (Same Father and Mother)</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={fullBrothers} onChange={(e: any) => setFullBrothers(e.target.value)} placeholder="Full Brothers - 0" />
              <Input value={fullSisters} onChange={(e: any) => setFullSisters(e.target.value)} placeholder="Full Sisters - 0" />
            </div>

            <Label>Paternal Siblings (Same Father Only)</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={paternalBrothers} onChange={(e: any) => setPaternalBrothers(e.target.value)} placeholder="Paternal Brothers - 0" />
              <Input value={paternalSisters} onChange={(e: any) => setPaternalSisters(e.target.value)} placeholder="Paternal Sisters - 0" />
            </div>

            <Label>Maternal Siblings (Same Mother Only)</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={maternalBrothers} onChange={(e: any) => setMaternalBrothers(e.target.value)} placeholder="Maternal Brothers - 0" />
              <Input value={maternalSisters} onChange={(e: any) => setMaternalSisters(e.target.value)} placeholder="Maternal Sisters - 0" />
            </div>

            <Label>Paternal Uncles (Father's Brothers)</Label>
            <Input value={paternalUncles} onChange={(e: any) => setPaternalUncles(e.target.value)} placeholder="Number of Paternal Uncles - 0" />

            <div className="flex gap-3 mt-5">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-full border font-bold">Back</button>
              <button onClick={() => setStep(4)} className="flex-1 bg-[#0A1931] text-white py-3 rounded-full font-bold">Next - Faraid</button>
            </div>
          </Q>
        )}

        {step === 4 && (
          <>
            <Q title="Step 4 - Wasiyyah (Maximum One-Third)">
              <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">
                {net <= 0
                  ? "Please enter your assets and debts in Steps 1 and 2 to calculate how much you can allocate as Wasiyyah."
                  : `Based on your Net Estate of ${fmt(net)}, you may allocate up to ${fmt(maxWasiyyah)} (one-third) as Wasiyyah to non-heirs or charity. The remaining ${fmt(faraidPool)} will be distributed according to Faraid.`}
              </p>
              <div className="mt-3"><Input value={wasiyyahTo} onChange={(e: any) => setWasiyyahTo(e.target.value)} placeholder="Beneficiary - e.g. Mosque, Orphanage, Charity" /></div>
              <div className="mt-3"><Input value={wasiyyahAmt} onChange={(e: any) => setWasiyyahAmt(e.target.value)} placeholder="Wasiyyah Amount ₦" /></div>
              {num(wasiyyahAmt) > maxWasiyyah && <p className="text-red-600 text-[12px] font-bold mt-2">This amount exceeds one-third of your Net Estate. Please reduce it to {fmt(maxWasiyyah)} or less.</p>}

              <div className="mt-4 bg-gray-50 rounded-xl p-3 space-y-2 text-sm text-black">
                <div className="flex justify-between"><span>Total Assets</span><span className="font-bold">{fmt(totalAssets)}</span></div>
                <div className="flex justify-between"><span>Total Debts</span><span className="font-bold text-red-600">-{fmt(totalDebts)}</span></div>
                <div className="flex justify-between border-t pt-2"><span>Net Estate</span><span className="font-black">{fmt(net)}</span></div>
                <div className="flex justify-between"><span>Maximum Wasiyyah (One-Third)</span><span className="font-black">{fmt(maxWasiyyah)}</span></div>
                <div className="flex justify-between"><span>Amount Available for Faraid</span><span className="font-black">{fmt(faraidPool)}</span></div>
              </div>
            </Q>

            <Q title={`Faraid Distribution - ${deceasedGender === 'male' ? 'Deceased: Male' : 'Deceased: Female'}`}>
              <div className="mt-3 space-y-2">
                {faraid.length === 0 && <p className="text-gray-500 text-sm">Please add family members in Step 3 to view their shares.</p>}
                {faraid.map((f: any, i: number) => (
                  <div key={i} className="flex justify-between bg-gray-50 p-3 rounded-xl"><div><p className="font-bold text-sm">{f.name}</p><p className="text-[11px] text-gray-500">{f.pct}</p></div><p className="font-black">{fmt(f.amt)}</p></div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t font-black"><span>Total for Faraid</span><span>{fmt(faraidPool)}</span></div>
              <p className="text-[11px] text-gray-500 mt-2">Based on Qur&apos;an 4:11-12. For complex cases, please confirm with an Imam.</p>
            </Q>

            <Q title="Final Message">
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Write a message to your family..." className="w-full mt-2 p-3 bg-white rounded-xl border text-black placeholder:text-gray-400 text-sm outline-none min-h-[90px]" />
            </Q>

            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 py-3.5 rounded-full bg-white text-black font-bold">Back</button>
              <button onClick={() => { localStorage.setItem('haqq-wasiyyah', JSON.stringify({ totalAssets, totalDebts, net, wasiyyahAmt, message })); alert('Wasiyyah saved successfully!') }} className="flex-[2] py-3.5 rounded-full bg-black text-white font-bold">Save Wasiyyah</button>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
                                     }
