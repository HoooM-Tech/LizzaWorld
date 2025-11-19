import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        champagne: "#F7E7CE",
        charcoal: "#1B1B1B",
        ivory: "#FFFFF0"
      },
      fontFamily: {
        display: ["var(--font-heading)"],
        body: ["var(--font-body)"]
      },
      boxShadow: {
        soft: "0 20px 40px -20px rgba(27, 27, 27, 0.25)"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      }
    }
  },
  plugins: []
};

export default config;
