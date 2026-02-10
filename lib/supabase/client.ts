import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a singleton client for client-side
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Export factory function for server-side (API routes)
export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
