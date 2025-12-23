import { Container } from "@/components/container";
import { privacy } from "@/data/policies/privacy";

export default function PrivacyPage() {
  return (
    <Container className="py-16 lg:py-24">
      <article className="whitespace-pre-wrap border border-charcoal/10 bg-white/80 p-8 text-sm leading-relaxed text-charcoal/80 ">
        {privacy}
      </article>
    </Container>
  );
}
export const revalidate = 60;