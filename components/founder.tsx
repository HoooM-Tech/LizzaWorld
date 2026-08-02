import Image from "next/image";

interface FounderProps {
  name?: string;
  title?: string;
  shortBio?: string;
  portrait?: string;
}

export function Founder({ name, title, shortBio, portrait }: FounderProps) {
  const displayName = name ?? "Lizza Zoe";
  const displayTitle = title ?? "Founder & Creative Director, Lizzaatelier";
  const displayBio =
    shortBio ??
    `Lizza Zoe is a fashion entrepreneur, educator, stylist, and creative visionary whose work sits at the intersection of elegance, purpose, and transformation.

Born and raised in Ibadan, Nigeria, Lizza’s journey into fashion began at the age of fourteen, long before she formally established Lizzaatelier. What started as a passion for design evolved into a mission to create timeless pieces that empower women to show up confidently in leadership, business, government, and influential spaces.

With an academic foundation in Special Education, specializing in Communication and Behavioral Disorders, Lizza’s professional background extends far beyond fashion. Her work with individuals living with autism, ADHD, cerebral palsy, Down syndrome, and other developmental conditions shaped her understanding of human behavior, confidence, identity, and self-expression, insights that continue to influence her design philosophy today.

Driven by a passion for continuous learning and excellence, she further expanded her expertise through studies in Business Administration, Executive Management, Human Resource Management, Fashion Business, and Fashion Psychology, bringing a rare multidisciplinary perspective to both fashion and entrepreneurship.

Over the years, Lizza has built a diverse career spanning fashion, education, leadership, and business operations. She has worked with notable fashion brands within Nigeria’s fashion industry and contributed to creative projects associated with Lagos Fashion Week, gaining valuable experience in design development, brand collaboration, and the business of fashion. Her experience within the corporate sector has further strengthened her leadership, organizational, and strategic capabilities as a founder.

As a stylist, mentor, and fashion educator, Lizza has trained and empowered over 100 aspiring fashion professionals, helping shape the next generation of creatives. Through Lizzaatelier, she has designed for and served women across Nigeria and internationally, with clients in the United States, United Kingdom, Australia, France, and beyond.

Beyond fashion, Lizza is deeply committed to personal development, leadership, and faith-driven impact. Through her platform, Dear Me by Lizza, she encourages individuals to embrace growth, purpose, and the journey of becoming. Her work reflects a belief that true transformation begins from within and is expressed outwardly through confidence, excellence, and authenticity.

Today, as Founder and Creative Director of Lizzaatelier, Lizza continues to champion a new vision of African luxury, one rooted in intentional design, refined craftsmanship, cultural richness, and timeless elegance. Her mission is to create pieces that do more than dress women; they empower them to take up space, lead boldly, and leave a lasting impression wherever they go.

For Lizza, fashion is more than clothing, it is a language of identity, influence, and possibility.`;
  const imageSrc = portrait ?? "/images/gallery/founder.jpg";

  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div className="space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl">Meet the Founder</h2>
        <div className="space-y-4 text-base leading-relaxed text-charcoal/70">
          <p className="font-display text-xl text-charcoal">{displayName}</p>
          <p className="text-sm uppercase tracking-[0.2em] text-charcoal/60">{displayTitle}</p>
          <div className="space-y-4">
            {displayBio.split("\n\n").map((para, idx) => (
              <p key={idx}>{para.trim()}</p>
            ))}
          </div>
        </div>
      </div>
      <div className="relative h-[500px] sm:h-[550px] md:h-[1024px] lg:h-[650px] overflow-hidden">
        <Image
          src={imageSrc}
          alt={`${displayName} portrait`}
          fill
          sizes="(min-width: 1024px) 40vw, 100vw"
          className="object-cover object-center rounded-none"
        />
      </div>
    </div>
  );
}