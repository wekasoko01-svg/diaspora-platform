import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ["/login", "/register", "/api/auth/login", "/api/auth/register"]
const authPaths = ["/dashboard", "/admin"]

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value
  const { pathname } = request.nextUrl

  const isAuthPage = authPaths.some((p) => pathname.startsWith(p))
  const isPublicAuthPath = publicPaths.some((p) => pathname.startsWith(p))

  if (isAuthPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (isPublicAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
}
