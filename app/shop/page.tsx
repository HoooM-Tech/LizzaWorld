// import { sanityClient } from "@/sanity/lib/client";
// import { featuredCollectionQuery, productsByCollectionQuery } from "@/sanity/lib/queries";
// import { urlFor } from "@/sanity/lib/image";
// import { products as fallbackProducts } from "@/data/products";
// import ShopPageClient from "@/components/shop-page-client";
// import { Container } from "@/components/container";

// export default async function ShopPage() {
//   const featuredCollection = await sanityClient.fetch(featuredCollectionQuery);
//   const collectionSlug = featuredCollection?.slug?.current;
  
//   const productsData = collectionSlug
//     ? await sanityClient.fetch(productsByCollectionQuery(collectionSlug))
//     : [];

//   let products = [];

//   if (productsData && productsData.length > 0) {
//     products = productsData.map((product: any) => {
//       // Map all images from the product, or use fallback
//       const images = product?.images?.length 
//         ? product.images.map((img: any) => urlFor(img).url())
//         : ["/images/lizzaa/img-17.png"];

//       return {
//         id: product._id, 
//         title: product?.title,
//         description: product?.description,
//         priceNaira: product?.priceNaira ?? 0,
//         sizes: product?.sizes ?? [],
//         images: images, // Now returns array of images
//         orderLink: product?.orderLink,
//         isAvailable: product?.isAvailable ?? true
//       };
//     });
//   } else {
//     products = fallbackProducts;
//   }

//   const editorialImages = featuredCollection?.editorialImages?.map((image: unknown) => urlFor(image).url()) ?? [
//     "/images/lizzaa/img-7.png",
//     "/images/lizzaa/img-8.png",
//     "/images/lizzaa/img-9.png"
//   ];

//   // Fetch similar products from Sanity or use regular products as fallback
//   const similarProducts = featuredCollection?.similarProducts?.length
//     ? featuredCollection.similarProducts.map((product: any) => {
//         // Map all images for similar products too
//         const images = product?.images?.length 
//           ? product.images.map((img: any) => urlFor(img).url())
//           : ["/images/lizzaa/img-17.png"];

//         return {
//           id: product._id,
//           title: product?.title,
//           description: product?.description,
//           priceNaira: product?.priceNaira ?? 0,
//           sizes: product?.sizes ?? [],
//           images: images, // Now returns array of images
//           orderLink: product?.orderLink,
//           isAvailable: product?.isAvailable ?? true
//         };
//       })
//     : [
//         {
//           id: "similar-1",
//           title: "Silk Evening Gown",
//           description: "Flowing elegance in luxurious silk charmeuse",
//           priceNaira: 185000,
//           sizes: ["S", "M", "L"],
//           images: [
//             "/images/lizzaa/img-10.png",
//             "/images/lizzaa/img-23.png",
//           ],
//           orderLink: "https://www.instagram.com/lizzaatelier_?igsh=MTNsbTllZjhrYWFocA==",
//           isAvailable: true
//         },
//         {
//           id: "similar-2",
//           title: "Tailored Blazer Set",
//           description: "Sharp sophistication for the modern woman",
//           priceNaira: 165000,
//           sizes: ["XS", "S", "M", "L"],
//           images: [
//             "/images/lizzaa/img-11.png",
//             "/images/lizzaa/img-12.png",
//             "/images/lizzaa/img-6.png"
//           ],
//           orderLink: "https://www.instagram.com/lizzaatelier_?igsh=MTNsbTllZjhrYWFocA==",
//           isAvailable: true
//         },
//         {
//           id: "similar-3",
//           title: "Draped Midi Dress",
//           description: "Effortless grace with contemporary draping",
//           priceNaira: 145000,
//           sizes: ["S", "M", "L", "XL"],
//           images: [
//             "/images/lizzaa/img-12.png",
//             "/images/lizzaa/img-12-alt.png",
//             "/images/lizzaa/img-12-detail.png"
//           ],
//           orderLink: "https://www.instagram.com/lizzaatelier_?igsh=MTNsbTllZjhrYWFocA==",
//           isAvailable: true
//         },
//         {
//           id: "similar-4",
//           title: "Structured Coat",
//           description: "Timeless outerwear crafted for impact",
//           priceNaira: 220000,
//           sizes: ["S", "M", "L"],
//           images: [
//             "/images/lizzaa/img-20.png",
//             "/images/lizzaa/img-28.png",
//           ],
//           orderLink: "https://www.instagram.com/lizzaatelier_?igsh=MTNsbTllZjhrYWFocA==",
//           isAvailable: true
//         },
//         {
//           id: "similar-5",
//           title: "Asymmetric Wrap Top",
//           description: "Bold lines meet feminine fluidity",
//           priceNaira: 98000,
//           sizes: ["XS", "S", "M", "L", "XL"],
//           images: [
//             "/images/lizzaa/img-2.png",
//             "/images/lizzaa/img-16.png",
//           ],
//           orderLink: "https://www.instagram.com/lizzaatelier_?igsh=MTNsbTllZjhrYWFocA==",
//           isAvailable: true
//         },
//         {
//           id: "similar-6",
//           title: "Wide-Leg Trousers",
//           description: "Classic silhouette with modern proportions",
//           priceNaira: 125000,
//           sizes: ["S", "M", "L", "XL"],
//           images: [
//             "/images/lizzaa/img-26.png",
//             "/images/lizzaa/img-27.png",
//           ],
//           orderLink: "https://www.instagram.com/lizzaatelier_?igsh=MTNsbTllZjhrYWFocA==",
//           isAvailable: true
//         }
//       ];

//   const collectionTitle = featuredCollection?.title ?? "Eminence Collection";
//   const introCopy =
//     featuredCollection?.introCopy ??
//     "The Eminence Collection celebrates the elegance of power and purpose. Designed for women who lead with confidence and grace, each piece reflects refined craftsmanship, modern femininity, and timeless allure.";

//   return (
//     <Container className="py-16 lg:py-24">
//       <ShopPageClient
//         products={products}
//         editorialImages={editorialImages}
//         collectionTitle={collectionTitle}
//         introCopy={introCopy}
//         similarProducts={similarProducts}
//       />
//     </Container>
//   );
// }

// export const revalidate = 60;



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