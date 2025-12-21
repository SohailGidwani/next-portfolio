"use client"

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

export default function AmbientBackground() {
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const driftSlow = useTransform(scrollY, [0, 1200], [0, 80])
  const driftMedium = useTransform(scrollY, [0, 1200], [0, -60])
  const driftFast = useTransform(scrollY, [0, 1200], [0, 110])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : driftSlow }}
        className="absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.18),transparent_70%)] blur-2xl animate-float-slow"
      />
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : driftMedium }}
        className="absolute top-[20%] left-[-12%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.2),transparent_65%)] blur-3xl animate-float-slower"
      />
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : driftFast }}
        className="absolute bottom-[-20%] right-[12%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(14,116,144,0.18),transparent_65%)] blur-3xl animate-float-slow"
      />
      <div className="absolute left-1/2 top-10 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-35 animate-pulse-soft" />
      <div className="absolute inset-0 grain" />
    </div>
  )
}
