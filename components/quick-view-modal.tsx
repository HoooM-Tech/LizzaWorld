"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-context";
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

type QuickViewModalProps = {
  product: Product | null;
  onClose: () => void;
};

export function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  
  const sizeOptions = product?.sizes && product.sizes.length > 0
    ? product.sizes
    : ["6", "8", "10", "12", "14", "16", "18", "20"];

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedHeight, setSelectedHeight] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const heightOptions = product?.heights && product.heights.length > 0
    ? product.heights
    : [
        "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", 
        "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\""
      ];


  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(sizeOptions[0] || "");
      setSelectedColor(product.colors?.[0] || "Default");
      setSelectedHeight("");
      setQuantity(1);
      setCurrentImageIndex(0);

      // Track recently viewed product in localStorage
      try {
        const recentlyViewedStr = localStorage.getItem("recentlyViewed");
        let list: any[] = recentlyViewedStr ? JSON.parse(recentlyViewedStr) : [];
        
        // Remove existing if it's already in the list
        list = list.filter((item: any) => item.id !== product.id);
        
        // Construct the item to store
        const newItem = {
          id: product.id,
          title: product.title,
          priceNaira: product.priceNaira,
          images: product.images,
          description: product.description,
          sizes: product.sizes || [],
          colors: product.colors || [],
          tags: product.tags || [],
          createdAt: product.createdAt || "",
          slug: product.slug || product.id, // Use slug if available
          url: `/shop/${product.slug || product.id}`,
          isAvailable: product.isAvailable
        };

        // Prepend and limit to 8
        list.unshift(newItem);
        if (list.length > 8) {
          list = list.slice(0, 8);
        }
        localStorage.setItem("recentlyViewed", JSON.stringify(list));
        
        // Dispatch custom event to notify Shop page to refresh recently viewed
        window.dispatchEvent(new Event("recentlyViewedChanged"));
      } catch (error) {
        console.error("Error updating recently viewed:", error);
      }
    }
  }, [product]);

  // Handle escape key
  useEffect(() => {
    if (!product) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (!product.isAvailable) return;
    
    addItem({
      id: product.id,
      title: product.title,
      description: product.description,
      priceNaira: product.priceNaira,
      size: selectedSize,
      color: selectedColor || "Default",
      height: selectedHeight || undefined,
      image: product.images[currentImageIndex] || product.images[0]
    }, quantity);

    // Dispatch event to open Cart Drawer
    window.dispatchEvent(new Event("openCartDrawer"));

    onClose();
  };

  const handleQuantityChange = (val: number) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handlePrevImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product) return;
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div 
        className="relative w-full max-w-4xl bg-charcoal text-ivory border border-champagne/10 shadow-soft overflow-hidden flex flex-col md:flex-row my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/80 text-ivory border border-ivory/10 hover:bg-ivory hover:text-charcoal transition-all duration-300"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Panel - Image */}
        <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-square relative bg-charcoal-light flex-shrink-0 group/img">
          <Image
            src={product.images[currentImageIndex] || "/placeholder.jpg"}
            alt={`${product.title} - Image ${currentImageIndex + 1}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover rounded-none"
          />

          {/* Hover Arrow Navigation */}
          {product.images && product.images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-charcoal/70 hover:bg-champagne hover:text-charcoal text-ivory flex items-center justify-center border border-ivory/10 shadow-md transition-all duration-300 opacity-0 group-hover/img:opacity-100 scale-90 group-hover/img:scale-100"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-charcoal/70 hover:bg-champagne hover:text-charcoal text-ivory flex items-center justify-center border border-ivory/10 shadow-md transition-all duration-300 opacity-0 group-hover/img:opacity-100 scale-90 group-hover/img:scale-100"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              
              {/* Image Indicators Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5 bg-charcoal/40 backdrop-blur-xs px-2.5 py-1.5 rounded-full">
                {product.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      currentImageIndex === idx ? "bg-champagne scale-125" : "bg-ivory/40 hover:bg-ivory/70"
                    }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right Panel - Product Details */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Title */}
            <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide leading-tight mt-4 md:mt-0">
              {product.title}
            </h2>

            {/* Price */}
            <div className="text-xl font-light text-champagne">
              {formatPrice(product.priceNaira)}
            </div>

            {/* Description */}
            <p className="text-sm text-ivory/70 leading-relaxed line-clamp-3">
              {product.description}
            </p>
            
            {/* View Details Link */}
            <div className="pt-1">
              <Link 
                href={`/shop/${product.slug || product.id}`} 
                onClick={onClose}
                className="text-xs uppercase tracking-widest text-champagne hover:text-white transition-colors underline font-medium"
              >
                View details
              </Link>
            </div>
          </div>

          <div className="space-y-5">
            {/* Size Selector */}
            {sizeOptions.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-ivory/60 block">
                  Select a Size: <strong className="text-white ml-1 font-medium">{selectedSize}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-xs tracking-wider uppercase border transition-all duration-300 rounded-full min-w-[44px] text-center ${
                        selectedSize === size
                          ? "bg-champagne border-champagne text-charcoal font-semibold"
                          : "border-ivory/20 text-ivory/80 hover:border-ivory/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Height Selector */}
            <div className="space-y-2 pt-2 border-t border-ivory/10">
              <span className="text-xs uppercase tracking-wider text-ivory/60 block">
                Select Your Height: <strong className="text-white ml-1 font-medium">{selectedHeight || "Not selected"}</strong>
              </span>
              <div className="flex flex-wrap gap-2">
                {heightOptions.map((height) => (
                  <button
                    key={height}
                    onClick={() => setSelectedHeight(height)}
                    className={`px-3 py-1.5 text-xs tracking-wider uppercase border transition-all duration-300 rounded-full min-w-[40px] text-center ${
                      selectedHeight === height
                        ? "bg-champagne border-champagne text-charcoal font-semibold"
                        : "border-ivory/20 text-ivory/80 hover:border-ivory/50"
                    }`}
                  >
                    {height}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-ivory/60 block">
                  Select a Color: <strong className="text-white ml-1 font-medium">{selectedColor}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-xs tracking-wider uppercase border transition-all duration-300 rounded-full min-w-[44px] text-center ${
                        selectedColor === color
                          ? "bg-champagne border-champagne text-charcoal font-semibold"
                          : "border-ivory/20 text-ivory/80 hover:border-ivory/50"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-ivory/60">Quantity</span>
              <div className="flex items-center border border-ivory/25 h-10">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="px-3 h-full flex items-center justify-center text-ivory/70 hover:text-white transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="px-3 h-full flex items-center justify-center text-ivory/70 hover:text-white transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="pt-2">
            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className={`w-full py-4 text-xs tracking-[0.2em] font-semibold uppercase transition-all duration-300 ${
                product.isAvailable
                  ? "bg-champagne text-charcoal hover:bg-champagne/90 active:scale-[0.98]"
                  : "bg-ivory/10 text-ivory/40 cursor-not-allowed border border-ivory/15"
              }`}
            >
              {product.isAvailable ? "Add to cart" : "Sold Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
