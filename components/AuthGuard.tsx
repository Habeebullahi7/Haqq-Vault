"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const publicPages = ["/login", "/reset-password", "/auth/callback"];
  const isPublic = publicPages.some((p) => pathname.startsWith(p));

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (!user && !isPublic) {
        router.replace("/login");
      } else if (user && pathname === "/login") {
        router.replace("/");
      } else {
        setChecking(false);
      }
    }
    check();
  }, [pathname, isPublic, router]);

  // If page is public, show it immediately
  if (isPublic) return <>{children}</>;

  // While checking, show loading - so people cannot see data
  if (checking) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white">
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
