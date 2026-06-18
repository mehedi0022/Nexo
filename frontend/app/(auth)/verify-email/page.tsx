import type { Metadata } from "next"
import { Suspense } from "react"

import { AuthFormShell } from "@/features/auth/components/auth-form-shell"
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form"

export const metadata: Metadata = {
  title: "Verify email | Nexo",
  description: "Verify your Nexo account email address.",
}

export default function VerifyEmailPage() {
  return (
    <AuthFormShell
      title="Verify your email"
      description="Enter the code we sent to your inbox to activate your account."
    >
      <Suspense>
        <VerifyEmailForm />
      </Suspense>
    </AuthFormShell>
  )
}
