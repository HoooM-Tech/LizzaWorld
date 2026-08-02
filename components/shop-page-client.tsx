"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, ArrowUp, ChevronLeft, ChevronRight, SlidersHorizontal, X, Square, Grid2X2, Grid3X3, LayoutGrid } from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import { ProductCard } from "@/components/product-card";
import { Section } from "@/components/section";
import { SizeGuide } from "@/components/size-guide";
import { CtaBanner } from "@/components/cta-banner";
import { products as fallbackProducts } from "@/data/products";
import { QuickViewModal } from "@/components/quick-view-modal";

type Product = {
  id: string;
  title: string;
  description: string;
  priceNaira: number;
  sizes: string[];
  colors?: string[];
  tags?: string[];
  createdAt?: string;
  _createdAt?: string;
  images: string[];
  orderLink?: string;
  isAvailable?: boolean;
  apparelTypes?: string[];
};

type Collection = {
  id: string;
  title: string;
  products: Product[];
};

type ShopPageClientProps = {
  products: Product[];
  editorialImages: string[];
  collectionTitle: string;
  introCopy: string;
  similarProducts: Product[];
  collections: any[];
};

const COLOR_MAP: Record<string, string> = {
  black: "#3A2418", // Deep Espresso
  white: "#F5F0E8", // Warm Ivory
  burgundy: "#800020",
  navy: "#1D2A44",
  champagne: "#B88A44", // Burnished Gold
  gold: "#B88A44",
  red: "#DC2626",
  blue: "#2563EB",
  green: "#16A34A",
};

const STYLE_CATEGORIES = [
  "Suit",
  "Jacket",
  "Pant",
  "Short",
  "Skirt",
  "Coat",
  "Hat",
  "Bridal Dress"
];

export default function ShopPageClient({
  products,
  editorialImages,
  collectionTitle,
  introCopy,
  similarProducts,
  collections
}: ShopPageClientProps) {
  const baseProducts = products && products.length > 0 ? products : fallbackProducts;

  // Build Collections List for the header dropdown
  const collectionsList = [
    { id: "all", title: "All Products", products: baseProducts },
    ...(collections || []).map((c: any) => ({
      id: c._id,
      title: c.title,
      products: c.products || []
    })),
    { 
      id: "new-arrivals", 
      title: "New Arrivals", 
      products: baseProducts.filter(p => p.tags?.some(t => t.toUpperCase() === "NEW")) 
    }
  ];

  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("all");
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);

  const activeCollection = collectionsList.find(c => c.id === selectedCollectionId) || collectionsList[0];

  // 1. Filter States
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedApparelTypes, setSelectedApparelTypes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  // 2. Section Collapse States
  const [isColorOpen, setIsColorOpen] = useState(true);
  const [isApparelOpen, setIsApparelOpen] = useState(true);
  const [isStyleOpen, setIsStyleOpen] = useState(true);

  // 3. Grid View Toggle & Sorting
  const [columns, setColumns] = useState<number>(3);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);

  // 4. Mobile Drawer Open
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Quick View & Scroll states
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const recentScrollRef = useRef<HTMLDivElement>(null);

  // Helpers for extracting counts & fields
  const getApparelType = (p: Product): string => {
    if (p.apparelTypes && p.apparelTypes.length > 0) {
      return p.apparelTypes[0];
    }
    const title = p.title.toLowerCase();
    if (title.includes("suit")) return "Suits";
    if (title.includes("blazer") || title.includes("jacket")) return "Jackets";
    if (title.includes("pant") || title.includes("trouser")) return "Pants";
    if (title.includes("short")) return "Shorts";
    if (title.includes("skirt")) return "Skirts";
    if (title.includes("coat")) return "Coats";
    if (title.includes("hat")) return "Hats";
    if (title.includes("dress")) return "Dresses";
    if (title.includes("set")) return "Sets";
    return "Other";
  };

  const matchesStyle = (p: Product, style: string): boolean => {
    const title = p.title.toLowerCase();
    const description = p.description.toLowerCase();
    const tags = (p.tags || []).map(t => t.toLowerCase());
    const apparelTypes = ((p as any).apparelTypes || []).map((t: string) => t.toLowerCase());
    const styleLower = style.toLowerCase();

    if (styleLower === "bridal dress") {
      const bridRe = /\bbridal\b|\bwedding\b/;
      return bridRe.test(title) || bridRe.test(description) || tags.some(t => t === "bridal" || t === "wedding");
    }

    const singular = styleLower;
    const plural = styleLower + "s";

    // Use word-boundary regex to avoid partial matches (e.g. "hat" matching "that", "what")
    const singularRe = new RegExp(`\\b${singular}\\b`);
    const pluralRe = new RegExp(`\\b${plural}\\b`);

    return (
      singularRe.test(title) || pluralRe.test(title) ||
      singularRe.test(description) || pluralRe.test(description) ||
      tags.some(t => t === singular || t === plural) ||
      apparelTypes.some((t: string) => t === singular || t === plural)
    );
  };

  // Get list of colors and apparel types with counts (based on active collection products)
  const availableColors = Array.from(
    new Set(activeCollection.products.flatMap((p: Product) => p.colors || []).map((c: string) => c.trim()).filter(Boolean))
  ) as string[];

  const availableApparelTypes = Array.from(
    new Set(activeCollection.products.map((p: Product) => getApparelType(p)))
  ) as string[];

  // Clear filters
  const handleClearAll = () => {
    setSelectedColors([]);
    setSelectedApparelTypes([]);
    setSelectedStyles([]);
  };

  const isAnyFilterActive = selectedColors.length > 0 || selectedApparelTypes.length > 0 || selectedStyles.length > 0;

  // Filter Handler
  const filteredProducts = activeCollection.products.filter((product: Product) => {
    // 1. Color filter (OR within category)
    if (selectedColors.length > 0) {
      const pColors = (product.colors || []).map((c: string) => c.trim().toLowerCase());
      const hasMatch = selectedColors.some((c: string) => pColors.includes(c.toLowerCase()));
      if (!hasMatch) return false;
    }

    // 2. Apparel filter (OR within category)
    if (selectedApparelTypes.length > 0) {
      const pApparel = getApparelType(product);
      if (!selectedApparelTypes.includes(pApparel)) return false;
    }

    // 3. Style filter (OR within category)
    if (selectedStyles.length > 0) {
      const hasMatch = selectedStyles.some((style) => matchesStyle(product, style));
      if (!hasMatch) return false;
    }

    return true;
  });

  // Sorting Handler: Apply selected sorting, then partition so New Arrivals are always first
  const sortedProducts = (() => {
    const getTimestamp = (p: Product): number => {
      if (p._createdAt) return new Date(p._createdAt).getTime();
      if (p.createdAt) return new Date(p.createdAt).getTime();
      return 0;
    };

    const isNew = (p: Product): boolean => {
      return p.tags?.some(tag => tag.toUpperCase() === "NEW") || false;
    };

    let list = [...filteredProducts];

    // Core sort criteria
    switch (sortBy) {
      case "price-low-to-high":
        list.sort((a, b) => a.priceNaira - b.priceNaira);
        break;
      case "price-high-to-low":
        list.sort((a, b) => b.priceNaira - a.priceNaira);
        break;
      case "alphabetical-a-z":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "alphabetical-z-a":
        list.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "date-old-to-new":
        list.sort((a, b) => getTimestamp(a) - getTimestamp(b));
        break;
      case "date-new-to-old":
      case "featured":
      default:
        list.sort((a, b) => getTimestamp(b) - getTimestamp(a));
        break;
    }

    // Always keep New Arrivals first
    const newArrivals = list.filter(isNew);
    const remaining = list.filter((p) => !isNew(p));
    return [...newArrivals, ...remaining];
  })();

  // Scrolling & Viewed logic
  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>, direction: "left" | "right") => {
    if (ref.current) {
      const scrollAmount = 320;
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("recentlyViewed");
    if (stored) {
      setRecentlyViewed(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const handleScrollTopVisible = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScrollTopVisible);
    return () => window.removeEventListener("scroll", handleScrollTopVisible);
  }, []);

  const toggleFilter = (item: string, list: string[], setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter((x) => x !== item));
    } else {
      setter([...list, item]);
    }
  };

  // Rendering Sidebar content
  const renderSidebarContent = () => (
    <div className="space-y-8 pr-4 text-charcoal">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-charcoal/10 pb-4">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wider">Filters</h2>
        {isAnyFilterActive && (
          <button
            onClick={handleClearAll}
            className="text-xs font-semibold text-champagne hover:underline uppercase tracking-wider"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Colors section */}
      <div className="border-b border-charcoal/10 pb-6">
        <button
          onClick={() => setIsColorOpen(!isColorOpen)}
          className="flex w-full items-center justify-between py-2 font-display text-base font-semibold uppercase tracking-wider"
        >
          Color
          {isColorOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {isColorOpen && (
          <div className="mt-4 flex flex-wrap gap-3.5">
            {availableColors.map((color) => {
              const hex = COLOR_MAP[color.toLowerCase()] || "#cccccc";
              const isSelected = selectedColors.includes(color);
              return (
                <button
                  key={color}
                  onClick={() => toggleFilter(color, selectedColors, setSelectedColors)}
                  className={`w-9 h-9 rounded-full border border-charcoal/20 transition-all ${
                    isSelected ? "ring-2 ring-champagne ring-offset-2 scale-110" : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: hex }}
                  title={color}
                  aria-label={`Filter by ${color}`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Apparel section */}
      <div className="border-b border-charcoal/10 pb-6">
        <button
          onClick={() => setIsApparelOpen(!isApparelOpen)}
          className="flex w-full items-center justify-between py-2 font-display text-base font-semibold uppercase tracking-wider"
        >
          Apparel
          {isApparelOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {isApparelOpen && (
          <div className="mt-4 space-y-3">
            {availableApparelTypes.map((apparel) => {
              const count = baseProducts.filter((p) => getApparelType(p) === apparel).length;
              const isChecked = selectedApparelTypes.includes(apparel);
              return (
                <label key={apparel} className="flex items-center gap-4 cursor-pointer text-sm font-medium uppercase tracking-wider hover:text-champagne transition-colors py-1">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleFilter(apparel, selectedApparelTypes, setSelectedApparelTypes)}
                    className="h-5 w-5 accent-champagne border-charcoal/30 text-champagne bg-ivory rounded-none"
                  />
                  <span>
                    {apparel} <span className="opacity-50 font-normal">({count})</span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Style section */}
      <div className="pb-6">
        <button
          onClick={() => setIsStyleOpen(!isStyleOpen)}
          className="flex w-full items-center justify-between py-2 font-display text-base font-semibold uppercase tracking-wider"
        >
          Style
          {isStyleOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
        {isStyleOpen && (
          <div className="mt-4 space-y-3">
            {STYLE_CATEGORIES.map((style) => {
              const count = baseProducts.filter((p) => matchesStyle(p, style)).length;
              const isChecked = selectedStyles.includes(style);
              return (
                <label key={style} className="flex items-center gap-4 cursor-pointer text-sm font-medium uppercase tracking-wider hover:text-champagne transition-colors py-1">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleFilter(style, selectedStyles, setSelectedStyles)}
                    className="h-5 w-5 accent-champagne border-charcoal/30 text-champagne bg-ivory rounded-none"
                  />
                  <span>
                    {style} <span className="opacity-50 font-normal">({count})</span>
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-12 relative text-charcoal">
      {/* Page Header */}
      <header className="space-y-4">
        <div className="relative inline-block text-left">
          <button
            onClick={() => setIsHeaderDropdownOpen(!isHeaderDropdownOpen)}
            className="font-display text-4xl sm:text-5xl text-charcoal border-b-2 border-charcoal/80 flex items-center gap-3 py-1 outline-none transition hover:border-charcoal/40 uppercase tracking-wide"
            aria-haspopup="true"
            aria-expanded={isHeaderDropdownOpen}
          >
            Shop {activeCollection.title}
            <ChevronDown className="h-7 w-7 text-charcoal/60 mt-1 select-none" />
          </button>

          {/* Dropdown Backdrop overlay */}
          {isHeaderDropdownOpen && (
            <div 
              className="fixed inset-0 z-45 bg-transparent" 
              onClick={() => setIsHeaderDropdownOpen(false)} 
            />
          )}

          {/* Dropdown Menu Box */}
          {isHeaderDropdownOpen && (
            <div className="absolute left-0 mt-3 w-80 bg-ivory border border-charcoal/10 shadow-soft z-50 rounded-none focus:outline-none transform origin-top-left transition-all duration-300">
              <div className="py-2">
                {collectionsList.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => {
                      setSelectedCollectionId(col.id);
                      setIsHeaderDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-6 py-4 text-xs tracking-[0.15em] uppercase transition-colors ${
                      selectedCollectionId === col.id
                        ? "bg-champagne text-charcoal font-semibold"
                        : "text-charcoal/80 hover:bg-charcoal/5 hover:text-charcoal"
                    }`}
                  >
                    {col.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="max-w-4xl text-sm sm:text-base leading-relaxed text-charcoal/70">
          {selectedCollectionId === "all" ? introCopy : (activeCollection.products[0]?.description || introCopy)}
        </p>
      </header>

      {/* Mobile filter toggle and layout actions */}
      <div className="flex lg:hidden items-center justify-between border-b border-charcoal/10 pb-4">
        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex items-center gap-2 border border-charcoal/20 px-4 py-2 text-xs uppercase tracking-widest bg-white/50"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters {isAnyFilterActive && `(${selectedColors.length + selectedApparelTypes.length + selectedStyles.length})`}
        </button>

        {/* Small screen sorting dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="flex items-center gap-1.5 text-xs uppercase tracking-widest py-2 border-b border-charcoal/30"
          >
            Sort ▾
          </button>
          {isSortDropdownOpen && (
            <>
              <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsSortDropdownOpen(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-ivory border border-charcoal/10 shadow-soft z-50 py-1">
                {[
                  { value: "featured", label: "Best Selling" },
                  { value: "price-low-to-high", label: "Price, low to high" },
                  { value: "price-high-to-low", label: "Price, high to low" },
                  { value: "alphabetical-a-z", label: "Alphabetically, A-Z" },
                  { value: "alphabetical-z-a", label: "Alphabetically, Z-A" },
                  { value: "date-new-to-old", label: "Date, new to old" },
                  { value: "date-old-to-new", label: "Date, old to new" }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSortBy(opt.value);
                      setIsSortDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-xs tracking-wider uppercase ${
                      sortBy === opt.value ? "bg-champagne text-charcoal font-semibold" : "text-charcoal/80"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="lg:grid lg:grid-cols-[260px_1fr] gap-10 items-start">
        
        {/* Left Filter Sidebar (Desktop only) */}
        <aside className="hidden lg:block sticky top-24 self-start max-h-[80vh] overflow-y-auto scrollbar-hide pr-2">
          {renderSidebarContent()}
        </aside>

        {/* Right Content Area */}
        <div className="space-y-8">
          
          {/* Top Control Bar (Desktop only) */}
          <div className="hidden lg:flex items-center justify-between border-b border-charcoal/10 pb-4">
            
            {/* Sort Selector */}
            <div className="relative">
              <button
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                className="text-xs uppercase tracking-widest text-charcoal flex items-center gap-1.5 hover:text-champagne transition-colors outline-none font-semibold"
              >
                Sort: {
                  sortBy === "featured" ? "Best Selling" :
                  sortBy === "price-low-to-high" ? "Price, low to high" :
                  sortBy === "price-high-to-low" ? "Price, high to low" :
                  sortBy === "alphabetical-a-z" ? "Alphabetically, A-Z" :
                  sortBy === "alphabetical-z-a" ? "Alphabetically, Z-A" :
                  sortBy === "date-new-to-old" ? "Date, new to old" : "Date, old to new"
                } ▾
              </button>
              
              {isSortDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsSortDropdownOpen(false)} />
                  <div className="absolute left-0 mt-2 w-56 bg-ivory border border-charcoal/10 shadow-soft z-50 rounded-none focus:outline-none py-1">
                    {[
                      { value: "featured", label: "Best Selling" },
                      { value: "price-low-to-high", label: "Price, low to high" },
                      { value: "price-high-to-low", label: "Price, high to low" },
                      { value: "alphabetical-a-z", label: "Alphabetically, A-Z" },
                      { value: "alphabetical-z-a", label: "Alphabetically, Z-A" },
                      { value: "date-new-to-old", label: "Date, new to old" },
                      { value: "date-old-to-new", label: "Date, old to new" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setSortBy(opt.value);
                          setIsSortDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-5 py-2.5 text-xs tracking-wider uppercase transition-colors ${
                          sortBy === opt.value
                            ? "bg-champagne text-charcoal font-semibold"
                            : "text-charcoal/80 hover:bg-charcoal/5 hover:text-charcoal"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Grid Density Controls */}
            <div className="flex items-center gap-1 bg-white/40 border border-charcoal/10 p-0.5">
              {[1, 2, 3, 4, 5].map((num) => {
                const isSelected = columns === num;
                return (
                  <button
                    key={num}
                    onClick={() => setColumns(num)}
                    className={`w-8 h-8 flex items-center justify-center transition-all ${
                      isSelected ? "bg-champagne text-charcoal font-bold" : "text-charcoal/60 hover:text-charcoal"
                    }`}
                    title={`${num} Columns`}
                  >
                    {num === 1 && <Square className="w-4 h-4" />}
                    {num === 2 && <Grid2X2 className="w-4 h-4" />}
                    {num === 3 && <Grid3X3 className="w-4 h-4" />}
                    {num === 4 && <LayoutGrid className="w-4 h-4" />}
                    {num === 5 && (
                      <span className="text-[10px] font-bold tracking-tighter">5X</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product Grid display */}
          {sortedProducts.length === 0 ? (
            <div className="text-center py-24 text-charcoal/60 border border-dashed border-charcoal/20">
              No pieces match the selected filter criteria.
            </div>
          ) : (
            <ProductGrid 
              products={sortedProducts} 
              onQuickView={(p) => setQuickViewProduct(p)} 
              columns={columns}
            />
          )}
        </div>
      </div>

      {/* Slide-in Mobile Drawer Filter */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />
          {/* Drawer body */}
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-ivory shadow-xl py-6 px-6 overflow-y-auto scrollbar-hide">
            <div className="flex items-center justify-between border-b border-charcoal/10 pb-4 mb-4">
              <h2 className="font-display text-xl uppercase tracking-wider">Filters</h2>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-charcoal/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <Section title="Recently Viewed">
          <div className="relative">
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
        </Section>
      )}
      
      <SizeGuide />

      <CtaBanner 
        title="Begin Your Journey" 
        ctaLabel="Book a Consultation" 
        href="/consultation" 
      />

      {/* Sticky Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-8 right-8 z-45 bg-charcoal text-ivory border border-ivory/10 hover:bg-charcoal/90 active:scale-95 shadow-soft h-12 w-12 rounded-full flex items-center justify-center transition-all duration-300"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}

      {/* Quick View Modal Overlay */}
      <QuickViewModal 
        product={quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
    </div>
  );
}