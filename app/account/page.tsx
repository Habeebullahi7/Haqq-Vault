"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AccountPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

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
