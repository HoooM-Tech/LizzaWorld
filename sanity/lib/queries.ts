// sanity/lib/queries.ts
export const siteSettingsQuery = `*[_type=="siteSettings"][0]`;

export const homePageQuery = `
*[_type=="homePage" && _id=="homePage"][0]{
  heroMedia,
  heroHeadline, 
  heroSubtext, 
  brandIntro, 
  ctas,
  heroVideo {
    asset-> {
      url
    }
  },
  featuredVisuals,
  testimonials[]->{
    clientName, roleOrContext, quote
  },
  whyChooseUs {
    title,
    image,
    reasons[] {
      icon,
      title,
      description
    }
  },
  processSteps,
  showInstagramEmbed
}`;

// Updated: Now includes similarProducts with all necessary fields
export const featuredCollectionQuery = `
*[_type=="collection" && isFeatured==true][0]{
  title, 
  slug, 
  introCopy, 
  coverImage, 
  editorialImages,
  similarProducts[]->{
    _id,
    title,
    description,
    priceNaira,
    sizes,
    colors,
    images[]{
      asset->{
        _id,
        url
      }
    },
    orderLink,
    isAvailable
  }
}`;

export const productsByCollectionQuery = (slug: string) => `
*[_type=="product" && collection->slug.current=="${slug}"] | order(_createdAt desc){
  _id,
  title, 
  slug, 
  priceNaira, 
  description, 
  sizes,
  colors,
  images[]{
    asset->{
      _id,
      url
    }
  }, 
  isAvailable, 
  orderLink
}`;

export const bespokePageQuery = `
*[_type=="bespokePage"][0]{
  introCopy, 
  processSteps, 
  galleryImages, 
  galleryVideo,
  testimonials[]->{
    clientName, roleOrContext, quote
  },
  ctaLabel, 
  ctaHref
}`;

export const founderBioQuery = `
*[_type=="founderBio"][0]{ 
  name, 
  title, 
  shortBio, 
  fullBio, 
  portrait 
}`;

export const policiesQuery = `
*[_type=="policies"][0]{
  termsOfService, 
  shippingPolicy, 
  returnRefundPolicy, 
  privacyPolicy
}`;

export const consultationOptionsQuery = `
*[_type=="consultationOptions"][0]
`;

// Additional useful queries

// Get all collections
export const allCollectionsQuery = `
*[_type=="collection"] | order(sortOrder asc, _createdAt desc){
  _id,
  title,
  slug,
  introCopy,
  isFeatured,
  coverImage
}`;

// Get collection by slug
export const collectionBySlugQuery = (slug: string) => `
*[_type=="collection" && slug.current=="${slug}"][0]{
  _id,
  title,
  slug,
  introCopy,
  coverImage,
  editorialImages,
  products[]->{
    _id,
    title,
    description,
    priceNaira,
    sizes,
    colors,
    images[]{
      asset->{
        _id,
        url
      }
    },
    orderLink,
    isAvailable
  },
  similarProducts[]->{
    _id,
    title,
    description,
    priceNaira,
    sizes,
    colors,
    images[]{
      asset->{
        _id,
        url
      }
    },
    orderLink,
    isAvailable
  }
}`;

// Get single product by ID
export const productByIdQuery = (productId: string) => `
*[_type=="product" && _id=="${productId}"][0]{
  _id,
  title,
  slug,
  description,
  priceNaira,
  sizes,
  colors,
  images[]{
    asset->{
      _id,
      url
    }
  },
  orderLink,
  isAvailable,
  collection->{
    title,
    slug
  }
}`;

// Get all products
export const allProductsQuery = `
*[_type=="product"] | order(_createdAt desc){
  _id,
  title,
  slug,
  description,
  priceNaira,
  sizes,
  colors,
  images[]{
    asset->{
      _id,
      url
    }
  },
  orderLink,
  isAvailable
}`;

// Get all testimonials
export const allTestimonialsQuery = `
*[_type=="testimonial"] | order(_createdAt desc){
  _id,
  clientName,
  roleOrContext,
  quote,
  projectType,
  image
}`;
