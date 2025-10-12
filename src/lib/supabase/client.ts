// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr'

// Fungsi ini membuat Supabase client yang aman untuk digunakan di browser/client-side
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}