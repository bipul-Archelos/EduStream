import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// In routes par bina login ke nahi ja sakte
const protectedRoutes = ['/dashboard', '/live', '/profile', '/teacher']

export function middleware(request: NextRequest) {
  // Cookie check karo
  const token = request.cookies.get('token')?.value

  // Agar user protected route par ja raha hai aur token nahi hai
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!token) {
      // Login par bhej do
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Agar user Login/Register par hai aur token pehle se hai (Logged in hai)
  if (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register') {
    if (token) {
        // Seedha Dashboard bhej do
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

// Kin routes par ye middleware chalega
export const config = {
  matcher: ['/dashboard/:path*', '/live/:path*', '/profile/:path*', '/teacher/:path*', '/login', '/register'],
}