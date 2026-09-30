"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"
import { useTheme } from "next-themes"
import { clamp, pick, rand, runCanvas } from "./games/canvasLoop"
import { LEAF_COLORS } from "./games/TsushimaField"

type Strand = {
  x: number
  y: number
  heading: number
  trail: number[]
  phase: number
  /** fly toward the target, orbit it once, then fade out and start over */
  state: "fly" | "orbit" | "fade"
  angle: number
  turned: number
  dir: number
}
type Leaf = { x: number; y: number; r: number; rot: number; spin: number; phase: number; color: string }

const TRAIL = 90 // coordinates kept per strand, so 45 points

/**
 * The guiding wind from Ghost of Tsushima, on the 404 page: wind strands rise
 * from the left, arc across the page and wrap once around whatever element
 * carries `data-wind-target` (the "Back to home" button), the way the wind in
 * the game shows the way. Leaves ride the same gusts.
 */
export default function GuidingWind() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion() ?? false
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme !== "light"

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ink = dark ? "255,252,245" : "20,24,38"
    const inkAlpha = dark ? 0.4 : 0.3

    return runCanvas(canvas, reduce, (w, h) => {
      const phone = w < 768
      const s = clamp(Math.min(w, h) / 900, 0.7, 1.2)

      // Where to go: the button's centre and a ring just outside it. Read
      // again every half second, in case the page reflows or scrolls.
      let target = { x: w / 2, y: h / 2, rx: 100, ry: 50 }
      let measuredAt = -1
      const measure = (t: number) => {
        if (t - measuredAt < 0.5) return
        measuredAt = t
        const el = document.querySelector("[data-wind-target]")
        if (!el) return
        const r = el.getBoundingClientRect()
        const c = canvas.getBoundingClientRect()
        // Tight at the sides, where the next button sits 12px away.
        target = { x: r.left - c.left + r.width / 2, y: r.top - c.top + r.height / 2, rx: r.width / 2 + 10, ry: r.height / 2 + 20 }
      }

      // The same travelling gust as the Tsushima field, so speed comes and
      // goes in waves across the page instead of every strand pacing alike.
      const k = (Math.PI * 2) / (w * 0.95)
      const wind = (x: number, t: number) => {
        const a = Math.max(0, Math.sin(x * k - t * 1.35))
        const b = Math.max(0, Math.sin(x * k * 0.5 - t * 0.8 + 1.3))
        return 0.2 + 0.8 * (a * a * 0.7 + b * b * 0.3)
      }

      // Spread far off the left edge, so strands arrive a few at a time
      // rather than in a wave.
      const spawn = (st: Partial<Strand> = {}): Strand => ({
        x: rand(-w * 0.5, -30),
        // From the upper left, so the wind sweeps down to the button and
        // stays clear of the links under it.
        y: rand(h * 0.1, Math.max(h * 0.3, target.y - 40)),
        heading: rand(-0.5, 0.5),
        trail: [],
        phase: rand(0, 6),
        state: "fly",
        angle: 0,
        turned: 0,
        dir: 1,
        ...st,
      })
      // The first strands start spread across the left of the page, so the
      // wind is already blowing when the page appears.
      measure(0)
      const strands: Strand[] = Array.from({ length: phone ? 7 : 12 }, (_, i) =>
        spawn({ x: i < (phone ? 3 : 5) ? rand(-40, w * 0.3) : rand(-w * 0.8, -40) }),
      )
      const leaves: Leaf[] = Array.from({ length: phone ? 7 : 12 }, () => ({
        x: rand(-w * 0.2, w), y: rand(0, h), r: rand(4, 8) * s, rot: rand(0, 6), spin: rand(-3, 3), phase: rand(0, 6), color: pick(LEAF_COLORS),
      }))

      const step = (st: Strand, t: number, dt: number) => {
        const speed = (200 + 320 * wind(st.x, t)) * s * (phone ? 0.75 : 1)
        const dx = st.x - target.x
        const dy = st.y - target.y
        if (st.state === "fly") {
          const dist = Math.hypot(dx, dy)
          // Aim at the button, swaying less the closer it gets, and turn at a
          // limited rate so every strand comes in on a curve.
          const sway = Math.sin(t * 0.9 + st.phase) * 0.45 * clamp(dist / 500, 0, 1)
          let diff = Math.atan2(-dy, -dx) + sway - st.heading
          diff = Math.atan2(Math.sin(diff), Math.cos(diff))
          st.heading += clamp(diff, -2.2 * dt, 2.2 * dt)
          st.x += Math.cos(st.heading) * speed * dt
          st.y += Math.sin(st.heading) * speed * dt
          if ((dx / target.rx) ** 2 + (dy / target.ry) ** 2 <= 1) {
            // Arrived on the ring: carry on around it the way it was going.
            st.state = "orbit"
            st.angle = Math.atan2(dy / target.ry, dx / target.rx)
            st.dir = Math.cos(st.heading) * dy - Math.sin(st.heading) * dx > 0 ? -1 : 1
            st.turned = 0
          }
        } else if (st.state === "orbit") {
          const turn = (speed / ((target.rx + target.ry) / 2)) * dt
          st.angle += st.dir * turn
          st.turned += turn
          st.x = target.x + Math.cos(st.angle) * target.rx
          st.y = target.y + Math.sin(st.angle) * target.ry
          if (st.turned > Math.PI * 1.6) st.state = "fade"
        }
        if (st.state === "fade") {
          st.trail.splice(0, 6)
          if (st.trail.length === 0) Object.assign(st, spawn())
          return
        }
        st.trail.push(st.x, st.y)
        if (st.trail.length > TRAIL) st.trail.splice(0, 2)
      }

      const drawStrand = (ctx: CanvasRenderingContext2D, st: Strand) => {
        const n = st.trail.length / 2
        for (let i = 1; i < n; i++) {
          const p = i / n
          ctx.strokeStyle = `rgba(${ink},${inkAlpha * p * p})`
          ctx.lineWidth = (0.4 + 2 * p) * s
          ctx.beginPath()
          ctx.moveTo(st.trail[(i - 1) * 2], st.trail[(i - 1) * 2 + 1])
          ctx.lineTo(st.trail[i * 2], st.trail[i * 2 + 1])
          ctx.stroke()
        }
      }

      // Reduced motion gets one settled frame: run the wind a few seconds
      // ahead so the strands are already drawn out as curves.
      if (reduce) {
        for (let i = 0; i < 270; i++) for (const st of strands) step(st, i / 60, 1 / 60)
      }

      return (ctx, t, dt) => {
        measure(t)
        ctx.lineCap = "round"
        for (const st of strands) {
          if (dt > 0) step(st, t, dt)
          drawStrand(ctx, st)
        }

        for (const lf of leaves) {
          const gust = wind(lf.x, t)
          if (dt > 0) {
            lf.x += (50 + 240 * gust) * s * dt
            // Drawn gently toward the button's height as they pass.
            lf.y += ((target.y - lf.y) * 0.12 + Math.sin(t * 1.5 + lf.phase) * 26) * dt
            lf.rot += lf.spin * (0.6 + gust) * dt
            if (lf.x > w + 20) Object.assign(lf, { x: rand(-w * 0.3, -10), y: rand(h * 0.05, h * 0.95) })
          }
          ctx.save()
          ctx.translate(lf.x, lf.y)
          ctx.rotate(lf.rot)
          ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.sin(t * 3 + lf.phase)))
          ctx.globalAlpha = dark ? 0.85 : 0.7
          ctx.fillStyle = lf.color
          ctx.beginPath()
          ctx.moveTo(-lf.r, 0)
          ctx.quadraticCurveTo(0, -lf.r * 0.7, lf.r, 0)
          ctx.quadraticCurveTo(0, lf.r * 0.7, -lf.r, 0)
          ctx.fill()
          ctx.restore()
        }
      }
    })
  }, [dark, reduce])

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />
}
