import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,md,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,md,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,md,jsx,tsx,mdx}",
    "./node_modules/@itsrakesh/ui/dist/**/*.{mjs,mts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        "pattern-light": "url('/images/pattern-light.webp')",
        "pattern-dark": "url('/images/pattern-dark.webp')",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        code: {
          DEFAULT: "hsl(var(--code))",
          foreground: "hsl(var(--code-foreground))",
        },
        pexels: {
          DEFAULT: "#05A081",
          foreground: "#FFFFFF",
        },
        unsplash: {
          DEFAULT: "#111111",
          foreground: "#FFFFFF",
        },
        imagekit: {
          DEFAULT: "#0450D2",
          foreground: "#FFFFFF",
        },
        cloudinary: {
          DEFAULT: "#3348C5",
          foreground: "#FFFFFF",
        },
        pdf: {
          DEFAULT: "#FF0000",
          foreground: "#FFFFFF",
        },
        csv: {
          DEFAULT: "#33A852",
          foreground: "#FFFFFF",
        },
        txt: {
          DEFAULT: "#0052CC",
          foreground: "#FFFFFF",
        },
        markdown: {
          DEFAULT: "#333333",
          foreground: "#FFFFFF",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shake: "shake 0.82s cubic-bezier(.36,.07,.19,.97)",
        "slide-left": "slide-left 0.2s ease-out",
        "slide-right": "slide-right 0.2s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        ring: "ring 5s .7s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
