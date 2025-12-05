"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { ChevronDown, Mail } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/bespoke", label: "Bespoke & Bridal" },
  { href: "/consultation", label: "Consultation" },
  { href: "/legal/terms", label: "Terms" },
  { href: "/legal/privacy", label: "Privacy" }
];

const emails = [
  { email: "lizza@lizzaatelier.com", label: "General Inquiries" },
  { email: "info@lizzaatelier.com", label: "Information" },
  { email: "orders@lizzaatelier.com", label: "Orders" },
  { email: "account@lizzaatelier.com", label: "Account Support" },
  { email: "hr@lizzaatelier.com", label: "Human Resources" }
];

export function Footer() {
  const [showEmails, setShowEmails] = useState(false);
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-charcoal/5 bg-champagne/10 py-12">
      <Container className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-3">
          <p className="font-display text-lg uppercase tracking-[0.4em] text-charcoal">LIZZA ATELIER</p>
          <p className="text-sm text-charcoal/70">
            Lagos, Nigeria — By appointment only
          </p>
          
          {/* Email Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowEmails(!showEmails)}
              className="flex items-center gap-2 text-sm text-charcoal/70 hover:text-charcoal transition group"
            >
              <Mail className="h-4 w-4" />
              <span>info@lizzaatelier.com</span>
              <ChevronDown 
                className={`h-4 w-4 transition-transform ${showEmails ? 'rotate-180' : ''}`} 
              />
            </button>

            {showEmails && (
              <div className="absolute bottom-full mb-2 left-0 bg-ivory border border-charcoal/10 shadow-lg rounded-sm py-2 min-w-[280px] z-10">
                <div className="px-4 py-2 text-xs uppercase tracking-wider text-charcoal/50 border-b border-charcoal/5">
                  Contact Us
                </div>
                {emails.map((item) => (
                  <Link
                    key={item.email}
                    href={`mailto:${item.email}`}
                    className="block px-4 py-2 text-sm text-charcoal/70 hover:bg-champagne/10 hover:text-charcoal transition"
                  >
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-charcoal/50">{item.email}</div>
                  </Link>
                ))}
              </div>
            )}
          </div>
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