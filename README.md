# Lizza Atelier — The Art of Becoming

A production-ready Next.js 14 (App Router) experience for Lizza Atelier, a luxury fashion brand blending bespoke couture and ready-to-wear. The project embraces an editorial, minimal aesthetic with Tailwind CSS, shadcn-inspired UI components, and carefully curated brand storytelling.

## Tech Stack
- [Next.js 14](https://nextjs.org/) with the App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) with custom brand tokens
- [shadcn/ui](https://ui.shadcn.com/) inspired Button, Input, Textarea, Accordion, Card, and Select components
- [lucide-react](https://lucide.dev/) iconography
- [framer-motion](https://www.framer.com/motion/) for subtle section reveals

## Getting Started
Install dependencies and launch the development server:

```bash
npm install
npm run dev
```

Then visit [http://localhost:3000](http://localhost:3000) to explore the experience.

## Available Routes
- `/` — Home, featuring the hero, atelier story, testimonials, and social touchpoints
- `/shop` — Ready-to-wear Eminence Collection with product grid and lifestyle visuals
- `/bespoke` — Bespoke & Bridal storytelling, gallery, and founder narrative
- `/consultation` — Consultation categories and booking form
- `/legal/terms` — Terms of Service
- `/legal/privacy` — Privacy Policy

## Brand System
- **Colors:** Champagne `#F7E7CE`, Charcoal `#1B1B1B`, Ivory `#FFFFF0`
- **Typography:** Playfair Display for headings, Lato for body copy via `next/font`
- **Components:** Rounded 2xl surfaces, soft drop shadows, and immersive imagery

## Future Enhancements
- Integrate a headless CMS for product, gallery, and testimonial management
- Replace placeholder imagery with final brand photography
- Connect the consultation form to an email or CRM workflow
- Implement a full cart and checkout experience
