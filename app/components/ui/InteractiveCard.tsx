"use client"

import { useRef, type ReactNode, type PointerEvent } from "react"
import { motion, useReducedMotion } from "framer-motion"

type InteractiveCardProps = {
  children: ReactNode
  className?: string
  /** Scales the card slightly on press, for tap feedback. */
  pressable?: boolean
}

/**
 * Card wrapper with a cursor-following accent spotlight. The card itself
 * never moves on hover: the 3D tilt it used to offer was removed. Touch
 * anchors the spotlight at the tap point instead of following a cursor.
 */
export default function InteractiveCard({
  children,
  className = "",
  pressable = false,
}: InteractiveCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const setSpot = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`)
  }

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse") setSpot(e)
  }

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") setSpot(e)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      // Always set when pressable, so the element (and the tabindex framer
      // gives tappable elements) is the same on the server and in the
      // browser; reduced motion swaps the press from a shrink to a dim.
      whileTap={pressable ? (reduced ? { opacity: 0.9 } : { scale: 0.98 }) : undefined}
      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
      className={`group/spot relative ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100 group-active/spot:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, var(--accent) 9%, transparent), transparent 70%)",
        }}
      />
      {children}
    </motion.div>
  )
}
