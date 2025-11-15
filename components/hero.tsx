"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] }
};

export function Hero() {
  return (
    <section className="relative h-[70vh] min-h-[540px] overflow-hidden rounded-2xl bg-charcoal text-ivory">
      <Image
        src="/images/hero.jpg"
        alt="Lizza Atelier couture silhouette"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-70"
      />
      <div className="absolute inset-0 bg-charcoal/40" />
      <div className="relative z-10 flex h-full flex-col items-start justify-center gap-8 px-6 py-16 sm:px-12 lg:px-24">
        <motion.div initial={fadeUp.initial} animate={fadeUp.animate} transition={fadeUp.transition}>
          <p className="mb-4 text-sm uppercase tracking-[0.35em] text-champagne">Luxury with intention</p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl">The Art of Becoming</h1>
          <p className="mt-6 max-w-2xl text-lg text-ivory/80">
            Timeless pieces that mirror your evolution — crafted to celebrate strength, softness, and sophistication.
          </p>
        </motion.div>
        <motion.div
          initial={fadeUp.initial}
          animate={fadeUp.animate}
          transition={{ ...fadeUp.transition, delay: 0.2 }}
          className="flex flex-wrap gap-4"
        >
          <Button asChild>
            <Link href="/shop">Shop Ready-to-Wear</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/bespoke">Discover Bespoke</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/consultation">Book a Consultation</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
