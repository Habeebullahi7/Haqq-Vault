"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function WitnessPage() {
  const [w1, setW1] = useState({ name: "", phone: "", relationship: "Wife" });
  const [w2, setW2] = useState({ name: "", phone: "", relationship: "Brother" });
  const router = useRouter();

  async function save() {
    if (!w1.name || !w1.phone || !w2.name || !w2.phone) { alert("Add 2 witnesses — this is for your safety"); return; }
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    await supabase.from('witnesses').insert([
      { user_id: user.id, name: w1.name, phone: w1.phone, relationship: w1.relationship },
      { user_id: user.id, name: w2.name, phone: w2.phone, relationship: w2.relationship },
    ]);
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="font-extrabold text-[24px]">Who should we call?</h1>
        <p className="text-sm text-gray-400 mt-1">If you no check in for 14 days, we go call these 2 people to confirm if you are okay. This is how we protect your Wasiyyah.</p>
        <div className="bg-white text-[#0f172a] rounded-[24px] p-5 mt-5 space-y-4">
          <p className="font-bold">Witness 1</p>
          <input value={w1.name} onChange={e=>setW1({...w1, name: e.target.value})} placeholder="Full Name" className="w-full p-3 bg-gray-50 rounded-xl border" />
          <input value={w1.phone} onChange={e=>setW1({...w1, phone: e.target.value})} placeholder="Phone e.g +234..." className="w-full p-3 bg-gray-50 rounded-xl border" />
          <select value={w1.relationship} onChange={e=>setW1({...w1, relationship: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border">
            <option>Wife</option><option>Husband</option><option>Brother</option><option>Sister</option><option>Father</option><option>Mother</option><option>Imam</option><option>Friend</option>
          </select>
          <p className="font-bold pt-2">Witness 2</p>
          <input value={w2.name} onChange={e=>setW2({...w2, name: e.target.value})} placeholder="Full Name" className="w-full p-3 bg-gray-50 rounded-xl border" />
          <input value={w2.phone} onChange={e=>setW2({...w2, phone: e.target.value})} placeholder="Phone e.g +234..." className="w-full p-3 bg-gray-50 rounded-xl border" />
          <select value={w2.relationship} onChange={e=>setW2({...w2, relationship: e.target.value})} className="w-full p-3 bg-gray-50 rounded-xl border">
            <option>Brother</option><option>Sister</option><option>Wife</option><option>Husband</option><option>Father</option><option>Mother</option><option>Imam</option><option>Friend</option>
          </select>
          <button onClick={save} className="w-full bg-[#0f172a] text-white py-3.5 rounded-full font-bold">Save & Continue →</button>
        </div>
      </div>
    </div>
  );
}
