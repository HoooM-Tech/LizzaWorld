import Image from "next/image";
import { Section } from "@/components/section";
import { ProcessSteps } from "@/components/process-steps";
import { Gallery } from "@/components/gallery";
import { Founder } from "@/components/founder";
import { CtaBanner } from "@/components/cta-banner";
import { Testimonial } from "@/components/testimonial";
import { sanityClient } from "@/sanity/lib/client";
import { bespokePageQuery, founderBioQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { Container } from "@/components/container";

export default async function BespokePage() {
  const [bespokeData, founderData] = await Promise.all([
    sanityClient.fetch(bespokePageQuery),
    sanityClient.fetch(founderBioQuery)
  ]);

  const processSteps = bespokeData?.processSteps?.map((step: any) => ({
    title: step?.title,
    description: step?.body
  }));

  const galleryImages = bespokeData?.galleryImages?.map((image: unknown) => urlFor(image).url());
  const testimonial = bespokeData?.testimonials?.[0];
  const testimonialContent = testimonial
    ? {
        quote: testimonial.quote,
        author: testimonial.clientName,
        role: testimonial.roleOrContext
      }
    : undefined;

  const founderPortrait = founderData?.portrait ? urlFor(founderData.portrait).url() : undefined;
  const founderBio = founderData?.shortBio ?? founderData?.fullBio;

  const introCopy =
    bespokeData?.introCopy ??
    "At Lizza Atelier, we create bespoke and bridal pieces that embody quiet luxury — defined by grace, refined craftsmanship, and the art of personal storytelling.";
  const ctaLabel = bespokeData?.ctaLabel ?? "Begin Your Journey";
  const ctaHref = bespokeData?.ctaHref ?? "/consultation";

  return (
    <Container className="py-16 lg:py-24">
      <div className="space-y-16">
        <header className="space-y-6">
          <h1 className="font-display text-4xl sm:text-5xl">Every Love Story Deserves a Masterpiece.</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-charcoal/70">{introCopy}</p>
        </header>

        {/* Coming Soon Section */}
        <Section>
          <div className="relative w-full max-w-4xl mx-auto">
            <div className="relative aspect-[3/4] md:aspect-[16/9] overflow-hidden bg-charcoal">
              <Image
                src="/bridal.jpg"
                alt="Lizza Atelier Bespoke Collection Coming Soon"
                fill
                className="object-cover grayscale opacity-60 rounded-none"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-charcoal/40">
                <p className="mt-14 md:mt-12 text-md uppercase tracking-[0.35em] text-champagne mb-4">
                  Launching Soon
                </p>
                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-ivory text-center px-6">
                  Coming Soon
                </h2>
                <p className="mt-6 text-lg text-ivory/80 text-center max-w-2xl px-6">
                  Our bespoke collection is being crafted with the utmost care and attention to detail. 
                  Book a consultation to be among the first to experience these exclusive pieces.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section>
          <ProcessSteps steps={processSteps} />
        </Section>
      
        {galleryImages && galleryImages.length > 0 && (
          <Section title="Gallery">
            <Gallery images={galleryImages} />
          </Section>
        )} 
      

        {testimonialContent && (
          <Section>
            <Testimonial quote={testimonialContent.quote} author={testimonialContent.author} role={testimonialContent.role} />
          </Section>
        )}

        <Section>
          <Founder
            name={founderData?.name}
            title={founderData?.title}
            shortBio={founderBio}
            portrait={founderPortrait}
          />
        </Section>

        <CtaBanner title={ctaLabel} ctaLabel={ctaLabel} href={ctaHref} />
      </div>
    </Container>
  );
}