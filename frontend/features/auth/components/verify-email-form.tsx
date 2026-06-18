"use client"

import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { useVerifyEmailMutation } from "@/features/auth/authApi"

import { getErrorMessage } from "../lib/errors"
import { Field, FormMessage } from "./form-controls"

export function VerifyEmailForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation()
  const [error, setError] = React.useState("")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const formData = new FormData(event.currentTarget)

    try {
      await verifyEmail({
        email: String(formData.get("email")),
        otp: String(formData.get("otp")),
      }).unwrap()

      router.replace("/profile")
      router.refresh()
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <FormMessage>{error}</FormMessage>
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={searchParams.get("email") ?? ""}
        required
      />
      <Field label="Verification code" name="otp" inputMode="numeric" required />
      <Button className="h-10 w-full" disabled={isLoading} type="submit">
        {isLoading ? "Verifying..." : "Verify email"}
      </Button>
    </form>
  )
}
