import { createClient } from '@supabase/supabase-js'

// Service role client — use ONLY in server-side code (API routes, server actions)
// Bypasses RLS — use with caution
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}
