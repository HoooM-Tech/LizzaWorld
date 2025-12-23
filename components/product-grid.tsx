import { ProductCard } from "@/components/product-card";


type Product = {
  id: string;
  title: string;
  description: string;
  priceNaira: number;
  sizes: string[];
  colors?: string[];
  images: string[];
  orderLink?: string;
  isAvailable?: boolean;
};

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
