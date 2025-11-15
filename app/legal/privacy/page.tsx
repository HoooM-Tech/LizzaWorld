import { privacy } from "@/data/policies/privacy";

export default function PrivacyPage() {
  return (
    <article className="whitespace-pre-wrap rounded-2xl border border-charcoal/10 bg-white/80 p-8 text-sm leading-relaxed text-charcoal/80 shadow-soft">
      {privacy}
    </article>
  );
}
