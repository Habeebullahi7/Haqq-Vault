"use client";
import { usePathname } from "next/navigation";
import TopAppBar from "@/components/TopAppBar";
import BottomNav from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages with NO TopBar / BottomNav - they have their own design
  const isNoNavPage =
    pathname === "/" ||
    pathname === "/login" ||
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/auth/") ||
    pathname.startsWith("/onboarding");

  if (isNoNavPage) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  // Inside app: Home, Vault, etc - show TopBar + BottomNav
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
