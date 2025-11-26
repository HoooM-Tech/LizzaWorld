import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { FeaturedGrid } from "@/components/featured-grid";
import { Testimonials } from "@/components/testimonials";
import { InstagramFeed } from "@/components/instagram-feed";
import { CtaBanner } from "@/components/cta-banner";
import { sanityClient } from "@/sanity/lib/client";
import { homePageQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export default async function HomePage() {
  const [homeData, siteSettings] = await Promise.all([
    sanityClient.fetch(homePageQuery),
    sanityClient.fetch(siteSettingsQuery)
  ]);

  // For video files, access the asset URL directly
  //const heroImage = homeData?.heroMedia ? urlFor(homeData.heroMedia).url() : undefined;
  

  
  // 1. Get the Video URL directly from the asset object
  // It will look like: "https://cdn.sanity.io/files/project/dataset/filename.mp4"
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
    <div className="space-y-20">
      <Hero
        video={heroVideoUrl} 
        headline={homeData?.heroHeadline}
        subtext={homeData?.heroSubtext}
        ctas={ctas}
      />
      <Section title="About the Atelier">
        <p className="max-w-3xl text-lg leading-relaxed text-charcoal/70">{brandIntro}</p>
      </Section>
      <Section>
        <FeaturedGrid images={featuredVisuals} />
      </Section>
      <Section title="Testimonials">
        <Testimonials items={testimonials} />
      </Section>
      {homeData?.showInstagramEmbed !== false && (
        <Section>
          <InstagramFeed handle={instagramHandle} />
        </Section>
      )}
      <CtaBanner title="Begin Your Journey" ctaLabel="Book a Consultation" href="/consultation" />
    </div>
  );
}