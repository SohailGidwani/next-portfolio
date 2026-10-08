"use client"

import { useMediaQuery } from "./useMediaQuery"

/**
 * The reduced-motion setting, read so hydration never tears.
 *
 * framer's useReducedMotion() is null on the server but already true on the
 * client's first render, so markup branched on it differs between the two
 * and React throws the server HTML away. This reports false until hydration
 * has finished and the real setting after that, so the first render always
 * matches the server and the reduced variant takes over one render later.
 *
 * Anything that mounted during hydration still has its full-motion starting
 * state, so pair this with transitions that take no time under reduced
 * motion. Copies mounted later (a lightbox opening) get the reduced state
 * from the start. Safe for SVG children; in-flow layout still belongs in CSS.
 */
export function useHydrationSafeReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)")
}
