"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useSettledInView } from "@/app/hooks/useSettledInView"

const EASE_OUT = [0.25, 1, 0.5, 1] as const // --ease-out-soft

// An axial slice cut into patches, the way a 3D ViT sees a scan: 12 across,
// 14 front to back. A patch is kept when its centre falls inside the slice
// outline, and the hemispheres are pulled apart along the midline, with a
// notch front and back where the fissure opens.
const COLS = 12
const ROWS = 14
const SIZE = 10
const GAP = 2
const FISSURE = 4
const W = COLS * (SIZE + GAP) - GAP + FISSURE
const H = ROWS * (SIZE + GAP) - GAP

// The hidden region: a 4 x 3 block in the right hemisphere.
const TARGET = { c0: 7, c1: 10, r0: 3, r1: 5 }
const isTarget = (c: number, r: number) => c >= TARGET.c0 && c <= TARGET.c1 && r >= TARGET.r0 && r <= TARGET.r1

const x = (c: number) => c * (SIZE + GAP) + (c >= COLS / 2 ? FISSURE : 0)
const y = (r: number) => r * (SIZE + GAP)

const PATCHES = (() => {
  const out: { c: number; r: number; target: boolean; order: number }[] = []
  let order = 0
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const nx = (c + 0.5 - COLS / 2) / (COLS / 2)
      const ny = (r + 0.5 - ROWS / 2) / (ROWS / 2)
      // Slightly narrower at the front (top) than the back, like a real slice.
      const inside = nx * nx * (1 + 0.2 * -ny) + ny * ny <= 1.04
      const notch = (r === 0 || r === ROWS - 1) && (c === COLS / 2 - 1 || c === COLS / 2)
      if (!inside || notch) continue
      const target = isTarget(c, r)
      out.push({ c, r, target, order: target ? order++ : -1 })
    }
  }
  return out
})()

const HOLE = {
  x: x(TARGET.c0) - 2,
  y: y(TARGET.r0) - 2,
  w: x(TARGET.c1) + SIZE - x(TARGET.c0) + 4,
  h: y(TARGET.r1) + SIZE - y(TARGET.r0) + 4,
}

type Phase = "idle" | "masked" | "filled"

/**
 * How a JEPA learns, in one loop: a block of the scan is hidden, and the
 * model fills it back in patch by patch from the context around it (in
 * embedding space, not pixels). Plays once the visitor has stopped on it, and
 * again whenever `replay` changes.
 */
export default function JepaPatches({ replay }: { replay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  // Plays when the visitor stops on it, not while a flick carries it past.
  const inView = useSettledInView(ref)
  const reduce = useReducedMotion() ?? false
  // Always idle on first render: the reduced-motion preference is unknown on
  // the server, so choosing the settled phase here would break hydration.
  const [phase, setPhase] = useState<Phase>("idle")

  useEffect(() => {
    if (reduce) {
      setPhase("filled")
      return
    }
    if (!inView) return
    setPhase("idle")
    const timers = [window.setTimeout(() => setPhase("masked"), 250), window.setTimeout(() => setPhase("filled"), 1050)]
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [inView, replay, reduce])

  return (
    <div ref={ref} className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-3">
      <svg
        viewBox={`-3 -3 ${W + 6} ${H + 6}`}
        role="img"
        aria-label="A brain scan cut into patches. A block of patches is hidden, then predicted patch by patch from the visible context around it."
        className="w-36 shrink-0 sm:w-44"
      >
        {/* Colours live on separate layers, since a CSS variable colour
            cannot be tweened: the grey context patch fades out when its
            region is hidden, and an accent patch grows in over it when the
            model predicts it. */}
        {PATCHES.map((p) => (
          <motion.rect
            key={`${p.c}-${p.r}`}
            x={x(p.c)}
            y={y(p.r)}
            width={SIZE}
            height={SIZE}
            rx={1.5}
            style={{ fill: "var(--muted)" }}
            initial={false}
            animate={{ opacity: p.target && phase !== "idle" ? 0 : 0.35 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
          />
        ))}
        {PATCHES.filter((p) => p.target).map((p) => (
          <motion.rect
            key={`t-${p.c}-${p.r}`}
            x={x(p.c)}
            y={y(p.r)}
            width={SIZE}
            height={SIZE}
            rx={1.5}
            style={{ fill: "var(--accent)" }}
            initial={false}
            animate={phase === "filled" ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
            transition={
              phase === "filled" && !reduce
                ? { duration: 0.24, delay: p.order * 0.07, ease: EASE_OUT }
                : { duration: 0.15, ease: EASE_OUT }
            }
          />
        ))}
        <motion.rect
          x={HOLE.x}
          y={HOLE.y}
          width={HOLE.w}
          height={HOLE.h}
          rx={2.5}
          fill="none"
          style={{ stroke: "var(--accent)" }}
          strokeWidth={1}
          strokeDasharray="3 2.5"
          initial={false}
          animate={{ opacity: phase === "idle" ? 0 : 0.9 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
        />
      </svg>
      <ul aria-hidden className="space-y-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-[var(--muted)] opacity-40" />
          Context
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-[2px] border border-dashed border-accent" />
          Hidden
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-[2px] bg-accent" />
          Predicted
        </li>
      </ul>
    </div>
  )
}
