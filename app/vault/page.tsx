// app/vault/page.tsx - FIXED: Wasiyyah card removed, Filter/Search + Edit + How to Fix + Security
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Debt = { id: string; person: string; amount: number; type: 'i_owe' | 'they_owe'; due_date: string; note: string; how_to_fix?: string; status: 'pending' | 'paid'; created_at: string; user_id: string };

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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newDebt, setNewDebt] = useState({ person: '', amount: '', type: 'i_owe' as 'i_owe' | 'they_owe', due_date: '', note: '', customNote: '', how_to_fix: '' });
  const [hadith, setHadith] = useState(hadiths[0]);
  const [filter, setFilter] = useState<'all' | 'i_owe' | 'they_owe' | 'pending' | 'paid'>('all');
  const [search, setSearch] = useState('');
  const router = useRouter();

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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    const { data } = await supabase.from('debts').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    if (data) setDebts(data as any);
  }

  function resetForm() {
    setShowAdd(false);
    setEditingId(null);
    setNewDebt({ person: '', amount: '', type: 'i_owe', due_date: '', note: '', customNote: '', how_to_fix: '' });
  }

  function startEdit(d: Debt) {
    setEditingId(d.id);
    setNewDebt({ person: d.person, amount: String(d.amount || ''), type: d.type, due_date: d.due_date || '', note: d.note, customNote: '', how_to_fix: d.how_to_fix || '' });
    setShowAdd(true);
  }

  async function addDebt() {
    if (!newDebt.person || !newDebt.note) { alert("Fill person and type of Haqq"); return; }
    if (newDebt.note === "Other - Custom" && !newDebt.customNote) { alert("Please type your custom Haqq in the box"); return; }
    const finalNote = newDebt.note === "Other - Custom" ? newDebt.customNote : newDebt.note + (newDebt.customNote ? ` - ${newDebt.customNote}` : '');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    if (editingId) {
      const { error } = await supabase.from('debts').update({ person: newDebt.person, amount: Number(newDebt.amount) || 0, type: newDebt.type, due_date: newDebt.due_date || null, note: finalNote, how_to_fix: newDebt.how_to_fix || null }).eq('id', editingId).eq('user_id', user.id);
      if (error) { alert(error.message); return; }
    } else {
      const { error } = await supabase.from('debts').insert([{ person: newDebt.person, amount: Number(newDebt.amount) || 0, type: newDebt.type, due_date: newDebt.due_date || null, note: finalNote, how_to_fix: newDebt.how_to_fix || null, status: 'pending', user_id: user.id }]);
      if (error) { alert(error.message); return; }
    }
    resetForm();
    fetchDebts();
  }

  async function markPaid(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('debts').update({ status: 'paid' }).eq('id', id).eq('user_id', user.id);
    fetchDebts();
  }

  async function undoPaid(id: string) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('debts').update({ status: 'pending' }).eq('id', id).eq('user_id', user.id);
    fetchDebts();
  }

  async function deleteDebt(id: string) {
    if (!confirm("Delete this Haqq? You no fit undo am.")) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('debts').delete().eq('id', id).eq('user_id', user.id);
    fetchDebts();
  }

  const youOwe = debts.filter(d => d.type === 'i_owe' && d.status === 'pending').reduce((s, d) => s + d.amount, 0);
  const theyOwe = debts.filter(d => d.type === 'they_owe' && d.status === 'pending').reduce((s, d) => s + d.amount, 0);
  const cleared = debts.filter(d => d.status === 'paid').reduce((s, d) => s + d.amount, 0);
  const clearedCount = debts.filter(d => d.status === 'paid').length;

  const filtered = debts.filter(d => {
    if (filter === 'i_owe' && d.type !== 'i_owe') return false;
    if (filter === 'they_owe' && d.type !== 'they_owe') return false;
    if (filter === 'pending' && d.status !== 'pending') return false;
    if (filter === 'paid' && d.status !== 'paid') return false;
    if (search && !d.person.toLowerCase().includes(search.toLowerCase()) && !d.note.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-[150px]">
      <div className="px-6 py-5 flex justify-between items-center border-b border-white/10 sticky top-0 bg-[#0f172a]/95 backdrop-blur z-20">
        <h1 className="font-bold text-lg tracking-widest">HAQQ VAULT <span className="text-[#D4AF37]">🔒</span></h1>
        <a href="/wasiyyah" className="text-[11px] bg-[#D4AF37] text-[#0f172a] px-3 py-1.5 rounded-full font-bold no-underline">Wasiyyah</a>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
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

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white text-[#0f172a] rounded-[20px] p-4"><p className="text-[10px] opacity-60 font-bold">YOU OWE</p><p className="text-xl font-extrabold mt-1">₦{youOwe.toLocaleString()}</p></div>
          <div className="bg-[#D4AF37] text-[#0f172a] rounded-[20px] p-4"><p className="text-[10px] opacity-70 font-bold">THEY OWE YOU</p><p className="text-xl font-extrabold mt-1">₦{theyOwe.toLocaleString()}</p></div>
          <div className="bg-green-600 text-white rounded-[20px] p-4"><p className="text-[10px] opacity-80 font-bold">CLEARED ✓</p><p className="text-xl font-extrabold mt-1">₦{cleared.toLocaleString()}</p><p className="text-[10px] opacity-80">{clearedCount} cleared</p></div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">Recent Haqq</h2>
            <button onClick={() => { resetForm(); setShowAdd(true); }} className="text-xs bg-white text-[#0f172a] px-4 py-2 rounded-full font-bold">+ Add Haqq</button>
          </div>

          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or Haqq..." className="w-full p-3 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-400 outline-none mb-3" />

          <div className="flex gap-2 overflow-x-auto pb-1">
            {(['all','i_owe','they_owe','pending','paid'] as const).map(f => (
              <button key={f} onClick={()=>setFilter(f)} className={`shrink-0 text-[11px] px-3 py-1.5 rounded-full font-bold ${filter===f ? 'bg-[#D4AF37] text-[#0f172a]' : 'bg-white/10 text-gray-300'}`}>
                {f==='all'?'All':f==='i_owe'?'I Owe':f==='they_owe'?'They Owe Me':f==='pending'?'Pending':'Paid ✓'}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-[20px] p-10 text-center mt-4">
              <div className="text-4xl mb-3">✨</div><p className="font-semibold">{debts.length===0 ? 'Your Haqq is clear' : 'No Haqq for this filter'}</p><p className="text-sm text-gray-400 mt-1">{debts.length===0 ? 'Alhamdulillah, no pending debts' : 'Try another filter or search'}</p>
            </div>
          ) : (
            <div className="space-y-3 mt-4">
              {filtered.map((d) => (
                <div key={d.id} className={`bg-white text-[#0f172a] rounded-2xl p-4 flex justify-between items-center ${d.status==='paid' ? 'opacity-70 border-2 border-green-200' : ''}`}>
                  <div className="flex-1 pr-3 min-w-0">
                    <p className="font-bold text-sm">{d.person}</p>
                    <p className="text-[11px] bg-gray-100 px-2 py-1 rounded-full mt-1 inline-block max-w-full truncate">{d.note}</p>
                    {d.how_to_fix && <p className="text-[11px] bg-yellow-50 text-yellow-800 px-2 py-1 rounded-lg mt-2">Fix: {d.how_to_fix}</p>}
                    <p className="text-xs text-gray-500 mt-1">{d.type === 'i_owe' ? 'You owe' : 'Owes you'} • {d.due_date ? `Due ${d.due_date}` : 'No due date'}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`font-extrabold ${d.type === 'i_owe' ? 'text-red-600' : 'text-green-700'}`}>₦{d.amount.toLocaleString()}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${d.status==='paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{d.status==='paid' ? 'Cleared ✓' : 'Pending'}</span>
                    {d.status === 'pending'
                      ? <button onClick={() => markPaid(d.id)} className="block text-[10px] bg-green-600 text-white px-2 py-1 rounded-full mt-1 font-bold ml-auto">Mark Paid ✓</button>
                      : <button onClick={() => undoPaid(d.id)} className="block text-[10px] bg-gray-200 text-gray-700 px-2 py-1 rounded-full mt-1 font-bold ml-auto">Undo</button>
                    }
                    <button onClick={() => startEdit(d)} className="block text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full mt-1 font-bold ml-auto">Edit ✏️</button>
                    <button onClick={() => deleteDebt(d.id)} className="block text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded-full mt-1 font-bold ml-auto">Delete ✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-[60] bg-black/70 backdrop-blur flex items-end md:items-center justify-center">
          <div className="bg-white text-[#0f172a] w-full md:max-w-md rounded-t-[28px] md:rounded-[24px] p-6 max-h-[92vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4 md:hidden"></div>
            <h3 className="font-bold text-lg">{editingId ? 'Edit Haqq' : 'Record New Haqq'}</h3>
            <p className="text-xs text-gray-500 mt-1">Tap to remember forgotten Haqq, or type your own</p>
            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={()=>setNewDebt({...newDebt, type: 'i_owe'})} className={`p-3 rounded-xl border text-sm font-bold ${newDebt.type==='i_owe' ? 'bg-[#0f172a] text-white' : 'bg-gray-50 text-[#0f172a]'}`}>I Owe / I Wronged</button>
                <button onClick={()=>setNewDebt({...newDebt, type: 'they_owe'})} className={`p-3 rounded-xl border text-sm font-bold ${newDebt.type==='they_owe' ? 'bg-[#D4AF37] text-[#0f172a]' : 'bg-gray-50 text-[#0f172a]'}`}>They Owe Me</button>
              </div>
              <div>
                <label className="text-[11px] font-bold tracking-widest opacity-60">HOW DID I WRONG SOMEONE? (This will jog your memory)</label>
                <select value={newDebt.note} onChange={e=>setNewDebt({...newDebt, note: e.target.value})} className="w-full mt-1 p-4 bg-gray-50 rounded-xl border text-sm font-bold outline-none text-[#0f172a]">
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
                <textarea value={newDebt.customNote} onChange={e=>setNewDebt({...newDebt, customNote: e.target.value})} placeholder={newDebt.note === "Other - Custom" ? "Example: I spoiled my friend's relationship, or I stole pen in office 2019..." : "Add more details: Example - How it happened, where, when?"} className="w-full mt-2 p-3 bg-white rounded-xl border outline-none text-sm min-h-[90px] focus:border-[#0f172a] text-[#0f172a] placeholder:text-gray-400" rows={3} />
                <p className="text-[10px] text-gray-500 mt-1">Allah loves honest confession. Write it for His sake — it stays private in your vault.</p>
              </div>
              <input value={newDebt.person} onChange={e=>setNewDebt({...newDebt, person: e.target.value})} placeholder="Person name (e.g. Musa, Classmate 2015, Neighbour)" className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none text-[#0f172a] placeholder:text-gray-400" />
              <input value={newDebt.amount} onChange={e=>setNewDebt({...newDebt, amount: e.target.value})} type="number" placeholder="Amount ₦ (put 0 if not money - e.g. Ghibah)" className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none text-[#0f172a] placeholder:text-gray-400" />
              <input value={newDebt.due_date} onChange={e=>setNewDebt({...newDebt, due_date: e.target.value})} type="date" className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none text-[#0f172a]" />
              <input value={newDebt.how_to_fix} onChange={e=>setNewDebt({...newDebt, how_to_fix: e.target.value})} placeholder="How to fix? e.g. Call him & apologize, pay 10k" className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none text-[#0f172a] placeholder:text-gray-400" />
              <div className="flex gap-3 pt-2 pb-2">
                <button onClick={resetForm} className="flex-1 p-3.5 bg-gray-100 rounded-xl font-bold text-[#0f172a]">Cancel</button>
                <button onClick={addDebt} className="flex-1 p-3.5 bg-[#0f172a] text-white rounded-xl font-bold">{editingId ? 'Save Changes' : 'Save Haqq'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
    }
