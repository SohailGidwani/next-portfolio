"use client"

import { useEffect, useRef } from "react"
import { clamp, pick, rand, runCanvas } from "./canvasLoop"

const LEAF_COLORS = ["#b3202a", "#d4452f", "#8e1b1f", "#e3a33b", "#c9372c"]

type Stalk = { x: number; h: number; lean: number; phase: number; flex: number }
type Layer = { stalks: Stalk[]; plume: number; alpha: number; stem: number }
type Strand = { x: number; y: number; heading: number; trail: number[]; curl: number; curlAt: number; phase: number }
type Leaf = { x: number; y: number; r: number; rot: number; spin: number; phase: number; color: string }

/**
 * One pampas plume, pre-rendered once: a soft body with fine silky hairs
 * over it, fullest just below the middle and narrowing to the tip, like the
 * susuki in the poster rather than a thin feather.
 */
function plumeSprite() {
  const c = document.createElement("canvas")
  c.width = 80
  c.height = 200
  const g = c.getContext("2d")
  if (!g) return c
  const width = (p: number) => 26 * Math.pow(Math.sin(Math.PI * Math.min(1, p * 1.12)), 0.75)

  // Body: a faint filled silhouette so the plume reads as a mass.
  g.fillStyle = "rgba(250,246,238,0.22)"
  g.beginPath()
  g.moveTo(40, 198)
  for (let i = 0; i <= 40; i++) g.lineTo(40 + width(i / 40) * 0.75, 198 - (i / 40) * 190)
  for (let i = 40; i >= 0; i--) g.lineTo(40 - width(i / 40) * 0.75, 198 - (i / 40) * 190)
  g.fill()

  g.lineCap = "round"
  g.strokeStyle = "rgba(248,244,236,0.5)"
  g.shadowColor = "rgba(255,255,255,0.7)"
  g.shadowBlur = 4
  g.lineWidth = 1
  for (let i = 0; i < 150; i++) {
    const p = i / 150
    const y = 196 - p * 186
    const spread = width(p)
    const side = i % 2 ? 1 : -1
    g.beginPath()
    g.moveTo(40, y)
    g.quadraticCurveTo(40 + side * spread * 0.5, y - 6, 40 + side * spread * rand(0.55, 1), y - rand(10, 20))
    g.stroke()
  }
  g.shadowBlur = 0
  g.strokeStyle = "rgba(235,228,214,0.75)"
  g.lineWidth = 1.4
  g.beginPath()
  g.moveTo(40, 198)
  g.lineTo(40, 8)
  g.stroke()
  return c
}

/**
 * Ghost of Tsushima: a pampas field along the bottom, level with the grass at
 * the foot of the poster, and the guiding wind. Gusts roll through as a wave:
 * the same travelling pulse bends the grass, speeds the leaves and carries
 * the wind strands, which now and then curl into a loop as they pass.
 */
export default function TsushimaField({ still }: { still: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const sprite = plumeSprite()
    return runCanvas(ref.current, still, (w, h) => {
      const phone = w < 768
      const s = clamp(h / 900, 0.6, 1.25)
      // Desktop: the plume tops meet the grass painted into the bottom of the
      // poster (about the lowest quarter of it). Phones stack the text under
      // the poster, so there the field keeps to the bottom edge.
      const posterH = Math.min(h * 0.76, 760)
      const posterFoot = h / 2 + posterH / 2
      const fieldTop = phone ? h * 0.86 : posterFoot - posterH * 0.27
      const depth = h - fieldTop

      // The wind: a pulse travelling left to right, about one screen wide,
      // with a slower second pulse so no two gusts look alike.
      const k = (Math.PI * 2) / (w * 0.95)
      const wind = (x: number, t: number) => {
        const a = Math.max(0, Math.sin(x * k - t * 1.35))
        const b = Math.max(0, Math.sin(x * k * 0.5 - t * 0.8 + 1.3))
        return 0.2 + 0.8 * (a * a * 0.7 + b * b * 0.3)
      }

      const layers: Layer[] = [
        { spacing: 8, reach: 1.0, plume: 30, alpha: 0.32, stem: 0.7 },
        { spacing: 11, reach: 0.82, plume: 44, alpha: 0.58, stem: 0.9 },
        { spacing: 15, reach: 0.64, plume: 62, alpha: 0.9, stem: 1.2 },
      ].map((L) => ({
        plume: L.plume * s,
        alpha: L.alpha,
        stem: L.stem * s,
        stalks: Array.from({ length: Math.ceil((w + 60) / (L.spacing * (phone ? 1.3 : 1))) }, (_, i) => ({
          x: -30 + i * L.spacing * (phone ? 1.3 : 1) + rand(-4, 4),
          h: depth * L.reach * rand(0.8, 1.12) + 10,
          lean: rand(0.02, 0.12),
          phase: rand(0, Math.PI * 2),
          flex: rand(0.7, 1.1),
        })),
      }))

      const strands: Strand[] = Array.from({ length: phone ? 7 : 13 }, () => ({
        x: rand(-w * 0.6, w),
        y: rand(h * 0.08, fieldTop + depth * 0.3),
        heading: 0,
        trail: [],
        curl: 0,
        curlAt: rand(w * 0.2, w * 0.9),
        phase: rand(0, 6),
      }))
      const resetStrand = (st: Strand) =>
        Object.assign(st, { x: rand(-240, -40), y: rand(h * 0.08, fieldTop + depth * 0.3), heading: 0, trail: [], curl: 0, curlAt: Math.random() < 0.6 ? rand(w * 0.2, w * 0.85) : Infinity, phase: rand(0, 6) })

      const leaves: Leaf[] = Array.from({ length: phone ? 16 : 30 }, () => ({
        x: rand(0, w), y: rand(0, h), r: rand(4, 9) * s, rot: rand(0, 6), spin: rand(-3, 3), phase: rand(0, 6), color: pick(LEAF_COLORS),
      }))

      const drawLayer = (ctx: CanvasRenderingContext2D, L: Layer, t: number) => {
        ctx.strokeStyle = `rgba(206,196,176,${L.alpha * 0.55})`
        ctx.lineWidth = L.stem
        for (const st of L.stalks) {
          const bend = st.lean + wind(st.x, t) * 0.5 * st.flex + Math.sin(t * 2.6 + st.phase) * 0.025
          const tipX = st.x + st.h * bend
          const tipY = h + 6 - st.h * (1 - 0.3 * bend * bend)
          const cx = st.x + st.h * bend * 0.25
          const cy = h + 6 - st.h * 0.6
          ctx.beginPath()
          ctx.moveTo(st.x, h + 6)
          ctx.quadraticCurveTo(cx, cy, tipX, tipY)
          ctx.stroke()
          // The plume carries on along the stem's last direction, so a gust
          // lays it over further than the stem.
          ctx.save()
          ctx.translate(tipX, tipY)
          ctx.rotate(Math.atan2(tipY - cy, tipX - cx) + Math.PI / 2 + bend * 0.35)
          ctx.globalAlpha = L.alpha
          ctx.drawImage(sprite, -L.plume * 0.2, -L.plume * 0.95, L.plume * 0.4, L.plume)
          ctx.restore()
        }
        ctx.globalAlpha = 1
      }

      return (ctx, t, dt) => {
        drawLayer(ctx, layers[0], t)
        drawLayer(ctx, layers[1], t)

        // Wind strands: each head steers toward the local flow and leaves a
        // fading, tapering ribbon behind it.
        ctx.lineCap = "round"
        for (const st of strands) {
          const flowX = 240 + 460 * wind(st.x, t)
          const flowY = Math.sin(st.x * 0.005 + t * 0.8 + st.phase) * 60
          const speed = Math.hypot(flowX, flowY)
          if (st.curl === 0 && st.x > st.curlAt) st.curl = 1.25 // seconds of looping
          if (st.curl > 0) {
            st.heading -= 5.2 * dt // a full turn in about 1.2s, curling upward
            st.curl = Math.max(0, st.curl - dt)
            if (st.curl === 0) st.curlAt = Infinity
          } else {
            const target = Math.atan2(flowY, flowX)
            let diff = target - st.heading
            diff = Math.atan2(Math.sin(diff), Math.cos(diff))
            st.heading += diff * Math.min(1, dt * 3)
          }
          st.x += Math.cos(st.heading) * speed * dt
          st.y += Math.sin(st.heading) * speed * dt
          st.trail.push(st.x, st.y)
          if (st.trail.length > 90) st.trail.splice(0, 2)
          const n = st.trail.length / 2
          for (let i = 1; i < n; i++) {
            const p = i / n
            ctx.strokeStyle = `rgba(255,252,245,${0.42 * p * p})`
            ctx.lineWidth = (0.4 + 2.2 * p) * s
            ctx.beginPath()
            ctx.moveTo(st.trail[(i - 1) * 2], st.trail[(i - 1) * 2 + 1])
            ctx.lineTo(st.trail[i * 2], st.trail[i * 2 + 1])
            ctx.stroke()
          }
          if (st.trail.length && st.trail[0] > w + 60) resetStrand(st)
        }

        for (const lf of leaves) {
          const gust = wind(lf.x, t)
          lf.x += (60 + 300 * gust) * dt
          lf.y += (14 + Math.sin(t * 1.5 + lf.phase) * 30 - gust * 20) * dt
          lf.rot += lf.spin * (0.6 + gust) * dt
          if (lf.x > w + 20 || lf.y > h + 20) Object.assign(lf, { x: rand(-w * 0.3, -10), y: rand(-h * 0.1, h * 0.85) })
          ctx.save()
          ctx.translate(lf.x, lf.y)
          ctx.rotate(lf.rot)
          ctx.scale(1, 0.35 + 0.65 * Math.abs(Math.sin(t * 3 + lf.phase)))
          ctx.fillStyle = lf.color
          ctx.beginPath()
          ctx.moveTo(-lf.r, 0)
          ctx.quadraticCurveTo(0, -lf.r * 0.7, lf.r, 0)
          ctx.quadraticCurveTo(0, lf.r * 0.7, -lf.r, 0)
          ctx.fill()
          ctx.restore()
        }

        drawLayer(ctx, layers[2], t)

        // The lower field sinks into shadow, as pampas does into its own
        // leaves: bare stems all the way down read as hatching, not grass.
        const shade = ctx.createLinearGradient(0, h - depth * 0.55, 0, h)
        shade.addColorStop(0, "rgba(14,11,11,0)")
        shade.addColorStop(1, "rgba(14,11,11,0.88)")
        ctx.fillStyle = shade
        ctx.fillRect(0, h - depth * 0.55, w, depth * 0.55)
      }
    }, 6)
  }, [still])

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}
