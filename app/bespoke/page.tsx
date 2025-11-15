import { Section } from "@/components/section";
import { ProcessSteps } from "@/components/process-steps";
import { Gallery } from "@/components/gallery";
import { Founder } from "@/components/founder";
import { CtaBanner } from "@/components/cta-banner";
import { Testimonial } from "@/components/testimonial";

export default function BespokePage() {
  return (
    <div className="space-y-16">
      <header className="space-y-6">
        <h1 className="font-display text-4xl sm:text-5xl">Every Love Story Deserves a Masterpiece.</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-charcoal/70">
          At Lizza Atelier, we create bespoke and bridal pieces that embody quiet luxury — defined by grace, refined craftsmanship, and the art of personal storytelling.
        </p>
      </header>
      <Section>
        <ProcessSteps />
      </Section>
      <Section title="Gallery">
        <Gallery />
      </Section>
      <Section>
        <Testimonial
          quote="From our first meeting to the final fitting, Lizzaworld made me feel seen and beautiful. My gown told my story in every stitch."
          author="Jochebed"
          role="Bride"
        />
      </Section>
      <Section>
        <Founder />
      </Section>
      <CtaBanner title="Begin Your Journey" ctaLabel="Book a Consultation" href="/consultation" />
    </div>
  );
}
