import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { FeaturedGrid } from "@/components/featured-grid";
import { Testimonials } from "@/components/testimonials";
import { InstagramFeed } from "@/components/instagram-feed";
import { CtaBanner } from "@/components/cta-banner";

export default function HomePage() {
  return (
    <div className="space-y-20">
      <Hero />
      <Section title="About the Atelier">
        <p className="max-w-3xl text-lg leading-relaxed text-charcoal/70">
          Lizza Atelier is a refined womenswear brand redefining elegance through purpose and craftsmanship. We create timeless pieces for women in leadership, business, and influence — those who embody grace, power, and authenticity. Every design is thoughtfully tailored to celebrate femininity, confidence, and becoming — where style meets meaning, and every detail tells a story.
        </p>
      </Section>
      <Section>
        <FeaturedGrid />
      </Section>
      <Section title="Testimonials">
        <Testimonials />
      </Section>
      <Section>
        <InstagramFeed handle="@lizza.atelier" />
      </Section>
      <CtaBanner title="Begin Your Journey" ctaLabel="Book a Consultation" href="/consultation" />
    </div>
  );
}
