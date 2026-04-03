"use client"

import { motion } from "framer-motion"

interface FloatingBadgeProps {
  name: string
  delay?: number
}

export default function FloatingBadge({ name, delay = 0 }: FloatingBadgeProps) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      viewport={{ once: true, margin: "-40px" }}
      className="inline-flex glass rounded-full px-4 py-2 font-body text-xs text-white/40 hover:text-white/60 hover:bg-white/[0.05] transition-colors cursor-default"
    >
      {name}
    </motion.span>
  )
}
