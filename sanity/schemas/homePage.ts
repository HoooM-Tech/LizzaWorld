export default {
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    //{ name: "heroMedia", title: "Hero Image", type: "image", options: { hotspot: true } },
    { name: "heroVideo", title: "Hero Video", type: "file", options: { hotspot: true, accept: "video/*" }, },
    { name: "heroHeadline", title: "Hero Headline", type: "string" },
    { name: "heroSubtext", title: "Hero Subtext", type: "text" },
    { name: "brandIntro", title: "Brand Intro", type: "text" },
    {
      name: "ctas",
      title: "CTAs",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "label", type: "string" },
          { name: "href", type: "string" },
        ],
      }],
      initialValue: [
        { label: "Shop Ready-to-Wear", href: "/shop" },
        { label: "Discover Bespoke", href: "/bespoke" },
        { label: "Book a Consultation", href: "#consultation" },
      ],
    },
        {
      name: "processSteps",
      title: "Process Steps",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "title", type: "string" },
          { name: "body", type: "text" },
        ],
      }],
    },
    {
      name: "featuredVisuals",
      title: "Featured Visuals",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule:any) => Rule.max(5),
    },
    {
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [{ type: "reference", to: [{ type: "testimonial" }] }],
    },
    {
      name: "whyChooseUs",
      title: "Why Choose Us",
      type: "object",
      fields: [
        {
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Atelier crafted for women who refuse to blend in",
        },
        {
          name: "image",
          title: "Image",
          type: "image",
          options: { hotspot: true },
        },
        {
          name: "reasons",
          title: "Reasons",
          type: "array",
          of: [{
            type: "object",
            fields: [
              {
                name: "icon",
                title: "Icon",
                type: "string",
                options: {
                  list: [
                    { title: "Sparkles", value: "Sparkles" },
                    { title: "Star", value: "Star" },
                    { title: "Heart", value: "Heart" },
                    { title: "Ruler", value: "Ruler" },
                    { title: "Users", value: "Users" },
                  ],
                },
              },
              {
                name: "title",
                title: "Title",
                type: "string",
              },
              {
                name: "description",
                title: "Description",
                type: "text",
              },
            ],
          }],
          validation: (Rule: any) => Rule.max(3),
        },
      ],
    },
    {
      name: "exploreStyles",
      title: "Explore Styles Categories",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "name", title: "Category Name", type: "string" },
          { name: "image", title: "Category Image", type: "image", options: { hotspot: true } },
          { name: "href", title: "Link Path (e.g. /shop/jackets)", type: "string" },
        ],
      }],
    },
    { name: "showInstagramEmbed", title: "Show Instagram Preview", type: "boolean", initialValue: true },
  ],
};
