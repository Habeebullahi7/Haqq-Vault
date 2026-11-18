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

    // 1. VALIDATION - No empty submit
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Abeg fill email and password.");
      return;
    }
    if (!email.includes("@")) {
      setErrorMsg("Abeg enter correct email.");
      return;
    }
    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }
    if (isSignup && !fullName.trim()) {
      setErrorMsg("Abeg enter your full name.");
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: { full_name: fullName.trim() },
          },
        });
        if (error) throw error;

        // If user created, save profile - but no go fail silently
        if (data.user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .upsert([{ id: data.user.id, full_name: fullName.trim(), email: email.trim().toLowerCase() }]);

          // If profile insert fail because of RLS, no block user - log am
          if (profileError) console.log("Profile save issue:", profileError.message);
        }

        // If email confirmation ON, Supabase no go login immediately
        if (data.user && !data.session) {
          setSuccessMsg("Account created! Check your email to confirm, then login.");
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
        router.push("/");
      }
    } catch (err: any) {
      // Friendly error messages
      if (err.message?.includes("Invalid login credentials")) {
        setErrorMsg("Wrong email or password. Try again or create account.");
      } else if (err.message?.includes("User already registered")) {
        setErrorMsg("This email don already register. Abeg login.");
        setIsSignup(false);
      } else if (err.message?.includes("Email not confirmed")) {
        setErrorMsg("Abeg confirm your email first. Check inbox / spam.");
      } else {
        setErrorMsg(err.message || "Something go wrong. Try again.");
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
    else setSuccessMsg("Reset link don go your email. Check inbox / spam.");
  }

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

          {/* ERROR / SUCCESS */}
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-[13px] font-medium p-3 rounded-xl">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-[13px] font-medium p-3 rounded-xl">
              {successMsg}
            </div>
          )}

          {isSignup && (
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name e.g. Liasu Habeeb"
              className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none focus:border-[#0f172a] focus:bg-white transition"
            />
          )}

          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            autoComplete="email"
            className="w-full p-3.5 bg-gray-50 rounded-xl border outline-none focus:border-[#0f172a] focus:bg-white transition"
          />

          <div className="relative">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 6 characters)"
              type={showPassword ? "text" : "password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              className="w-full p-3.5 pr-16 bg-gray-50 rounded-xl border outline-none focus:border-[#0f172a] focus:bg-white transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] font-bold text-gray-500"
            >
              {showPassword ? "HIDE" : "SHOW"}
            </button>
          </div>

          {!isSignup && (
            <button onClick={handleForgotPassword} className="text-[13px] font-bold text-[#0f172a]/70 underline text-left">
              Forgot Password?
            </button>
          )}

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-[#0f172a] text-white py-3.5 rounded-full font-bold disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition"
          >
            {loading ? "Loading..." : isSignup ? "Create Account →" : "Login →"}
          </button>

          <button onClick={() => { setIsSignup(!isSignup); setErrorMsg(""); setSuccessMsg(""); }} className="w-full text-sm font-bold underline">
            {isSignup ? "Already have account? Login" : "No account? Create one"}
          </button>
        </div>

        <p className="text-[11px] text-center text-gray-500 mt-4">Your Haqq stays private. Only you can see am.</p>
      </div>
    </div>
  );
  }
