"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState, type MouseEvent } from "react"
import { flushSync } from "react-dom"
import { AnimatePresence, motion } from "framer-motion"
import { triggerHaptic } from "./ui/haptics"

type ThemeToggleProps = {
  variant?: "icon" | "pill"
}

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => {
    ready: Promise<void>
    finished: Promise<void>
  }
}

export default function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"

  const toggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    triggerHaptic()
    const next = isDark ? "light" : "dark"

    const doc = document as DocumentWithViewTransition
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (!doc.startViewTransition || reduce) {
      setTheme(next)
      return
    }

    // Circle anchored at the click point (button center on keyboard activation).
    // These are layout-viewport coordinates — only a fallback: the clip-path
    // runs on ::view-transition pseudos, whose coordinate space is the
    // snapshot containing block. On Android Chrome that block includes the
    // top URL bar, so viewport coordinates land ~60px above the button.
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const fallbackX = event.clientX || rect.left + rect.width / 2
    const fallbackY = event.clientY || rect.top + rect.height / 2

    // To dark: the dark theme expands out of the button (reveal).
    // To light: the dark theme retracts back into it (cover up).
    const expanding = next === "dark"
    document.documentElement.dataset.themeVt = expanding ? "expand" : "cover"
    // Name the clicked button so its snapshot group's transform tells us the
    // button position in the snapshot containing block's own space.
    button.style.viewTransitionName = "theme-toggle-anchor"

    const transition = doc.startViewTransition(() => {
      flushSync(() => setTheme(next))
    })
    transition.ready.then(() => {
      const root = document.documentElement
      let x = fallbackX
      let y = fallbackY
      let width = window.innerWidth
      let height = window.innerHeight
      try {
        const group = getComputedStyle(root, "::view-transition-group(theme-toggle-anchor)")
        const matrix = new DOMMatrixReadOnly(group.transform)
        const groupWidth = parseFloat(group.width)
        const groupHeight = parseFloat(group.height)
        if (group.transform !== "none" && !Number.isNaN(groupWidth) && !Number.isNaN(groupHeight)) {
          x = matrix.m41 + groupWidth / 2
          y = matrix.m42 + groupHeight / 2
        }
        const snapshotBlock = getComputedStyle(root, "::view-transition")
        width = parseFloat(snapshotBlock.width) || width
        height = parseFloat(snapshotBlock.height) || height
      } catch {
        // Browsers that can't resolve the pseudo styles keep the viewport
        // fallback, which is correct wherever both spaces share an origin.
      }
      const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y))
      const small = `circle(0px at ${x}px ${y}px)`
      const full = `circle(${radius}px at ${x}px ${y}px)`
      root.animate(
        { clipPath: expanding ? [small, full] : [full, small] },
        {
          duration: 450,
          easing: "ease-in-out",
          fill: "forwards",
          pseudoElement: expanding
            ? "::view-transition-new(root)"
            : "::view-transition-old(root)",
        }
      )
    })
    transition.finished.finally(() => {
      delete document.documentElement.dataset.themeVt
      button.style.viewTransitionName = ""
    })
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
