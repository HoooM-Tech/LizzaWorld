import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { FeaturedGrid } from "@/components/featured-grid";
import { Testimonials } from "@/components/testimonials";
import { InstagramFeed } from "@/components/instagram-feed";
import { CtaBanner } from "@/components/cta-banner";
import { Container } from "@/components/container";
import { sanityClient } from "@/sanity/lib/client";
import { homePageQuery, siteSettingsQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { ProcessSteps } from "@/components/process-steps";
import WhyChooseUs from "@/components/why-choose-us";

export default async function HomePage() {
  
  const [homeData, siteSettings] = await Promise.all([
    sanityClient.fetch(homePageQuery),
    sanityClient.fetch(siteSettingsQuery)
  ]);
  
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
          <Section title="Why Choose Us">
            <WhyChooseUs />
          </Section>
          <CtaBanner title="Begin Your Journey" ctaLabel="Book a Consultation" href="/consultation" />
        </div>
      </Container>
    </>
  );
}