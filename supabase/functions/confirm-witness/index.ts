// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" }
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors })
  const { token } = await req.json()
  const url = Deno.env.get("supabase_url") || Deno.env.get("SUPABASE_URL")!
  const serviceKey = Deno.env.get("supabase_service_role_key") || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  const supabase = createClient(url, serviceKey)
  const { data } = await supabase.from("witnesses").update({ status: "confirmed", confirmed_at: new Date().toISOString() }).eq("invite_token", token).select().single()
  return new Response(JSON.stringify({ok: !!data}), {headers:{...cors, "Content-Type":"application/json"}})
})
