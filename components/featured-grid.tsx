"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface FeaturedGridProps {
  images?: string[];
}

const captions = [
  "Quiet Luxury, Defined.",
  "Every Stitch, a Story.",
  "Redefining Elegance."
];

const imageConfig = [
  { width: 480, height: 640, aspect: "aspect-[3/4]" },
  { width: 600, height: 400, aspect: "aspect-[3/2]" },
  { width: 450, height: 600, aspect: "aspect-[3/4]" }
];

const INSTAGRAM_URL = "https://www.instagram.com/lizza.atelier";

export function FeaturedGrid({ images }: FeaturedGridProps) {
  const fallbackImages = captions.map((_, index) => `/images/lizzaa/img-${index + 4}.png`);
  const visualSources = images?.length ? images.slice(0, captions.length) : fallbackImages;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
      {/* First image - Left column, spans full height */}
      <motion.figure
        className="group relative overflow-hidden bg-charcoal/5 md:row-span-2"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-180px" }}
        transition={{ duration: 0.6 }}
      >
        <Link href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="block">
          <div className="aspect-[3/4]">
            <Image
              src={visualSources[0] ?? fallbackImages[0]}
              alt={captions[0]}
              fill
              unoptimized
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale rounded-sm"
            />
          </div>
          <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent p-8 text-ivory">
            <p className="font-display text-2xl">{captions[0]}</p>
          </figcaption>
        </Link>
      </motion.figure>

      {/* Second image - Right column, top */}
      <motion.figure
        className="group relative overflow-hidden bg-charcoal/5 md:mt-16"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Link href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="block">
          <div className="aspect-[3/4]">
            <Image
              src={visualSources[1] ?? fallbackImages[1]}
              alt={captions[1]}
              width={imageConfig[1].width}
              height={imageConfig[1].height}
              unoptimized
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale rounded-sm"
            />
          </div>
          <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent p-8 text-ivory">
            <p className="font-display text-2xl">{captions[1]}</p>
          </figcaption>
        </Link>
      </motion.figure>

      {/* Third image - Right column, bottom */}
      <motion.figure
        className="group relative overflow-hidden bg-charcoal/5"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <Link href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="block">
          <div className="aspect-[3/4]">
            <Image
              src={visualSources[2] ?? fallbackImages[2]}
              alt={captions[2]}
              width={imageConfig[2].width}
              height={imageConfig[2].height}
              unoptimized
              className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:grayscale rounded-sm"
            />
          </div>
          <figcaption className="absolute inset-0 flex items-end bg-gradient-to-t from-charcoal/70 via-charcoal/20 to-transparent p-8 text-ivory">
            <p className="font-display text-2xl">{captions[2]}</p>
          </figcaption>
        </Link>
      </motion.figure>
    </div>
  );
}