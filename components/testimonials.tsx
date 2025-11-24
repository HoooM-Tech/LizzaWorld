import { Testimonial } from "@/components/testimonial";

type TestimonialItem = {
  quote: string;
  author: string;
  role?: string;
};

const fallbackTestimonials: TestimonialItem[] = [
  {
    quote: "From our first consultation to the final fitting, every detail felt personal and intentional.",
    author: "Sarah O."
  },
  {
    quote: "My gown told my story in every stitch. Lizza Atelier understood exactly who I am.",
    author: "Jochebed",
    role: "Bride"
  }
];

export function Testimonials({ items }: { items?: TestimonialItem[] }) {
  const testimonials = items?.length ? items : fallbackTestimonials;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {testimonials.map((testimonial) => (
        <Testimonial key={testimonial.author} {...testimonial} />
      ))}
    </div>
  );
}
