"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ADMIN_EMAIL = "Liasuhabeeb7@gmail.com"; 

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, tickets: 0, donations: 0 });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.email !== ADMIN_EMAIL) {
        router.push("/"); // not admin? go back to welcome
        return;
      }
      // If admin, load stats
      const { count } = await supabase.from("debts").select("*", { count: "exact", head: true });
      setStats({ total: count || 0, tickets: 0, donations: 0 });
      setLoading(false);
    })();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#0f172a] text-white p-8">Checking admin...</div>;

  return (
    <div className="min-h-screen bg-[#f6f7f9] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#0f172a] text-white rounded-2xl p-6 mb-6">
          <h1 className="text-xl font-bold">Admin - HAQQ Control</h1>
          <p className="text-sm text-gray-400 mt-1">You CANNOT read vault content because it is user-isolated. This is counts only.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl"><p className="text-xs text-gray-500">Total Vault Entries</p><p className="text-2xl font-bold">{stats.total}</p></div>
          <div className="bg-white p-5 rounded-2xl"><p className="text-xs text-gray-500">Support Tickets</p><p className="text-2xl font-bold">{stats.tickets}</p></div>
          <div className="bg-white p-5 rounded-2xl"><p className="text-xs text-gray-500">Total Donations Raised</p><p className="text-2xl font-bold">N0</p></div>
        </div>
      </div>
    </div>
  );
}
