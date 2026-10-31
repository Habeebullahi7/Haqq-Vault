"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

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
  const [newDebt, setNewDebt] = useState({ person: '', amount: '', type: 'i_owe', due_date: '', note: '' });
  const [hadith, setHadith] = useState(hadiths[0]);

  useEffect(() => {
    fetchDebts();
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

  async function fetchDebts() {
    const { data } = await supabase.from('debts').select('*').order('created_at', { ascending: false });
    if (data) setDebts(data as any);
  }

  async function addDebt() {
    if (!newDebt.person || !newDebt.note) { alert("Fill person and type of Haqq"); return; }
    await supabase.from('debts').insert([{ ...newDebt, amount: Number(newDebt.amount) || 0, status: 'pending' }]);
    setShowAdd(false);
    setNewDebt({ person: '', amount: '', type: 'i_owe', due_date: '', note: '' });
    fetchDebts();
  }

  const youOwe = debts.filter(d => d.type === 'i_owe' && d.status === 'pending').reduce((s, d) => s + d.amount, 0);
  const theyOwe = debts.filter(d => d.type === 'they_owe' && d.status === 'pending').reduce((s, d) => s + d.amount, 0);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-28">
      <div className="px-6 py-5 flex justify-between items-center border-b border-white/10 sticky top-0 bg-[#0f172a]/90 backdrop-blur z-20">
        <h1 className="font-bold text-lg tracking-widest">HAQQ VAULT <span className="text-[#D4AF37]">🔒</span></h1>
        <a href="/wasiyyah" className="text-[11px] bg-[#D4AF37] text-[#0f172a] px-3 py-1.5 rounded-full font-bold no-underline">Wasiyyah</a>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
        <div className="bg-gradient-to-r from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 rounded-2xl p-4">
          <p className="text-[11px] tracking-widest text-[#D4AF37]">QURAN 2:282</p>
          <p className="text-sm text-gray-300 mt-1">"Let a scribe write it between you in justice..."</p>
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
                  <div className="flex-1 pr-3">
                    <p className="font-bold text-sm">{d.person} <span className="text-[9px] bg-gray-100 px-2 py-0.5 rounded-full ml-1">{d.note}</span></p>
                    <p className="text-xs text-gray-500 mt-1">{d.type === 'i_owe' ? 'You owe' : 'Owes you'} • Due {d.due_date || '—'}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-extrabold ${d.type === 'i_owe' ? 'text-red-600' : 'text-green-700'}`}>₦{d.amount.toLocaleString()}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">{d.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-[#D4AF37] text-[#0f172a] rounded-full shadow-xl flex items-center justify-center text-2xl font-bold">+</button>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-white/10 flex justify-around py-3 text-[11px] text-gray-400">
        <a href="/" className="flex flex-col items-center">🏠 Home</a>
        <a href="/vault" className="flex flex-col items-center text-[#D4AF37]">🔒 Vault</a>
        <a href="/donate" className="flex flex-col items-center">❤️ Donate</a>
        <a href="/wasiyyah" className="flex flex-col items-center">📜 Wasi</a>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-end md:items-center justify-center">
          <div className="bg-white text-[#0f172a] w-full md:max-w-md rounded-t-[28px] md:rounded-[24px] p-6 max-h-[92vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 md:hidden"></div>
            <h3 className="font-bold text-lg">Record New Haqq</h3>
            <p className="text-xs text-gray-500 mt-1">See options to remember forgotten Haqq</p>
            
            <div className="mt-5 space-y-3">
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
                    <option value="Did Not Pay Worker Salary on Time">👷‍♂️ Delayed Worker's Salary</option>
                    <option value="Withheld Inheritance (Mirath)">🏠 Withheld Inheritance</option>
                    <option value="Riba - Interest I Collected">💸 Riba I Took</option>
                    <option value="Used Someone's Item Without Permission">📱 Used Property Without Permission</option>
                    <option value="Damaged Something & Didn't Fix">🔧 Damaged & Didn't Replace</option>
                  </optgroup>

                  <optgroup label="🗣️ TONGUE / HEART - Most Forgotten">
                    <option value="Backbiting (Ghibah)">🗣️ Backbiting (Ghibah) - Talked Behind</option>
                    <option value="Slander / False Accusation (Buhtan)">🤥 Slander / Lied About Someone</option>
                    <option value="Namimah - Carried Gossip">🔥 Namimah - Caused Fight Between People</option>
                    <option value="Insulted / Mocked Someone">😔 Insulted, Mocked, Cursed</option>
                    <option value="Broke Promise / Betrayed Trust">🤝 Broke Promise / Betrayed Amanah</option>
                    <option value="Envy / Jealousy Led to Harm">👁️ Envy That Caused Harm</option>
                    <option value="Arrogance / Looked Down on Someone">😤 Arrogance / Belittled Someone</option>
                  </optgroup>

                  <optgroup label="🤲 PHYSICAL / RIGHTS">
                    <option value="Hit / Hurt Someone Physically">✋ Hit / Beat / Hurt Someone</option>
                    <option value="Oppressed Someone With Power">👑 Oppressed With Power/Position</option>
                    <option value="Denied Someone Their Right / Time">⏰ Wasted Time / Denied Right</option>
                    <option value="Haram Look / Harassment">👀 Wrong Look / Harassment</option>
                  </optgroup>

                  <optgroup label="❌ CAN'T REACH ANYMORE">
                    <option value="Owe But Can't Find Person">❌ Owe But Can't Find Again</option>
                    <option value="Cheated & Lost Contact">📵 Cheated & Lost Contact</option>
                    <option value="Primary School / Childhood Debt">🎒 Old Childhood Debt</option>
                    <option value="Forgot If I Paid - Record To Be Safe">🤷 Forgot If I Paid - Record To Be Safe</option>
                  </optgroup>

                  <optgroup label="📜 IBADAH">
                    <option value="They Owe Me - I Forgive">💵 They Owe Me (Record / Forgive)</option>
                    <option value="Kaffarah - Oath / Fast">🤲 Kaffarah - Oath / Fast</option>
                    <option value="Wasiyyah - My Will">📜 Wasiyyah - My Will</option>
                  </optgroup>
                </select>
              </div>

              {newDebt.note && (
                <div className="p-3 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-xl">
                  <p className="text-[11px] font-bold text-[#0f172a]">What Islam says:</p>
                  <p className="text-[11px] text-[#0f172a]/70 mt-1 leading-snug">
                    {newDebt.note.includes("Ghibah") && "Praise them where you backbit them, make dua for them, and seek forgiveness if you can."}
                    {newDebt.note.includes("Cheated") && "Pay same amount back. If can't find them, give Sadaqah on their behalf. Allah will settle it."}
                    {newDebt.note.includes("Can't Find") && "Give amount as Sadaqah for them. Allah will deliver reward to them on Qiyamah."}
                    {newDebt.note.includes("Borrowed") && "Return money + small gift for delay."}
                    {newDebt.note.includes("Hit") && "Ask forgiveness. If not possible, give charity and dua."}
                    {!["Ghibah","Cheated","Can't Find","Borrowed","Hit"].some(k=>newDebt.note.includes(k)) && "Record with sincere intention. Allah loves those who clear Haqq."}
                  </p>
                </div>
              )}

              <input value={newDebt.person} onChange={e=>setNewDebt({...newDebt, person: e.target.value})} placeholder="Person name (e.g. Musa, Classmate 2015)" className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none" />
              <input value={newDebt.amount} onChange={e=>setNewDebt({...newDebt, amount: e.target.value})} type="number" placeholder="Amount ₦ (put 0 if not money)" className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none" />
              <input value={newDebt.due_date} onChange={e=>setNewDebt({...newDebt, due_date: e.target.value})} type="date" className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none" />
              
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setShowAdd(false)} className="flex-1 p-3.5 bg-gray-100 rounded-xl font-bold">Cancel</button>
                <button onClick={addDebt} className="flex-1 p-3.5 bg-[#0f172a] text-white rounded-xl font-bold">Save Haqq</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
   }
