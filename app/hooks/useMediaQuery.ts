"use client"

import { useCallback, useSyncExternalStore } from "react"

/**
 * Reads a media query without tearing during hydration.
 *
 * The server snapshot is always false, so anything gated on this hook mounts
 * only after hydration. Use it for out-of-flow affordances (fixed overlays,
 * sheets) where a late mount costs nothing. Never use it to decide in-flow
 * structure: that shifts layout after paint. In-flow mobile shape belongs in
 * CSS so the server HTML already carries it.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query)
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    },
    [query]
  )

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  )
}
