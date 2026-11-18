"use client";
import { usePathname } from "next/navigation";
import TopAppBar from "@/components/TopAppBar";
import BottomNav from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages that have their OWN nav, or no nav at all
  const isAuthPage = pathname === "/login" || pathname.startsWith("/reset-password") || pathname.startsWith("/auth/");
  const isWelcomePage = pathname === "/";

  // 1. Login page: no TopBar, no BottomNav
  if (isAuthPage) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  // 2. Welcome page: it already has its own <nav> inside page.tsx, so don't add another one
  if (isWelcomePage) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  // 3. All other pages (Home, Vault, etc): show TopBar + BottomNav
  return (
    <AuthGuard>
      <TopAppBar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
      <BottomNav />
    </AuthGuard>
  );
}
