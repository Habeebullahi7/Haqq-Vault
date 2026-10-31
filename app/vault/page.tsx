"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Debt = { id: string; person: string; amount: number; type: 'i_owe' | 'they_owe'; due_date: string; note: string; status: 'pending' | 'paid' };

export default function VaultPage() {
  const [debts, setDebts] = useState<Debt[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newDebt, setNewDebt] = useState({ person: '', amount: '', type: 'i_owe', due_date: '', note: '' });

  useEffect(() => {
    fetchDebts();
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

  const youOwe = debts.filter(d => d.type === 'i_owe' && d.status === 'pending').reduce((s, d) => s + d.amount, 0);
  const theyOwe = debts.filter(d => d.type === 'they_owe' && d.status === 'pending').reduce((s, d) => s + d.amount, 0);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-24 md:pb-0">
      {/* Header */}
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

        {/* Summary Cards - Gold + Navy */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white text-[#0f172a] rounded-[20px] p-5 shadow-lg relative overflow-hidden animate-[fadeUp_0.5s]">
            <p className="text-[11px] opacity-60 tracking-widest">YOU OWE</p>
            <p className="text-2xl font-extrabold mt-2">₦{youOwe.toLocaleString()}</p>
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-red-100 rounded-full"></div>
          </div>
          <div className="bg-[#D4AF37] text-[#0f172a] rounded-[20px] p-5 shadow-lg shadow-[#D4AF37]/20 relative overflow-hidden animate-[fadeUp_0.5s_0.1s_both]">
            <p className="text-[11px] opacity-70 tracking-widest">THEY OWE YOU</p>
            <p className="text-2xl font-extrabold mt-2">₦{theyOwe.toLocaleString()}</p>
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/20 rounded-full"></div>
          </div>
        </div>

        {/* Debt List */}
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
              {debts.map((d, i) => (
                <div key={d.id} className="bg-white text-[#0f172a] rounded-2xl p-4 flex justify-between items-center animate-[fadeUp_0.4s_both]" style={{ animationDelay: `${i * 0.05}s` }}>
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

      {/* Floating Add Button - Gold */}
      <button onClick={() => setShowAdd(true)} className="fixed bottom-24 md:bottom-8 right-6 w-14 h-14 bg-[#D4AF37] text-[#0f172a] rounded-full shadow-xl shadow-[#D4AF37]/30 flex items-center justify-center text-2xl font-bold hover:scale-110 transition-transform">+</button>

      {/* Bottom Nav - Mobile real app feel */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0f172a] border-t border-white/10 flex justify-around py-3 text-[11px] text-gray-400">
        <a href="/" className="flex flex-col items-center"><span>🏠</span>Home</a>
        <a href="/vault" className="flex flex-col items-center text-[#D4AF37]"><span>🔒</span>Vault</a>
        <a href="/account" className="flex flex-col items-center"><span>👤</span>Account</a>
      </div>

      {/* Add Debt Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="bg-white text-[#0f172a] w-full md:max-w-md rounded-t-[28px] md:rounded-[24px] p-6 animate-[fadeUp_0.4s]">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5 md:hidden"></div>
            <h3 className="font-bold text-lg">Record New Haqq</h3>
            <p className="text-xs text-gray-500 mt-1">For Amanah, record with Niyyah</p>
            
            <div className="mt-5 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <button onClick={()=>setNewDebt({...newDebt, type: 'i_owe'})} className={`p-3 rounded-xl border text-sm font-bold ${newDebt.type==='i_owe' ? 'bg-[#0f172a] text-white border-[#0f172a]' : 'bg-gray-50'}`}>I Owe</button>
                <button onClick={()=>setNewDebt({...newDebt, type: 'they_owe'})} className={`p-3 rounded-xl border text-sm font-bold ${newDebt.type==='they_owe' ? 'bg-[#D4AF37] text-[#0f172a] border-[#D4AF37]' : 'bg-gray-50'}`}>They Owe Me</button>
              </div>
              <input value={newDebt.person} onChange={e=>setNewDebt({...newDebt, person: e.target.value})} placeholder="Person name (e.g. Musa)" className="w-full p-3.5 bg-gray-50 rounded-xl outline-none border focus:border-[#D4AF37]" />
              <input value={newDebt.amount} onChange={e=>setNewDebt({...newDebt, amount: e.target.value})} type="number" placeholder="Amount ₦" className="w-full p-3.5 bg-gray-50 rounded-xl outline-none border focus:border-[#D4AF37]" />
              <input value={newDebt.due_date} onChange={e=>setNewDebt({...newDebt, due_date: e.target.value})} type="date" className="w-full p-3.5 bg-gray-50 rounded-xl outline-none border" />
              <input value={newDebt.note} onChange={e=>setNewDebt({...newDebt, note: e.target.value})} placeholder="Note / Witness (optional)" className="w-full p-3.5 bg-gray-50 rounded-xl outline-none border" />
              
              <div className="flex gap-3 pt-2">
                <button onClick={()=>setShowAdd(false)} className="flex-1 p-3.5 bg-gray-100 rounded-xl font-bold">Cancel</button>
                <button onClick={addDebt} className="flex-1 p-3.5 bg-[#0f172a] text-white rounded-xl font-bold">Save Haqq</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
