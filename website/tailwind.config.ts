import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2d5016",
          light: "#4a7c28",
          dark: "#1a3a1a",
        },
        accent: {
          DEFAULT: "#c8a84e",
          light: "#e0c878",
          dark: "#a88a30",
        },
        surface: {
          DEFAULT: "#ffffff",
          cream: "#f8f5ef",
          muted: "#f5f0e8",
        },
        text: {
          DEFAULT: "#1a1a1a",
          muted: "#888888",
          light: "#5a5a4a",
        },
        success: "var(--color-success)",
        warning: "var(--color-warning)",
        error: "var(--color-error)",
        info: "var(--color-info)",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 12px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
