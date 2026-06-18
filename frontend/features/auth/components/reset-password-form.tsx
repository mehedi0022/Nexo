"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { useResetPasswordMutation } from "@/features/auth/authApi"

import { getErrorMessage } from "../lib/errors"
import { Field, FormMessage } from "./form-controls"

export function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const [resetPassword, { isLoading }] = useResetPasswordMutation()
  const [error, setError] = React.useState("")
  const [message, setMessage] = React.useState("")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setMessage("")

    const formData = new FormData(event.currentTarget)

    try {
      const response = await resetPassword({
        token: String(formData.get("token")),
        password: String(formData.get("password")),
      }).unwrap()
      setMessage(response.message)
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <FormMessage>{error}</FormMessage>
      <FormMessage tone="success">
        {message ? (
          <>
            {message}{" "}
            <Link className="font-medium underline" href="/login">
              Sign in
            </Link>
          </>
        ) : null}
      </FormMessage>
      <Field
        label="Reset token"
        name="token"
        defaultValue={searchParams.get("token") ?? ""}
        required
      />
      <Field
        label="New password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Button className="h-10 w-full" disabled={isLoading} type="submit">
        {isLoading ? "Resetting..." : "Reset password"}
      </Button>
    </form>
  )
}
