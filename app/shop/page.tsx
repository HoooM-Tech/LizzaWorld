import Image from "next/image";
import { ProductGrid } from "@/components/product-grid";
import { Section } from "@/components/section";
import { SizeGuide } from "@/components/size-guide";
import { CtaBanner } from "@/components/cta-banner";

const editorialImages = [
  "/images/gallery/img-7.jpg",
  "/images/gallery/img-8.jpg",
  "/images/gallery/img-9.jpg"
];

export default function ShopPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-6">
        <h1 className="font-display text-4xl sm:text-5xl">Eminence Collection</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-charcoal/70">
          The Eminence Collection celebrates the elegance of power and purpose. Designed for women who lead with confidence and grace, each piece reflects refined craftsmanship, modern femininity, and timeless allure.
        </p>
      </header>
      <Section>
        <ProductGrid />
      </Section>
      <SizeGuide />
      <div className="grid gap-6">
        {editorialImages.map((image, index) => (
          <div key={image} className="relative h-[360px] overflow-hidden rounded-2xl">
            <Image src={image} alt={`Eminence editorial ${index + 1}`} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
          </div>
        ))}
      </div>
      <CtaBanner title="Shop the Collection" ctaLabel="View the Lookbook" href="/shop" />
    </div>
  );
}
