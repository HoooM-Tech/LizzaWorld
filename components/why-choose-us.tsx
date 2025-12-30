import React from 'react';
import { Sparkles, Star, Heart, Ruler, Users, LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';

// Map icon names to icon components
const iconMap: Record<string, LucideIcon> = {
  Sparkles,
  Star,
  Heart,
  Ruler,
  Users,
};

type WhyChooseUsReason = {
  icon: string;
  title: string;
  description: string;
};

type WhyChooseUsProps = {
  title?: string;
  image?: any;
  reasons?: WhyChooseUsReason[];
};

// Fallback data
const defaultReasons: WhyChooseUsReason[] = [
  {
    icon: "Sparkles",
    title: "Bespoke Craftsmanship",
    description: "Every piece is meticulously handcrafted to your exact specifications, ensuring a perfect fit and unparalleled quality."
  },
  {
    icon: "Heart",
    title: "Personal Journey",
    description: "From initial consultation to final fitting, we guide you through a deeply personal experience that honors your story."
  },
  {
    icon: "Ruler",
    title: "Timeless Design",
    description: "Our designs transcend trends, creating pieces that remain elegant and relevant for generations to come."
  }
];

export default function WhyChooseUs({ 
  title = "Atelier crafted for women who refuse to blend in",
  image,
  reasons = defaultReasons 
}: WhyChooseUsProps) {
  const imageUrl = image ? urlFor(image).url() : "/images/gallery/founder-2.jpg";

  return (
    <section className="bg-ivory py-20 px-6 sm:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <h2 className="font-display text-5xl sm:text-6xl lg:text-7xl text-charcoal max-w-4xl leading-tight">
            {title}
          </h2>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Image Card */}
          <div className="relative h-[400px] bg-charcoal overflow-hidden">
            <Image
              src={imageUrl}
              alt="Lizza Atelier Studio"
              fill
              className="object-cover grayscale opacity-80 rounded-sm"
            />
            <div className="absolute top-6 left-6">
              <p className="text-ivory/80 text-sm tracking-wider">Lizza Atelier®</p>
            </div>
          </div>

          {/* Reason Cards */}
          {reasons.map((reason, index) => {
            const IconComponent = iconMap[reason.icon] || Sparkles;
            return (
              <div key={index} className="bg-ivory border border-charcoal/10 p-8 flex flex-col justify-between">
                <div>
                  <div className="mb-6 inline-flex h-12 w-12 items-center justify-center bg-champagne/10">
                    <IconComponent className="h-6 w-6 text-champagne" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl text-charcoal mb-3">
                    {reason.title}
                  </h3>
                </div>
                <div>
                  <p className="text-sm text-charcoal/70 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export const revalidate = 0;
export const dynamic = 'force-dynamic';