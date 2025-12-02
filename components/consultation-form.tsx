"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  category: string;
  notes: string;
};

const initialState: FormState = {
  fullName: "",
  email: "",
  phone: "",
  preferredDate: "",
  preferredTime: "",
  category: "",
  notes: ""
};

const categories = [
  "Bridal: White Wedding",
  "Bridal: Traditional Wedding Dress",
  "Bridal: Registry Wear",
  "Bridal: Bridal Shower",
  "Bridal: Bridesmaids",
  "Corporate: Custom Suit",
  "Ready to Wear",
  "Asoebi",
  "Custom Outfits: Awards, Dinners, Event Hosts, etc.",
  "Other"
];

interface ConsultationFormProps {
  selectedOption: string | null;
}

export function ConsultationForm({ selectedOption }: ConsultationFormProps) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validate required fields
    if (!formState.fullName || !formState.email || !formState.phone || 
        !formState.preferredDate || !formState.preferredTime || !formState.category) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    const consultationData = {
      ...formState,
      consultationType: selectedOption,
      submittedAt: new Date().toISOString()
    };

    console.log("Consultation form submitted", consultationData);
    
    // TODO: Integrate with email service and payment gateway
    // For now, simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSubmitted(true);
    setIsSubmitting(false);

    // TODO: Redirect to payment page or trigger payment modal
    // Example: router.push(`/payment?consultation=${selectedOption}&amount=${amount}`);
  };

  if (submitted) {
    return (
      <div className="bg-champagne/10 border border-champagne/30 p-8 text-center space-y-4">
        <h3 className="font-display text-2xl text-charcoal">
          Thank You!
        </h3>
        <p className="text-charcoal/70">
          Your consultation request has been received. We will contact you within two business days to confirm your appointment and provide payment instructions.
        </p>
        <Button
          onClick={() => {
            setSubmitted(false);
            setFormState(initialState);
          }}
          variant="outline"
        >
          Book Another Consultation
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          required
          name="fullName"
          placeholder="Full Name"
          value={formState.fullName}
          onChange={(event) => setFormState((prev) => ({ ...prev, fullName: event.target.value }))}
        />
        <Input
          required
          type="email"
          name="email"
          placeholder="Email"
          value={formState.email}
          onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
        />
        <Input
          required
          name="phone"
          placeholder="Phone / WhatsApp"
          value={formState.phone}
          onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
        />
        <Input
          required
          type="date"
          name="preferredDate"
          placeholder="Preferred Date"
          value={formState.preferredDate}
          onChange={(event) => setFormState((prev) => ({ ...prev, preferredDate: event.target.value }))}
          min={new Date().toISOString().split('T')[0]}
        />
        <Input
          required
          type="time"
          name="preferredTime"
          placeholder="Preferred Time"
          value={formState.preferredTime}
          onChange={(event) => setFormState((prev) => ({ ...prev, preferredTime: event.target.value }))}
        />
        <Select
          required
          name="category"
          value={formState.category}
          onChange={(event) => setFormState((prev) => ({ ...prev, category: event.target.value }))}
        >
          <option value="" disabled>
            Select Category
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>
      <Textarea
        name="notes"
        placeholder="Notes — share your vision, event, or inspirations"
        rows={4}
        value={formState.notes}
        onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
      />
      <div className="flex items-center gap-4">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit & Proceed to Payment"}
        </Button>
      </div>
      <p className="text-xs text-charcoal/60">
        By submitting this form, you agree to our consultation booking terms. Payment is required to confirm your appointment.
      </p>
    </div>
  );
}