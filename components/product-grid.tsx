import { ProductCard } from "@/components/product-card";

type Product = {
  id: string;
  title: string;
  description: string;
  priceNaira: number;
  sizes: string[];
  colors?: string[];
  heights?: string[];
  tags?: string[];
  createdAt?: string;
  images: string[];
  orderLink?: string;
  isAvailable?: boolean;
};

type ProductGridProps = {
  products: Product[];
  onQuickView: (product: Product) => void;
  columns?: number;
};

export function ProductGrid({ products, onQuickView, columns = 4 }: ProductGridProps) {
  // Map columns count to responsive grid-cols classes
  const gridColsClass = 
    columns === 1 ? "grid-cols-1" :
    columns === 2 ? "grid-cols-2" :
    columns === 3 ? "grid-cols-2 md:grid-cols-3" :
    columns === 4 ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" :
    "grid-cols-2 md:grid-cols-3 lg:grid-cols-5";

  return (
    <div className={`grid gap-x-6 gap-y-10 ${gridColsClass}`}>
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onQuickView={() => onQuickView(product)} 
          isRowLayout={columns === 1}
        />
      ))}
    </div>
  );
}
