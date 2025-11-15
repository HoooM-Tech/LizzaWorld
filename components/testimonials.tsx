import { Testimonial } from "@/components/testimonial";
import { testimonials } from "@/data/testimonials";

export function Testimonials() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {testimonials.map((testimonial) => (
        <Testimonial key={testimonial.author} {...testimonial} />
      ))}
    </div>
  );
}
