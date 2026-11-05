"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import BottomNav from "../../components/BottomNav";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Debt = { id: string; person: string; amount: number; type: 'i_owe' | 'they_owe'; due_date: string; note: string; status: 'pending' | 'paid'; created_at: string; };

const hadiths = [
  { arabic:"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", trans:"The best of you are those who learn Quran and teach it.", ref:"Bukhari" },
  { arabic:"مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ", trans:"Charity does not decrease wealth.", ref:"Muslim" },
  { arabic:"ظِلُّ الْمُؤْمِنِ يَوْمَ الْقِيَامَةِ صَدَقَتُهُ", trans:"The believer's shade on Day of Resurrection will be his charity.", ref:"Ahmad" },
  { arabic:"الصَّدَقَةُ تَسُدُّ سَبْعِينَ بَابًا مِنَ السُّوءِ", trans:"Charity closes 70 doors of evil.", ref:"Tabarani" },
  { arabic:"أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ", trans:"Most beloved deeds to Allah are consistent ones even if small.", ref:"Bukhari & Muslim" },
  { arabic:"إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَمَلُهُ إِلَّا مِنْ ثَلَاثٍ", trans:"When man dies his deeds end except 3: ongoing charity, beneficial knowledge, righteous child.", ref:"Muslim" },
];

export default function VaultPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newDebt, setNewDebt] = useState({ person: '', amount: '', type: 'i_owe', due_date: '', note: '', customNote: '' });
  const [hadith, setHadith] = useState(hadiths[0]);
  const [wasiyyah, setWasiyyah] = useState<any>(null);
  const [wasiyyahStatus, setWasiyyahStatus] = useState('DRAFT');
  const [versions, setVersions] = useState<any[]>([]);

  useEffect(() => {
    fetchDebts();
    fetchWasiyyah();
    const today = new Date().toDateString();
    const savedDay = localStorage.getItem("hadithDay");
    const savedIndex = localStorage.getItem("hadithIndex");
    if(savedDay === today && savedIndex){
      setHadith(hadiths[parseInt(savedIndex)]);
    } else {
      const r = Math.floor(Math.random()*hadiths.length);
      setHadith(hadiths[r]);
      localStorage.setItem("hadithDay", today);
      localStorage.setItem("hadithIndex", r.toString());
    }
  }, []);

  async function fetchWasiyyah() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('wasiyyahs').select('*').eq('user_id', user.id).single();
        if (data) {
          setWasiyyah(data);
          setWasiyyahStatus(data.vault_status || 'DRAFT');
          const { data: vers } = await supabase.from('wasiyyah_versions').select('*').eq('wasiyyah_id', data.id).order('created_at', { ascending: false });
          if (vers) setVersions(vers);
          return;
        }
      }
    } catch {}
    const local = localStorage.getItem("haqq-wasiyyah");
    if (local) {
      const parsed = JSON.parse(local);
      setWasiyyah(parsed);
      setWasiyyahStatus(localStorage.getItem("haqq-wasiyyah-status") || 'ACTIVE_LOCKED');
    }
    const localVers = localStorage.getItem("haqq-wasiyyah-versions");
    if (localVers) setVersions(JSON.parse(localVers));
  }

  async function fetchDebts() {
    const { data } = await supabase.from('debts').select('*').order('created_at', { ascending: false });
    if (data) setDebts(data as any);
  }

  async function addDebt() {
    if (!newDebt.person || !newDebt.note) { alert("Fill person and type of Haqq"); return; }
    if (newDebt.note === "Other - Custom" && !newDebt.customNote) { alert("Please type your custom Haqq in the box"); return; }
    const finalNote = newDebt.note === "Other - Custom" 
      ? newDebt.customNote 
      : newDebt.note + (newDebt.customNote ? ` - ${newDebt.customNote}` : '');
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('debts').insert([{ 
      person: newDebt.person,
      amount: Number(newDebt.amount) || 0, 
      type: newDebt.type,
      due_date: newDebt.due_date || null,
      note: finalNote,
      status: 'pending',
      user_id: user?.id || null
    }]);
    setShowAdd(false);
    setNewDebt({ person: '', amount: '', type: 'i_owe', due_date: '', note: '', customNote: '' });
    fetchDebts();
  }

  async function markPaid(id: string) {
    await supabase.from('debts').update({ status: 'paid' }).eq('id', id);
    fetchDebts();
  }

  const youOwe = debts.filter(d => d.type === 'i_owe' && d.status === 'pending').reduce((s, d) => s + d.amount, 0);
  const theyOwe = debts.filter(d => d.type === 'they_owe' && d.status === 'pending').reduce((s, d) => s + d.amount, 0);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-[150px]">
      {/* TOP HEADER */}
      <div className="px-6 py-5 flex justify-between items-center border-b border-white/10 sticky top-0 bg-[#0f172a]/95 backdrop-blur z-20">
        <h1 className="font-bold text-lg tracking-widest">HAQQ VAULT <span className="text-[#D4AF37]">🔒</span></h1>
        <a href="/wasiyyah" className="text-[11px] bg-[#D4AF37] text-[#0f172a] px-3 py-1.5 rounded-full font-bold no-underline">Wasiyyah</a>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
        {/* WASIYYAH VAULT CARD */}
        <div className="bg-white text-[#0f172a] rounded-[20px] p-5 shadow-xl border-2 border-[#D4AF37]/40">
          <div className="flex justify-between items-start gap-3">
            <div>
              <p className="text-[10px] tracking-widest text-[#D4AF37] font-bold">📜 MY WASIYYAH - ISLAMIC WILL</p>
              <h2 className="font-extrabold text-[18px] mt-1">{wasiyyah ? (wasiyyah.full_name || 'My Wasiyyah') : 'No Wasiyyah Saved Yet'}</h2>
            </div>
            {wasiyyah && (
              <span className={`text-[10px] px-2 py-1 rounded-full font-bold whitespace-nowrap shrink-0 ${wasiyyahStatus === 'ACTIVE_LOCKED' ? 'bg-green-100 text-green-700' : wasiyyahStatus === 'RELEASED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {wasiyyahStatus === 'ACTIVE_LOCKED' ? '🔒 LOCKED & SAFE' : wasiyyahStatus === 'EDITING' ? '🔓 EDITING' : wasiyyahStatus === 'RELEASED' ? '⚠️ RELEASED' : '📝 DRAFT'}
              </span>
            )}
          </div>

          {!wasiyyah ? (
            <>
              <p className="text-sm text-gray-600 mt-2">Your Wasiyyah is not in the Vault yet. Create it now - it will be locked here until after death verification.</p>
              <a href="/wasiyyah" className="block text-center mt-4 bg-[#0f172a] text-white py-3 rounded-full font-bold text-sm no-underline">Create My Wasiyyah →</a>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[11px] text-gray-500">NET ESTATE</p><p className="font-extrabold">₦{(wasiyyah.net_estate ?? wasiyyah.net ?? 0).toLocaleString()}</p></div>
                <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[11px] text-gray-500">WASIYYAH (1/3)</p><p className="font-extrabold">₦{(Number(String(wasiyyah.wasiyyah_amount || wasiyyah.wasiyyahAmt || '0').replace(/,/g, '')) || 0).toLocaleString()}</p></div>
                <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[11px] text-gray-500">EXECUTOR</p><p className="font-bold truncate">{wasiyyah.executor_name || wasiyyah.executorName || '-'}</p></div>
                <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[11px] text-gray-500">LAWYER</p><p className="font-bold truncate">{wasiyyah.lawyer_choice === 'haqq' ? 'HAQQ Lawyer' : wasiyyah.lawyer_name || wasiyyah.lawyerName || 'No Lawyer Yet'}</p></div>
              </div>
              <p className="text-[11px] text-gray-500 mt-3 bg-yellow-50 p-3 rounded-xl leading-relaxed">
                🔒 Locked: Only you can unlock to edit (PIN + OTP). Executor / Lawyer can only access after death verification.
                {versions.length > 0 && <><br/>Version History: {versions.length} version(s) saved.</>}
              </p>
              <div className="flex gap-2 mt-3">
                <a href="/wasiyyah" className="flex-1 text-center bg-[#0f172a] text-white py-3 rounded-full font-bold text-sm no-underline">Unlock To Edit</a>
                <a href="/report-death" className="flex-1 text-center bg-red-600 text-white py-3 rounded-full font-bold text-sm no-underline">Report Death</a>
              </div>
              <a href="/lawyer" className="block text-center mt-2 bg-yellow-400 text-black py-3 rounded-full font-bold text-sm no-underline">⚖️ Go To Lawyer Page</a>
              {versions.length > 0 && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-[11px] font-bold">VERSION HISTORY</p>
                  {versions.slice(0, 3).map((v: any, i: number) => (
                    <p key={i} className="text-[11px] text-gray-500">Version {versions.length - i} - {new Date(v.created_at || v.date).toLocaleDateString('en-NG')} - ₦{(v.net_estate ?? v.net ?? 0).toLocaleString()}</p>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="bg-gradient-to-r from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 rounded-2xl p-4">
          <p className="text-[11px] tracking-widest text-[#D4AF37]">QURAN 2:282</p>
          <p className="text-sm text-gray-300 mt-1">&quot;Let a scribe write it between you in justice...&quot;</p>
        </div>

        <div className="bg-white text-[#0f172a] rounded-[20px] p-5 shadow-xl">
          <div className="flex justify-between items-start">
            <p className="text-[10px] tracking-widest opacity-60 font-bold">🌙 DAILY HADITH</p>
            <button onClick={()=>{const r=Math.floor(Math.random()*hadiths.length); setHadith(hadiths[r])}} className="text-[10px] bg-gray-100 px-2 py-1 rounded-full font-bold">🔄</button>
          </div>
          <p className="font-serif text-[16px] mt-3 font-bold">{hadith.arabic}</p>
          <p className="text-[14px] mt-2">{hadith.trans} — {hadith.ref}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white text-[#0f172a] rounded-[20px] p-5"><p className="text-[11px] opacity-60">YOU OWE</p><p className="text-2xl font-extrabold mt-2">₦{youOwe.toLocaleString()}</p></div>
          <div className="bg-[#D4AF37] text-[#0f172a] rounded-[20px] p-5"><p className="text-[11px] opacity-70">THEY OWE YOU</p><p className="text-2xl font-extrabold mt-2">₦{theyOwe.toLocaleString()}</p></div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Recent Haqq</h2>
            <button onClick={() => setShowAdd(true)} className="text-xs bg-white text-[#0f172a] px-4 py-2 rounded-full font-bold">+ Add Haqq</button>
          </div>
          {debts.length === 0 ? (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-[20px] p-10 text-center">
              <div className="text-4xl mb-3">✨</div><p className="font-semibold">Your Haqq is clear</p><p className="text-sm text-gray-400 mt-1">Alhamdulillah, no pending debts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {debts.map((d) => (
                <div key={d.id} className="bg-white text-[#0f172a] rounded-2xl p-4 flex justify-between items-center">
                  <div className="flex-1 pr-3 min-w-0">
                    <p className="font-bold text-sm">{d.person}</p>
                    <p className="text-[11px] bg-gray-100 px-2 py-1 rounded-full mt-1 inline-block max-w-full truncate">{d.note}</p>
                    <p className="text-xs text-gray-500 mt-1">{d.type === 'i_owe' ? 'You owe' : 'Owes you'} • Due {d.due_date || '—'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-extrabold ${d.type === 'i_owe' ? 'text-red-600' : 'text-green-700'}`}>₦{d.amount.toLocaleString()}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">{d.status}</span>
                    {d.status === 'pending' && <button onClick={() => markPaid(d.id)} className="block text-[10px] bg-green-600 text-white px-2 py-1 rounded-full mt-1 font-bold ml-auto">Mark Paid ✓</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FLOATING + BUTTON - Sits ABOVE the pill nav, no go cover again */}
      <button onClick={() => setShowAdd(true)} className="fixed bottom-[115px] right-4 w-12 h-12 bg-[#D4AF37] text-[#0f172a] rounded-full shadow-xl flex items-center justify-center text-2xl font-bold z-30 lg:hidden">+</button>

      {showAdd && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur flex items-end md:items-center justify-center">
          <div className="bg-white text-[#0f172a] w-full md:max-w-md rounded-t-[28px] md:rounded-[24px] p-6 max-h-[92vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 md:hidden"></div>
            <h3 className="font-bold text-lg">Record New Haqq</h3>
            <p className="text-xs text-gray-500 mt-1">Tap to remember forgotten Haqq, or type your own</p>
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={()=>setNewDebt({...newDebt, type: 'i_owe'})} className={`p-3 rounded-xl border text-sm font-bold ${newDebt.type==='i_owe' ? 'bg-[#0f172a] text-white' : 'bg-gray-50'}`}>I Owe / I Wronged</button>
                <button onClick={()=>setNewDebt({...newDebt, type: 'they_owe'})} className={`p-3 rounded-xl border text-sm font-bold ${newDebt.type==='they_owe' ? 'bg-[#D4AF37] text-[#0f172a]' : 'bg-gray-50'}`}>They Owe Me</button>
              </div>
              <div>
                <label className="text-[11px] font-bold tracking-widest opacity-60">HOW DID I WRONG SOMEONE? (This will jog your memory)</label>
                <select value={newDebt.note} onChange={e=>setNewDebt({...newDebt, note: e.target.value})} className="w-full mt-1 p-4 bg-gray-50 rounded-xl border text-sm font-bold outline-none">
                  <option value="">Select to remember...</option>
                  <optgroup label="💰 MONEY / BUSINESS">
                    <option value="I Owe - Borrowed Money">💰 Borrowed Money & Never Paid</option>
                    <option value="Cheated in Business / Trade">⚖️ Cheated in Business / Trade</option>
                    <option value="Took Extra Change & Didn't Return">💳 Took Extra Change & Kept It</option>
                    <option value="Did Not Pay Worker Salary">👷‍♂️ Delayed Worker's Salary</option>
                    <option value="Withheld Inheritance (Mirath)">🏠 Withheld Inheritance</option>
                    <option value="Riba - Interest I Collected">💸 Riba I Took</option>
                    <option value="Used Item Without Permission">📱 Used Property Without Permission</option>
                    <option value="Damaged Something & Didn't Fix">🔧 Damaged & Didn't Replace</option>
                  </optgroup>
                  <optgroup label="🗣️ TONGUE / HEART - Most Forgotten">
                    <option value="Backbiting (Ghibah)">🗣️ Backbiting (Ghibah) - Talked Behind</option>
                    <option value="Slander / False Accusation">🤥 Slander / Lied About Someone</option>
                    <option value="Namimah - Carried Gossip">🔥 Namimah - Caused Fight</option>
                    <option value="Insulted / Mocked Someone">😔 Insulted, Mocked, Cursed</option>
                    <option value="Broke Promise / Betrayed Trust">🤝 Broke Promise / Betrayed Amanah</option>
                    <option value="Envy / Jealousy Led to Harm">👁️ Envy That Caused Harm</option>
                  </optgroup>
                  <optgroup label="🤲 PHYSICAL / RIGHTS">
                    <option value="Hit / Hurt Someone Physically">✋ Hit / Hurt Someone</option>
                    <option value="Oppressed Someone With Power">👑 Oppressed With Power</option>
                    <option value="Denied Someone Their Right / Time">⏰ Wasted Time / Denied Right</option>
                    <option value="Haram Look / Harassment">👀 Wrong Look / Harassment</option>
                  </optgroup>
                  <optgroup label="❌ CAN'T REACH ANYMORE">
                    <option value="Owe But Can't Find Person">❌ Owe But Can't Find Again</option>
                    <option value="Cheated & Lost Contact">📵 Cheated & Lost Contact</option>
                    <option value="Primary School / Childhood Debt">🎒 Old Childhood Debt</option>
                    <option value="Forgot If I Paid - Record To Be Safe">🤷 Forgot If I Paid - Record To Be Safe</option>
                  </optgroup>
                  <optgroup label="📜 OTHER">
                    <option value="They Owe Me - I Forgive">💵 They Owe Me (Record / Forgive)</option>
                    <option value="Kaffarah - Oath / Fast">🤲 Kaffarah</option>
                    <option value="Wasiyyah - My Will">📜 Wasiyyah</option>
                    <option value="Other - Custom">✍️ Other - My Case Not Listed (Type Below)</option>
                  </optgroup>
                </select>
              </div>
              <div className={`p-3 rounded-xl border-2 transition-all ${newDebt.note === "Other - Custom" ? 'border-[#D4AF37] bg-yellow-50/70' : 'border-dashed border-gray-200 bg-gray-50/50'}`}>
                <label className="text-[11px] font-bold tracking-widest opacity-70">
                  {newDebt.note === "Other - Custom" ? "✍️ TYPE YOUR OWN HAQQ HERE (Required)" : "✍️ Describe Your Case More (Optional but Powerful)"}
                </label>
                <textarea 
                  value={newDebt.customNote} 
                  onChange={e=>setNewDebt({...newDebt, customNote: e.target.value})} 
                  placeholder={
                    newDebt.note === "Other - Custom" 
                    ? "Example: I spoiled my friend's relationship, or I stole pen in office 2019, or I cheated during exam and copied someone's work..."
                    : "Add more details: Example - How it happened, where, when? This helps you remember on Qiyamah and fix it properly."
                  }
                  className="w-full mt-2 p-3 bg-white rounded-xl border outline-none text-sm min-h-[90px] focus:border-[#0f172a]"
                  rows={3}
                />
                <p className="text-[10px] text-gray-500 mt-1">Allah loves honest confession. Write it for His sake — it stays private in your vault.</p>
              </div>
              <input value={newDebt.person} onChange={e=>setNewDebt({...newDebt, person: e.target.value})} placeholder="Person name (e.g. Musa, Classmate 2015, Neighbour)" className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none" />
              <input value={newDebt.amount} onChange={e=>setNewDebt({...newDebt, amount: e.target.value})} type="number" placeholder="Amount ₦ (put 0 if not money - e.g. Ghibah)" className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none" />
              <input value={newDebt.due_date} onChange={e=>setNewDebt({...newDebt, due_date: e.target.value})} type="date" className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none" />
              <div className="flex gap-3 pt-2 pb-2">
                <button onClick={()=>setShowAdd(false)} className="flex-1 p-3.5 bg-gray-100 rounded-xl font-bold">Cancel</button>
                <button onClick={addDebt} className="flex-1 p-3.5 bg-[#0f172a] text-white rounded-xl font-bold">Save Haqq</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
        }
