export default {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    { name: "brandName", title: "Brand Name", type: "string", initialValue: "Lizzaworld Atelier" },
    { name: "tagline", title: "Tagline", type: "string" },
    { name: "logo", title: "Logo", type: "image", options: { hotspot: true } },
    {
      name: "colors",
      title: "Brand Colors",
      type: "object",
      fields: [
        { name: "champagneBeige", type: "string", title: "Champagne Beige (hex)" },
        { name: "charcoalBlack", type: "string", title: "Charcoal Black (hex)" },
        { name: "ivoryWhite", type: "string", title: "Ivory White (hex)" },
      ],
    },
    { name: "primaryFont", title: "Primary Font", type: "string" },
    { name: "secondaryFont", title: "Secondary Font", type: "string" },
    { name: "instagramHandle", title: "Instagram Handle", type: "string" },
    {
      name: "socialLinks",
      title: "Social Links",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "title", type: "string" },
          { name: "url", type: "url" },
        ],
      }],
    },
    {
      name: "seo",
      title: "Default SEO",
      type: "object",
      fields: [
        { name: "title", type: "string" },
        { name: "description", type: "text" },
        { name: "ogImage", type: "image", options: { hotspot: true } },
      ],
    },
  ],
};
