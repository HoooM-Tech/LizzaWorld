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

// Helper function to verify payment
const verifyPaymentWithBackend = async (reference: string) => {
  console.log("🔍 Verifying consultation payment:", reference);
  
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference }),
    });

    const data = await response.json();
    console.log("🔍 Consultation verification response:", data);

    return data.status === true && data.data?.status === 'success';
  } catch (error) {
    console.error("❌ Consultation verification error:", error);
    return false;
  }
};

// Helper function to send confirmation email
const sendConfirmationEmail = async (emailData: any) => {
  try {
    console.log("📧 Sending consultation confirmation email...");
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'consultation',
        data: emailData,
      }),
    });
    console.log("📧 Consultation email sent successfully");
  } catch (error) {
    console.error('❌ Failed to send consultation email:', error);
  }
};

export function ConsultationForm({ selectedOption }: ConsultationFormProps) {
  if (!selectedOption) {
    return null;
  }

  const [formState, setFormState] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [paymentReference, setPaymentReference] = useState("");
  const { initiatePayment, isLoading } = usePaystackPayment();

  const handleSubmit = async () => {
    console.log("🔵 Consultation form submit clicked");

    // Validate required fields
    if (!formState.fullName || !formState.email || !formState.phone || 
        !formState.preferredDate || !formState.preferredTime || !formState.category) {
      alert("Please fill in all required fields");
      return;
    }

    const consultationType = selectedOption === "online" ? "Online Consultation" : "On-Site Consultation";
    const consultationPrice = consultationPrices[selectedOption] || 0;

    const reference = `CONSULT-${Date.now()}`;
    console.log("🔵 Generated consultation reference:", reference);

    const consultationData = {
      ...formState,
      consultationType,
      consultationPrice,
      submittedAt: new Date().toISOString()
    };

    console.log("🔵 Consultation data:", consultationData);
    
    // Prepare payment data
    const paymentData = {
      email: formState.email,
      amount: consultationPrice * 100, // Convert to kobo
      reference,
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

    console.log("🔵 Initiating consultation payment:", paymentData);

    let callbackFired = false;

    initiatePayment(paymentData, {
      onSuccess: async (ref) => {
        console.log("✅ Consultation payment callback triggered!");
        console.log("✅ Reference received:", ref);
        
        callbackFired = true;
        
        try {
          // Verify payment with backend
          console.log("✅ Verifying consultation payment...");
          const isVerified = await verifyPaymentWithBackend(ref);
          
          if (isVerified) {
            console.log("✅ Consultation payment verified!");
            
            // Send confirmation email
            await sendConfirmationEmail({
              email: formState.email,
              fullName: formState.fullName,
              consultationType,
              preferredDate: formState.preferredDate,
              preferredTime: formState.preferredTime,
              category: formState.category,
              reference: ref,
              amount: consultationPrice,
            });
            
            // Update state
            setPaymentReference(ref);
            setSubmitted(true);
            setFormState(initialState);
            
            console.log("✅ Consultation success flow completed!");
          } else {
            console.error("❌ Consultation payment verification failed");
            alert("Payment verification failed. Please contact support with reference: " + ref);
          }
        } catch (error) {
          console.error("❌ Error in consultation success handler:", error);
          alert("An error occurred. Please contact support with reference: " + ref);
        }
      },
      
      onClose: async () => {
        console.log("⚠️ Consultation payment popup closed");
        
        // If callback didn't fire, verify manually after a short delay
        if (!callbackFired) {
          console.log("⚠️ Callback did not fire, attempting manual verification...");
          
          // Wait 2 seconds for payment to process
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          console.log("🔍 Checking consultation payment status for reference:", reference);
          const isVerified = await verifyPaymentWithBackend(reference);
          
          if (isVerified) {
            console.log("✅ Consultation payment verified via fallback!");
            
            // Send confirmation email
            await sendConfirmationEmail({
              email: formState.email,
              fullName: formState.fullName,
              consultationType,
              preferredDate: formState.preferredDate,
              preferredTime: formState.preferredTime,
              category: formState.category,
              reference,
              amount: consultationPrice,
            });
            
            // Update state
            setPaymentReference(reference);
            setSubmitted(true);
            setFormState(initialState);
          } else {
            console.log("⚠️ Consultation payment not verified - user may have cancelled");
          }
        }
      }
    });
  };

  if (submitted) {
    return (
      <div className="bg-champagne/10 border border-champagne/30 p-8 rounded-sm text-center space-y-4">
        <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-champagne" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-2xl text-charcoal">
          Payment Successful!
        </h3>
        <p className="text-charcoal/70">
          Your consultation has been confirmed. We've sent a confirmation email with all the details. We will contact you within two business days to finalize arrangements.
        </p>
        {paymentReference && (
          <p className="text-sm text-charcoal/60 mt-2">
            Reference: {paymentReference}
          </p>
        )}
        <Button
          onClick={() => {
            setSubmitted(false);
            setFormState(initialState);
            setPaymentReference("");
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
          title="select value"
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
        <Button onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Processing..." : "Submit & Pay Now"}
        </Button>
      </div>
      <p className="text-xs text-charcoal/60">
        By submitting this form, you agree to our consultation booking terms. Payment is required to confirm your appointment.
      </p>
    </div>
  );
}