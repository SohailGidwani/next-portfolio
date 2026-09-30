"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

// Must match --bg in globals.css and the themeColor pair in app/layout.tsx.
const BG = { light: "#f6f7f9", dark: "#07080b" } as const

/**
 * Keeps the browser chrome (the theme-color meta) on the site's theme rather
 * than the OS setting. The layout emits two metas keyed to
 * prefers-color-scheme, which is right on first paint for a visitor who has
 * never toggled; once the toggle disagrees with the OS, the matching meta
 * would still paint the OS colour above the page. Both metas take the site's
 * colour, so whichever one the browser picks is correct.
 *
 * Next re-renders the viewport metas on every client-side navigation, which
 * put the OS colours back (measured: dark site, light OS, one click to
 * /about). So a MutationObserver re-applies the colour whenever the head
 * changes, not just when the theme does. Writing the same value again is a
 * no-op, so the observer cannot loop on its own edits.
 */
export default function ThemeColorSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return
    const color = BG[resolvedTheme]
    const apply = () => {
      document.querySelectorAll<HTMLMetaElement>('meta[name="theme-color"]').forEach((meta) => {
        if (meta.getAttribute("content") !== color) meta.setAttribute("content", color)
      })
    }
    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.head, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["content"],
    })
    return () => observer.disconnect()
  }, [resolvedTheme])

  return null
}
