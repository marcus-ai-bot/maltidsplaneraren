import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Server-side client - reads env vars at runtime
export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase env vars:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseAnonKey 
    })
    throw new Error('Missing Supabase configuration')
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
