'use client'
import { createClient } from '@supabase/supabase-js'

// Use placeholder for build time so Vercel no go crash
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key-for-build'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
