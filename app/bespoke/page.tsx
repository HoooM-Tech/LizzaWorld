import { Section } from "@/components/section";
import { ProcessSteps } from "@/components/process-steps";
import { Gallery } from "@/components/gallery";
import { Founder } from "@/components/founder";
import { CtaBanner } from "@/components/cta-banner";
import { Testimonial } from "@/components/testimonial";
import { sanityClient } from "@/sanity/lib/client";
import { bespokePageQuery, founderBioQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

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
    <div className="space-y-16">
      <header className="space-y-6">
        <h1 className="font-display text-4xl sm:text-5xl">Every Love Story Deserves a Masterpiece.</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-charcoal/70">{introCopy}</p>
      </header>
      <Section>
        <ProcessSteps steps={processSteps} />
      </Section>
      <Section title="Gallery">
        <Gallery images={galleryImages} />
      </Section>
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
  );
}
