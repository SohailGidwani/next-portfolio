import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

const config = {
  darkMode: ["class"],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "18px",
        sm: "24px",
        lg: "36px",
      },
      screens: {
        lg: "1080px",
      },
    },
    extend: {
      screens: {
        xs: "600px",
      },
      maxWidth: {
        content: "var(--w)",
      },
      fontFamily: {
        fd: ["var(--fd)", "system-ui", "sans-serif"],
        fb: ["var(--fb)", "system-ui", "sans-serif"],
        fm: ["var(--fm)", "ui-monospace", "monospace"],
        display: ["var(--fd)", "system-ui", "sans-serif"],
        body: ["var(--fb)", "system-ui", "sans-serif"],
        mono: ["var(--fm)", "ui-monospace", "monospace"],
      },
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
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
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--card2)",
          foreground: "var(--muted)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        card2: "var(--card2)",
      },
      boxShadow: {
        card: "0 20px 60px -50px rgba(0,0,0,0.4)",
        "card-hover": "0 28px 80px -40px rgba(0,0,0,0.5)",
      },
      borderRadius: {
        DEFAULT: "var(--radius-btn)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-md)",
        pill: "var(--radius-pill)",
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-slow": "float 12s ease-in-out infinite",
        "float-slower": "float 18s ease-in-out infinite",
        "pulse-soft": "pulse-soft 6s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
        marquee: "marquee 48s linear infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config

export default config
