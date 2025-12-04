"use client";

import Link from "next/link";
import { useState } from "react";
import { Instagram, Search, ShoppingCart, Menu, X } from "lucide-react";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchDialog } from "@/components/search-dialog";
import { useCart } from "@/components/cart-context";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/bespoke", label: "Bespoke & Bridal" },
  { href: "/consultation", label: "Consultation" }
];

export function Navbar() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { items } = useCart();

  // Calculate total number of items in cart
  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-charcoal/70 backdrop-blur-sm">
        <Container className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {/* Desktop: Show text logo */}
            <span className="hidden md:block font-display text-xl tracking-[0.2em] text-[#ffff]">
              LIZZA ATELIER
            </span>
            {/* Mobile: Show image logo */}
            <img
              src="/logo.png"
              alt="Lizza Atelier"
              className="md:hidden h-10 w-10 object-contain rounded-none color-[#ffff]"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden items-center gap-10 text-sm uppercase tracking-[0.15em] text-[#ffff] lg:flex">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-ivory">
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Desktop & Mobile Icons */}
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Search" 
              onClick={() => setIsSearchOpen(true)}
              className="text-ivory hover:bg-ivory/10 hover:text-ivory"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              asChild 
              className="hidden md:flex text-ivory hover:bg-ivory/10 hover:text-ivory"
            >
              <Link href="https://www.instagram.com/lizza.atelier" aria-label="Visit Instagram">
                <Instagram className="h-5 w-5" />
              </Link>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="View cart" 
              onClick={() => setIsCartOpen(true)}
              className="relative text-ivory hover:bg-ivory/10 hover:text-ivory"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-ivory text-[10px] font-semibold text-charcoal">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Button>

            {/* Mobile Hamburger Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-ivory hover:bg-ivory/10 hover:text-ivory"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </Container>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-ivory/10 bg-charcoal/90 backdrop-blur">
            <Container className="py-6">
              <nav className="flex flex-col space-y-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm uppercase tracking-[0.2em] text-[#ffff] transition hover:text-ivory py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="https://www.instagram.com/lizza.atelier"
                  target="_blank"
                  className="text-sm uppercase tracking-[0.2em] text-[#ffff] transition hover:text-ivory py-2 flex items-center gap-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Instagram className="h-5 w-5" />
                  Instagram
                </Link>
              </nav>
            </Container>
          </div>
        )}
      </header>

      <CartDrawer open={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <SearchDialog open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}