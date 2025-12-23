// schemas/product.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Product Title',
      type: 'string',
      description: 'Name of the product',
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
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'Brief description of the product',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'priceNaira',
      title: 'Price (Naira)',
      type: 'number',
      description: 'Price in Nigerian Naira',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      description: 'Upload multiple images for the product gallery',
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
          ],
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      description: 'Sizes available for this product',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '6', value: '6' },
          { title: '8', value: '8' },
          { title: '10', value: '10' },
          { title: '12', value: '12' },
          { title: '14', value: '14' },
          { title: '16', value: '16' },
          { title: '18', value: '18' },
          { title: '20', value: '20' },
        ],
      },
      initialValue: ['6', '8', '10', '12', '14', '16', '18', '20'],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      description: 'Colors available for this product (optional)',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'isAvailable',
      title: 'In Stock',
      type: 'boolean',
      description: 'Is this product available for purchase?',
      initialValue: true,
    }),
    defineField({
      name: 'orderLink',
      title: 'Order Link',
      type: 'url',
      description: 'Optional external link (e.g., Instagram, WhatsApp)',
      validation: (Rule) => 
        Rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'images.0',
      price: 'priceNaira',
      isAvailable: 'isAvailable',
    },
    prepare({ title, subtitle, media, price, isAvailable }) {
      return {
        title: title,
        subtitle: `₦${price?.toLocaleString()} ${!isAvailable ? '• SOLD OUT' : ''}`,
        media: media,
      };
    },
  },
});