// app/shop/page.tsx
import { Suspense } from "react";
import ShopPageClient from "@/components/shop-page-client";
import { getShopPageData } from "@/sanity/lib/sanity/queries/shopPage";
import { Metadata } from "next";

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const data = await getShopPageData();
  
  if (!data) {
    return {
      title: "Shop",
      description: "Browse our ready-to-wear collection",
    };
  }

  return {
    title: data.seo?.metaTitle || data.collectionTitle,
    description: data.seo?.metaDescription || data.introCopy,
    openGraph: {
      title: data.seo?.metaTitle || data.collectionTitle,
      description: data.seo?.metaDescription || data.introCopy,
      images: data.seo?.ogImage ? [data.seo.ogImage] : [],
    },
  };
}

export default async function ShopPage() {
  const data = await getShopPageData();

  // Fallback if no data is available
  if (!data) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-4xl text-charcoal mb-4">
          Shop Coming Soon
        </h1>
        <p className="text-charcoal/70">
          Our ready-to-wear collection will be available shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Suspense fallback={<ShopPageSkeleton />}>
        <ShopPageClient
          products={data.featuredProducts || []}
          editorialImages={data.editorialImages || []}
          collectionTitle={data.collectionTitle || "Ready-to-Wear"}
          introCopy={data.introCopy || ""}
          similarProducts={data.similarProducts || []}
        />
      </Suspense>
    </div>
  );
}

// Loading skeleton
function ShopPageSkeleton() {
  return (
    <div className="space-y-16 animate-pulse">
      <div className="space-y-6">
        <div className="h-12 bg-charcoal/10 rounded w-2/3"></div>
        <div className="h-24 bg-charcoal/10 rounded w-full"></div>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-4">
            <div className="aspect-[4/5] bg-charcoal/10 rounded"></div>
            <div className="h-8 bg-charcoal/10 rounded"></div>
            <div className="h-4 bg-charcoal/10 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Force dynamic rendering to always get fresh data
export const revalidate = 0;