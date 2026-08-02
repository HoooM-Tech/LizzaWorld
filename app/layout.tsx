import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CartProvider } from "@/components/cart-context";
import { CurrencyProvider } from "@/components/currency-context";
import { NewsletterModal } from "@/components/newsletter-modal";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading"
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "Lizza Atelier — The Art of Becoming",
  description:
    "Refined womenswear blending bespoke couture and ready-to-wear. Modern African luxury with intention.",
  openGraph: {
    title: "Lizza Atelier — The Art of Becoming",
    description:
      "Refined womenswear blending bespoke couture and ready-to-wear. Modern African luxury with intention.",
    url: "https://lizzaatelier.com",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Lizza Atelier editorial imagery"
      }
    ]
  },
  metadataBase: new URL("https://lizzaatelier.com")
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable}`} suppressHydrationWarning>
      <body className="bg-ivory text-charcoal antialiased" suppressHydrationWarning>
        <CurrencyProvider>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen pt-20">
              {children}
            </main>
            <Footer />
            <NewsletterModal />
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}