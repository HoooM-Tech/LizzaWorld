import Image from "next/image";
import { ProductGrid } from "@/components/product-grid";
import { Section } from "@/components/section";
import { SizeGuide } from "@/components/size-guide";
import { CtaBanner } from "@/components/cta-banner";
import { sanityClient } from "@/sanity/lib/client";
import { featuredCollectionQuery, productsByCollectionQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export default async function ShopPage() {
  const featuredCollection = await sanityClient.fetch(featuredCollectionQuery);
  const collectionSlug = featuredCollection?.slug?.current;
  const productsData = collectionSlug
    ? await sanityClient.fetch(productsByCollectionQuery(collectionSlug))
    : [];

  const products = (productsData ?? []).map((product: any) => ({
    title: product?.title,
    description: product?.description,
    priceNaira: product?.priceNaira ?? 0,
    sizes: product?.sizes ?? [],
    image: product?.images?.length ? urlFor(product.images[0]).url() : "/images/lizzaa/img-17.png",
    orderLink: product?.orderLink,
    isAvailable: product?.isAvailable ?? true
  }));

  const editorialImages = featuredCollection?.editorialImages?.map((image: unknown) => urlFor(image).url()) ?? [
    "/images/lizzaa/img-7.png",
    "/images/lizzaa/img-8.png",
    "/images/lizzaa/img-9.png"
  ];

  const collectionTitle = featuredCollection?.title ?? "Eminence Collection";
  const introCopy =
    featuredCollection?.introCopy ??
    "The Eminence Collection celebrates the elegance of power and purpose. Designed for women who lead with confidence and grace, each piece reflects refined craftsmanship, modern femininity, and timeless allure.";

  return (
    <div className="space-y-16">
      <header className="space-y-6">
        <h1 className="font-display text-4xl sm:text-5xl">{collectionTitle}</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-charcoal/70">{introCopy}</p>
      </header>
      <Section>
        <ProductGrid products={products} />
      </Section>
      <SizeGuide />
      <div className="grid gap-6">
        {editorialImages.map((image: any, index: any) => (
          <div key={image} className="relative h-[360px] overflow-hidden rounded-2xl">
            <Image
              src={image}
              alt={`Eminence editorial ${index + 1}`}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              unoptimized
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <CtaBanner title="Shop the Collection" ctaLabel="View the Lookbook" href="/shop" />
    </div>
  );
}
