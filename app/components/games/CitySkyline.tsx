"use client"

import { useEffect, useRef } from "react"
import { clamp, rand, runCanvas } from "./canvasLoop"

type Building = { x: number; w: number; h: number; top?: { w: number; h: number }; mast?: number; tower?: boolean }
type Win = { x: number; y: number; phase: number; period: number }
type Beacon = { x: number; y: number; phase: number }

// Far to near: hazier and redder behind, near-black in front.
const DEPTHS = [
  { color: "#2e0a10", minH: 0.16, maxH: 0.34, minW: 34, maxW: 80, lit: 0 },
  { color: "#1b0508", minH: 0.09, maxH: 0.25, minW: 44, maxW: 110, lit: 0.2 },
  { color: "#0b0204", minH: 0.05, maxH: 0.15, minW: 60, maxW: 150, lit: 0.26 },
] as const

/**
 * Spider-Man: Manhattan at night across the bottom of the stage, lit windows
 * flickering on and off and beacons blinking on the spires.
 */
export default function CitySkyline({ still }: { still: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) return
    return runCanvas(ref.current, still, (w, h) => {
      const phone = w < 768
      const s = clamp(Math.min(w, h) / 900, 0.5, 1.3)
      const scale = phone ? 0.6 : 1
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      // The skyline itself never changes, so it is drawn once off-screen.
      const off = document.createElement("canvas")
      off.width = Math.round(w * dpr)
      off.height = Math.round(h * dpr)
      const o = off.getContext("2d")
      const flicker: Win[] = []
      const beacons: Beacon[] = []

      if (o) {
        o.scale(dpr, dpr)
        const tallest = h * DEPTHS[0].maxH * scale
        const glow = o.createLinearGradient(0, h - tallest * 1.4, 0, h)
        glow.addColorStop(0, "rgba(200,30,40,0)")
        glow.addColorStop(1, "rgba(200,30,40,0.22)")
        o.fillStyle = glow
        o.fillRect(0, h - tallest * 1.4, w, tallest * 1.4)

        DEPTHS.forEach((D, di) => {
          const buildings: Building[] = []
          for (let x = -20; x < w + 20; ) {
            const bw = rand(D.minW, D.maxW) * s * (phone ? 0.75 : 1)
            const b: Building = { x, w: bw, h: h * rand(D.minH, D.maxH) * scale }
            if (Math.random() < 0.4) b.top = { w: bw * rand(0.45, 0.7), h: b.h * rand(0.08, 0.22) }
            if (Math.random() < (di === 0 ? 0.25 : 0.12)) b.mast = b.h * rand(0.08, 0.16)
            if (di === 2 && Math.random() < 0.22) b.tower = true
            buildings.push(b)
            x += bw + rand(0, 6) * s
          }
          if (di === 0) {
            // Two recognisable spires in the far layer: a stepped tower with
            // a mast, and a tapered crown.
            const es = { x: w * 0.2, w: 70 * s * (phone ? 0.75 : 1), h: h * 0.3 * scale }
            buildings.push({ ...es, top: { w: es.w * 0.6, h: es.h * 0.14 }, mast: es.h * 0.2 })
            buildings.push({ x: w * 0.78, w: 56 * s * (phone ? 0.75 : 1), h: h * 0.33 * scale, mast: h * 0.05 * scale })
          }
          o.fillStyle = D.color
          for (const b of buildings) {
            const top = h - b.h
            o.fillRect(b.x, top, b.w, b.h)
            let roof = top
            const cx = b.x + b.w / 2
            if (b.top) {
              o.fillRect(cx - b.top.w / 2, top - b.top.h, b.top.w, b.top.h)
              roof = top - b.top.h
            }
            if (b.mast) {
              o.fillRect(cx - 1.2 * s, roof - b.mast, 2.4 * s, b.mast)
              beacons.push({ x: cx, y: roof - b.mast, phase: rand(0, 6) })
            }
            if (b.tower) {
              // Rooftop water tower: a tank on thin legs.
              const tw = 14 * s
              o.fillRect(cx - tw / 2, top - 22 * s, tw, 12 * s)
              o.beginPath()
              o.moveTo(cx - tw / 2 - 1, top - 22 * s)
              o.lineTo(cx, top - 28 * s)
              o.lineTo(cx + tw / 2 + 1, top - 22 * s)
              o.fill()
              o.fillRect(cx - tw / 2 + 1, top - 10 * s, 1.5 * s, 10 * s)
              o.fillRect(cx + tw / 2 - 2.5, top - 10 * s, 1.5 * s, 10 * s)
            }
            if (D.lit > 0) {
              for (let wy = top + 8 * s; wy < h - 6 * s; wy += 9 * s) {
                for (let wx = b.x + 5 * s; wx < b.x + b.w - 5 * s; wx += 7 * s) {
                  const r = Math.random()
                  if (r < 0.035) flicker.push({ x: wx, y: wy, phase: rand(0, 6), period: rand(3, 9) })
                  else if (r < D.lit) {
                    o.fillStyle = `rgba(255,${Math.round(rand(180, 214))},${Math.round(rand(110, 150))},${rand(0.45, 0.9)})`
                    o.fillRect(wx, wy, 2.2 * s, 3.2 * s)
                    o.fillStyle = D.color
                  }
                }
              }
            }
          }
        })
      }

      return (ctx, t) => {
        ctx.drawImage(off, 0, 0, w, h)

        for (const fw of flicker) {
          if (Math.sin((t / fw.period) * Math.PI * 2 + fw.phase) > 0.2) {
            ctx.fillStyle = "rgba(255,204,132,0.85)"
            ctx.fillRect(fw.x, fw.y, 2.2 * s, 3.2 * s)
          }
        }

        for (const b of beacons) {
          const on = ((t * 0.65 + b.phase) % 1) < 0.22
          if (!on) continue
          const glow = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, 9 * s)
          glow.addColorStop(0, "rgba(255,70,70,0.95)")
          glow.addColorStop(1, "rgba(255,40,40,0)")
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(b.x, b.y, 9 * s, 0, Math.PI * 2)
          ctx.fill()
        }
      }
    })
  }, [still])

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}
