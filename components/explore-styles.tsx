"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Category {
  name: string;
  image: string;
  href: string;
}

const CATEGORIES: Category[] = [
  { name: "Suit", image: "/images/categories/suit.png", href: "/shop/suits" },
  { name: "Jacket", image: "/images/categories/jacket.png", href: "/shop/jackets" },
  { name: "Pant", image: "/images/categories/pant.png", href: "/shop/pants" },
  { name: "Short", image: "/images/categories/short.png", href: "/shop/shorts" },
  { name: "Skirt", image: "/images/categories/skirt.png", href: "/shop/skirts" },
  { name: "Coat", image: "/images/categories/coat.png", href: "/shop/coats" },
  { name: "Hat", image: "/images/categories/hat.png", href: "/shop/hats" },
  { name: "Bridal Dress", image: "/images/categories/bridal.png", href: "/shop/bridal-dresses" },
];

interface ExploreStylesProps {
  categories?: Category[];
}

export function ExploreStyles({ categories }: ExploreStylesProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(4);

  const displayCategories = categories && categories.length > 0 ? categories : CATEGORIES;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(4);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalSteps = displayCategories.length - itemsPerPage + 1;

  // Auto-scroll horizontally one item at a time every 4 seconds
  useEffect(() => {
    if (totalSteps <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev < totalSteps - 1 ? prev + 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, [totalSteps]);

  // Ensure current index is within boundaries after layout resize
  useEffect(() => {
    if (currentIndex >= totalSteps) {
      setCurrentIndex(Math.max(0, totalSteps - 1));
    }
  }, [totalSteps, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : totalSteps - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < totalSteps - 1 ? prev + 1 : 0));
  };

  return (
    <section id="explore-styles" className="space-y-12 py-8">
      {/* Section Heading */}
      <div className="text-center space-y-4">
        <h2 className="font-display text-3xl sm:text-4xl text-charcoal tracking-wide uppercase">
          Explore Our Styles
        </h2>
        <div className="w-12 h-0.5 bg-champagne mx-auto" />
      </div>

      {/* Categories Carousel */}
      <div className="overflow-hidden w-full px-2">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` }}
        >
          {displayCategories.map((category) => (
            <div
              key={category.name}
              className="w-1/2 md:w-1/4 flex-shrink-0 px-4 flex flex-col items-center group"
            >
              <Link href={category.href} className="flex flex-col items-center">
                {/* Round image container */}
                <div className="relative w-40 h-40 sm:w-52 sm:h-52 md:w-56 md:h-56 rounded-full overflow-hidden bg-ivory/50 border border-charcoal/10 shadow-sm flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:border-champagne">
                  <Image
                    src={category.image}
                    alt={`${category.name} category`}
                    fill
                    sizes="(min-width: 768px) 25vw, 50vw"
                    className="object-cover object-center rounded-none"
                  />
                </div>

                {/* Category Name below */}
                <span className="mt-4 px-5 py-2 bg-charcoal text-ivory text-xs sm:text-sm font-medium tracking-wider uppercase transition-colors group-hover:text-champagne rounded-full shadow-sm">
                  {category.name}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination pill */}
      {totalSteps > 1 && (
        <div className="flex justify-center pt-2">
          <div className="inline-flex items-center gap-4 bg-charcoal border border-champagne/30 rounded-full px-3 py-1.5 text-ivory shadow-soft">
            <button
              onClick={handlePrev}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-champagne hover:text-charcoal transition-all duration-300"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-xs sm:text-sm min-w-[3rem] text-center tracking-widest">
              {currentIndex + 1}/{totalSteps}
            </span>
            <button
              onClick={handleNext}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-champagne hover:text-charcoal transition-all duration-300"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
