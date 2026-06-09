"use client"

import { motion, useScroll, useSpring } from "framer-motion"

/**
 * Thin accent hairline showing page scroll progress.
 * Render inside a sticky header bar; it pins itself to the bottom edge.
 */
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 180, damping: 30, restDelta: 0.001 })

  return (
    <motion.div
      aria-hidden
      className="absolute bottom-[-1px] left-0 right-0 h-px origin-left bg-accent"
      style={{ scaleX }}
    />
  )
}
