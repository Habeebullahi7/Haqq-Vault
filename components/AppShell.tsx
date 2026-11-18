"use client";
import { usePathname } from "next/navigation";
import TopAppBar from "@/components/TopAppBar";
import BottomNav from "@/components/BottomNav";
import AuthGuard from "@/components/AuthGuard";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname.startsWith("/reset-password") || pathname.startsWith("/auth/");

  // On Login page: show only the page, no Top Bar, no Bottom Nav
  if (isAuthPage) {
    return (
      <AuthGuard>
        {children}
      </AuthGuard>
    );
  }

  // On all other pages: show Top Bar + Bottom Nav + protection
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
