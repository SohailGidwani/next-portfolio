"use client"

import { useEffect, useRef } from "react"
import { rand, runCanvas } from "./canvasLoop"

export type ParticleKind = "snow" | "fireflies"

type Particle = { x: number; y: number; vx: number; vy: number; r: number; alpha: number; phase: number }

// Kept small on purpose: the scene is ambience behind a poster, and canvas
// cost scales with the count.
const COUNT: Record<ParticleKind, number> = { snow: 110, fireflies: 34 }

/**
 * A full-bleed canvas of drifting particles for the game stage: snowfall or
 * fireflies. Runs only while the stage is open, and draws a single frame when
 * `still`, which is how reduced motion gets the scene without the movement.
 */
export default function ParticleField({ kind, still }: { kind: ParticleKind; still: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) return

    // Firefly glow is drawn from one pre-rendered sprite: a radial gradient
    // per particle per frame is the expensive part of a glow.
    const sprite = document.createElement("canvas")
    if (kind === "fireflies") {
      sprite.width = sprite.height = 64
      const s = sprite.getContext("2d")
      if (s) {
        const g = s.createRadialGradient(32, 32, 0, 32, 32, 32)
        g.addColorStop(0, "rgba(255,236,170,1)")
        g.addColorStop(0.18, "rgba(255,190,96,0.85)")
        g.addColorStop(0.5, "rgba(255,160,60,0.18)")
        g.addColorStop(1, "rgba(255,150,50,0)")
        s.fillStyle = g
        s.fillRect(0, 0, 64, 64)
      }
    }

    return runCanvas(
      ref.current,
      still,
      (w, h) => {
        const spawn = (initial: boolean): Particle => {
          if (kind === "snow") {
            const r = rand(0.6, 2.6)
            return {
              x: rand(0, w),
              y: initial ? rand(-h, h) : rand(-24, -4),
              vx: rand(-6, 6),
              // Bigger flakes read as nearer, so they fall faster and brighter.
              vy: 14 + r * rand(10, 18),
              r,
              alpha: 0.25 + (r / 2.6) * 0.65,
              phase: rand(0, Math.PI * 2),
            }
          }
          return {
            x: rand(0, w),
            y: initial ? rand(h * 0.15, h) : h + rand(10, 40),
            vx: 0,
            vy: -rand(6, 16),
            r: rand(10, 22),
            alpha: 0,
            phase: rand(0, Math.PI * 2),
          }
        }
        const particles = Array.from({ length: COUNT[kind] }, () => spawn(true))

        return (ctx, t, dt) => {
          if (kind === "fireflies") ctx.globalCompositeOperation = "lighter"
          for (let i = 0; i < particles.length; i++) {
            const p = particles[i]
            if (kind === "snow") {
              p.y += p.vy * dt
              p.x += (p.vx + Math.sin(t * 0.8 + p.phase) * 10) * dt
              if (p.y > h + 6) particles[i] = spawn(false)
              ctx.fillStyle = `rgba(226,238,255,${p.alpha})`
              ctx.beginPath()
              ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
              ctx.fill()
            } else {
              p.y += p.vy * dt
              p.x += Math.sin(t * 0.6 + p.phase) * 16 * dt
              if (p.y < -30) particles[i] = spawn(false)
              // Each one blinks on its own rhythm; squared so it rests dark.
              const blink = Math.max(0, Math.sin(t * 1.1 + p.phase * 3))
              ctx.globalAlpha = 0.15 + 0.85 * blink * blink
              ctx.drawImage(sprite, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2)
            }
          }
          ctx.globalAlpha = 1
          ctx.globalCompositeOperation = "source-over"
        }
      },
      2,
    )
  }, [kind, still])

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}
