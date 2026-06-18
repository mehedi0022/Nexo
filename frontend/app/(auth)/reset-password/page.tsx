import type { Metadata } from "next"
import { Suspense } from "react"

import { AuthFormShell } from "@/features/auth/components/auth-form-shell"
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form"

export const metadata: Metadata = {
  title: "Reset password | Nexo",
  description: "Set a new password for your Nexo account.",
}

export default function ResetPasswordPage() {
  return (
    <AuthFormShell
      title="Choose a new password"
      description="Use the reset token from your email and set a new password."
    >
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </AuthFormShell>
  )
}
