"use client"

import { useEffect, useRef } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

const GLOW_MASK =
  "radial-gradient(200px circle at var(--glow-x, -500px) var(--glow-y, -500px), black 0%, transparent 100%)"

export default function AmbientBackground() {
  const shouldReduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const driftMedium = useTransform(scrollY, [0, 1200], [0, -60])
  const driftFast = useTransform(scrollY, [0, 1200], [0, 110])

  // Both themes get a brighter dot layer revealed through a radial mask that
  // follows the cursor. The cursor vars live on the root wrapper so the dark
  // and light layers share them.
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (shouldReduceMotion) return

    let raf = 0
    let fadeTimer: ReturnType<typeof setTimeout> | undefined
    let x = -500
    let y = -500

    const apply = () => {
      raf = 0
      const el = rootRef.current
      if (!el) return
      el.style.setProperty("--glow-x", `${x}px`)
      el.style.setProperty("--glow-y", `${y}px`)
      el.style.setProperty("--glow-o", "1")
    }

    const onMove = (e: PointerEvent) => {
      if (fadeTimer) clearTimeout(fadeTimer)
      x = e.clientX
      y = e.clientY
      if (!raf) raf = requestAnimationFrame(apply)
    }

    const onLeave = () => {
      rootRef.current?.style.setProperty("--glow-o", "0")
    }

    // Touch: the glow lights up where the finger is and fades after release.
    const onUp = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return
      if (fadeTimer) clearTimeout(fadeTimer)
      fadeTimer = setTimeout(onLeave, 700)
    }

    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerdown", onMove, { passive: true })
    window.addEventListener("pointerup", onUp, { passive: true })
    document.documentElement.addEventListener("pointerleave", onLeave)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerdown", onMove)
      window.removeEventListener("pointerup", onUp)
      document.documentElement.removeEventListener("pointerleave", onLeave)
      if (raf) cancelAnimationFrame(raf)
      if (fadeTimer) clearTimeout(fadeTimer)
    }
  }, [shouldReduceMotion])

  return (
    <div ref={rootRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 hidden dark:block">
        <div
          className="fixed inset-0"
          style={{
            backgroundColor: "var(--bg)",
            backgroundImage: "radial-gradient(rgba(255,255,255,0.045) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div
          className="fixed inset-0 transition-opacity duration-500"
          style={{
            opacity: "var(--glow-o, 0)",
            backgroundImage: "radial-gradient(rgba(53,184,212,0.34) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            WebkitMaskImage: GLOW_MASK,
            maskImage: GLOW_MASK,
          }}
        />
      </div>

      <div className="absolute inset-0 dark:hidden">
        <div
          className="fixed inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(16,17,24,0.06) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div
          className="fixed inset-0 transition-opacity duration-500"
          style={{
            opacity: "var(--glow-o, 0)",
            backgroundImage: "radial-gradient(rgba(25,56,215,0.36) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            WebkitMaskImage: GLOW_MASK,
            maskImage: GLOW_MASK,
          }}
        />
        <motion.div
          style={{ y: shouldReduceMotion ? 0 : driftMedium, willChange: "transform" }}
          className="absolute top-[20%] left-[-12%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(104,110,125,0.12),transparent_65%)] blur-3xl animate-float-slower"
        />
        <motion.div
          style={{ y: shouldReduceMotion ? 0 : driftFast, willChange: "transform" }}
          className="absolute bottom-[-20%] right-[12%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(140,156,196,0.14),transparent_65%)] blur-3xl animate-float-slow"
        />
        <div className="absolute inset-0 grain" />
      </div>
    </div>
  )
}
