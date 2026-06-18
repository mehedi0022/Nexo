"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { useLoginMutation } from "@/features/auth/authApi"

import { getErrorMessage } from "../lib/errors"
import { Field, FormMessage } from "./form-controls"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [login, { isLoading }] = useLoginMutation()
  const [error, setError] = React.useState("")

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")

    const formData = new FormData(event.currentTarget)

    try {
      await login({
        email: String(formData.get("email")),
        password: String(formData.get("password")),
        rememberMe: formData.get("rememberMe") === "on",
      }).unwrap()

      router.replace(searchParams.get("next") || "/profile")
      router.refresh()
    } catch (caughtError) {
      setError(getErrorMessage(caughtError))
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <FormMessage>{error}</FormMessage>
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        minLength={8}
        required
      />
      <div className="flex items-center justify-between gap-4 text-sm">
        <label className="flex items-center gap-2 text-muted-foreground">
          <input name="rememberMe" type="checkbox" className="size-4 rounded border" />
          Remember me
        </label>
        <Link className="font-medium text-primary hover:underline" href="/forgot-password">
          Forgot password?
        </Link>
      </div>
      <Button className="h-10 w-full" disabled={isLoading} type="submit">
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  )
}
