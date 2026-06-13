import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        midnight: {
          main: "#05070D",
          secondary: "#090D14",
          elevated: "#0F172A",
        },
        accent: {
          cyan: "#22D3EE",
          blue: "#3B82F6",
          violet: "#8B5CF6",
          emerald: "#10B981",
        },
      },
      fontFamily: {
        heading: ["var(--font-heading)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        glow: "0 24px 80px rgba(34, 211, 238, 0.12)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #22D3EE 0%, #3B82F6 45%, #8B5CF6 100%)",
        "glass-gradient": "linear-gradient(145deg, rgba(15, 23, 42, 0.88), rgba(2, 6, 23, 0.78))",
      },
    },
  },
  plugins: [],
};

export default config;
