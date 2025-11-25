"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type CTA = {
  label: string;
  href: string;
};

interface HeroProps {
  video?: string;
  headline?: string;
  subtext?: string;
  ctas?: CTA[];
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
};

export function Hero({ video, headline, subtext, ctas }: HeroProps) {
  const defaultCtas: CTA[] = [
    { label: "Shop Ready-to-Wear", href: "/shop" },
    { label: "Discover Bespoke", href: "/bespoke" },
    { label: "Book a Consultation", href: "/consultation" }
  ];

  const heroCtas = ctas?.length ? ctas : defaultCtas;
  const [primaryCta, secondaryCta, tertiaryCta] = heroCtas;

  return (
    <section className="relative h-[70vh] min-h-[540px] overflow-hidden rounded-2xl bg-charcoal text-ivory">
      <video
        src={video ?? "/hero.mp4"}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-center opacity-70"
      />
      <div className="absolute inset-0 bg-charcoal/40" />
      <div className="relative z-10 flex h-full flex-col items-start justify-center gap-8 px-6 py-16 sm:px-12 lg:px-24">
        <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={fadeUp.transition}>
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-champagne">Luxury with intention</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl">{headline ?? "The Art of Becoming"}</h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/80">
            {subtext ??
              "Timeless pieces that mirror your evolution — crafted to celebrate strength, softness, and sophistication."}
          </p>
        </motion.div>
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="flex flex-wrap gap-4"
        >
          {primaryCta && (
            <Button asChild>
              <Link href={primaryCta.href}>{primaryCta.label}</Link>
            </Button>
          )}
          {secondaryCta && (
            <Button variant="outline" asChild>
              <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
            </Button>
          )}
          {tertiaryCta && (
            <Button variant="outline" asChild>
              <Link href={tertiaryCta.href}>{tertiaryCta.label}</Link>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
}