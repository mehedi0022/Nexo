import { NextResponse, type NextRequest } from "next/server"

const protectedRoutes = ["/profile", "/checkout", "/admin"]
const authRoutes = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"]

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasAccessToken = request.cookies.has("accessToken")

  if (protectedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))) {
    if (!hasAccessToken) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("next", pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (hasAccessToken && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/profile", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/:path*", "/checkout/:path*", "/admin/:path*", "/login", "/register", "/forgot-password", "/reset-password", "/verify-email"],
}
