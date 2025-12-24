// schemas/shopPage.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'shopPage',
  title: 'Shop Page',
  type: 'document',
  fields: [
    defineField({
      name: 'collectionTitle',
      title: 'Collection Title',
      type: 'string',
      description: 'Main heading for the shop page (e.g., "Ready-to-Wear Collection")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'introCopy',
      title: 'Introduction Copy',
      type: 'text',
      rows: 4,
      description: 'Brief introduction text below the title',
      validation: (Rule) => Rule.required().max(500),
    }),
    defineField({
      name: 'featuredProducts',
      title: 'Featured Products',
      type: 'array',
      description: 'Main products to display on the shop page',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'editorialImages',
      title: 'Editorial Images',
      type: 'array',
      description: 'Lifestyle/editorial images for the collection',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'Important for SEO and accessibility',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for the image',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'similarProducts',
      title: 'Similar Products (You May Also Like)',
      type: 'array',
      description: 'Products to show in the "You May Also Like" section',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
        },
      ],
    }),
    defineField({
      name: 'sizeGuide',
      title: 'Size Guide',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show Size Guide',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'title',
          title: 'Size Guide Title',
          type: 'string',
          initialValue: 'Size Guide',
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
        },
        {
          name: 'measurements',
          title: 'Size Measurements',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                { name: 'size', type: 'string', title: 'Size' },
                { name: 'bust', type: 'string', title: 'Bust (inches)' },
                { name: 'waist', type: 'string', title: 'Waist (inches)' },
                { name: 'hips', type: 'string', title: 'Hips (inches)' },
                { name: 'length', type: 'string', title: 'Length (inches)' },
              ],
              preview: {
                select: {
                  size: 'size',
                  bust: 'bust',
                  waist: 'waist',
                },
                prepare({ size, bust, waist }) {
                  return {
                    title: `Size ${size}`,
                    subtitle: `Bust: ${bust}", Waist: ${waist}"`,
                  };
                },
              },
            },
          ],
        },
        {
          name: 'fitNotes',
          title: 'Fit Notes',
          type: 'array',
          of: [{ type: 'string' }],
          description: 'Additional notes about fit (e.g., "Runs true to size")',
        },
      ],
    }),
    defineField({
      name: 'ctaBanner',
      title: 'Call-to-Action Banner',
      type: 'object',
      fields: [
        {
          name: 'enabled',
          title: 'Show CTA Banner',
          type: 'boolean',
          initialValue: true,
        },
        {
          name: 'title',
          title: 'Banner Title',
          type: 'string',
          initialValue: 'Begin Your Journey',
        },
        {
          name: 'ctaLabel',
          title: 'Button Label',
          type: 'string',
          initialValue: 'Book a Consultation',
        },
        {
          name: 'ctaLink',
          title: 'Button Link',
          type: 'string',
          initialValue: '/consultation',
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'metaTitle',
          title: 'Meta Title',
          type: 'string',
          validation: (Rule) => Rule.max(60),
        },
        {
          name: 'metaDescription',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160),
        },
        {
          name: 'ogImage',
          title: 'Open Graph Image',
          type: 'image',
          description: 'Image for social media sharing',
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'collectionTitle',
      subtitle: 'introCopy',
    },
  },
});