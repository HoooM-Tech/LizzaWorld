"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Eye } from "lucide-react";
import { useCurrency } from "@/components/currency-context";

type Product = {
  id: string;
  title: string;
  description: string;
  priceNaira: number;
  sizes: string[];
  colors?: string[];
  heights?: string[];
  tags?: string[];
  slug?: string;
  createdAt?: string;
  images: string[];
  orderLink?: string;
  isAvailable?: boolean;
};

type ProductCardProps = {
  product: Product;
  onQuickView: () => void;
  isRowLayout?: boolean;
};

export function ProductCard({ product, onQuickView, isRowLayout = false }: ProductCardProps): JSX.Element {
  const { formatPrice } = useCurrency();
  const images = product.images && product.images.length > 0 
    ? product.images 
    : ["/placeholder.jpg"];

  const isNew = product.tags?.some(tag => tag.toUpperCase() === "NEW") || false;

  if (isRowLayout) {
    return (
      <Link
        href={`/shop/${product.slug || product.id}`}
        className="group flex flex-col sm:flex-row gap-6 w-full text-left bg-charcoal text-ivory border border-champagne/10 p-6 transition-all duration-300 hover:border-champagne/30"
      >
        {/* Left: Image (Aspect-ratio) */}
        <div className="relative aspect-[3/4] w-full sm:w-64 overflow-hidden bg-charcoal/5 flex-shrink-0">
          {/* Primary Image */}
          <Image
            src={images[0]}
            alt={product.title}
            fill
            sizes="(min-width: 640px) 256px, 100vw"
            className={`object-cover rounded-none transition-all duration-700 ${
              images.length > 1 
                ? "group-hover:opacity-0 group-hover:scale-105" 
                : "group-hover:scale-105"
            }`}
          />
          {/* Secondary Hover Image */}
          {images.length > 1 && (
            <Image
              src={images[1]}
              alt={`${product.title} Alternate View`}
              fill
              sizes="(min-width: 640px) 256px, 100vw"
              className="object-cover rounded-none absolute inset-0 opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
            />
          )}
          
          {/* Coral NEW badge top-left */}
          {isNew && (
            <span className="absolute top-4 left-4 z-10 bg-[#F27A59] text-white text-[10px] tracking-wider uppercase font-semibold px-3 py-1.5 rounded-full select-none shadow-sm">
              NEW
            </span>
          )}

          {/* Sold out overlay */}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-charcoal/30 flex items-center justify-center z-10">
              <span className="bg-charcoal text-ivory text-xs font-semibold tracking-widest uppercase px-4 py-2 border border-ivory/10">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col justify-center space-y-4 flex-1">
          <div>
            <h3 className="font-bold text-lg tracking-widest uppercase text-white group-hover:text-champagne transition-colors">
              {product.title}
            </h3>
            <p className="text-base font-medium text-champagne mt-1">
              {product.sizes && product.sizes.length > 1 ? "From " : ""}{formatPrice(product.priceNaira)}
            </p>
          </div>
          
          <p className="text-sm font-light text-ivory/70 leading-relaxed max-w-xl line-clamp-3">
            {product.description}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView();
              }}
              className="px-6 py-3 border border-white text-white text-xs tracking-widest uppercase hover:bg-white hover:text-charcoal font-semibold transition-all duration-300 rounded-none bg-transparent"
            >
              Select options
            </button>
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView();
              }}
              className="w-11 h-11 rounded-full bg-white text-charcoal flex items-center justify-center shadow-md hover:bg-champagne active:scale-90 transition-all duration-300"
              aria-label="Quick View"
              title="Quick View"
            >
              <Eye className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      href={`/shop/${product.slug || product.id}`}
      className="group block w-full text-left focus:outline-none"
    >
      {/* Image Wrapper (3:4 ratio) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-charcoal/5">
        {/* Primary Image */}
        <Image
          src={images[0]}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className={`object-cover rounded-none transition-all duration-700 ${
            images.length > 1 
              ? "group-hover:opacity-0 group-hover:scale-105" 
              : "group-hover:scale-105"
          }`}
        />

        {/* Secondary Hover Image */}
        {images.length > 1 && (
          <Image
            src={images[1]}
            alt={`${product.title} Alternate View`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover rounded-none absolute inset-0 opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
          />
        )}

        {/* Coral NEW badge top-left */}
        {isNew && (
          <span className="absolute top-4 left-4 z-10 bg-[#F27A59] text-white text-[10px] tracking-wider uppercase font-semibold px-3 py-1.5 rounded-full select-none shadow-sm">
            NEW
          </span>
        )}

        {/* Sold out overlay */}
        {!product.isAvailable && (
          <div className="absolute inset-0 bg-charcoal/30 flex items-center justify-center z-10">
            <span className="bg-charcoal text-ivory text-xs font-semibold tracking-widest uppercase px-4 py-2 border border-ivory/10">
              Sold Out
            </span>
          </div>
        )}

        {/* Hover circular overlay buttons stacked vertically centered right */}
        {product.isAvailable && (
          <div 
            className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-20"
            onClick={(e) => {
              // Prevent navigation to detail page when interacting with overlay buttons
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {/* Shopping Bag Button */}
            <div className="relative group/btn">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView();
                }}
                className="w-10 h-10 rounded-full bg-white text-charcoal flex items-center justify-center shadow-md hover:bg-champagne hover:text-charcoal active:scale-90 transition-all duration-300"
                aria-label="Select Options"
                title="Select Options"
              >
                <ShoppingBag className="h-4.5 w-4.5" />
              </button>
              <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-charcoal text-ivory text-[9px] tracking-widest uppercase px-2.5 py-1.5 pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-ivory/10 shadow-sm font-medium">
                Select Options
              </span>
            </div>

            {/* Eye Button */}
            <div className="relative group/btn">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onQuickView();
                }}
                className="w-10 h-10 rounded-full bg-white text-charcoal flex items-center justify-center shadow-md hover:bg-champagne hover:text-charcoal active:scale-90 transition-all duration-300"
                aria-label="Quick View"
                title="Quick View"
              >
                <Eye className="h-4.5 w-4.5" />
              </button>
              <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-charcoal text-ivory text-[9px] tracking-widest uppercase px-2.5 py-1.5 pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap border border-ivory/10 shadow-sm font-medium">
                Quick View
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Product Details (Below Image) */}
      <div className="mt-4 space-y-1">
        <h3 className="font-bold text-sm tracking-widest uppercase text-charcoal group-hover:text-charcoal/80 transition-colors">
          {product.title}
        </h3>
        <p className="text-sm font-medium text-champagne">
          {product.sizes && product.sizes.length > 1 ? "From " : ""}{formatPrice(product.priceNaira)}
        </p>
      </div>
    </Link>
  );
}
