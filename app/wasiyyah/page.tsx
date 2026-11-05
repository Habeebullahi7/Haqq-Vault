'use client'
import { useState, useMemo, useEffect } from 'react'
import BottomNav from '../components/BottomNav'

// ===== FARAID ENGINE - QURAN 4:11-12, 4:176 =====
function calculateFaraid(args:any, pool:number){
  const { gender, marital, wivesAlive, husbandAlive, sons, daughters, sonsSons, sonsDaughters, fatherStatus, motherStatus, paternalGrandfather, paternalGrandmother, maternalGrandmother, fullBrothers, fullSisters, paternalBrothers, paternalSisters, maternalBrothers, maternalSisters } = args
  const hasChild = (sons+daughters+sonsSons+sonsDaughters)>0
  const totalSiblings = fullBrothers+fullSisters+paternalBrothers+paternalSisters+maternalBrothers+maternalSisters
  const isKalalah = !hasChild && fatherStatus!=='alive' && paternalGrandfather!=='alive'
  const hasFatherOrGrandfather = fatherStatus==='alive' || paternalGrandfather==='alive'
  let fixed:any[]=[]; let residuary:any[]=[]
  if(gender==='male' && marital==='married' && wivesAlive>0) fixed.push({heir: wivesAlive===1?'Wife':`${wivesAlive} Wives (share)`, num:1, den: hasChild?8:4, count:wivesAlive, perPerson:true, note: hasChild?'Quran 4:12 - With children 1/8':'Quran 4:12 - No children 1/4'})
  if(gender==='female' && marital==='married' && husbandAlive==='yes') fixed.push({heir:'Husband', num:1, den: hasChild?4:2, count:1, note: hasChild?'Quran 4:12 - 1/4':'Quran 4:12 - 1/2'})
  const spouseExists = (gender==='male' && marital==='married' && wivesAlive>0) || (gender==='female' && marital==='married' && husbandAlive==='yes')
  const isUmariyyatan = !hasChild && totalSiblings===0 && spouseExists && fatherStatus==='alive' && motherStatus==='alive'
  if(motherStatus==='alive'){
    if(isUmariyyatan) fixed.push({heir:'Mother', num:1, den:3, count:1, isUmari:true, note:'Umariyyatan - 1/3 of RESIDUE'})
    else if(hasChild || totalSiblings>=2) fixed.push({heir:'Mother', num:1, den:6, count:1, note:'Quran 4:11 - 1/6'})
    else fixed.push({heir:'Mother', num:1, den:3, count:1, note:'Quran 4:11 - 1/3'})
  } else {
    const gms=[]; if(paternalGrandmother==='alive') gms.push('Paternal Grandmother'); if(maternalGrandmother==='alive') gms.push('Maternal Grandmother')
    if(gms.length>0) fixed.push({heir:gms.join(' + ')+' (share)', num:1, den:6, count:gms.length, note:'Sunnah - Share 1/6'})
  }
  if(fatherStatus==='alive'){
    if(hasChild){ if(sons>0||sonsSons>0) fixed.push({heir:'Father', num:1, den:6, count:1, note:'Quran 4:11 - With son 1/6'}); else fixed.push({heir:'Father', num:1, den:6, count:1, isFatherWithDaughters:true, note:'Quran 4:11 - With daughters 1/6 + Residue'}) }
    else residuary.push({heir:'Father', parts:1, count:1, note:'Quran 4:11 - No child = Residue'})
  } else if(paternalGrandfather==='alive'){
    if(hasChild){ if(sons>0||sonsSons>0) fixed.push({heir:'Paternal Grandfather', num:1, den:6, count:1, note:'Like Father 1/6'}); else fixed.push({heir:'Paternal Grandfather', num:1, den:6, count:1, isFatherWithDaughters:true, note:'Like Father 1/6 + Residue'}) }
    else residuary.push({heir:'Paternal Grandfather', parts:1, count:1, note:'Like Father - Residue'})
  }
  if(daughters>0 && sons===0){
    if(daughters===1) fixed.push({heir:'Daughter', num:1, den:2, count:1, note:'Quran 4:11 - 1/2'})
    else fixed.push({heir:`${daughters} Daughters (share)`, num:2, den:3, count:daughters, perPerson:true, note:'Quran 4:11 - 2/3 shared'})
    if(sonsDaughters>0) fixed.push({heir:`${sonsDaughters} Son's Daughter(s)`, num:1, den:6, count:sonsDaughters, perPerson:true, note:'Bukhari 6736 - 1/6 to complete 2/3'})
  } else if(daughters===0 && sons===0 && sonsDaughters>0){
    if(sonsDaughters===1) fixed.push({heir:"Son's Daughter", num:1, den:2, count:1, note:'Like Daughter 1/2'})
    else fixed.push({heir:`${sonsDaughters} Son's Daughters`, num:2, den:3, count:sonsDaughters, perPerson:true, note:'2/3 shared'})
  }
  if(sons>0){ residuary.push({heir:'Sons', parts:2, count:sons, note:'Quran 4:11 - Son 2x Daughter'}); if(daughters>0) residuary.push({heir:'Daughters', parts:1, count:daughters, note:'With Son - Residuary'}) }
  else if(sonsSons>0 && daughters===0){ residuary.push({heir:"Son's Sons", parts:2, count:sonsSons, note:'Like Sons'}); if(sonsDaughters>0) residuary.push({heir:"Son's Daughters", parts:1, count:sonsDaughters, note:'Residue 2:1'}) }
  if(isKalalah){
    if(maternalBrothers+maternalSisters>0){ const t=maternalBrothers+maternalSisters; if(t===1) fixed.push({heir:'Maternal Sibling', num:1, den:6, count:1, note:'Quran 4:12 - 1/6'}); else fixed.push({heir:`${t} Maternal Siblings (share)`, num:1, den:3, count:t, perPerson:true, note:'Quran 4:12 - 1/3 shared equally'}) }
    if(fullBrothers>0||fullSisters>0){
      if(fullBrothers===0 && fullSisters===1) fixed.push({heir:'Full Sister', num:1, den:2, count:1, note:'Quran 4:176 - 1/2'})
      else if(fullBrothers===0) fixed.push({heir:`${fullSisters} Full Sisters`, num:2, den:3, count:fullSisters, perPerson:true, note:'Quran 4:176 - 2/3'})
      else { residuary.push({heir:'Full Brothers', parts:2, count:fullBrothers, note:'Quran 4:176 - Residue 2:1'}); if(fullSisters>0) residuary.push({heir:'Full Sisters', parts:1, count:fullSisters, note:'Residue'}) }
    } else if(paternalBrothers>0||paternalSisters>0){
      if(paternalBrothers===0 && paternalSisters===1) fixed.push({heir:'Paternal Sister', num:1, den:2, count:1, note:'Quran 4:176'})
      else if(paternalBrothers===0) fixed.push({heir:`${paternalSisters} Paternal Sisters`, num:2, den:3, count:paternalSisters, perPerson:true, note:'2/3'})
      else { residuary.push({heir:'Paternal Brothers', parts:2, count:paternalBrothers, note:'Residue'}); if(paternalSisters>0) residuary.push({heir:'Paternal Sisters', parts:1, count:paternalSisters, note:'Residue'}) }
    }
  }
  if(!isKalalah && daughters>0 && sons===0 && !hasFatherOrGrandfather && (fullSisters>0||paternalSisters>0)){
    if(fullSisters>0) residuary.push({heir:'Full Sister(s) - Asabah with Daughters', parts:1, count:fullSisters, note:'Bukhari 6736 - Residuary with Daughter'})
    else residuary.push({heir:'Paternal Sister(s) - Asabah', parts:1, count:paternalSisters, note:'Residuary'})
  }
  let results:any[]=[]
  if(isUmariyyatan){
    const spouse=fixed.find(f=>f.heir.includes('Wife')||f.heir==='Husband'); const mother=fixed.find(f=>f.heir==='Mother')
    if(spouse&&mother){ const sf=spouse.num/spouse.den; const res=1-sf; const mf=res*(1/3); const ff=res-mf
      results.push({heir:spouse.heir, fractionLabel:`${spouse.num}/${spouse.den}`, fraction:sf, amount:Math.round(pool*sf), note:spouse.note, count:spouse.count})
      results.push({heir:'Mother', fractionLabel:`1/3 of residue ${(mf*100).toFixed(1)}%`, fraction:mf, amount:Math.round(pool*mf), note:mother.note, count:1})
      results.push({heir:'Father', fractionLabel:`Residue ${(ff*100).toFixed(1)}%`, fraction:ff, amount:Math.round(pool*ff), note:'Umariyyatan - Father gets rest', count:1})
      return {results, isAwl:false, isRadd:false, isUmariyyatan:true, pool}
    }
  }
  let totalFixed = fixed.reduce((s,f)=>s+f.num/f.den,0)
  let isAwl=false; let awlFactor=1; if(totalFixed>1){ isAwl=true; awlFactor=1/totalFixed }
  fixed.forEach(f=>{ let frac=(f.num/f.den)*awlFactor; let amt=Math.round(pool*frac); results.push({heir:f.heir, fractionLabel:isAwl?`${f.num}/${f.den} → ${(frac*100).toFixed(1)}% (Awl)`:`${f.num}/${f.den}`, fraction:frac, amount:amt, note:f.note+(isAwl?' • Awl - reduced proportionally':''), count:f.count, perPersonAmount:f.perPerson&&f.count>1?Math.round(amt/f.count):null, isFatherWithDaughters:f.isFatherWithDaughters}) })
  let used = isAwl?1:totalFixed; let remaining=Math.max(0,1-used)
  const fatherFixed = results.find(r=>r.isFatherWithDaughters)
  if(residuary.length>0 && remaining>0 && !isAwl){
    let totalParts=0; residuary.forEach(r=>totalParts+=r.parts*r.count)
    residuary.forEach(r=>{ const gf=remaining*((r.parts*r.count)/totalParts); const ga=Math.round(pool*gf); results.push({heir:r.heir, fractionLabel:`Residue ${(gf*100).toFixed(1)}%`, fraction:gf, amount:ga, note:r.note, count:r.count, perPersonAmount:r.count>1?Math.round(ga/r.count):null}) })
    remaining=0
  } else if(fatherFixed && remaining>0 && !isAwl){ fatherFixed.amount+=Math.round(pool*remaining); fatherFixed.fraction+=remaining; fatherFixed.fractionLabel+=` + Residue ${(remaining*100).toFixed(1)}%`; fatherFixed.note+=' • Plus Residue'; remaining=0 }
  let isRadd=false
  if(remaining>0 && !isAwl){
    const nonSpouse = results.filter(r=>!r.heir.toLowerCase().includes('wife') && r.heir!=='Husband')
    if(nonSpouse.length>0){ isRadd=true; const tot=nonSpouse.reduce((s,r)=>s+r.fraction,0); nonSpouse.forEach(r=>{ const extra=remaining*(r.fraction/tot); r.amount+=Math.round(pool*extra); r.fraction+=extra; r.note+=' • Radd - leftover returned'; r.fractionLabel+=' + Radd' }); remaining=0 }
  }
  return {results, isAwl, isRadd, isUmariyyatan:false, pool, remaining}
}

export default function WasiyyahPage(){
  const [step,setStep]=useState(1)
  const [fullName,setFullName]=useState('')
  // VAULT SYNC
  const [vaultLoaded,setVaultLoaded]=useState(false)
  const [vaultDebts,setVaultDebts]=useState<any[]>([])
  const [vaultAssetsOwedToMe,setVaultAssetsOwedToMe]=useState(0)
  const [vaultNote,setVaultNote]=useState('')
  // ASSETS
  const [cashHome,setCashHome]=useState(''); const [bank1,setBank1]=useState(''); const [bank1Name,setBank1Name]=useState('GTB')
  const [bank2,setBank2]=useState(''); const [bank2Name,setBank2Name]=useState('')
  const [property,setProperty]=useState(''); const [propertyDesc,setPropertyDesc]=useState('')
  const [cars,setCars]=useState(''); const [business,setBusiness]=useState(''); const [businessDesc,setBusinessDesc]=useState('')
  const [gold,setGold]=useState(''); const [otherAssets,setOtherAssets]=useState(''); const [moneyOwedToMe,setMoneyOwedToMe]=useState('')
  const [docLocation,setDocLocation]=useState('') // where documents dey - from Vault
  // DEBTS
  const [funeralCost,setFuneralCost]=useState('50000'); const [debtsPeople,setDebtsPeople]=useState(''); const [debtsDetails,setDebtsDetails]=useState('')
  const [bankLoan,setBankLoan]=useState(''); const [mahrOwed,setMahrOwed]=useState(''); const [zakatOwed,setZakatOwed]=useState('')
  const [kaffarahOwed,setKaffarahOwed]=useState(''); const [rentOwed,setRentOwed]=useState(''); const [otherDebts,setOtherDebts]=useState('')
  // FAMILY
  const [gender,setGender]=useState<'male'|'female'|''>(''); const [marital,setMarital]=useState('')
  const [numWives,setNumWives]=useState(1); const [wivesAlive,setWivesAlive]=useState(1); const [wivesMuslim,setWivesMuslim]=useState('all-muslim')
  const [husbandAlive,setHusbandAlive]=useState(''); const [husbandMuslim,setHusbandMuslim]=useState('')
  const [sons,setSons]=useState(0); const [daughters,setDaughters]=useState(0); const [sonsSons,setSonsSons]=useState(0); const [sonsDaughters,setSonsDaughters]=useState(0)
  const [daughtersChildren,setDaughtersChildren]=useState(0); const [adoptedChildren,setAdoptedChildren]=useState(0); const [stepChildren,setStepChildren]=useState(0)
  const [fatherStatus,setFatherStatus]=useState(''); const [motherStatus,setMotherStatus]=useState('')
  const [paternalGrandfather,setPaternalGrandfather]=useState(''); const [paternalGrandmother,setPaternalGrandmother]=useState(''); const [maternalGrandmother,setMaternalGrandmother]=useState('')
  const [fullBrothers,setFullBrothers]=useState(0); const [fullSisters,setFullSisters]=useState(0); const [paternalBrothers,setPaternalBrothers]=useState(0); const [paternalSisters,setPaternalSisters]=useState(0); const [maternalBrothers,setMaternalBrothers]=useState(0); const [maternalSisters,setMaternalSisters]=useState(0)
  const [anyHeirNonMuslim,setAnyHeirNonMuslim]=useState(''); const [nonMuslimName,setNonMuslimName]=useState('')
  // WASIYYAH BEQUESTS
  const [bequests,setBequests]=useState([{name:'',relation:'',amount:'',assetType:'Cash',note:''}])
  // LAWYER
  const [lawyerOption,setLawyerOption]=useState<'my-lawyer'|'haqq-lawyer'|'later'|''>(''); const [lawyerName,setLawyerName]=useState(''); const [lawyerPhone,setLawyerPhone]=useState(''); const [lawyerEmail,setLawyerEmail]=useState(''); const [lawyerChamber,setLawyerChamber]=useState(''); const [lawyerNBA,setLawyerNBA]=useState(''); const [selectedHaqqLawyer,setSelectedHaqqLawyer]=useState(''); const [lawyerStatus,setLawyerStatus]=useState('Not Submitted')
  const [homeAddress,setHomeAddress]=useState(''); const [workAddress,setWorkAddress]=useState(''); const [handoverVenue,setHandoverVenue]=useState('Lawyer Chamber'); const [handoverNote,setHandoverNote]=useState('')
  // WITNESSES
  const [witness1Name,setWitness1Name]=useState(''); const [witness1Phone,setWitness1Phone]=useState(''); const [witness1WhatsApp,setWitness1WhatsApp]=useState(''); const [witness1Email,setWitness1Email]=useState(''); const [witness1Relation,setWitness1Relation]=useState(''); const [witness1Address,setWitness1Address]=useState('')
  const [witness2Name,setWitness2Name]=useState(''); const [witness2Phone,setWitness2Phone]=useState(''); const [witness2WhatsApp,setWitness2WhatsApp]=useState(''); const [witness2Email,setWitness2Email]=useState(''); const [witness2Relation,setWitness2Relation]=useState(''); const [witness2Address,setWitness2Address]=useState('')
  const [checkInDays,setCheckInDays]=useState(30); const [lastCheckIn,setLastCheckIn]=useState(''); const [emergencyContact,setEmergencyContact]=useState('')
  // EXECUTOR
  const [executor,setExecutor]=useState(''); const [executorPhone,setExecutorPhone]=useState('')
  // VIDEO
  const [videoPreview,setVideoPreview]=useState(''); const [videoConfirmed,setVideoConfirmed]=useState(false); const [videoDate,setVideoDate]=useState('')
  const [message,setMessage]=useState('Bury me according to Sunnah. Pay my debts quickly. Forgive me for any Haqq I forgot.')

  const haqqLawyers=[
    {id:'law1', name:'Barr. Ahmad Musa - Ilorin', specialty:'Islamic Wills / Shariah', fee:'₦50,000', phone:'+234 800 000 0001', rating:'4.9 - 120 Wills'},
    {id:'law2', name:'Barr. Fatimah Bello - Lagos', specialty:'Family Law / Wills Act', fee:'₦75,000', phone:'+234 800 000 0002', rating:'4.8 - 95 Wills'},
    {id:'law3', name:'Barr. Yusuf Adeyemi - Ibadan', specialty:'Islamic Estate / Faraid', fee:'₦40,000', phone:'+234 800 000 0003', rating:'5.0 - 80 Wills'},
  ]

  // ===== LOAD VAULT =====
  useEffect(()=>{
    try{
      const v = localStorage.getItem('haqq_vault')
      if(v){
        const vault = JSON.parse(v)
        // Vault shape: { debts: [{to, amount, type}], mahr, zakat, kaffarah, moneyOwedToMe, docs }
        const debts = vault.debts || []
        setVaultDebts(debts)
        const totalVaultDebts = debts.reduce((s:any,d:any)=> s + (Number(d.amount)||0),0)
        const vaultMahr = Number(vault.mahrOwed||0); const vaultZakat = Number(vault.zakatOwed||0); const vaultKaff = Number(vault.kaffarahOwed||0)
        if(totalVaultDebts>0) setDebtsPeople(String(totalVaultDebts))
        if(debts.length>0) setDebtsDetails(debts.map((d:any)=>`${d.to}: ₦${d.amount}`).join(', '))
        if(vaultMahr>0) setMahrOwed(String(vaultMahr))
        if(vaultZakat>0) setZakatOwed(String(vaultZakat))
        if(vaultKaff>0) setKaffarahOwed(String(vaultKaff))
        if(vault.moneyOwedToMe) { setMoneyOwedToMe(String(vault.moneyOwedToMe)); setVaultAssetsOwedToMe(Number(vault.moneyOwedToMe)) }
        if(vault.docLocation) setDocLocation(vault.docLocation)
        if(vault.fullName) setFullName(vault.fullName)
        setVaultNote(`Vault loaded: ${debts.length} debts, Mahr ₦${vaultMahr}, Zakat ₦${vaultZakat}, Money owed to you ₦${vault.moneyOwedToMe||0}`)
        setVaultLoaded(true)
      }
    }catch(e){}
  },[])

  const toNum=(v:string)=> Number(String(v).replace(/[^0-9]/g,''))||0
  const totalAssets = toNum(cashHome)+toNum(bank1)+toNum(bank2)+toNum(property)+toNum(cars)+toNum(business)+toNum(gold)+toNum(otherAssets)+toNum(moneyOwedToMe)
  const totalDebts = toNum(funeralCost)+toNum(debtsPeople)+toNum(bankLoan)+toNum(mahrOwed)+toNum(zakatOwed)+toNum(kaffarahOwed)+toNum(rentOwed)+toNum(otherDebts)
  const netEstate = Math.max(0, totalAssets-totalDebts)
  const maxWasiyyah = Math.floor(netEstate/3)
  const totalBequests = bequests.reduce((s,b)=>s+toNum(b.amount),0)
  const faraidPool = Math.max(0, netEstate-totalBequests)
  const remainingWasiyyah = maxWasiyyah-totalBequests

  const faraid = useMemo(()=> calculateFaraid({gender,marital,wivesAlive,husbandAlive,sons,daughters,sonsSons,sonsDaughters,fatherStatus,motherStatus,paternalGrandfather,paternalGrandmother,maternalGrandmother,fullBrothers,fullSisters,paternalBrothers,paternalSisters,maternalBrothers,maternalSisters}, faraidPool), [gender,marital,wivesAlive,husbandAlive,sons,daughters,sonsSons,sonsDaughters,fatherStatus,motherStatus,paternalGrandfather,paternalGrandmother,maternalGrandmother,fullBrothers,fullSisters,paternalBrothers,paternalSisters,maternalBrothers,maternalSisters,faraidPool])

  const Q=({title,children}:any)=>(<div className="bg-white text-black rounded-[24px] p-6 space-y-3"><h3 className="font-bold">{title}</h3>{children}</div>)
  const Btn=({active,onClick,children}:any)=>(<button onClick={onClick} className={`p-3 rounded-xl border font-bold text-sm ${active?'bg-black text-white':'bg-gray-50'}`}>{children}</button>)
  const Input=({value,onChange,placeholder}:any)=>(<input value={value} onChange={onChange} placeholder={placeholder} className="w-full p-3 bg-gray-50 rounded-xl border" />)
  const LiveBar=()=>(
    <div className="p-4 bg-[#0a1628] text-white rounded-xl space-y-1">
      <div className="flex justify-between text-sm"><span>Assets</span><b>₦{totalAssets.toLocaleString()}</b></div>
      <div className="flex justify-between text-sm text-red-300"><span>Debts (Vault + Manual)</span><span>- ₦{totalDebts.toLocaleString()}</span></div>
      <div className="flex justify-between text-sm pt-1 border-t border-white/20"><span>NET</span><b>₦{netEstate.toLocaleString()}</b></div>
      <div className="flex justify-between text-sm"><span>Wasiyyah</span><b className="text-[#D4AF37]">₦{totalBequests.toLocaleString()} / ₦{maxWasiyyah.toLocaleString()}</b></div>
      <div className="flex justify-between text-sm"><span>Faraid Pool</span><b className="text-green-400">₦{faraidPool.toLocaleString()}</b></div>
      {faraid.isAwl && <p className="text-[11px] text-amber-300">⚖️ Awl Applied - Shares reduced proportionally</p>}
      {faraid.isRadd && <p className="text-[11px] text-blue-300">↩️ Radd Applied - Leftover returned</p>}
      {faraid.isUmariyyatan && <p className="text-[11px] text-purple-300">👑 Umariyyatan - Mother 1/3 of residue</p>}
    </div>
  )
  const handleVideoUpload=(e:any)=>{ const file=e.target.files[0]; if(!file) return; if(file.size>100*1024*1024) return alert('Video too big - max 100MB'); setVideoPreview(URL.createObjectURL(file)); setVideoDate(new Date().toLocaleString()); setVideoConfirmed(true) }
  const submitForLegalBinding=()=>{
    if(lawyerOption==='my-lawyer' && (!lawyerName||!lawyerPhone)) return alert('Put lawyer name + phone')
    if(lawyerOption==='haqq-lawyer' && !selectedHaqqLawyer) return alert('Pick Haqq lawyer')
    if(!witness1Name||!witness1Phone||!witness2Name||!witness2Phone) return alert('Put 2 witnesses with phone')
    if(!videoConfirmed) return alert('Upload Video Confirmation first')
    if(!homeAddress) return alert('Put Home Address - delegate go need am')
    setLawyerStatus('Pending Lawyer Review - Lawyer go contact you in 24hrs')
    localStorage.setItem('haqq_wasiyyah_full', JSON.stringify({fullName,totalAssets,totalDebts,netEstate,maxWasiyyah,totalBequests,faraidPool,bequests,faraid:faraid.results, vaultDebts, vaultNote, docLocation, lawyerOption, lawyerName, lawyerPhone, lawyerEmail, lawyerChamber, lawyerNBA, selectedHaqqLawyer, homeAddress, workAddress, handoverVenue, witness1:{name:witness1Name,phone:witness1Phone,whatsapp:witness1WhatsApp,email:witness1Email,relation:witness1Relation,address:witness1Address}, witness2:{name:witness2Name,phone:witness2Phone,whatsapp:witness2WhatsApp,email:witness2Email,relation:witness2Relation,address:witness2Address}, checkInDays, emergencyContact, executor, executorPhone, videoDate, message}))
    alert('Submitted! Lawyer go contact you. Witnesses go receive SMS. Alive Check go start.')
  }

  return (
    <div className="min-h-screen bg-[#0a1628] text-white p-4 pb-[110px]">
      <div className="max-w-[520px] mx-auto space-y-4">
        <div className="bg-white text-black rounded-[24px] p-6">
          <p className="text-[11px] tracking-widest opacity-50">WASIYYAH • LIVE FARAID • VAULT SYNC • LAWYER + WITNESSES + VIDEO</p>
          <h1 className="text-2xl font-black mt-1">My Wasiyyah</h1>
          <p className="text-sm opacity-70 mt-1">Assets → Debts (from Vault) → Family → Wasiyyah → Lawyer + Witnesses + Video → Delegate Verification</p>
          <div className="mt-4"><LiveBar /></div>
          <div className="flex gap-1.5 mt-4 overflow-x-auto pb-1">
            {[1,2,3,4,5,6].map(n=>(<button key={n} onClick={()=>setStep(n)} className={`shrink-0 px-3 py-2 rounded-full text-[11px] font-bold ${step===n?'bg-black text-white':'bg-gray-100'}`}>{n}. {['Assets','Debts','Family','Faraid','Wasiyyah','Legal'][n-1]}</button>))}
          </div>
        </div>

        {step===1 && (
          <Q title="STEP 1 - Declare Your Whole Assets">
            <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Your Full Name" className="w-full p-3 bg-gray-50 rounded-xl border font-bold" />
            <p className="text-xs font-bold">💵 CASH & BANK</p>
            <Input value={cashHome} onChange={(e:any)=>setCashHome(e.target.value)} placeholder="Cash at home ₦" />
            <div className="grid grid-cols-2 gap-2"><input value={bank1Name} onChange={e=>setBank1Name(e.target.value)} placeholder="Bank 1 Name" className="p-3 bg-gray-50 rounded-xl border text-sm" /><input value={bank1} onChange={e=>setBank1(e.target.value)} placeholder="Bank 1 ₦" className="p-3 bg-gray-50 rounded-xl border" /></div>
            <div className="grid grid-cols-2 gap-2"><input value={bank2Name} onChange={e=>setBank2Name(e.target.value)} placeholder="Bank 2 Name" className="p-3 bg-gray-50 rounded-xl border text-sm" /><input value={bank2} onChange={e=>setBank2(e.target.value)} placeholder="Bank 2 ₦" className="p-3 bg-gray-50 rounded-xl border" /></div>
            <p className="text-xs font-bold">🏠 PROPERTY & CARS</p>
            <Input value={propertyDesc} onChange={(e:any)=>setPropertyDesc(e.target.value)} placeholder="Property - e.g. House Ibadan" />
            <Input value={property} onChange={(e:any)=>setProperty(e.target.value)} placeholder="Property Worth ₦" />
            <Input value={cars} onChange={(e:any)=>setCars(e.target.value)} placeholder="Cars Worth ₦" />
            <p className="text-xs font-bold">🏪 BUSINESS & OTHER</p>
            <Input value={businessDesc} onChange={(e:any)=>setBusinessDesc(e.target.value)} placeholder="Business Description" />
            <Input value={business} onChange={(e:any)=>setBusiness(e.target.value)} placeholder="Business Worth ₦" />
            <Input value={gold} onChange={(e:any)=>setGold(e.target.value)} placeholder="Gold Worth ₦" />
            <Input value={otherAssets} onChange={(e:any)=>setOtherAssets(e.target.value)} placeholder="Other Assets ₦" />
            <p className="text-xs font-bold">💰 MONEY PEOPLE OWE YOU (From Vault)</p>
            <Input value={moneyOwedToMe} onChange={(e:any)=>setMoneyOwedToMe(e.target.value)} placeholder="People owe you ₦" />
            {vaultLoaded && <p className="text-[11px] bg-green-50 p-2 rounded-lg">✅ Vault Synced: {vaultNote}</p>}
            <p className="text-xs font-bold">📄 WHERE DOCUMENTS DEY</p>
            <Input value={docLocation} onChange={(e:any)=>setDocLocation(e.target.value)} placeholder="e.g. Land papers inside blue box for wardrobe, Bank papers with wife" />
            <LiveBar />
            <button onClick={()=>setStep(2)} className="w-full py-3.5 bg-[#D4AF37] text-black rounded-xl font-bold">Next → Debts (Vault)</button>
          </Q>
        )}

        {step===2 && (
          <Q title="STEP 2 - Debts You Owe Outside (Pulled From Vault)">
            <p className="text-xs opacity-60">Debts MUST be paid first - Quran 4:11. Vault debts don auto-enter here. Check am, add if e miss.</p>
            {vaultLoaded && <div className="p-3 bg-blue-50 rounded-xl"><p className="text-xs font-bold">From Your Vault:</p>{vaultDebts.map((d:any,i:number)=>(<p key={i} className="text-xs">• {d.to} - ₦{Number(d.amount).toLocaleString()} ({d.type||'Debt'})</p>))}<p className="text-[11px] opacity-60">{vaultNote}</p></div>}
            <Input value={funeralCost} onChange={(e:any)=>setFuneralCost(e.target.value)} placeholder="Funeral ₦" />
            <Input value={debtsPeople} onChange={(e:any)=>setDebtsPeople(e.target.value)} placeholder="Debts to People (Vault) ₦" />
            <Input value={debtsDetails} onChange={(e:any)=>setDebtsDetails(e.target.value)} placeholder="Who? e.g. Musa ₦50k" />
            <Input value={bankLoan} onChange={(e:any)=>setBankLoan(e.target.value)} placeholder="Bank Loan ₦" />
            <Input value={rentOwed} onChange={(e:any)=>setRentOwed(e.target.value)} placeholder="Rent Owed ₦" />
            <Input value={mahrOwed} onChange={(e:any)=>setMahrOwed(e.target.value)} placeholder="Unpaid Mahr ₦ - from Vault" />
            <Input value={zakatOwed} onChange={(e:any)=>setZakatOwed(e.target.value)} placeholder="Unpaid Zakat ₦ - from Vault" />
            <Input value={kaffarahOwed} onChange={(e:any)=>setKaffarahOwed(e.target.value)} placeholder="Kaffarah ₦" />
            <Input value={otherDebts} onChange={(e:any)=>setOtherDebts(e.target.value)} placeholder="Other Debts ₦" />
            <LiveBar />
            <div className="flex gap-2"><button onClick={()=>setStep(1)} className="flex-1 py-3 border rounded-xl font-bold">← Assets</button><button onClick={()=>setStep(3)} className="flex-[2] py-3 bg-[#D4AF37] text-black rounded-xl font-bold">Next → Family</button></div>
          </Q>
        )}

        {step===3 && (
          <div className="space-y-4">
            <Q title="STEP 3A - Man or Woman? Marriage?">
              <div className="grid grid-cols-2 gap-2"><Btn active={gender==='male'} onClick={()=>setGender('male')}>👨 Man</Btn><Btn active={gender==='female'} onClick={()=>setGender('female')}>👩 Woman</Btn></div>
              <div className="grid grid-cols-2 gap-2"><Btn active={marital==='married'} onClick={()=>setMarital('married')}>Married</Btn><Btn active={marital==='widowed'} onClick={()=>setMarital('widowed')}>Widowed</Btn><Btn active={marital==='divorced'} onClick={()=>setMarital('divorced')}>Divorced</Btn><Btn active={marital==='single'} onClick={()=>setMarital('single')}>Single</Btn></div>
              {gender==='male' && marital==='married' && (<><label className="text-xs font-bold">How many wives?</label><input type="number" value={numWives} onChange={e=>setNumWives(Number(e.target.value))} className="w-full p-3 bg-gray-50 rounded-xl border" /><label className="text-xs font-bold">How many alive?</label><input type="number" value={wivesAlive} onChange={e=>setWivesAlive(Number(e.target.value))} className="w-full p-3 bg-gray-50 rounded-xl border" /><p className="text-[11px] bg-amber-50 p-2 rounded-lg">All wives SHARE 1/8 (with children) or 1/4 (no children).</p></>)}
              {gender==='female' && marital==='married' && (<><label className="text-xs font-bold">Husband alive?</label><div className="grid grid-cols-2 gap-2"><Btn active={husbandAlive==='yes'} onClick={()=>setHusbandAlive('yes')}>Yes</Btn><Btn active={husbandAlive==='no'} onClick={()=>setHusbandAlive('no')}>No</Btn></div></>)}
            </Q>
            <Q title="STEP 3B - Children">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold">Sons</label><input type="number" value={sons} onChange={e=>setSons(Number(e.target.value))} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border" /></div>
                <div><label className="text-xs font-bold">Daughters</label><input type="number" value={daughters} onChange={e=>setDaughters(Number(e.target.value))} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border" /></div>
                <div><label className="text-xs font-bold">Son's Sons</label><input type="number" value={sonsSons} onChange={e=>setSonsSons(Number(e.target.value))} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border" /></div>
                <div><label className="text-xs font-bold">Son's Daughters</label><input type="number" value={sonsDaughters} onChange={e=>setSonsDaughters(Number(e.target.value))} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border" /></div>
                <div><label className="text-xs font-bold">Daughter's Children (NOT heir)</label><input type="number" value={daughtersChildren} onChange={e=>setDaughtersChildren(Number(e.target.value))} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border" /></div>
                <div><label className="text-xs font-bold">Adopted (NOT heir)</label><input type="number" value={adoptedChildren} onChange={e=>setAdoptedChildren(Number(e.target.value))} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border" /></div>
              </div>
              <div><label className="text-xs font-bold">Step-Children?</label><input type="number" value={stepChildren} onChange={e=>setStepChildren(Number(e.target.value))} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border" /></div>
            </Q>
            <Q title="STEP 3C - Parents - Both? Only Mother? Only Father?">
              <label className="text-xs font-bold">Father alive?</label>
              <div className="grid grid-cols-3 gap-2"><Btn active={fatherStatus==='alive'} onClick={()=>setFatherStatus('alive')}>Yes</Btn><Btn active={fatherStatus==='dead'} onClick={()=>setFatherStatus('dead')}>Dead</Btn><Btn active={fatherStatus==='' } onClick={()=>setFatherStatus('')}>Skip</Btn></div>
              {fatherStatus==='dead' && (<><label className="text-xs font-bold">Paternal Grandfather alive?</label><div className="grid grid-cols-2 gap-2"><Btn active={paternalGrandfather==='alive'} onClick={()=>setPaternalGrandfather('alive')}>Yes</Btn><Btn active={paternalGrandfather==='dead'} onClick={()=>setPaternalGrandfather('dead')}>No</Btn></div></>)}
              <label className="text-xs font-bold">Mother alive?</label>
              <div className="grid grid-cols-3 gap-2"><Btn active={motherStatus==='alive'} onClick={()=>setMotherStatus('alive')}>Yes</Btn><Btn active={motherStatus==='dead'} onClick={()=>setMotherStatus('dead')}>Dead</Btn><Btn active={motherStatus==='' } onClick={()=>setMotherStatus('')}>Skip</Btn></div>
              {motherStatus==='dead' && (<><label className="text-xs font-bold">Paternal Grandmother alive?</label><div className="grid grid-cols-2 gap-2"><Btn active={paternalGrandmother==='alive'} onClick={()=>setPaternalGrandmother('alive')}>Yes</Btn><Btn active={paternalGrandmother==='dead'} onClick={()=>setPaternalGrandmother('dead')}>No</Btn></div><label className="text-xs font-bold">Maternal Grandmother alive?</label><div className="grid grid-cols-2 gap-2"><Btn active={maternalGrandmother==='alive'} onClick={()=>setMaternalGrandmother('alive')}>Yes</Btn><Btn active={maternalGrandmother==='dead'} onClick={()=>setMaternalGrandmother('dead')}>No</Btn></div></>)}
              <p className="text-[11px] bg-blue-50 p-2 rounded-lg"><b>Your case:</b> {fatherStatus==='alive' && motherStatus==='alive' ? 'Both Parents Alive' : fatherStatus==='alive' ? 'Only Father Alive' : motherStatus==='alive' ? 'Only Mother Alive' : 'Both Dead - Check Grandparents'}</p>
            </Q>
            <Q title="STEP 3D - Siblings + Impediments">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-bold">Full Brothers</label><input type="number" value={fullBrothers} onChange={e=>setFullBrothers(Number(e.target.value))} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border" /></div>
                <div><label className="text-xs font-bold">Full Sisters</label><input type="number" value={fullSisters} onChange={e=>setFullSisters(Number(e.target.value))} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border" /></div>
                <div><label className="text-xs font-bold">Paternal Brothers</label><input type="number" value={paternalBrothers} onChange={e=>setPaternalBrothers(Number(e.target.value))} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border" /></div>
                <div><label className="text-xs font-bold">Paternal Sisters</label><input type="number" value={paternalSisters} onChange={e=>setPaternalSisters(Number(e.target.value))} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border" /></div>
                <div><label className="text-xs font-bold">Maternal Brothers</label><input type="number" value={maternalBrothers} onChange={e=>setMaternalBrothers(Number(e.target.value))} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border" /></div>
                <div><label className="text-xs font-bold">Maternal Sisters</label><input type="number" value={maternalSisters} onChange={e=>setMaternalSisters(Number(e.target.value))} className="w-full mt-1 p-3 bg-gray-50 rounded-xl border" /></div>
              </div>
              <label className="text-xs font-bold">Any heir NOT Muslim?</label>
              <div className="grid grid-cols-2 gap-2"><Btn active={anyHeirNonMuslim==='yes'} onClick={()=>setAnyHeirNonMuslim('yes')}>Yes</Btn><Btn active={anyHeirNonMuslim==='no'} onClick={()=>setAnyHeirNonMuslim('no')}>No</Btn></div>
              {anyHeirNonMuslim==='yes' && <Input value={nonMuslimName} onChange={(e:any)=>setNonMuslimName(e.target.value)} placeholder="Who? e.g. Brother Musa - Christian - fit collect Wasiyyah only" />}
              <LiveBar />
            </Q>
            <div className="flex gap-2"><button onClick={()=>setStep(2)} className="flex-1 py-3 bg-white text-black rounded-xl font-bold">← Debts</button><button onClick={()=>setStep(4)} className="flex-[2] py-3 bg-[#D4AF37] text-black rounded-xl font-bold">Next → Live Faraid</button></div>
          </div>
        )}

        {step===4 && (
          <div className="space-y-4">
            <div className="bg-white text-black rounded-[24px] p-6">
              <h3 className="font-bold">✅ LIVE FARAID - From ₦{faraidPool.toLocaleString()} Pool</h3>
              <p className="text-xs opacity-60">Pool = NET ₦{netEstate.toLocaleString()} - Wasiyyah ₦{totalBequests.toLocaleString()}</p>
              <div className="mt-3"><LiveBar /></div>
              {faraid.results.length===0 ? <p className="text-sm mt-3 opacity-60">Fill Family to see shares.</p> : (
                <div className="mt-4 space-y-2">
                  {faraid.results.map((r:any,i:number)=>(
                    <div key={i} className="p-3 bg-gray-50 rounded-xl border">
                      <div className="flex justify-between"><b className="text-sm">{r.heir}</b><b className="text-sm">₦{r.amount.toLocaleString()}</b></div>
                      <p className="text-[11px] opacity-70">Share: {r.fractionLabel} • {(r.fraction*100).toFixed(1)}%</p>
                      {r.perPersonAmount && <p className="text-[11px] text-blue-700 font-bold">Each: ₦{r.perPersonAmount.toLocaleString()}</p>}
                      <p className="text-[11px] opacity-60">{r.note}</p>
                    </div>
                  ))}
                  <div className="p-3 bg-green-50 rounded-xl"><p className="text-sm font-bold">Total: ₦{faraid.results.reduce((s:any,r:any)=>s+r.amount,0).toLocaleString()} / ₦{faraidPool.toLocaleString()}</p></div>
                </div>
              )}
            </div>
            <div className="flex gap-2"><button onClick={()=>setStep(3)} className="flex-1 py-3 bg-white text-black rounded-xl font-bold">← Family</button><button onClick={()=>setStep(5)} className="flex-[2] py-3 bg-[#D4AF37] text-black rounded-xl font-bold">Next → Share Wasiyyah</button></div>
          </div>
        )}

        {step===5 && (
          <Q title="STEP 5 - Share Wasiyyah From Balance">
            <LiveBar />
            {totalBequests > maxWasiyyah && <p className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold">❌ You don pass 1/3! Reduce or heirs must agree after death.</p>}
            <p className="text-xs font-bold">Who go collect Wasiyyah? (Non-Heirs Only)</p>
            {bequests.map((b,i)=>(
              <div key={i} className="p-3 bg-gray-50 rounded-xl border space-y-2">
                <Input value={b.name} onChange={(e:any)=>{ const n=[...bequests]; n[i].name=e.target.value; setBequests(n)}} placeholder="Name - e.g. Masjid, Adopted Son" />
                <Input value={b.relation} onChange={(e:any)=>{ const n=[...bequests]; n[i].relation=e.target.value; setBequests(n)}} placeholder="Relation - Adopted, Charity, Friend" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={b.assetType} onChange={e=>{ const n=[...bequests]; n[i].assetType=e.target.value; setBequests(n)}} className="p-3 bg-white rounded-xl border font-bold text-sm"><option>Cash</option><option>Bank Money</option><option>Property / Land</option><option>Car</option><option>Business Share</option><option>Gold</option></select>
                  <input value={b.amount} onChange={e=>{ const n=[...bequests]; n[i].amount=e.target.value; setBequests(n)}} placeholder="Amount ₦" className="p-3 bg-white rounded-xl border" />
                </div>
                <Input value={b.note} onChange={(e:any)=>{ const n=[...bequests]; n[i].note=e.target.value; setBequests(n)}} placeholder="Note" />
              </div>
            ))}
            <button onClick={()=>setBequests([...bequests,{name:'',relation:'',amount:'',assetType:'Cash',note:''}])} className="w-full py-3 border border-dashed rounded-xl font-bold">+ Add Another</button>
            <p className="text-xs font-bold">LIVE FARAID AFTER WASIYYAH</p>
            <div className="space-y-2">{faraid.results.map((r:any,i:number)=>(<div key={i} className="flex justify-between p-3 bg-green-50 rounded-xl"><span className="text-sm font-bold">{r.heir} <span className="font-normal opacity-60">({r.fractionLabel})</span></span><b className="text-sm">₦{r.amount.toLocaleString()}</b></div>))}</div>
            <div className="flex gap-2"><button onClick={()=>setStep(4)} className="flex-1 py-3 border rounded-xl font-bold">← Faraid</button><button onClick={()=>setStep(6)} className="flex-[2] py-3 bg-[#D4AF37] text-black rounded-xl font-bold">Next → Lawyer + Witnesses + Video</button></div>
          </Q>
        )}

        {step===6 && (
          <div className="space-y-4">
            <div className="bg-white text-black rounded-[24px] p-6 space-y-3">
              <h3 className="font-bold">STEP 6A - Lawyer - Make am Legally Binding</h3>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={()=>setLawyerOption('my-lawyer')} className={`p-3 rounded-xl border font-bold text-sm ${lawyerOption==='my-lawyer'?'bg-black text-white':'bg-gray-50'}`}>I Get My Lawyer</button>
                <button onClick={()=>setLawyerOption('haqq-lawyer')} className={`p-3 rounded-xl border font-bold text-sm ${lawyerOption==='haqq-lawyer'?'bg-black text-white':'bg-gray-50'}`}>Provide Lawyer</button>
                <button onClick={()=>setLawyerOption('later')} className={`p-3 rounded-xl border font-bold text-sm ${lawyerOption==='later'?'bg-black text-white':'bg-gray-50'}`}>Do Am Later</button>
              </div>
              {lawyerOption==='my-lawyer' && (<div className="space-y-2"><Input value={lawyerName} onChange={(e:any)=>setLawyerName(e.target.value)} placeholder="Lawyer Name - Barr. ..." /><Input value={lawyerPhone} onChange={(e:any)=>setLawyerPhone(e.target.value)} placeholder="Lawyer Phone" /><Input value={lawyerEmail} onChange={(e:any)=>setLawyerEmail(e.target.value)} placeholder="Lawyer Email" /><Input value={lawyerChamber} onChange={(e:any)=>setLawyerChamber(e.target.value)} placeholder="Chamber / Firm" /><Input value={lawyerNBA} onChange={(e:any)=>setLawyerNBA(e.target.value)} placeholder="NBA Number" /></div>)}
              {lawyerOption==='haqq-lawyer' && (<div className="space-y-2">{haqqLawyers.map(l=>(<div key={l.id} onClick={()=>setSelectedHaqqLawyer(l.id)} className={`p-4 rounded-xl border cursor-pointer ${selectedHaqqLawyer===l.id?'border-black bg-gray-50':'bg-white'}`}><div className="flex justify-between"><b className="text-sm">{l.name}</b><b className="text-sm text-[#D4AF37]">{l.fee}</b></div><p className="text-[11px] opacity-70">{l.specialty} • {l.rating}</p><p className="text-[11px] opacity-60">{l.phone}</p><p className="text-[11px]">{selectedHaqqLawyer===l.id?'✅ Selected':'Tap to select'}</p></div>))}</div>)}
              <p className="text-xs font-bold">🏠 HOME & WORK ADDRESS - For Delegate Visit</p>
              <Input value={homeAddress} onChange={(e:any)=>setHomeAddress(e.target.value)} placeholder="Home Address - Full, with Landmark *" />
              <Input value={workAddress} onChange={(e:any)=>setWorkAddress(e.target.value)} placeholder="Work Address - Office / Shop / Market" />
              <p className="text-xs font-bold">🤝 HANDOVER VENUE - Where lawyer go give heirs document?</p>
              <div className="grid grid-cols-3 gap-2"><Btn active={handoverVenue==='Lawyer Chamber'} onClick={()=>setHandoverVenue('Lawyer Chamber')}>Lawyer Chamber</Btn><Btn active={handoverVenue==='Mosque'} onClick={()=>setHandoverVenue('Mosque')}>Mosque</Btn><Btn active={handoverVenue==='Family House'} onClick={()=>setHandoverVenue('Family House')}>Family House</Btn></div>
              <Input value={handoverNote} onChange={(e:any)=>setHandoverNote(e.target.value)} placeholder="Handover Note - e.g. Mosque name, Imam name" />
              <div className="p-3 bg-gray-50 rounded-xl text-xs"><b>Status:</b> {lawyerStatus}</div>
            </div>

            <div className="bg-white text-black rounded-[24px] p-6 space-y-4">
              <h3 className="font-bold">STEP 6B - Two Witnesses - Confirm Alive / Sick / Dead</h3>
              <p className="text-xs opacity-60">Quran 5:106 - 2 just witnesses. If you no check-in, we go contact dem.</p>
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl space-y-2">
                <p className="font-bold text-sm">Witness 1</p>
                <input value={witness1Name} onChange={e=>setWitness1Name(e.target.value)} placeholder="Full Name *" className="w-full p-3 bg-white rounded-xl border" />
                <input value={witness1Phone} onChange={e=>setWitness1Phone(e.target.value)} placeholder="Phone *" className="w-full p-3 bg-white rounded-xl border" />
                <input value={witness1WhatsApp} onChange={e=>setWitness1WhatsApp(e.target.value)} placeholder="WhatsApp" className="w-full p-3 bg-white rounded-xl border" />
                <input value={witness1Email} onChange={e=>setWitness1Email(e.target.value)} placeholder="Email" className="w-full p-3 bg-white rounded-xl border" />
                <input value={witness1Relation} onChange={e=>setWitness1Relation(e.target.value)} placeholder="Relationship - Imam, Friend" className="w-full p-3 bg-white rounded-xl border" />
                <input value={witness1Address} onChange={e=>setWitness1Address(e.target.value)} placeholder="Address" className="w-full p-3 bg-white rounded-xl border" />
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
                <p className="font-bold text-sm">Witness 2</p>
                <input value={witness2Name} onChange={e=>setWitness2Name(e.target.value)} placeholder="Full Name *" className="w-full p-3 bg-white rounded-xl border" />
                <input value={witness2Phone} onChange={e=>setWitness2Phone(e.target.value)} placeholder="Phone *" className="w-full p-3 bg-white rounded-xl border" />
                <input value={witness2WhatsApp} onChange={e=>setWitness2WhatsApp(e.target.value)} placeholder="WhatsApp" className="w-full p-3 bg-white rounded-xl border" />
                <input value={witness2Email} onChange={e=>setWitness2Email(e.target.value)} placeholder="Email" className="w-full p-3 bg-white rounded-xl border" />
                <input value={witness2Relation} onChange={e=>setWitness2Relation(e.target.value)} placeholder="Relationship" className="w-full p-3 bg-white rounded-xl border" />
                <input value={witness2Address} onChange={e=>setWitness2Address(e.target.value)} placeholder="Address" className="w-full p-3 bg-white rounded-xl border" />
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <p className="font-bold text-sm">🔔 Alive Check</p>
                <p className="text-[11px] opacity-70">If you no respond, we contact witnesses: Alive / Sick / Dead. If Dead confirmed, we assign 2 Delegates (Haqq + Lawyer) to visit Home + Work within 48-72hrs, then schedule Handover 7-14 days later.</p>
                <div className="grid grid-cols-3 gap-2"><button onClick={()=>setCheckInDays(30)} className={`p-3 rounded-xl border font-bold text-sm ${checkInDays===30?'bg-black text-white':'bg-white'}`}>30 Days</button><button onClick={()=>setCheckInDays(60)} className={`p-3 rounded-xl border font-bold text-sm ${checkInDays===60?'bg-black text-white':'bg-white'}`}>60 Days</button><button onClick={()=>setCheckInDays(90)} className={`p-3 rounded-xl border font-bold text-sm ${checkInDays===90?'bg-black text-white':'bg-white'}`}>90 Days</button></div>
                <Input value={emergencyContact} onChange={(e:any)=>setEmergencyContact(e.target.value)} placeholder="Emergency Contact if witnesses no pick" />
                <button onClick={()=>{ setLastCheckIn(new Date().toLocaleString()); alert('Checked In! Alhamdulillah you are alive.'); }} className="w-full py-3 bg-green-600 text-white rounded-xl font-bold">✅ I Am Alive - Check In Now</button>
                {lastCheckIn && <p className="text-[11px] text-center">Last Check-In: {lastCheckIn}</p>}
              </div>
            </div>

            <div className="bg-white text-black rounded-[24px] p-6 space-y-3">
              <h3 className="font-bold">STEP 6C - Video Confirmation</h3>
              <div className="p-3 bg-gray-50 rounded-xl text-[12px] leading-relaxed"><b>Say this:</b><br/>"My name na <b>{fullName||'[Name]'}</b>. Today na {new Date().toLocaleDateString()}. I make this Wasiyyah by myself, nobody force me. My assets na ₦{totalAssets.toLocaleString()}, debts ₦{totalDebts.toLocaleString()}, NET ₦{netEstate.toLocaleString()}. My Wasiyyah na ₦{totalBequests.toLocaleString()}, remaining go to heirs by Faraid. My executor na {executor||'[Executor]'}. My witnesses na {witness1Name||'[W1]'} and {witness2Name||'[W2]'}."</div>
              {!videoPreview ? (<label className="block w-full py-8 border-2 border-dashed rounded-xl text-center cursor-pointer"><p className="text-3xl">🎥</p><p className="font-bold mt-2">Tap to Record / Upload Video (30-60 secs, Max 100MB)</p><input type="file" accept="video/*" capture="user" onChange={handleVideoUpload} className="hidden" /></label>) : (<div><video src={videoPreview} controls className="w-full rounded-xl bg-black" /><p className="text-[11px] mt-2">✅ Video uploaded - {videoDate}</p><button onClick={()=>{setVideoPreview(''); setVideoConfirmed(false)}} className="mt-2 py-2 px-4 border rounded-xl text-sm font-bold">Re-record</button></div>)}
              <div className="flex items-center gap-2"><input type="checkbox" checked={videoConfirmed} onChange={e=>setVideoConfirmed(e.target.checked)} className="w-4 h-4" /><p className="text-xs">I confirm this video na me, I make Wasiyyah by myself.</p></div>
            </div>

            <div className="bg-white text-black rounded-[24px] p-6 space-y-3">
              <h3 className="font-bold">Executor & Final Message</h3>
              <Input value={executor} onChange={(e:any)=>setExecutor(e.target.value)} placeholder="Executor Name" />
              <Input value={executorPhone} onChange={(e:any)=>setExecutorPhone(e.target.value)} placeholder="Executor Phone" />
              <textarea value={message} onChange={e=>setMessage(e.target.value)} className="w-full p-3 bg-gray-50 rounded-xl border min-h-[90px] text-sm" />
              <p className="text-sm">NET: ₦{netEstate.toLocaleString()} | Wasiyyah: ₦{totalBequests.toLocaleString()} | Faraid Pool: ₦{faraidPool.toLocaleString()}</p>
              <button onClick={submitForLegalBinding} className="w-full py-3.5 bg-black text-white rounded-xl font-bold">Submit For Legal Binding → Lawyer + Witnesses</button>
              <button onClick={()=>{ const txt=`بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\n\nWASIYYAH - ${fullName}\n\nASSETS: ₦${totalAssets} | DEBTS: ₦${totalDebts} | NET: ₦${netEstate}\nVAULT: ${vaultNote}\nDOCS: ${docLocation}\nMAX WASIYYAH: ₦${maxWasiyyah}\nWASIYYAH: ₦${totalBequests}\nFARAID POOL: ₦${faraidPool}\n\nWASIYYAH:\n${bequests.map((b,i)=>`${i+1}. ${b.name} (${b.relation}) - ${b.assetType} - ₦${toNum(b.amount)} - ${b.note}`).join('\n')}\n\nFARAID:\n${faraid.results.map((r:any)=>`- ${r.heir}: ${r.fractionLabel} = ₦${r.amount}`).join('\n')}\n\nLAWYER: ${lawyerName} - ${lawyerPhone} - ${lawyerChamber}\nHOME: ${homeAddress}\nWORK: ${workAddress}\nHANDOVER: ${handoverVenue}\nWITNESS1: ${witness1Name} - ${witness1Phone}\nWITNESS2: ${witness2Name} - ${witness2Phone}\nEXECUTOR: ${executor} - ${executorPhone}\nVIDEO DATE: ${videoDate}\nMESSAGE: ${message}`; const w=window.open('','_blank'); if(w){ w.document.write(`<pre style="white-space:pre-wrap;font-family:serif;padding:20px">${txt}</pre>`); w.print() } }} className="w-full py-3 bg-[#D4AF37] text-black rounded-xl font-bold">Export Final PDF (With Lawyer + Witnesses + Vault)</button>
              <p className="text-[11px] text-center opacity-50">Majority Sunni. For final estate, consult scholar + Shariah Court. Awl, Radd, Umariyyatan included. Vault synced.</p>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  )
      }
