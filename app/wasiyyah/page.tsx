// app/wasiyyah/page.tsx - PART 1 of 3
'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

const IMAM_WHATSAPP = '2348161866717'
const HAQQ_LAWYERS = [
  { id: 'lawyer-yusuf', name: 'Barr. Yusuf Emiola', specialty: 'Sharia Court Lawyer', city: 'Lagos', phone: '2348171997051', code: 'Yusuf01' },
  { id: 'lawyer-akanbi', name: 'Barr. Akanbi', specialty: 'Islamic Estate Lawyer', city: 'Ibadan', phone: '2348163528607', code: 'Akanbi02' },
  { id: 'lawyer-habeeb', name: 'Barr. Habeeb', specialty: 'Sharia Court Lawyer', city: 'Kano', phone: '2348169894541', code: 'Habeeb03' },
]

const WORD_NUMBERS: any = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90, hundred: 100, thousand: 1000, million: 1000000, billion: 1000000000 }
function parseWordNumber(text: string): number {
  const words = text.toLowerCase().replace(/-/g, ' ').split(/\s+/)
  let total = 0, current = 0
  for (const w of words) {
    if (WORD_NUMBERS[w] === undefined) continue
    if (w === 'hundred') current = (current || 1) * 100
    else if (w === 'thousand') { total += (current || 1) * 1000; current = 0 }
    else if (w === 'million') { total += (current || 1) * 1000000; current = 0 }
    else if (w === 'billion') { total += (current || 1) * 1000000000; current = 0 }
    else current += WORD_NUMBERS[w]
  }
  return total + current
}
function parseSmartAmount(v: string): number {
  if (!v) return 0
  let s = String(v).toLowerCase().trim()
  s = s.replace(/₦|naira|ngn|\s*nairas?/g, '').trim()
  if (!s) return 0
  if (/[a-z]/.test(s)) {
    const shortMatch = s.match(/^([\d,.]+)\s*([kmb])\b/)
    if (shortMatch) { const n = parseFloat(shortMatch[1].replace(/,/g, '')); const mult = shortMatch[2] === 'k' ? 1000 : shortMatch[2] === 'm' ? 1000000 : 1000000000; return Math.round(n * mult) }
    const longMatch = s.match(/([\d,.]+)\s*(thousand|million|billion)/)
    if (longMatch) { const n = parseFloat(longMatch[1].replace(/,/g, '')); const mult = longMatch[2] === 'thousand' ? 1000 : longMatch[2] === 'million' ? 1000000 : 1000000000; return Math.round(n * mult) }
    if (/million|billion|thousand|hundred/.test(s)) {
      let result = 0
      if (s.includes('billion')) { result += parseWordNumber(s.split('billion')[0]) * 1000000000; const after = s.split('billion')[1] || ''; if (after.includes('million')) { result += parseWordNumber(after.split('million')[0]) * 1000000; const rest = after.split('million')[1] || ''; if (rest.includes('thousand')) result += parseWordNumber(rest.split('thousand')[0]) * 1000; else result += parseWordNumber(rest) } else if (after.includes('thousand')) result += parseWordNumber(after.split('thousand')[0]) * 1000; else result += parseWordNumber(after); return result }
      if (s.includes('million')) { result += parseWordNumber(s.split('million')[0]) * 1000000; const after = s.split('million')[1] || ''; if (after.includes('thousand')) { result += parseWordNumber(after.split('thousand')[0]) * 1000; result += parseWordNumber(after.split('thousand')[1] || '') } else result += parseWordNumber(after); return result }
      if (s.includes('thousand')) { result += parseWordNumber(s.split('thousand')[0]) * 1000; result += parseWordNumber(s.split('thousand')[1] || ''); return result }
      return parseWordNumber(s)
    }
    if (/^[a-z\s-]+$/.test(s)) return parseWordNumber(s)
  }
  return parseFloat(s.replace(/[^0-9.]/g, '')) || 0
}
const formatMoney = (n: number) => '₦' + Math.round(n).toLocaleString()
const Input = ({ value, onChange, placeholder }: any) => {
  const handleBlur = (e: any) => {
    const parsed = parseSmartAmount(e.target.value)
    if (parsed > 0 && (String(placeholder || '').includes('e.g.') || String(placeholder || '').includes('₦'))) {
      onChange({ target: { value: parsed.toLocaleString() } })
    }
  }
  return (<input value={value} onChange={onChange} onBlur={handleBlur} placeholder={placeholder} className="w-full p-3 bg-white rounded-xl border border-gray-200 text-black placeholder:text-gray-400 font-medium text-sm outline-none focus:border-black" />)
}
const Label = ({ children }: any) => (<div className="text-[11px] font-bold tracking-wider text-gray-500 uppercase mb-2 mt-5">{children}</div>)
const Q = ({ title, children }: any) => (<div className="bg-white rounded-[24px] p-5 shadow-sm border border-gray-100 text-black"><h2 className="text-[17px] font-extrabold text-black leading-tight">{title}</h2>{children}</div>)
const AddBtn = ({ onClick, label }: any) => (<button onClick={onClick} className="mt-3 w-full py-2.5 rounded-xl border-2 border-dashed border-gray-300 text-black font-bold text-[13px] bg-gray-50">+ Add Another {label}</button>)
const Hint = () => (<p className="text-[11px] text-gray-500 mt-1">You can type 10,000,000 or 10m or 10 million or Ten million - all work.</p>)

export default function WasiyyahPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isLocked, setIsLocked] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [savedPin, setSavedPin] = useState('1234')
  const [showPinSetup, setShowPinSetup] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [vaultStatus, setVaultStatus] = useState<'DRAFT' | 'ACTIVE_LOCKED' | 'EDITING' | 'RELEASED'>('DRAFT')
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [unlockPin, setUnlockPin] = useState('')
  const [unlockOtp, setUnlockOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [editReason, setEditReason] = useState('')
  const [loadingSave, setLoadingSave] = useState(false)

  // STEP 1
  const [cashHome, setCashHome] = useState('')
  const [banks, setBanks] = useState([{ name: '', amt: '' }])
  const [properties, setProperties] = useState([{ name: '', amt: '' }])
  const [cars, setCars] = useState([{ name: '', amt: '' }])
  const [businesses, setBusinesses] = useState([{ name: '', amt: '' }])
  const [others, setOthers] = useState([{ name: '', amt: '' }])
  const upd = (list: any, setList: any, i: number, key: string, v: string) => { const n = [...list]; n[i][key] = v; setList(n) }
  const add = (list: any, setList: any) => setList([...list, { name: '', amt: '' }])
  const rem = (list: any, setList: any, i: number) => { if (list.length > 1) setList(list.filter((_: any, idx: number) => idx !== i)) }
  const renderList = (list: any, setList: any, namePh: string, amtPh: string, label: string) => (
    <div>{list.map((it: any, i: number) => (
      <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 mt-2 items-center">
        <Input value={it.name} onChange={(e: any) => upd(list, setList, i, 'name', e.target.value)} placeholder={namePh} />
        <Input value={it.amt} onChange={(e: any) => upd(list, setList, i, 'amt', e.target.value)} placeholder={amtPh} />
        {list.length > 1 && <button onClick={() => rem(list, setList, i)} className="text-red-500 font-black px-1 text-lg">×</button>}
      </div>))}
      <AddBtn onClick={() => add(list, setList)} label={label} />
    </div>
  )

  // STEP 2
  const [loans, setLoans] = useState([{ from: '', amt: '' }])
  const [owing, setOwing] = useState([{ person: '', amt: '' }])
  const [kaffarahAmt, setKaffarahAmt] = useState('')
  const [funeralAmt, setFuneralAmt] = useState('500000')

  // STEP 3
  const [myGender, setMyGender] = useState<'male' | 'female'>('male')
  const [isMarried, setIsMarried] = useState('yes')
  const [wivesCount, setWivesCount] = useState('1')
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
  const [heirs, setHeirs] = useState([{ name: '', relation: '', phone: '' }])

  // STEP 4
  const [wasiyyahTo, setWasiyyahTo] = useState('')
  const [wasiyyahAmt, setWasiyyahAmt] = useState('')
  const [message, setMessage] = useState('')
  const [messageSpouse, setMessageSpouse] = useState('')
  const [messageChildren, setMessageChildren] = useState('')
  const [messageFamily, setMessageFamily] = useState('')
  const [specificGifts, setSpecificGifts] = useState([{ item: '', to: '', note: '' }])
  const [guardianName, setGuardianName] = useState('')
  const [guardianPhone, setGuardianPhone] = useState('')
  const [guardianRelation, setGuardianRelation] = useState('')
  const [backupGuardianName, setBackupGuardianName] = useState('')
  const [backupGuardianPhone, setBackupGuardianPhone] = useState('')
  const [hasMinors, setHasMinors] = useState('no')
  const [burialLocation, setBurialLocation] = useState('')
  const [washBy, setWashBy] = useState('')
  const [janazahLeader, setJanazahLeader] = useState('')
  const [noExpensiveCeremony, setNoExpensiveCeremony] = useState(true)
  const [funeralNote, setFuneralNote] = useState('')

  // STEP 5
  const [fullName, setFullName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [location, setLocation] = useState('')
  const [videoFile, setVideoFile] = useState<any>(null)
  const [videoUrl, setVideoUrl] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [witness1Name, setWitness1Name] = useState('')
  const [witness1Phone, setWitness1Phone] = useState('')
  const [witness2Name, setWitness2Name] = useState('')
  const [witness2Phone, setWitness2Phone] = useState('')
  const [executorName, setExecutorName] = useState('')
  const [executorPhone, setExecutorPhone] = useState('')
  const [backupExecutorName, setBackupExecutorName] = useState('')
  const [backupExecutorPhone, setBackupExecutorPhone] = useState('')
  const [declaration, setDeclaration] = useState(false)
  const [soundMind, setSoundMind] = useState(false)
  const videoRef = useRef<any>(null)
  const mediaRecorderRef = useRef<any>(null)

  // LAWYER
  const [lawyerChoice, setLawyerChoice] = useState<'mine' | 'haqq' | 'none'>('none')
  const [lawyerName, setLawyerName] = useState('')
  const [lawyerFirm, setLawyerFirm] = useState('')
  const [lawyerPhone, setLawyerPhone] = useState('')
  const [lawyerEmail, setLawyerEmail] = useState('')
  const [haqqLawyerType, setHaqqLawyerType] = useState('Sharia Court Lawyer')
  const [haqqLawyerNote, setHaqqLawyerNote] = useState('')
  const [lawyerPaid, setLawyerPaid] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [selectedLawyerId, setSelectedLawyerId] = useState('')

  // ASK IMAM
  const [imamQuestion, setImamQuestion] = useState('')
  const [imamSent, setImamSent] = useState(false)
  const [showImam, setShowImam] = useState(false)

  // VERSIONS + REMINDER
  const [versions, setVersions] = useState<any[]>([])
  const [lastSaved, setLastSaved] = useState('')
  const [nextReview, setNextReview] = useState('')

  const num = (v: string) => parseSmartAmount(v)
  const sumList = (l: any) => l.reduce((s: number, x: any) => s + num(x.amt), 0)
  const totalAssets = num(cashHome) + sumList(banks) + sumList(properties) + sumList(cars) + sumList(businesses) + sumList(others)
  const totalDebts = sumList(loans) + sumList(owing.map((o: any) => ({ amt: o.amt }))) + num(kaffarahAmt) + num(funeralAmt)
  const net = totalAssets - totalDebts
  const maxWasiyyah = Math.max(0, net / 3)
  const faraidPool = Math.max(0, net - num(wasiyyahAmt))
  const fmt = formatMoney

  // LOAD FROM SUPABASE - replaces localStorage
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push("/login"); return }
      const p = localStorage.getItem('haqq-wasiyyah-pin')
      if (p) { setSavedPin(p); setIsLocked(true) }
      const { data } = await supabase.from('wasiyyahs').select('*').eq('user_id', user.id).single()
      if (!data) return
      const d = (data as any).data || {}
      const setIf = (v: any, fn: any) => { if (v !== undefined && v !== null && v !== '') fn(v) }
      setIf(d.fullName, setFullName); setIf(d.cashHome, setCashHome)
      if (d.banks?.length) setBanks(d.banks); if (d.properties?.length) setProperties(d.properties)
      if (d.cars?.length) setCars(d.cars); if (d.businesses?.length) setBusinesses(d.businesses)
      if (d.others?.length) setOthers(d.others); if (d.loans?.length) setLoans(d.loans)
      if (d.owing?.length) setOwing(d.owing)
      setIf(d.kaffarahAmt, setKaffarahAmt); setIf(d.funeralAmt, setFuneralAmt)
      setIf(d.myGender, setMyGender); setIf(d.isMarried, setIsMarried); setIf(d.wivesCount, setWivesCount)
      setIf(d.sons, setSons); setIf(d.daughters, setDaughters)
      setIf(d.fatherAlive, setFatherAlive); setIf(d.motherAlive, setMotherAlive)
      setIf(d.pGrandFather, setPGrandFather); setIf(d.pGrandMother, setPGrandMother); setIf(d.mGrandMother, setMGrandMother)
      setIf(d.fullBrothers, setFullBrothers); setIf(d.fullSisters, setFullSisters)
      setIf(d.paternalBrothers, setPaternalBrothers); setIf(d.paternalSisters, setPaternalSisters)
      setIf(d.maternalBrothers, setMaternalBrothers); setIf(d.maternalSisters, setMaternalSisters)
      setIf(d.paternalUncles, setPaternalUncles)
      if (d.heirs?.length) setHeirs(d.heirs)
      setIf(d.wasiyyahTo, setWasiyyahTo); setIf(d.wasiyyahAmt, setWasiyyahAmt)
      setIf(d.message, setMessage); setIf(d.messageSpouse, setMessageSpouse); setIf(d.messageChildren, setMessageChildren); setIf(d.messageFamily, setMessageFamily)
      if (d.specificGifts?.length) setSpecificGifts(d.specificGifts)
      setIf(d.guardianName, setGuardianName); setIf(d.guardianPhone, setGuardianPhone); setIf(d.guardianRelation, setGuardianRelation)
      setIf(d.backupGuardianName, setBackupGuardianName); setIf(d.backupGuardianPhone, setBackupGuardianPhone)
      setIf(d.hasMinors, setHasMinors); setIf(d.burialLocation, setBurialLocation); setIf(d.washBy, setWashBy)
      setIf(d.janazahLeader, setJanazahLeader); setIf(d.funeralNote, setFuneralNote)
      setIf(d.dateOfBirth, setDateOfBirth); setIf(d.location, setLocation)
      setIf(d.witness1Name, setWitness1Name); setIf(d.witness1Phone, setWitness1Phone)
      setIf(d.witness2Name, setWitness2Name); setIf(d.witness2Phone, setWitness2Phone)
      setIf(d.executorName, setExecutorName); setIf(d.executorPhone, setExecutorPhone)
      setIf(d.backupExecutorName, setBackupExecutorName); setIf(d.backupExecutorPhone, setBackupExecutorPhone)
      setIf(d.lawyerChoice, setLawyerChoice); setIf(d.lawyerName, setLawyerName); setIf(d.lawyerFirm, setLawyerFirm)
      setIf(d.lawyerPhone, setLawyerPhone); setIf(d.lawyerEmail, setLawyerEmail)
      setIf(d.haqqLawyerType, setHaqqLawyerType); setIf(d.haqqLawyerNote, setHaqqLawyerNote)
      if (d.lawyerPaid !== undefined) setLawyerPaid(d.lawyerPaid)
      if (d.isPremium !== undefined) setIsPremium(d.isPremium)
      if (d.noExpensiveCeremony !== undefined) setNoExpensiveCeremony(d.noExpensiveCeremony)
      setVaultStatus(((data as any).status as any) || 'DRAFT')
      if (d.versions?.length) setVersions(d.versions)
      if ((data as any).updated_at) {
        setLastSaved((data as any).updated_at)
        const dd = new Date((data as any).updated_at); dd.setMonth(dd.getMonth() + 6)
        setNextReview(dd.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }))
      }
    }
    load()
  }, [router])

  const unlockVaultEntry = () => { if (pinInput === savedPin) setIsLocked(false); else alert('Incorrect PIN.') }
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play() }
      const recorder = new MediaRecorder(stream)
      const chunks: any[] = []
      recorder.ondataavailable = (e: any) => chunks.push(e.data)
      recorder.onstop = () => { const blob = new Blob(chunks, { type: 'video/webm' }); const url = URL.createObjectURL(blob); setVideoUrl(url); setVideoFile(blob); stream.getTracks().forEach((t: any) => t.stop()) }
      mediaRecorderRef.current = recorder; recorder.start(); setIsRecording(true)
    } catch { alert('Please allow camera and microphone access.') }
  }
  const stopRecording = () => { if (mediaRecorderRef.current) { mediaRecorderRef.current.stop(); setIsRecording(false) } }
  const handleVideoUpload = (e: any) => { const f = e.target.files[0]; if (f) { setVideoFile(f); setVideoUrl(URL.createObjectURL(f)) } }
  const sendToImamWhatsApp = () => {
    if (!imamQuestion.trim()) return alert('Please type your question first.')
    const text = `Assalamu Alaikum Imam,\n\nI have a question about my Wasiyyah on HAQQ App:\n\nQuestion: ${imamQuestion}\n\nMy details:\nName: ${fullName || 'Not provided'}\nGender: ${myGender}\nMarried: ${isMarried}\nNet Estate: ${fmt(net)}\nChildren: ${sons} sons, ${daughters} daughters\n\nPlease reply me. Jazakum Allahu Khairan.`
    window.open(`https://wa.me/${IMAM_WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank')
    setImamSent(true)
  }
  const sendOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(otp); setOtpSent(true)
    alert(`Demo OTP sent to your phone: ${otp} - In real app, this will come via SMS/WhatsApp.`)
  }
  const unlockToEdit = () => {
    if (unlockPin !== savedPin) return alert('Incorrect PIN. Only owner can unlock.')
    if (!otpSent) return alert('Please request OTP first.')
    if (unlockOtp !== generatedOtp) return alert('Incorrect OTP.')
    if (!editReason.trim()) return alert('Please select why you want to edit.')
    setVaultStatus('EDITING'); setIsLocked(false); setShowUnlockModal(false); setOtpSent(false); setUnlockOtp('')
    alert(`Wasiyyah Unlocked for editing. Reason: ${editReason}. Remember to Save & Lock Again when you finish.`)
    
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
    const take = (name: string, amt: number, pct: string) => { if (amt <= 0) return; const real = Math.min(amt, pool); out.push({ name, amt: real, pct }); pool -= real }
    if (isMarried === 'yes') {
      if (myGender === 'male') { const w = parseInt(wivesCount) || 1; take(w > 1 ? `Wives (${w} share together)` : 'Wife', hasChildren ? faraidPool * 0.125 : faraidPool * 0.25, hasChildren ? '1/8' : '1/4') }
      else { take('Husband', hasChildren ? faraidPool * 0.25 : faraidPool * 0.5, hasChildren ? '1/4' : '1/2') }
    }
    if (hasMother) { let mShare = faraidPool / 3; if (hasChildren || totalSiblings >= 2) mShare = faraidPool / 6; if (isMarried === 'yes' && hasFather && !hasChildren && totalSiblings === 0) mShare = pool / 3; take('Mother', mShare, hasChildren || totalSiblings >= 2 ? '1/6' : '1/3') }
    else { if (pGrandMother === 'yes' || mGrandMother === 'yes') take('Grandmother', faraidPool / 6, '1/6') }
    if (hasFather) { if (hasChildren) take('Father', faraidPool / 6, '1/6') }
    else if (hasGrandFather && !hasFather) { if (hasChildren) take('Paternal Grandfather', faraidPool / 6, '1/6') }
    if (hasChildren) {
      const units = s * 2 + d; const perUnit = pool / units
      if (s > 0) take(s > 1 ? `Sons (${s})` : 'Son', perUnit * 2 * s, '2 shares for each son')
      if (d > 0) { if (s === 0) take(d > 1 ? `Daughters (${d})` : 'Daughter', d === 1 ? faraidPool * 0.5 : faraidPool * (2 / 3), d === 1 ? '1/2' : '2/3'); else take(d > 1 ? `Daughters (${d})` : 'Daughter', perUnit * d, '1 share for each daughter') }
      if (hasFather && pool > 0) take('Father (Residuary - Remainder)', pool, 'Remainder')
      if (!hasFather && hasGrandFather && pool > 0) take('Grandfather (Residuary)', pool, 'Remainder')
      return out
    }
    const fb = parseInt(fullBrothers) || 0, fs = parseInt(fullSisters) || 0
    const pb = parseInt(paternalBrothers) || 0, ps = parseInt(paternalSisters) || 0
    const mb = parseInt(maternalBrothers) || 0, ms = parseInt(maternalSisters) || 0
    if (mb + ms > 0 && !hasFather && !hasGrandFather) { const matTotal = mb + ms; take(matTotal > 1 ? `Maternal Siblings (${matTotal})` : 'Maternal Sibling', matTotal === 1 ? faraidPool / 6 : faraidPool / 3, matTotal === 1 ? '1/6' : '1/3 shared') }
    if (fb === 0 && pb === 0 && (fs > 0 || ps > 0) && !hasFather && !hasGrandFather) {
      if (fs > 0) take(fs > 1 ? `Full Sisters (${fs})` : 'Full Sister', fs === 1 ? faraidPool * 0.5 : faraidPool * (2 / 3), fs === 1 ? '1/2' : '2/3')
      else if (ps > 0) take(ps > 1 ? `Paternal Sisters (${ps})` : 'Paternal Sister', ps === 1 ? faraidPool * 0.5 : faraidPool * (2 / 3), ps === 1 ? '1/2' : '2/3')
    } else if ((fb > 0 || pb > 0) && !hasFather && !hasGrandFather) {
      const units = (fb + pb) * 2 + (fs + ps); const perUnit = pool / units
      if (fb > 0) take(fb > 1 ? `Full Brothers (${fb})` : 'Full Brother', perUnit * 2 * fb, '2 shares')
      if (fs > 0) take(fs > 1 ? `Full Sisters (${fs})` : 'Full Sister', perUnit * fs, '1 share')
      if (pb > 0) take(pb > 1 ? `Paternal Brothers (${pb})` : 'Paternal Brother', perUnit * 2 * pb, '2 shares')
      if (ps > 0) take(ps > 1 ? `Paternal Sisters (${ps})` : 'Paternal Sister', perUnit * ps, '1 share')
    }
    if (hasFather && pool > 0) take('Father (Residuary - Remainder)', pool, 'Remainder')
    else if (hasGrandFather && pool > 0) take('Grandfather (Residuary)', pool, 'Remainder')
    else if (pool > 0 && (parseInt(paternalUncles) || 0) > 0) take((parseInt(paternalUncles) || 0) > 1 ? `Paternal Uncles (${paternalUncles})` : 'Paternal Uncle', pool, 'Residuary')
    else if (pool > 0 && out.length > 0) take('Remaining to Nearest Residuary Heir', pool, 'Residuary')
    return out
  }, [faraidPool, myGender, isMarried, wivesCount, sons, daughters, fatherAlive, motherAlive, pGrandFather, pGrandMother, mGrandMother, fullBrothers, fullSisters, paternalBrothers, paternalSisters, maternalBrothers, maternalSisters, paternalUncles])

  const buildWasiyyahData = (status: string, version: number, vers: any[]) => ({
    fullName, myGender, cashHome, banks, properties, cars, businesses, others,
    loans, owing, kaffarahAmt, funeralAmt,
    isMarried, wivesCount, sons, daughters, fatherAlive, motherAlive,
    pGrandFather, pGrandMother, mGrandMother,
    fullBrothers, fullSisters, paternalBrothers, paternalSisters,
    maternalBrothers, maternalSisters, paternalUncles, heirs,
    wasiyyahTo, wasiyyahAmt, message, messageSpouse, messageChildren, messageFamily,
    specificGifts, guardianName, guardianPhone, guardianRelation,
    backupGuardianName, backupGuardianPhone, hasMinors,
    burialLocation, washBy, janazahLeader, noExpensiveCeremony, funeralNote,
    dateOfBirth, location, witness1Name, witness1Phone, witness2Name, witness2Phone,
    executorName, executorPhone, backupExecutorName, backupExecutorPhone,
    declaration, soundMind, lawyerChoice, lawyerName, lawyerFirm, lawyerPhone, lawyerEmail,
    haqqLawyerType, haqqLawyerNote, lawyerPaid, isPremium,
    totalAssets, totalDebts, net, faraid, vaultStatus: status, version,
    videoVerified: !!videoFile, savedAt: new Date().toISOString(), versions: vers,
  })

  const saveAll = async () => {
    if (!declaration || !soundMind) { alert('Please confirm both declarations before saving.'); return }
    if (!witness1Name || !witness2Name) { alert('Please add two witnesses.'); return }
    if (lawyerChoice === 'haqq' && !lawyerPaid) { alert('Please pay HAQQ Lawyer Review Fee of ₦25,000, or choose My Own Lawyer / No Lawyer Yet.'); return }
    setLoadingSave(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }
    const now = new Date().toISOString()
    const newVersions = [{ date: now, net, wasiyyahAmt, fullName, editReason: 'First version' }, ...versions].slice(0, 10)
    const data = buildWasiyyahData('ACTIVE_LOCKED', 1, newVersions)
    const { error } = await supabase.from('wasiyyahs').upsert({ user_id: user.id, data, status: 'ACTIVE_LOCKED', version: 1, updated_at: now }, { onConflict: 'user_id' })
    setLoadingSave(false)
    if (error) { alert(error.message); return }
    setVersions(newVersions); setVaultStatus('ACTIVE_LOCKED'); setLastSaved(now)
    const d = new Date(); d.setMonth(d.getMonth() + 6); setNextReview(d.toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }))
    alert('Your Wasiyyah has been saved securely in your Vault. It is now LOCKED.')
  }

  const saveAndLockAgain = async () => {
    setLoadingSave(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push("/login"); return }
    const now = new Date().toISOString()
    const newVersion = versions.length + 1
    const newVersions = [{ date: now, net, wasiyyahAmt, fullName, editReason }, ...versions].slice(0, 10)
    const data = buildWasiyyahData('ACTIVE_LOCKED', newVersion, newVersions)
    const { error } = await supabase.from('wasiyyahs').upsert({ user_id: user.id, data, status: 'ACTIVE_LOCKED', version: newVersion, updated_at: now }, { onConflict: 'user_id' })
    setLoadingSave(false)
    if (error) { alert(error.message); return }
    setVersions(newVersions); setVaultStatus('ACTIVE_LOCKED'); setLastSaved(now)
    alert('Your Wasiyyah has been updated and LOCKED again. New version saved.')
  }

  const downloadDraftPDF = () => {
    const date = new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
    const assetsHtml = [...banks.map(b => `<tr><td>Bank - ${b.name || 'Bank'}</td><td style="text-align:right">${fmt(num(b.amt))}</td></tr>`), ...properties.map(p => `<tr><td>Property - ${p.name || 'Property'}</td><td style="text-align:right">${fmt(num(p.amt))}</td></tr>`), ...cars.map(c => `<tr><td>Car - ${c.name || 'Car'}</td><td style="text-align:right">${fmt(num(c.amt))}</td></tr>`), `<tr><td>Cash at Home</td><td style="text-align:right">${fmt(num(cashHome))}</td></tr>`].join('')
    const debtsHtml = [...loans.map(l => `<tr><td>Loan from ${l.from || 'Lender'}</td><td style="text-align:right">${fmt(num(l.amt))}</td></tr>`), ...owing.map(o => `<tr><td>Owed to ${o.person || 'Person'}</td><td style="text-align:right">${fmt(num(o.amt))}</td></tr>`), `<tr><td>Kaffarah</td><td style="text-align:right">${fmt(num(kaffarahAmt))}</td></tr><tr><td>Funeral Expenses</td><td style="text-align:right">${fmt(num(funeralAmt))}</td></tr>`].join('')
    const faraidHtml = faraid.map((f: any) => `<tr><td>${f.name} (${f.pct})</td><td style="text-align:right">${fmt(f.amt)}</td></tr>`).join('') || '<tr><td colspan="2">No heirs listed</td></tr>'
    const giftsHtml = specificGifts.filter(g => g.item).map(g => `<tr><td>${g.item} → To ${g.to}</td><td>${g.note || ''}</td></tr>`).join('') || '<tr><td colspan="2">No specific gifts</td></tr>'
    const lawyerText = lawyerChoice === 'mine' ? `${lawyerName || '-'} - ${lawyerFirm || ''}` : lawyerChoice === 'haqq' ? `HAQQ Partner Lawyer - ${haqqLawyerType}` : 'No lawyer selected yet'
    const html = `<html><head><title>DRAFT Wasiyyah - ${fullName || 'HAQQ'}</title><style>body{font-family:Georgia,serif;max-width:750px;margin:0 auto;padding:40px;color:#111;line-height:1.6} h1{text-align:center;font-size:32px;letter-spacing:4px;margin:0} .watermark{position:fixed;top:40%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:80px;color:rgba(255,0,0,0.15);font-weight:bold;z-index:0} h2{border-bottom:2px solid #0A1931;padding-bottom:6px;margin-top:30px;font-size:18px} table{width:100%;border-collapse:collapse;margin-top:10px} td{padding:8px 4px;border-bottom:1px solid #eee;font-size:14px} .total{font-weight:bold} .box{background:#f7f7f7;padding:16px;border-radius:10px;margin-top:10px} @media print{body{padding:20px}}</style></head><body><div class="watermark">DRAFT</div><h1>HAQQ</h1><p style="text-align:center;color:red;font-weight:bold">DRAFT COPY ONLY - NOT FINAL - FOR LAWYER REVIEW ONLY</p><p style="text-align:center;font-size:13px">Made on ${date} in ${location || 'Nigeria'}</p><div class="box"><b>I, ${fullName || '[Full Name]'}</b>, being of sound mind, do hereby make this Wasiyyah willingly.</div><h2>1. Assets</h2><table>${assetsHtml}<tr class="total"><td>Total Assets</td><td style="text-align:right">${fmt(totalAssets)}</td></tr></table><h2>2. Debts</h2><table>${debtsHtml}<tr class="total"><td>Net Estate</td><td style="text-align:right">${fmt(net)}</td></tr></table><h2>3. Specific Gifts</h2><table>${giftsHtml}</table><h2>4. Wasiyyah (One-Third)</h2><p>I bequeath <b>${fmt(num(wasiyyahAmt))}</b> to <b>${wasiyyahTo || 'Charity'}</b>.</p><h2>5. Faraid</h2><table>${faraidHtml}<tr class="total"><td>Total for Faraid</td><td style="text-align:right">${fmt(faraidPool)}</td></tr></table><h2>6. Guardianship</h2><p>${hasMinors === 'yes' ? `Guardian: ${guardianName} - ${guardianPhone}. Backup: ${backupGuardianName}` : 'No minors'}</p><h2>7. Funeral Wishes</h2><p>Burial: ${burialLocation || '-'} | Wash By: ${washBy || '-'} | Janazah: ${janazahLeader || '-'} | Simple Ceremony: ${noExpensiveCeremony ? 'Yes' : 'No'} | Note: ${funeralNote || '-'}</p><h2>8. Executor, Lawyer & Witnesses</h2><p>Executor: ${executorName} (${executorPhone})<br/>Backup Executor: ${backupExecutorName} (${backupExecutorPhone})<br/>Lawyer: ${lawyerText}<br/>Witness 1: ${witness1Name} (${witness1Phone})<br/>Witness 2: ${witness2Name} (${witness2Phone})</p><p style="font-size:11px;color:#777;margin-top:30px;text-align:center">DRAFT - Generated by HAQQ App - Final version is locked in HAQQ Vault.</p><script>window.onload=()=>window.print()</script></body></html>`
    const w = window.open('', '_blank'); if (w) { w.document.write(html); w.document.close() }
  }

  const notifyText = `Assalamu Alaikum, I have named you in my Wasiyyah on HAQQ App. I, ${fullName || 'Your family member'}, have made my Islamic Will. Please keep this message safe. My Executor is ${executorName || '-'}. May Allah reward you.`
  const waLink = (phone: string) => `https://wa.me/${String(phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(notifyText)}`

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#0A1931] flex items-center justify-center px-4">
        <div className="bg-white rounded-[24px] p-6 w-full max-w-[380px] text-black text-center">
          <h1 className="text-[28px] font-black">HAQQ 🔒</h1>
          <p className="text-sm text-gray-600 mt-1">Your Wasiyyah Vault is locked. Enter your PIN to open it.</p>
          <input value={pinInput} onChange={(e) => setPinInput(e.target.value)} placeholder="Enter 4-digit PIN" maxLength={4} inputMode="numeric" className="w-full mt-4 p-3 border rounded-xl text-center text-xl font-black tracking-widest outline-none" />
          <button onClick={unlockVaultEntry} className="w-full mt-3 bg-black text-white py-3.5 rounded-full font-bold">Unlock My Wasiyyah</button>
          {!showPinSetup ? <button onClick={() => setShowPinSetup(true)} className="text-[12px] mt-3 text-gray-500 underline">Set / Change PIN</button> : (
            <div className="mt-3">
              <input value={newPin} onChange={(e) => setNewPin(e.target.value)} placeholder="New 4-digit PIN" maxLength={4} className="w-full p-3 border rounded-xl text-center font-bold" />
              <button onClick={() => { if (newPin.length === 4) { localStorage.setItem('haqq-wasiyyah-pin', newPin); setSavedPin(newPin); setIsLocked(false); alert('PIN saved!') } else alert('PIN must be 4 digits') }} className="w-full mt-2 bg-[#0A1931] text-white py-3 rounded-full font-bold text-sm">Save New PIN</button>
            </div>
          )}
          <p className="text-[11px] text-gray-400 mt-3">Default PIN is 1234 if you never set one.</p>
        </div>
      </div>
  return (
    <div className="min-h-screen bg-[#0A1931] text-white pb-[140px]">
      <div className="max-w-[520px] mx-auto px-4 pt-5">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-black text-white">HAQQ</h1>
          <div className="flex gap-2">
            <button onClick={() => setShowImam(!showImam)} className="bg-yellow-400 text-black px-3 py-1.5 rounded-full text-[12px] font-bold">Ask Imam 🕌</button>
            <a href="/vault" className="bg-white text-[#0A1931] px-4 py-1.5 rounded-full text-sm font-bold">Vault</a>
          </div>
        </div>
        <div className="bg-white text-[#0f172a] rounded-[20px] p-5 shadow-xl border-2 border-[#D4AF37]/40 mt-4">
          <div className="flex justify-between items-start gap-3">
            <div>
              <p className="text-[10px] tracking-widest text-[#D4AF37] font-bold">📜 MY WASIYYAH - ISLAMIC WILL</p>
              <h2 className="font-extrabold text-[18px] mt-1">{fullName ? fullName : 'My Wasiyyah'}</h2>
            </div>
            <span className="text-[10px] px-2 py-1 rounded-full font-bold whitespace-nowrap shrink-0 bg-green-100 text-green-700">
              {vaultStatus === 'ACTIVE_LOCKED' ? '🔒 LOCKED & SAFE' : vaultStatus === 'EDITING' ? '🔓 EDITING' : vaultStatus === 'RELEASED' ? '⚠️ RELEASED' : '📝 DRAFT'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
            <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[11px] text-gray-500">NET ESTATE</p><p className="font-extrabold">{fmt(net)}</p></div>
            <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[11px] text-gray-500">WASIYYAH (1/3)</p><p className="font-extrabold">{fmt(num(wasiyyahAmt))}</p></div>
            <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[11px] text-gray-500">EXECUTOR</p><p className="font-bold truncate">{executorName || '-'}</p></div>
            <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[11px] text-gray-500">LAWYER</p><p className="font-bold truncate">{lawyerChoice === 'haqq' ? 'HAQQ Lawyer' : lawyerName || 'No Lawyer Yet'}</p></div>
          </div>
          <p className="text-[11px] text-gray-500 mt-3 bg-yellow-50 p-3 rounded-xl leading-relaxed">
            🔒 Locked: Only you can unlock to edit (PIN + OTP). Executor / Lawyer can only access after death verification.
            {versions.length > 0 && <><br/>Version History: {versions.length} version(s) saved.</>}
          </p>
          <div className="flex gap-2 mt-3">
            <button onClick={() => setShowUnlockModal(true)} className="flex-1 text-center bg-[#0f172a] text-white py-3 rounded-full font-bold text-sm">Unlock To Edit</button>
            <a href="/report-death" className="flex-1 text-center bg-red-600 text-white py-3 rounded-full font-bold text-sm no-underline">Report Death</a>
          </div>
          <a href="/lawyer" className="block text-center mt-2 bg-yellow-400 text-black py-3 rounded-full font-bold text-sm no-underline">⚖️ Go To Lawyer Page</a>
          {versions.length > 0 && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-[11px] font-bold">VERSION HISTORY</p>
              {versions.slice(0, 3).map((v: any, i: number) => (
                <p key={i} className="text-[11px] text-gray-500">Version {versions.length - i} - {new Date(v.date).toLocaleDateString('en-NG')} - {fmt(v.net || 0)}</p>
              ))}
            </div>
          )}
        </div>
        {showImam && (
          <div className="bg-white rounded-[20px] p-4 mt-4 text-black">
            <h3 className="font-extrabold">Ask Imam - On WhatsApp</h3>
            <div className="text-[13px] mt-2 space-y-2">
              <p><b>Q: Can I give everything to one child?</b><br/>A: No. After debts and max 1/3 Wasiyyah, the rest must follow Faraid.</p>
              <p><b>Q: Can I give Wasiyyah to my heir?</b><br/>A: Generally no, unless all other heirs agree after your death.</p>
              <p><b>Q: Does my wife get 1/8 or 1/4?</b><br/>A: 1/8 if you have children, 1/4 if no children.</p>
            </div>
            {!imamSent ? (
              <div className="mt-3">
                <textarea value={imamQuestion} onChange={(e) => setImamQuestion(e.target.value)} placeholder="Ask your question about Faraid, Wasiyyah, guardianship..." className="w-full p-3 border rounded-xl text-sm outline-none min-h-[70px]" />
                <button onClick={sendToImamWhatsApp} className="w-full mt-2 bg-green-500 text-white py-3 rounded-full font-bold text-sm">Send To Imam On WhatsApp 💬</button>
              </div>
            ) : <p className="text-green-600 font-bold text-sm mt-3">✓ Opened WhatsApp to Imam. He will reply you there.</p>}
          </div>
        )}
        {vaultStatus === 'ACTIVE_LOCKED' && (
          <div className="bg-white rounded-[20px] p-4 mt-4 text-black text-center">
            <p className="font-extrabold">🔒 Your Wasiyyah Is Locked & Safe In Vault</p>
            <p className="text-[12px] text-gray-600 mt-1">Only you can unlock it to update. Executor / Lawyer cannot edit it.</p>
            <button onClick={() => setShowUnlockModal(true)} className="w-full mt-3 bg-black text-white py-3 rounded-full font-bold text-sm">🔓 Unlock To Edit My Wasiyyah</button>
            <p className="text-[11px] text-gray-400 mt-2">Last saved: {lastSaved ? new Date(lastSaved).toLocaleDateString('en-NG') : 'Not saved yet'} • Version {versions.length || 1}</p>
          </div>
        )}
        {vaultStatus === 'EDITING' && (
          <div className="bg-yellow-400 text-black rounded-[20px] p-4 mt-4 text-center">
            <p className="font-extrabold">🔓 EDITING MODE - Wasiyyah Is Unlocked</p>
            <p className="text-[12px] mt-1">You can now edit anything. When you finish, click Save & Lock Again below.</p>
            <p className="text-[11px] font-bold mt-1">Reason: {editReason}</p>
          </div>
        )}
        {vaultStatus === 'RELEASED' && (
          <div className="bg-red-100 text-black rounded-[20px] p-4 mt-4 text-center">
            <p className="font-extrabold">⚠️ This Wasiyyah Has Been Released After Death Verification</p>
            <p className="text-[12px] mt-1">It can no longer be edited. Only Executor & Lawyer can download and execute it.</p>
          </div>
        )}
        {lastSaved && vaultStatus !== 'ACTIVE_LOCKED' && (
          <div className="bg-yellow-50 text-black rounded-[16px] p-3 mt-4 text-[12px]">
            <b>Reminder:</b> Last saved on {new Date(lastSaved).toLocaleDateString('en-NG')}. Please review and update by <b>{nextReview}</b>.
            <button onClick={() => setStep(1)} className="ml-2 underline font-bold">Update Now</button>
          </div>
        )}
        <div className="bg-white rounded-[20px] p-4 mt-4 text-black">
          <div className="flex justify-between">
            <div><p className="text-[11px] font-bold text-gray-500 uppercase">Amount for Faraid</p><p className="text-[20px] font-black">{fmt(faraidPool)}</p></div>
            <div className="text-right"><p className="text-[11px] font-bold text-gray-500 uppercase">Net Estate</p><p className="text-[20px] font-black">{fmt(net)}</p></div>
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100 text-[12px] font-medium text-gray-600"><span>Total Assets: {fmt(totalAssets)}</span><span>Total Debts: {fmt(totalDebts)}</span></div>
          {versions.length > 0 && <p className="text-[11px] text-gray-500 mt-2">Version History: {versions.length} saved version(s) - Last: {new Date(versions[0].date).toLocaleDateString('en-NG')}</p>}
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
          {['1. Assets', '2. Debts', '3. Family', '4. Wasiyyah', '5. Verify'].map((t, i) => (
            <button key={t} onClick={() => setStep(i + 1)} className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-bold ${step === i + 1 ? 'bg-black text-white' : 'bg-white text-black'}`}>{t}</button>
          ))}
        </div>
      </div>
      <div className="max-w-[520px] mx-auto px-4 mt-4 space-y-4">
        {step === 1 && (
          <Q title="Step 1 - Declare Your Assets">
            <p className="text-[12px] text-gray-500 mt-1">Example: Type 10 million or 10m or Ten million - it will become ₦10,000,000.</p>
            <Label>Cash at Home</Label>
            <Input value={cashHome} onChange={(e: any) => setCashHome(e.target.value)} placeholder="e.g. 500k or 500,000" />
            <Hint />
            <Label>Banks - Add as many as you have</Label>
            {renderList(banks, setBanks, 'Bank Name - e.g. GTBank', 'e.g. 10m or 10 million', 'Bank')}
            <Label>Properties - Add as many as you have</Label>
            {renderList(properties, setProperties, 'Property - e.g. House in Ibadan', 'e.g. 50m or 50 million', 'Property')}
            <Label>Cars - Add as many as you have</Label>
            {renderList(cars, setCars, 'Car - e.g. Toyota Camry', 'e.g. 5m or 5 million', 'Car')}
            <Label>Businesses</Label>
            {renderList(businesses, setBusinesses, 'Business Name', 'e.g. 2m', 'Business')}
            <Label>Other Assets</Label>
            {renderList(others, setOthers, 'Other Asset - e.g. Gold', 'e.g. 1m', 'Other Asset')}
            <div className="mt-5 bg-gray-50 rounded-xl p-3 flex justify-between"><span className="font-bold text-sm">Total Assets</span><span className="font-black">{fmt(totalAssets)}</span></div>
            <button onClick={() => setStep(2)} className="w-full mt-4 bg-[#0A1931] text-white py-3.5 rounded-full font-bold">Next - Debts</button>
          </Q>
        )}
        {step === 2 && (
          <Q title="Step 2 - Debts and Rights">
            <Label>Loans - Add all loans</Label>
            {loans.map((it: any, i: number) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 mt-2 items-center">
                <Input value={it.from} onChange={(e: any) => { const n = [...loans]; n[i].from = e.target.value; setLoans(n) }} placeholder="Loan From - e.g. GTBank" />
                <Input value={it.amt} onChange={(e: any) => { const n = [...loans]; n[i].amt = e.target.value; setLoans(n) }} placeholder="e.g. 500k" />
                {loans.length > 1 && <button onClick={() => setLoans(loans.filter((_: any, idx: number) => idx !== i))} className="text-red-500 font-black px-1">×</button>}
              </div>
            ))}
            <AddBtn onClick={() => setLoans([...loans, { from: '', amt: '' }])} label="Loan" />
            <Label>People You Owe - Add all people</Label>
            {owing.map((it: any, i: number) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 mt-2 items-center">
                <Input value={it.person} onChange={(e: any) => { const n = [...owing]; n[i].person = e.target.value; setOwing(n) }} placeholder="Person's Name - e.g. Musa" />
                <Input value={it.amt} onChange={(e: any) => { const n = [...owing]; n[i].amt = e.target.value; setOwing(n) }} placeholder="e.g. 100k" />
                {owing.length > 1 && <button onClick={() => setOwing(owing.filter((_: any, idx: number) => idx !== i))} className="text-red-500 font-black px-1">×</button>}
              </div>
            ))}
            <AddBtn onClick={() => setOwing([...owing, { person: '', amt: '' }])} label="Person You Owe" />
            <Label>Kaffarah / Funeral Expenses</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={kaffarahAmt} onChange={(e: any) => setKaffarahAmt(e.target.value)} placeholder="e.g. 200k" />
              <Input value={funeralAmt} onChange={(e: any) => setFuneralAmt(e.target.value)} placeholder="e.g. 500k" />
            </div>
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
          <Q title="Step 3 - My Family (Faraid)">
            <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">This Wasiyyah is for you. Please select your own gender so your spouse and family shares can be calculated correctly.</p>
            <Label>What Is Your Gender?</Label>
            <div className="flex gap-2">
              <button onClick={() => setMyGender('male')} className={`flex-1 py-3 rounded-xl border font-bold ${myGender === 'male' ? 'bg-black text-white' : 'bg-white text-black'}`}>I Am Male</button>
              <button onClick={() => setMyGender('female')} className={`flex-1 py-3 rounded-xl border font-bold ${myGender === 'female' ? 'bg-black text-white' : 'bg-white text-black'}`}>I Am Female</button>
            </div>
            <Label>{myGender === 'male' ? 'My Wives - How Many Wives Do You Have?' : 'My Husband'}</Label>
            <div className="flex gap-2">
              <button onClick={() => setIsMarried('yes')} className={`flex-1 py-2.5 rounded-xl border font-bold text-sm ${isMarried === 'yes' ? 'bg-black text-white' : 'bg-white text-black'}`}>I Am Married</button>
              <button onClick={() => setIsMarried('no')} className={`flex-1 py-2.5 rounded-xl border font-bold text-sm ${isMarried === 'no' ? 'bg-black text-white' : 'bg-white text-black'}`}>I Am Not Married</button>
            </div>
            {isMarried === 'yes' && myGender === 'male' && <div className="mt-3"><Input value={wivesCount} onChange={(e: any) => setWivesCount(e.target.value)} placeholder="How many wives do you have? 1 to 4" /><p className="text-[11px] text-gray-500 mt-1">If you have more than one wife, they will share one portion together.</p></div>}
            {isMarried === 'yes' && myGender === 'female' && <div className="mt-3"><p className="text-[13px] font-medium text-black bg-gray-50 p-3 rounded-xl">Your husband will receive 1/4 if you have children, or 1/2 if you have no children.</p></div>}
            <Label>My Children</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={sons} onChange={(e: any) => setSons(e.target.value)} placeholder="Number of Sons - 0" />
              <Input value={daughters} onChange={(e: any) => setDaughters(e.target.value)} placeholder="Number of Daughters - 0" />
            </div>
            <Label>My Parents - Select if Alive</Label>
            <div className="grid grid-cols-2 gap-3">
              <select value={fatherAlive} onChange={(e) => setFatherAlive(e.target.value)} className="w-full p-3 bg-white rounded-xl border text-black font-medium text-sm outline-none"><option value="no">My Father - Not Alive</option><option value="yes">My Father - Alive</option></select>
              <select value={motherAlive} onChange={(e) => setMotherAlive(e.target.value)} className="w-full p-3 bg-white rounded-xl border text-black font-medium text-sm outline-none"><option value="no">My Mother - Not Alive</option><option value="yes">My Mother - Alive</option></select>
            </div>
            <Label>My Grandparents</Label>
            <div className="grid grid-cols-1 gap-2">
              <select value={pGrandFather} onChange={(e) => setPGrandFather(e.target.value)} className="w-full p-3 bg-white rounded-xl border text-black text-sm font-medium outline-none"><option value="no">My Paternal Grandfather - Not Alive</option><option value="yes">My Paternal Grandfather - Alive</option></select>
              <select value={pGrandMother} onChange={(e) => setPGrandMother(e.target.value)} className="w-full p-3 bg-white rounded-xl border text-black text-sm font-medium outline-none"><option value="no">My Paternal Grandmother - Not Alive</option><option value="yes">My Paternal Grandmother - Alive</option></select>
              <select value={mGrandMother} onChange={(e) => setMGrandMother(e.target.value)} className="w-full p-3 bg-white rounded-xl border text-black text-sm font-medium outline-none"><option value="no">My Maternal Grandmother - Not Alive</option><option value="yes">My Maternal Grandmother - Alive</option></select>
            </div>
            <Label>My Full Siblings</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={fullBrothers} onChange={(e: any) => setFullBrothers(e.target.value)} placeholder="My Full Brothers - 0" />
              <Input value={fullSisters} onChange={(e: any) => setFullSisters(e.target.value)} placeholder="My Full Sisters - 0" />
            </div>
            <Label>My Paternal Siblings</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={paternalBrothers} onChange={(e: any) => setPaternalBrothers(e.target.value)} placeholder="My Paternal Brothers - 0" />
              <Input value={paternalSisters} onChange={(e: any) => setPaternalSisters(e.target.value)} placeholder="My Paternal Sisters - 0" />
            </div>
            <Label>My Maternal Siblings</Label>
            <div className="grid grid-cols-2 gap-3">
              <Input value={maternalBrothers} onChange={(e: any) => setMaternalBrothers(e.target.value)} placeholder="My Maternal Brothers - 0" />
              <Input value={maternalSisters} onChange={(e: any) => setMaternalSisters(e.target.value)} placeholder="My Maternal Sisters - 0" />
            </div>
            <Label>My Paternal Uncles</Label>
            <Input value={paternalUncles} onChange={(e: any) => setPaternalUncles(e.target.value)} placeholder="Number of Paternal Uncles - 0" />
            <Label>Heirs Contact Details - So Executor Can Contact Them</Label>
            {heirs.map((h: any, i: number) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 mt-2">
                <Input value={h.name} onChange={(e: any) => { const n = [...heirs]; n[i].name = e.target.value; setHeirs(n) }} placeholder="Heir Name" />
                <Input value={h.relation} onChange={(e: any) => { const n = [...heirs]; n[i].relation = e.target.value; setHeirs(n) }} placeholder="Relation" />
                <Input value={h.phone} onChange={(e: any) => { const n = [...heirs]; n[i].phone = e.target.value; setHeirs(n) }} placeholder="Phone" />
                {heirs.length > 1 && <button onClick={() => setHeirs(heirs.filter((_: any, idx: number) => idx !== i))} className="text-red-500 font-black">×</button>}
              </div>
            ))}
            <AddBtn onClick={() => setHeirs([...heirs, { name: '', relation: '', phone: '' }])} label="Heir" />
            <div className="flex gap-3 mt-5">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-full border font-bold">Back</button>
              <button onClick={() => setStep(4)} className="flex-1 bg-[#0A1931] text-white py-3 rounded-full font-bold">Next - Wasiyyah</button>
            </div>
          </Q>
        )}
        {step === 4 && (
          <>
            <Q title="Step 4 - Wasiyyah, Gifts, Guardianship & Funeral">
              <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">
                {net <= 0 ? "Please enter your assets and debts in Steps 1 and 2 to calculate how much you can allocate as Wasiyyah."
                  : `Based on your Net Estate of ${fmt(net)}, you may allocate up to ${fmt(maxWasiyyah)} (one-third) as Wasiyyah to non-heirs or charity. The remaining ${fmt(faraidPool)} will be distributed according to Faraid.`}
              </p>
              <Label>Wasiyyah To Charity / Non-Heir</Label>
              <Input value={wasiyyahTo} onChange={(e: any) => setWasiyyahTo(e.target.value)} placeholder="Beneficiary - e.g. Mosque, Orphanage" />
              <div className="mt-3"><Input value={wasiyyahAmt} onChange={(e: any) => setWasiyyahAmt(e.target.value)} placeholder="Wasiyyah Amount - e.g. 1m or 1 million" /></div>
              <Hint />
              {num(wasiyyahAmt) > maxWasiyyah && <p className="text-red-600 text-[12px] font-bold mt-2">This amount exceeds one-third. Please reduce it to {fmt(maxWasiyyah)} or less.</p>}
              <div className="mt-4 bg-gray-50 rounded-xl p-3 space-y-2 text-sm text-black">
                <div className="flex justify-between"><span>Total Assets</span><span className="font-bold">{fmt(totalAssets)}</span></div>
                <div className="flex justify-between"><span>Total Debts</span><span className="font-bold text-red-600">-{fmt(totalDebts)}</span></div>
                <div className="flex justify-between border-t pt-2"><span>Net Estate</span><span className="font-black">{fmt(net)}</span></div>
                <div className="flex justify-between"><span>Maximum Wasiyyah (One-Third)</span><span className="font-black">{fmt(maxWasiyyah)}</span></div>
                <div className="flex justify-between"><span>Amount Available for Faraid</span><span className="font-black">{fmt(faraidPool)}</span></div>
              </div>
              <Label>Specific Gifts - e.g. My Car To My Son</Label>
              {specificGifts.map((g: any, i: number) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 mt-2">
                  <Input value={g.item} onChange={(e: any) => { const n = [...specificGifts]; n[i].item = e.target.value; setSpecificGifts(n) }} placeholder="Item - e.g. Toyota Camry" />
                  <Input value={g.to} onChange={(e: any) => { const n = [...specificGifts]; n[i].to = e.target.value; setSpecificGifts(n) }} placeholder="To - e.g. Musa" />
                  <Input value={g.note} onChange={(e: any) => { const n = [...specificGifts]; n[i].note = e.target.value; setSpecificGifts(n) }} placeholder="Note" />
                  {specificGifts.length > 1 && <button onClick={() => setSpecificGifts(specificGifts.filter((_: any, idx: number) => idx !== i))} className="text-red-500 font-black">×</button>}
                </div>
              ))}
              <AddBtn onClick={() => setSpecificGifts([...specificGifts, { item: '', to: '', note: '' }])} label="Specific Gift" />
              <Label>Guardianship - Do You Have Children Under 18?</Label>
              <div className="flex gap-2">
                <button onClick={() => setHasMinors('yes')} className={`flex-1 py-2.5 rounded-xl border font-bold text-sm ${hasMinors === 'yes' ? 'bg-black text-white' : 'bg-white text-black'}`}>Yes, I Have Minors</button>
                <button onClick={() => setHasMinors('no')} className={`flex-1 py-2.5 rounded-xl border font-bold text-sm ${hasMinors === 'no' ? 'bg-black text-white' : 'bg-white text-black'}`}>No Minors</button>
              </div>
              {hasMinors === 'yes' && (
                <div className="mt-3 space-y-2">
                  <Input value={guardianName} onChange={(e: any) => setGuardianName(e.target.value)} placeholder="Guardian Full Name" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={guardianRelation} onChange={(e: any) => setGuardianRelation(e.target.value)} placeholder="Relation - e.g. My Brother" />
                    <Input value={guardianPhone} onChange={(e: any) => setGuardianPhone(e.target.value)} placeholder="Guardian Phone" />
                  </div>
                  <Input value={backupGuardianName} onChange={(e: any) => setBackupGuardianName(e.target.value)} placeholder="Backup Guardian Full Name" />
                  <Input value={backupGuardianPhone} onChange={(e: any) => setBackupGuardianPhone(e.target.value)} placeholder="Backup Guardian Phone" />
                </div>
              )}
              <Label>Funeral & Burial Wishes</Label>
              <Input value={burialLocation} onChange={(e: any) => setBurialLocation(e.target.value)} placeholder="Where do you want to be buried? - e.g. Ibadan" />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input value={washBy} onChange={(e: any) => setWashBy(e.target.value)} placeholder="Who should wash you?" />
                <Input value={janazahLeader} onChange={(e: any) => setJanazahLeader(e.target.value)} placeholder="Who should lead Janazah?" />
              </div>
              <label className="flex gap-2 items-center mt-3 bg-gray-50 p-3 rounded-xl cursor-pointer">
                <input type="checkbox" checked={noExpensiveCeremony} onChange={(e) => setNoExpensiveCeremony(e.target.checked)} className="w-4 h-4 accent-black" />
                <span className="text-[13px] font-medium">Please keep my funeral simple. No expensive ceremony.</span>
              </label>
              <div className="mt-2"><textarea value={funeralNote} onChange={(e) => setFuneralNote(e.target.value)} placeholder="Any other funeral wish..." className="w-full p-3 border rounded-xl text-sm outline-none min-h-[60px]" /></div>
            </Q>
            <Q title="Faraid Distribution - My Family">
              <div className="mt-3 space-y-2">
                {faraid.length === 0 && <p className="text-gray-500 text-sm">Please add your family members in Step 3.</p>}
                {faraid.map((f: any, i: number) => (
                  <div key={i} className="flex justify-between bg-gray-50 p-3 rounded-xl"><div><p className="font-bold text-sm">{f.name}</p><p className="text-[11px] text-gray-500">{f.pct}</p></div><p className="font-black">{fmt(f.amt)}</p></div>
                ))}
              </div>
              <div className="flex justify-between mt-3 pt-3 border-t font-black"><span>Total for Faraid</span><span>{fmt(faraidPool)}</span></div>
              <p className="text-[11px] text-gray-500 mt-2">Based on Qur&apos;an 4:11-12. For complex cases, please confirm with an Imam.</p>
            </Q>
            <Q title="Personal Messages To My Family">
              <Label>{myGender === 'male' ? 'Message To My Wife / Wives' : 'Message To My Husband'}</Label>
              <textarea value={messageSpouse} onChange={(e) => setMessageSpouse(e.target.value)} placeholder="Write a message to your spouse..." className="w-full p-3 border rounded-xl text-sm outline-none min-h-[70px]" />
              <Label>Message To My Children</Label>
              <textarea value={messageChildren} onChange={(e) => setMessageChildren(e.target.value)} placeholder="Write a message to your children..." className="w-full p-3 border rounded-xl text-sm outline-none min-h-[70px]" />
              <Label>Message To My Family</Label>
              <textarea value={messageFamily} onChange={(e) => setMessageFamily(e.target.value)} placeholder="Write a general message to your family..." className="w-full p-3 border rounded-xl text-sm outline-none min-h-[70px]" />
              <div className="mt-3"><textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Final message..." className="w-full p-3 border rounded-xl text-sm outline-none min-h-[70px]" /></div>
            </Q>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 py-3.5 rounded-full bg-white text-black font-bold">Back</button>
              <button onClick={() => setStep(5)} className="flex-[2] py-3.5 rounded-full bg-black text-white font-bold">Next - Verify & Legalize</button>
            </div>
          </>
        )}
        {step === 5 && (
          <>
            <Q title="Step 5 - Video Verification & Legalization">
              <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">Record a short video confirming this is your Wasiyyah, and add two witnesses and an executor.</p>
              <Label>Your Full Name</Label>
              <Input value={fullName} onChange={(e: any) => setFullName(e.target.value)} placeholder="Your Full Name as on ID" />
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Input value={dateOfBirth} onChange={(e: any) => setDateOfBirth(e.target.value)} placeholder="Date of Birth" />
                <Input value={location} onChange={(e: any) => setLocation(e.target.value)} placeholder="City / State - e.g. Lagos" />
              </div>
              <Label>Video Verification - Record Yourself</Label>
              <div className="bg-black rounded-2xl overflow-hidden">
                <video ref={videoRef} playsInline muted controls={!!videoUrl} src={videoUrl || undefined} className="w-full h-[220px] object-cover bg-black" />
              </div>
              {!videoUrl && <p className="text-[12px] text-gray-500 mt-2">Please say: &quot;My name is [Your Name]. This is my Wasiyyah. I made it willingly and in sound mind on [Date].&quot;</p>}
              <div className="flex gap-2 mt-3">
                {!isRecording ? <button onClick={startRecording} className="flex-1 bg-red-600 text-white py-3 rounded-full font-bold text-sm">● Record Video</button> : <button onClick={stopRecording} className="flex-1 bg-black text-white py-3 rounded-full font-bold text-sm">■ Stop Recording</button>}
                <label className="flex-1 text-center bg-gray-100 py-3 rounded-full font-bold text-sm cursor-pointer text-black">Upload Video<input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" /></label>
              </div>
              {videoUrl && <p className="text-green-600 text-[12px] font-bold mt-2">✓ Video verification recorded.</p>}
              <Label>Witness 1 - Must Be An Adult Muslim</Label>
              <Input value={witness1Name} onChange={(e: any) => setWitness1Name(e.target.value)} placeholder="Witness 1 Full Name" />
              <div className="mt-2"><Input value={witness1Phone} onChange={(e: any) => setWitness1Phone(e.target.value)} placeholder="Witness 1 Phone Number" /></div>
              <Label>Witness 2 - Must Be An Adult Muslim</Label>
              <Input value={witness2Name} onChange={(e: any) => setWitness2Name(e.target.value)} placeholder="Witness 2 Full Name" />
              <div className="mt-2"><Input value={witness2Phone} onChange={(e: any) => setWitness2Phone(e.target.value)} placeholder="Witness 2 Phone Number" /></div>
              <Label>Executor</Label>
              <Input value={executorName} onChange={(e: any) => setExecutorName(e.target.value)} placeholder="Executor Full Name" />
              <div className="mt-2"><Input value={executorPhone} onChange={(e: any) => setExecutorPhone(e.target.value)} placeholder="Executor Phone Number" /></div>
              <Label>Backup Executor</Label>
              <Input value={backupExecutorName} onChange={(e: any) => setBackupExecutorName(e.target.value)} placeholder="Backup Executor Full Name" />
              <div className="mt-2"><Input value={backupExecutorPhone} onChange={(e: any) => setBackupExecutorPhone(e.target.value)} placeholder="Backup Executor Phone Number" /></div>
              <Label>Lawyer - Who Will Legalize This Wasiyyah?</Label>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setLawyerChoice('mine')} className={`py-3 rounded-xl border font-bold text-[13px] ${lawyerChoice === 'mine' ? 'bg-black text-white' : 'bg-white text-black'}`}>My Own Lawyer</button>
                <button onClick={() => setLawyerChoice('haqq')} className={`py-3 rounded-xl border font-bold text-[13px] ${lawyerChoice === 'haqq' ? 'bg-black text-white' : 'bg-white text-black'}`}>HAQQ Lawyer</button>
                <button onClick={() => setLawyerChoice('none')} className={`py-3 rounded-xl border font-bold text-[13px] ${lawyerChoice === 'none' ? 'bg-black text-white' : 'bg-white text-black'}`}>No Lawyer Yet</button>
              </div>
              {lawyerChoice === 'mine' && (
                <div className="mt-3 space-y-2">
                  <Input value={lawyerName} onChange={(e: any) => setLawyerName(e.target.value)} placeholder="Lawyer Full Name - e.g. Barr. Ahmed Musa" />
                  <Input value={lawyerFirm} onChange={(e: any) => setLawyerFirm(e.target.value)} placeholder="Law Firm - e.g. Musa & Co. Chambers" />
                  <div className="grid grid-cols-2 gap-2">
                    <Input value={lawyerPhone} onChange={(e: any) => setLawyerPhone(e.target.value)} placeholder="Lawyer Phone" />
                    <Input value={lawyerEmail} onChange={(e: any) => setLawyerEmail(e.target.value)} placeholder="Lawyer Email" />
                  </div>
                </div>
              )}
              {lawyerChoice === 'haqq' && (
               lawyerChoice === 'haqq' && (
  <div className="mt-3 space-y-2">
    <p className="text-[13px] font-bold text-black">Choose Your HAQQ Lawyer — ₦25,000</p>
    <p className="text-[12px] text-gray-600">Tap one lawyer. That lawyer go get notification immediately after you pay.</p>
    {HAQQ_LAWYERS.map((l) => (
      <button key={l.id} type="button" onClick={() => setSelectedLawyerId(l.id)}
        className={`w-full text-left p-3 rounded-xl border-2 ${selectedLawyerId === l.id ? 'border-black bg-yellow-50' : 'border-gray-200 bg-white'}`}>
        <p className="font-bold text-sm text-black">{l.name} {selectedLawyerId === l.id ? '✓ Selected' : ''}</p>
        <p className="text-[12px] text-gray-600">{l.specialty} • {l.city}</p>
        <p className="text-[12px] font-bold text-black">Fee: ₦25,000</p>
      </button>
    ))}
    <textarea value={haqqLawyerNote} onChange={(e) => setHaqqLawyerNote(e.target.value)} placeholder="Any note for the lawyer? e.g. I am in Kano..." className="w-full p-3 bg-white rounded-xl border text-black placeholder:text-gray-400 text-sm outline-none min-h-[70px]" />
    {!lawyerPaid ? (
      <button onClick={() => {
        if (!selectedLawyerId) return alert('Please select one lawyer first.')
        setLawyerPaid(true)
        const lawyer = HAQQ_LAWYERS.find(x => x.id === selectedLawyerId)
        const text = `Assalamu Alaikum ${lawyer?.name},\n\nNEW WASIYYAH ASSIGNED TO YOU ON HAQQ!\n\nClient: ${fullName || 'HAQQ User'}\nNet Estate: ${fmt(net)}\nCity: ${location || '-'}\nNote: ${haqqLawyerNote || 'No note'}\n\nPlease login to HAQQ Lawyer page with your code ${lawyer?.code} to review and start legal processing. Jazakum Allahu Khairan.`
        window.open(`https://wa.me/${lawyer?.phone}?text=${encodeURIComponent(text)}`, '_blank')
        alert(`Payment successful! ${lawyer?.name} don get notification on WhatsApp.`)
      }} className="w-full mt-2 bg-green-600 text-white py-3 rounded-full font-bold text-sm">
        Pay ₦25,000 - Notify {HAQQ_LAWYERS.find(x => x.id === selectedLawyerId)?.name || 'Lawyer'}
      </button>
    ) : <p className="text-green-600 font-bold text-sm mt-2 text-center">✓ Paid - {HAQQ_LAWYERS.find(x => x.id === selectedLawyerId)?.name} will contact you within 24 hours</p>}
  </div>
)
            }
              {lawyerChoice === 'none' && <p className="text-[12px] text-gray-500 mt-2">You can still save to Vault and take DRAFT to any lawyer later.</p>}
              <Label>Premium PDF - With HAQQ Seal</Label>
              <div className="flex justify-between items-center bg-yellow-50 p-3 rounded-xl">
                <div><p className="text-sm font-bold">Premium PDF</p><p className="text-[11px] text-gray-600">With HAQQ Verified Seal + Lawyer Signature Page</p></div>
                <button onClick={() => setIsPremium(!isPremium)} className={`px-4 py-2 rounded-full font-bold text-sm ${isPremium ? 'bg-black text-white' : 'bg-white text-black border'}`}>{isPremium ? '✓ Premium On' : 'Add Premium'}</button>
              </div>
              <Label>Declaration</Label>
              <label className="flex gap-3 items-start bg-gray-50 p-3 rounded-xl cursor-pointer">
                <input type="checkbox" checked={soundMind} onChange={(e) => setSoundMind(e.target.checked)} className="mt-1 w-4 h-4 accent-black" />
                <span className="text-[13px] font-medium leading-relaxed">I confirm that I am making this Wasiyyah willingly, in sound mind, and without pressure from anyone.</span>
              </label>
              <label className="flex gap-3 items-start bg-gray-50 p-3 rounded-xl cursor-pointer mt-2">
                <input type="checkbox" checked={declaration} onChange={(e) => setDeclaration(e.target.checked)} className="mt-1 w-4 h-4 accent-black" />
                <span className="text-[13px] font-medium leading-relaxed">I confirm that all the information in this Wasiyyah is true and correct, and I want it to be carried out according to Islamic Law after my death.</span>
              </label>
            </Q>
            <div className="bg-white rounded-[24px] p-5 text-black">
              <h3 className="font-extrabold">Summary</h3>
              <div className="text-sm space-y-1 mt-2">
                <div className="flex justify-between"><span>Net Estate</span><span className="font-bold">{fmt(net)}</span></div>
                <div className="flex justify-between"><span>Wasiyyah (One-Third)</span><span className="font-bold">{fmt(num(wasiyyahAmt))}</span></div>
                <div className="flex justify-between"><span>For Faraid</span><span className="font-bold">{fmt(faraidPool)}</span></div>
                <div className="flex justify-between"><span>Specific Gifts</span><span className="font-bold">{specificGifts.filter(g => g.item).length} item(s)</span></div>
                <div className="flex justify-between"><span>Guardian</span><span className="font-bold">{hasMinors === 'yes' ? guardianName || 'Added' : 'No Minors'}</span></div>
                <div className="flex justify-between"><span>Video Verification</span><span className="font-bold">{videoUrl ? 'Completed ✓' : 'Not Done'}</span></div>
                <div className="flex justify-between"><span>Witnesses</span><span className="font-bold">{witness1Name && witness2Name ? '2 Witnesses ✓' : 'Pending'}</span></div>
                <div className="flex justify-between"><span>Lawyer</span><span className="font-bold">{lawyerChoice === 'mine' ? lawyerName || 'My Lawyer' : lawyerChoice === 'haqq' ? (lawyerPaid ? 'HAQQ Lawyer - Paid ✓' : 'HAQQ Lawyer - Not Paid') : 'No Lawyer Yet'}</span></div>
                <div className="flex justify-between"><span>Next Review</span><span className="font-bold">{nextReview || '6 months after saving'}</span></div>
              </div>
              {versions.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="font-bold text-[13px]">Version History ({versions.length})</p>
                  {versions.slice(0, 3).map((v: any, i: number) => (<p key={i} className="text-[12px] text-gray-500">Version {versions.length - i} - {new Date(v.date).toLocaleDateString('en-NG')} - Net: {fmt(v.net)} {v.editReason ? `- ${v.editReason}` : ''}</p>))}
                </div>
              )}
            </div>
            <div className="bg-green-50 p-4 rounded-[20px] text-black text-center">
              <p className="font-extrabold">🔒 Your Wasiyyah Will Be Saved Securely In Your Vault</p>
              <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">It will NOT be downloaded to your phone. It will be stored in HAQQ Vault in Supabase. Only your Executor, Witnesses and Lawyer can access it after death verification with a Death Certificate.</p>
              <p className="text-[12px] font-bold mt-2">Status after saving: ACTIVE & LOCKED ✓</p>
            </div>
            <div className="flex flex-col gap-3">
              {vaultStatus === 'EDITING' ? (
                <button onClick={saveAndLockAgain} disabled={loadingSave} className="w-full py-3.5 rounded-full bg-yellow-400 text-black font-bold disabled:opacity-50">{loadingSave ? 'Saving...' : 'Save Changes & Lock Again 🔒'}</button>
              ) : (
                <button onClick={saveAll} disabled={loadingSave} className="w-full py-3.5 rounded-full bg-black text-white font-bold disabled:opacity-50">{loadingSave ? 'Saving...' : 'Save To My Vault - Lock My Wasiyyah'}</button>
              )}
              <button onClick={downloadDraftPDF} className="w-full py-3 rounded-full bg-white text-black font-bold text-sm border">Download DRAFT Copy (With DRAFT Watermark) - For Lawyer Review Only</button>
              <a href="/vault" className="block text-center py-3 rounded-full bg-[#0A1931] text-white font-bold text-sm">View My Vault →</a>
              <button onClick={() => setStep(4)} className="w-full py-3 rounded-full bg-white text-black font-bold">Back</button>
            </div>
            <Q title="Notify My Witnesses & Executor">
              <p className="text-[13px] text-gray-600 mt-1">After saving, tap to notify them on WhatsApp so they know they have been named.</p>
              <div className="grid grid-cols-1 gap-2 mt-3">
                {witness1Phone && <a href={waLink(witness1Phone)} target="_blank" className="block text-center bg-green-500 text-white py-3 rounded-full font-bold text-sm">Notify Witness 1 - {witness1Name} on WhatsApp</a>}
                {witness2Phone && <a href={waLink(witness2Phone)} target="_blank" className="block text-center bg-green-500 text-white py-3 rounded-full font-bold text-sm">Notify Witness 2 - {witness2Name} on WhatsApp</a>}
                {executorPhone && <a href={waLink(executorPhone)} target="_blank" className="block text-center bg-black text-white py-3 rounded-full font-bold text-sm">Notify Executor - {executorName} on WhatsApp</a>}
                {!witness1Phone && !witness2Phone && !executorPhone && <p className="text-gray-500 text-sm text-center">Add phone numbers for witnesses and executor to enable WhatsApp notification.</p>}
              </div>
            </Q>
            <a href="/report-death" className="block text-center bg-red-600 text-white py-3 rounded-full font-bold text-sm">Report Death - Release Wasiyyah</a>
          </>
        )}
      </div>
      {showUnlockModal && vaultStatus === 'ACTIVE_LOCKED' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-[24px] p-6 w-full max-w-[400px] text-black">
            <h3 className="font-extrabold text-[18px] text-center">Unlock To Edit 🔓</h3>
            <p className="text-[13px] text-gray-600 text-center mt-1">For security, enter your PIN + OTP. Only owner can unlock.</p>
            <label className="text-[11px] font-bold mt-4 block">WHY DO YOU WANT TO EDIT?</label>
            <select value={editReason} onChange={(e) => setEditReason(e.target.value)} className="w-full p-3 border rounded-xl mt-1 text-sm outline-none">
              <option value="">Select reason...</option>
              <option value="I got married / divorced">I got married / divorced</option>
              <option value="I had a new child">I had a new child</option>
              <option value="I bought new property / asset">I bought new property / asset</option>
              <option value="I paid off a debt">I paid off a debt</option>
              <option value="I want to change executor / guardian">I want to change executor / guardian</option>
              <option value="I want to change lawyer">I want to change lawyer</option>
              <option value="Other">Other</option>
            </select>
            <label className="text-[11px] font-bold mt-3 block">ENTER YOUR VAULT PIN</label>
            <input value={unlockPin} onChange={(e) => setUnlockPin(e.target.value)} placeholder="4-digit PIN" maxLength={4} inputMode="numeric" className="w-full p-3 border rounded-xl mt-1 text-center font-black tracking-widest outline-none" />
            <label className="text-[11px] font-bold mt-3 block">OTP VERIFICATION</label>
            <div className="flex gap-2 mt-1">
              <input value={unlockOtp} onChange={(e) => setUnlockOtp(e.target.value)} placeholder="6-digit OTP" maxLength={6} inputMode="numeric" className="flex-1 p-3 border rounded-xl text-center font-bold outline-none" />
              <button onClick={sendOtp} className="px-4 bg-[#0A1931] text-white rounded-xl font-bold text-sm">Send OTP</button>
            </div>
            {otpSent && <p className="text-[11px] text-green-600 mt-1">OTP sent to your registered phone.</p>}
            <button onClick={unlockToEdit} className="w-full mt-4 bg-black text-white py-3.5 rounded-full font-bold">Unlock & Start Editing</button>
            <button onClick={() => setShowUnlockModal(false)} className="w-full mt-2 py-3 rounded-full border font-bold text-sm">Cancel - Keep Locked</button>
          </div>
        </div>
      )}
    </div>
  )
                                             }                                                                                                                                                                 }                                                                                                                               }
