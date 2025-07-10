import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  // Create a Supabase client configured to use cookies
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })
  
  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get the pathname from the URL
  const { pathname } = request.nextUrl

  // Define protected routes
  const isProtectedRoute = [
    '/dashboard',
    '/pending-approval',
  ].some(route => pathname.startsWith(route))

  // Define auth routes (login, register)
  const isAuthRoute = [
    '/login',
    '/register',
  ].some(route => pathname === route)

  // If accessing a protected route and not authenticated, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/login', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthRoute && session) {
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Continue with the response
  return response
}

// Define which routes this middleware should run on
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/pending-approval',
    '/login',
    '/register',
  ],
} 