import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

const expiredCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 0,
  path: "/",
}

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refreshToken")?.value

  const backendResponse = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  }).catch(() => null)

  const payload = await backendResponse?.json().catch(() => null)
  const response = NextResponse.json(
    payload ?? { success: true, statusCode: 200, message: "User logged out successfully" },
    { status: backendResponse?.status ?? 200 }
  )

  response.cookies.set("accessToken", "", expiredCookieOptions)
  response.cookies.set("refreshToken", "", expiredCookieOptions)

  return response
}
