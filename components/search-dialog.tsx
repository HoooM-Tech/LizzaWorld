"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Search, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
};

type SearchResult = {
  id: string;
  title: string;
  type: "product" | "collection" | "page";
  url: string;
  image?: string;
  price?: number;
  description?: string;
};

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Debounce search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        // Replace this with your actual API endpoint
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        
        if (response.ok) {
          const data = await response.json();
          setResults(data.results || []);
          setShowResults(true);
        } else {
          // Fallback: Mock search results for demo
          const mockResults = getMockResults(query);
          setResults(mockResults);
          setShowResults(true);
        }
      } catch (error) {
        console.error("Search error:", error);
        // Fallback to mock results
        const mockResults = getMockResults(query);
        setResults(mockResults);
        setShowResults(true);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [query]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        setQuery("");
        setResults([]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Reset when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      setShowResults(false);
    }
  }, [open]);

  const handleResultClick = () => {
    onClose();
    setQuery("");
    setResults([]);
  };

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-start justify-center bg-charcoal/40 backdrop-blur-sm p-6",
        "animate-in fade-in duration-200"
      )}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={cn(
          "mt-24 w-full max-w-2xl rounded-2xl border border-charcoal/10 bg-ivory shadow-2xl",
          "animate-in zoom-in-95 slide-in-from-top-2 duration-200"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-charcoal/10 p-6">
          <p className="font-display text-xl">Search the Atelier</p>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close search"
            onClick={onClose}
            className="hover:bg-charcoal/5"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Search Input */}
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-charcoal/40" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Explore collections, silhouettes, or muses..."
              autoFocus
              className="pl-10 pr-10"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-charcoal/40" />
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {showResults && results.length > 0 && (
            <div className="border-t border-charcoal/10 p-4">
              <p className="mb-3 px-2 text-xs uppercase tracking-wider text-charcoal/60">
                {results.length} {results.length === 1 ? "Result" : "Results"}
              </p>
              <div className="space-y-1">
                {results.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    onClick={handleResultClick}
                    className="flex items-center gap-4 rounded-lg p-3 transition hover:bg-charcoal/5"
                  >
                    {result.image && (
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-charcoal/5">
                        <Image
                          src={result.image}
                          alt={result.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-charcoal truncate">{result.title}</p>
                      {result.description && (
                        <p className="text-sm text-charcoal/60 truncate">{result.description}</p>
                      )}
                      <p className="mt-1 text-xs text-charcoal/40 uppercase tracking-wider">
                        {result.type}
                      </p>
                    </div>
                    {result.price && (
                      <div className="flex-shrink-0 text-right">
                        <p className="font-medium text-charcoal">
                          ${result.price.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {showResults && results.length === 0 && !isLoading && (
            <div className="border-t border-charcoal/10 p-12 text-center">
              <p className="text-charcoal/60">No results found for "{query}"</p>
              <p className="mt-2 text-sm text-charcoal/40">
                Try adjusting your search or explore our collections
              </p>
            </div>
          )}

          {!showResults && !isLoading && (
            <div className="border-t border-charcoal/10 p-12 text-center">
              <p className="text-sm text-charcoal/60">
                Begin typing to discover pieces crafted with intention.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Mock search function - replace with your actual search logic
function getMockResults(query: string): SearchResult[] {
  const allItems: SearchResult[] = [
    {
      id: "1",
      title: "Silk Evening Gown",
      type: "product",
      url: "/shop/silk-evening-gown",
      image: "/products/gown-1.jpg",
      price: 2500,
      description: "Elegant floor-length silk gown with delicate draping"
    },
    {
      id: "2",
      title: "Tailored Blazer",
      type: "product",
      url: "/shop/tailored-blazer",
      image: "/products/blazer-1.jpg",
      price: 890,
      description: "Structured blazer in premium wool"
    },
    {
      id: "3",
      title: "Bespoke Collection",
      type: "collection",
      url: "/bespoke",
      description: "Custom-crafted pieces designed exclusively for you"
    },
    {
      id: "4",
      title: "Bridal Couture",
      type: "collection",
      url: "/bespoke#bridal",
      description: "Timeless wedding gowns and bridal pieces"
    },
    {
      id: "5",
      title: "Consultation",
      type: "page",
      url: "/consultation",
      description: "Book a personal styling session"
    }
  ];

  const searchTerm = query.toLowerCase();
  return allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm) ||
      item.description?.toLowerCase().includes(searchTerm) ||
      item.type.toLowerCase().includes(searchTerm)
  );
}