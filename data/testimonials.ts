export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
};

export const testimonials: Testimonial[] = [
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
