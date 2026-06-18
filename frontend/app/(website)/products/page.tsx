import type { Metadata } from "next"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Products | Nexo",
  description: "Explore products available on Nexo.",
}

export default function ProductsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-2 text-muted-foreground">Product listing integration can attach to the catalog API here.</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/categories/all">Browse categories</Link>
        </Button>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["Featured essentials", "New arrivals", "Popular picks"].map((name) => (
          <article className="rounded-lg border bg-card p-5" key={name}>
            <h2 className="font-semibold">{name}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              This server-rendered placeholder keeps the route SEO-ready while the product API UI is built out.
            </p>
          </article>
        ))}
      </section>
    </main>
  )
}
