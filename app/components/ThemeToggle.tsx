"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { triggerHaptic } from "./ui/haptics"

type ThemeToggleProps = {
  variant?: "icon" | "pill"
}

/** Must match the transition-duration of .theme-fade in globals.css. */
const THEME_FADE_MS = 220

export default function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const fadeTimer = useRef<number | undefined>(undefined)

  useEffect(() => {
    setMounted(true)
    // Two toggles share one document, so a pending timer from an unmounted
    // instance would otherwise strip the class mid-fade for the other.
    return () => window.clearTimeout(fadeTimer.current)
  }, [])

  const isDark = resolvedTheme === "dark"

  /**
   * Switches the theme with a colour crossfade and nothing else.
   *
   * This used to run a circular clip-path reveal over a whole-page view
   * transition snapshot. That is gone by request: a theme switch is a setting
   * change, and animating the whole page for it drew attention to the
   * mechanism rather than the result. A hard swap is the other extreme and
   * reads as a flash, so the colours cross over 220ms instead. Nothing moves.
   *
   * The class is added for the length of the fade only. Leaving the transition
   * on permanently would make every hover and state change inherit it.
   */
  const toggleTheme = () => {
    triggerHaptic()
    const root = document.documentElement
    root.classList.add("theme-fade")
    window.clearTimeout(fadeTimer.current)
    fadeTimer.current = window.setTimeout(() => root.classList.remove("theme-fade"), THEME_FADE_MS)
    setTheme(isDark ? "light" : "dark")
  }

  if (!mounted) {
    if (variant === "pill") {
      return (
        <div className="h-9 min-w-[5.5rem] animate-pulse rounded border border-border bg-card/40 px-4" />
      )
    }
    return (
      <div className="h-9 w-9 animate-pulse rounded border border-border bg-card/60" />
    )
  }

  if (variant === "pill") {
    return (
      <motion.button
        type="button"
        onClick={toggleTheme}
        whileTap={{ scale: 0.98 }}
        className="inline-flex items-center gap-2 rounded border border-border bg-transparent px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.08em] text-foreground transition hover:border-foreground/40"
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
      className="group relative flex h-9 w-9 items-center justify-center rounded border border-border bg-card/80 text-foreground transition hover:border-accent/50"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={resolvedTheme}
          initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="relative"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
