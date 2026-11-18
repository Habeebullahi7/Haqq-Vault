"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Public pages - anyone can see these without login
  const publicPages = ["/", "/login", "/reset-password", "/auth/callback"];
  const isPublic = publicPages.some((p) => {
    if (p === "/") return pathname === "/";
    return pathname.startsWith(p);
  });

  useEffect(() => {
    async function check() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      // 1. Not logged in + trying to open protected page -> go to Login
      if (!user && !isPublic) {
        router.replace("/login");
        return;
      }

      // 2. Already logged in + trying to open Login -> go to Home / Dashboard
      if (user && pathname === "/login") {
        router.replace("/home");
        return;
      }

      // 3. Otherwise, allow page to show
      setChecking(false);
    }
    check();
  }, [pathname, isPublic, router]);

  // Public pages: Welcome, Login, Reset Password - show immediately
  // But if it's Login page and we are still checking (logged in user), show loading briefly to avoid flash
  if (pathname === "/login" && checking) {
    return (
      <div className="min-h-screen bg-[#0A1931] flex items-center justify-center text-white">
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  if (isPublic) return <>{children}</>;

  // Protected pages: while checking, show loading so no data leaks
  if (checking) {
    return (
      <div className="min-h-screen bg-[#0A1931] flex items-center justify-center text-white">
        <p className="text-sm">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
