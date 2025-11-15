import Image from "next/image";
import Link from "next/link";
import { Product } from "@/data/products";
import { Button } from "@/components/ui/button";

const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0
});

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white/80 shadow-soft">
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition duration-700 hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="font-display text-2xl text-charcoal">{product.name}</h3>
          <p className="mt-2 text-sm text-charcoal/60">{product.description}</p>
        </div>
        <div className="mt-auto flex items-center justify-between text-sm text-charcoal/80">
          <span>{formatter.format(product.priceNaira)}</span>
          <span>Sizes {product.sizes.join(" – ")}</span>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" disabled>
            Add to Cart
          </Button>
          {product.instagramUrl && (
            <Button variant="outline" asChild>
              <Link href={product.instagramUrl} target="_blank" rel="noreferrer">
                View Look
              </Link>
            </Button>
          )}
        </div>
      </div>
    </article>
  );
}
