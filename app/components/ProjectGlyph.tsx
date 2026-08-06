"use client"

import { useEffect, useRef, useState } from "react"

/**
 * A live schematic per project, standing in for cover art on every project
 * card at every width.
 *
 * The screenshots these replaced were a grab bag (a white document scan, an
 * indigo promo graphic, an amber-composited dashboard) that no amount of
 * shared treatment made into one visual language. These say something true
 * about each system's shape instead.
 *
 * The motion is stage-based, not a dot on a wire: a 2.5px dot is invisible at
 * card size, so instead each box LIGHTS UP as work reaches it and the wire
 * between boxes carries a bright charge. You read the pipeline running from
 * across the room, and the sequence is the point rather than decoration.
 *
 * Phasing is done with CSS custom properties rather than per-element
 * keyframes: `--cycle` sets one loop length for the whole diagram and
 * `--phase` is a negative animation-delay that offsets each stage into its
 * slot. Custom properties inherit, so a stage sets them once on its group and
 * every rect, text, and wire inside picks them up.
 *
 * Pure CSS on the theme tokens, so it themes for free, stays sharp at any
 * size, adds no JS to the bundle, and the global prefers-reduced-motion block
 * in globals.css stops all of it without a media query here. Motion only runs
 * while the card is on screen.
 */

const NODE = "var(--card)"
const LINE = "var(--border)"

const chipText = { fontSize: 9, letterSpacing: 0.4 } as const

type Phase = { cycle: number; phase: number }

/**
 * Turns a stage's slot into the inheritable custom properties the CSS reads.
 *
 * The delay is `phase - cycle`, not `-phase`. Both are negative, so the
 * animation starts already in progress rather than sitting dead through a
 * first cycle, but only this one orders the stages left to right: with a plain
 * `-phase`, effective time runs t + phase, so a LATER stage reaches its lit
 * window EARLIER and the whole pipeline plays backwards. Shifting a full cycle
 * back makes stage n light at t = phase(n), which is the reading order.
 */
const slot = ({ cycle, phase }: Phase): React.CSSProperties =>
  ({ "--cycle": `${cycle}s`, "--phase": `${phase - cycle}s` }) as React.CSSProperties

/**
 * A labelled box. Given `at`, it lights when work reaches it; `variant`
 * changes what lighting means (a failure flashes rather than glows).
 */
function Stage({
  x,
  y,
  w,
  h = 22,
  text,
  lines,
  accent,
  at,
  variant = "on",
}: {
  x: number
  y: number
  w: number
  h?: number
  text?: string
  lines?: [string, string]
  accent?: boolean
  at?: Phase
  variant?: "on" | "fail" | "pass" | "twice" | "verify"
}) {
  const fill = accent ? "var(--accent)" : "var(--muted)"
  const cls = at ? `glyph-stage glyph-stage--${variant}` : undefined
  return (
    <g className={cls} style={at ? slot(at) : undefined}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="2"
        fill={NODE}
        stroke={accent ? "var(--accent)" : LINE}
        strokeWidth="1"
      />
      {lines ? (
        <>
          <text x={x + w / 2} y={y + h / 2 - 2} textAnchor="middle" className="font-mono" style={{ ...chipText, fill }}>
            {lines[0]}
          </text>
          <text x={x + w / 2} y={y + h / 2 + 10} textAnchor="middle" className="font-mono" style={{ ...chipText, fill }}>
            {lines[1]}
          </text>
        </>
      ) : (
        <text x={x + w / 2} y={y + h / 2 + 3.4} textAnchor="middle" className="font-mono" style={{ ...chipText, fill }}>
          {text}
        </text>
      )}
    </g>
  )
}

/** Clear air between a wire and the boxes it joins, in viewBox units. */
const WIRE_GAP = 4

/**
 * Pulls both ends of a path back along its own direction, so an arrowhead
 * lands just outside a box rather than on its border, where it punched a grey
 * notch through the stroke. Done geometrically rather than by hand-editing
 * every path, so the gap stays uniform and cannot drift.
 *
 * Handles the two path shapes used here: a straight `M x y L x y` and a cubic
 * `M x y C ...`. For the cubic only the endpoints move; the control points
 * stay put, which shortens the curve without changing its bow. Anything else
 * is returned untouched rather than mangled.
 */
function inset(d: string, gap = WIRE_GAP): string {
  const nums = d.match(/-?\d+(?:\.\d+)?/g)
  if (!nums) return d
  const n = nums.map(Number)

  const pull = (x: number, y: number, tx: number, ty: number) => {
    const dx = tx - x
    const dy = ty - y
    const len = Math.hypot(dx, dy)
    if (len < gap * 2) return [x, y] as const
    return [x + (dx / len) * gap, y + (dy / len) * gap] as const
  }

  if (/^M[^A-Z]*L[^A-Z]*$/.test(d.trim()) && n.length === 4) {
    const [x1, y1, x2, y2] = n
    const [sx, sy] = pull(x1, y1, x2, y2)
    const [ex, ey] = pull(x2, y2, x1, y1)
    return `M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${ex.toFixed(1)} ${ey.toFixed(1)}`
  }

  if (/^M[^A-Z]*C[^A-Z]*$/.test(d.trim()) && n.length === 8) {
    const [x1, y1, c1x, c1y, c2x, c2y, x2, y2] = n
    const [sx, sy] = pull(x1, y1, c1x, c1y)
    const [ex, ey] = pull(x2, y2, c2x, c2y)
    return `M ${sx.toFixed(1)} ${sy.toFixed(1)} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex.toFixed(1)} ${ey.toFixed(1)}`
  }

  return d
}

/**
 * A connection that carries a visible charge when work crosses it.
 *
 * pathLength="100" normalises the dash units, so one dasharray gives the same
 * charge length on a 20px hop and a 90px curve.
 */
function Wire({
  d,
  at,
  arrow = true,
  dashed,
  accent,
  gap,
}: {
  d: string
  at?: Phase
  arrow?: boolean
  dashed?: boolean
  accent?: boolean
  /** Override the default clearance; 0 for a wire that owns its own ends. */
  gap?: number
}) {
  const path = inset(d, gap ?? WIRE_GAP)
  return (
    <g style={at ? slot(at) : undefined}>
      <path
        d={path}
        fill="none"
        stroke={LINE}
        strokeWidth="1"
        strokeDasharray={dashed ? "3 3" : undefined}
        markerEnd={arrow ? "url(#glyph-tip)" : undefined}
      />
      {at && (
        <path
          className={`glyph-charge${accent ? " glyph-charge--accent" : ""}`}
          d={path}
          pathLength={100}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
        />
      )}
    </g>
  )
}

/**
 * Portage: any source repository, any recipe, proven by the repo's own tests.
 *
 * Deliberately NOT drawn as "Flask to FastAPI". The engine carries no
 * framework identity: the recipe is the pluggable part, and the pipeline
 * around it is the product. The shipped recipe stays named on the plug-in
 * chip, because the deep dive lists generality across migrations as an
 * explicit non-claim and the card must not overclaim what the evidence covers.
 */
function PortageGlyph() {
  const C = 7
  return (
    <>
      <Stage x={4} y={26} w={54} text="SOURCE" at={{ cycle: C, phase: 0 }} />
      <Wire d="M 58 37 L 80 37" at={{ cycle: C, phase: 0.5 }} />
      {/* One element per box, lit twice: the agent plans, then repairs. Drawing
          a second copy at the same coordinates would stack two rects and read
          as permanently lit (it did). */}
      <Stage x={80} y={26} w={62} text="AGENT" accent at={{ cycle: C, phase: 1 }} variant="twice" />
      <Wire d="M 142 37 L 166 37" at={{ cycle: C, phase: 1.6 }} />
      {/* Verify runs twice too: red the first time, green on the retry. */}
      <Stage x={166} y={26} w={74} text="SANDBOX" at={{ cycle: C, phase: 2.1 }} variant="verify" />
      {/* Recovery: back to the agent, repair, and round again. A polyline, so
          its ends are already clear of both boxes and inset() leaves it be. */}
      <Wire d="M 203 52 L 203 62 L 111 62 L 111 53" at={{ cycle: C, phase: 2.9 }} dashed />
      <Wire d="M 142 37 L 166 37" at={{ cycle: C, phase: 4.4 }} accent />
      <Wire d="M 240 37 L 262 37" at={{ cycle: C, phase: 5.5 }} accent />
      <Stage x={262} y={26} w={54} text="TESTS" accent at={{ cycle: C, phase: 5.9 }} variant="pass" />
      {/* The pluggable part, named honestly: one recipe ships today. */}
      <Stage x={74} y={1} w={80} h={15} text="RECIPE" />
      <path d="M 114 16 L 114 26" stroke={LINE} strokeWidth="1" strokeDasharray="2 2" fill="none" />
    </>
  )
}

/** Knowledge Hub: documents in, one store filling, cited answers out. */
function KnowledgeHubGlyph() {
  const C = 5.5
  return (
    <>
      <Stage x={4} y={25} w={52} text="DOCS" at={{ cycle: C, phase: 0 }} />
      <Wire d="M 56 36 L 76 36" at={{ cycle: C, phase: 0.5 }} />
      <Stage x={76} y={25} w={48} text="OCR" at={{ cycle: C, phase: 1 }} />
      <Wire d="M 124 36 L 148 36" at={{ cycle: C, phase: 1.6 }} />
      <Stage x={148} y={14} w={72} h={44} lines={["POSTGRES", "+ VECTOR"]} accent at={{ cycle: C, phase: 2.2 }} />
      <Wire d="M 220 36 L 244 36" at={{ cycle: C, phase: 3.6 }} accent />
      <Stage x={244} y={25} w={60} text="CITED" accent at={{ cycle: C, phase: 4.1 }} variant="pass" />
    </>
  )
}

/** CoT Faithfulness: one prompt, two models, a verdict that flips. */
function CotGlyph() {
  const C = 6
  return (
    <>
      <Stage x={4} y={25} w={58} text="PROMPT" at={{ cycle: C, phase: 0 }} />
      <Wire d="M 62 36 C 74 36, 74 15, 86 15" at={{ cycle: C, phase: 0.6 }} />
      <Wire d="M 62 36 C 74 36, 74 57, 86 57" at={{ cycle: C, phase: 0.6 }} />
      {/* The two models genuinely do not answer in step. */}
      <Stage x={86} y={4} w={72} text="LLAMA 3.2" at={{ cycle: C, phase: 1.3 }} />
      <Stage x={86} y={46} w={72} text="QWEN 2.5" at={{ cycle: C, phase: 2 }} />
      <Wire d="M 158 15 C 172 15, 172 36, 186 36" at={{ cycle: C, phase: 2.6 }} accent />
      <Wire d="M 158 57 C 172 57, 172 36, 186 36" at={{ cycle: C, phase: 3.2 }} accent />
      <Stage x={186} y={25} w={82} text="FAITHFUL?" accent at={{ cycle: C, phase: 3.9 }} variant="pass" />
    </>
  )
}

/** Image Captioning: one image, a CNN, two decoders racing to a caption. */
function CaptionGlyph() {
  const C = 6
  return (
    <>
      <g className="glyph-stage" style={slot({ cycle: C, phase: 0 })}>
        <rect x={4} y={23} width={26} height={26} rx="2" fill={NODE} stroke={LINE} strokeWidth="1" />
        <path d="M 8 45 L 14 35 L 19 41 L 23 36 L 26 45 Z" fill="var(--muted)" opacity="0.5" />
        <circle cx={23} cy={30} r={2.6} fill="var(--accent)" opacity="0.85" />
      </g>
      <Wire d="M 30 36 L 52 36" at={{ cycle: C, phase: 0.5 }} />
      <Stage x={52} y={25} w={52} text="CNN" at={{ cycle: C, phase: 1 }} />
      <Wire d="M 104 36 C 118 36, 118 15, 132 15" at={{ cycle: C, phase: 1.7 }} />
      <Wire d="M 104 36 C 118 36, 118 57, 132 57" at={{ cycle: C, phase: 1.7 }} />
      <Stage x={132} y={4} w={66} text="LSTM" at={{ cycle: C, phase: 2.3 }} />
      <Stage x={132} y={46} w={66} text="TRANSF" at={{ cycle: C, phase: 2.9 }} />
      <Wire d="M 198 15 C 212 15, 212 36, 226 36" at={{ cycle: C, phase: 3.5 }} accent />
      <Wire d="M 198 57 C 212 57, 212 36, 226 36" at={{ cycle: C, phase: 4 }} accent />
      <Stage x={226} y={25} w={78} text="CAPTION" accent at={{ cycle: C, phase: 4.6 }} variant="pass" />
    </>
  )
}

/** Tech Updates: three sources on their own clocks, funnelled and indexed. */
function TechUpdatesGlyph() {
  const C = 6
  const feeds: Array<[string, string, number, number]> = [
    ["MEDIUM", "M 66 11 C 78 11, 78 36, 90 36", 2, 0],
    ["YC", "M 66 36 L 90 36", 27, 0.7],
    ["CRUNCH", "M 66 61 C 78 61, 78 36, 90 36", 52, 1.4],
  ]
  return (
    <>
      {feeds.map(([label, d, y, phase]) => (
        <g key={label}>
          <Stage x={4} y={y} w={62} h={18} text={label} at={{ cycle: C, phase }} />
          <Wire d={d} at={{ cycle: C, phase: phase + 0.5 }} arrow={false} />
        </g>
      ))}
      {/* One shared arrowhead where the three feeds converge, sitting in the
          gap the wires leave rather than on the box border. */}
      <path d="M 81.5 33.2 L 86 36 L 81.5 38.8" stroke={LINE} strokeWidth="1" fill="none" />
      <Stage x={90} y={25} w={52} text="LLM" at={{ cycle: C, phase: 2.3 }} />
      <Wire d="M 142 36 L 166 36" at={{ cycle: C, phase: 2.9 }} />
      <Stage x={166} y={25} w={70} text="QDRANT" accent at={{ cycle: C, phase: 3.4 }} />
      <Wire d="M 236 36 L 260 36" at={{ cycle: C, phase: 4 }} accent />
      {/* Search resolves once the index has the article. */}
      <g className="glyph-stage glyph-stage--pass" style={slot({ cycle: C, phase: 4.5 })}>
        <circle cx={272} cy={33} r={8} fill="none" stroke="var(--accent)" strokeWidth="1.4" />
        <line x1={278} y1={39} x2={284} y2={45} stroke="var(--accent)" strokeWidth="1.4" />
      </g>
    </>
  )
}

/** ScribeGlobe: a request out to the edge and a response back. */
function ScribeGlobeGlyph() {
  const C = 5
  return (
    <>
      <Stage x={4} y={25} w={60} text="REACT" at={{ cycle: C, phase: 0 }} />
      <Wire d="M 64 30 L 88 30" at={{ cycle: C, phase: 0.5 }} />
      <Stage x={88} y={14} w={88} h={44} lines={["HONO", "ON EDGE"]} accent at={{ cycle: C, phase: 1 }} />
      <Wire d="M 176 30 L 200 30" at={{ cycle: C, phase: 1.6 }} />
      <Stage x={200} y={25} w={82} text="POSTGRES" at={{ cycle: C, phase: 2.1 }} />
      {/* And back: a round trip, not a one-way pipe. */}
      <Wire d="M 200 44 L 176 44" at={{ cycle: C, phase: 2.7 }} accent />
      <Wire d="M 88 44 L 64 44" at={{ cycle: C, phase: 3.3 }} accent />
    </>
  )
}

const GLYPHS: Record<string, { render: () => React.ReactElement; label: string }> = {
  portage: {
    render: PortageGlyph,
    label:
      "Diagram: a source repository and a pluggable recipe enter the agent, verification runs in a network-off sandbox, a failure returns for repair, and the retry passes the repository's own tests.",
  },
  "knowledge-hub": {
    render: KnowledgeHubGlyph,
    label:
      "Diagram: documents are OCR'd and embedded into one Postgres store, which answers queries with citations.",
  },
  "cot-faithfulness": {
    render: CotGlyph,
    label:
      "Diagram: one prompt runs through Llama 3.2 and Qwen 2.5, and their answers are compared for faithfulness.",
  },
  "image-captioning": {
    render: CaptionGlyph,
    label:
      "Diagram: a CNN extracts image features, then LSTM and Transformer decoders each generate a caption.",
  },
  "tech-updates": {
    render: TechUpdatesGlyph,
    label:
      "Diagram: three news sources are ingested, categorised by an LLM, and embedded into Qdrant for semantic search.",
  },
  scribeglobe: {
    render: ScribeGlobeGlyph,
    label: "Diagram: a React client calls a Hono API on Cloudflare Workers, backed by Postgres.",
  },
}

/** Renders nothing for a project without a glyph, rather than a blank frame. */
export default function ProjectGlyph({ id, className = "" }: { id: string; className?: string }) {
  const entry = GLYPHS[id]
  const ref = useRef<HTMLDivElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting), { rootMargin: "80px" })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!entry) return null
  const Glyph = entry.render
  return (
    <div
      ref={ref}
      data-live={live}
      className={`glyph-frame rounded border border-border/60 bg-background/40 px-4 py-3 ${className}`}
    >
      <svg viewBox="0 0 320 72" role="img" aria-label={entry.label} className="w-full">
        <defs>
          <marker
            id="glyph-tip"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={LINE} />
          </marker>
        </defs>
        <Glyph />
      </svg>
    </div>
  )
}
