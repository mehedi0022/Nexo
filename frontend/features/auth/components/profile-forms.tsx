"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "@/features/auth/authApi"

import { getErrorMessage } from "../lib/errors"
import { Field, FormMessage } from "./form-controls"

export function ProfileForms() {
  const { data: user, isLoading } = useGetProfileQuery()
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation()
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation()
  const [profileError, setProfileError] = React.useState("")
  const [profileMessage, setProfileMessage] = React.useState("")
  const [passwordError, setPasswordError] = React.useState("")
  const [passwordMessage, setPasswordMessage] = React.useState("")

  async function onProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setProfileError("")
    setProfileMessage("")

    const formData = new FormData(event.currentTarget)

    try {
      await updateProfile({
        firstName: String(formData.get("firstName")),
        lastName: String(formData.get("lastName")),
        phone: String(formData.get("phone") || "") || null,
        avatar: String(formData.get("avatar") || "") || null,
      }).unwrap()
      setProfileMessage("Profile updated successfully.")
    } catch (caughtError) {
      setProfileError(getErrorMessage(caughtError))
    }
  }

  async function onPasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPasswordError("")
    setPasswordMessage("")

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      await changePassword({
        currentPassword: String(formData.get("currentPassword")),
        newPassword: String(formData.get("newPassword")),
      }).unwrap()
      form.reset()
      setPasswordMessage("Password changed successfully.")
    } catch (caughtError) {
      setPasswordError(getErrorMessage(caughtError))
    }
  }

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading profile...</p>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
      <form className="grid gap-4 rounded-lg border bg-card p-5" onSubmit={onProfileSubmit}>
        <div>
          <h2 className="text-lg font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground">Keep your account details current.</p>
        </div>
        <FormMessage>{profileError}</FormMessage>
        <FormMessage tone="success">{profileMessage}</FormMessage>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="First name" name="firstName" defaultValue={user?.firstName} required />
          <Field label="Last name" name="lastName" defaultValue={user?.lastName} required />
        </div>
        <Field label="Email" name="email" type="email" defaultValue={user?.email} disabled />
        <Field label="Phone" name="phone" defaultValue={user?.phone ?? ""} />
        <Field label="Avatar URL" name="avatar" type="url" defaultValue={user?.avatar ?? ""} />
        <Button className="w-fit" disabled={isUpdating} type="submit">
          {isUpdating ? "Saving..." : "Save changes"}
        </Button>
      </form>

      <form className="grid content-start gap-4 rounded-lg border bg-card p-5" onSubmit={onPasswordSubmit}>
        <div>
          <h2 className="text-lg font-semibold">Security</h2>
          <p className="text-sm text-muted-foreground">Update your password regularly.</p>
        </div>
        <FormMessage>{passwordError}</FormMessage>
        <FormMessage tone="success">{passwordMessage}</FormMessage>
        <Field
          label="Current password"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
        <Field
          label="New password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Button className="w-fit" disabled={isChangingPassword} type="submit">
          {isChangingPassword ? "Updating..." : "Change password"}
        </Button>
      </form>
    </div>
  )
}
