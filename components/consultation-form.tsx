"use client";

import { FormEvent, useState } from "react";
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

export function ConsultationForm() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Consultation form submitted", formState); // TODO: integrate email service
    setSubmitted(true);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          type="date"
          name="preferredDate"
          value={formState.preferredDate}
          onChange={(event) => setFormState((prev) => ({ ...prev, preferredDate: event.target.value }))}
        />
        <Input
          type="time"
          name="preferredTime"
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
        value={formState.notes}
        onChange={(event) => setFormState((prev) => ({ ...prev, notes: event.target.value }))}
      />
      <div className="flex items-center gap-4">
        <Button type="submit">Submit Consultation</Button>
        {submitted && <p className="text-sm text-charcoal/60">Thank you — we will reach out shortly.</p>}
      </div>
    </form>
  );
}
