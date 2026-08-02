// lib/sanity/queries/shopPage.ts
import { groq } from "next-sanity";
import { client } from "../client";

// Query for the shop page
export const shopPageQuery = groq`
  *[_type == "shopPage" && _id == "shopPage"][0] {
    collectionTitle,
    introCopy,
    "featuredProducts": featuredProducts[]-> {
      _id,
      "id": _id,
      "slug": slug.current,
      title,
      description,
      priceNaira,
      sizes,
      colors,
      heights,
      tags,
      apparelTypes,
      _createdAt,
      "images": images[].asset->url,
      orderLink,
      isAvailable
    },
    "editorialImages": editorialImages[].asset->url,
    "similarProducts": similarProducts[]-> {
      _id,
      "id": _id,
      "slug": slug.current,
      title,
      description,
      priceNaira,
      sizes,
      colors,
      heights,
      tags,
      apparelTypes,
      _createdAt,
      "images": images[].asset->url,
      orderLink,
      isAvailable
    },
    sizeGuide,
    ctaBanner,
    seo
  }
`;

// Query for all collections and their products
export const allCollectionsQuery = groq`
  *[_type == "collection"] | order(sortOrder asc, _createdAt desc) {
    _id,
    title,
    slug,
    "products": products[]-> {
      _id,
      "id": _id,
      "slug": slug.current,
      title,
      description,
      priceNaira,
      sizes,
      colors,
      heights,
      tags,
      apparelTypes,
      _createdAt,
      "images": images[].asset->url,
      orderLink,
      isAvailable
    }
  }
`;

// Fetch shop page data
export async function getShopPageData() {
  try {
    const shopPage = await client.fetch(shopPageQuery);
    const collections = await client.fetch(allCollectionsQuery);
    return shopPage ? {
      ...shopPage,
      collections: collections || []
    } : null;
  } catch (error) {
    console.error("Error fetching shop page:", error);
    return null;
  }
}

// Query for a single product by ID
export const productByIdQuery = groq`
  *[_type == "product" && _id == $productId][0] {
    _id,
    "id": _id,
    "slug": slug.current,
    title,
    description,
    priceNaira,
    sizes,
    colors,
    heights,
    tags,
    apparelTypes,
    _createdAt,
    "images": images[].asset->url,
    orderLink,
    isAvailable
  }
`;

// Fetch single product by ID
export async function getProductById(productId: string) {
  try {
    const data = await client.fetch(productByIdQuery, { productId });
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Query for a single product by Slug
export const productBySlugQuery = groq`
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    "id": _id,
    "slug": slug.current,
    title,
    description,
    priceNaira,
    sizes,
    colors,
    heights,
    tags,
    apparelTypes,
    _createdAt,
    "images": images[].asset->url,
    orderLink,
    isAvailable
  }
`;

// Fetch single product by Slug
export async function getProductBySlug(slug: string) {
  try {
    const data = await client.fetch(productBySlugQuery, { slug });
    return data;
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return null;
  }
}