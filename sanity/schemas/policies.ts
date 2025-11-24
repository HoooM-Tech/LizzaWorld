export default {
  name: "policies",
  title: "Policies",
  type: "document",
  fields: [
    { name: "termsOfService", title: "Terms of Service", type: "array", of: [{type:"block"}]},
    { name: "shippingPolicy", title: "Shipping Policy", type: "array", of: [{type:"block"}]},
    { name: "returnRefundPolicy", title: "Return & Refund Policy", type: "array", of: [{type:"block"}]},
    { name: "privacyPolicy", title: "Privacy Policy", type: "array", of: [{type:"block"}]},
  ],
};
