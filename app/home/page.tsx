"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [streak, setStreak] = useState(0);
  const [showCheck, setShowCheck] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase.from('checkins').select('*').eq('user_id', user.id).gte('checked_at', today);
      if (!data || data.length === 0) setShowCheck(true);
    }
    init();
  }, []);

  async function doCheckIn() {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('checkins').insert([{ user_id: user?.id }]);
    setShowCheck(false);
    setStreak(s => s + 1);
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-6 pb-28">
      <h1 className="font-extrabold text-[22px]">Assalamu Alaikum 👋</h1>
      <p className="text-sm text-gray-400">Day {streak + 1} — Have you written your Haqq today?</p>
      <div className="grid grid-cols-2 gap-4 mt-5">
        <a href="/vault" className="bg-white text-[#0f172a] rounded-[20px] p-5 block"><p className="font-bold">🔒 Vault</p><p className="text-xs text-gray-500 mt-1">People you owe / owe you</p></a>
        <a href="/wasiyyah" className="bg-[#D4AF37] text-[#0f172a] rounded-[20px] p-5 block"><p className="font-bold">📜 Wasiyyah</p><p className="text-xs mt-1">Your Islamic Will</p></a>
      </div>
      {showCheck && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end md:items-center justify-center">
          <div className="bg-white text-[#0f172a] w-full md:max-w-md rounded-t-[28px] p-6 text-center">
            <p className="text-4xl">✔️</p>
            <h3 className="font-extrabold text-[20px] mt-2">Have you written your Haqq today?</h3>
            <p className="text-sm text-gray-600 mt-1">Tap to check in. This also tells us you are alive and well.</p>
            <button onClick={doCheckIn} className="w-full mt-4 bg-[#0f172a] text-white py-3.5 rounded-full font-bold">✔️ Yes, I Checked My Haqq</button>
            <a href="/vault" className="block mt-3 text-sm font-bold underline">No, take me to Vault →</a>
          </div>
        </div>
      )}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0f172a] border-t border-white/10 flex justify-around py-3 text-[11px] text-gray-400">
        <a href="/" className="flex flex-col items-center text-[#D4AF37]">🏠 Home</a>
        <a href="/vault" className="flex flex-col items-center">🔒 Vault</a>
        <a href="/wasiyyah" className="flex flex-col items-center">📜 Wasi</a>
      </div>
    </div>
  );
        }
