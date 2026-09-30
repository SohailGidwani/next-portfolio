"use client"

import { motion } from "framer-motion"
import { Draw, EASE_OUT } from "./Draw"

// ─── Iron Man: a HUD ────────────────────────────────────────────────────────

const CYAN = "rgba(120,215,255,"
const GOLD = "rgba(242,193,78,"

/** An SVG arc on a circle of radius r, from a0 to a1 degrees (0 = right, clockwise). */
function arc(r: number, a0: number, a1: number) {
  const rad = (a: number) => (a * Math.PI) / 180
  const x0 = r * Math.cos(rad(a0)), y0 = r * Math.sin(rad(a0))
  const x1 = r * Math.cos(rad(a1)), y1 = r * Math.sin(rad(a1))
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
}

const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i / 72) * Math.PI * 2
  const inner = i % 6 === 0 ? 188 : 196
  return `M${(Math.cos(a) * inner).toFixed(1)} ${(Math.sin(a) * inner).toFixed(1)}L${(Math.cos(a) * 204).toFixed(1)} ${(Math.sin(a) * 204).toFixed(1)}`
}).join("")

/**
 * HUD rings in the manner of the suit's display: a ticked outer ring, broken
 * arcs and a dashed track, each turning at its own speed and direction. The
 * scene draws a large one framing the content on desktop; phones get a small
 * one around the picture (`weight` thickens its strokes to match).
 */
export function HudRings({ still, className, weight = 1 }: { still: boolean; className: string; weight?: number }) {
  return (
    <svg viewBox="-220 -220 440 440" aria-hidden className={className}>
      <motion.g
        initial={{ opacity: still ? 1 : 0, scale: still ? 1 : 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
      >
        <g className="hud-spin" style={{ animationDuration: "90s" }}>
          <circle r="204" fill="none" stroke={`${CYAN}0.22)`} strokeWidth={0.6 * weight} />
          <path d={TICKS} stroke={`${CYAN}0.35)`} strokeWidth={0.7 * weight} />
        </g>
        <g className="hud-spin hud-reverse" style={{ animationDuration: "38s" }} stroke={`${CYAN}0.6)`} strokeWidth={1.6 * weight} strokeLinecap="round">
          <circle r="180" fill="none" stroke="none" />
          {[[10, 70], [120, 146], [200, 292], [322, 336]].map(([a0, a1], i) => (
            <Draw key={i} d={arc(180, a0, a1)} delay={0.35 + i * 0.08} duration={0.6} still={still} />
          ))}
        </g>
        <g className="hud-spin" style={{ animationDuration: "60s" }}>
          <circle r="164" fill="none" stroke={`${CYAN}0.3)`} strokeWidth={0.7 * weight} strokeDasharray="1.5 7" />
        </g>
        <g className="hud-spin hud-reverse" style={{ animationDuration: "24s" }} stroke={`${GOLD}0.55)`} strokeWidth={1.2 * weight} strokeLinecap="round">
          <circle r="150" fill="none" stroke="none" />
          {[[28, 52], [208, 232]].map(([a0, a1], i) => (
            <Draw key={i} d={arc(150, a0, a1)} delay={0.6 + i * 0.1} duration={0.5} still={still} />
          ))}
        </g>
      </motion.g>
    </svg>
  )
}

/**
 * The arc reactor's light behind the picture, breathing slowly. It fades in
 * with the scene and out at the first moment of closing, like the rings, so
 * it never hangs on screen while the picture flies back to its card. The
 * pulse is a CSS animation on opacity, which would override framer's, so the
 * two sit on separate layers.
 */
export function ReactorGlow({ still }: { still: boolean }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[190%] w-[190%] -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: still ? 1 : 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.2, ease: EASE_OUT } }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
    >
      <div
        className="reactor-pulse h-full w-full"
        // Strongest where the picture's edge falls (about half the radius), so
        // the light shows around the picture rather than hiding behind it.
        style={{ background: "radial-gradient(closest-side, rgba(120,220,255,0.55) 45%, rgba(60,170,220,0.22) 64%, transparent)" }}
      />
    </motion.div>
  )
}

/** A thin scan line sweeping down the display every few seconds. */
export function HudScan() {
  return (
    <div
      aria-hidden
      className="hud-scan pointer-events-none absolute inset-x-0 top-0 h-px"
      style={{ background: "linear-gradient(90deg, transparent, rgba(120,215,255,0.5) 30%, rgba(120,215,255,0.5) 70%, transparent)" }}
    />
  )
}

// ─── Spider-Man: a comic panel ──────────────────────────────────────────────

/** Ben-Day dots, heaviest at the edges and clear in the middle, drifting. */
export function Halftone() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{
        WebkitMaskImage: "radial-gradient(ellipse 72% 62% at 50% 45%, transparent 38%, black 88%)",
        maskImage: "radial-gradient(ellipse 72% 62% at 50% 45%, transparent 38%, black 88%)",
      }}
    >
      {/* Each layer drifts by exactly one dot spacing per loop, so the loop is
          seamless. The mask sits on the parent so it stays put. */}
      <div
        className="halftone-drift absolute -inset-8 opacity-60"
        style={{ backgroundImage: "radial-gradient(circle, #d0262f 0 30%, transparent 33%)", backgroundSize: "14px 14px", animationDuration: "4s" }}
      />
      <div
        className="halftone-drift halftone-reverse absolute -inset-8 opacity-30"
        style={{ backgroundImage: "radial-gradient(circle, #2446b8 0 26%, transparent 29%)", backgroundSize: "22px 22px", ["--halftone-step" as string]: "22px", animationDuration: "7s" }}
      />
    </div>
  )
}

const BURST = (() => {
  const n = 22
  const pts: string[] = []
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2
    // Irregular spikes, the way a hand-drawn impact burst is.
    const r = i % 2 === 0 ? 100 - ((i * 37) % 9) : 80 - ((i * 53) % 7)
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`)
  }
  return pts.join(" ")
})()

const SPEED_LINES = Array.from({ length: 56 }, (_, i) => {
  const a = ((i / 56) * 360 + ((i * 29) % 5)) * (Math.PI / 180)
  const r0 = 210 + ((i * 41) % 60)
  return `M${(Math.cos(a) * r0).toFixed(1)} ${(Math.sin(a) * r0).toFixed(1)}L${(Math.cos(a) * 1000).toFixed(1)} ${(Math.sin(a) * 1000).toFixed(1)}`
})

/**
 * Behind the picture: an impact burst that pops in, and speed lines radiating
 * out to the edges of the screen. Anchored to the picture itself, so it lines
 * up whatever shape and size the picture is.
 */
export function ComicBurst({ still }: { still: boolean }) {
  return (
    <>
      {/* Leaves at the first moment of closing, with the burst, rather than
          staying until the picture has flown back to its card. */}
      <motion.svg
        viewBox="-1000 -1000 2000 2000"
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[max(300vw,300vh)] -translate-x-1/2 -translate-y-1/2"
        exit={{ opacity: 0, transition: { duration: 0.12 } }}
      >
        {[0, 1].map((group) => (
          <g key={group} className="speed-flicker" style={{ animationDelay: `${group * 0.8}s` }} stroke={`rgba(255,255,255,${group ? 0.1 : 0.2})`} strokeWidth="2.4" strokeLinecap="round">
            {SPEED_LINES.filter((_, i) => i % 2 === group).map((d, i) => (
              <Draw key={i} d={d} delay={0.2 + i * 0.012} duration={0.35} still={still} />
            ))}
          </g>
        ))}
      </motion.svg>
      <motion.svg
        viewBox="-100 -100 200 200"
        preserveAspectRatio="none"
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[140%] w-[112%] md:w-[118%]"
        style={{ x: "-50%", y: "-50%" }}
        initial={{ scale: still ? 1 : 0.8, opacity: still ? 1 : 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        transition={{ type: "spring", duration: 0.5, bounce: 0.35, delay: 0.25 }}
      >
        <polygon points={BURST} fill="#c8102e" stroke="#ffd23f" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </motion.svg>
    </>
  )
}
