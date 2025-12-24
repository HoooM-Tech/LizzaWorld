import { Container } from "@/components/container";
import { terms } from "@/data/policies/terms";

export default function TermsPage() {
  return (
    <Container className="py-16 lg:py-24">
      <article className="whitespace-pre-wrap border border-charcoal/10 bg-white/80 p-8 text-sm leading-relaxed text-charcoal/80 ">
        {terms}
      </article>
    </Container>
  );
}
export const revalidate = 0;