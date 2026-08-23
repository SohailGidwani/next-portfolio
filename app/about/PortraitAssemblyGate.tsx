"use client"

import { useLayoutEffect } from "react"
import { hasAssembled, markAssembled } from "@/app/utils/portraitAssembly"

/**
 * Stops the /about print rebuilding itself on a repeat visit.
 *
 * The homepage portrait can decide this in its own render, because framer-motion
 * drives it. This print is CSS keyframes on a server component, so the decision
 * has to reach it as an attribute the stylesheet can read.
 *
 * Layout effect, not passive: it runs after the DOM is in place but before the
 * browser paints, so the suppressed keyframes never get a frame on screen. On
 * the navigation that matters most the browser is holding a view-transition
 * snapshot anyway, which suspends painting entirely.
 *
 * The attribute is deliberately left set on unmount. It describes the session,
 * not this page, and clearing it on the way out would arm the animation again
 * for the next arrival, which is the whole thing being fixed.
 */
export default function PortraitAssemblyGate() {
  useLayoutEffect(() => {
    if (hasAssembled()) {
      document.documentElement.dataset.portraitAssembled = "true"
    }
    markAssembled()
  }, [])

  return null
}
