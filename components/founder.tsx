import Image from "next/image";

interface FounderProps {
  name?: string;
  title?: string;
  shortBio?: string;
  portrait?: string;
}

export function Founder({ name, title, shortBio, portrait }: FounderProps) {
  const displayName = name ?? "Elizabeth Akinola";
  const displayTitle = title ?? "Founder & Creative Director";
  const displayBio =
    shortBio ??
    "Elizabeth (Lizza) Akinola is the Founder and Creative Director of Lizzaworld Atelier, a contemporary fashion house built on refined craftsmanship and purposeful elegance. A graduate of Special Education and Educational Psychology, Lizza began her career as a Sign Language Teacher — an experience that deepened her appreciation for communication, expression, and connection. Today, she channels those values into design, creating pieces that embody strength, grace, and authenticity. Each creation reflects her belief that true elegance is born from intention.";
  const imageSrc = portrait ?? "/images/gallery/img-3.jpg";

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div className="space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl">Meet the Founder</h2>
        <div className="space-y-2 text-lg leading-relaxed text-charcoal/70">
          <p className="font-display text-xl text-charcoal">{displayName}</p>
          <p className="text-sm uppercase tracking-[0.2em] text-charcoal/60">{displayTitle}</p>
          <p>{displayBio}</p>
        </div>
      </div>
      <div className="relative h-[420px] overflow-hidden rounded-2xl shadow-soft">
        <Image
          src={imageSrc}
          alt="Elizabeth Akinola portrait"
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          unoptimized
          className="object-cover"
        />
      </div>
    </div>
  );
}
