"use client"

import {
  List,
  MagnifyingGlass,
  ShoppingCart,
  SignOut,
  UserCircle,
  X,
} from "@phosphor-icons/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { useLogoutMutation } from "@/features/auth/authApi"
import { cn } from "@/lib/utils"
import { useAppSelector } from "@/store/hooks"

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/categories/all", label: "Categories" },
]

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <>
      {links.map((link) => (
        <Link
          className={cn(
            "text-sm font-medium text-muted-foreground transition hover:text-foreground",
            pathname === link.href && "text-foreground"
          )}
          href={link.href}
          key={link.href}
          onClick={onNavigate}
        >
          {link.label}
        </Link>
      ))}
    </>
  )
}

export function Navbar() {
  const [open, setOpen] = React.useState(false)
  const { user } = useAppSelector((state) => state.auth)
  const [logout, { isLoading }] = useLogoutMutation()

  async function onLogout() {
    await logout().unwrap().catch(() => undefined)
  }

  const accountLabel = user ? `${user.firstName} ${user.lastName}` : "Account"

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link className="text-xl font-semibold tracking-tight" href="/">
          Nexo
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          <NavLinks />
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="icon" aria-label="Search">
            <MagnifyingGlass />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart" asChild>
            <Link href="/cart">
              <ShoppingCart />
            </Link>
          </Button>
          {user ? (
            <>
              <Button variant="outline" asChild>
                <Link href="/profile">
                  <UserCircle />
                  {accountLabel}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" aria-label="Sign out" disabled={isLoading} onClick={onLogout}>
                <SignOut />
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Create account</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          className="md:hidden"
          variant="ghost"
          size="icon"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <List />}
        </Button>
      </div>

      {open ? (
        <div className="border-t bg-background md:hidden">
          <nav className="mx-auto grid max-w-6xl gap-4 px-4 py-4" aria-label="Mobile navigation">
            <NavLinks onNavigate={() => setOpen(false)} />
            <div className="grid gap-2 border-t pt-4">
              {user ? (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/profile" onClick={() => setOpen(false)}>
                      <UserCircle />
                      {accountLabel}
                    </Link>
                  </Button>
                  <Button variant="ghost" disabled={isLoading} onClick={onLogout}>
                    <SignOut />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link href="/login" onClick={() => setOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register" onClick={() => setOpen(false)}>
                      Create account
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
