"use client"

import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { RotateCcw } from "lucide-react"
import { useDiagramInstance, useDiagramVertical } from "@/app/components/DiagramOrientation"

/**
 * Animated visualization of the `blast_radius` primitive (code-review-graph):
 * a file changes, the impact wave walks the code graph outward through callers
 * and dependents, and only the tests covering that impact set are selected.
 *
 * The animation is a finite, staged story (change → trace → scope tests), so a
 * replay control remounts the SVG to run it again. Horizontal layout on
 * desktop; a stacked vertical layout renders inside the lightbox on phones
 * via DiagramVerticalContext.
 */

// ── timeline (seconds, from entering the viewport) ─────────────
const T_GRAPH = 0.15 // base graph fades in
const T_CHANGE = 0.9 // changed file lights up
const T_WAVE1 = 1.7 // first wave + hop-1 highlights
const T_WAVE2 = 2.7 // second wave + hop-2 highlights
const T_TESTS = 3.7 // test selection edges + RUN chips
const T_SETTLE = 4.4 // unaffected files dim, summary appears

type Kind = "changed" | "hop1" | "hop2" | "outside"

interface FileChip {
  label: string
  x: number
  y: number
  w: number
  kind: Kind
}

interface TestRow {
  label: string
  x: number
  y: number
  w: number
  run: boolean
}

interface ImpactEdge {
  x1: number
  y1: number
  x2: number
  y2: number
  hop: 1 | 2
}

interface TestEdge {
  x1: number
  y1: number
  x2: number
  y2: number
  run: boolean
}

const CHIP_H = 28
const kindDelay: Record<Kind, number> = {
  changed: T_CHANGE,
  hop1: T_WAVE1 + 0.35,
  hop2: T_WAVE2 + 0.35,
  outside: 0,
}

function FileChipNode({
  chip,
  reduced,
}: {
  chip: FileChip
  reduced: boolean
}) {
  const { label, x, y, w, kind } = chip
  const changed = kind === "changed"
  const impacted = kind === "hop1" || kind === "hop2"
  const outside = kind === "outside"

  return (
    <g>
      {/* base chip */}
      <motion.g
        initial={reduced ? false : { opacity: 0 }}
        whileInView={
          outside
            ? { opacity: [0, 1, 1, 0.35] }
            : { opacity: 1 }
        }
        viewport={{ once: true }}
        transition={
          outside
            ? reduced
              ? { duration: 0 }
              : { duration: T_SETTLE + 0.6, times: [0, 0.12, 0.88, 1], delay: T_GRAPH }
            : { duration: 0.5, delay: T_GRAPH }
        }
      >
        <rect x={x - w / 2} y={y - CHIP_H / 2} width={w} height={CHIP_H} rx="3" fill="var(--card)" stroke="var(--border)" strokeWidth="1.2" />
        <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" className="font-mono" style={{ fontSize: 11, fill: "var(--fg)", fontWeight: changed ? 700 : 500 }}>
          {label}
        </text>
      </motion.g>

      {/* highlight overlay for changed / impacted chips */}
      {(changed || impacted) && (
        <motion.g
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, delay: reduced ? 0 : kindDelay[kind] }}
        >
          <rect
            x={x - w / 2}
            y={y - CHIP_H / 2}
            width={w}
            height={CHIP_H}
            rx="3"
            fill="var(--accent)"
            fillOpacity={changed ? 0.16 : 0.08}
            stroke="var(--accent)"
            strokeWidth={changed ? 1.8 : 1.3}
          />
          <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" className="font-mono" style={{ fontSize: 11, fill: "var(--fg)", fontWeight: changed ? 700 : 600 }}>
            {label}
          </text>
          {changed && (
            <g>
              <rect x={x - 22} y={y - CHIP_H / 2 - 17} width={44} height={14} rx="2" fill="var(--accent)" />
              <text x={x} y={y - CHIP_H / 2 - 9.5} textAnchor="middle" dominantBaseline="middle" className="font-mono" style={{ fontSize: 8.5, fill: "#fff", fontWeight: 700, letterSpacing: "0.08em" }}>
                +12 −7
              </text>
            </g>
          )}
        </motion.g>
      )}

      {/* looping pulse ring on the epicenter */}
      {changed && !reduced && (
        <motion.circle
          cx={x}
          cy={y}
          fill="none"
          stroke="var(--accent)"
          initial={{ r: 18, opacity: 0 }}
          whileInView={{ r: [18, 44], opacity: [0.55, 0], strokeWidth: [2, 0.5] }}
          viewport={{ once: true }}
          transition={{ duration: 1.8, delay: T_CHANGE, repeat: Infinity, repeatDelay: 0.4, ease: "easeOut" }}
        />
      )}
    </g>
  )
}

function ImpactEdgeLine({
  edge,
  reduced,
  marker,
  markerAccent,
}: {
  edge: ImpactEdge
  reduced: boolean
  marker: string
  markerAccent: string
}) {
  const d = `M ${edge.x1} ${edge.y1} L ${edge.x2} ${edge.y2}`
  const accentDelay = edge.hop === 1 ? T_WAVE1 + 0.15 : T_WAVE2 + 0.15
  return (
    <>
      {/* neutral dependency edge */}
      <motion.path
        d={d}
        fill="none"
        stroke="var(--muted)"
        strokeWidth="1.2"
        opacity="0.55"
        markerEnd={`url(#${marker})`}
        initial={reduced ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: reduced ? 0 : T_GRAPH + 0.2 }}
      />
      {/* accent overlay drawn when the wave reaches it */}
      <motion.path
        d={d}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2"
        markerEnd={`url(#${markerAccent})`}
        initial={reduced ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: reduced ? 0 : accentDelay, ease: "easeOut" }}
      />
    </>
  )
}

function TestEdgeLine({
  edge,
  reduced,
  markerAccent,
}: {
  edge: TestEdge
  reduced: boolean
  markerAccent: string
}) {
  const d = `M ${edge.x1} ${edge.y1} L ${edge.x2} ${edge.y2}`
  if (!edge.run) {
    return (
      <motion.path
        d={d}
        fill="none"
        stroke="var(--muted)"
        strokeWidth="1.1"
        strokeDasharray="4 4"
        initial={reduced ? false : { opacity: 0 }}
        whileInView={reduced ? { opacity: 0.3 } : { opacity: [0, 0.55, 0.55, 0.3] }}
        viewport={{ once: true }}
        transition={reduced ? { duration: 0 } : { duration: T_SETTLE + 0.6, times: [0, 0.12, 0.85, 1], delay: T_GRAPH }}
      />
    )
  }
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="var(--accent)"
      strokeWidth="1.6"
      strokeDasharray="6 4"
      initial={reduced ? false : { pathLength: 0, opacity: 0 }}
      whileInView={{ pathLength: 1, opacity: 0.9 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: reduced ? 0 : T_TESTS, ease: "easeOut" }}
      markerEnd={`url(#${markerAccent})`}
    />
  )
}

function TestNode({
  test,
  reduced,
  badgeX,
}: {
  test: TestRow
  reduced: boolean
  badgeX: number
}) {
  const { label, x, y, w, run } = test
  return (
    <g>
      <motion.g
        initial={reduced ? false : { opacity: 0 }}
        whileInView={
          run || reduced
            ? { opacity: run ? 1 : 0.35 }
            : { opacity: [0, 1, 1, 0.35] }
        }
        viewport={{ once: true }}
        transition={
          run
            ? { duration: 0.5, delay: reduced ? 0 : T_GRAPH + 0.2 }
            : reduced
              ? { duration: 0 }
              : { duration: T_SETTLE + 0.6, times: [0, 0.12, 0.88, 1], delay: T_GRAPH + 0.2 }
        }
      >
        <rect x={x - w / 2} y={y - 15} width={w} height={30} rx="3" fill="var(--card)" stroke="var(--border)" strokeWidth="1.2" />
        <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" className="font-mono" style={{ fontSize: 11, fill: "var(--fg)", fontWeight: 500 }}>
          {label}
        </text>
      </motion.g>

      {run && (
        <motion.g
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: reduced ? 0 : T_TESTS + 0.45 }}
        >
          <rect x={x - w / 2} y={y - 15} width={w} height={30} rx="3" fill="var(--accent)" fillOpacity={0.08} stroke="var(--accent)" strokeWidth="1.4" />
          <rect x={badgeX} y={y - 10} width={42} height={20} rx="2" fill="var(--accent)" />
          <text x={badgeX + 21} y={y + 1} textAnchor="middle" dominantBaseline="middle" className="font-mono" style={{ fontSize: 9.5, fill: "#fff", fontWeight: 700, letterSpacing: "0.1em" }}>
            RUN
          </text>
        </motion.g>
      )}
      {!run && (
        <motion.g
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: reduced ? 0 : T_SETTLE + 0.2 }}
        >
          <rect x={badgeX} y={y - 10} width={42} height={20} rx="2" fill="none" stroke="var(--muted)" strokeWidth="1" />
          <text x={badgeX + 21} y={y + 1} textAnchor="middle" dominantBaseline="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontWeight: 700, letterSpacing: "0.08em" }}>
            SKIP
          </text>
        </motion.g>
      )}
    </g>
  )
}

function Wave({
  cx,
  cy,
  r,
  delay,
  reduced,
}: {
  cx: number
  cy: number
  r: number
  delay: number
  reduced: boolean
}) {
  if (reduced) return null
  return (
    <motion.circle
      cx={cx}
      cy={cy}
      fill="none"
      stroke="var(--accent)"
      initial={{ r: 12, opacity: 0 }}
      whileInView={{ r: [12, r], opacity: [0.6, 0], strokeWidth: [2.5, 0.5] }}
      viewport={{ once: true }}
      transition={{ duration: 1.0, delay, ease: "easeOut" }}
    />
  )
}

function RingGuide({
  cx,
  cy,
  r,
  label,
  labelPos,
  reduced,
  delay,
}: {
  cx: number
  cy: number
  r: number
  label: string
  labelPos: { x: number; y: number }
  reduced: boolean
  delay: number
}) {
  return (
    <motion.g
      initial={reduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: reduced ? 0 : delay }}
    >
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 5" />
      <text x={labelPos.x} y={labelPos.y} className="font-mono" style={{ fontSize: 9, fill: "var(--muted)", letterSpacing: "0.12em" }}>
        {label}
      </text>
    </motion.g>
  )
}

function StageCaption({
  x,
  y,
  anchor = "start",
  reduced,
}: {
  x: number
  y: number
  anchor?: "start" | "middle"
  reduced: boolean
}) {
  const stages = [
    { text: "01 · db.py changed — compute impact", from: T_CHANGE - 0.1, to: T_WAVE2 },
    { text: "02 · walk the code graph: callers & dependents", from: T_WAVE2, to: T_TESTS + 0.3 },
    { text: "03 · run only the tests that cover the impact set", from: T_TESTS + 0.3, to: Infinity },
  ]
  if (reduced) {
    return (
      <text x={x} y={y} textAnchor={anchor} className="font-mono" style={{ fontSize: 11.5, fill: "var(--accent)", fontWeight: 600, letterSpacing: "0.04em" }}>
        {stages[2].text}
      </text>
    )
  }
  return (
    <>
      {stages.map((s) => (
        <motion.text
          key={s.text}
          x={x}
          y={y}
          textAnchor={anchor}
          className="font-mono"
          style={{ fontSize: 11.5, fill: "var(--accent)", fontWeight: 600, letterSpacing: "0.04em" }}
          initial={{ opacity: 0 }}
          whileInView={
            s.to === Infinity
              ? { opacity: 1 }
              : { opacity: [0, 1, 1, 0] }
          }
          viewport={{ once: true }}
          transition={
            s.to === Infinity
              ? { duration: 0.4, delay: s.from }
              : { duration: s.to - s.from, times: [0, 0.15, 0.85, 1], delay: s.from }
          }
        >
          {s.text}
        </motion.text>
      ))}
    </>
  )
}

function Legend({ x, y, reduced }: { x: number; y: number; reduced: boolean }) {
  const rows = [
    { swatch: "changed", label: "changed file" },
    { swatch: "impacted", label: "impacted (callers / dependents)" },
    { swatch: "tests", label: "tests selected" },
    { swatch: "dim", label: "untouched" },
  ]
  return (
    <motion.g
      initial={reduced ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: reduced ? 0 : T_GRAPH + 0.3 }}
    >
      {rows.map((r, i) => {
        const ry = y + i * 19
        return (
          <g key={r.swatch}>
            {r.swatch === "changed" && <rect x={x} y={ry - 5} width={10} height={10} rx="2" fill="var(--accent)" fillOpacity="0.9" />}
            {r.swatch === "impacted" && <rect x={x} y={ry - 5} width={10} height={10} rx="2" fill="var(--accent)" fillOpacity="0.12" stroke="var(--accent)" strokeWidth="1.3" />}
            {r.swatch === "tests" && <line x1={x} y1={ry} x2={x + 10} y2={ry} stroke="var(--accent)" strokeWidth="1.8" strokeDasharray="4 3" />}
            {r.swatch === "dim" && <rect x={x} y={ry - 5} width={10} height={10} rx="2" fill="var(--card)" stroke="var(--border)" strokeWidth="1.2" opacity="0.45" />}
            <text x={x + 17} y={ry + 1} dominantBaseline="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)" }}>
              {r.label}
            </text>
          </g>
        )
      })}
    </motion.g>
  )
}

function SummaryChip({
  x,
  y,
  w,
  reduced,
}: {
  x: number
  y: number
  w: number
  reduced: boolean
}) {
  return (
    <motion.g
      initial={reduced ? false : { opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: reduced ? 0 : T_SETTLE + 0.3 }}
    >
      <rect x={x} y={y} width={w} height={32} rx="3" fill="var(--accent)" fillOpacity="0.08" stroke="var(--accent)" strokeWidth="1.2" />
      <text x={x + w / 2} y={y + 17} textAnchor="middle" dominantBaseline="middle" className="font-mono" style={{ fontSize: 10.5, fill: "var(--fg)", fontWeight: 600 }}>
        blast radius: 6 / 8 files · tests: 3 run, 1 skipped
      </text>
    </motion.g>
  )
}

/* ─────────────────────────── horizontal ─────────────────────────── */

function BlastRadiusHorizontal({ reduced, uid }: { reduced: boolean; uid: string }) {
  const W = 1120
  const H = 560
  const CX = 340
  const CY = 270

  const chips: FileChip[] = [
    { label: "db.py", x: CX, y: CY, w: 88, kind: "changed" },
    { label: "routes.py", x: 455, y: 185, w: 104, kind: "hop1" },
    { label: "auth.py", x: 472, y: 330, w: 96, kind: "hop1" },
    { label: "models.py", x: 230, y: 368, w: 104, kind: "hop1" },
    { label: "api/items.py", x: 580, y: 130, w: 116, kind: "hop2" },
    { label: "app.py", x: 585, y: 390, w: 88, kind: "hop2" },
    { label: "cli.py", x: 118, y: 60, w: 84, kind: "outside" },
    { label: "email.py", x: 700, y: 500, w: 96, kind: "outside" },
  ]

  const impactEdges: ImpactEdge[] = [
    { x1: 384, y1: 256, x2: 408, y2: 200, hop: 1 },
    { x1: 384, y1: 281, x2: 424, y2: 318, hop: 1 },
    { x1: 308, y1: 286, x2: 264, y2: 354, hop: 1 },
    { x1: 498, y1: 172, x2: 528, y2: 146, hop: 2 },
    { x1: 505, y1: 342, x2: 548, y2: 378, hop: 2 },
  ]

  const tests: TestRow[] = [
    { label: "test_routes.py", x: 880, y: 130, w: 132, run: true },
    { label: "test_items.py", x: 880, y: 230, w: 132, run: true },
    { label: "test_auth.py", x: 880, y: 330, w: 132, run: true },
    { label: "test_email.py", x: 880, y: 445, w: 132, run: false },
  ]

  const testEdges: TestEdge[] = [
    { x1: 509, y1: 180, x2: 810, y2: 134, run: true },
    { x1: 640, y1: 134, x2: 810, y2: 226, run: true },
    { x1: 522, y1: 331, x2: 810, y2: 330, run: true },
    { x1: 750, y1: 494, x2: 810, y2: 452, run: false },
  ]

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Blast radius: db.py changes; the impact wave walks the code graph to routes, auth, models, then api/items and app; only the three tests covering that impact set are selected to run while test_email is skipped"
    >
      <defs>
        <marker id={`${uid}-arr`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
        </marker>
        <marker id={`${uid}-arrA`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
      </defs>

      <RingGuide cx={CX} cy={CY} r={150} label="hop 1" labelPos={{ x: CX + 108, y: CY - 108 }} reduced={reduced} delay={T_GRAPH + 0.2} />
      <RingGuide cx={CX} cy={CY} r={275} label="hop 2" labelPos={{ x: CX + 196, y: CY - 196 }} reduced={reduced} delay={T_GRAPH + 0.35} />

      <text x={880} y={86} textAnchor="middle" className="font-mono uppercase" style={{ fontSize: 10, fill: "var(--muted)", letterSpacing: "0.22em" }}>
        test suite
      </text>

      <Wave cx={CX} cy={CY} r={150} delay={T_WAVE1} reduced={reduced} />
      <Wave cx={CX} cy={CY} r={275} delay={T_WAVE2} reduced={reduced} />

      {impactEdges.map((e, i) => (
        <ImpactEdgeLine key={i} edge={e} reduced={reduced} marker={`${uid}-arr`} markerAccent={`${uid}-arrA`} />
      ))}
      {testEdges.map((e, i) => (
        <TestEdgeLine key={i} edge={e} reduced={reduced} markerAccent={`${uid}-arrA`} />
      ))}

      {chips.map((c) => (
        <FileChipNode key={c.label} chip={c} reduced={reduced} />
      ))}
      {tests.map((t) => (
        <TestNode key={t.label} test={t} reduced={reduced} badgeX={t.x + t.w / 2 + 12} />
      ))}

      <Legend x={30} y={480} reduced={reduced} />
      <StageCaption x={340} y={542} anchor="middle" reduced={reduced} />
      <SummaryChip x={765} y={510} w={350} reduced={reduced} />
    </svg>
  )
}

/* ─────────────────────────── vertical (phones) ─────────────────────────── */

function BlastRadiusVertical({ reduced, uid }: { reduced: boolean; uid: string }) {
  const W = 460
  const H = 880
  const CX = 230
  const CY = 215

  const chips: FileChip[] = [
    { label: "db.py", x: CX, y: CY, w: 80, kind: "changed" },
    { label: "routes.py", x: 322, y: 150, w: 94, kind: "hop1" },
    { label: "auth.py", x: 312, y: 292, w: 86, kind: "hop1" },
    { label: "models.py", x: 138, y: 268, w: 94, kind: "hop1" },
    { label: "api/items.py", x: 348, y: 78, w: 106, kind: "hop2" },
    { label: "app.py", x: 332, y: 362, w: 78, kind: "hop2" },
    { label: "cli.py", x: 82, y: 66, w: 76, kind: "outside" },
    { label: "email.py", x: 96, y: 392, w: 86, kind: "outside" },
  ]

  const impactEdges: ImpactEdge[] = [
    { x1: 264, y1: 202, x2: 282, y2: 164, hop: 1 },
    { x1: 262, y1: 226, x2: 272, y2: 282, hop: 1 },
    { x1: 197, y1: 227, x2: 172, y2: 254, hop: 1 },
    { x1: 334, y1: 136, x2: 344, y2: 94, hop: 2 },
    { x1: 320, y1: 306, x2: 330, y2: 347, hop: 2 },
  ]

  const tests: TestRow[] = [
    { label: "test_routes.py", x: 165, y: 556, w: 150, run: true },
    { label: "test_items.py", x: 165, y: 600, w: 150, run: true },
    { label: "test_auth.py", x: 165, y: 644, w: 150, run: true },
    { label: "test_email.py", x: 165, y: 688, w: 150, run: false },
  ]

  return (
    <figure className="m-0 flex h-full flex-col">
      <div className="min-h-0 flex-1 rounded border border-border bg-card/40 p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Blast radius: db.py changes; the impact wave walks the code graph to routes, auth, models, then api/items and app; only the three tests covering that impact set are selected to run while test_email is skipped"
        >
          <defs>
            <marker id={`${uid}-varr`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
            </marker>
            <marker id={`${uid}-varrA`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
            </marker>
          </defs>

          <RingGuide cx={CX} cy={CY} r={112} label="hop 1" labelPos={{ x: CX + 82, y: CY - 82 }} reduced={reduced} delay={T_GRAPH + 0.2} />
          <RingGuide cx={CX} cy={CY} r={182} label="hop 2" labelPos={{ x: CX + 134, y: CY - 134 }} reduced={reduced} delay={T_GRAPH + 0.35} />

          <Wave cx={CX} cy={CY} r={112} delay={T_WAVE1} reduced={reduced} />
          <Wave cx={CX} cy={CY} r={182} delay={T_WAVE2} reduced={reduced} />

          {impactEdges.map((e, i) => (
            <ImpactEdgeLine key={i} edge={e} reduced={reduced} marker={`${uid}-varr`} markerAccent={`${uid}-varrA`} />
          ))}

          {chips.map((c) => (
            <FileChipNode key={c.label} chip={c} reduced={reduced} />
          ))}

          <StageCaption x={CX} y={448} anchor="middle" reduced={reduced} />

          {/* graph → test panel trunk */}
          <motion.path
            d={`M ${CX} 462 L ${CX} 498`}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            markerEnd={`url(#${uid}-varrA)`}
            initial={reduced ? false : { pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: reduced ? 0 : T_TESTS - 0.2 }}
          />

          {/* test panel */}
          <motion.g
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: reduced ? 0 : T_GRAPH + 0.3 }}
          >
            <rect x={30} y={506} width={400} height={208} rx="3" fill="var(--card2)" fillOpacity="0.4" stroke="var(--border)" strokeWidth="1" />
            <text x={50} y={528} className="font-mono uppercase" style={{ fontSize: 9.5, fill: "var(--muted)", letterSpacing: "0.2em" }}>
              test suite — scoped by blast radius
            </text>
          </motion.g>

          {tests.map((t) => (
            <TestNode key={t.label} test={t} reduced={reduced} badgeX={330} />
          ))}

          <SummaryChip x={40} y={738} w={380} reduced={reduced} />

          <Legend x={70} y={805} reduced={reduced} />
        </svg>
      </div>
    </figure>
  )
}

/* ─────────────────────────── shell with replay ─────────────────────────── */

export default function BlastRadius() {
  const reduced = useReducedMotion() ?? false
  const vertical = useDiagramVertical()
  // Deterministic (SSR-safe) id, unique across the lightbox's mounted copies.
  const uid = `blast-${useDiagramInstance()}`
  const [run, setRun] = useState(0)

  const replayButton = (
    <button
      type="button"
      onClick={() => setRun((r) => r + 1)}
      aria-label="Replay blast radius animation"
      className="absolute left-2 top-2 z-10 inline-flex items-center gap-1.5 rounded border border-border bg-card/90 px-2.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground backdrop-blur transition hover:border-accent/50 hover:text-foreground"
    >
      <RotateCcw className="h-3 w-3" />
      Replay
    </button>
  )

  if (vertical) {
    return (
      <div className="relative flex h-full flex-col" key={`v-${run}`}>
        {replayButton}
        <BlastRadiusVertical reduced={reduced} uid={uid} />
      </div>
    )
  }

  return (
    <figure className="my-8">
      <div className="relative rounded border border-border bg-card/40 p-4 sm:p-6" key={`h-${run}`}>
        {replayButton}
        <BlastRadiusHorizontal reduced={reduced} uid={uid} />
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        The <span className="font-mono text-foreground">blast_radius</span> primitive in action: when{" "}
        <span className="font-mono text-foreground">db.py</span> changes, Portage walks the structural code
        graph outward — direct callers first (hop 1), then their dependents (hop 2) — and selects only the
        tests that cover the impacted set. Verify uses this to iterate fast; the final honesty bar still runs
        the full suite. The same query is exposed to co-pilot agents as the{" "}
        <span className="font-mono text-foreground">blast_radius</span> MCP tool.
      </p>
    </figure>
  )
}
