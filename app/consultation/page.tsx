// app/consultation/page.tsx
import ConsultationClient from "@/components/consultation-client";

export const revalidate = 60;

export default function ConsultationPage() {
  
  return <ConsultationClient />;
}