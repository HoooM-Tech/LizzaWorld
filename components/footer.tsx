"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { ChevronDown, Mail } from "lucide-react";
import { useCurrency, CURRENCIES } from "@/components/currency-context";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/bespoke", label: "Bespoke & Bridal" },
  { href: "/about", label: "About" },
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
  const { currency, setCurrencyCode } = useCurrency();
  const year = new Date().getFullYear();

  // Footer Newsletter states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setStatus("error");
      setErrorMessage("All fields are required.");
      return;
    }
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "newsletter",
          data: { fullName, email }
        })
      });

      const resData = await response.json();
      if (response.ok && resData.success) {
        setStatus("success");
        setFullName("");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMessage(resData.error || "Failed to subscribe.");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMessage("An error occurred.");
    }
  };

  return (
    <footer className="border-t border-charcoal/5 bg-champagne/10 py-16">
      <Container className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand Column */}
        <div className="space-y-4">
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

        {/* Links Column */}
        <nav className="space-y-2 text-sm text-charcoal/70">
          <p className="font-semibold text-xs uppercase tracking-wider text-charcoal mb-4">Navigation</p>
          {links.map((link) => (
            <div key={link.href}>
              <Link href={link.href} className="transition hover:text-charcoal">
                {link.label}
              </Link>
            </div>
          ))}
        </nav>

        {/* About & Copyright Column */}
        <div className="space-y-3 text-sm text-charcoal/70">
          <p className="font-semibold text-xs uppercase tracking-wider text-charcoal mb-4">About</p>
          <p>© {year} Lizza Atelier.</p>
          <p>Luxury with intention.</p>
          <p className="text-xs text-charcoal/50">Made by HoooM</p>
          <div className="pt-2">
            <select
              title="Select Currency"
              value={currency.code}
              onChange={(e) => setCurrencyCode(e.target.value)}
              className="bg-transparent text-charcoal/70 border border-charcoal/20 rounded-none px-3 py-1.5 text-xs uppercase tracking-wider focus:outline-none hover:border-charcoal/50 hover:text-charcoal transition cursor-pointer"
            >
              {Object.keys(CURRENCIES).map((code) => (
                <option key={code} value={code} className="text-charcoal bg-ivory">
                  {code} ({CURRENCIES[code].symbol.trim()})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-4">
          <p className="font-semibold text-xs uppercase tracking-wider text-charcoal mb-2">What does power look like on you?</p>
          <p className="text-xs text-charcoal/70 leading-relaxed">
            Join the Lizzaatelier Private List for collection launches, styling insights, and exclusive access.
          </p>

          {status === "success" ? (
            <div className="bg-charcoal/5 border border-charcoal/10 p-4 text-center space-y-1">
              <p className="text-xs font-semibold text-charcoal">Subscribed successfully</p>
              <p className="text-[10px] text-charcoal/60">Thank you for joining the Atelier.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={status === "loading"}
                className="w-full bg-transparent border-b border-charcoal/20 placeholder-charcoal/40 text-charcoal text-xs py-2 focus:outline-none focus:border-charcoal transition duration-300"
              />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading"}
                className="w-full bg-transparent border-b border-charcoal/20 placeholder-charcoal/40 text-charcoal text-xs py-2 focus:outline-none focus:border-charcoal transition duration-300"
              />
              {status === "error" && (
                <p className="text-[10px] text-red-500 font-medium">{errorMessage}</p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-charcoal text-ivory text-xs tracking-widest uppercase py-2.5 font-medium hover:bg-charcoal/90 transition duration-300 disabled:opacity-50"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
        </div>
      </Container>
    </footer>
  );
}