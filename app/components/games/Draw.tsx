"use client"

import { motion } from "framer-motion"

export const EASE_OUT = [0.25, 1, 0.5, 1] as const // --ease-out-soft

/**
 * Draws a path in unless motion is reduced, in which case it is simply there.
 * No vector-effect="non-scaling-stroke" here: with it, browsers disagree on
 * the length the draw-in dash is measured against, and Safari stopped every
 * line partway (the pitch and webs were left half drawn). Stroke widths are
 * set per scene in drawing units instead.
 */
export function Draw({ d, delay, duration = 0.7, still, ...rest }: { d: string; delay: number; duration?: number; still: boolean } & React.SVGProps<SVGPathElement>) {
  return (
    <motion.path
      d={d}
      fill="none"
      initial={{ pathLength: still ? 1 : 0, opacity: still ? 1 : 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ pathLength: { duration, delay, ease: EASE_OUT }, opacity: { duration: 0.01, delay } }}
      {...(rest as object)}
    />
  )
}
