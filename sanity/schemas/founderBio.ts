export default {
  name: "founderBio",
  title: "Founder Bio",
  type: "document",
  fields: [
    { name: "name", type: "string" },
    { name: "title", type: "string" },
    { name: "shortBio", type: "text" },
    { name: "fullBio", type: "text" },
    { name: "portrait", type: "image", options: { hotspot: true } },
  ],
};
