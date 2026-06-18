import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"

import { AuthFormShell } from "@/features/auth/components/auth-form-shell"
import { LoginForm } from "@/features/auth/components/login-form"

export const metadata: Metadata = {
  title: "Sign in | Nexo",
  description: "Sign in to your Nexo account.",
}

export default function LoginPage() {
  return (
    <AuthFormShell
      title="Welcome back"
      description="Sign in with your email and password to continue."
      footer={
        <>
          New to Nexo?{" "}
          <Link className="font-medium text-primary hover:underline" href="/register">
            Create an account
          </Link>
        </>
      }
    >
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthFormShell>
  )
}
