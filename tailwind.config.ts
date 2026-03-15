import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        codex: {
          bg: "#0a0a0b",
          surface: "#121214",
          border: "#1f1f23",
          muted: "#71717a",
          accent: "#10b981",
          "accent-dim": "rgba(16, 185, 129, 0.15)",
          "accent-glow": "rgba(16, 185, 129, 0.25)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(16, 185, 129, 0.12)",
        "glow-strong": "0 0 60px rgba(16, 185, 129, 0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
