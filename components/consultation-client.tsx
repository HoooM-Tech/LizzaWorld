// components/consultation-client.tsx
"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Section } from "@/components/section";
import { ConsultationForm } from "@/components/consultation-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Video, MapPin } from "lucide-react";
import { Container } from "@/components/container";

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

const consultationOptions = [
  {
    id: "online",
    title: "Online Consultation",
    duration: "45 minutes",
    price: 25000,
    icon: Video,
    features: [
      "Video call consultation",
      "Digital mood board review",
      "Measurements guide provided",
      "Follow-up summary email"
    ]
  },
  {
    id: "onsite",
    title: "On-Site Consultation",
    duration: "1 hour",
    price: 50000,
    icon: MapPin,
    features: [
      "In-person atelier visit",
      "Fabric viewing & selection",
      "Professional measurements",
      "Complimentary refreshments"
    ]
  }
];

const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0
});

export default function ConsultationClient() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
    setShowForm(true);
  };

  return (
    <Container className="py-16 lg:py-24">
      <div className="space-y-16">
        <header className="space-y-6">
          <h1 className="font-display text-4xl sm:text-5xl">Book a Consultation</h1>
          <p className="max-w-3xl text-lg leading-relaxed text-charcoal/70">
            Share your vision, preferred timeline, and the moments you are preparing for. Our team will respond within two business days.
          </p>
        </header>

        {/* Consultation Booking & Payment */}
        <Section title="Consultation Booking & Payment">
          <div className="space-y-8">
            <p className="text-charcoal/70 max-w-3xl">
              Choose your preferred consultation format. After selecting an option and completing the booking form, you'll proceed to secure payment and receive confirmation.
            </p>

            <div className="grid gap-6 sm:grid-cols-2">
              {consultationOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = selectedOption === option.id;

                return (
                  <Card
                    key={option.id}
                    className={`relative overflow-hidden transition-all duration-300 ${
                      isSelected
                        ? "border-champagne border-2 shadow-lg"
                        : "border-charcoal/10 hover:border-charcoal/20"
                    }`}
                  >
                    <CardContent className="p-8">
                      <div className="mb-6">
                        <div className="inline-flex h-12 w-12 items-center justify-center bg-champagne/10 mb-4">
                          <Icon className="h-6 w-6 text-champagne" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-display text-2xl text-charcoal mb-2">
                          {option.title}
                        </h3>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-3xl font-light text-charcoal">
                            {formatter.format(option.price)}
                          </span>
                          <span className="text-sm text-charcoal/60">
                            {option.duration}
                          </span>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-6">
                        {option.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm text-charcoal/70">
                            <Check className="h-5 w-5 text-champagne flex-shrink-0 mt-0.5" strokeWidth={2} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        className="w-full border-charcoal/20 text-charcoal"
                        variant={isSelected ? "primary" : "outline"}
                        onClick={() => handleSelectOption(option.id)}
                      >
                        {isSelected ? "Selected" : "Choose This Option"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </Section>

        <Section title="Categories">
          <Accordion {...({ type: "single", collapsible: "true" } as any)} className="w-full">
            {Object.entries(categoryDetails).map(([category, items]) => (
              <AccordionItem key={category}>
                <AccordionTrigger>
                  <span className="font-display text-lg">{category}</span>
                </AccordionTrigger>
                <AccordionContent>
                  {items.length > 0 ? (
                    <ul className="list-disc space-y-2 pl-5 text-charcoal/70">
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

        {showForm && (
          <Section title="Consultation Details">
            <div className="bg-champagne/5 border border-champagne/20 p-6 rounded-sm mb-6">
              <p className="text-sm text-charcoal/80">
                <strong>Selected:</strong>{" "}
                {consultationOptions.find((opt) => opt.id === selectedOption)?.title} -{" "}
                {formatter.format(
                  consultationOptions.find((opt) => opt.id === selectedOption)?.price || 0
                )}
              </p>
            </div>
            <ConsultationForm selectedOption={selectedOption} />
          </Section>
        )}
      </div>
    </Container>
  );
}