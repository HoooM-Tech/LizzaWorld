export default {
  name: "bespokePage",
  title: "Bespoke & Bridal Page",
  type: "document",
  fields: [
    { name: "introCopy", type: "text", title: "Intro Copy" },
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
      name: "galleryImages",
      title: "Gallery Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule:any)=>Rule.max(10),
    },
    { name: "galleryVideo", title: "Optional Video", type: "file" },
    {
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [{ type: "reference", to: [{ type: "testimonial" }] }],
    },
    { name: "ctaLabel", type: "string", title: "CTA Label", initialValue: "Begin Your Journey" },
    { name: "ctaHref", type: "string", title: "CTA Link", initialValue: "#consultation" },
  ],
};
