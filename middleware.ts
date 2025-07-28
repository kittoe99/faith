import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  // Create authenticated Supabase client for middleware
  const res = NextResponse.next()
  const supabase = createMiddlewareSupabaseClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If not logged in, redirect to /auth
  if (!session && !req.nextUrl.pathname.startsWith('/auth')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/auth'
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If logged in and currently on /auth, send to dashboard
  if (session && req.nextUrl.pathname.startsWith('/auth')) {
    const dashUrl = req.nextUrl.clone()
    dashUrl.pathname = '/dashboard'
    return NextResponse.redirect(dashUrl)
  }

  return res
}

// Apply to all paths except Next.js assets and API routes
export const config = {
  // Skip Next.js internals, api routes, auth page

  matcher: ['/((?!_next/|api/|auth|favicon.ico).*)'],
}
