"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Wasiyyah = {
  id?: string;
  full_name: string;
  debts_to_pay: string;
  debts_owed_to_me: string;
  wasiyyah_text: string;
  heirs: string;
  witness1: string;
  witness2: string;
  created_at?: string;
};

export default function WasiyyahPage() {
  const [wasi, setWasi] = useState<Wasiyyah>({
    full_name: "",
    debts_to_pay: "",
    debts_owed_to_me: "",
    wasiyyah_text: "",
    heirs: "",
    witness1: "",
    witness2: "",
  });
  const [saved, setSaved] = useState<Wasiyyah | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWasiyyah();
  }, []);

  async function fetchWasiyyah() {
    const { data } = await supabase.from('wasiyyah').select('*').order('created_at', { ascending: false }).limit(1);
    if (data && data[0]) { setSaved(data[0]); setWasi(data[0]); }
  }

  async function saveWasiyyah() {
    if (!wasi.full_name || !wasi.wasiyyah_text) { alert("Please fill Full Name and Wasiyyah text"); return; }
    setLoading(true);
    const { data, error } = await supabase.from('wasiyyah').insert([wasi]).select();
    setLoading(false);
    if (!error && data) { setSaved(data[0]); alert("Wasiyyah saved to Vault ✅"); }
    else { alert("Error saving: " + error?.message); }
  }

  const shareWasi = async () => {
    const text = `My Wasiyyah (Islamic Will) — Quran 2:282\nName: ${wasi.full_name}\nHeirs: ${wasi.heirs}\nSaved securely on HAQQ Vault`;
    if (navigator.share) { await navigator.share({ title: "My Wasiyyah", text }); }
    else { navigator.clipboard.writeText(text); alert("Wasiyyah copied!"); }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-28">
      <div className="px-6 py-5 flex justify-between items-center border-b border-white/10 sticky top-0 bg-[#0f172a]/90 backdrop-blur z-20">
        <h1 className="font-bold text-lg tracking-widest">WASIYYAH <span className="text-[#D4AF37]">📜</span></h1>
        <a href="/vault" className="text-xs bg-white/10 px-3 py-1.5 rounded-full">Back to Vault</a>
      </div>

      <div className="max-w-2xl mx-auto px-5 py-6 space-y-6">
        {/* Quran Banner */}
        <div className="bg-gradient-to-r from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 rounded-2xl p-4">
          <p className="text-[11px] tracking-widest text-[#D4AF37]">QURAN 2:282 • HADITH</p>
          <p className="text-sm text-gray-300 mt-1">“It is not right for a Muslim who has something to bequeath to sleep for two nights without having his will written.” — Bukhari & Muslim</p>
        </div>

        {/* Saved Preview */}
        {saved && (
          <div className="bg-white text-[#0f172a] rounded-[20px] p-6 shadow-xl">
            <p className="text-[10px] tracking-widest opacity-60">SAVED WASIYYAH — {new Date(saved.created_at!).toLocaleDateString()}</p>
            <p className="font-bold text-lg mt-2">{saved.full_name}</p>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="font-bold">Debts to Pay:</span> {saved.debts_to_pay || "None"}</p>
              <p><span className="font-bold">Debts Owed to Me:</span> {saved.debts_owed_to_me || "None"}</p>
              <p><span className="font-bold">Wasiyyah:</span> {saved.wasiyyah_text}</p>
              <p><span className="font-bold">Heirs:</span> {saved.heirs}</p>
              <p className="text-xs text-gray-500 mt-3">Witness 1: {saved.witness1} • Witness 2: {saved.witness2}</p>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => window.print()} className="flex-1 py-2.5 bg-[#0f172a] text-white rounded-xl font-bold text-sm">🖨️ Print / PDF</button>
              <button onClick={shareWasi} className="flex-1 py-2.5 bg-[#D4AF37] text-[#0f172a] rounded-xl font-bold text-sm">↗️ Share</button>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white text-[#0f172a] rounded-[24px] p-6 shadow-xl">
          <h2 className="font-bold text-lg">Write Your Wasiyyah</h2>
          <p className="text-xs text-gray-500 mt-1">For Amanah — this is Sunnah. Your family will need it.</p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-[11px] font-bold tracking-widest opacity-60">FULL NAME (As in ID)</label>
              <input value={wasi.full_name} onChange={e => setWasi({ ...wasi, full_name: e.target.value })} placeholder="Liasu Habeeblah Olalekan" className="w-full mt-1 p-3.5 bg-gray-50 rounded-xl border outline-none focus:border-[#D4AF37]" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold tracking-widest opacity-60">DEBTS I OWE (To Pay)</label>
                <textarea value={wasi.debts_to_pay} onChange={e => setWasi({ ...wasi, debts_to_pay: e.target.value })} placeholder="e.g. ₦50k to Musa - due Dec 2025" className="w-full mt-1 p-3.5 bg-gray-50 rounded-xl border h-24 outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold tracking-widest opacity-60">DEBTS OWED TO ME</label>
                <textarea value={wasi.debts_owed_to_me} onChange={e => setWasi({ ...wasi, debts_owed_to_me: e.target.value })} placeholder="e.g. ₦20k - Ahmed - for school fee help" className="w-full mt-1 p-3.5 bg-gray-50 rounded-xl border h-24 outline-none" />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold tracking-widest opacity-60">MY WASIYYAH / WILL (Core)</label>
              <textarea value={wasi.wasiyyah_text} onChange={e => setWasi({ ...wasi, wasiyyah_text: e.target.value })} placeholder="I bequeath 1/3 of my wealth for Sadaqah Jariyah... Pay my debts first... Bury me according to Sunnah... Support Imam, feed poor family, pay student fee as per my intention..." className="w-full mt-1 p-3.5 bg-gray-50 rounded-xl border h-36 outline-none" />
              <p className="text-[11px] text-gray-400 mt-1">Tip: You can add your 6 purposes here: school fee, feed family, kaffarah, support Imam, etc.</p>
            </div>

            <div>
              <label className="text-[11px] font-bold tracking-widest opacity-60">HEIRS / FAMILY CONTACT</label>
              <input value={wasi.heirs} onChange={e => setWasi({ ...wasi, heirs: e.target.value })} placeholder="Wife: 080..., Brother: 070... - Next of kin" className="w-full mt-1 p-3.5 bg-gray-50 rounded-xl border outline-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold tracking-widest opacity-60">WITNESS 1</label>
                <input value={wasi.witness1} onChange={e => setWasi({ ...wasi, witness1: e.target.value })} placeholder="Name + Phone" className="w-full mt-1 p-3.5 bg-gray-50 rounded-xl border outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold tracking-widest opacity-60">WITNESS 2</label>
                <input value={wasi.witness2} onChange={e => setWasi({ ...wasi, witness2: e.target.value })} placeholder="Name + Phone" className="w-full mt-1 p-3.5 bg-gray-50 rounded-xl border outline-none" />
              </div>
            </div>

            <button onClick={saveWasiyyah} disabled={loading} className="w-full mt-2 p-4 bg-[#0f172a] text-white rounded-xl font-bold hover:opacity-90 transition">
              {loading ? "Saving..." : "🔒 Save Wasiyyah to Vault"}
            </button>
            <p className="text-[11px] text-center text-gray-400">Stored securely in Supabase • Only you + heirs can access • Quran 2:282</p>
          </div>
        </div>

        {/* Quick Dua */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
          <p className="text-sm">“O Allah, make my Wasiyyah a means of Sadaqah Jariyah for me after death.”</p>
          <p className="text-[11px] text-gray-400 mt-1">Share your vault with trusted family.</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0f172a] border-t border-white/10 flex justify-around py-3 text-[11px] text-gray-400">
        <a href="/" className="flex flex-col items-center"><span>🏠</span>Home</a>
        <a href="/vault" className="flex flex-col items-center"><span>🔒</span>Vault</a>
        <a href="/donate" className="flex flex-col items-center"><span>❤️</span>Donate</a>
        <a href="/wasiyyah" className="flex flex-col items-center text-[#D4AF37]"><span>📜</span>Wasi</a>
      </div>
    </div>
  );
}
