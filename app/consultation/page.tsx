import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Section } from "@/components/section";
import { ConsultationForm } from "@/components/consultation-form";

const categoryDetails = {
  Bridal: [
    "White Wedding",
    "Traditional Wedding Dress",
    "Registry Wear",
    "Bridal Shower",
    "Bridesmaids"
  ],
  Corporate: ["Custom Suit"],
  "Ready to Wear": [],
  Asoebi: [],
  "Custom Outfits": ["Awards", "Dinners", "Event Hosts", "etc."],
  Other: ["If not listed, please specify."]
};

export default function ConsultationPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-6">
        <h1 className="font-display text-4xl sm:text-5xl">Book a Consultation</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-charcoal/70">
          Share your vision, preferred timeline, and the moments you are preparing for. Our team will respond within two business days.
        </p>
      </header>
      <Section title="Categories">
        <Accordion>
          {Object.entries(categoryDetails).map(([category, items]) => (
            <AccordionItem key={category}>
              <AccordionTrigger>{category}</AccordionTrigger>
              <AccordionContent>
                {items.length > 0 ? (
                  <ul className="list-disc space-y-2 pl-5">
                    {items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-charcoal/70">Made-to-measure looks from our ready-to-wear line.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Section>
      <Section title="Consultation">
        <ConsultationForm />
      </Section>
    </div>
  );
}
