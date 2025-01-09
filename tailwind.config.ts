import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        terciary: {
          DEFAULT: "var(--terciary)",
          foreground: "var(--terciary-foreground)",
        },
        content: {
          background: "var(--content-background)",
          foreground: "var(--content-foreground)",
        },
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        "roboto-mono": ["Roboto Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
