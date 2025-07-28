import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

// Singleton supabase client for both client & server usage
// Requires env vars NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createBrowserSupabaseClient({
  cookieOptions: {
    name: 'supabase-auth',
    lifetime: 60 * 60 * 24 * 7, // 7 days
    sameSite: 'lax',
    path: '/',
  },
})

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
}
