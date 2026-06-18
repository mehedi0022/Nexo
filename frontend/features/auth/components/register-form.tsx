"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { useRegisterMutation } from "@/features/auth/authApi"

import { getErrorMessage } from "../lib/errors"
import { Field, FormMessage } from "./form-controls"

export function RegisterForm() {
  const router = useRouter()
  const [register, { isLoading }] = useRegisterMutation()
  const [error, setError] = React.useState("")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const formData = new FormData(event.currentTarget)
    const email = String(formData.get("email"))

    try {
      await register({
        firstName: String(formData.get("firstName")),
        lastName: String(formData.get("lastName")),
        email,
        password: String(formData.get("password")),
        phone: String(formData.get("phone") || "") || undefined,
      }).unwrap()

      router.push(`/verify-email?email=${encodeURIComponent(email)}`)
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <FormMessage>{error}</FormMessage>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" name="firstName" autoComplete="given-name" required />
        <Field label="Last name" name="lastName" autoComplete="family-name" required />
      </div>
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Button className="h-10 w-full" disabled={isLoading} type="submit">
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  )
}
