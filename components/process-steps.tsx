"use client";

import { motion } from "framer-motion";

type Step = {
  title: string;
  body?: string;
  description?: string;
};

const fallbackSteps: Step[] = [
  {
    title: "Consultation",
    description:
      "Your journey begins with a one-on-one consultation where we listen to your vision, personality, and story — translating your essence into design."
  },
  {
    title: "Design",
    description:
      "We sketch, source fabrics, and refine every detail to ensure your gown embodies elegance and authenticity. Every silhouette complements your individuality."
  },
  {
    title: "Creation",
    description:
      "Our artisans bring your vision to life through precision tailoring, delicate handwork, and timeless finishes — creating a piece as personal as your story."
  }
];

export function ProcessSteps({ steps }: { steps?: Step[] }) {
  const processSteps = steps?.length ? steps : fallbackSteps;

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {processSteps.map((step, index) => (
        <motion.div
          key={step.title}
          className="rounded-2xl border border-charcoal/10 bg-white/70 p-8 shadow-soft"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-charcoal/40">Step {index + 1}</p>
          <h3 className="mt-4 font-display text-2xl text-charcoal">{step.title}</h3>
          <p className="mt-4 text-sm leading-relaxed text-charcoal/70">{step.description ?? step.body}</p>
        </motion.div>
      ))}
    </div>
  );
}
