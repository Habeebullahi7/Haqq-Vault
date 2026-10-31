"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const HAQQ_TYPES = [
  "Debt I Owe 💰",
  "Debt Owed To Me 💰",
  "Who I Offended 😔",
  "Who Offended Me 💔",
  "Who I Probably Cheated ⚖️",
  "Who I Backbit (Gheebah) 🗣️",
  "Who I Owe Apology To 🙏",
  "Who I Need To Forgive 🤲",
  "Trust / Amanah Given To Me",
];

export default function VaultPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [debts, setDebts] = useState<any[]>([]);
  const [type, setType] = useState(HAQQ_TYPES[0]);
  const [amount, setAmount] = useState("");
  const [who, setWho] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [fix, setFix] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/account");
      setUserName(user.user_metadata?.full_name || "User");
      const { data } = await supabase.from("debts").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data) setDebts(data);
    })();
  }, []);

  async function addDebt(e: React.FormEvent) {
    e.preventDefault();
    if (!who.trim() || !desc.trim()) return alert("Fill Who and What happened");
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("debts").insert({
      user_id: user?.id, type, amount: amount ? Number(amount) : null,
      who, description: desc, incident_date: date || null, how_to_fix: fix || null, is_paid: false
    }).select().single();
    if (!error && data) {
      setDebts([data, ...debts]);
      setAmount(""); setWho(""); setDesc(""); setFix("");
    } else if (error) alert(error.message);
  }

  async function togglePaid(id: string, current: boolean) {
    await supabase.from("debts").update({ is_paid: !current }).eq("id", id);
    setDebts(debts.map(d => d.id === id ? { ...d, is_paid: !current } : d));
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] px-4 py-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">Salam, {userName} 👋</h1>
          <p className="text-sm text-gray-500">Your Haqq Vault — Rights of People</p>
        </div>
        <button onClick={async()=>{await supabase.auth.signOut(); router.push("/")}} className="text-sm text-gray-500">Logout</button>
      </div>

      <form onSubmit={addDebt} className="bg-white rounded-2xl p-4 shadow-sm space-y-3 mb-6">
        <select value={type} onChange={e=>setType(e.target.value)} className="w-full p-3 rounded-xl border bg-gray-50 font-medium">
          {HAQQ_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>

        <div className="flex gap-2">
          <input value={who} onChange={e=>setWho(e.target.value)} placeholder="Who? e.g. Ahmed" className="flex-1 p-3 rounded-xl border bg-gray-50" />
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="flex-1 p-3 rounded-xl border bg-gray-50" />
        </div>

        <div className="flex gap-2">
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount if money" type="number" className="flex-1 p-3 rounded-xl border bg-gray-50" />
          <input value={fix} onChange={e=>setFix(e.target.value)} placeholder="How to fix? e.g. Call him & apologize" className="flex-1 p-3 rounded-xl border bg-gray-50" />
        </div>

        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What happened? e.g. I backbit him in group chat" className="w-full p-3 rounded-xl border bg-gray-50" rows={2} />

        <button className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold">Lock Inside Vault 🔒</button>
      </form>

      <div className="space-y-3">
        {debts.map(d => (
          <div key={d.id} className={`bg-white rounded-2xl p-4 shadow-sm border ${d.is_paid ? "opacity-60 border-green-200" : "border-transparent"}`}>
            <div className="flex justify-between">
              <div className="flex-1">
                <p className="text-[11px] text-gray-500 uppercase">{d.type} {d.incident_date ? `• ${d.incident_date}` : ""}</p>
                <p className={`${d.is_paid ? "line-through" : ""} font-medium mt-1`}>{d.description}</p>
                <p className="text-xs text-gray-600 mt-1">With: {d.who} {d.amount ? `• ₦${d.amount}` : ""}</p>
                {d.how_to_fix && <p className="text-xs bg-yellow-50 text-yellow-800 mt-2 p-2 rounded-lg">Fix: {d.how_to_fix}</p>}
              </div>
              <button onClick={()=>togglePaid(d.id, d.is_paid)} className={`h-fit ml-3 text-xs px-3 py-1.5 rounded-full ${d.is_paid ? "bg-gray-200" : "bg-green-100 text-green-700 font-semibold"}`}>{d.is_paid ? "Undo" : "Cleared ✓"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
