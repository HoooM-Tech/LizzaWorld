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
  // When revalidate is 0 or false, add timestamp to bust cache
  const fetchOptions: any = {
    next: {
      revalidate: revalidate === 0 || revalidate === false ? 0 : revalidate,
      tags,
    },
  };
  
  // Add cache busting for no-store requests
  if (revalidate === 0 || revalidate === false) {
    // Add timestamp to ensure fresh fetch
    fetchOptions.cache = 'no-store';
    // Also add a unique request ID to prevent any caching
    fetchOptions.headers = {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    };
  }
  
  return sanityClient.fetch<T>(query, params, fetchOptions);
}

// Map content types to cache tags
export function getTagsForType(type: string): string[] {
  const tagMap: Record<string, string[]> = {
    product: ['product', 'shop'],
    collection: ['collection', 'shop'],
    homePage: ['home'],
    bespokePage: ['bespoke'],
    consultationOptions: ['consultation'],
    testimonial: ['testimonial', 'home', 'bespoke'],
    founderBio: ['founder', 'about'],
    policies: ['policies'],
    siteSettings: ['settings', 'global'],
  };

  return tagMap[type] || ['general'];
}