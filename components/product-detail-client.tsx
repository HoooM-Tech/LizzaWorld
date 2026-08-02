"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { QuickViewModal } from "@/components/quick-view-modal";
import { useCart } from "@/components/cart-context";
import { Container } from "@/components/container";
import { useCurrency } from "@/components/currency-context";
import { SizeGuideFlow } from "@/components/size-guide-flow";


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
  _createdAt?: string;
  images: string[];
  orderLink?: string;
  isAvailable?: boolean;
};

type ProductDetailPageClientProps = {
  product: Product;
  allProducts: Product[];
};

export default function ProductDetailPageClient({
  product,
  allProducts
}: ProductDetailPageClientProps) {
  const { addItem } = useCart();
  const { formatPrice } = useCurrency();
  
  // 1. Image gallery selection state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // 2. Options selection state
  const sizeOptions = product.sizes && product.sizes.length > 0 
    ? product.sizes 
    : ["6", "8", "10", "12", "14", "16", "18", "20"];

  const [selectedSize, setSelectedSize] = useState(sizeOptions[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "Default");
  const [selectedHeight, setSelectedHeight] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [shopMode, setShopMode] = useState<"standard" | "personalized">("standard");

  const heightOptions = product.heights && product.heights.length > 0
    ? product.heights
    : [
        "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", 
        "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\""
      ];


  // Sync selection states when product changes
  useEffect(() => {
    setSelectedSize(sizeOptions[0] || "");
    setSelectedColor(product.colors?.[0] || "Default");
    setSelectedHeight("");
    setQuantity(1);
    setShopMode("standard");
  }, [product, sizeOptions]);

  // 3. Carousel lists
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const recommendScrollRef = useRef<HTMLDivElement>(null);
  const recentScrollRef = useRef<HTMLDivElement>(null);

  // Log product to recentlyViewed on mount
  useEffect(() => {
    try {
      const recentlyViewedStr = localStorage.getItem("recentlyViewed");
      let list: any[] = recentlyViewedStr ? JSON.parse(recentlyViewedStr) : [];
      
      // Remove existing
      list = list.filter((item: any) => item.id !== product.id);
      
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
        slug: product.slug || product.id,
        url: `/shop/${product.slug || product.id}`,
        isAvailable: product.isAvailable
      };

      // Limit to 8
      list.unshift(newItem);
      if (list.length > 8) {
        list = list.slice(0, 8);
      }
      localStorage.setItem("recentlyViewed", JSON.stringify(list));
      
      // Dispatch change event
      window.dispatchEvent(new Event("recentlyViewedChanged"));
    } catch (e) {
      console.error("Error setting recently viewed:", e);
    }
  }, [product]);

  // Load recently viewed list (excluding current product)
  const loadRecentlyViewed = () => {
    try {
      const stored = localStorage.getItem("recentlyViewed");
      if (stored) {
        const parsed = JSON.parse(stored) as Product[];
        setRecentlyViewed(parsed.filter((item) => item.id !== product.id));
      }
    } catch (e) {
      console.error("Error loading recently viewed list:", e);
    }
  };

  useEffect(() => {
    loadRecentlyViewed();
    window.addEventListener("recentlyViewedChanged", loadRecentlyViewed);
    return () => window.removeEventListener("recentlyViewedChanged", loadRecentlyViewed);
  }, [product]);

  // Add to cart
  const handleAddToCart = () => {
    if (!product.isAvailable) return;
    
    let sizeValue = selectedSize;
    if (shopMode === "personalized") {
      try {
        const stored = localStorage.getItem("fitProfile");
        if (stored) {
          const profile = JSON.parse(stored);
          const m = profile.measurements || {};
          const shape = profile.bodyShape || "Balanced";
          const fmt = (key: string) => m[key] ? `${m[key]}"` : "—";
          sizeValue = `Custom Fit (Bust: ${fmt("bust")}, Under Bust: ${fmt("underBust")}, Waist: ${fmt("waist")}, Hip: ${fmt("hip")}, Shoulder: ${fmt("shoulder")}, Sleeve: ${fmt("sleeveLength")}, Height: ${fmt("height")}, Heels: ${fmt("preferredHeelHeight")}, Shape: ${shape})`;
        } else {
          sizeValue = "Custom Fit (No measurements saved)";
        }
      } catch (e) {
        sizeValue = "Custom Fit";
      }
    }
    
    addItem({
      id: product.id,
      title: product.title,
      description: product.description,
      priceNaira: product.priceNaira,
      size: sizeValue,
      color: selectedColor,
      height: selectedHeight && shopMode === "standard" ? selectedHeight : undefined,
      image: product.images[0]
    }, quantity);

    // Dispatch event to open Cart Drawer
    window.dispatchEvent(new Event("openCartDrawer"));
  };

  // Scroll carousels
  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Recommendation logic: products from the same collection, or general recommendations (excluding current product)
  const recommendations = allProducts
    .filter((p) => p.id !== product.id)
    .slice(0, 8);

  return (
    <Container className="py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* Left Side: Thumbnail Strip & Large Main Image */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Vertical Thumbnail Strip */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col flex-row gap-3 overflow-x-auto md:overflow-x-visible md:w-24 w-full flex-shrink-0 scrollbar-hide py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative aspect-[3/4] w-20 md:w-full border-2 transition-all duration-300 ${
                    selectedImageIndex === idx
                      ? "border-charcoal"
                      : "border-charcoal/10 hover:border-charcoal/40"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title} Thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-cover rounded-none"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Large Main Image */}
          <div className="w-full flex-1 relative aspect-square bg-charcoal/5 border border-charcoal/10 min-w-0">
            <Image
              src={product.images[selectedImageIndex] || "/placeholder.jpg"}
              alt={product.title}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover rounded-none"
            />
          </div>
        </div>

        {/* Right Side: Product Details */}
        <div className="lg:col-span-5 flex flex-col justify-start space-y-8">
          <div className="space-y-4">
            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl text-charcoal tracking-wide leading-tight uppercase">
              {product.title}
            </h1>
            
            {/* Price */}
            <p className="text-2xl font-light text-charcoal/80">
              {formatPrice(product.priceNaira)}
            </p>
            
            {/* Description */}
            <p className="text-base text-charcoal/70 leading-relaxed pt-2 border-t border-charcoal/10">
              {product.description}
            </p>
          </div>

          <div className="space-y-6">
            {/* Size Selector */}
            {sizeOptions.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-charcoal/60 block">
                  Select a Size: <strong className="text-charcoal ml-1 font-semibold">
                    {shopMode === "personalized" ? "Custom Fit Profile Active" : selectedSize}
                  </strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                         setSelectedSize(size);
                         setShopMode("standard");
                      }}
                      className={`px-5 py-2.5 text-xs tracking-widest uppercase border transition-all duration-300 rounded-none min-w-[50px] text-center ${
                        selectedSize === size && shopMode === "standard"
                          ? "bg-champagne border-charcoal text-charcoal font-semibold"
                          : "border-charcoal/20 text-charcoal/80 hover:border-charcoal/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <SizeGuideFlow shopMode={shopMode} setShopMode={setShopMode} />

            {/* Height Selector */}
            {shopMode === "standard" && (
              <div className="space-y-2 pt-2 border-t border-charcoal/10">
                <span className="text-xs uppercase tracking-wider text-charcoal/60 block">
                  Select Your Height: <strong className="text-charcoal ml-1 font-semibold">{selectedHeight || "Not selected"}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {heightOptions.map((height) => (
                    <button
                      key={height}
                      onClick={() => setSelectedHeight(height)}
                      className={`px-3 py-2 text-xs tracking-wider uppercase border transition-all duration-300 rounded-none min-w-[44px] text-center ${
                        selectedHeight === height
                          ? "bg-champagne border-charcoal text-charcoal font-semibold"
                          : "border-charcoal/20 text-charcoal/80 hover:border-charcoal/50"
                      }`}
                    >
                      {height}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs uppercase tracking-wider text-charcoal/60 block">
                  Select a Color: <strong className="text-charcoal ml-1 font-semibold">{selectedColor}</strong>
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-5 py-2.5 text-xs tracking-widest uppercase border transition-all duration-300 rounded-none min-w-[50px] text-center ${
                        selectedColor === color
                          ? "bg-champagne border-charcoal text-charcoal font-semibold"
                          : "border-charcoal/20 text-charcoal/80 hover:border-charcoal/50"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Stepper */}
            <div className="flex items-center gap-4">
              <span className="text-xs uppercase tracking-wider text-charcoal/60">Quantity</span>
              <div className="flex items-center border border-charcoal/25 h-11">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 h-full flex items-center justify-center text-charcoal/70 hover:text-charcoal transition-colors border-r border-charcoal/15"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold text-charcoal">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 h-full flex items-center justify-center text-charcoal/70 hover:text-charcoal transition-colors border-l border-charcoal/15"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Add to Cart Action */}
          <div className="space-y-4 pt-4 border-t border-charcoal/10">
            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className={`w-full py-4 text-xs tracking-[0.25em] font-bold uppercase transition-all duration-300 ${
                product.isAvailable
                  ? "bg-champagne text-charcoal hover:bg-champagne/90 active:scale-[0.99]"
                  : "bg-[#B88A44]/15 text-[#3A2418]/40 cursor-not-allowed border border-[#B88A44]/20"
              }`}
            >
              {product.isAvailable ? "Add to Cart" : "Sold Out"}
            </button>

            {/* Help / consultation text */}
            <p className="text-sm text-charcoal/60 leading-relaxed text-center">
              Not sure of your size?{" "}
              <Link 
                href="/consultation" 
                className="underline hover:text-charcoal font-medium transition-colors"
              >
                Chat with us for a free consultation.
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Recommendations Carousel: "You Might Also Like" */}
      {recommendations.length > 0 && (
        <section className="mt-24 pt-16 border-t border-charcoal/10">
          <div className="mb-8">
            <h2 className="font-display text-2xl sm:text-3xl text-charcoal">
              You Might Also Like
            </h2>
          </div>
          
          <div className="relative">
            {/* Left/Right overlay buttons */}
            <button
              onClick={() => handleScroll(recommendScrollRef, "left")}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-charcoal/10 bg-white text-charcoal flex items-center justify-center shadow-md hover:bg-charcoal hover:text-ivory hover:scale-105 active:scale-95 transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleScroll(recommendScrollRef, "right")}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-charcoal/10 bg-white text-charcoal flex items-center justify-center shadow-md hover:bg-charcoal hover:text-ivory hover:scale-105 active:scale-95 transition-all duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div 
              ref={recommendScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-1 -mx-1 snap-x snap-mandatory"
            >
              {recommendations.map((item) => (
                <div 
                  key={item.id} 
                  className="w-[280px] flex-shrink-0 snap-start bg-white/80 p-6 border border-charcoal/10"
                >
                  <ProductCard 
                    product={item} 
                    onQuickView={() => setQuickViewProduct(item)} 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* "Recently Viewed" Carousel */}
      {recentlyViewed.length > 0 && (
        <section className="mt-16 pt-16 border-t border-charcoal/10">
          <div className="mb-8">
            <h2 className="font-display text-2xl sm:text-3xl text-charcoal">
              Recently Viewed
            </h2>
          </div>
          
          <div className="relative">
            {/* Left/Right overlay buttons */}
            <button
              onClick={() => handleScroll(recentScrollRef, "left")}
              className="absolute -left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-charcoal/10 bg-white text-charcoal flex items-center justify-center shadow-md hover:bg-charcoal hover:text-ivory hover:scale-105 active:scale-95 transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleScroll(recentScrollRef, "right")}
              className="absolute -right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-charcoal/10 bg-white text-charcoal flex items-center justify-center shadow-md hover:bg-charcoal hover:text-ivory hover:scale-105 active:scale-95 transition-all duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div 
              ref={recentScrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide py-4 px-1 -mx-1 snap-x snap-mandatory"
            >
              {recentlyViewed.map((item) => (
                <div 
                  key={item.id} 
                  className="w-[280px] flex-shrink-0 snap-start bg-white/80 p-6 border border-charcoal/10"
                >
                  <ProductCard 
                    product={item} 
                    onQuickView={() => setQuickViewProduct(item)} 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick View Modal Overlay */}
      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
    </Container>
  );
}
