"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAuth() {
    setLoading(true);
    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) { alert(error.message); setLoading(false); return; }
      if (data.user) {
        await supabase.from('profiles').insert([{ id: data.user.id, full_name: fullName }]);
        router.push("/onboarding-witness");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { alert(error.message); setLoading(false); return; }
      router.push("/");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-4xl">🔒</p>
          <h1 className="font-extrabold text-[28px] mt-2">HAQQ VAULT</h1>
          <p className="text-sm text-gray-400">Clear your Haqq before you meet Allah</p>
        </div>
        <div className="bg-white text-[#0f172a] rounded-[24px] p-6 space-y-4">
          <h2 className="font-bold text-lg">{isSignup ? "Create Account" : "Welcome Back"}</h2>
          {isSignup && (
            <input value={fullName} onChange={e=>setFullName(e.target.value)} placeholder="Full Name" className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none" />
          )}
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none" />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none" />
          <button onClick={handleAuth} disabled={loading} className="w-full bg-[#0f172a] text-white py-3.5 rounded-full font-bold">
            {loading ? "Loading..." : isSignup ? "Create Account →" : "Login →"}
          </button>
          <button onClick={()=>setIsSignup(!isSignup)} className="w-full text-sm font-bold underline">
            {isSignup ? "Already have account? Login" : "No account? Create one"}
          </button>
        </div>
        <p className="text-[11px] text-center text-gray-500 mt-4">Your Haqq stays private. Only you can see am.</p>
      </div>
    </div>
  );
}
