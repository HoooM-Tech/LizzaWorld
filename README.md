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

## Deployment guide (no-code friendly)
If you prefer to manage releases from GitHub without touching a terminal, follow this checklist:

1. **Review the latest code** — Navigate to the `main` branch on GitHub and confirm the files you expect (especially `package.json` and `package-lock.json`) already include your desired updates.
2. **Edit inline when needed** — Use GitHub’s pencil icon to tweak copy or data files (for example, `data/products.ts` to change pricing or `data/gallery.ts` to point to new images). GitHub automatically creates a branch for you.
3. **Describe the change** — When saving edits, provide a short summary (e.g., “Update consultation copy”) so the history stays readable.
4. **Open a pull request** — Click the banner that appears after your edits to open a PR into `main`. This triggers Vercel’s preview deployment so you can verify the site visually.
5. **Check Vercel status** — Wait for the “Vercel” check to turn green in the PR. If it fails, expand the log to see whether the issue is content-related or due to an npm install problem.
6. **Merge to deploy** — Once the preview looks good and checks pass, click “Merge pull request.” Vercel automatically redeploys production from the updated `main` branch.

Tip: if Vercel ever reports an npm install error, open `package.json` in GitHub, ensure all dependencies use valid versions (no placeholders like `0.0.0`), and rerun the steps above. No local tooling is required.
