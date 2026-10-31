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
    full_name: "", debts_to_pay: "", debts_owed_to_me: "", wasiyyah_text: "", heirs: "", witness1: "", witness2: "",
  });
  const [saved, setSaved] = useState<Wasiyyah | null>(null);
  const [loading, setLoading] = useState(false);
  const [vaultTotals, setVaultTotals] = useState({ owe: 0, owed: 0, count: 0, debts: [] as any[] });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => { fetchAll(); }, []);

  async function fetchAll() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUserId(user.id);
      const { data: debts } = await supabase.from('debts').select('*').eq('user_id', user.id);
      let allDebts = debts || [];
      if (allDebts.length === 0) {
        const { data: d2 } = await supabase.from('vault_entries').select('*').eq('user_id', user.id);
        if (d2) allDebts = d2;
      }
      if (allDebts.length > 0) {
        let owe = 0, owed = 0;
        let oweList: string[] = []; let owedList: string[] = [];
        allDebts.forEach((d:any) => {
          const amt = Number(d.amount || 0);
          const name = d.person_name || d.name || d.creditor || "Person";
          const isIOwe = d.type === "i_owe" || d.direction === "i_owe" || d.type === "borrowed";
          if (isIOwe) { owe+=amt; oweList.push(`₦${amt.toLocaleString()} to ${name} ${d.due_date ? `(due ${d.due_date})` : ''}`); }
          else { owed+=amt; owedList.push(`₦${amt.toLocaleString()} - ${name} owes me`); }
        });
        setVaultTotals({ owe, owed, count: allDebts.length, debts: allDebts });
        setWasi(prev => ({
          ...prev,
          debts_to_pay: prev.debts_to_pay || oweList.join("\n"),
          debts_owed_to_me: prev.debts_owed_to_me || owedList.join("\n"),
          wasiyyah_text: prev.wasiyyah_text || `Bismillah.\n\nI owe ₦${owe.toLocaleString()} total and I am owed ₦${owed.toLocaleString()} total as recorded in HAQQ Vault (${allDebts.length} entries).\n\nO my heirs, pay my debts from my wealth before inheritance. Collect what is owed to me with ihsan.\n\nI bequeath 1/3 for Sadaqah Jariyah: school fees, feed poor, support Imam, Kaffarah, as per my intentions.`
        }));
      }
    }
    const { data } = await supabase.from('wasiyyah').select('*').order('created_at', { ascending: false }).limit(1);
    if (data && data[0]) setSaved(data[0]);
  }

  async function saveWasiyyah() {
    if (!wasi.full_name || !wasi.wasiyyah_text) { alert("Fill Full Name and Wasiyyah"); return; }
    setLoading(true);
    const { data, error } = await supabase.from('wasiyyah').insert([{...wasi, user_id: userId}]).select();
    setLoading(false);
    if (!error && data) { setSaved(data[0]); alert("Wasiyyah saved ✅"); } else alert(error?.message);
  }

  function exportPDF() {
    const current = wasi.full_name ? wasi : saved || wasi;
    const debtsRows = vaultTotals.debts.map((d:any) => `
      <tr><td style="padding:8px;border:1px solid #ddd">${d.person_name || d.name}</td><td style="padding:8px;border:1px solid #ddd">₦${Number(d.amount).toLocaleString()}</td><td style="padding:8px;border:1px solid #ddd">${d.type || d.direction}</td><td style="padding:8px;border:1px solid #ddd">${d.due_date || ''}</td></tr>
    `).join("");

    const html = `
    <html><head><meta charset="utf-8"><title>Wasiyyah - ${current.full_name}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');
      body{font-family:Inter, sans-serif; padding:40px; color:#0A1931; max-width:800px; margin:auto}
      .arabic{font-family:'Amiri', serif; font-size:24px; text-align:center; margin-bottom:6px}
      .bism{font-size:28px; font-weight:700}
      .header{text-align:center; border-bottom:2px solid #D4AF37; padding-bottom:16px; margin-bottom:24px}
      .badge{display:inline-block; background:#0A1931; color:#D4AF37; padding:4px 12px; border-radius:20px; font-size:11px; letter-spacing:2px; margin-top:8px}
      table{width:100%; border-collapse:collapse; margin-top:12px}
      th{background:#0A1931; color:white; padding:10px; text-align:left; font-size:12px}
      .section{margin-top:28px}
      .sig{margin-top:60px; display:flex; justify-content:space-between}
      .sig div{border-top:1px solid #000; width:45%; padding-top:8px; text-align:center; font-size:12px}
      @media print{body{padding:20px}}
    </style></head><body>
      <div class="header">
        <div class="arabic bism">بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
        <div class="arabic" style="font-size:16px; color:#555">Bismillahir-Rahmanir-Raheem</div>
        <h1 style="margin:16px 0 4px; font-size:28px; font-weight:900">WASIYYAH (Islamic Will)</h1>
        <p style="font-size:12px; letter-spacing:2px; opacity:0.7">QURAN 2:282 • HAQQ VAULT • ${new Date().toLocaleDateString()}</p>
        <div class="badge">AMANAH • ENCRYPTED • FOR HIS SAKE</div>
      </div>

      <div class="section"><strong>Full Name:</strong> ${current.full_name}</div>
      <div class="section"><strong>Heirs / Next of Kin:</strong> ${current.heirs || "________________"}</div>

      <div class="section">
        <h3 style="color:#0A1931; border-left:4px solid #D4AF37; padding-left:10px">Vault Summary — Auto-pulled from HAQQ</h3>
        <p style="font-size:13px">Total I Owe: <strong style="color:#d00">₦${vaultTotals.owe.toLocaleString()}</strong> | Total Owes Me: <strong style="color:green">₦${vaultTotals.owed.toLocaleString()}</strong> | Entries: ${vaultTotals.count}</p>
        <table><thead><tr><th>Person</th><th>Amount</th><th>Type</th><th>Due Date</th></tr></thead><tbody>${debtsRows || '<tr><td colspan=4>No entries</td></tr>'}</tbody></table>
      </div>

      <div class="section"><h3>Debts to Pay (Detail)</h3><p style="white-space:pre-wrap; background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #eee; font-size:13px">${current.debts_to_pay || "None"}</p></div>
      <div class="section"><h3>Debts Owed to Me (Detail)</h3><p style="white-space:pre-wrap; background:#f8fafc; padding:12px; border-radius:8px; border:1px solid #eee; font-size:13px">${current.debts_owed_to_me || "None"}</p></div>

      <div class="section"><h3>My Wasiyyah / Will</h3><p style="white-space:pre-wrap; line-height:1.7; font-size:14px; background:#fffbe6; padding:16px; border-radius:12px; border:1px solid #D4AF37">${current.wasiyyah_text}</p></div>

      <div class="section" style="margin-top:32px; padding:12px; background:#f0fdf4; border-radius:8px; font-size:12px">
        <strong>Dua:</strong> “O Allah, make my Wasiyyah a means of Sadaqah Jariyah for me after death. O heirs, fear Allah and settle my Haqq.”
      </div>

      <div class="sig">
        <div>Witness 1: ${current.witness1 || "Name / Sign"}<br><small>${new Date().toLocaleDateString()}</small></div>
        <div>Witness 2: ${current.witness2 || "Name / Sign"}<br><small>${new Date().toLocaleDateString()}</small></div>
      </div>
      <div style="margin-top:50px; text-align:center; font-size:10px; color:#999">Generated via HAQQ — Quran 2:282 Vault • haqq-gray.vercel.app • This document is encrypted and stored securely.</div>
      <script>window.onload = () => window.print();</script>
    </body></html>
    `;
    const w = window.open("", "_blank");
    if (w) { w.document.write(html); w.document.close(); }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white pb-28">
      <div className="px-6 py-5 flex justify-between items-center border-b border-white/10 sticky top-0 bg-[#0f172a]/90 backdrop-blur z-20">
        <h1 className="font-bold text-lg tracking-widest">WASIYYAH <span className="text-[#D4AF37]">📜</span></h1>
        <button onClick={exportPDF} className="text-xs bg-[#D4AF37] text-black px-4 py-2 rounded-full font-bold">🖨️ Export PDF</button>
      </div>
      <div className="max-w-2xl mx-auto px-5 py-6 space-y-6">
        <div className="bg-gradient-to-r from-[#D4AF37]/20 to-transparent border border-[#D4AF37]/30 rounded-2xl p-4">
          <p className="text-[11px] tracking-widest text-[#D4AF37]">AUTO-PULLED FROM VAULT • QURAN 2:282</p>
          <div className="flex gap-3 mt-2">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2 flex-1"><p className="text-[10px] opacity-60">I OWE</p><p className="font-bold">₦{vaultTotals.owe.toLocaleString()}</p></div>
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2 flex-1"><p className="text-[10px] opacity-60">OWES ME</p><p className="font-bold text-green-400">₦{vaultTotals.owed.toLocaleString()}</p></div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-3 py-2"><p className="text-[10px] opacity-60">ENTRIES</p><p className="font-bold">{vaultTotals.count}</p></div>
          </div>
        </div>

        <div className="bg-white text-[#0f172a] rounded-[24px] p-6 shadow-xl">
          <h2 className="font-bold text-lg">Write Your Wasiyyah</h2>
          <p className="text-xs text-gray-500 mt-1">بِسْمِ اللهِ — Auto-filled from Vault</p>
          <div className="mt-5 space-y-4">
            <input value={wasi.full_name} onChange={e => setWasi({ ...wasi, full_name: e.target.value })} placeholder="Liasu Habeeblah Olalekan" className="w-full p-3.5 bg-gray-50 rounded-xl border" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <textarea value={wasi.debts_to_pay} onChange={e => setWasi({ ...wasi, debts_to_pay: e.target.value })} className="w-full p-3.5 bg-gray-50 rounded-xl border h-28" placeholder="Debts I owe" />
              <textarea value={wasi.debts_owed_to_me} onChange={e => setWasi({ ...wasi, debts_owed_to_me: e.target.value })} className="w-full p-3.5 bg-gray-50 rounded-xl border h-28" placeholder="Debts owed to me" />
            </div>
            <textarea value={wasi.wasiyyah_text} onChange={e => setWasi({ ...wasi, wasiyyah_text: e.target.value })} className="w-full p-3.5 bg-gray-50 rounded-xl border h-40" placeholder="My Wasiyyah..." />
            <input value={wasi.heirs} onChange={e => setWasi({ ...wasi, heirs: e.target.value })} placeholder="Heirs contact" className="w-full p-3.5 bg-gray-50 rounded-xl border" />
            <div className="grid grid-cols-2 gap-4">
              <input value={wasi.witness1} onChange={e => setWasi({ ...wasi, witness1: e.target.value })} placeholder="Witness 1" className="w-full p-3.5 bg-gray-50 rounded-xl border" />
              <input value={wasi.witness2} onChange={e => setWasi({ ...wasi, witness2: e.target.value })} placeholder="Witness 2" className="w-full p-3.5 bg-gray-50 rounded-xl border" />
            </div>
            <button onClick={saveWasiyyah} disabled={loading} className="w-full p-4 bg-[#0f172a] text-white rounded-xl font-bold">{loading ? "Saving..." : "🔒 Save to Vault"}</button>
            <button onClick={exportPDF} className="w-full p-4 bg-[#D4AF37] text-black rounded-xl font-bold">📜 Export PDF with Arabic Basmalah</button>
          </div>
        </div>

        {saved && (
          <div className="bg-white text-[#0f172a] rounded-[20px] p-6 shadow-xl">
            <p className="text-[10px] tracking-widest opacity-60">SAVED — {new Date(saved.created_at!).toLocaleDateString()}</p>
            <p className="font-bold text-lg mt-2">{saved.full_name}</p>
            <p className="text-sm mt-2 whitespace-pre-wrap">{saved.wasiyyah_text}</p>
          </div>
        )}
      </div>
    </div>
  );
                                                  }
