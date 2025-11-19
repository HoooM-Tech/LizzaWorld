"use client";

import Link from "next/link";
import { useState } from "react";
import { Instagram, Search, ShoppingCart } from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchDialog } from "@/components/search-dialog";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/bespoke", label: "Bespoke & Bridal" },
  { href: "/consultation", label: "Consultation" }
];

export function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/5 bg-ivory/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-xl tracking-[0.4em] text-charcoal">
          LIZZA ATELIER
        </Link>
        <nav className="hidden items-center gap-10 text-sm uppercase tracking-[0.2em] text-charcoal/80 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-charcoal">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="https://www.instagram.com/lizza.atelier" aria-label="Visit Instagram">
              <Instagram className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" aria-label="View cart" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </Container>
      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchDialog open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
