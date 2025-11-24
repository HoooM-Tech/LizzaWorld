export default {
  name: "collection",
  title: "Collections",
  type: "document",
  fields: [
    { name: "title", type: "string", title: "Collection Title" },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "introCopy", type: "text", title: "Intro Copy" },
    { name: "coverImage", type: "image", title: "Cover Image", options: { hotspot: true } },
    {
      name: "editorialImages",
      title: "Editorial/Lifestyle Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    },
    { name: "isFeatured", title: "Featured Collection?", type: "boolean", initialValue: false },
  ],
};
