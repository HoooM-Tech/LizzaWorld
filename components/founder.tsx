import Image from "next/image";

export function Founder() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
      <div className="space-y-6">
        <h2 className="font-display text-3xl sm:text-4xl">Meet the Founder</h2>
        <p className="text-lg leading-relaxed text-charcoal/70">
          Elizabeth (Lizza) Akinola is the Founder and Creative Director of Lizzaworld Atelier, a contemporary fashion house built on refined craftsmanship and purposeful elegance. A graduate of Special Education and Educational Psychology, Lizza began her career as a Sign Language Teacher — an experience that deepened her appreciation for communication, expression, and connection. Today, she channels those values into design, creating pieces that embody strength, grace, and authenticity. Each creation reflects her belief that true elegance is born from intention.
        </p>
      </div>
      <div className="relative h-[420px] overflow-hidden rounded-2xl shadow-soft">
        <Image src="/images/gallery/img-3.jpg" alt="Elizabeth Akinola portrait" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
      </div>
    </div>
  );
}
