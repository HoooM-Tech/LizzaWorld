import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
  icon?: ReactNode;
}

export function Testimonial({ quote, author, role, icon }: TestimonialProps) {
  return (
    <Card className="h-full bg-ivory/90">
      <CardContent className="flex h-full flex-col gap-6">
        <div className="text-4xl text-champagne">“</div>
        <p className="text-lg leading-relaxed text-charcoal/80">{quote}</p>
        <div className="mt-auto">
          <p className="font-display text-lg text-charcoal">{author}</p>
          {role && <p className="text-sm uppercase tracking-[0.2em] text-charcoal/50">{role}</p>}
        </div>
        {icon}
      </CardContent>
    </Card>
  );
}
