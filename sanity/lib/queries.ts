export const siteSettingsQuery = `*[_type=="siteSettings"][0]`;

export const homePageQuery = `

heroMedia {
  asset-> {
    url
  }
}

*[_type=="homePage"][0]{
  heroMedia, heroHeadline, heroSubtext, brandIntro, ctas,
  featuredVisuals,
  testimonials[]->{
    clientName, roleOrContext, quote
  },
  showInstagramEmbed
}`;

export const featuredCollectionQuery = `
*[_type=="collection" && isFeatured==true][0]{
  title, slug, introCopy, coverImage, editorialImages
}`;

export const productsByCollectionQuery = (slug:string)=>`
*[_type=="product" && collection->slug.current=="${slug}"] | order(_createdAt desc){
  title, slug, priceNaira, description, sizes, images, isAvailable, orderLink
}`;

export const bespokePageQuery = `
*[_type=="bespokePage"][0]{
  introCopy, processSteps, galleryImages, galleryVideo,
  testimonials[]->{
    clientName, roleOrContext, quote
  },
  ctaLabel, ctaHref
}`;

export const founderBioQuery = `
*[_type=="founderBio"][0]{ name, title, shortBio, fullBio, portrait }
`;

export const policiesQuery = `
*[_type=="policies"][0]{
  termsOfService, shippingPolicy, returnRefundPolicy, privacyPolicy
}`;

export const consultationOptionsQuery = `
*[_type=="consultationOptions"][0]
`;
