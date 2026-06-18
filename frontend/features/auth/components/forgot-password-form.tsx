"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useForgotPasswordMutation } from "@/features/auth/authApi"

import { getErrorMessage } from "../lib/errors"
import { Field, FormMessage } from "./form-controls"

export function ForgotPasswordForm() {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation()
  const [error, setError] = React.useState("")
  const [message, setMessage] = React.useState("")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setMessage("")

    const formData = new FormData(event.currentTarget)

    try {
      const response = await forgotPassword({
        email: String(formData.get("email")),
      }).unwrap()
      setMessage(response.message)
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <FormMessage>{error}</FormMessage>
      <FormMessage tone="success">{message}</FormMessage>
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Button className="h-10 w-full" disabled={isLoading} type="submit">
        {isLoading ? "Sending..." : "Send reset link"}
      </Button>
    </form>
  )
}
