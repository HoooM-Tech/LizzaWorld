"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  id?: string;
}

const fadeIn = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-120px" },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
};

export function Section({ title, description, children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("py-20", className)}>
      <motion.div {...fadeIn} className="space-y-10">
        {(title || description) && (
          <div className="max-w-3xl space-y-4">
            {title && <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>}
            {description && <p className="text-lg text-charcoal/70">{description}</p>}
          </div>
        )}
        {children}
      </motion.div>
    </section>
  );
}
