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
    { name: "showInstagramEmbed", title: "Show Instagram Preview", type: "boolean", initialValue: true },
  ],
};
