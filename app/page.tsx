import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { FeaturedGrid } from "@/components/featured-grid";
import { Testimonials } from "@/components/testimonials";
//import { InstagramFeed } from "@/components/instagram-feed";
import { CtaBanner } from "@/components/cta-banner";
import { Container } from "@/components/container";
import { sanityFetch, getTagsForType } from "@/sanity/lib/client";
import { homePageQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { ProcessSteps } from "@/components/process-steps";
import WhyChooseUs from "@/components/why-choose-us";
import { unstable_noStore as noStore } from 'next/cache';


export default async function HomePage() {
  // Force no-store to bypass all Next.js caches
  noStore();
  
  let homeData: any = null;
  let siteSettings: any = null;
  
  try {
    [homeData, siteSettings] = await Promise.all([
      sanityFetch<any>({
        query: homePageQuery,
        tags: getTagsForType('homePage'),
        revalidate: 0, // Always fetch fresh data
      }),
      sanityFetch<any>({
        query: siteSettingsQuery,
        tags: getTagsForType('siteSettings'),
        revalidate: 0, // Always fetch fresh data
      })
    ]);
    
    // Debug log to verify data is being fetched (works in production too)
    console.log('📊 Home Data fetched:', {
      timestamp: new Date().toISOString(),
      documentId: homeData?._id,
      lastUpdated: homeData?._updatedAt,
      hasHomeData: !!homeData,
      homeDataKeys: homeData ? Object.keys(homeData) : [],
      hasWhyChooseUs: !!homeData?.whyChooseUs,
      whyChooseUsValue: homeData?.whyChooseUs,
      whyChooseUsType: typeof homeData?.whyChooseUs,
      whyChooseUsTitle: homeData?.whyChooseUs?.title,
      reasonsCount: homeData?.whyChooseUs?.reasons?.length || 0,
      reasons: homeData?.whyChooseUs?.reasons?.map((r: any) => r?.title) || [],
      // Log full whyChooseUs object to see what we're getting
      whyChooseUsFull: JSON.stringify(homeData?.whyChooseUs || null, null, 2),
    });
  } catch (error) {
    console.error("Error fetching data from Sanity:", error);
    // Continue with null data - components will use fallbacks
  }
  
  const processSteps = homeData?.processSteps?.map((step: any) => ({
    title: step?.title,
    description: step?.body
  }));

  // Get the Video URL directly from the asset object
  const heroVideoUrl = homeData?.heroVideo?.asset?.url;

  const featuredVisuals = homeData?.featuredVisuals?.map((image: unknown) => urlFor(image).url());
  const testimonials = homeData?.testimonials?.map((testimonial: any) => ({
    quote: testimonial?.quote,
    author: testimonial?.clientName,
    role: testimonial?.roleOrContext
  }));
  const ctas = homeData?.ctas?.map((cta: any) => ({ label: cta?.label, href: cta?.href }));
  const brandIntro =
    homeData?.brandIntro ??
    "Lizza Atelier is a refined womenswear brand redefining elegance through purpose and craftsmanship. We create timeless pieces for women in leadership, business, and influence — those who embody grace, power, and authenticity. Every design is thoughtfully tailored to celebrate femininity, confidence, and becoming — where style meets meaning, and every detail tells a story.";
  const instagramHandle = siteSettings?.instagramHandle ?? "@lizza.atelier";

  return (
    <>
      {/* Hero - Full Width */}
      <Hero
        video={heroVideoUrl} 
        headline={homeData?.heroHeadline}
        subtext={homeData?.heroSubtext}
        ctas={ctas}
      />
      
      {/* Rest of content - With Container */}
      <Container>
        <div className="space-y-20 py-16 lg:py-24">
          <Section title="About the Atelier" className="flex justify-end text-end">
            <p className="max-w-3xl text-xl leading-relaxed text-charcoal/70">{brandIntro}</p>
          </Section>
          <CtaBanner title="Discover Timeless Pieces" ctaLabel="Visit Shop" href="/shop" />
          <Section>
            <FeaturedGrid images={featuredVisuals} />
          </Section>
          <Section title="Our Process">
            <ProcessSteps steps={processSteps} />
          </Section>
          <Section title="Testimonials">
            <Testimonials items={testimonials} />
          </Section>
          <WhyChooseUs 
            title={homeData?.whyChooseUs?.title || undefined}
            image={homeData?.whyChooseUs?.image || undefined}
            reasons={homeData?.whyChooseUs?.reasons && Array.isArray(homeData.whyChooseUs.reasons) && homeData.whyChooseUs.reasons.length > 0 
              ? homeData.whyChooseUs.reasons 
              : undefined}
          />
          <CtaBanner title="Begin Your Journey" ctaLabel="Book a Consultation" href="/consultation" />
        </div>
      </Container>
    </>
  );
}
  // Force dynamic rendering to always fetch fresh data
  export const dynamic = 'force-dynamic';
  export const revalidate = 0;