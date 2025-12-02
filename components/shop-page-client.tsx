"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { Section } from "@/components/section";
import { SizeGuide } from "@/components/size-guide";
import { CtaBanner } from "@/components/cta-banner";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Product = {
  id: string;
  title: string;
  description: string;
  priceNaira: number;
  sizes: string[];
  image: string;
  orderLink?: string;
  isAvailable?: boolean;
};

type ShopPageClientProps = {
  products: Product[];
  editorialImages: string[];
  collectionTitle: string;
  introCopy: string;
  similarProducts: Product[];
};

const ITEMS_PER_PAGE = 3;

const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0
});

export default function ShopPageClient({
  products,
  editorialImages,
  collectionTitle,
  introCopy,
  similarProducts
}: ShopPageClientProps) {
  const [currentPage, setCurrentPage] = useState(0);
  
  const totalPages = Math.ceil(similarProducts.length / ITEMS_PER_PAGE);
  
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = similarProducts.slice(startIndex, endIndex);

  const goToNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <div className="space-y-16">
      <header className="space-y-6">
        <h1 className="font-display text-4xl sm:text-5xl">{collectionTitle}</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-charcoal/70">{introCopy}</p>
      </header>
      
      <Section>
        <ProductGrid products={products} />
      </Section>
      
      <SizeGuide />

      {/* Similar Products Section */}
      {similarProducts.length > 0 && (
        <Section title="You May Also Like">
          <div className="space-y-8">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {currentItems.map((product) => (
                <Link
                  key={product.id}
                  //href={`/shop/${product.id}`}
                  href="https://www.instagram.com/lizza.atelier"
                  className="group block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-charcoal mb-6">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      unoptimized
                      className="rounded-sm object-cover transition-all duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                    />
                    
                    <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/20 transition-all duration-500 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span className="bg-ivory text-charcoal px-6 py-3 text-sm font-medium tracking-wider uppercase">
                          VIEW PRODUCT
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl text-charcoal mb-1">
                        {product.title}
                      </h3>
                      <p className="text-sm text-charcoal/60 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                    <span className="text-lg text-charcoal/80 font-light whitespace-nowrap">
                      {formatter.format(product.priceNaira)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-end gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevious}
                  className="h-12 w-12 border-charcoal/20 hover:bg-charcoal/5"
                >
                  <ChevronLeft className="h-5 w-5 text-charcoal"/>
                </Button>
                <span className="text-sm text-charcoal/60">
                  {currentPage + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNext}
                  className="h-12 w-12 border-charcoal/20 hover:bg-charcoal/5"
                >
                  <ChevronRight className="h-5 w-5 text-charcoal"/>
                </Button>
              </div>
            )}
          </div>
        </Section>
      )}

      <CtaBanner title="Begin Your Journey" ctaLabel="Book a Consultation" href="/consultation" />
    </div>
  );
}