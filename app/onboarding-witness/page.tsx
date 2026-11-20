"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function WitnessPage() {
  const [w1, setW1] = useState({ name: "", phone: "", email: "", relationship: "Wife" });
  const [w2, setW2] = useState({ name: "", phone: "", email: "", relationship: "Brother" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const { data } = await supabase.from('witnesses').select('*').eq('user_id', user.id).order('created_at');
      if (data && data.length >= 2) {
        setW1({ name: data[0].name || "", phone: data[0].phone || "", email: data[0].email || "", relationship: data[0].relationship || "Wife" });
        setW2({ name: data[1].name || "", phone: data[1].phone || "", email: data[1].email || "", relationship: data[1].relationship || "Brother" });
      }
    }
    load();
  }, []);

  function makeToken() {
    // Simple random token
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  async function save() {
    setErrorMsg("");
    if (!w1.name.trim() || !w1.phone.trim() || !w1.email.trim() || !w2.name.trim() || !w2.phone.trim() || !w2.email.trim()) {
      setErrorMsg("Please add 2 witnesses with name, phone and email. This is for your safety.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(w1.email.trim()) || !emailRegex.test(w2.email.trim())) {
      setErrorMsg("Please enter a valid email for both witnesses.");
      return;
    }
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Get owner name - from user metadata or email
    const owner_name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0] || "Your loved one";

    const token1 = makeToken();
    const token2 = makeToken();

    // 1. Delete old witnesses first
    await supabase.from('witnesses').delete().eq('user_id', user.id);

    // 2. Insert fresh 2 witnesses with token + email
    const { error } = await supabase.from('witnesses').insert([
      { user_id: user.id, name: w1.name.trim(), phone: w1.phone.trim(), email: w1.email.trim().toLowerCase(), relationship: w1.relationship, token: token1, confirmed: false },
      { user_id: user.id, name: w2.name.trim(), phone: w2.phone.trim(), email: w2.email.trim().toLowerCase(), relationship: w2.relationship, token: token2, confirmed: false },
    ]);

    if (error) {
      console.log(error);
      setLoading(false);
      setErrorMsg("Could not save witnesses. Please try again.");
      return;
    }

    // 3. Send email to both witnesses via notify-witness function
    try {
      await supabase.functions.invoke('notify-witness', {
        body: { witness_email: w1.email.trim().toLowerCase(), witness_name: w1.name.trim(), owner_name, token: token1 }
      });
      await supabase.functions.invoke('notify-witness', {
        body: { witness_email: w2.email.trim().toLowerCase(), witness_name: w2.name.trim(), owner_name, token: token2 }
      });
    } catch (e) {
      console.log("Email send error:", e);
      // No block user even if email fail - witnesses don save already
    }

    setLoading(false);
    router.push("/home");
  }

  const inputClass = "w-full p-3 bg-gray-50 rounded-xl border outline-none text-[#0f172a] placeholder:text-gray-400 focus:border-[#0f172a] focus:bg-white";
  const selectClass = "w-full p-3 bg-gray-50 rounded-xl border outline-none text-[#0f172a] focus:border-[#0f172a] focus:bg-white";

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="font-extrabold text-[24px]">Who should we contact?</h1>
        <p className="text-sm text-gray-400 mt-1">If you do not check in for 14 days, we will email and call these 2 people to confirm if you are okay. This is how we protect your Wasiyyah.</p>
        <div className="bg-white text-[#0f172a] rounded-[24px] p-5 mt-5 space-y-4">
          {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium p-3 rounded-xl">{errorMsg}</div>}
          <p className="font-bold">Witness 1</p>
          <input value={w1.name} onChange={e=>setW1({...w1, name: e.target.value})} placeholder="Full Name" className={inputClass} />
          <input value={w1.phone} onChange={e=>setW1({...w1, phone: e.target.value})} placeholder="Phone e.g +234..." className={inputClass} />
          <input value={w1.email} onChange={e=>setW1({...w1, email: e.target.value})} placeholder="Email e.g zamaritech@gmail.com" type="email" className={inputClass} />
          <select value={w1.relationship} onChange={e=>setW1({...w1, relationship: e.target.value})} className={selectClass}>
            <option>Wife</option><option>Husband</option><option>Brother</option><option>Sister</option><option>Father</option><option>Mother</option><option>Imam</option><option>Friend</option>
          </select>
          <p className="font-bold pt-2">Witness 2</p>
          <input value={w2.name} onChange={e=>setW2({...w2, name: e.target.value})} placeholder="Full Name" className={inputClass} />
          <input value={w2.phone} onChange={e=>setW2({...w2, phone: e.target.value})} placeholder="Phone e.g +234..." className={inputClass} />
          <input value={w2.email} onChange={e=>setW2({...w2, email: e.target.value})} placeholder="Email e.g liasuhabeeb@gmail.com" type="email" className={inputClass} />
          <select value={w2.relationship} onChange={e=>setW2({...w2, relationship: e.target.value})} className={selectClass}>
            <option>Brother</option><option>Sister</option><option>Wife</option><option>Husband</option><option>Father</option><option>Mother</option><option>Imam</option><option>Friend</option>
          </select>
          <button onClick={save} disabled={loading} className="w-full bg-[#0f172a] text-white py-3.5 rounded-full font-bold disabled:opacity-50">{loading ? "Sending invites..." : "Save & Continue →"}</button>
        </div>
      </div>
    </div>
  );
      }
