import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

/**
 * Theme colors live in CSS variables (globals.css), which Tailwind can't
 * inject an opacity into directly — without this, alpha modifiers like
 * `bg-card/80` or `border-accent/40` are silently dropped from the build.
 * color-mix() with the `<alpha-value>` placeholder makes them work.
 */
const withAlpha = (variable: string) =>
  `color-mix(in oklab, var(${variable}) calc(<alpha-value> * 100%), transparent)`

const config = {
  darkMode: ["class"],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
	],
  theme: {
    // Replaces (not extends) the shadow-color palette: otherwise the `card`
    // theme color generates a `.shadow-card` shadow-COLOR utility that clashes
    // with the `shadow-card` boxShadow size token below, overriding it with a
    // card-colored (invisible) shadow. Add colors here if you need new ones.
    boxShadowColor: {
      black: "#000",
      primary: withAlpha("--primary"),
    },
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
        border: withAlpha("--border"),
        input: withAlpha("--input"),
        ring: withAlpha("--ring"),
        background: withAlpha("--background"),
        foreground: withAlpha("--foreground"),
        primary: {
          DEFAULT: withAlpha("--primary"),
          foreground: withAlpha("--primary-foreground"),
        },
        secondary: {
          DEFAULT: withAlpha("--secondary"),
          foreground: withAlpha("--secondary-foreground"),
        },
        destructive: {
          DEFAULT: withAlpha("--destructive"),
          foreground: withAlpha("--destructive-foreground"),
        },
        muted: {
          DEFAULT: withAlpha("--card2"),
          foreground: withAlpha("--muted"),
        },
        accent: {
          DEFAULT: withAlpha("--accent"),
          foreground: withAlpha("--accent-foreground"),
        },
        popover: {
          DEFAULT: withAlpha("--popover"),
          foreground: withAlpha("--popover-foreground"),
        },
        card: {
          DEFAULT: withAlpha("--card"),
          foreground: withAlpha("--card-foreground"),
        },
        card2: withAlpha("--card2"),
      },
      boxShadow: {
        card: "0 1px 2px rgba(0,0,0,0.05), 0 16px 40px -24px rgba(0,0,0,0.25)",
        "card-hover": "0 2px 4px rgba(0,0,0,0.06), 0 26px 56px -24px rgba(0,0,0,0.34)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-slow": "float 12s ease-in-out infinite",
        "float-slower": "float 18s ease-in-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config

export default config
