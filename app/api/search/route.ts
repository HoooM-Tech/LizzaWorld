// app/api/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import { sanityClient } from "@/sanity/lib/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Search across products, collections, and pages in Sanity
    const searchQuery = `
      {
        "products": *[_type == "product" && (
          title match $searchTerm + "*" ||
          description match $searchTerm + "*" ||
          category->title match $searchTerm + "*"
        )] | order(_createdAt desc) [0...5] {
          _id,
          title,
          "slug": slug.current,
          "image": images[0].asset->url,
          price,
          description,
          "type": "product"
        },
        "collections": *[_type == "collection" && (
          title match $searchTerm + "*" ||
          description match $searchTerm + "*"
        )] | order(_createdAt desc) [0...3] {
          _id,
          title,
          "slug": slug.current,
          description,
          "type": "collection"
        }
      }
    `;

    const data = await sanityClient.fetch(searchQuery, {
      searchTerm: query.toLowerCase()
    });

    // Combine and format results
    const results = [
      ...(data.products || []).map((item: any) => ({
        id: item._id,
        title: item.title,
        type: "product" as const,
        url: `/shop/${item.slug}`,
        image: item.image,
        price: item.price,
        description: item.description
      })),
      ...(data.collections || []).map((item: any) => ({
        id: item._id,
        title: item.title,
        type: "collection" as const,
        url: `/shop/${item.slug}`,
        description: item.description
      }))
    ];

    // Add static pages if they match
    const staticPages = [
      {
        id: "bespoke",
        title: "Bespoke & Bridal",
        type: "page" as const,
        url: "/bespoke",
        description: "Custom-crafted pieces designed exclusively for you"
      },
      {
        id: "consultation",
        title: "Book a Consultation",
        type: "page" as const,
        url: "/consultation",
        description: "Personal styling session with our atelier"
      },
      {
        id: "shop",
        title: "Shop",
        type: "page" as const,
        url: "/shop",
        description: "Browse our ready-to-wear collection"
      }
    ];

    const matchingPages = staticPages.filter(
      (page) =>
        page.title.toLowerCase().includes(query.toLowerCase()) ||
        page.description.toLowerCase().includes(query.toLowerCase())
    );

    const allResults = [...results, ...matchingPages];

    return NextResponse.json({ 
      results: allResults,
      query 
    });

  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Search failed", results: [] },
      { status: 500 }
    );
  }
}