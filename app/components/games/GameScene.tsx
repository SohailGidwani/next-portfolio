"use client"

import { motion } from "framer-motion"
import ParticleField from "./ParticleField"
import Overgrowth from "./Overgrowth"
import TsushimaField from "./TsushimaField"
import CitySkyline from "./CitySkyline"
import MatchPlay from "./MatchPlay"

export type GameTheme = "frost" | "fireflies" | "wind" | "webs" | "pitch"

/** A light tint per scene, used for the rule under the stage title. */
export const THEME_ACCENT: Record<GameTheme, string> = {
  frost: "#9cc8ff",
  fireflies: "#ffc060",
  wind: "#d4452f",
  webs: "#e2242f",
  pitch: "#8be08f",
}

// Each scene brings its own ground colour, so the open stage replaces the
// page outright instead of dimming it. Deliberately outside the site's single
// accent: these colours belong to the games, and exist only while one is open.
const BACKDROP: Record<GameTheme, string> = {
  frost:
    "radial-gradient(55% 50% at 50% 42%, rgba(96,146,204,0.32), transparent 70%), linear-gradient(180deg, #060910 0%, #0b1422 100%)",
  fireflies:
    "radial-gradient(60% 55% at 50% 62%, rgba(222,146,62,0.26), transparent 72%), linear-gradient(180deg, #0a0806 0%, #140d07 100%)",
  wind:
    "radial-gradient(60% 50% at 50% 40%, rgba(196,52,44,0.24), transparent 72%), linear-gradient(180deg, #0c0909 0%, #121010 100%)",
  webs:
    "radial-gradient(55% 50% at 50% 45%, rgba(210,28,40,0.38), transparent 72%), linear-gradient(180deg, #0c0506 0%, #150709 100%)",
  pitch:
    "radial-gradient(70% 60% at 50% 50%, rgba(46,140,72,0.42), transparent 78%), linear-gradient(180deg, #03110a 0%, #06170d 100%)",
}

const EASE_OUT = [0.25, 1, 0.5, 1] as const // --ease-out-soft

/**
 * Draws a path in unless motion is reduced, in which case it is simply there.
 * No vector-effect="non-scaling-stroke" here: with it, browsers disagree on
 * the length the draw-in dash is measured against, and Safari stopped every
 * line partway (the pitch and webs were left half drawn). Stroke widths are
 * set per scene in drawing units instead.
 */
function Draw({ d, delay, duration = 0.7, still, ...rest }: { d: string; delay: number; duration?: number; still: boolean } & React.SVGProps<SVGPathElement>) {
  return (
    <motion.path
      d={d}
      fill="none"
      initial={{ pathLength: still ? 1 : 0, opacity: still ? 1 : 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ pathLength: { duration, delay, ease: EASE_OUT }, opacity: { duration: 0.01, delay } }}
      {...(rest as object)}
    />
  )
}

// Elder Futhark, drawn as strokes on a 10 x 16 grid. The runes are straight
// lines by nature, so paths are exact; a runic font is not installed on most
// systems and would fall back to empty boxes.
const RUNES = [
  "M3 0V16M3 3L9 0M3 8L9 5",
  "M2 16V0L8 5V16",
  "M3 0V16M3 4L8 8L3 12",
  "M3 0V16M3 0L9 4M3 5L9 9",
  "M3 16V0L8 4L3 8L8 16",
  "M8 2L3 8L8 14",
  "M2 2L9 14M9 2L2 14",
  "M3 16V0L8 4L3 8",
  "M2 0V16M8 0V16M2 5L8 11",
  "M5 0V16M2 5L8 11",
  "M5 0V16",
  "M5 16V0M5 6L1 1M5 6L9 1",
  "M5 16V0M1 5L5 0L9 5",
  "M3 0V16M3 0L8 4L3 8L8 12L3 16",
  "M2 16V0L8 6M8 16V0L2 6",
  "M5 0L9 6L1 14M5 0L1 6L9 14",
]

/**
 * The God of War rune ring. The scene draws the desktop one, sized to frame
 * the poster and the text together; phones stack the text under the poster,
 * so the stage draws a smaller one around the poster alone (`className`
 * places each).
 */
export function RuneRing({ still, className }: { still: boolean; className: string }) {
  return (
    <svg viewBox="-220 -220 440 440" aria-hidden className={className}>
      {/* Entrance and rotation live on separate groups: a CSS animation's
          transform would override framer's scale on the same element. */}
      <motion.g
        initial={{ opacity: still ? 1 : 0, scale: still ? 1 : 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        // Leaves with the stage rather than vanishing when it unmounts.
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE_OUT }}
      >
        <g className="rune-turn">
        <circle r="192" fill="none" stroke="rgba(160,200,245,0.26)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        <circle r="164" fill="none" stroke="rgba(160,200,245,0.16)" strokeWidth="1" strokeDasharray="2 7" vectorEffect="non-scaling-stroke" />
        {RUNES.map((d, i) => (
          <g key={i} transform={`rotate(${(i / RUNES.length) * 360}) translate(0 -178)`}>
            {/* The glow walks around the ring: each rune lights a beat after
                the one before it. */}
            <path
              d={d}
              transform="translate(-5 -8)"
              className="rune-glow"
              style={{ animationDelay: `${i * 0.3}s` }}
              fill="none"
              stroke="rgb(176,214,255)"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}
        </g>
      </motion.g>
    </svg>
  )
}

// One web in a 620-unit square, anchored at its top-left corner: spokes fan
// across the quarter circle, and rings sag toward the corner between spokes,
// like silk under its own weight.
const WEB_ANGLES = [0, 18, 36, 54, 72, 90].map((a) => (a * Math.PI) / 180)
const WEB_AT = (r: number, a: number) => `${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`
const WEB = {
  spokes: WEB_ANGLES.map((a) => `M0 0L${WEB_AT(600, a)}`),
  rings: [80, 170, 270, 380, 500].map((r) => {
    let d = `M${WEB_AT(r, WEB_ANGLES[0])}`
    for (let j = 0; j < WEB_ANGLES.length - 1; j++) {
      const mid = (WEB_ANGLES[j] + WEB_ANGLES[j + 1]) / 2
      d += `Q${WEB_AT(r * 0.86, mid)} ${WEB_AT(r, WEB_ANGLES[j + 1])}`
    }
    return d
  }),
}

// Each corner is its own drawing pinned to the real screen corner and
// mirrored into place. A single wide drawing cropped to fill the screen cut
// the corners, webs included, off tall phone screens.
const WEB_CORNERS = [
  "left-0 top-0",
  "right-0 top-0 -scale-x-100",
  "left-0 bottom-0 -scale-y-100",
  "right-0 bottom-0 -scale-x-100 -scale-y-100",
]

/** Four corner webs: spokes shoot out first, then the rings stitch across. */
function WebStrands({ still }: { still: boolean }) {
  return (
    <>
      {WEB_CORNERS.map((place, ci) => (
        <svg
          key={ci}
          viewBox="0 0 620 620"
          aria-hidden
          className={`pointer-events-none absolute h-[62vmin] w-[62vmin] md:h-[min(72vmin,640px)] md:w-[min(72vmin,640px)] ${place}`}
        >
          <g stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round">
            {WEB.spokes.map((d, j) => (
              <Draw key={`s${j}`} d={d} delay={0.15 + ci * 0.07 + j * 0.02} duration={0.45} still={still} />
            ))}
            {WEB.rings.map((d, k) => (
              <Draw key={`r${k}`} d={d} delay={0.45 + k * 0.09 + ci * 0.05} duration={0.6} still={still} />
            ))}
          </g>
        </svg>
      ))}
    </>
  )
}

// A 105 x 68 m pitch at 10 units per metre, with a 25-unit margin.
const PITCH = (() => {
  const side = (m: (x: number) => number) => [
    `M${m(25)} 138.5H${m(190)}V541.5H${m(25)}`,
    `M${m(25)} 248.5H${m(80)}V431.5H${m(25)}`,
    `M${m(25)} 303.4H${m(13)}V376.6H${m(25)}`,
  ]
  const mirror = (x: number) => 1050 - x
  return {
    lines: [
      "M25 25H1025V655H25Z",
      "M525 25V655",
      "M525 248.5A91.5 91.5 0 1 1 525 431.5A91.5 91.5 0 1 1 525 248.5",
      ...side((x) => x),
      ...side(mirror),
      "M190 266.9A91.5 91.5 0 0 1 190 413.1",
      "M860 266.9A91.5 91.5 0 0 0 860 413.1",
      "M25 35A10 10 0 0 0 35 25",
      "M1015 25A10 10 0 0 0 1025 35",
      "M25 645A10 10 0 0 1 35 655",
      "M1015 655A10 10 0 0 1 1025 645",
    ],
    spots: [
      [525, 340],
      [135, 340],
      [915, 340],
    ],
  }
})()

function PitchLines({ still, vertical }: { still: boolean; vertical: boolean }) {
  return (
    <svg
      // Portrait screens get the pitch turned end-on, so the whole field fits
      // and the poster still sits in the centre circle.
      viewBox={vertical ? "185 -185 680 1050" : "0 0 1050 680"}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
      className={`pointer-events-none absolute inset-[4%] h-[92%] w-[92%] ${vertical ? "md:hidden" : "hidden md:block"}`}
    >
      {/* Drawing units: the portrait pitch is drawn at about half the scale
          of the landscape one, so its lines are thicker to land at a similar
          on-screen weight. */}
      <g
        transform={vertical ? "rotate(90 525 340)" : undefined}
        stroke="rgba(235,255,240,0.42)"
        strokeWidth={vertical ? 2.6 : 1.4}
        strokeLinecap="round"
      >
        {PITCH.lines.map((d, i) => (
          <Draw key={i} d={d} delay={0.15 + i * 0.06} duration={i === 0 ? 1.1 : 0.7} still={still} />
        ))}
        {PITCH.spots.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="3.5"
            fill="rgba(235,255,240,0.6)"
            stroke="none"
            initial={{ opacity: still ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.9 + i * 0.1 }}
          />
        ))}
      </g>
    </svg>
  )
}

/**
 * The backdrop of the open game stage: a tinted ground plus one scene tied to
 * the game. `still` (reduced motion) renders every scene at rest.
 */
export default function GameScene({ theme, still }: { theme: GameTheme; still: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ background: BACKDROP[theme] }}>
      {theme === "frost" ? (
        <>
          <RuneRing
            still={still}
            className="pointer-events-none absolute left-1/2 top-1/2 hidden h-[min(155vh,1500px)] w-[min(155vh,1500px)] -translate-x-1/2 -translate-y-1/2 md:block"
          />
          <ParticleField kind="snow" still={still} />
        </>
      ) : null}
      {theme === "fireflies" ? (
        <>
          <Overgrowth still={still} />
          <ParticleField kind="fireflies" still={still} />
        </>
      ) : null}
      {theme === "wind" ? <TsushimaField still={still} /> : null}
      {theme === "webs" ? (
        <>
          <CitySkyline still={still} />
          <WebStrands still={still} />
        </>
      ) : null}
      {theme === "pitch" ? (
        <>
          {/* Mowing stripes: alternate bands a shade lighter, running across
              the pitch in whichever orientation it is drawn. */}
          <div
            className="absolute inset-0 hidden opacity-[0.05] md:block"
            style={{ background: "repeating-linear-gradient(90deg, #fff 0 6.25%, transparent 6.25% 12.5%)" }}
          />
          <div
            className="absolute inset-0 opacity-[0.05] md:hidden"
            style={{ background: "repeating-linear-gradient(0deg, #fff 0 6.25%, transparent 6.25% 12.5%)" }}
          />
          <PitchLines still={still} vertical={false} />
          <PitchLines still={still} vertical />
          <MatchPlay still={still} />
        </>
      ) : null}
    </div>
  )
}
