// sanity/lib/client.ts
import { createClient, type ClientConfig } from '@sanity/client';

const config: ClientConfig = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
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
  return sanityClient.fetch<T>(query, params, {
    next: {
      revalidate,
      tags,
    },
  });
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