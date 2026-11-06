"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function Callback() {
  const router = useRouter();
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        localStorage.setItem("haqq-last-login", new Date().toISOString());
        localStorage.setItem("haqq-login-method", "google");
        router.push("/vault");
      } else router.push("/login");
    });
  }, [router]);
  return <div className="min-h-screen bg-[#0A1931] flex items-center justify-center text-white font-bold px-4 text-center">Verifying your Gmail... Please wait...</div>;
}
