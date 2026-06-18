import Link from "next/link"

const footerLinks = [
  { href: "/products", label: "Products" },
  { href: "/categories/all", label: "Categories" },
  { href: "/cart", label: "Cart" },
  { href: "/profile", label: "Profile" },
]

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1fr_auto]">
        <div>
          <Link className="text-lg font-semibold tracking-tight" href="/">
            Nexo
          </Link>
          <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            A focused commerce experience for discovering products, managing orders, and keeping your account secure.
          </p>
        </div>
        <nav className="grid gap-2 text-sm" aria-label="Footer navigation">
          {footerLinks.map((link) => (
            <Link className="text-muted-foreground transition hover:text-foreground" href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}
