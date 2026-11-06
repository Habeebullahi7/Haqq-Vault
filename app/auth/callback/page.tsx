'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  useEffect(() => {
    async function handle() {
      // Supabase will read the link from the URL automatically
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        window.location.href = '/vault'
        return
      }
      // Wait for Supabase to process the hash link
      const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session) {
          window.location.href = '/vault'
        }
      })
      // Fallback: if after 3 seconds still no session, go back to login
      setTimeout(async () => {
        const { data: retry } = await supabase.auth.getSession()
        if (!retry.session) window.location.href = '/login'
      }, 4000)
      return () => listener.subscription.unsubscribe()
    }
    handle()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 48 }}>🔐</div>
      <h1 style={{ fontSize: 24, fontWeight: 900, marginTop: 12 }}>Verifying your login...</h1>
      <p style={{ color: '#94a3b8', marginTop: 8 }}>Please wait, we are taking you to your Vault.</p>
    </div>
  )
      }
