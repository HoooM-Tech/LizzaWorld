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
      name: 'colors',
      title: 'Available Colors',
      type: 'array',
      description: 'Colors available for this product (optional)',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      description: 'Product tags — "NEW" shows the New Arrivals badge',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: '🆕 New Arrival', value: 'NEW' },
          { title: '🔥 Bestseller', value: 'BESTSELLER' },
          { title: '⭐ Featured', value: 'FEATURED' },
          { title: '🏷️ Sale', value: 'SALE' },
          { title: '⚡ Limited Edition', value: 'LIMITED' },
        ],
      },
    }),
    defineField({
      name: 'apparelTypes',
      title: 'Apparel Category',
      type: 'array',
      description: 'Select the category/style this product belongs to. Used for style filtering on the Shop page and style category pages (e.g. /shop/suits).',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Suit', value: 'suit' },
          { title: 'Jacket / Blazer', value: 'jacket' },
          { title: 'Pant / Trouser', value: 'pant' },
          { title: 'Short', value: 'short' },
          { title: 'Skirt', value: 'skirt' },
          { title: 'Coat', value: 'coat' },
          { title: 'Hat', value: 'hat' },
          { title: 'Bridal Dress', value: 'bridal' },
          { title: 'Dress / Gown', value: 'dress' },
          { title: 'Top / Blouse', value: 'top' },
          { title: 'Set / Co-ord', value: 'set' },
        ],
      },
    }),
    defineField({
      name: 'sizes',
      title: 'Available Sizes',
      type: 'array',
      description: 'Sizes available for this product',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
          { title: '2XL', value: '2XL' },
          { title: '3XL', value: '3XL' },
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
      initialValue: ['S', 'M', 'L', 'XL'],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'heights',
      title: 'Available Heights',
      type: 'array',
      description: 'Heights available for this product (optional). If left empty, it will fall back to the default height options (5\'2" to 6\'1").',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: "5'2\"", value: "5'2\"" },
          { title: "5'3\"", value: "5'3\"" },
          { title: "5'4\"", value: "5'4\"" },
          { title: "5'5\"", value: "5'5\"" },
          { title: "5'6\"", value: "5'6\"" },
          { title: "5'7\"", value: "5'7\"" },
          { title: "5'8\"", value: "5'8\"" },
          { title: "5'9\"", value: "5'9\"" },
          { title: "5'10\"", value: "5'10\"" },
          { title: "5'11\"", value: "5'11\"" },
          { title: "6'0\"", value: "6'0\"" },
          { title: "6'1\"", value: "6'1\"" },
        ],
      },
      initialValue: ["5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\""],
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
      media: 'images.0',
      price: 'priceNaira',
      isAvailable: 'isAvailable',
      apparelTypes: 'apparelTypes',
      tags: 'tags',
    },
    prepare({ title, media, price, isAvailable, apparelTypes, tags }) {
      const category = apparelTypes?.length ? apparelTypes.join(', ') : '';
      const isNew = tags?.includes('NEW') ? '🆕 ' : '';
      return {
        title: `${isNew}${title}`,
        subtitle: [
          `₦${price?.toLocaleString() ?? '—'}`,
          !isAvailable ? '• SOLD OUT' : '',
          category ? `• ${category}` : '',
        ].filter(Boolean).join(' '),
        media: media,
      };
    },
  },
});