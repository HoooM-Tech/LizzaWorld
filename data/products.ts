export type Product = {
  id: string;
  name: string;
  priceNaira: number;
  image: string;
  description: string;
  sizes: string[];
  instagramUrl?: string;
};

export const products: Product[] = [
  {
    id: "marvella-suit-dress",
    name: "Marvella Suit Dress",
    priceNaira: 205000,
    image: "/images/lizzaa/img-7.png",
    description:
      "A sculpted power-suit dress crafted for the woman who leads with grace. Precision tailoring, clean lines, and a silhouette that commands attention — sophistication redefined.",
    sizes: ["6", "8", "10", "12", "14", "16", "18", "20"],
    instagramUrl: "https://www.instagram.com/reel/DQHMyIvjPjd/?igsh=N3R2eXF3ajkyd3lw"
  },
  {
    id: "elysian-wrap-dress",
    name: "Elysian Wrap Dress",
    priceNaira: 185000,
    image: "/images/lizzaa/img-23.png",
    description: "A flowing wrap silhouette envisioned for intimate celebrations and powerful presence alike.",
    sizes: ["6", "8", "10", "12", "14", "16", "18", "20"]
  },
  {
    id: "noir-structure-blazer",
    name: "Noir Structure Blazer",
    priceNaira: 160000,
    image: "/images/lizzaa/img-25.png",
    description: "Architectural tailoring with softened edges — crafted for boardrooms and beyond.",
    sizes: ["6", "8", "10", "12", "14", "16", "18", "20"]
  },
  {
    id: "lumina-silk-set",
    name: "Lumina Silk Set",
    priceNaira: 148000,
    image: "/images/lizzaa/img-3.png",
    description: "A luminous co-ord set in champagne silk for effortless ceremony dressing.",
    sizes: ["6", "8", "10", "12", "14", "16", "18", "20"]
  }
];
