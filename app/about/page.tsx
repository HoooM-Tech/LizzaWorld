import { Section } from "@/components/section";
import { Founder } from "@/components/founder";
import { sanityFetch, getTagsForType } from "@/sanity/lib/client";
import { founderBioQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { Container } from "@/components/container";
import { CtaBanner } from "@/components/cta-banner";

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AboutPage() {
  let founderData: any = null;

  try {
    founderData = await sanityFetch<any>({
      query: founderBioQuery,
      tags: getTagsForType('founderBio'),
      revalidate: 0,
    });
  } catch (error) {
    console.error("Error fetching founder data:", error);
  }

  const founderPortrait = founderData?.portrait ? urlFor(founderData.portrait).url() : undefined;
  const founderBio = founderData?.shortBio ?? founderData?.fullBio;

  return (
    <Container className="py-20 lg:py-28">
      <div className="space-y-16">
        <Section>
          <Founder
            name={founderData?.name}
            title={founderData?.title}
            shortBio={founderBio}
            portrait={founderPortrait}
          />
        </Section>
        <CtaBanner 
          title="Begin Your Journey" 
          ctaLabel="Book a Consultation" 
          href="/consultation" 
        />
      </div>
    </Container>
  );
}
