"use client"

import { motion, useReducedMotion } from "framer-motion"

export default function SectionDivider() {
  const reduced = useReducedMotion()

  return (
    <div className="px-4 py-5 md:px-6 md:py-7" aria-hidden="true">
      <motion.div
        className="mx-auto h-px max-w-6xl origin-center bg-border"
        initial={reduced ? false : { scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}
