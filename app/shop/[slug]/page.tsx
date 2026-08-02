import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getProductBySlug, getProductById } from "@/sanity/lib/sanity/queries/shopPage";
import { client } from "@/sanity/lib/sanity/client";
import { groq } from "next-sanity";
import { products as fallbackProducts } from "@/data/products";
import ProductDetailPageClient from "@/components/product-detail-client";
import { ProductListWithQuickView } from "@/components/product-list-with-quickview";

// Known style category slugs that should show "coming soon" instead of "not found"
const STYLE_CATEGORIES: Record<string, string> = {
  suits: "Suits",
  suit: "Suits",
  jackets: "Jackets",
  jacket: "Jackets",
  pants: "Pants",
  pant: "Pants",
  shorts: "Shorts",
  short: "Shorts",
  skirts: "Skirts",
  skirt: "Skirts",
  coats: "Coats",
  coat: "Coats",
  hats: "Hats",
  hat: "Hats",
  "bridal-dresses": "Bridal Dresses",
  "bridal-dress": "Bridal Dresses",
  dresses: "Dresses",
  dress: "Dresses",
  tops: "Tops",
  top: "Tops",
  blouses: "Blouses",
  blouse: "Blouses",
  "new-arrivals": "New Arrivals",
};

// Maps style display name → singular keyword used for product matching
const STYLE_KEYWORD: Record<string, string> = {
  "Suits": "suit",
  "Jackets": "jacket",
  "Pants": "pant",
  "Shorts": "short",
  "Skirts": "skirt",
  "Coats": "coat",
  "Hats": "hat",
  "Bridal Dresses": "bridal",
  "Dresses": "dress",
  "Tops": "top",
  "Blouses": "blouse",
  "New Arrivals": "new",
};

// Check if a product matches a style category
function matchesStyleSlug(product: { title: string; description?: string; tags?: string[]; apparelTypes?: string[] }, keyword: string): boolean {
  const title = product.title.toLowerCase();
  const description = (product.description || "").toLowerCase();
  const tags = (product.tags || []).map((t: string) => t.toLowerCase());
  const apparelTypes = (product.apparelTypes || []).map((t: string) => t.toLowerCase());
  const singular = keyword.toLowerCase();
  const plural = singular + "s";

  // Use word-boundary regex to avoid partial matches (e.g. "hat" in "that", "what")
  const singularRe = new RegExp(`\\b${singular}\\b`);
  const pluralRe = new RegExp(`\\b${plural}\\b`);

  return (
    singularRe.test(title) || pluralRe.test(title) ||
    singularRe.test(description) || pluralRe.test(description) ||
    tags.some(t => t === singular || t === plural) ||
    apparelTypes.some(t => t === singular || t === plural)
  );
}

// Groq query for fetching all products with exact projection
const allProductsQuery = groq`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    "id": _id,
    "slug": slug.current,
    title,
    description,
    priceNaira,
    sizes,
    colors,
    heights,
    tags,
    apparelTypes,
    _createdAt,
    "images": images[].asset->url,
    orderLink,
    isAvailable
  }
`;

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Generate SEO Metadata dynamically
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  
  let product = null;
  try {
    product = await getProductBySlug(slug);
    if (!product) {
      product = await getProductById(slug);
    }
  } catch (error) {
    console.error("Error generating metadata:", error);
  }

  // Fallback to mock data if Sanity product is not found
  if (!product) {
    const mock = fallbackProducts.find((p) => p.id === slug);
    if (mock) {
      return {
        title: `${mock.title} | Lizza Atelier`,
        description: mock.description,
      };
    }
    return {
      title: "Product Details | Lizza Atelier",
      description: "Browse our ready-to-wear collections.",
    };
  }

  return {
    title: `${product.title} | Lizza Atelier`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch current product
  let productData = null;
  try {
    productData = await getProductBySlug(slug);
    if (!productData) {
      productData = await getProductById(slug);
    }
  } catch (error) {
    console.error("Error fetching product on server:", error);
  }

  // 2. Fetch all products (for recommendations)
  let allProductsData = [];
  try {
    allProductsData = await client.fetch(allProductsQuery);
  } catch (error) {
    console.error("Error fetching all products on server:", error);
  }

  // 3. Fallbacks to mock data if Sanity is not populated / connected
  const currentProduct = productData || fallbackProducts.find((p) => p.id === slug);
  const recommendations = allProductsData && allProductsData.length > 0
    ? allProductsData
    : fallbackProducts;

  if (!currentProduct) {
    // Check if this is a known style category slug
    const styleName = STYLE_CATEGORIES[slug.toLowerCase()];

    if (styleName) {
      // Check if any real products match this style category
      const keyword = STYLE_KEYWORD[styleName] || slug.toLowerCase().replace(/-/g, "");
      const matchingProducts = recommendations.filter((p: any) => matchesStyleSlug(p, keyword));
      const popularProducts = recommendations.filter((p: any) => !matchesStyleSlug(p, keyword)).slice(0, 4);

      if (matchingProducts.length > 0) {
        // Products exist for this style — show a category page
        return <StyleCategoryPage styleName={styleName} products={matchingProducts} popularProducts={popularProducts} />;
      }

      // No products yet — show "coming soon"
      return <StyleComingSoonPage styleName={styleName} popularProducts={recommendations.slice(0, 4)} />;
    }

    // Truly unknown – show not found with popular products
    return <NotFoundPage popularProducts={recommendations.slice(0, 4)} />;
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Suspense fallback={<ProductPageSkeleton />}>
        <ProductDetailPageClient 
          product={currentProduct} 
          allProducts={recommendations} 
        />
      </Suspense>
    </div>
  );
}

// Loading Skeleton
function ProductPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-24 animate-pulse space-y-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 flex gap-4">
          <div className="w-24 flex-shrink-0 flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[3/4] w-full bg-charcoal/10 rounded"></div>
            ))}
          </div>
          <div className="flex-1 aspect-square bg-charcoal/10 rounded"></div>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="h-10 bg-charcoal/10 rounded w-3/4"></div>
          <div className="h-6 bg-charcoal/10 rounded w-1/4"></div>
          <div className="h-24 bg-charcoal/10 rounded w-full"></div>
          <div className="space-y-4 pt-6">
            <div className="h-8 bg-charcoal/10 rounded w-1/2"></div>
            <div className="h-8 bg-charcoal/10 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Style Category Not Available Page
type SimpleProduct = {
  id: string;
  title: string;
  slug?: string;
  images: string[];
  priceNaira: number;
};

// Style Category Page — shown when products exist for this style
function StyleCategoryPage({ styleName, products, popularProducts }: { styleName: string; products: SimpleProduct[]; popularProducts: SimpleProduct[] }) {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Category Banner */}
      <div className="relative bg-charcoal overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #c9a96e 0, #c9a96e 1px, transparent 0, transparent 50%)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 container mx-auto px-6 py-20 sm:py-28 text-center">
          <nav className="flex items-center justify-center gap-2 text-ivory/50 text-xs tracking-widest uppercase mb-8">
            <Link href="/" className="hover:text-champagne transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-champagne transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-champagne">{styleName}</span>
          </nav>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ivory tracking-wide mb-4">
            {styleName}
          </h1>
          <div className="w-16 h-px bg-champagne mx-auto mb-6" />
          <p className="text-ivory/60 text-sm tracking-widest uppercase">
            {products.length} {products.length === 1 ? "Piece" : "Pieces"}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-6 py-16">
        <ProductListWithQuickView products={products as any} columns={4} />


        <div className="text-center mt-12">
          <Link
            href="/shop"
            className="inline-block px-10 py-4 border border-charcoal text-charcoal text-xs tracking-widest uppercase font-semibold hover:bg-charcoal hover:text-ivory transition-all duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>

      {/* Popular from other categories */}
      {popularProducts.length > 0 && (
        <div className="container mx-auto px-6 pb-20 border-t border-charcoal/10 pt-16">
          <div className="text-center mb-12">
            <p className="text-champagne text-xs tracking-widest uppercase mb-3 font-medium">Explore More</p>
            <h2 className="font-display text-3xl text-charcoal tracking-wide">You Might Also Like</h2>
            <div className="w-12 h-0.5 bg-champagne mx-auto mt-4" />
          </div>
          <ProductListWithQuickView products={popularProducts as any} columns={4} />

        </div>
      )}
    </div>
  );
}

function StyleComingSoonPage({ styleName, popularProducts }: { styleName: string; popularProducts: SimpleProduct[] }) {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Banner */}
      <div className="relative bg-charcoal overflow-hidden">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, #c9a96e 0, #c9a96e 1px, transparent 0, transparent 50%)",
            backgroundSize: "30px 30px",
          }}
        />
        <div className="relative z-10 container mx-auto px-6 py-24 sm:py-32 text-center">
          {/* Breadcrumb */}
          <nav className="flex items-center justify-center gap-2 text-ivory/50 text-xs tracking-widest uppercase mb-10">
            <Link href="/" className="hover:text-champagne transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-champagne transition-colors">Shop</Link>
            <span>/</span>
            <span className="text-champagne">{styleName}</span>
          </nav>

          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-full border border-champagne/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-ivory tracking-wide mb-6">
            {styleName}
          </h1>

          <div className="w-16 h-px bg-champagne mx-auto mb-8" />

          <p className="text-ivory/70 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10">
            Our <span className="text-champagne font-medium">{styleName}</span> collection is not available yet,
            but we&apos;re crafting something beautiful for you. Check back soon or explore our current pieces below.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-block px-8 py-4 bg-champagne text-charcoal text-xs tracking-widest uppercase font-semibold hover:bg-champagne/90 transition-all duration-300 shadow-md"
            >
              Browse All Pieces
            </Link>
            <Link
              href="/#explore-styles"
              className="inline-block px-8 py-4 border border-ivory/30 text-ivory text-xs tracking-widest uppercase font-semibold hover:border-champagne hover:text-champagne transition-all duration-300"
            >
              Explore Other Styles
            </Link>
          </div>
        </div>
      </div>

      {/* Popular Products Section */}
      {popularProducts.length > 0 && (
        <div className="container mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-champagne text-xs tracking-widest uppercase mb-3 font-medium">You Might Also Like</p>
            <h2 className="font-display text-3xl sm:text-4xl text-charcoal tracking-wide">
              Popular Pieces
            </h2>
            <div className="w-12 h-0.5 bg-champagne mx-auto mt-4" />
          </div>

          <ProductListWithQuickView products={popularProducts as any} columns={4} />


          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-block px-10 py-4 border border-charcoal text-charcoal text-xs tracking-widest uppercase font-semibold hover:bg-charcoal hover:text-ivory transition-all duration-300"
            >
              View All Products
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

// Generic Not Found Page (with popular products)
function NotFoundPage({ popularProducts }: { popularProducts: SimpleProduct[] }) {
  return (
    <div className="min-h-screen bg-ivory">
      <div className="container mx-auto px-6 py-28 sm:py-36 text-center">
        <div className="w-16 h-16 mx-auto mb-8 rounded-full bg-charcoal/5 flex items-center justify-center">
          <svg className="w-7 h-7 text-charcoal/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl text-charcoal tracking-wide mb-4">
          Product Not Found
        </h1>
        <div className="w-12 h-0.5 bg-champagne mx-auto mb-6" />
        <p className="text-charcoal/60 text-base max-w-md mx-auto mb-10 leading-relaxed">
          The piece you are looking for is unavailable or does not exist. It may have been removed or the link may be incorrect.
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-4 bg-charcoal text-ivory text-xs tracking-widest uppercase font-semibold hover:bg-charcoal/90 transition-colors shadow-md"
        >
          Back to Shop
        </Link>
      </div>

      {/* Popular Products */}
      {popularProducts.length > 0 && (
        <div className="container mx-auto px-6 pb-20">
          <div className="text-center mb-12">
            <p className="text-champagne text-xs tracking-widest uppercase mb-3 font-medium">You Might Also Like</p>
            <h2 className="font-display text-3xl text-charcoal tracking-wide">Popular Pieces</h2>
            <div className="w-12 h-0.5 bg-champagne mx-auto mt-4" />
          </div>

          <ProductListWithQuickView products={popularProducts as any} columns={4} />
        </div>
      )}
    </div>
  );
}

// Disable cache to always get latest sanity changes
export const dynamic = "force-dynamic";
export const revalidate = 0;
