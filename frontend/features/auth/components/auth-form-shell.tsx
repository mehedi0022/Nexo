import Link from "next/link"
import type { ReactNode } from "react"

interface AuthFormShellProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
}

export function AuthFormShell({
  title,
  description,
  children,
  footer,
}: AuthFormShellProps) {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center px-4 py-12">
      <Link href="/" className="mb-8 text-xl font-semibold tracking-tight">
        Nexo
      </Link>
      <section className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
        {footer ? <div className="mt-6 text-sm text-muted-foreground">{footer}</div> : null}
      </section>
    </main>
  )
}
