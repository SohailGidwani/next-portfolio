"use client"

import { useRef, type RefObject } from "react"
import { motion, useInView, useReducedMotion } from "framer-motion"
import { useDiagramInstance, useDiagramVertical } from "@/app/components/DiagramOrientation"

/**
 * Animated job lifecycle: Ingest → Plan → Execute → Verify → Integrate →
 * Report, with the Recover loop (replan / regenerate / give up) and a Postgres
 * checkpoint rail under every node. The happy path carries accent packets;
 * the recovery loop carries its own looping packet.
 */

interface EdgeProps {
  id: string
  d: string
  accent?: boolean
  dashed?: boolean
  opacity?: number
  delay?: number
  packet?: { dur: number; begin: number } | null
  reduced: boolean
  markers: { normal: string; accent: string }
}

function Edge({ id, d, accent, dashed, opacity = 1, delay = 0, packet, reduced, markers }: EdgeProps) {
  const stroke = accent ? "var(--accent)" : "var(--muted)"
  const marker = accent ? `url(#${markers.accent})` : `url(#${markers.normal})`

  return (
    <>
      <motion.path
        id={id}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={accent ? 2 : 1.5}
        strokeDasharray={dashed ? "6 4" : undefined}
        opacity={opacity}
        markerEnd={marker}
        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: "easeInOut", delay }}
      />
      {packet && !reduced ? (
        <circle r="2.5" fill={accent ? "var(--accent)" : "var(--muted)"} opacity={0.9}>
          <animateMotion dur={`${packet.dur}s`} repeatCount="indefinite" begin={`${packet.begin}s`} rotate="auto">
            <mpath href={`#${id}`} />
          </animateMotion>
        </circle>
      ) : null}
    </>
  )
}

interface NodeSpec {
  key: string
  title: string
  sub: string
}

const NODES: NodeSpec[] = [
  { key: "ingest", title: "Ingest", sub: "clone · worktree · code graph" },
  { key: "plan", title: "Plan", sub: "task DAG · export contracts" },
  { key: "execute", title: "Execute", sub: "per-file LLM rewrite" },
  { key: "verify", title: "Verify", sub: "sandbox · --network none" },
  { key: "integrate", title: "Integrate", sub: "recompute diff" },
  { key: "report", title: "Report", sub: "honest verdict" },
]

function FlowNode({
  x,
  y,
  w,
  h,
  node,
  accent,
  pulse,
}: {
  x: number
  y: number
  w: number
  h: number
  node: NodeSpec
  accent?: boolean
  pulse: object
}) {
  return (
    <motion.g {...(accent ? pulse : {})}>
      <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx="3" fill="var(--card)" stroke={accent ? "var(--accent)" : "var(--border)"} strokeWidth={accent ? 1.5 : 1.2} />
      <text x={x} y={y - 5} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>{node.title}</text>
      <text x={x} y={y + 13} textAnchor="middle" className="font-mono" style={{ fontSize: 9, fill: "var(--muted)" }}>{node.sub}</text>
    </motion.g>
  )
}

/* ─────────────────────────── vertical (phones) ─────────────────────────── */

function MigrationFlowVertical({ reduced, paused, uid }: { reduced: boolean; paused: boolean; uid: string }) {
  const W = 460
  const H = 860
  const markers = { normal: `${uid}-vf`, accent: `${uid}-vfA` }

  const pulse = paused ? {} : {
    animate: { opacity: [0.85, 1, 0.85] },
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  }

  // main column on the left, Recover floats right
  const CX = 160
  const NW = 190
  const NH = 56
  const ys = [70, 190, 310, 430, 610, 730]
  const rec = { x: 360, y: 520 }

  return (
    <figure className="m-0 flex h-full flex-col">
      <div className="min-h-0 flex-1 rounded border border-border bg-card/40 p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Portage job lifecycle: Ingest, Plan, Execute, Verify. On pass, Integrate then Report. On fail, Recover routes back to Plan (replan) or Execute (regenerate), or gives up to Integrate with an honest red verdict. Every node checkpoints to Postgres."
        >
          <defs>
            <marker id={markers.normal} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
            </marker>
            <marker id={markers.accent} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
            </marker>
          </defs>

          {NODES.map((n, i) => (
            <FlowNode key={n.key} x={CX} y={ys[i]} w={NW} h={NH} node={n} accent={n.key === "verify" || n.key === "report"} pulse={pulse} />
          ))}

          {/* Recover */}
          <motion.g {...pulse}>
            <rect x={rec.x - 85} y={rec.y - 34} width={170} height={68} rx="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" />
            <text x={rec.x} y={rec.y - 10} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>Recover</text>
            <text x={rec.x} y={rec.y + 7} textAnchor="middle" className="font-mono" style={{ fontSize: 9, fill: "var(--muted)" }}>classify · rollback</text>
            <text x={rec.x} y={rec.y + 21} textAnchor="middle" className="font-mono" style={{ fontSize: 9, fill: "var(--accent)" }}>budgets bound everything</text>
          </motion.g>

          {/* happy path */}
          {[0, 1, 2].map((i) => (
            <Edge key={i} reduced={reduced} markers={markers} id={`${uid}-vf-${i}`} d={`M ${CX} ${ys[i] + NH / 2} L ${CX} ${ys[i + 1] - NH / 2 - 3}`} accent delay={i * 0.15} packet={{ dur: 1.6, begin: i * 0.5 }} />
          ))}
          <Edge reduced={reduced} markers={markers} id={`${uid}-vf-pass`} d={`M ${CX} ${ys[3] + NH / 2} L ${CX} ${ys[4] - NH / 2 - 3}`} accent delay={0.5} packet={{ dur: 1.8, begin: 1.6 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-vf-rep`} d={`M ${CX} ${ys[4] + NH / 2} L ${CX} ${ys[5] - NH / 2 - 3}`} accent delay={0.6} packet={{ dur: 1.6, begin: 2.2 }} />

          {/* fail → recover */}
          <Edge reduced={reduced} markers={markers} id={`${uid}-vf-fail`} d={`M ${CX + NW / 2} ${ys[3] + 14} Q 320 468, ${rec.x - 30} ${rec.y - 37}`} delay={0.6} packet={{ dur: 1.8, begin: 1.8 }} />
          {/* recover → execute (regenerate) */}
          <Edge reduced={reduced} markers={markers} id={`${uid}-vf-regen`} d={`M ${rec.x} ${rec.y - 37} Q 400 340, ${CX + NW / 2 + 4} ${ys[2] + 10}`} dashed opacity={0.85} delay={0.7} packet={{ dur: 2.2, begin: 2.4 }} />
          {/* recover → plan (replan) */}
          <Edge reduced={reduced} markers={markers} id={`${uid}-vf-replan`} d={`M ${rec.x + 40} ${rec.y - 37} Q 448 240, ${CX + NW / 2 + 4} ${ys[1]}`} dashed opacity={0.6} delay={0.8} packet={null} />
          {/* recover → integrate (give up) */}
          <Edge reduced={reduced} markers={markers} id={`${uid}-vf-giveup`} d={`M ${rec.x} ${rec.y + 37} Q 340 600, ${CX + NW / 2 + 4} ${ys[4]}`} dashed opacity={0.85} delay={0.8} packet={null} />

          {/* labels */}
          <text x={CX + 10} y={(ys[3] + ys[4]) / 2 - 20} className="font-mono" style={{ fontSize: 9.5, fill: "var(--accent)", fontStyle: "italic" }}>pass</text>
          <text x={330} y={452} className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>fail</text>
          <text x={366} y={330} className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>regenerate</text>
          <text x={396} y={230} className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>replan</text>
          <text x={310} y={608} className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>give up → honest red</text>

          {/* checkpoint rail */}
          <motion.g
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: reduced ? 0 : 1.0 }}
          >
            <line x1={40} y1={70} x2={40} y2={730} stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 5" opacity="0.7" />
            {ys.map((y) => (
              <circle key={y} cx={40} cy={y} r="3" fill="var(--accent)" />
            ))}
            <text x={30} y={400} textAnchor="middle" transform="rotate(-90 30 400)" className="font-mono uppercase" style={{ fontSize: 9, fill: "var(--muted)", letterSpacing: "0.18em" }}>
              Postgres checkpoint after every node
            </text>
          </motion.g>

          {/* honest green note */}
          <g>
            <rect x={40} y={790} width={380} height={44} rx="3" fill="var(--accent)" fillOpacity="0.08" stroke="var(--accent)" strokeWidth="1.2" />
            <text x={230} y={808} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--fg)", fontWeight: 600 }}>green ⇔ full suite ∧ all tasks done</text>
            <text x={230} y={823} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--fg)", fontWeight: 600 }}>∧ zero skips ∧ passed &gt; 0</text>
          </g>
        </svg>
      </div>
    </figure>
  )
}

/* ─────────────────────────── horizontal ─────────────────────────── */

export default function MigrationFlow() {
  const prefersReduced = useReducedMotion() ?? false
  // reduced gates ENTRANCES (initial props are mount-time-only, so this must
  // never be polluted by the async inView flag); paused gates the infinite
  // pulses so they stop offscreen.
  const rootRef = useRef<HTMLElement>(null)
  const inView = useInView(rootRef, { margin: "200px 0px" })
  const reduced = prefersReduced
  const paused = prefersReduced || !inView
  const vertical = useDiagramVertical()
  // Deterministic (SSR-safe) id, unique across the lightbox's mounted copies.
  const uid = `mflow-${useDiagramInstance()}`

  if (vertical) {
    // The observed root must exist on this branch too; otherwise useInView
    // stays false forever and the phone-dialog copy renders static.
    return (
      <div ref={rootRef as RefObject<HTMLDivElement>} className="h-full">
        <MigrationFlowVertical reduced={reduced} paused={paused} uid={uid} />
      </div>
    )
  }

  const W = 1140
  const H = 430
  const markers = { normal: `${uid}-f`, accent: `${uid}-fA` }

  const pulse = paused ? {} : {
    animate: { opacity: [0.85, 1, 0.85] },
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  }

  const rowY = 120
  const NW = 158
  const NH = 60
  const xs = [110, 300, 490, 680, 870, 1050]
  const rec = { x: 585, y: 290 }

  return (
    <figure ref={rootRef} className="my-8">
      <div className="rounded border border-border bg-card/40 p-4 sm:p-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Portage job lifecycle: Ingest, Plan, Execute, Verify. On pass, Integrate then Report. On fail, Recover routes back to Plan (replan) or Execute (regenerate), or gives up to Integrate with an honest red verdict. Every node checkpoints to Postgres."
        >
          <defs>
            <marker id={markers.normal} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
            </marker>
            <marker id={markers.accent} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
            </marker>
          </defs>

          {NODES.map((n, i) => (
            <FlowNode key={n.key} x={xs[i]} y={rowY} w={NW} h={NH} node={n} accent={n.key === "verify" || n.key === "report"} pulse={pulse} />
          ))}

          {/* Recover */}
          <motion.g {...pulse}>
            <rect x={rec.x - 95} y={rec.y - 36} width={190} height={72} rx="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" />
            <text x={rec.x} y={rec.y - 12} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>Recover</text>
            <text x={rec.x} y={rec.y + 6} textAnchor="middle" className="font-mono" style={{ fontSize: 9, fill: "var(--muted)" }}>classify failure · targeted rollback</text>
            <text x={rec.x} y={rec.y + 21} textAnchor="middle" className="font-mono" style={{ fontSize: 9, fill: "var(--accent)" }}>attempts ≤ 3 · recover visits ≤ 4</text>
          </motion.g>

          {/* happy path: Ingest → Plan → Execute → Verify */}
          {[0, 1, 2].map((i) => (
            <Edge key={i} reduced={reduced} markers={markers} id={`${uid}-f-${i}`} d={`M ${xs[i] + NW / 2} ${rowY} L ${xs[i + 1] - NW / 2 - 3} ${rowY}`} accent delay={i * 0.15} packet={{ dur: 1.6, begin: i * 0.5 }} />
          ))}
          {/* Verify → Integrate (pass) */}
          <Edge reduced={reduced} markers={markers} id={`${uid}-f-pass`} d={`M ${xs[3] + NW / 2} ${rowY} L ${xs[4] - NW / 2 - 3} ${rowY}`} accent delay={0.5} packet={{ dur: 1.8, begin: 1.6 }} />
          {/* Integrate → Report */}
          <Edge reduced={reduced} markers={markers} id={`${uid}-f-rep`} d={`M ${xs[4] + NW / 2} ${rowY} L ${xs[5] - NW / 2 - 3} ${rowY}`} accent delay={0.6} packet={{ dur: 1.6, begin: 2.2 }} />

          {/* Verify → Recover (fail) */}
          <Edge reduced={reduced} markers={markers} id={`${uid}-f-fail`} d={`M ${xs[3]} ${rowY + NH / 2} Q ${xs[3]} 230, ${rec.x + 40} ${rec.y - 39}`} delay={0.6} packet={{ dur: 1.8, begin: 1.8 }} />
          {/* Recover → Execute (regenerate) */}
          <Edge reduced={reduced} markers={markers} id={`${uid}-f-regen`} d={`M ${rec.x - 60} ${rec.y - 39} Q ${xs[2]} 230, ${xs[2]} ${rowY + NH / 2 + 3}`} dashed opacity={0.85} delay={0.7} packet={{ dur: 2.2, begin: 2.4 }} />
          {/* Recover → Plan (replan) */}
          <Edge reduced={reduced} markers={markers} id={`${uid}-f-replan`} d={`M ${rec.x - 95} ${rec.y} Q ${xs[1] - 40} 290, ${xs[1] - 20} ${rowY + NH / 2 + 3}`} dashed opacity={0.6} delay={0.8} packet={null} />
          {/* Recover → Integrate (give up) */}
          <Edge reduced={reduced} markers={markers} id={`${uid}-f-giveup`} d={`M ${rec.x + 95} ${rec.y} Q ${xs[4] + 20} 290, ${xs[4] + 20} ${rowY + NH / 2 + 3}`} dashed opacity={0.85} delay={0.8} packet={null} />

          {/* labels */}
          <text x={(xs[3] + xs[4]) / 2} y={rowY - 12} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--accent)", fontStyle: "italic" }}>pass</text>
          <text x={xs[3] - 34} y={222} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)", fontStyle: "italic" }}>fail</text>
          <text x={xs[2] + 40} y={238} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>regenerate</text>
          <text x={xs[1] + 16} y={272} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>replan · planner miss</text>
          <text x={xs[4] - 4} y={272} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>give up → honest red</text>

          {/* checkpoint rail */}
          <motion.g
            initial={reduced ? false : { opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: reduced ? 0 : 1.0 }}
          >
            <line x1={xs[0]} y1={44} x2={xs[5]} y2={44} stroke="var(--accent)" strokeWidth="1" strokeDasharray="2 5" opacity="0.7" />
            {xs.map((x) => (
              <g key={x}>
                <circle cx={x} cy={44} r="3" fill="var(--accent)" />
                <line x1={x} y1={47} x2={x} y2={rowY - NH / 2 - 4} stroke="var(--border)" strokeWidth="0.8" strokeDasharray="2 4" />
              </g>
            ))}
            <text x={(xs[0] + xs[5]) / 2} y={28} textAnchor="middle" className="font-mono uppercase" style={{ fontSize: 9.5, fill: "var(--muted)", letterSpacing: "0.2em" }}>
              Postgres checkpoint after every node · thread_id = job_id · kill the worker, it resumes
            </text>
          </motion.g>

          {/* honest green note */}
          <g>
            <rect x={790} y={350} width={330} height={40} rx="3" fill="var(--accent)" fillOpacity="0.08" stroke="var(--accent)" strokeWidth="1.2" />
            <text x={955} y={374} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--fg)", fontWeight: 600 }}>
              green ⇔ full suite ∧ all tasks done ∧ zero skips
            </text>
          </g>
        </svg>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        A submitted job runs this LangGraph graph, checkpointing to Postgres after every node: kill the
        worker mid-run and a restarted worker resumes from the last completed node. When Verify fails, Recover
        classifies the failure and routes back: targeted rollback + regenerate to Execute, replan to Plan for
        planner misses, or give up to Integrate once budgets are exhausted, reporting an honest red rather
        than a gamed green.
      </p>
    </figure>
  )
}
