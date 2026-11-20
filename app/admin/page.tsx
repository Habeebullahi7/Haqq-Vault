"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "Liasuhabeeb7@gmail.com";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ myEntries: 0, tickets: 0, donations: 0 });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      // Email check is case-insensitive - Gmail fit return different case
      if (!user || user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        router.push("/");
        return;
      }

      // NOTE: Because of RLS (user_id = auth.uid()), this only counts YOUR OWN vault entries.
      // That is correct - Admin cannot read other users' vaults.
      // For true global total, you need a secure server-side RPC, not a client query.
      const { count: myCount } = await supabase
        .from("debts")
        .select("*", { count: "exact", head: true });

      // Donations - only verified, only amount + project (no donor names)
      const { data: donations } = await supabase
        .from("donations")
        .select("amount")
        .eq("status", "verified");

      const totalDonations = (donations || []).reduce((s, d) => s + (d.amount || 0), 0);

      // Support tickets - if table no exist, e go stay 0
      const { count: ticketCount } = await supabase
        .from("support_tickets")
        .select("*", { count: "exact", head: true });

      setStats({ myEntries: myCount || 0, tickets: ticketCount || 0, donations: totalDonations });
      setLoading(false);
    })();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-[#0f172a] text-white p-8">Checking admin...</div>;

  return (
    <div className="min-h-screen bg-[#f6f7f9] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#0f172a] text-white rounded-2xl p-6 mb-6">
          <h1 className="text-xl font-bold">Admin - HAQQ Control</h1>
          <p className="text-sm text-gray-400 mt-1">You CANNOT read other users&apos; vault content because it is user-isolated by RLS. This is counts only.</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl"><p className="text-xs text-gray-500">My Vault Entries (Admin Account)</p><p className="text-2xl font-bold">{stats.myEntries}</p><p className="text-[11px] text-gray-400 mt-1">Not global total — RLS blocks it for privacy</p></div>
          <div className="bg-white p-5 rounded-2xl"><p className="text-xs text-gray-500">Support Tickets</p><p className="text-2xl font-bold">{stats.tickets}</p></div>
          <div className="bg-white p-5 rounded-2xl"><p className="text-xs text-gray-500">Total Verified Donations</p><p className="text-2xl font-bold">₦{stats.donations.toLocaleString()}</p></div>
        </div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-2xl p-4 text-sm">
          <b>⚠️ Do this in Supabase now:</b>
          <p className="mt-1">Go to Supabase → Authentication → Policies → Table <b>debts</b> → Make sure policy is: <code>user_id = auth.uid()</code> for SELECT, INSERT, UPDATE, DELETE. If you never do am, any user fit read other people vault.</p>
        </div>
      </div>
    </div>
  );
}
