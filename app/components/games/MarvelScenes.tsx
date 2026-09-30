"use client"

import { motion } from "framer-motion"
import { Draw, EASE_OUT } from "./Draw"
import { useBeat, type Beat, type BeatPlan } from "./useBeat"

// ─── Iron Man: a backup plan, and a backup for the backup ───────────────────
//
// The scene acts out the reason he is a favourite rather than the look of the
// suit. The HUD's three rings are three plans. One is live; every few seconds
// it fails, the next takes over in the same instant, and the failed one
// rebuilds and rejoins as the last spare. There is never a moment with
// nothing running.

const CYAN = "rgba(120,215,255,"
const GOLD = "rgba(242,193,78,1)"
const RED = "rgba(255,98,82,1)"

// A beat is one failover. Stages of the plan that just failed: 0 faulting,
// 1 down, 2 rebuilding, 3 ready again.
const FAILOVER: BeatPlan = {
  key: "failover",
  period: 5,
  marks: [0.5, 1.4, 2.7],
  firstAt: 2.4,
  // The still says it in one frame: A has gone down and B is carrying on.
  rest: { n: 1, stage: 1 },
}

type PlanState = "live" | "ready" | "fault" | "down" | "rebuild"
const AFTER_FAILING = ["fault", "down", "rebuild", "ready"] as const

function planStates({ n, stage }: Beat): PlanState[] {
  const live = n % 3
  const failed = n > 0 ? (n - 1) % 3 : -1
  return [0, 1, 2].map((i) => (i === live ? "live" : i === failed ? AFTER_FAILING[stage] : "ready"))
}

/** An SVG arc on a circle of radius r, from a0 to a1 degrees (0 = right, clockwise). */
function arc(r: number, a0: number, a1: number) {
  const rad = (a: number) => (a * Math.PI) / 180
  const x0 = r * Math.cos(rad(a0)), y0 = r * Math.sin(rad(a0))
  const x1 = r * Math.cos(rad(a1)), y1 = r * Math.sin(rad(a1))
  return `M${x0.toFixed(1)} ${y0.toFixed(1)}A${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`
}

const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i / 72) * Math.PI * 2
  const inner = i % 6 === 0 ? 192 : 198
  return `M${(Math.cos(a) * inner).toFixed(1)} ${(Math.sin(a) * inner).toFixed(1)}L${(Math.cos(a) * 204).toFixed(1)} ${(Math.sin(a) * 204).toFixed(1)}`
}).join("")

// Plan A is the outer ring, C the inner. Each turns at its own speed.
const PLANS = [
  { r: 184, arcs: [[8, 74], [112, 150], [196, 286], [318, 340]], spin: "44s", reverse: true },
  { r: 166, arcs: [[40, 118], [160, 236], [280, 350]], spin: "58s", reverse: false },
  { r: 148, arcs: [[20, 66], [140, 204], [250, 322]], spin: "36s", reverse: true },
]

// How a ring looks in each state. A failed ring pulls back to stubs, then
// draws itself out again in gold before settling to a dim, ready cyan.
const LOOK: Record<PlanState, { stroke: string; opacity: number | number[]; pathLength: number; width: number }> = {
  live: { stroke: `${CYAN}1)`, opacity: 0.95, pathLength: 1, width: 2.3 },
  ready: { stroke: `${CYAN}1)`, opacity: 0.28, pathLength: 1, width: 1.2 },
  fault: { stroke: RED, opacity: [1, 0.15, 0.9, 0.2, 1, 0.35], pathLength: 1, width: 2.3 },
  down: { stroke: RED, opacity: 0.4, pathLength: 0.2, width: 1.4 },
  rebuild: { stroke: GOLD, opacity: 0.8, pathLength: 1, width: 1.4 },
}
const CHANGE: Record<PlanState, { duration: number }> = {
  live: { duration: 0.16 }, // taking over is immediate
  ready: { duration: 0.6 },
  fault: { duration: 0.5 },
  down: { duration: 0.35 },
  rebuild: { duration: 1.2 },
}

/**
 * The three plan rings inside a ticked outer ring. The scene draws a large
 * one framing the content on desktop; phones get a small one around the
 * picture (`weight` thickens its strokes to match). Both read the same beat.
 */
export function HudRings({ still, className, weight = 1, labels = false }: { still: boolean; className: string; weight?: number; labels?: boolean }) {
  const beat = useBeat(FAILOVER, still)
  const states = planStates(beat)
  const opening = beat.n === 0 && !still

  return (
    <svg viewBox="-220 -220 440 440" aria-hidden className={className}>
      <motion.g
        initial={{ opacity: still ? 1 : 0, scale: still ? 1 : 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        transition={{ duration: 0.8, delay: 0.2, ease: EASE_OUT }}
      >
        <g className="hud-spin" style={{ animationDuration: "90s" }}>
          <circle r="204" fill="none" stroke={`${CYAN}0.2)`} strokeWidth={0.6 * weight} />
          <path d={TICKS} stroke={`${CYAN}0.3)`} strokeWidth={0.7 * weight} />
        </g>

        {PLANS.map((plan, i) => {
          const look = LOOK[states[i]]
          return (
            <g key={i} className={`hud-spin ${plan.reverse ? "hud-reverse" : ""}`} style={{ animationDuration: plan.spin }} strokeLinecap="round">
              {/* A full circle, so the group's box is centred and it turns in place. */}
              <circle r={plan.r} fill="none" stroke="none" />
              {plan.arcs.map(([a0, a1], k) => (
                <motion.path
                  key={k}
                  d={arc(plan.r, a0, a1)}
                  fill="none"
                  initial={still ? false : { pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: look.pathLength, opacity: look.opacity, stroke: look.stroke, strokeWidth: look.width * weight }}
                  transition={
                    opening
                      ? { duration: 0.6, delay: 0.35 + i * 0.12 + k * 0.06, ease: EASE_OUT }
                      : { ...CHANGE[states[i]], ease: EASE_OUT }
                  }
                />
              ))}
            </g>
          )
        })}

        {/* Which ring is which plan: fixed tags up and to the right, clear of
            the picture and the text, that take their ring's colour. */}
        {labels
          ? PLANS.map((plan, i) => {
              const a = (-20 * Math.PI) / 180
              const x = Math.cos(a) * plan.r
              const y = Math.sin(a) * plan.r
              const state = states[i]
              return (
                <g key={i} transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
                  <rect x={-5} y={-4} width={10} height={8} rx={1} fill="#070b10" />
                  <text
                    textAnchor="middle"
                    y={1.3}
                    className="font-mono"
                    style={{ fontSize: 3.6, letterSpacing: 0.4, fill: state === "live" ? `${CYAN}1)` : LOOK[state].stroke, fillOpacity: state === "ready" ? 0.55 : 1 }}
                  >
                    {"ABC"[i]}
                  </text>
                </g>
              )
            })
          : null}
      </motion.g>
    </svg>
  )
}

const WORD: Record<PlanState, { label: string; color: string }> = {
  live: { label: "Live", color: `${CYAN}1)` },
  ready: { label: "Ready", color: `${CYAN}0.5)` },
  fault: { label: "Down", color: RED },
  down: { label: "Down", color: RED },
  rebuild: { label: "Rebuilding", color: GOLD },
}

/** The HUD's readout of the three plans, so the rings' story can be read as well as watched. */
export function PlanStatus({ still }: { still: boolean }) {
  const states = planStates(useBeat(FAILOVER, still))
  return (
    <ul
      aria-hidden
      className="pointer-events-none absolute left-5 top-6 space-y-1.5 font-mono text-[10px] uppercase tracking-[0.2em] md:bottom-10 md:left-10 md:top-auto md:text-[11px]"
    >
      {states.map((state, i) => (
        <li key={i} className="flex items-center gap-2.5 transition-colors duration-200" style={{ color: WORD[state].color }}>
          <span className="text-white/45">Plan {"ABC"[i]}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {WORD[state].label}
        </li>
      ))}
    </ul>
  )
}

/**
 * The arc reactor's light behind the picture, breathing slowly. When a plan
 * fails it dips for a moment and comes straight back: it never goes out. It
 * fades in with the scene and out at the first moment of closing, so it never
 * hangs on screen while the picture flies back to its card. The pulse and the
 * dip are CSS animations on opacity, which would override framer's, so each
 * sits on its own layer.
 */
export function ReactorGlow({ still }: { still: boolean }) {
  const { n } = useBeat(FAILOVER, still)
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[190%] w-[190%] -translate-x-1/2 -translate-y-1/2"
      initial={{ opacity: still ? 1 : 0 }}
      animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.2, ease: EASE_OUT } }}
      exit={{ opacity: 0, transition: { duration: 0.12 } }}
    >
      {/* Keyed by the beat, so the dip plays afresh at each failover. */}
      <div key={n} className={`h-full w-full ${n > 0 && !still ? "reactor-dip" : ""}`}>
        <div
          className="reactor-pulse h-full w-full"
          // Strongest where the picture's edge falls (about half the radius), so
          // the light shows around the picture rather than hiding behind it.
          style={{ background: "radial-gradient(closest-side, rgba(120,220,255,0.55) 45%, rgba(60,170,220,0.22) 64%, transparent)" }}
        />
      </div>
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

// ─── Spider-Man: he gets back up, every time ────────────────────────────────
//
// Again the reason, not the costume. Every few seconds a hit lands on the
// picture's edge: the burst behind it buckles and sinks and the speed lines
// go slack. Then it rises again, and two caption boxes keep count. The
// picture itself stays still, so the quote beside it can be read.

// A beat is one knockdown. Stages: 0 the hit, 1 down, 2 rising, 3 back up.
const KNOCKDOWN: BeatPlan = {
  key: "knockdown",
  period: 4.6,
  marks: [0.14, 1.05, 1.8],
  firstAt: 1.9,
  // The still: up again, with the count showing he was put down once.
  rest: { n: 1, stage: 3 },
}

// Where each hit lands on the picture's edge, in turn.
const HITS = [
  { left: "0%", top: "36%" },
  { left: "100%", top: "24%" },
  { left: "24%", top: "100%" },
  { left: "100%", top: "72%" },
  { left: "10%", top: "0%" },
]

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

function spikes(n: number, outer: (i: number) => number, inner: (i: number) => number) {
  const pts: string[] = []
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * Math.PI * 2
    const r = i % 2 === 0 ? outer(i) : inner(i)
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`)
  }
  return pts.join(" ")
}
// Irregular spikes, the way a hand-drawn impact burst is.
const BURST = spikes(22, (i) => 100 - ((i * 37) % 9), (i) => 80 - ((i * 53) % 7))
const IMPACT = spikes(9, (i) => 100 - ((i * 29) % 18), (i) => 46 - ((i * 17) % 8))

const SPEED_LINES = Array.from({ length: 56 }, (_, i) => {
  const a = ((i / 56) * 360 + ((i * 29) % 5)) * (Math.PI / 180)
  const r0 = 210 + ((i * 41) % 60)
  return `M${(Math.cos(a) * r0).toFixed(1)} ${(Math.sin(a) * r0).toFixed(1)}L${(Math.cos(a) * 1000).toFixed(1)} ${(Math.sin(a) * 1000).toFixed(1)}`
})

const LEAVE = { opacity: 0, transition: { duration: 0.12 } }
const CAPTION = "absolute z-10 whitespace-nowrap border-2 border-black px-2 py-1 font-mono text-[10px] font-bold uppercase leading-none tracking-[0.14em] shadow-[2px_2px_0_#000] md:text-[11px]"

/** A caption box's number, which jumps a little each time it goes up. */
function Count({ value }: { value: number }) {
  return (
    <motion.span
      key={value}
      className="ml-1.5 inline-block tabular-nums"
      initial={{ scale: 1.6 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", duration: 0.35, bounce: 0.4 }}
    >
      {value}
    </motion.span>
  )
}

/**
 * Around the picture: the burst and speed lines that take each hit and get
 * back up, the flash where the hit lands, and the two caption boxes keeping
 * count. Anchored to the picture itself, so it lines up whatever shape and
 * size the picture is. Everything here leaves at the first moment of
 * closing, rather than staying until the picture has flown back to its card.
 */
export function ComicBurst({ still }: { still: boolean }) {
  const { n, stage } = useBeat(KNOCKDOWN, still)
  const down = n > 0 && stage <= 1
  const knockdowns = n
  const recoveries = stage >= 2 ? n : n - 1
  const opening = n === 0
  const hit = HITS[(n + HITS.length - 1) % HITS.length]

  return (
    <>
      <motion.svg
        viewBox="-1000 -1000 2000 2000"
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 aspect-square w-[max(300vw,300vh)]"
        style={{ x: "-50%", y: "-50%" }}
        initial={false}
        // Slack while he is down, then thrown back out as he rises.
        animate={{ scale: down ? 0.84 : 1, opacity: down ? 0.3 : 1 }}
        transition={down ? { duration: 0.16, ease: EASE_OUT } : { type: "spring", duration: 0.7, bounce: 0.45 }}
        exit={LEAVE}
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
        style={{ x: "-50%" }}
        initial={{ y: "-50%", scaleX: still ? 1 : 0.8, scaleY: still ? 1 : 0.8, rotate: 0, opacity: still ? 1 : 0 }}
        // Down: flattened, sunk and knocked askew. Up: back to full height,
        // on a spring that carries it a little past before it settles.
        animate={
          down
            ? { y: "-41%", scaleX: 1.05, scaleY: 0.58, rotate: n % 2 ? 3 : -3, opacity: 1 }
            : { y: "-50%", scaleX: 1, scaleY: 1, rotate: 0, opacity: 1 }
        }
        transition={
          down
            ? { duration: 0.16, ease: EASE_OUT }
            : opening
              ? { type: "spring", duration: 0.5, bounce: 0.35, delay: 0.25 }
              : { type: "spring", duration: 0.75, bounce: 0.5 }
        }
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        <motion.polygon
          points={BURST}
          stroke="#ffd23f"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
          initial={false}
          animate={{ fill: down ? "#4d0f1c" : "#c8102e" }}
          transition={{ duration: down ? 0.16 : 0.5, ease: EASE_OUT }}
        />
      </motion.svg>

      {/* Where the hit lands: a flash on the picture's edge, a new one each time. */}
      {n > 0 && !still ? (
        <motion.svg
          key={n}
          viewBox="-100 -100 200 200"
          aria-hidden
          className="pointer-events-none absolute z-10 aspect-square w-[clamp(64px,20%,120px)]"
          style={{ left: hit.left, top: hit.top, x: "-50%", y: "-50%" }}
          initial={{ opacity: 1, scale: 0.3, rotate: -12 }}
          animate={{ opacity: [1, 1, 0], scale: [0.3, 1.15, 1.3], rotate: 0 }}
          transition={{ duration: 0.5, times: [0, 0.35, 1], ease: EASE_OUT }}
          exit={LEAVE}
        >
          <polygon points={IMPACT} fill="#fff8e0" stroke="#ffd23f" strokeWidth="5" strokeLinejoin="round" />
        </motion.svg>
      ) : null}

      {/* The count. Down goes up with each hit; up catches it every time. */}
      {knockdowns > 0 ? (
        <motion.p
          aria-hidden
          className={`${CAPTION} -left-2 -top-3 bg-[#c8102e] text-white md:-left-4`}
          style={{ rotate: -2 }}
          initial={still ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.4 }}
          exit={LEAVE}
        >
          Knocked down
          <Count value={knockdowns} />
        </motion.p>
      ) : null}
      {recoveries > 0 ? (
        <motion.p
          aria-hidden
          className={`${CAPTION} -bottom-3 -right-2 bg-[#ffd23f] text-black md:-right-4`}
          style={{ rotate: 1.5 }}
          initial={still ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.4 }}
          exit={LEAVE}
        >
          Back up
          <Count value={recoveries} />
        </motion.p>
      ) : null}
    </>
  )
}
