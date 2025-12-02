"use client";

import { useState } from "react";
import { Testimonial } from "@/components/testimonial";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TestimonialItem = {
  quote: string;
  author: string;
  role?: string;
};

const fallbackTestimonials: TestimonialItem[] = [
  {
    quote: "From our first consultation to the final fitting, every detail felt personal and intentional.",
    author: "Sarah O.",
    role: "Client"
  },
  {
    quote: "My gown told my story in every stitch. Lizza Atelier understood exactly who I am.",
    author: "Jochebed",
    role: "Bride"
  },
  {
    quote: "The craftsmanship is unparalleled. Every piece feels like wearable art.",
    author: "Amara K.",
    role: "Client"
  },
  {
    quote: "Lizza Atelier transformed my vision into reality with grace and precision.",
    author: "Victoria M.",
    role: "Entrepreneur"
  }
];

export function Testimonials({ items }: { items?: TestimonialItem[] }) {
  const testimonials = items?.length ? items : fallbackTestimonials;
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative">
      <div className="mb-8">
        <Testimonial {...testimonials[currentIndex]} />
      </div>
      
      <div className="flex items-center justify-end gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPrevious}
          className="h-12 w-12 rounded-sm border-charcoal/20 hover:bg-charcoal/5"
        >
          <ChevronLeft className="h-5 w-5 text-charcoal" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={goToNext}
          className="h-12 w-12 rounded-sm border-charcoal/20 hover:bg-charcoal/5"
        >
          <ChevronRight className="h-5 w-5 text-charcoal" />
        </Button>
      </div>
    </div>
  );
}