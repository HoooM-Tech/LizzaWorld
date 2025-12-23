// schemas/collection.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'collection',
  title: 'Collection',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Collection Title',
      type: 'string',
      description: 'Name of the collection (e.g., "Eminence Collection")',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'URL-friendly version of the title',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'introCopy',
      title: 'Introduction Copy',
      type: 'text',
      rows: 4,
      description: 'Brief introduction text for the collection',
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Collection',
      type: 'boolean',
      description: 'Show this collection on the shop page',
      initialValue: false,
    }),
    defineField({
      name: 'products',
      title: 'Products',
      type: 'array',
      description: 'Products in this collection',
      of: [
        {
          type: 'reference',
          to: [{ type: 'product' }],
        },
      ],
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
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Order in which collections appear (lower numbers appear first)',
      initialValue: 0,
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
      title: 'title',
      subtitle: 'introCopy',
      isFeatured: 'isFeatured',
    },
    prepare({ title, subtitle, isFeatured }) {
      return {
        title: title,
        subtitle: isFeatured ? '⭐ Featured | ' + (subtitle || '') : subtitle,
      };
    },
  },
});