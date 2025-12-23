import { sanityClient } from "@/sanity/lib/client";
import { featuredCollectionQuery, productsByCollectionQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { products as fallbackProducts } from "@/data/products";
import ShopPageClient from "@/components/shop-page-client";
import { Container } from "@/components/container";

export default async function ShopPage() {
  const featuredCollection = await sanityClient.fetch(featuredCollectionQuery);
  const collectionSlug = featuredCollection?.slug?.current;
  
  const productsData = collectionSlug
    ? await sanityClient.fetch(productsByCollectionQuery(collectionSlug))
    : [];

  let products = [];

  if (productsData && productsData.length > 0) {
    products = productsData.map((product: any) => {
      // Map all images from the product, or use fallback
      const images = product?.images?.length 
        ? product.images.map((img: any) => urlFor(img).url())
        : ["/images/lizzaa/img-17.png"];

      return {
        id: product._id, 
        title: product?.title,
        description: product?.description,
        priceNaira: product?.priceNaira ?? 0,
        sizes: product?.sizes ?? [],
        images: images, // Now returns array of images
        orderLink: product?.orderLink,
        isAvailable: product?.isAvailable ?? true
      };
    });
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
    ? featuredCollection.similarProducts.map((product: any) => {
        // Map all images for similar products too
        const images = product?.images?.length 
          ? product.images.map((img: any) => urlFor(img).url())
          : ["/images/lizzaa/img-17.png"];

        return {
          id: product._id,
          title: product?.title,
          description: product?.description,
          priceNaira: product?.priceNaira ?? 0,
          sizes: product?.sizes ?? [],
          images: images, // Now returns array of images
          orderLink: product?.orderLink,
          isAvailable: product?.isAvailable ?? true
        };
      })
    : [
        {
          id: "similar-1",
          title: "Silk Evening Gown",
          description: "Flowing elegance in luxurious silk charmeuse",
          priceNaira: 185000,
          sizes: ["S", "M", "L"],
          images: [
            "/images/lizzaa/img-10.png",
            "/images/lizzaa/img-23.png",
          ],
          orderLink: "https://www.instagram.com/lizzaatelier_?igsh=MTNsbTllZjhrYWFocA==",
          isAvailable: true
        },
        {
          id: "similar-2",
          title: "Tailored Blazer Set",
          description: "Sharp sophistication for the modern woman",
          priceNaira: 165000,
          sizes: ["XS", "S", "M", "L"],
          images: [
            "/images/lizzaa/img-11.png",
            "/images/lizzaa/img-12.png",
            "/images/lizzaa/img-6.png"
          ],
          orderLink: "https://www.instagram.com/lizzaatelier_?igsh=MTNsbTllZjhrYWFocA==",
          isAvailable: true
        },
        {
          id: "similar-3",
          title: "Draped Midi Dress",
          description: "Effortless grace with contemporary draping",
          priceNaira: 145000,
          sizes: ["S", "M", "L", "XL"],
          images: [
            "/images/lizzaa/img-12.png",
            "/images/lizzaa/img-12-alt.png",
            "/images/lizzaa/img-12-detail.png"
          ],
          orderLink: "https://www.instagram.com/lizzaatelier_?igsh=MTNsbTllZjhrYWFocA==",
          isAvailable: true
        },
        {
          id: "similar-4",
          title: "Structured Coat",
          description: "Timeless outerwear crafted for impact",
          priceNaira: 220000,
          sizes: ["S", "M", "L"],
          images: [
            "/images/lizzaa/img-20.png",
            "/images/lizzaa/img-28.png",
          ],
          orderLink: "https://www.instagram.com/lizzaatelier_?igsh=MTNsbTllZjhrYWFocA==",
          isAvailable: true
        },
        {
          id: "similar-5",
          title: "Asymmetric Wrap Top",
          description: "Bold lines meet feminine fluidity",
          priceNaira: 98000,
          sizes: ["XS", "S", "M", "L", "XL"],
          images: [
            "/images/lizzaa/img-2.png",
            "/images/lizzaa/img-16.png",
          ],
          orderLink: "https://www.instagram.com/lizzaatelier_?igsh=MTNsbTllZjhrYWFocA==",
          isAvailable: true
        },
        {
          id: "similar-6",
          title: "Wide-Leg Trousers",
          description: "Classic silhouette with modern proportions",
          priceNaira: 125000,
          sizes: ["S", "M", "L", "XL"],
          images: [
            "/images/lizzaa/img-26.png",
            "/images/lizzaa/img-27.png",
          ],
          orderLink: "https://www.instagram.com/lizzaatelier_?igsh=MTNsbTllZjhrYWFocA==",
          isAvailable: true
        }
      ];

  const collectionTitle = featuredCollection?.title ?? "Eminence Collection";
  const introCopy =
    featuredCollection?.introCopy ??
    "The Eminence Collection celebrates the elegance of power and purpose. Designed for women who lead with confidence and grace, each piece reflects refined craftsmanship, modern femininity, and timeless allure.";

  return (
    <Container className="py-16 lg:py-24">
      <ShopPageClient
        products={products}
        editorialImages={editorialImages}
        collectionTitle={collectionTitle}
        introCopy={introCopy}
        similarProducts={similarProducts}
      />
    </Container>
  );
}

export const revalidate = 60;