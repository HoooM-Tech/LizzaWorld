"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { usePaystackPayment } from "@/hooks/use-paystack";

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

// Restructure the data into a grouped object
const groupedCategories = {
  Bridal: [
    "White Wedding",
    "Traditional Wedding Dress",
    "Registry Wear",
    "Bridal Shower",
    "Bridesmaids",
  ],
  Corporate: ["Custom Suit"],
  Other: [
    "Ready to Wear",
    "Asoebi",
    "Custom Outfits: Awards, Dinners, Event Hosts, etc.",
    "Other",
  ],
};

const consultationPrices: Record<string, number> = {
  online: 25000,
  onsite: 50000
};

interface ConsultationFormProps {
  selectedOption: string | null;
}

export function ConsultationForm({ selectedOption }: ConsultationFormProps) {
  if (!selectedOption) {
    return null;
  }

  const [formState, setFormState] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { initiatePayment, isLoading } = usePaystackPayment();

  const handleSubmit = async () => {
    // Validate required fields
    if (!formState.fullName || !formState.email || !formState.phone || 
        !formState.preferredDate || !formState.preferredTime || !formState.category) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    const consultationType = selectedOption === "online" ? "Online Consultation" : "On-Site Consultation";
    const consultationPrice = consultationPrices[selectedOption] || 0;

    const consultationData = {
      ...formState,
      consultationType,
      consultationPrice,
      submittedAt: new Date().toISOString()
    };

    console.log("Consultation form submitted", consultationData);
    
    // Initiate Paystack payment
    const paymentData = {
      email: formState.email,
      amount: consultationPrice * 100, // Convert to kobo
      reference: `CONSULT-${Date.now()}`,
      metadata: {
        fullName: formState.fullName,
        phone: formState.phone,
        preferredDate: formState.preferredDate,
        preferredTime: formState.preferredTime,
        category: formState.category,
        notes: formState.notes,
        consultationType,
        payment_type: "consultation"
      }
    };

    initiatePayment(paymentData, {
      onSuccess: async (reference) => {
        console.log("Payment successful:", reference);
        
        // Send confirmation email
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'consultation',
              data: {
                email: formState.email,
                fullName: formState.fullName,
                consultationType,
                preferredDate: formState.preferredDate,
                preferredTime: formState.preferredTime,
                category: formState.category,
                reference,
                amount: consultationPrice,
              },
            }),
          });
        } catch (error) {
          console.error('Failed to send email:', error);
        }
        
        // Clear form and show success
        setFormState(initialState);
        setSubmitted(true);
        setIsSubmitting(false);
      },
      onClose: () => {
        console.log("Payment popup closed");
        // Reset submitting state when popup is closed (whether successful or cancelled)
        setIsSubmitting(false);
      }
    });
  };

  if (submitted) {
    return (
      <div className="bg-champagne/10 border border-champagne/30 p-8 rounded-sm text-center space-y-4">
        <h3 className="font-display text-2xl text-charcoal">
          Payment Successful!
        </h3>
        <p className="text-charcoal/70">
          Your consultation has been confirmed. We've sent a confirmation email with all the details. We will contact you within two business days to finalize arrangements.
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
        <select
          required
          name="category"
          value={formState.category}
          onChange={(event) =>
            setFormState((prev) => ({ ...prev, category: event.target.value }))
          }
          className="flex h-12 w-full border border-charcoal/15 bg-white/70 px-4 text-sm text-charcoal placeholder:text-charcoal/50 backdrop-blur transition focus:border-charcoal/30 focus:bg-white focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="" disabled>
            Select Category
          </option>
          {Object.entries(groupedCategories).map(([groupName, items]) => (
            <optgroup label={groupName} key={groupName}>
              {items.map((item) => (
                <option key={item} value={`${groupName}: ${item}`}>
                  {item}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <Textarea
        name="notes"
        placeholder="Notes — share your vision, event, or inspirations"
        rows={4}
        value={formState.notes}
        onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
      />
      <div className="flex items-center gap-4">
        <Button onClick={handleSubmit} disabled={isSubmitting || isLoading}>
          {isSubmitting || isLoading ? "Processing..." : "Submit & Pay Now"}
        </Button>
      </div>
      <p className="text-xs text-charcoal/60">
        By submitting this form, you agree to our consultation booking terms. Payment is required to confirm your appointment.
      </p>
    </div>
  );
}