"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCart } from "@/components/cart-context";

export type Product = {
  id: string;
  title: string;
  description: string;
  priceNaira: number;
  sizes: string[];
  image: string;
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
  const { addItem } = useCart();

  const handleAddToCart = (): void => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }

    addItem({
      id: product.id,
      title: product.title,
      description: product.description,
      priceNaira: product.priceNaira,
      size: selectedSize,
      image: product.image,
    });

    // Reset size selection after adding
    setSelectedSize("");
  };

  return (
    <article className="flex flex-col overflow-hidden border border-charcoal/10 bg-white/80">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 45vw, 100vw"
          unoptimized
          className="object-cover transition duration-700 hover:scale-105 rounded-none"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-display text-2xl text-charcoal">{product.title}</h3>
          <p className="mt-2 text-sm text-charcoal/60">{product.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between text-sm text-charcoal/80">
          <span>{formatter.format(product.priceNaira)}</span>
          <span>Sizes {product.sizes.join(" – ")}</span>
        </div>

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