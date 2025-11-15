"use client";

import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Accordion({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-4", className)} {...props} />;
}

export function AccordionItem({ children }: { children: ReactNode }) {
  return <details className="group rounded-2xl border border-charcoal/15 bg-white/70 p-6 shadow-soft/10">{children}</details>;
}

export function AccordionTrigger({ children }: { children: ReactNode }) {
  return (
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-lg font-medium text-charcoal">
      {children}
      <span className="text-sm text-charcoal/40 transition-transform duration-300 group-open:rotate-45">+</span>
    </summary>
  );
}

export function AccordionContent({ children }: { children: ReactNode }) {
  return <div className="mt-4 space-y-2 text-sm text-charcoal/70">{children}</div>;
}
