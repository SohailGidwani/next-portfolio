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
        style={{ y: shouldReduceMotion ? 0 : driftSlow, willChange: "transform" }}
        className="absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(217,119,6,0.11),transparent_70%)] blur-2xl animate-float-slow dark:bg-[radial-gradient(circle,rgba(217,119,6,0.14),transparent_70%)]"
      />
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : driftMedium, willChange: "transform" }}
        className="absolute top-[20%] left-[-12%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(120,113,108,0.12),transparent_65%)] blur-3xl animate-float-slower dark:bg-[radial-gradient(circle,rgba(214,211,209,0.08),transparent_65%)]"
      />
      <motion.div
        style={{ y: shouldReduceMotion ? 0 : driftFast, willChange: "transform" }}
        className="absolute bottom-[-20%] right-[12%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(180,165,140,0.14),transparent_65%)] blur-3xl animate-float-slow dark:bg-[radial-gradient(circle,rgba(90,80,70,0.2),transparent_65%)]"
      />
      <div className="absolute left-1/2 top-10 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/35 to-transparent opacity-40 animate-pulse-soft" />
      <div className="absolute inset-0 grain" />
    </div>
  )
}
