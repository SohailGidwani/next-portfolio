"use client"

import { useEffect } from "react"
import { useTheme } from "next-themes"

/**
 * Keeps the tab icon on the site's theme: the dark tile while the site is
 * dark, the light tile (ultramarine dot) while it is light. Every rel="icon"
 * link has a light twin at the same path with "favicon" read as
 * "favicon-light", so the swap is a rename rather than a lookup table.
 *
 * The links are edited in place, not replaced: browsers watch an icon link's
 * href and repaint the tab when it changes, and the root layout never
 * re-renders them, so nothing puts the old value back.
 *
 * Deliberately no pre-paint rename: React 19 matches head links by href while
 * hydrating, so links renamed before hydration went unrecognized and React
 * inserted a second set. Browsers generally fetch the tab icon once the page
 * has loaded, and hydration has normally finished by then, so a light-theme
 * visit rarely if ever shows the dark tile first.
 *
 * Home-screen and app icons (apple-touch-icon, the manifest) are fixed when
 * the site is installed, so they are left alone.
 */
export default function FaviconSync() {
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    if (!resolvedTheme) return
    const light = resolvedTheme === "light"
    document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]').forEach((link) => {
      const href = link.getAttribute("href")
      if (!href) return
      const next = light
        ? href.replace(/\/favicon(?!-light)/, "/favicon-light")
        : href.replace("/favicon-light", "/favicon")
      if (next !== href) link.setAttribute("href", next)
    })
  }, [resolvedTheme])

  return null
}
