import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CtaBannerProps {
  title: string;
  ctaLabel: string;
  href: string;
}

export function CtaBanner({ title, ctaLabel, href }: CtaBannerProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-charcoal text-ivory">
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal to-charcoal/80" />
      <div className="relative z-10 flex flex-col gap-6 px-8 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-14">
        <h3 className="max-w-2xl font-display text-3xl">{title}</h3>
        <Button asChild>
          <Link href={href}>{ctaLabel}</Link>
        </Button>
      </div>
    </div>
  );
}
