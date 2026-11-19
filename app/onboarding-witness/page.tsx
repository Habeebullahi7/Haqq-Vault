"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function WitnessPage() {
  const [w1, setW1] = useState({ name: "", phone: "", relationship: "Wife" });
  const [w2, setW2] = useState({ name: "", phone: "", relationship: "Brother" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  // Load old witnesses if e don save before — make e no duplicate
  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase.from('witnesses').select('*').eq('user_id', user.id).order('created_at');
      if (data && data.length >= 2) {
        setW1({ name: data[0].name, phone: data[0].phone, relationship: data[0].relationship });
        setW2({ name: data[1].name, phone: data[1].phone, relationship: data[1].relationship });
      }
    }
    load();
  }, []);

  async function save() {
    setErrorMsg("");
    if (!w1.name.trim() || !w1.phone.trim() || !w2.name.trim() || !w2.phone.trim()) {
      setErrorMsg("Please add 2 witnesses. This is for your safety.");
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // 1. Delete old witnesses first — so e no duplicate
    await supabase.from('witnesses').delete().eq('user_id', user.id);

    // 2. Insert fresh 2 witnesses
    const { error } = await supabase.from('witnesses').insert([
      { user_id: user.id, name: w1.name.trim(), phone: w1.phone.trim(), relationship: w1.relationship },
      { user_id: user.id, name: w2.name.trim(), phone: w2.phone.trim(), relationship: w2.relationship },
    ]);
    setLoading(false);
    if (error) {
      console.log(error);
      setErrorMsg("Could not save witnesses. Please try again.");
      return;
    }
    router.push("/home");
  }

  const inputClass = "w-full p-3 bg-gray-50 rounded-xl border outline-none text-[#0f172a] placeholder:text-gray-400 focus:border-[#0f172a] focus:bg-white";
  const selectClass = "w-full p-3 bg-gray-50 rounded-xl border outline-none text-[#0f172a] focus:border-[#0f172a] focus:bg-white";

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="font-extrabold text-[24px]">Who should we call?</h1>
        <p className="text-sm text-gray-400 mt-1">If you do not check in for 14 days, we will call these 2 people to confirm if you are okay. This is how we protect your Wasiyyah.</p>
        <div className="bg-white text-[#0f172a] rounded-[24px] p-5 mt-5 space-y-4">
          {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium p-3 rounded-xl">{errorMsg}</div>}
          <p className="font-bold">Witness 1</p>
          <input value={w1.name} onChange={e=>setW1({...w1, name: e.target.value})} placeholder="Full Name" className={inputClass} />
          <input value={w1.phone} onChange={e=>setW1({...w1, phone: e.target.value})} placeholder="Phone e.g +234..." className={inputClass} />
          <select value={w1.relationship} onChange={e=>setW1({...w1, relationship: e.target.value})} className={selectClass}>
            <option>Wife</option><option>Husband</option><option>Brother</option><option>Sister</option><option>Father</option><option>Mother</option><option>Imam</option><option>Friend</option>
          </select>
          <p className="font-bold pt-2">Witness 2</p>
          <input value={w2.name} onChange={e=>setW2({...w2, name: e.target.value})} placeholder="Full Name" className={inputClass} />
          <input value={w2.phone} onChange={e=>setW2({...w2, phone: e.target.value})} placeholder="Phone e.g +234..." className={inputClass} />
          <select value={w2.relationship} onChange={e=>setW2({...w2, relationship: e.target.value})} className={selectClass}>
            <option>Brother</option><option>Sister</option><option>Wife</option><option>Husband</option><option>Father</option><option>Mother</option><option>Imam</option><option>Friend</option>
          </select>
          <button onClick={save} disabled={loading} className="w-full bg-[#0f172a] text-white py-3.5 rounded-full font-bold disabled:opacity-50">{loading ? "Saving..." : "Save & Continue →"}</button>
        </div>
      </div>
    </div>
  );
      }
