import { createClient } from '@supabase/supabase-js'

// Normal Supabase client - for server / general use
// Uses the public anon key, safe for browser
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default supabase
