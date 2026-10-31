"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Debt = { id: string; person: string; amount: number; type: 'i_owe' | 'they_owe'; due_date: string; note: string; status: 'pending' | 'paid' };

const hadiths = [
  { arabic:"خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", trans:"The best of you are those who learn Quran and teach it.", ref:"Bukhari" },
  { arabic:"مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ", trans:"Charity does not decrease wealth.", ref:"Muslim" },
  { arabic:"ظِلُّ الْمُؤْمِنِ يَوْمَ الْقِيَامَةِ صَدَقَتُهُ", trans:"The believer's shade on Day of Resurrection will be his charity.", ref:"Ahmad" },
  { arabic:"الصَّدَقَةُ تَسُدُّ سَبْعِينَ بَابًا مِنَ السُّوءِ", trans:"Charity closes 70 doors of evil.", ref:"Tabarani" },
  { arabic:"أَحَبُّ الْأَعْمَالِ إِلَى اللَّهِ أَدْوَمُهَا وَإِنْ قَلَّ", trans:"Most beloved deeds to Allah are consistent ones even if small.", ref:"Bukhari & Muslim" },
];

export default function VaultPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newDebt, setNewDebt] = useState({ person: '', amount: '', type: 'i_owe', due_date: '', note: '' });
  const [hadith, setHadith] = useState(hadiths[0]);

  useEffect(() => {
    fetchDebts();
    // Random hadith daily - same hadith for whole day
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
    if (!newDebt.person || !newDebt.amount) return;
    await supabase.from('debts').insert([{ ...newDebt, amount: Number(newDebt.amount), status: 'pending' }]);
    setShowAdd(false);
    setNewDebt({ person: '', amount: '', type: 'i_owe', due_date: '', note: '' });
    fetchDebts();
  }

  const shareHadith = async () => {
    const text = `${hadith.trans} — ${hadith.ref}\n\nDaily reminder from HAQQ Vault`;
    if(navigator.share){ await navigator.share({title:"Daily Hadith", text}) }
    else { navigator.clipboard.writeText(text); alert("Hadith copied!"); }
  }

  const shareVault = async () => {
    const text = `Check my Amanah vault on HAQQ — Quran 2:282. Secure your debts: https://haqq-gray.vercel.app/vault`;
    if(navigator.share){ await navigator.share({title:"HAQQ Vault", text}) }
    else { navigator.clipboard.writeText(text); alert("Link copied!"); }
  }

  const youOwe = debts.filter(d => d.type === 'i_owe' && d.status === 'pending').reduce((s, d) => s + d.amount, 0);
  const theyOwe = debts.filter(d => d.type === 'they_owe' && d.status === 'pending').reduce((s, d) => s + d.amount, 0);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24 md:pb-0">
      <div className="px-6 py-5 flex justify-between items-center border-b border-white/10 sticky top-0 bg-[#0f172a]/80 backdrop-blur z-20">
        <h1 className="font-bold text-lg tracking-widest">HAQQ VAULT <span className="text-[#D4AF37]">🔒</span></h1>
        <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#0f172a] flex items-center justify-center font-bold">H</div>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-6 space-y-6">
        {/* Quran Banner */}
        <div className="bg-gradient-to-r from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 rounded-2xl p-4">
          <p className="text-[11px] tracking-widest text-[#D4AF37]">QURAN 2:282</p>
          <p className="text-sm text-gray-300 mt-1">"Let a scribe write it between you in justice..." Record your Haqq for Amanah.</p>
        </div>

        {/* ADDED: Daily Hadith - Good Deeds - YOUR PAPER IDEA */}
        <div className="bg-white text-[#0f172a] rounded-[20px] p-5 shadow-lg relative overflow-hidden">
          <div className="flex justify-between">
            <p className="text-[10px] tracking-widest opacity-60 font-bold">🌙 DAILY HADITH — Good Deeds (Random Daily)</p>
            <button onClick={shareHadith} className="text-[11px] bg-[#0f172a] text-white px-3 py-1 rounded-full font-bold">↗️ Share</button>
          </div>
          <p className="font-serif text-[16px] mt-3 font-bold leading-6">{hadith.arabic}</p>
          <p className="text-[14px] mt-2">{hadith.trans}</p>
          <p className="text-[11px] text-gray-500 mt-1">— {hadith.ref}</p>
          <button onClick={()=>{ const r=Math.floor(Math.random()*hadiths.length); setHadith(hadiths[r])}} className="mt-3 text-[11px] bg-gray-100 px-3 py-1.5 rounded-full font-bold">🔄 New Hadith</button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white text-[#0f172a] rounded-[20px] p-5 shadow-lg relative overflow-hidden">
            <p className="text-[11px] opacity-60 tracking-widest">YOU OWE</p>
            <p className="text-2xl font-extrabold mt-2">₦{youOwe.toLocaleString()}</p>
          </div>
          <div className="bg-[#D4AF37] text-[#0f172a] rounded-[20px] p-5 shadow-lg shadow-[#D4AF37]/20">
            <p className="text-[11px] opacity-70 tracking-widest">THEY OWE YOU</p>
            <p className="text-2xl font-extrabold mt-2">₦{theyOwe.toLocaleString()}</p>
          </div>
        </div>

        {/* ADDED: Share + Wasiyyah buttons */}
        <div className="flex gap-2">
          <button onClick={shareVault} className="flex-1 py-3 bg-white/10 border border-white/10 rounded-xl font-bold text-sm">↗️ Share Vault</button>
          <a href="/wasiyyah" className="flex-1 py-3 bg-[#D4AF37] text-[#0f172a] rounded-xl font-bold text-sm text-center no-underline">📜 My Wasiyyah</a>
          <a href="/donate" className="flex-1 py-3 bg-white text-[#0f172a] rounded-xl font-bold text-sm text-center no-underline">❤️ Donate</a>
        </div>

        {/* Debt List — YOUR ORIGINAL CODE STILL DEY */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Recent Haqq</h2>
            <button onClick={() => setShowAdd(true)} className="text-xs bg-white/10 border border-white/10 px-3 py-1.5 rounded-full">+ Add</button>
          </div>

          {debts.length === 0 ? (
            <div className="bg-white/5 border border-dashed border-white/10 rounded-[20px] p-10 text-center">
              <div className="text-4xl mb-3">✨</div>
              <p className="font-semibold">Your Haqq is clear</p>
              <p className="text-sm text-gray-400 mt-1">Alhamdulillah, no pending debts</p>
            </div>
          ) : (
            <div className="space-y-3">
              {debts.map((d) => (
                <div key={d.id} className="bg-white text-[#0f172a] rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <p className="font-bold">{d.person}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{d.type === 'i_owe' ? 'You owe' : 'Owes you'} • Due {d.due_date || '—'} {d.note && `• ${d.note}`}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-extrabold ${d.type === 'i_owe' ? 'text-red-600' : 'text-green-700'}`}>₦{d.amount.toLocaleString()}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${d.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{d.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 md:bottom-8 right-6 w-14 h-14 bg-[#D4AF37] text-[#0f172a] rounded-full shadow-xl flex items-center justify-center text-2xl font-bold">+</button>

      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0f172a] border-t border-white/10 flex justify-around py-3 text-[11px] text-gray-400">
        <a href="/" className="flex flex-col items-center"><span>🏠</span>Home</a>
        <a href="/vault" className="flex flex-col items-center text-[#D4AF37]"><span>🔒</span>Vault</a>
        <a href="/donate" className="flex flex-col items-center"><span>❤️</span>Donate</a>
        <a href="/wasiyyah" className="flex flex-col items-center"><span>📜</span>Wasi</a>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-white text-[#0f172a] w-full md:max-w-md rounded-t-[28px] md:rounded-[24px] p-6">
            <h3 className="font-bold text-lg">Record New Haqq</h3>
            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={()=>setNewDebt({...newDebt, type: 'i_owe'})} className={`p-3 rounded-xl border text-sm font-bold ${newDebt.type==='i_owe' ? 'bg-[#0f172a] text-white' : 'bg-gray-50'}`}>I Owe</button>
                <button onClick={()=>setNewDebt({...newDebt, type: 'they_owe'})} className={`p-3 rounded-xl border text-sm font-bold ${newDebt.type==='they_owe' ? 'bg-[#D4AF37] text-[#0f172a]' : 'bg-gray-50'}`}>They Owe Me</button>
              </div>
              <input value={newDebt.person} onChange={e=>setNewDebt({...newDebt, person: e.target.value})} placeholder="Person name" className="w-full p-3.5 bg-gray-50 rounded-xl border" />
              <input value={newDebt.amount} onChange={e=>setNewDebt({...newDebt, amount: e.target.value})} type="number" placeholder="Amount ₦" className="w-full p-3.5 bg-gray-50 rounded-xl border" />
              <input value={newDebt.due_date} onChange={e=>setNewDebt({...newDebt, due_date: e.target.value})} type="date" className="w-full p-3.5 bg-gray-50 rounded-xl border" />
              <input value={newDebt.note} onChange={e=>setNewDebt({...newDebt, note: e.target.value})} placeholder="Note / Purpose e.g. School fee, Kaffarah, Wasi" className="w-full p-3.5 bg-gray-50 rounded-xl border" />
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
