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
