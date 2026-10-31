"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function VaultPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [debts, setDebts] = useState<any[]>([]);
  const [type, setType] = useState("Debt I Owe");
  const [amount, setAmount] = useState("");
  const [who, setWho] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return router.push("/account");
      setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "User");
      const { data } = await supabase.from("debts").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      if (data) setDebts(data);
    })();
  }, []);

  async function addDebt(e: React.FormEvent) {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase.from("debts").insert({
      user_id: user?.id,
      type, amount: amount ? Number(amount) : null,
      who, description: desc,
      is_paid: false
    }).select().single();
    if (!error && data) {
      setDebts([data, ...debts]);
      setAmount(""); setWho(""); setDesc("");
    }
  }

  async function togglePaid(id: string, current: boolean) {
    await supabase.from("debts").update({ is_paid: !current }).eq("id", id);
    setDebts(debts.map(d => d.id === id ? { ...d, is_paid: !current } : d));
  }

  async function deleteDebt(id: string) {
    if (!confirm("Delete this record?")) return;
    await supabase.from("debts").delete().eq("id", id);
    setDebts(debts.filter(d => d.id !== id));
  }

  return (
    <div className="min-h-screen bg-[#f6f7f9] px-4 py-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">Salam, {userName} 👋</h1>
          <p className="text-sm text-gray-500">Your Haqq Vault</p>
        </div>
        <button onClick={async()=>{await supabase.auth.signOut(); router.push("/account")}} className="text-sm text-gray-600">Logout</button>
      </div>

      <form onSubmit={addDebt} className="bg-white rounded-2xl p-4 shadow-sm space-y-3 mb-6">
        <div className="flex gap-2">
          <select value={type} onChange={e=>setType(e.target.value)} className="flex-1 p-3 rounded-xl border bg-gray-50">
            <option>Debt I Owe</option>
            <option>Debt Owed To Me</option>
          </select>
          <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount (optional)" type="number" className="flex-1 p-3 rounded-xl border bg-gray-50" />
        </div>
        <input value={who} onChange={e=>setWho(e.target.value)} placeholder="Who? e.g. Ahmed" className="w-full p-3 rounded-xl border bg-gray-50" />
        <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What happened? e.g. Borrowed 5k in March" className="w-full p-3 rounded-xl border bg-gray-50" rows={2} />
        <button className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold">Lock Inside Vault 🔒</button>
      </form>

      <div className="space-y-3">
        {debts.map(d => (
          <div key={d.id} className={`bg-white rounded-2xl p-4 shadow-sm flex justify-between ${d.is_paid ? "opacity-60" : ""}`}>
            <div className="flex-1">
              <p className={`font-medium ${d.is_paid ? "line-through" : ""}`}>{d.description || d.who}</p>
              <p className="text-xs text-gray-500 mt-1">{d.who} • {d.type} {d.is_paid && "• PAID ✓"}</p>
            </div>
            <div className="text-right ml-3">
              <p className="font-bold">{d.amount || ""}</p>
              <div className="flex gap-2 mt-2">
                <button onClick={()=>togglePaid(d.id, d.is_paid)} className={`text-xs px-3 py-1 rounded-full ${d.is_paid ? "bg-gray-200" : "bg-green-100 text-green-700"}`}>{d.is_paid ? "Undo" : "Paid Off"}</button>
                <button onClick={()=>deleteDebt(d.id)} className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
