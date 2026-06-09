"use client"

import { useRef, type ReactNode, type PointerEvent } from "react"
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion"

type InteractiveCardProps = {
  children: ReactNode
  className?: string
  /** Enables the subtle 3D tilt. Spotlight is always on. */
  tilt?: boolean
  /** Max tilt in degrees, applied at the card edges. */
  maxTilt?: number
}

/**
 * Card wrapper with a cursor-following accent spotlight and an optional,
 * very restrained 3D tilt. Mouse-only: touch input and reduced-motion
 * preferences leave the card completely static.
 */
export default function InteractiveCard({
  children,
  className = "",
  tilt = false,
  maxTilt = 2.5,
}: InteractiveCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 220, damping: 24 })
  const rotateY = useSpring(ry, { stiffness: 220, damping: 24 })

  const shouldTilt = tilt && !reduced

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    el.style.setProperty("--spot-x", `${x}px`)
    el.style.setProperty("--spot-y", `${y}px`)
    if (shouldTilt) {
      ry.set((x / rect.width - 0.5) * maxTilt * 2)
      rx.set(-(y / rect.height - 0.5) * maxTilt * 2)
    }
  }

  const onPointerLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={shouldTilt ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
      className={`group/spot relative ${className}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover/spot:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--spot-x, 50%) var(--spot-y, 50%), color-mix(in oklab, var(--accent) 9%, transparent), transparent 70%)",
        }}
      />
      {children}
    </motion.div>
  )
}
