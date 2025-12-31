// sanity/lib/client.ts
import { createClient, type ClientConfig } from '@sanity/client';

const config: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  // Disable CDN to always get fresh data (CDN caches responses)
  // If you want CDN for performance, set this to true and rely on webhook revalidation
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
};

export const sanityClient = createClient(config);

// Client for preview/draft content
export const previewClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  perspective: 'previewDrafts',
});

// Helper function to fetch with Next.js cache tags
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  revalidate = 3600, // 1 hour default
}: {
  query: string;
  params?: Record<string, any>;
  tags?: string[];
  revalidate?: number | false;
}): Promise<T> {
  // When revalidate is 0 or false, completely bypass caching
  if (revalidate === 0 || revalidate === false) {
    // Use Sanity client with no-store to ensure fresh data
    // The timestamp in params helps bust any potential query-level cache
    return sanityClient.fetch<T>(query, {
      ...params,
      _t: Date.now(), // Cache bust parameter
    }, {
      cache: 'no-store',
      next: {
        revalidate: 0,
        tags,
      },
    } as any);
  }
  
  // For cached requests, use the Sanity client normally
  const fetchOptions: any = {
    next: {
      revalidate,
      tags,
    },
  };
  
  return sanityClient.fetch<T>(query, params, fetchOptions);
}

// Map content types to cache tags
export function getTagsForType(type: string): string[] {
  const tagMap: Record<string, string[]> = {
    product: ['product', 'shop'],
    collection: ['collection', 'shop'],
    homePage: ['home', 'whyChooseUs'], // Add specific tag for whyChooseUs
    bespokePage: ['bespoke'],
    consultationOptions: ['consultation'],
    testimonial: ['testimonial', 'home', 'bespoke'],
    founderBio: ['founder', 'about'],
    policies: ['policies'],
    siteSettings: ['settings', 'global'],
  };

  return tagMap[type] || ['general'];
}