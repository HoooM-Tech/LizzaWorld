"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type CTA = {
  label: string;
  href: string;
};

interface HeroProps {
  image?: string;
  video?: string;
  headline?: string;
  subtext?: string;
  ctas?: CTA[];
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] as any }
};

export function Hero({ image, video, headline, subtext, ctas }: HeroProps) {
  const defaultCtas: CTA[] = [
    { label: "Shop ready-to-wear", href: "/shop" },
    { label: "Book a consultation", href: "/consultation" }
  ];

  const heroCtas = ctas?.length ? ctas : defaultCtas;
  const [primaryCta, secondaryCta] = heroCtas;

  return (
    <section className="relative top-0 h-screen w-full overflow-hidden bg-charcoal text-ivory">
      {/* Background Media */}
      {video ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        >
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={image ?? "/hero.jpg"}
          alt="Hero background"
          fill
          priority
          className="object-cover object-center opacity-60 rounded-none"
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal/50 via-charcoal/30 to-charcoal/60" />
      
      {/* Content */}
      <div className="relative z-10 flex h-full items-end px-6 pb-40 pt-32 sm:px-12 lg:px-24">
        <div className="w-full max-w-7xl flex items-end justify-between gap-8 flex-wrap">
          {/* Left: Text Content */}
          <motion.div 
            initial={fadeUp.initial} 
            animate={fadeUp.animate} 
            transition={fadeUp.transition} 
            className="max-w-2xl space-y-6"
          >
            <p className="text-sm uppercase tracking-[0.35em] text-champagne">
              Luxury with Intention
            </p>
            <h1 className="font-display text-5xl leading-tight sm:text-6xl lg:text-6xl">
              {headline ?? "The Art of Becoming"}
            </h1>
            <p className="text-lg leading-relaxed text-ivory/90 max-w-xl">
              {subtext ??
                "Timeless pieces that mirror your evolution — crafted to celebrate strength, softness, and sophistication."}
            </p>
          </motion.div>

          {/* Right: Buttons */}
          <motion.div
            initial={fadeUp.initial}
            animate={fadeUp.animate}
            transition={{ ...fadeUp.transition, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 items-end"
          >
            {primaryCta && (
              <Button asChild size="lg" className="bg-ivory text-charcoal hover:bg-ivory/90 min-w-[200px]">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
            )}
            {secondaryCta && (
              <Button 
                variant="outline" 
                asChild 
                size="lg"
                className="border-ivory text-ivory hover:bg-ivory hover:text-charcoal min-w-[200px]"
              >
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}