import { cookies } from "next/headers"
import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"

function authCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge,
    path: "/",
  }
}

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get("refreshToken")?.value

  if (!refreshToken) {
    return NextResponse.json(
      { success: false, statusCode: 401, message: "Refresh token is missing" },
      { status: 401 }
    )
  }

  const backendResponse = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  })

  const payload = await backendResponse.json().catch(() => null)

  if (!backendResponse.ok || !payload?.data?.accessToken) {
    const response = NextResponse.json(
      payload ?? { success: false, statusCode: backendResponse.status, message: "Refresh failed" },
      { status: backendResponse.status }
    )
    response.cookies.set("accessToken", "", authCookieOptions(0))
    return response
  }

  const response = NextResponse.json(payload, { status: backendResponse.status })
  response.cookies.set("accessToken", payload.data.accessToken, authCookieOptions(15 * 60))
  return response
}
