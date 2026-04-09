import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-public-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      colors: {
        "brand-neutral": {
          50: "#faf9f7",
          100: "#f5f2ed",
          200: "#ebe6db",
          300: "#ddd5c7",
          400: "#cec2ad",
          500: "#b8a789",
          600: "#9d8a6c",
          700: "#7d6d56",
          800: "#665947",
          900: "#534a3c",
        },
        "brand-accent": {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0e7490",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};

export default config;
