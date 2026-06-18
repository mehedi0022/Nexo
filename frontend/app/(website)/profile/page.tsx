import type { Metadata } from "next"

import { ProtectedRoute } from "@/features/auth/components/protected-route"
import { ProfileForms } from "@/features/auth/components/profile-forms"

export const metadata: Metadata = {
  title: "Profile | Nexo",
  description: "Manage your Nexo profile and account security.",
  robots: { index: false, follow: false },
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Account settings</h1>
          <p className="mt-2 text-muted-foreground">Manage profile details and password security.</p>
        </div>
        <ProfileForms />
      </main>
    </ProtectedRoute>
  )
}
