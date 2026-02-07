import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "civic-navy": "hsl(var(--civic-navy))",
        "civic-cream": "hsl(var(--civic-cream))",
        "civic-gold": "hsl(var(--civic-gold))",
        "civic-gold-light": "hsl(var(--civic-gold-light))",
        "civic-slate": "hsl(var(--civic-slate))",
        "civic-blue": "hsl(var(--civic-blue))",
        "civic-blue-light": "hsl(var(--civic-blue-light))",
        "civic-green": "hsl(var(--civic-green))",
        "civic-green-light": "hsl(var(--civic-green-light))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "ballot-enter": {
          from: { opacity: "0", transform: "translateY(var(--enter-from, 2rem))" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "wave": {
          "0%, 100%": { transform: "translateX(-5%) rotate(2deg)" },
          "50%": { transform: "translateX(5%) rotate(-2deg)" },
        },
        "blob-drift-1": {
          "0%": { transform: "translate(-20%, -10%)" },
          "33%": { transform: "translate(10%, -25%)" },
          "66%": { transform: "translate(-10%, 15%)" },
          "100%": { transform: "translate(-20%, -10%)" },
        },
        "blob-drift-2": {
          "0%": { transform: "translate(15%, 10%)" },
          "33%": { transform: "translate(-15%, 20%)" },
          "66%": { transform: "translate(20%, -15%)" },
          "100%": { transform: "translate(15%, 10%)" },
        },
        "blob-drift-3": {
          "0%": { transform: "translate(5%, -20%)" },
          "33%": { transform: "translate(-20%, 5%)" },
          "66%": { transform: "translate(15%, 10%)" },
          "100%": { transform: "translate(5%, -20%)" },
        },
        "blob-drift-4": {
          "0%": { transform: "translate(-15%, 15%)" },
          "33%": { transform: "translate(10%, -10%)" },
          "66%": { transform: "translate(-5%, -20%)" },
          "100%": { transform: "translate(-15%, 15%)" },
        },
        "blob-drift-5": {
          "0%": { transform: "translate(10%, 5%)" },
          "33%": { transform: "translate(-10%, -15%)" },
          "66%": { transform: "translate(5%, 20%)" },
          "100%": { transform: "translate(10%, 5%)" },
        },
        "pulse-opacity": {
          "0%, 100%": { opacity: "0.7" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "ballot-enter": "ballot-enter 0.4s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
