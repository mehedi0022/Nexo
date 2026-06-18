import type { Metadata } from "next"
import Link from "next/link"

import { AuthFormShell } from "@/features/auth/components/auth-form-shell"
import { RegisterForm } from "@/features/auth/components/register-form"

export const metadata: Metadata = {
  title: "Create account | Nexo",
  description: "Create your Nexo account.",
}

export default function RegisterPage() {
  return (
    <AuthFormShell
      title="Create your account"
      description="We will send a verification code to confirm your email."
      footer={
        <>
          Already have an account?{" "}
          <Link className="font-medium text-primary hover:underline" href="/login">
            Sign in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthFormShell>
  )
}
