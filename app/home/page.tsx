"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [streak, setStreak] = useState(0);
  const [showCheck, setShowCheck] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      // Get total check-ins for streak display
      const { data: allCheckins } = await supabase.from('checkins').select('id').eq('user_id', user.id);
      if (allCheckins) setStreak(allCheckins.length);

      // Check if already checked in today
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase.from('checkins').select('*').eq('user_id', user.id).gte('checked_at', today);
      if (!data || data.length === 0) setShowCheck(true);
    }
    init();
  }, [router]);

  async function doCheckIn() {
    if (checkingIn) return;
    setCheckingIn(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    await supabase.from('checkins').insert([{ user_id: user.id }]);
    setShowCheck(false);
    setStreak(s => s + 1);
    setCheckingIn(false);
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-6 pb-28">
      <h1 className="font-extrabold text-[22px]">Assalamu Alaikum 👋</h1>
      <p className="text-sm text-gray-400">Day {streak + 1} — Have you written your Haqq today?</p>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <Link href="/vault" className="bg-white text-[#0f172a] rounded-[20px] p-5 block">
          <p className="font-bold">🔒 Vault</p>
          <p className="text-xs text-gray-500 mt-1">People you owe / owe you</p>
        </Link>
        <Link href="/wasiyyah" className="bg-[#D4AF37] text-[#0f172a] rounded-[20px] p-5 block">
          <p className="font-bold">📜 Wasiyyah</p>
          <p className="text-xs mt-1">Your Islamic Will</p>
        </Link>
      </div>

      {showCheck && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex items-end md:items-center justify-center p-4" onClick={() => setShowCheck(false)}>
          <div 
            className="bg-white text-[#0f172a] w-full md:max-w-md rounded-[28px] p-6 text-center mb-[90px] md:mb-0 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-4xl">✔️</p>
            <h3 className="font-extrabold text-[20px] mt-2">Have you written your Haqq today?</h3>
            <p className="text-sm text-gray-600 mt-1">Tap to check in. This also tells us you are alive and well.</p>
            <button onClick={doCheckIn} disabled={checkingIn} className="w-full mt-4 bg-[#0f172a] text-white py-3.5 rounded-full font-bold disabled:opacity-50">
              {checkingIn ? "Checking in..." : "✔️ Yes, I Checked My Haqq"}
            </button>
            <Link href="/vault" onClick={() => setShowCheck(false)} className="block mt-3 text-sm font-bold underline">No, take me to Vault →</Link>
            <button onClick={() => setShowCheck(false)} className="block w-full mt-2 text-sm font-bold text-gray-500">Remind Me Later</button>
          </div>
        </div>
      )}

      {/* REMOVED: Old bottom nav was here. AppShell already provides BottomNav. Do not add another one here. */}
    </div>
  );
      }
