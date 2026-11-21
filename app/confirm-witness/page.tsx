"use client";
import { useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";

function ConfirmContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function confirm() {
    const { data, error } = await supabase
      .from("witnesses")
      .update({ confirmed: true, status: "accepted", confirmed_at: new Date().toISOString() })
      .eq("token", token)
      .select();
    if (error || !data?.length) { setError("Invalid or expired link"); return; }
    setDone(true);
  }

  if (done) return <div style={{padding: 24, textAlign: "center"}}><h2>✅ JazakAllahu Khairan!</h2><p>You have confirmed as a HAQQ Witness.</p></div>;
  if (!token) return <p>Invalid link</p>;

  return (
    <div style={{padding: 24, maxWidth: 400, margin: "0 auto", textAlign: "center"}}>
      <h2>Confirm as HAQQ Witness</h2>
      <p>Do you accept to be a witness?</p>
      <button onClick={confirm} style={{background: "#0f5132", color: "white", padding: "12px 24px", borderRadius: 8, border: "none", width: "100%"}}>Yes, I Accept</button>
      {error && <p style={{color: "red"}}>{error}</p>}
    </div>
  );
}

export default function ConfirmWitness() {
  return <Suspense><ConfirmContent /></Suspense>;
}
