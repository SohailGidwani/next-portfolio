"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { useSettledInView } from "@/app/hooks/useSettledInView"

const EASE_OUT = [0.25, 1, 0.5, 1] as const // --ease-out-soft

// Three labelled inputs on the left, fused in the middle, the diagnosis on
// the right. Sized to sit beside the card text at the same height as the
// Neuro-Var-JEPA slice.
const W = 164
const H = 160
const TILE = 32
const X0 = 2
const INPUTS = [
  { y: 24, label: "T1 MRI" },
  { y: 80, label: "DTI FA" },
  { y: 136, label: "CLINICAL" },
]
const FUSE = { x: 112, y: 80, r: 12 }
const OUT = { x: 153, y: 80, r: 7 }
const MASKED = 0 // T1 drops out, and the diagnosis still arrives without it

// Each lane leaves its tile level, then bends into the fusion block.
const P0 = (y: number) => [X0 + TILE + 3, y]
const C1 = (y: number) => [X0 + TILE + 42, y]
const C2 = [FUSE.x - 36, FUSE.y]
const P3 = [FUSE.x - FUSE.r - 2, FUSE.y]
const lane = (y: number) => `M${P0(y)}C${C1(y)} ${C2} ${P3}`

/** Points along a lane, for a packet of signal to travel it. */
function lanePoints(y: number) {
  const xs: number[] = []
  const ys: number[] = []
  const [a, b, c, d] = [P0(y), C1(y), C2, P3]
  for (let i = 0; i <= 16; i++) {
    const t = i / 16
    const u = 1 - t
    xs.push(u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0])
    ys.push(u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1])
  }
  return { xs, ys }
}
const PATHS = INPUTS.map((input) => lanePoints(input.y))

type Phase = "idle" | "all" | "masked"

// One beat of signal: packets run the open lanes, meet in the fusion block,
// and one carries on to the diagnosis. Seconds from the start of the beat;
// the first beat waits for the lanes to draw, the second starts at once.
const TRAVEL = 0.6
const OUT_TRAVEL = 0.3
const beatTimes = (first: boolean) => {
  const packets = first ? 0.5 : 0.3
  const arrive = packets + TRAVEL
  return { packets, arrive, done: arrive + OUT_TRAVEL }
}
const HOLD = 0.9 // between the diagnosis landing and T1 dropping out

/** What each input is, drawn small inside its tile: MRI patches, fibre tracts, score bars. */
function Glyph({ i, y }: { i: number; y: number }) {
  const top = y - TILE / 2
  if (i === 0) {
    // An axial slice in patches, the same picture as the JEPA card at a glance.
    const rows = [[1, 2], [0, 3], [0, 3], [1, 2]]
    const cells = rows.flatMap(([c0, c1], r) =>
      Array.from({ length: c1 - c0 + 1 }, (_, k) => (
        <rect key={`${r}-${k}`} x={X0 + 5 + (c0 + k) * 5.75} y={top + 5 + r * 5.75} width={4.5} height={4.5} rx={0.8} />
      )),
    )
    return <g style={{ fill: "var(--muted)" }}>{cells}</g>
  }
  if (i === 1) {
    return (
      <g fill="none" strokeWidth={1.3} strokeLinecap="round" style={{ stroke: "var(--muted)" }}>
        {[-6.5, 0, 6.5].map((dy, k) => (
          <path
            key={k}
            d={`M${X0 + 6} ${y + dy}c3 ${k === 1 ? -4 : -3} 6 ${k === 1 ? 4 : 3} 10 0s7 ${k === 1 ? -4 : -3} 10 0`}
          />
        ))}
      </g>
    )
  }
  return (
    <g style={{ fill: "var(--muted)" }}>
      {[15, 10, 13].map((len, k) => (
        <g key={k}>
          <circle cx={X0 + 8} cy={y - 7 + k * 7} r={1.4} />
          <rect x={X0 + 11.5} y={y - 8.1 + k * 7} width={len} height={2.2} rx={1.1} />
        </g>
      ))}
    </g>
  )
}

// Scaled SVG parts leave transform-origin to framer, which centres it on each
// element in drawing units. Adding transform-box: fill-box on top re-bases
// that origin onto the element's own box, and a growing ring then slides off
// toward the top left instead of rippling in place.

/**
 * MEMOIR-VLM in two beats: T1 MRI, DTI and clinical scores flow into the
 * fusion block and out comes the diagnosis; then T1 goes missing, and the
 * diagnosis still arrives from the other two, which is the point of a
 * missing-modality-aware model. Plays once the visitor has stopped on it, again
 * whenever `replay` changes.
 */
export default function MemoirFusion({ replay }: { replay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  // Plays when the visitor stops on it, not while a flick carries it past.
  const inView = useSettledInView(ref)
  const reduce = useReducedMotion() ?? false
  // Always idle on first render: the reduced-motion preference is unknown on
  // the server, so choosing the settled phase here would break hydration.
  const [phase, setPhase] = useState<Phase>("idle")
  const [run, setRun] = useState(0)

  useEffect(() => {
    if (reduce) {
      setPhase("masked")
      return
    }
    if (!inView) return
    setPhase("idle")
    const timers = [
      window.setTimeout(() => {
        setRun((n) => n + 1)
        setPhase("all")
      }, 250),
      window.setTimeout(() => setPhase("masked"), 250 + (beatTimes(true).done + HOLD) * 1000),
    ]
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [inView, replay, reduce])

  const on = phase !== "idle"
  const animate = on && !reduce
  // Instant when resetting for a replay, so nothing visibly runs backwards.
  const timed = (delay: number, duration: number) => (animate ? { duration, delay, ease: EASE_OUT } : { duration: 0 })
  const beat = beatTimes(phase !== "masked")
  const muted = "var(--muted)"

  return (
    <div ref={ref} className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-3">
      {/* Decorative: inside the card's link, whose text already says all this. */}
      {/* overflow-visible: the ripple off the diagnosis runs past the edge. */}
      <svg viewBox={`0 0 ${W} ${H}`} aria-hidden className="w-36 shrink-0 overflow-visible sm:w-44">
        {INPUTS.map(({ y, label }, i) => {
          const masked = i === MASKED && phase === "masked"
          return (
            <g key={label}>
              <motion.g initial={false} animate={{ opacity: masked ? 0.35 : on ? 1 : 0.5 }} transition={timed(on ? i * 0.08 : 0, 0.3)}>
                <rect
                  x={X0}
                  y={y - TILE / 2}
                  width={TILE}
                  height={TILE}
                  rx={3.5}
                  strokeWidth={1}
                  strokeDasharray={masked ? "3 2.5" : undefined}
                  style={{ fill: "var(--card)", stroke: masked ? muted : on ? "var(--accent)" : "var(--border)", strokeOpacity: on && !masked ? 0.55 : 1 }}
                />
                <Glyph i={i} y={y} />
              </motion.g>
              {/* Labels sit on the side of the lane it bends away from: above
                  for the top two, below for the bottom one, which rises. */}
              <text
                x={X0 + TILE + 9}
                y={i === INPUTS.length - 1 ? y + 12 : y - 5}
                className="font-mono"
                style={{ fontSize: 8, letterSpacing: 0.9, fill: muted, textDecoration: masked ? "line-through" : undefined }}
              >
                {label}
              </text>

              {/* The gap a missing input leaves: a dashed trace of its lane. */}
              <motion.path
                d={lane(y)}
                fill="none"
                strokeWidth={1}
                strokeDasharray="2.5 3"
                style={{ stroke: muted }}
                initial={false}
                animate={{ opacity: masked ? 0.8 : 0 }}
                transition={timed(0, 0.3)}
              />
              <motion.path
                d={lane(y)}
                fill="none"
                strokeWidth={1.5}
                strokeLinecap="round"
                style={{ stroke: "var(--accent)" }}
                initial={false}
                animate={{ pathLength: on ? 1 : 0, opacity: masked ? 0 : on ? 0.55 : 0 }}
                transition={{ pathLength: timed(0.05 + i * 0.1, 0.45), opacity: masked ? timed(0, 0.3) : timed(0.05 + i * 0.1, 0.01) }}
              />

              {/* A struck-out badge on the missing input. */}
              <motion.g
                initial={false}
                animate={masked ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                transition={masked && !reduce ? { type: "spring", duration: 0.35, bounce: 0.3 } : { duration: 0 }}
              >
                <circle cx={X0 + TILE} cy={y - TILE / 2} r={5.5} strokeWidth={1} style={{ fill: "var(--card)", stroke: "var(--accent)" }} />
                <path
                  d={`M${X0 + TILE - 2} ${y - TILE / 2 - 2}l4 4m0 -4l-4 4`}
                  strokeWidth={1.2}
                  strokeLinecap="round"
                  style={{ stroke: "var(--accent)" }}
                />
              </motion.g>
            </g>
          )
        })}

        {/* One beat of signal down every open lane, keyed so each beat plays fresh. */}
        {animate
          ? INPUTS.map((input, i) =>
              phase === "masked" && i === MASKED ? null : (
                <motion.circle
                  key={`${run}-${phase}-${i}`}
                  r={2.4}
                  style={{ fill: "var(--accent)" }}
                  initial={{ cx: PATHS[i].xs[0], cy: PATHS[i].ys[0], opacity: 0 }}
                  animate={{ cx: PATHS[i].xs, cy: PATHS[i].ys, opacity: [0, 1, 1, 0] }}
                  transition={{
                    cx: { duration: TRAVEL, delay: beat.packets, ease: "easeInOut" },
                    cy: { duration: TRAVEL, delay: beat.packets, ease: "easeInOut" },
                    opacity: { duration: TRAVEL, delay: beat.packets, times: [0, 0.12, 0.85, 1] },
                  }}
                />
              ),
            )
          : null}

        {/* The fusion block, with a ring each time the signals meet in it. */}
        <motion.g
          initial={false}
          animate={on ? { opacity: 1, scale: 1 } : { opacity: 0.45, scale: 0.85 }}
          transition={animate ? { type: "spring", duration: 0.45, bounce: 0.3, delay: 0.4 } : { duration: 0 }}
        >
          <circle cx={FUSE.x} cy={FUSE.y} r={FUSE.r} strokeWidth={1.5} style={{ fill: "var(--card)", stroke: "var(--accent)" }} />
          <circle cx={FUSE.x} cy={FUSE.y} r={FUSE.r - 5} strokeWidth={1} style={{ fill: "none", stroke: "var(--accent)", strokeOpacity: 0.45 }} />
          <circle cx={FUSE.x} cy={FUSE.y} r={2.6} style={{ fill: "var(--accent)" }} />
        </motion.g>
        {animate ? (
          <motion.circle
            key={`fuse-${run}-${phase}`}
            cx={FUSE.x}
            cy={FUSE.y}
            r={FUSE.r}
            fill="none"
            strokeWidth={1.2}
            style={{ stroke: "var(--accent)" }}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 0.7, 0], scale: [1, 1, 1.7] }}
            transition={{ duration: 0.55, delay: beat.arrive, times: [0, 0.05, 1], ease: EASE_OUT }}
          />
        ) : null}

        {/* Out to the diagnosis. */}
        <motion.path
          d={`M${FUSE.x + FUSE.r + 2} ${FUSE.y}H${OUT.x - OUT.r - 2}`}
          fill="none"
          strokeWidth={1.5}
          strokeLinecap="round"
          style={{ stroke: "var(--accent)" }}
          initial={false}
          animate={{ pathLength: on ? 1 : 0, opacity: on ? 0.55 : 0 }}
          transition={{ pathLength: timed(beat.arrive, OUT_TRAVEL), opacity: timed(beat.arrive, 0.01) }}
        />
        {animate ? (
          <motion.circle
            key={`out-${run}-${phase}`}
            cy={FUSE.y}
            r={2.4}
            style={{ fill: "var(--accent)" }}
            initial={{ cx: FUSE.x + FUSE.r + 2, opacity: 0 }}
            animate={{ cx: OUT.x - OUT.r, opacity: [0, 1, 1, 0] }}
            transition={{
              cx: { duration: OUT_TRAVEL, delay: beat.arrive, ease: "easeIn" },
              opacity: { duration: OUT_TRAVEL, delay: beat.arrive, times: [0, 0.15, 0.85, 1] },
            }}
          />
        ) : null}
        <motion.circle
          cx={OUT.x}
          cy={OUT.y}
          r={OUT.r}
          style={{ fill: "var(--accent)" }}
          initial={false}
          animate={on ? { opacity: 1, scale: 1 } : { opacity: 0.25, scale: 0.7 }}
          transition={animate ? { type: "spring", duration: 0.4, bounce: 0.35, delay: beat.done } : { duration: 0 }}
        />
        {animate ? (
          <motion.circle
            key={`dx-${run}-${phase}`}
            cx={OUT.x}
            cy={OUT.y}
            r={OUT.r}
            fill="none"
            strokeWidth={1.2}
            style={{ stroke: "var(--accent)" }}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 0.8, 0], scale: [1, 1, 2.3] }}
            transition={{ duration: 0.7, delay: beat.done, times: [0, 0.05, 1], ease: EASE_OUT }}
          />
        ) : null}
        <text
          x={OUT.x}
          y={OUT.y + OUT.r + 12}
          textAnchor="middle"
          className="font-mono"
          style={{ fontSize: 8, letterSpacing: 0.9, fill: muted }}
        >
          DX
        </text>
      </svg>
      <ul aria-hidden className="space-y-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
        <li className="flex items-center gap-2">
          <span className="h-0.5 w-3 rounded-full bg-accent" />
          Input
        </li>
        <li className="flex items-center gap-2">
          <span className="h-0 w-3 border-t border-dashed border-muted-foreground" />
          Missing
        </li>
        <li className="flex items-center gap-2">
          <span className="ml-0.5 h-2.5 w-2.5 rounded-full bg-accent" />
          Diagnosis
        </li>
      </ul>
    </div>
  )
}
