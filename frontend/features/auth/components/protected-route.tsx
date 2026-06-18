"use client"

import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import { useGetMeQuery } from "@/features/auth/authApi"
import type { UserRole } from "@/features/auth/types"
import { useAppSelector } from "@/store/hooks"

export function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode
  roles?: UserRole[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, initialized } = useAppSelector((state) => state.auth)
  const { isFetching } = useGetMeQuery()

  React.useEffect(() => {
    if (!initialized || isFetching) {
      return
    }

    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`)
      return
    }

    if (roles?.length && !roles.includes(user.role)) {
      router.replace("/")
    }
  }, [initialized, isFetching, pathname, roles, router, user])

  if (!initialized || isFetching || !user) {
    return (
      <div className="mx-auto flex min-h-[50vh] max-w-6xl items-center px-4 text-sm text-muted-foreground">
        Checking your session...
      </div>
    )
  }

  if (roles?.length && !roles.includes(user.role)) {
    return null
  }

  return children
}
