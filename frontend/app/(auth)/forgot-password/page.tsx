import type { Metadata } from "next"
import Link from "next/link"

import { AuthFormShell } from "@/features/auth/components/auth-form-shell"
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot password | Nexo",
  description: "Request a password reset link for your Nexo account.",
}

export default function ForgotPasswordPage() {
  return (
    <AuthFormShell
      title="Reset your password"
      description="Enter your email and we will send reset instructions if the account exists."
      footer={
        <Link className="font-medium text-primary hover:underline" href="/login">
          Back to sign in
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthFormShell>
  )
}
