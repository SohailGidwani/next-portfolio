"use client"

import type { ReactNode } from "react"
import { motion, useReducedMotion } from "framer-motion"

const EASE = [0.22, 1, 0.36, 1] as const

// Site-wide signature entrance, borrowed from the hero title:
// eyebrow eases its letter-spacing in, headline rises out of a mask.
// Visibility is observed on the wrapper (the masked span is clipped,
// so it can never intersect the viewport itself).
export default function SectionHeading({
  eyebrow,
  children,
  className,
}: {
  eyebrow: string
  children: ReactNode
  className?: string
}) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion) {
    return (
      <div className={className}>
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl">{children}</h2>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      <motion.p
        variants={{
          hidden: { opacity: 0, letterSpacing: "0.6em" },
          visible: { opacity: 1, letterSpacing: "0.35em" },
        }}
        transition={{ duration: 0.7, ease: EASE }}
        className="text-xs uppercase text-muted-foreground"
      >
        {eyebrow}
      </motion.p>
      <h2 className="mt-3 overflow-hidden pb-[0.08em] -mb-[0.08em] font-display text-3xl text-foreground sm:text-4xl">
        <motion.span
          className="block"
          variants={{ hidden: { y: "110%" }, visible: { y: 0 } }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          {children}
        </motion.span>
      </h2>
    </motion.div>
  )
}
