"use client"

import { createContext, useContext } from "react"

/**
 * Set to true by DiagramLightbox on phone screens so diagram components
 * render their vertical (portrait) layout with horizontal, readable text.
 */
export const DiagramVerticalContext = createContext(false)

export function useDiagramVertical() {
  return useContext(DiagramVerticalContext)
}

/**
 * Distinguishes the simultaneously-mounted copies of a diagram that
 * DiagramLightbox renders (inline + the two dialog slots), so diagrams can
 * build DOM-unique SVG ids deterministically. Deliberately not useId(): its
 * server/client sequences can diverge on pages with Suspense boundaries
 * (e.g. around useSearchParams), which causes hydration mismatches.
 */
export const DiagramInstanceContext = createContext("inline")

export function useDiagramInstance() {
  return useContext(DiagramInstanceContext)
}
