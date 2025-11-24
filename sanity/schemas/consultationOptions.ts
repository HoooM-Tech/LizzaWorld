export default {
  name: "consultationOptions",
  title: "Consultation Options",
  type: "document",
  fields: [
    {
      name: "bridalOptions",
      title: "Bridal Options",
      type: "array",
      of: [{type:"string"}],
      initialValue: [
        "White Wedding",
        "Traditional Wedding Dress",
        "Registry Wear",
        "Bridal Shower",
        "Bridesmaids"
      ],
    },
    {
      name: "corporateOptions",
      title: "Corporate Options",
      type: "array",
      of: [{type:"string"}],
      initialValue: ["Custom Suit"],
    },
    { name: "readyToWearEnabled", type: "boolean", initialValue: true },
    { name: "asoebiEnabled", type: "boolean", initialValue: true },
    {
      name: "customOutfitsExamples",
      title: "Custom Outfits Examples",
      type: "array",
      of: [{type:"string"}],
      initialValue: ["Awards", "Dinners", "Event Hosts"],
    },
    { name: "otherEnabled", type: "boolean", initialValue: true },
  ],
};
