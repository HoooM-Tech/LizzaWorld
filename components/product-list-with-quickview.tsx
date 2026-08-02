"use client";

import { useState } from "react";
import { ProductGrid } from "@/components/product-grid";
import { QuickViewModal } from "@/components/quick-view-modal";

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

type ProductListWithQuickViewProps = {
  products: Product[];
  columns?: number;
};

export function ProductListWithQuickView({ products, columns = 4 }: ProductListWithQuickViewProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  return (
    <>
      <ProductGrid 
        products={products} 
        onQuickView={(p) => setQuickViewProduct(p)} 
        columns={columns}
      />

      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}
