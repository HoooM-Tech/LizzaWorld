// schemas/index.ts
import siteSettings from "./siteSettings";
import homePage from "./homePage";
import collection from "./collection";
import product from "./product";
import bespokePage from "./bespokePage";
import testimonial from "./testimonial";
import founderBio from "./founderBio";
import policies from "./policies";
import consultationOptions from "./consultationOptions";
import shopPage from "./shopPage";

export const schemaTypes = [
  siteSettings,
  homePage,
  shopPage,
  collection,
  product,
  bespokePage,
  testimonial,
  founderBio,
  policies,
  consultationOptions,
];