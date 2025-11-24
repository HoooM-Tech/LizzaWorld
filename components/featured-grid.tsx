"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface FeaturedGridProps {
  images?: string[];
}

const captions = [
  "Quiet Luxury, Defined.",
  "Every Stitch, a Story.",
  "Redefining Elegance."
];

export function FeaturedGrid({ images }: FeaturedGridProps) {
  const fallbackImages = captions.map((_, index) => `/images/gallery/img-${index + 1}.jpg`);
  const visualSources = images?.length ? images.slice(0, captions.length) : fallbackImages;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {captions.map((caption, index) => (
        <motion.figure
          key={caption}
          className="group relative overflow-hidden rounded-2xl bg-charcoal/5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Image
            src={visualSources[index] ?? fallbackImages[index]}
            alt={caption}
            width={640}
            height={800}
            unoptimized
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
          <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/60 via-charcoal/10 to-transparent p-6 text-ivory">
            <p className="font-display text-xl">{caption}</p>
          </figcaption>
        </motion.figure>
      ))}
    </div>
  );
}
