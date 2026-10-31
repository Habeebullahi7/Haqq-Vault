"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import BottomNav from "../../components/BottomNav";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{
      setUser(data.user)
      setChecking(false)
    })
    setStreak(Number(localStorage.getItem("haqq_streak")||0))
  },[])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        if (!name.trim()) throw new Error("Please enter your name");
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() } }
        });
        if (error) throw error;
        await supabase.auth.signInWithPassword({ email: email.trim(), password });
        router.push("/vault");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        router.push("/vault");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout(){
    await supabase.auth.signOut()
    setUser(null)
  }

  if(checking){
    return <div className="min-h-screen flex items-center justify-center bg-[#0A1931] text-white">Loading...</div>
  }

  // NOT LOGGED IN - SHOW YOUR ORIGINAL LOGIN
  if(!user){
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f7f9] px-4">
        <div className="w-full max-w-md bg-white rounded-[20px] shadow p-8">
          <h1 className="text-2xl font-bold text-center">Welcome to HAQQ</h1>
          <p className="text-center text-gray-500 text-sm mb-6">Your email unlocks your encrypted vault.</p>
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <input required placeholder="Your Name e.g. Habeeb" value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border" />
            )}
            <input required type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border" />
            <input required type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border" />
            <button disabled={loading} className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold">{loading ? "..." : mode==="login" ? "Login" : "Create Account"}</button>
          </form>
          <button onClick={()=>setMode(mode==="login"?"signup":"login")} className="w-full mt-4 text-sm text-gray-600">{mode==="login" ? "Create New Account" : "Already have account? Login"}</button>
        </div>
      </div>
    );
  }

  // LOGGED IN - SHOW HUB THAT CONNECTS EVERYTHING
  const links = [
    { href:"/tracker", title:"Barakah Tracker", desc:`🔥 ${streak} days • Your Sadaqah dashboard`, icon:"📊", color:"bg-white text-black" },
    { href:"/kaffarah", title:"Kaffarah & Forgiveness", desc:"Oath, fasting, apology letter", icon:"🤲", color:"bg-[#D4AF37] text-black" },
    { href:"/wasiyyah", title:"My Wasiyyah", desc:"Auto-pulls vault debts - Quran 2:282", icon:"📜", color:"bg-white/10 text-white border border-white/10" },
    { href:"/muhasabah", title:"Nightly Muhasabah", desc:"5 checks before sleep", icon:"🌙", color:"bg-white/10 text-white border border-white/10" },
    { href:"/vault", title:"Manage Haqq Vault", desc:"Your debts & rights owed", icon:"🔒", color:"bg-white/10 text-white border border-white/10" },
    { href:"/donate", title:"Sadaqah for Unfound", desc:"Pay for those you can't reach", icon:"❤️", color:"bg-white/10 text-white border border-white/10" },
  ]

  return(
    <div className="min-h-screen bg-[#0A1931] text-white p-4 pb-28">
      <div className="max-w-[520px] mx-auto">
        <div className="mt-4 p-6 rounded-[24px] bg-white text-black">
          <h1 className="text-[20px] font-bold">Salam, {user.user_metadata?.full_name || user.email?.split('@')[0]} 👋</h1>
          <p className="text-black/60 text-[13px] mt-1">{user.email}</p>
          <div className="mt-3 flex gap-2">
            <div className="px-3 py-1.5 bg-[#0A1931] text-white rounded-full text-xs font-bold">🔥 {streak} Day Streak</div>
            <button onClick={handleLogout} className="px-3 py-1.5 bg-gray-100 rounded-full text-xs">Logout</button>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {links.map(l=>(
            <Link key={l.href} href={l.href} className={`p-4 rounded-2xl flex justify-between items-center no-underline ${l.color}`}>
              <div>
                <p className="font-bold text-[15px]">{l.icon} {l.title}</p>
                <p className="text-[12px] opacity-70 mt-1">{l.desc}</p>
              </div>
              <span className="text-lg">→</span>
            </Link>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-white/[0.06] border border-white/10">
          <p className="text-[11px] tracking-widest opacity-50">FLOW</p>
          <p className="text-[13px] mt-2 leading-6">🌙 Check → 🔒 Vault → ❤️ Donate → 🤲 Kaffarah → 📜 Wasiyyah → 📊 Barakah</p>
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
