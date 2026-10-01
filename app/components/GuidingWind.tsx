"use client"

import { useEffect, useRef } from "react"
import { useReducedMotion } from "framer-motion"
import { useTheme } from "next-themes"
import { clamp, pick, rand, runCanvas } from "./games/canvasLoop"

type Strand = {
  x: number
  y: number
  heading: number
  trail: number[]
  phase: number
  /** A gust crosses the page and bends around the button; a guide comes in to circle it. */
  role: "pass" | "guide"
  /** The height a gust is making for as it leaves on the right. */
  lane: number
  /** fly toward the target (or across, for a gust), orbit it once, then fade out and start over */
  state: "fly" | "orbit" | "fade"
  angle: number
  turned: number
  dir: number
}
type Leaf = { x: number; y: number; lane: number; r: number; rot: number; spin: number; phase: number; color: string }

const TRAIL = 90 // coordinates kept per strand, so 45 points
// Each strand is drawn as this many runs of one width and strength, so the
// taper is smooth without a joint between every pair of points.
const RUNS = 9

/** "#35b8d4" (or "rgb(...)") as [r, g, b]; null if it is neither. */
function parseColor(value: string): [number, number, number] | null {
  const v = value.trim()
  const hex = v.match(/^#([0-9a-f]{6})$/i)
  if (hex) {
    const n = parseInt(hex[1], 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  const rgb = v.match(/^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/i)
  return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : null
}
const mix = (a: [number, number, number], b: [number, number, number], t: number) =>
  a.map((v, i) => Math.round(v + (b[i] - v) * t)) as [number, number, number]
const css = (c: [number, number, number]) => `rgb(${c[0]},${c[1]},${c[2]})`

/**
 * The guiding wind from Ghost of Tsushima, on the 404 page, in the site's own
 * colours. Most strands are gusts that cross the page and bend around the
 * "Back to home" button (whatever carries `data-wind-target`) on their way
 * past; only a few at a time come in and wrap once around it, the way the
 * wind in the game shows the way. Petals in the accent ride the same gusts.
 */
export default function GuidingWind() {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion() ?? false
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme !== "light"

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    // The theme's own tokens, read now (this runs again when the theme
    // changes), so the wind follows the palette rather than a copy of it.
    const tokens = getComputedStyle(document.documentElement)
    const fg = parseColor(tokens.getPropertyValue("--fg")) ?? (dark ? [238, 240, 244] : [16, 17, 20])
    const bg = parseColor(tokens.getPropertyValue("--bg")) ?? (dark ? [7, 8, 11] : [246, 247, 249])
    const accent = parseColor(tokens.getPropertyValue("--accent")) ?? (dark ? [53, 184, 212] : [25, 56, 215])
    const muted = parseColor(tokens.getPropertyValue("--muted")) ?? (dark ? [135, 139, 149] : [96, 100, 109])
    const ink = fg.join(",")
    const inkAlpha = dark ? 0.36 : 0.26
    // Mostly the accent, in three depths, with a few neutral ones among them.
    const petals = [accent, accent, mix(accent, fg, 0.4), mix(accent, bg, 0.35), muted].map(css)

    return runCanvas(canvas, reduce, (w, h) => {
      const phone = w < 768
      const s = clamp(Math.min(w, h) / 900, 0.7, 1.2)
      // How many strands may be headed for the button at once. The rest pass.
      const maxGuides = phone ? 1 : 2

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

      // A height to cross the page at, kept clear of the button's own band
      // so a gust reads as passing it rather than heading for it.
      const lane = () => {
        const above = rand(h * 0.08, Math.max(h * 0.1, target.y - target.ry - 50))
        const below = rand(Math.min(h * 0.9, target.y + target.ry + 70), h * 0.92)
        return Math.random() < 0.7 ? above : below
      }

      const strands: Strand[] = []
      const guides = () => strands.filter((st) => st.role === "guide" && st.state !== "fade").length
      // Spread far off the left edge, so strands arrive a few at a time
      // rather than in a wave.
      const spawn = (st: Partial<Strand> = {}): Strand => {
        // Keep a guide or two on the way at all times, so the button is
        // circled every few seconds; everything else passes.
        const role = guides() < maxGuides && Math.random() < 0.8 ? "guide" : "pass"
        const y = role === "guide" ? rand(h * 0.1, Math.max(h * 0.3, target.y - 40)) : lane()
        return {
          // Guides start nearer, so the next circle is never long coming.
          x: role === "guide" ? rand(-w * 0.15, -30) : rand(-w * 0.5, -30),
          // Guides come from the upper left, so they sweep down to the
          // button and stay clear of the links under it.
          y,
          heading: rand(-0.3, 0.3),
          trail: [],
          phase: rand(0, 6),
          role,
          lane: role === "pass" ? clamp(y + rand(-h * 0.12, h * 0.12), h * 0.05, h * 0.95) : y,
          state: "fly",
          angle: 0,
          turned: 0,
          dir: 1,
          ...st,
        }
      }
      // The first strands start spread across the left of the page, so the
      // wind is already blowing when the page appears.
      measure(0)
      for (let i = 0; i < (phone ? 6 : 11); i++) {
        const st = spawn()
        // The first guide is already on its way in, so a circle shows soon.
        if (i === 0 && st.role === "guide") st.x = rand(w * 0.05, w * 0.2)
        else if (i < (phone ? 3 : 5)) st.x = rand(-40, w * 0.35)
        else if (st.role === "pass") st.x = rand(-w * 0.8, -40)
        strands.push(st)
      }
      const leaves: Leaf[] = Array.from({ length: phone ? 6 : 10 }, () => {
        const y = rand(h * 0.05, h * 0.95)
        return { x: rand(-w * 0.2, w), y, lane: y, r: rand(4, 7) * s, rot: rand(0, 6), spin: rand(-3, 3), phase: rand(0, 6), color: pick(petals) }
      })

      const turnToward = (st: Strand, aim: number, dt: number, rate: number) => {
        let diff = aim - st.heading
        diff = Math.atan2(Math.sin(diff), Math.cos(diff))
        st.heading += clamp(diff, -rate * dt, rate * dt)
      }

      const step = (st: Strand, t: number, dt: number) => {
        const gust = (200 + 320 * wind(st.x, t)) * s * (phone ? 0.75 : 1)
        const dx = st.x - target.x
        const dy = st.y - target.y
        if (st.state === "fly" && st.role === "pass") {
          // Make for the far edge at its lane, swaying as it goes; near the
          // button it bends away, so it passes rather than collides.
          const sway = Math.sin(t * 0.7 + st.phase) * 0.35
          let aim = Math.atan2(st.lane - st.y, w + 200 - st.x) + sway
          const near = (dx / (target.rx * 2.4)) ** 2 + (dy / (target.ry * 3.2)) ** 2
          if (near < 1 && dx < target.rx) aim += (dy < 0 ? -1 : 1) * (1 - near) * 0.9
          turnToward(st, aim, dt, 1.6)
          st.x += Math.cos(st.heading) * gust * 1.1 * dt
          st.y += Math.sin(st.heading) * gust * 1.1 * dt
          if (st.x > w + 30) st.state = "fade"
        } else if (st.state === "fly") {
          const dist = Math.hypot(dx, dy)
          // Aim at the button, swaying less the closer it gets, and turn at a
          // limited rate so every guide comes in on a curve.
          const sway = Math.sin(t * 0.9 + st.phase) * 0.45 * clamp(dist / 500, 0, 1)
          turnToward(st, Math.atan2(-dy, -dx) + sway, dt, 2.2)
          st.x += Math.cos(st.heading) * gust * dt
          st.y += Math.sin(st.heading) * gust * dt
          if ((dx / target.rx) ** 2 + (dy / target.ry) ** 2 <= 1) {
            // Arrived on the ring: carry on around it the way it was going.
            st.state = "orbit"
            st.angle = Math.atan2(dy / target.ry, dx / target.rx)
            st.dir = Math.cos(st.heading) * dy - Math.sin(st.heading) * dx > 0 ? -1 : 1
            st.turned = 0
          }
        } else if (st.state === "orbit") {
          const turn = (gust / ((target.rx + target.ry) / 2)) * dt
          st.angle += st.dir * turn
          st.turned += turn
          st.x = target.x + Math.cos(st.angle) * target.rx
          st.y = target.y + Math.sin(st.angle) * target.ry
          if (st.turned > Math.PI * 1.6) st.state = "fade"
        }
        if (st.state === "fade") {
          st.trail.splice(0, 6)
          // A fading strand no longer counts as a guide, so its
          // replacement may become one.
          if (st.trail.length === 0) Object.assign(st, spawn())
          return
        }
        st.trail.push(st.x, st.y)
        if (st.trail.length > TRAIL) st.trail.splice(0, 2)
      }

      // A tapered stroke, faint and thin at the tail, drawn as a few long
      // runs: one segment per point overlapped its round ends and beaded.
      const drawStrand = (ctx: CanvasRenderingContext2D, st: Strand) => {
        const n = st.trail.length / 2
        if (n < 2) return
        const runs = Math.min(RUNS, n - 1)
        for (let r = 0; r < runs; r++) {
          const a = Math.floor((r * (n - 1)) / runs)
          const b = Math.floor(((r + 1) * (n - 1)) / runs)
          const p = (r + 1) / runs
          ctx.strokeStyle = `rgba(${ink},${(inkAlpha * p * p).toFixed(3)})`
          ctx.lineWidth = (0.4 + 1.8 * p) * s
          ctx.beginPath()
          ctx.moveTo(st.trail[a * 2], st.trail[a * 2 + 1])
          for (let i = a + 1; i <= b; i++) ctx.lineTo(st.trail[i * 2], st.trail[i * 2 + 1])
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
        ctx.lineCap = "butt"
        ctx.lineJoin = "round"
        for (const st of strands) {
          if (dt > 0) step(st, t, dt)
          drawStrand(ctx, st)
        }

        for (const lf of leaves) {
          const gust = wind(lf.x, t)
          if (dt > 0) {
            lf.x += (50 + 240 * gust) * s * dt
            // Each petal keeps to its own height, bobbing as the gusts pass.
            lf.y += ((lf.lane - lf.y) * 0.6 + Math.sin(t * 1.5 + lf.phase) * 26) * dt
            lf.rot += lf.spin * (0.6 + gust) * dt
            if (lf.x > w + 20) {
              const y = rand(h * 0.05, h * 0.95)
              Object.assign(lf, { x: rand(-w * 0.3, -10), y, lane: y, color: pick(petals) })
            }
          }
          ctx.save()
          ctx.translate(lf.x, lf.y)
          ctx.rotate(lf.rot)
          ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.sin(t * 3 + lf.phase)))
          ctx.globalAlpha = dark ? 0.8 : 0.7
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
