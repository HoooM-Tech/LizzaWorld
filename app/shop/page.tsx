import { sanityClient } from "@/sanity/lib/client";
import { featuredCollectionQuery, productsByCollectionQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { products as fallbackProducts } from "@/data/products";
import ShopPageClient from "@/components/shop-page-client";

export default async function ShopPage() {
  const featuredCollection = await sanityClient.fetch(featuredCollectionQuery);
  const collectionSlug = featuredCollection?.slug?.current;
  
  const productsData = collectionSlug
    ? await sanityClient.fetch(productsByCollectionQuery(collectionSlug))
    : [];

  let products = [];

  if (productsData && productsData.length > 0) {
    products = productsData.map((product: any) => ({
      id: product._id, 
      title: product?.title,
      description: product?.description,
      priceNaira: product?.priceNaira ?? 0,
      sizes: product?.sizes ?? [],
      image: product?.images?.length ? urlFor(product.images[0]).url() : "/images/lizzaa/img-17.png",
      orderLink: product?.orderLink,
      isAvailable: product?.isAvailable ?? true
    }));
  } else {
    products = fallbackProducts;
  }

  const editorialImages = featuredCollection?.editorialImages?.map((image: unknown) => urlFor(image).url()) ?? [
    "/images/lizzaa/img-7.png",
    "/images/lizzaa/img-8.png",
    "/images/lizzaa/img-9.png"
  ];

  // Fetch similar products from Sanity or use regular products as fallback
const similarProducts = featuredCollection?.similarProducts?.length
    ? featuredCollection.similarProducts.map((product: any) => ({
        id: product._id,
        title: product?.title,
        description: product?.description,
        priceNaira: product?.priceNaira ?? 0,
        sizes: product?.sizes ?? [],
        image: product?.images?.length ? urlFor(product.images[0]).url() : "/images/lizzaa/img-17.png",
        orderLink: product?.orderLink,
        isAvailable: product?.isAvailable ?? true
      }))
    : [
        {
          id: "similar-1",
          title: "Silk Evening Gown",
          description: "Flowing elegance in luxurious silk charmeuse",
          priceNaira: 185000,
          sizes: ["S", "M", "L"],
          image: "/images/lizzaa/img-10.png",
          orderLink: "https://www.instagram.com/lizza.atelier",
          isAvailable: true
        },
        {
          id: "similar-2",
          title: "Tailored Blazer Set",
          description: "Sharp sophistication for the modern woman",
          priceNaira: 165000,
          sizes: ["XS", "S", "M", "L"],
          image: "/images/lizzaa/img-11.png",
          orderLink: "https://www.instagram.com/lizza.atelier",
          isAvailable: true
        },
        {
          id: "similar-3",
          title: "Draped Midi Dress",
          description: "Effortless grace with contemporary draping",
          priceNaira: 145000,
          sizes: ["S", "M", "L", "XL"],
          image: "/images/lizzaa/img-12.png",
          orderLink: "https://www.instagram.com/lizza.atelier",
          isAvailable: true
        },
        {
          id: "similar-4",
          title: "Structured Coat",
          description: "Timeless outerwear crafted for impact",
          priceNaira: 220000,
          sizes: ["S", "M", "L"],
          image: "/images/lizzaa/img-13.png",
          orderLink: "https://www.instagram.com/lizza.atelier",
          isAvailable: true
        },
        {
          id: "similar-5",
          title: "Asymmetric Wrap Top",
          description: "Bold lines meet feminine fluidity",
          priceNaira: 98000,
          sizes: ["XS", "S", "M", "L", "XL"],
          image: "/images/lizzaa/img-14.png",
          orderLink: "https://www.instagram.com/lizza.atelier",
          isAvailable: true
        },
        {
          id: "similar-6",
          title: "Wide-Leg Trousers",
          description: "Classic silhouette with modern proportions",
          priceNaira: 125000,
          sizes: ["S", "M", "L", "XL"],
          image: "/images/lizzaa/img-15.png",
          orderLink: "https://www.instagram.com/lizza.atelier",
          isAvailable: true
        }
      ];

  const collectionTitle = featuredCollection?.title ?? "Eminence Collection";
  const introCopy =
    featuredCollection?.introCopy ??
    "The Eminence Collection celebrates the elegance of power and purpose. Designed for women who lead with confidence and grace, each piece reflects refined craftsmanship, modern femininity, and timeless allure.";

  return (
    <ShopPageClient
      products={products}
      editorialImages={editorialImages}
      collectionTitle={collectionTitle}
      introCopy={introCopy}
      similarProducts={similarProducts}
    />
  );
}