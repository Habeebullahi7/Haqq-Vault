'use client'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl) {
  console.warn('Missing NEXT_PUBLIC_SUPABASE_URL - check Vercel Env Vars')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
