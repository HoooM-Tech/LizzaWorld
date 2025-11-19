import Link from "next/link";
import { Container } from "@/components/container";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/bespoke", label: "Bespoke & Bridal" },
  { href: "/consultation", label: "Consultation" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" }
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-charcoal/5 bg-champagne/10 py-12">
      <Container className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-3">
          <p className="font-display text-lg uppercase tracking-[0.4em] text-charcoal">LIZZA ATELIER</p>
          <p className="text-sm text-charcoal/70">
            Lagos, Nigeria — By appointment only
          </p>
          <p className="text-sm text-charcoal/70">
            info@lizzaatelier.com
          </p>
        </div>
        <nav className="space-y-2 text-sm text-charcoal/70">
          {links.map((link) => (
            <div key={link.href}>
              <Link href={link.href} className="transition hover:text-charcoal">
                {link.label}
              </Link>
            </div>
          ))}
        </nav>
        <div className="space-y-3 text-sm text-charcoal/70">
          <p>© {year} Lizza Atelier. All rights reserved.</p>
          <p>Luxury with intention.</p>
        </div>
      </Container>
    </footer>
  );
}
