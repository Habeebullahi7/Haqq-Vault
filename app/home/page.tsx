// app/home/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [streak, setStreak] = useState(0);
  const [showCheck, setShowCheck] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [fullName, setFullName] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      // Get name
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
      if (profile?.full_name) setFullName(profile.full_name);

      // Get checkins sorted new to old
      const { data: allCheckins } = await supabase.from('checkins')
        .select('checked_at')
        .eq('user_id', user.id)
        .order('checked_at', { ascending: false });

      if (!allCheckins || allCheckins.length === 0) {
        setStreak(0);
        setShowCheck(true);
        return;
      }

      // Calculate real streak - check if today or yesterday don check in
      let currentStreak = 0;
      let checkDate = new Date();
      checkDate.setHours(0,0,0,0);
      
      // If last checkin no be today or yesterday, streak don break
      const lastCheck = new Date(allCheckins[0].checked_at);
      lastCheck.setHours(0,0,0,0);
      const diffDays = Math.floor((checkDate.getTime() - lastCheck.getTime()) / (1000*60*60*24));

      if (diffDays > 1) {
        setStreak(0);
        setShowCheck(true);
        return;
      }

      // Count consecutive days
      const dates = new Set(allCheckins.map(c => new Date(c.checked_at).toISOString().split('T')[0]));
      let d = new Date();
      // If no checkin today, start from yesterday for streak count, but still show popup
      if (!dates.has(d.toISOString().split('T')[0])) {
        setShowCheck(true);
        d.setDate(d.getDate() - 1);
      }
      while (dates.has(d.toISOString().split('T')[0])) {
        currentStreak++;
        d.setDate(d.getDate() - 1);
      }
      setStreak(currentStreak);
    }
    init();
  }, [router]);

  async function doCheckIn() {
    if (checkingIn) return;
    setCheckingIn(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // Prevent double check-in for today
    const todayStart = new Date(); todayStart.setHours(0,0,0,0);
    const { data: existing } = await supabase.from('checkins')
      .select('id')
      .eq('user_id', user.id)
      .gte('checked_at', todayStart.toISOString());

    if (!existing || existing.length === 0) {
      await supabase.from('checkins').insert([{ user_id: user.id }]);
      setStreak(s => s + 1);
    }
    setShowCheck(false);
    setCheckingIn(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white px-5 py-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-extrabold text-[22px]">Assalamu Alaikum 👋</h1>
          <p className="text-sm text-gray-400">{fullName ? `${fullName} — ` : ''}Day {streak + 1} — Have you written your Haqq today?</p>
        </div>
        <button onClick={handleLogout} className="text-xs font-bold text-gray-400 underline">Logout</button>
      </div>

      <div className="bg-white/10 rounded-[20px] p-4 mt-5 flex justify-between">
        <div>
          <p className="text-2xl font-extrabold">{streak} 🔥</p>
          <p className="text-xs text-gray-400">Day Streak</p>
        </div>
        <div>
          <p className="text-2xl font-extrabold">{streak > 0 ? 'Alive ✓' : 'Check In'}</p>
          <p className="text-xs text-gray-400">Last Check-in</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-5">
        <Link href="/vault" className="bg-white text-[#0f172a] rounded-[20px] p-5 block"><p className="font-bold">🔒 Vault</p><p className="text-xs text-gray-500 mt-1">People you owe / owe you</p></Link>
        <Link href="/wasiyyah" className="bg-[#D4AF37] text-[#0f172a] rounded-[20px] p-5 block"><p className="font-bold">📜 Wasiyyah</p><p className="text-xs mt-1">Your Islamic Will</p></Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <Link href="/onboarding-witness" className="bg-white/10 rounded-[20px] p-4 block"><p className="font-bold text-sm">👥 Witnesses</p><p className="text-xs text-gray-400">Edit who we call</p></Link>
        <Link href="/vault" className="bg-white/10 rounded-[20px] p-4 block"><p className="font-bold text-sm">📊 My Haqq</p><p className="text-xs text-gray-400">See all debts</p></Link>
      </div>

      {showCheck && (
        <div className="fixed inset-0 z-[80] bg-black/70 flex items-center justify-center p-5" onClick={() => setShowCheck(false)}>
          <div className="bg-white text-[#0f172a] w-full max-w-md rounded-[28px] p-6 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <p className="text-4xl">✔️</p>
            <h3 className="font-extrabold text-[20px] mt-2">Have you written your Haqq today?</h3>
            <p className="text-sm text-gray-600 mt-1">Tap to check in. This also tells us you are alive and well.</p>
            <button onClick={doCheckIn} disabled={checkingIn} className="w-full mt-4 bg-[#0f172a] text-white py-3.5 rounded-full font-bold disabled:opacity-50">{checkingIn ? "Checking in..." : "✔️ Yes, I Checked My Haqq"}</button>
            <Link href="/vault" onClick={() => setShowCheck(false)} className="block mt-3 text-sm font-bold underline">No, take me to Vault →</Link>
            <button onClick={() => setShowCheck(false)} className="block w-full mt-2 text-sm font-bold text-gray-500">Remind Me Later</button>
          </div>
        </div>
      )}
    </div>
  );
              }
