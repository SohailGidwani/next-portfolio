"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { triggerHaptic } from "./ui/haptics"

type ThemeToggleProps = {
  /** Compact icon (mobile / tight layouts) */
  variant?: "icon" | "pill"
}

export default function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  const toggleTheme = () => {
    triggerHaptic()
    setTheme(isDark ? "light" : "dark")
  }

  if (!mounted) {
    if (variant === "pill") {
      return (
        <div className="h-9 min-w-[5.5rem] animate-pulse rounded-full border border-border bg-card/40 px-4" />
      )
    }
    return (
      <div className="h-10 w-10 animate-pulse rounded-full border border-border bg-card/60" />
    )
  }

  if (variant === "pill") {
    return (
      <motion.button
        type="button"
        onClick={toggleTheme}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2 rounded-full border border-border bg-transparent px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground transition hover:border-foreground/40"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        {isDark ? (
          <>
            <Sun className="h-3.5 w-3.5" />
            Light
          </>
        ) : (
          <>
            <Moon className="h-3.5 w-3.5" />
            Dark
          </>
        )}
      </motion.button>
    )
  }

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={{ scale: 0.96 }}
      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 text-foreground shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <AnimatePresence mode="wait">
        <motion.span
          key={resolvedTheme}
          initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
