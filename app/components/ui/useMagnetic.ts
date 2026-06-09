"use client"

import { useRef, type PointerEvent } from "react"
import { useMotionValue, useSpring, useReducedMotion } from "framer-motion"

/**
 * Gives an element a subtle magnetic pull toward the cursor.
 * Spread the returned props onto a motion component:
 *
 *   const magnet = useMagnetic<HTMLButtonElement>()
 *   <motion.button ref={magnet.ref} style={{ x: magnet.x, y: magnet.y }}
 *     onPointerMove={magnet.onPointerMove} onPointerLeave={magnet.onPointerLeave} />
 *
 * Mouse-only; touch and reduced-motion leave the element static.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.18) {
  const ref = useRef<T>(null)
  const reduced = useReducedMotion()

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 180, damping: 16, mass: 0.4 })
  const y = useSpring(my, { stiffness: 180, damping: 16, mass: 0.4 })

  const onPointerMove = (e: PointerEvent<T>) => {
    if (reduced || e.pointerType !== "mouse") return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    mx.set((e.clientX - rect.left - rect.width / 2) * strength)
    my.set((e.clientY - rect.top - rect.height / 2) * strength)
  }

  const onPointerLeave = () => {
    mx.set(0)
    my.set(0)
  }

  return { ref, x, y, onPointerMove, onPointerLeave }
}
