"use client"

import { useState, useEffect } from "react"

/**
 * Detects mobile once on mount and locks the value.
 * Returns `null` before hydration so callers can avoid
 * rendering GSAP-heavy trees until the check completes.
 * Does NOT update on resize — swapping pinned/unpinned
 * component trees at runtime causes GSAP ↔ React DOM conflicts.
 */
export function useIsMobile(): boolean | null {
  const [value, setValue] = useState<boolean | null>(null)

  useEffect(() => {
    setValue(window.innerWidth < 768)
  }, [])

  return value
}

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return reduced
}
