// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  const url = Deno.env.get("supabase_url") || Deno.env.get("SUPABASE_URL")!
  const serviceKey = Deno.env.get("supabase_service_role_key") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  const supabase = createClient(url, serviceKey)
  const fourteenDaysAgo = new Date(Date.now() - 14*24*60*60*1000).toISOString()
  const { data: inactive } = await supabase.from("profiles")
    .select("id, full_name, email, last_seen_at, last_welfare_check_sent_at")
    .lt("last_seen_at", fourteenDaysAgo)
    .or(`last_welfare_check_sent_at.is.null,last_welfare_check_sent_at.lt.${fourteenDaysAgo}`)
  let sent = 0
  for (const user of inactive || []) {
    const { data: witnesses } = await supabase.from("witnesses").select("*").eq("user_id", user.id).eq("status","confirmed")
    for (const w of witnesses || []) {
      if (!w.witness_email) continue
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${Deno.env.get("resend_api_key")}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "HAQQ <onboarding@resend.dev>",
          to: w.witness_email,
          subject: `Welfare Check: ${user.full_name} hasn't been active on HAQQ`,
          html: `<p>Salam ${w.name},</p><p>You are a confirmed witness for <b>${user.full_name}</b> on HAQQ.</p><p>They have not logged in for over <b>14 days</b>. Please check on them — call or visit.</p><p><b>We are NOT sharing their debts or private information with you.</b> This is only a welfare check.</p>`
        })
      })
      await supabase.from("welfare_logs").insert({ user_id: user.id, witness_id: w.id })
      sent++
    }
    await supabase.from("profiles").update({ last_welfare_check_sent_at: new Date().toISOString() }).eq("id", user.id)
  }
  return new Response(JSON.stringify({checked: inactive?.length || 0, sent}))
})
