export default {
  name: "product",
  title: "Products",
  type: "document",
  fields: [
    { name: "title", type: "string", title: "Product Name" },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "collection", type: "reference", to: [{ type: "collection" }], title: "Collection" },
    { name: "priceNaira", type: "number", title: "Price (₦)" },
    { name: "description", type: "text", title: "Description" },
    {
      name: "sizes",
      title: "Sizes",
      type: "array",
      of: [{ type: "string" }],
      initialValue: ["6","8","10","12","14","16","18","20"],
    },
    {
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    },
    { name: "isAvailable", title: "Available", type: "boolean", initialValue: true },
    { name: "orderLink", title: "Order Link (Checkout/WhatsApp/IG)", type: "url" },
  ],
};
