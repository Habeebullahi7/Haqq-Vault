"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"google" | "emailOtp">("google");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [showOld, setShowOld] = useState(false);
  const [oldPassword, setOldPassword] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/vault");
    });
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [countdown]);

  // 1. GMAIL - VERIFIED BY GOOGLE
  async function loginWithGoogle() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) { alert("Google login failed. Try again."); setLoading(false); }
  }

  // 2. EMAIL OTP - FREE, NO TWILIO, NO TERMII
  async function sendEmailOtp() {
    if (!email.includes("@")) return alert("Enter valid email e.g. habeeb@gmail.com");
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        shouldCreateUser: true,
        data: name.trim() ? { full_name: name.trim() } : undefined,
      },
    });
    setLoading(false);
    if (error) return alert("Could not send code. " + error.message);
    setOtpSent(true);
    setCountdown(60);
    setAttempts(0);
    alert(`6-digit code sent to ${email}. Check inbox + spam.`);
  }

  async function verifyEmailOtp() {
    if (attempts >= 3) return alert("Too many wrong attempts. Request new code.");
    if (otp.length !== 6) return alert("OTP must be 6 digits.");
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp,
      type: "email",
    });
    setLoading(false);
    if (error) {
      setAttempts(attempts + 1);
      return alert(`Wrong code. ${3 - (attempts + 1)} tries left.`);
    }
    if (data.session) {
      localStorage.setItem("haqq-last-login", new Date().toISOString());
      localStorage.setItem("haqq-login-method", "email-otp");
      router.push("/vault");
    }
  }

  // OLD USERS ONLY
  async function loginOldPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: oldPassword,
      });
      if (error) throw error;
      router.push("/vault");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1931] px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-[24px] shadow-2xl p-8">
        <Link href="/" className="block text-center text-[11px] tracking-widest opacity-50 mb-4">HAQQ • QURAN 2:282</Link>
        <h1 className="text-2xl font-black text-center text-[#0A1931]">Welcome to HAQQ</h1>
        <p className="text-center text-gray-500 text-sm mb-6 mt-2">Only verified Gmail or Email OTP can unlock your encrypted vault. No guest, no fake account.</p>

        <div className="flex bg-gray-100 rounded-full p-1 mb-5">
          <button onClick={() => { setTab("google"); setOtpSent(false); }} className={`flex-1 py-2.5 rounded-full font-bold text-sm ${tab === "google" ? "bg-[#0A1931] text-white" : "text-gray-600"}`}>Gmail</button>
          <button onClick={() => { setTab("emailOtp"); setOtpSent(false); }} className={`flex-1 py-2.5 rounded-full font-bold text-sm ${tab === "emailOtp" ? "bg-[#0A1931] text-white" : "text-gray-600"}`}>Email OTP</button>
        </div>

        {tab === "google" && (
          <div>
            <input placeholder="Your Name e.g. Habeeb (if new)" value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-gray-50 text-black font-medium mb-3" />
            <button onClick={loginWithGoogle} disabled={loading} className="w-full py-3.5 rounded-xl bg-white border-2 border-[#0A1931] text-[#0A1931] font-bold text-[15px] flex items-center justify-center gap-2">
              <span className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[12px] font-black">G</span>
              {loading ? "Connecting to Google..." : "Continue with Gmail"}
            </button>
            <p className="text-[11px] text-gray-500 text-center mt-3 leading-relaxed">
              ✓ Google go verify say na your real Gmail<br/>
              ✓ We no go see your Gmail password<br/>
              ✓ You must select account every time
            </p>
          </div>
        )}

        {tab === "emailOtp" && (
          <div className="space-y-3">
            {!otpSent ? (
              <>
                <input placeholder="Your Name e.g. Habeeb" value={name} onChange={e=>setName(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-gray-50 text-black font-medium" />
                <input type="email" placeholder="Email e.g. habeeb@gmail.com" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-gray-50 text-black" />
                <button onClick={sendEmailOtp} disabled={loading} className="w-full py-3.5 rounded-xl bg-[#0A1931] text-white font-bold text-[15px]">{loading ? "Sending..." : "Send Email Code →"}</button>
                <p className="text-[11px] text-gray-500 text-center">Free. Code go to your email, check spam too. Expires soon.</p>
              </>
            ) : (
              <>
                <p className="text-center text-sm font-bold">Code sent to {email}</p>
                <input placeholder="• • • • • •" value={otp} onChange={e=>setOtp(e.target.value.replace(/[^0-9]/g,"").slice(0,6))} maxLength={6} inputMode="numeric" className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-gray-50 text-black font-black text-center text-[22px] tracking-[8px]" />
                <button onClick={verifyEmailOtp} disabled={loading} className="w-full py-3.5 rounded-xl bg-green-600 text-white font-bold text-[15px]">{loading ? "Verifying..." : "Verify & Enter Vault →"}</button>
                <div className="flex gap-2">
                  <button onClick={()=>{setOtpSent(false); setOtp("")}} className="flex-1 py-2.5 rounded-xl border font-bold text-sm">Change Email</button>
                  <button onClick={sendEmailOtp} disabled={countdown>0} className="flex-1 py-2.5 rounded-xl border font-bold text-sm">{countdown>0 ? `Resend in ${countdown}s` : "Resend"}</button>
                </div>
                {attempts>0 && <p className="text-[11px] text-red-500 text-center font-bold">{3-attempts} tries left. After 3 wrong, request new code.</p>}
              </>
            )}
          </div>
        )}

        <button onClick={()=>setShowOld(!showOld)} className="w-full mt-4 text-[12px] text-gray-500 underline">{showOld ? "Hide old login" : "I get old Email + Password account?"}</button>
        {showOld && (
          <form onSubmit={loginOldPassword} className="space-y-3 mt-3 border-t pt-3">
            <p className="text-[11px] bg-yellow-50 border border-yellow-200 p-3 rounded-xl text-yellow-800">Only for users wey don create account with Email + Password before. New users must use Gmail / Email OTP above.</p>
            <input required type="email" placeholder="Old Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-gray-50 text-black" />
            <input required type="password" placeholder="Old Password" value={oldPassword} onChange={e=>setOldPassword(e.target.value)} className="w-full px-4 py-3.5 rounded-xl border border-black/10 bg-gray-50 text-black" />
            <button disabled={loading} className="w-full py-3.5 rounded-xl bg-gray-800 text-white font-bold text-[15px]">{loading ? "Please wait..." : "Login with Old Password"}</button>
          </form>
        )}
        <p className="text-center text-[11px] text-gray-400 mt-6">Secure • Encrypted • For His Sake<br/>Lost access? Use Gmail / Email OTP to recover. No need password.</p>
      </div>
    </div>
  );
}
