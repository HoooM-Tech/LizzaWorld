export default {
  name: "testimonial",
  title: "Testimonials",
  type: "document",
  fields: [
    { name: "clientName", type: "string", title: "Client Name" },
    { name: "roleOrContext", type: "string", title: "Context (Bride, Client, etc.)" },
    { name: "quote", type: "text", title: "Quote" },
    { name: "featured", type: "boolean", title: "Featured?", initialValue: false },
    {
      name: "page",
      title: "Shown On Page",
      type: "string",
      options: {
        list: [
          { title: "Home", value: "home" },
          { title: "Shop", value: "shop" },
          { title: "Bespoke & Bridal", value: "bespoke" },
        ],
      },
    },
  ],
};
