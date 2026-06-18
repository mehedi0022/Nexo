import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Nexo | Modern E-commerce",
  description: "Discover curated products and manage your shopping account securely with Nexo.",
}

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-center">
        <div>
          <p className="text-sm font-medium text-primary">Secure shopping, simple account control</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-6xl">Nexo commerce</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Browse products, manage your profile, and move through checkout with cookie-based authentication built for a safer session.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/products">Shop products</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">Create account</Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-4 rounded-lg border bg-card p-5">
          <div className="rounded-lg bg-muted p-5">
            <p className="text-sm font-medium">Account-ready checkout</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Protected routes, profile management, and session persistence are wired into the frontend architecture.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <p className="text-2xl font-semibold">24h</p>
              <p className="text-sm text-muted-foreground">standard session</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-2xl font-semibold">7d</p>
              <p className="text-sm text-muted-foreground">remembered session</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
