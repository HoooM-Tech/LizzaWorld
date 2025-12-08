"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/components/cart-context";
import { cn } from "@/lib/utils";

export type Product = {
  id: string;
  title: string;
  description: string;
  priceNaira: number;
  sizes: string[];
  colors?: string[]; // New optional color field
  images: string[];
  orderLink?: string;
  isAvailable?: boolean;
};

const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0
});

export function ProductCard({ product }: { product: Product }): JSX.Element {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem } = useCart();

  // Ensure we have at least one image
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["/placeholder.jpg"];

  const hasColors = product.colors && product.colors.length > 0;

  const handleAddToCart = (): void => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    if (hasColors && !selectedColor) {
      alert("Please select a color");
      return;
    }

    addItem({
      id: product.id,
      title: product.title,
      description: product.description,
      priceNaira: product.priceNaira,
      size: selectedSize,
      color: hasColors ? selectedColor : "Default",
      image: images[0], 
    });

    // Reset selections after adding
    setSelectedSize("");
    setSelectedColor("");
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const goToNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <article className="flex flex-col overflow-hidden border border-charcoal/10 bg-white/80">
      {/* Image Gallery */}
      <div className="relative aspect-[4/5] overflow-hidden bg-charcoal/5 group">
        {/* Main Image */}
        <Image
          src={images[currentImageIndex]}
          alt={`${product.title} - Image ${currentImageIndex + 1}`}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 45vw, 100vw"
          unoptimized
          className="object-cover transition duration-700 hover:scale-105 rounded-none"
        />

        {/* Navigation Arrows - Only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-ivory/90 p-2 opacity-0 transition-opacity hover:bg-ivory group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-charcoal" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-ivory/90 p-2 opacity-0 transition-opacity hover:bg-ivory group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-charcoal" />
            </button>
          </>
        )}

        {/* Dot Indicators - Only show if multiple images */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  currentImageIndex === index
                    ? "bg-ivory w-6"
                    : "bg-ivory/50 hover:bg-ivory/75"
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 rounded-full bg-charcoal/70 px-3 py-1 text-xs text-ivory backdrop-blur-sm">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-display text-2xl text-charcoal">{product.title}</h3>
          <p className="mt-2 text-sm text-charcoal/60">{product.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between text-sm text-charcoal/80">
          <span>{formatter.format(product.priceNaira)}</span>
          <span>Sizes {product.sizes.join(" – ")}</span>
        </div>

        {/* Color Selection - Only show if colors are available */}
        {product.isAvailable && hasColors && (
          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger>
              <SelectValue placeholder="Select Color" />
            </SelectTrigger>
            <SelectContent>
              {product.colors!.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Size Selection */}
        {product.isAvailable && product.sizes.length > 0 && (
          <Select value={selectedSize} onValueChange={setSelectedSize}>
            <SelectTrigger>
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>
            <SelectContent>
              {product.sizes.map((size) => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex gap-2">
          <Button
            className="flex-1"
            disabled={!product.isAvailable}
            onClick={handleAddToCart}
          >
            {product.isAvailable ? "Add to Cart" : "Sold Out"}
          </Button>
          {product.orderLink && (
            <Button variant="outline" asChild className="border-charcoal/20 flex-1">
              <Link className="text-charcoal" href={product.orderLink} target="_blank" rel="noreferrer">
                View Look
              </Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}