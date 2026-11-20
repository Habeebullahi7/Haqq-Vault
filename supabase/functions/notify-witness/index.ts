// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" }

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors })
  try {
    const { witness_id } = await req.json()
    const url = Deno.env.get("supabase_url") || Deno.env.get("SUPABASE_URL")!
    const serviceKey = Deno.env.get("supabase_service_role_key") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    const supabase = createClient(url, serviceKey)
    const { data: w } = await supabase.from("witnesses").select("*").eq("id", witness_id).single()
    if (!w) return new Response(JSON.stringify({error:"witness not found"}), {status:404, headers:cors})
    const { data: p } = await supabase.from("profiles").select("full_name").eq("id", w.user_id).single()
    const userName = p?.full_name || "A HAQQ user"
    const site = Deno.env.get("site_url") || ""
    const confirmLink = `${site}/confirm-witness?token=${w.invite_token}`
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("resend_api_key")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "HAQQ <onboarding@resend.dev>",
        to: w.witness_email,
        subject: `${userName} chose you as witness on HAQQ`,
        html: `<p>Salam ${w.name},</p><p><b>${userName}</b> chose you as witness for his/her Wasiyyah on HAQQ.</p><p>Your job: Confirm you know this person. You will <b>NOT</b> see their debts. You will only be contacted if they don't login for 14 days, to check on their welfare.</p><p><a href="${confirmLink}" style="background:#000;color:#fff;padding:12px 20px;text-decoration:none;border-radius:8px">Confirm as Witness</a></p><p>If you don't know this person, ignore this email.</p>`
      })
    })
    return new Response(JSON.stringify({ok:true}), {headers:{...cors, "Content-Type":"application/json"}})
  } catch(e){ return new Response(JSON.stringify({error:String(e)}), {status:500, headers:cors}) }
})
