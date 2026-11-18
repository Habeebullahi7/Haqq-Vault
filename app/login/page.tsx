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
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  async function handleAuth() {
    setErrorMsg("");
    setSuccessMsg("");
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please fill in your email and password.");
      return;
    }
    if (!email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (isSignup && !fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    setLoading(true);
    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: { data: { full_name: fullName.trim() } },
        });
        if (error) throw error;
        if (data.user) {
          await supabase.from("profiles").upsert([
            { id: data.user.id, full_name: fullName.trim(), email: email.trim().toLowerCase() },
          ]);
        }
        if (data.user && !data.session) {
          setSuccessMsg("Account created. Please check your email to confirm, then log in.");
          setIsSignup(false);
          setLoading(false);
          return;
        }
        router.push("/onboarding-witness");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });
        if (error) throw error;
        router.push("/home");
      }
    } catch (err: any) {
      if (err.message?.includes("Invalid login credentials")) {
        setErrorMsg("Incorrect email or password. Please try again.");
      } else if (err.message?.includes("User already registered")) {
        setErrorMsg("This email is already registered. Please log in.");
        setIsSignup(false);
      } else if (err.message?.includes("Email not confirmed")) {
        setErrorMsg("Please confirm your email first. Check your inbox or spam.");
      } else {
        setErrorMsg(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setErrorMsg("Enter your email first, then click Forgot Password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) setErrorMsg(error.message);
    else setSuccessMsg("A reset link has been sent to your email. Check your inbox or spam.");
  }

  const inputClass = "w-full p-3.5 bg-gray-50 rounded-xl border outline-none text-[#0f172a] placeholder:text-gray-400 focus:border-[#0f172a] focus:bg-white transition";

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-5 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <p className="text-4xl">🔒</p>
          <h1 className="font-extrabold text-[28px] mt-2 tracking-tight">HAQQ VAULT</h1>
          <p className="text-sm text-gray-400">Clear your Haqq before you meet Allah</p>
        </div>
        <div className="bg-white text-[#0f172a] rounded-[24px] p-6 space-y-4 shadow-2xl">
          <h2 className="font-bold text-lg">{isSignup ? "Create Account" : "Welcome Back"}</h2>
          {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium p-3 rounded-xl">{errorMsg}</div>}
          {successMsg && <div className="bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium p-3 rounded-xl">{successMsg}</div>}
          {isSignup && (
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full Name e.g. Liasu Habeeb" className={inputClass} />
          )}
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" type="email" autoComplete="email" className={inputClass} />
          <div className="relative">
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 6 characters)" type={showPassword ? "text" : "password"} autoComplete={isSignup ? "new-password" : "current-password"} onKeyDown={(e) => e.key === "Enter" && handleAuth()} className={`${inputClass} pr-16`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-500">{showPassword ? "HIDE" : "SHOW"}</button>
          </div>
          {!isSignup && <button onClick={handleForgotPassword} className="text-[13px] font-bold text-[#0f172a]/70 underline text-left">Forgot Password?</button>}
          <button onClick={handleAuth} disabled={loading} className="w-full bg-[#0f172a] text-white py-3.5 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition">{loading ? "Loading..." : isSignup ? "Create Account →" : "Login →"}</button>
          <button onClick={() => { setIsSignup(!isSignup); setErrorMsg(""); setSuccessMsg(""); }} className="w-full text-sm font-bold underline">{isSignup ? "Already have an account? Login" : "No account? Create one"}</button>
        </div>
        <p className="text-[11px] text-center text-gray-500 mt-4">Your Haqq stays private. Only you can see it.</p>
      </div>
    </div>
  );
            }
