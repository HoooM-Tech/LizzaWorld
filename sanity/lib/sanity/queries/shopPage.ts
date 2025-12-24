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
      title,
      description,
      priceNaira,
      sizes,
      colors,
      "images": images[].asset->url,
      orderLink,
      isAvailable
    },
    "editorialImages": editorialImages[].asset->url,
    "similarProducts": similarProducts[]-> {
      _id,
      "id": _id,
      title,
      description,
      priceNaira,
      sizes,
      colors,
      "images": images[].asset->url,
      orderLink,
      isAvailable
    },
    sizeGuide,
    ctaBanner,
    seo
  }
`;

// Fetch shop page data
export async function getShopPageData() {
  try {
    const data = await client.fetch(shopPageQuery);
    return data;
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
    title,
    description,
    priceNaira,
    sizes,
    colors,
    "images": images[].asset->url,
    orderLink,
    isAvailable
  }
`;

// Fetch single product
export async function getProductById(productId: string) {
  try {
    const data = await client.fetch(productByIdQuery, { productId });
    return data;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}