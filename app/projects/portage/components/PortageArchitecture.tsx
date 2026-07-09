"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useDiagramInstance, useDiagramVertical } from "@/app/components/DiagramOrientation"

/**
 * Animated system architecture for Portage: CLI / dashboard hit the FastAPI
 * control plane, jobs land in a Postgres queue, a LangGraph worker claims them
 * (FOR UPDATE SKIP LOCKED + lease), checkpoints every node, and fans out to
 * the network-off Docker sandbox and the LiteLLM ladder. The MCP stdio server
 * reuses the same sandbox + graph primitives without the compose stack.
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

const boxStyle = { fill: "var(--card)", stroke: "var(--border)", strokeWidth: 1.2 } as const

function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  lines = [],
  accent,
}: {
  x: number
  y: number
  w: number
  h: number
  title: string
  sub?: string
  lines?: string[]
  accent?: boolean
}) {
  const cx = x + w / 2
  const startY = y + 24
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="3" {...boxStyle} stroke={accent ? "var(--accent)" : "var(--border)"} strokeWidth={accent ? 1.5 : 1.2} />
      <text x={cx} y={startY} textAnchor="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 700 }}>{title}</text>
      {sub && (
        <text x={cx} y={startY + 17} textAnchor="middle" className="font-mono" style={{ fontSize: 11, fill: accent ? "var(--accent)" : "var(--muted)" }}>{sub}</text>
      )}
      {lines.length > 0 && (
        <line x1={x + 12} y1={startY + (sub ? 28 : 11)} x2={x + w - 12} y2={startY + (sub ? 28 : 11)} stroke="var(--border)" strokeWidth="0.8" />
      )}
      {lines.map((l, i) => (
        <text key={l} x={cx} y={startY + (sub ? 45 : 28) + i * 15} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)" }}>{l}</text>
      ))}
    </g>
  )
}

/* ─────────────────────────── vertical (phones) ─────────────────────────── */

function PortageArchitectureVertical({ reduced, uid }: { reduced: boolean; uid: string }) {
  const W = 460
  const H = 900
  const markers = { normal: `${uid}-va`, accent: `${uid}-vaA` }

  const pulse = reduced ? {} : {
    animate: { opacity: [0.85, 1, 0.85] },
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  }

  return (
    <figure className="m-0 flex h-full flex-col">
      <div className="min-h-0 flex-1 rounded border border-border bg-card/40 p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Portage architecture: CLI and dashboard call the FastAPI control plane, jobs are queued in Postgres, a LangGraph worker claims them with FOR UPDATE SKIP LOCKED, checkpoints every node, and uses a network-off Docker sandbox plus the LiteLLM model ladder. A standalone MCP server exposes the same sandbox and graph primitives."
        >
          <defs>
            <marker id={markers.normal} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
            </marker>
            <marker id={markers.accent} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
            </marker>
          </defs>

          {/* clients */}
          <Box x={35} y={30} w={180} h={62} title="CLI" sub="portage · httpx" />
          <Box x={245} y={30} w={180} h={62} title="Dashboard" sub="Next.js · REST only" />

          {/* API */}
          <Box x={125} y={172} w={210} h={66} title="FastAPI API" sub="control plane" />

          {/* Postgres */}
          <g>
            <motion.g {...pulse}>
              <rect x={85} y={318} width={290} height={96} rx="3" {...boxStyle} />
              <text x={230} y={344} textAnchor="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 700 }}>Postgres 16 + pgvector</text>
              <line x1={100} y1={356} x2={360} y2={356} stroke="var(--border)" strokeWidth="0.8" />
              <text x={230} y={374} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)" }}>jobs queue · tasks DAG · runs / metrics</text>
              <text x={230} y={392} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--accent)" }}>LangGraph checkpoints (thread_id = job_id)</text>
            </motion.g>
          </g>

          {/* Worker */}
          <motion.g {...pulse}>
            <rect x={105} y={494} width={250} height={90} rx="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" />
            <text x={230} y={520} textAnchor="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 700 }}>LangGraph Worker</text>
            <text x={230} y={538} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>Ingest → Plan → Execute →</text>
            <text x={230} y={553} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>Verify → Recover → Report</text>
            <text x={230} y={571} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--accent)" }}>checkpointed after every node</text>
          </motion.g>

          {/* Sandbox + LLM */}
          <Box x={30} y={664} w={195} h={80} title="Sandbox" sub="Docker · --network none" lines={["pytest → JUnit"]} accent />
          <Box x={245} y={664} w={190} h={80} title="LiteLLM" sub="model ladder" lines={["driver → escalation"]} />

          {/* MCP */}
          <Box x={70} y={798} w={320} h={72} title="MCP stdio server" sub="Claude Code · Cursor" lines={["verify_patch_in_sandbox · repo_graph · blast_radius"]} />

          {/* edges */}
          <Edge reduced={reduced} markers={markers} id={`${uid}-v-cli-api`} d={`M 125 96 Q 125 140, 175 168`} delay={0} packet={{ dur: 2.2, begin: 0 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-v-dash-api`} d={`M 335 96 Q 335 140, 285 168`} delay={0.1} packet={{ dur: 2.2, begin: 0.5 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-v-api-pg`} d={`M 230 240 L 230 314`} delay={0.25} packet={{ dur: 2, begin: 0.9 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-v-pg-worker`} d={`M 200 416 L 200 490`} accent delay={0.4} packet={{ dur: 1.8, begin: 1.4 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-v-worker-pg`} d={`M 262 490 L 262 418`} dashed opacity={0.8} delay={0.5} packet={{ dur: 1.8, begin: 2.0 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-v-worker-sb`} d={`M 165 586 Q 128 610, 128 660`} accent delay={0.6} packet={{ dur: 1.8, begin: 1.9 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-v-worker-llm`} d={`M 295 586 Q 340 610, 340 660`} delay={0.6} packet={{ dur: 2, begin: 2.3 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-v-mcp-sb`} d={`M 128 794 L 128 748`} dashed opacity={0.8} delay={0.8} packet={{ dur: 2.2, begin: 2.8 }} />

          {/* edge labels */}
          <text x={230} y={130} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>REST — never touch DB directly</text>
          <text x={244} y={280} className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>enqueue job</text>
          <text x={60} y={456} className="font-mono" style={{ fontSize: 9.5, fill: "var(--accent)", fontStyle: "italic" }}>claim · SKIP LOCKED + lease</text>
          <text x={274} y={456} className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>checkpoint</text>
          <text x={62} y={630} className="font-mono" style={{ fontSize: 9.5, fill: "var(--accent)", fontStyle: "italic" }}>verify</text>
          <text x={330} y={630} className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>rewrite</text>
          <text x={140} y={775} className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>same primitives — no compose stack needed</text>
        </svg>
      </div>
    </figure>
  )
}

/* ─────────────────────────── horizontal ─────────────────────────── */

export default function PortageArchitecture() {
  const reduced = useReducedMotion() ?? false
  const vertical = useDiagramVertical()
  // Deterministic (SSR-safe) id, unique across the lightbox's mounted copies.
  const uid = `parch-${useDiagramInstance()}`

  if (vertical) return <PortageArchitectureVertical reduced={reduced} uid={uid} />

  const W = 1140
  const H = 470
  const markers = { normal: `${uid}-a`, accent: `${uid}-aA` }

  const pulse = reduced ? {} : {
    animate: { opacity: [0.85, 1, 0.85] },
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  }

  return (
    <figure className="my-8">
      <div className="rounded border border-border bg-card/40 p-4 sm:p-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Portage architecture: CLI and dashboard call the FastAPI control plane, jobs are queued in Postgres, a LangGraph worker claims them with FOR UPDATE SKIP LOCKED, checkpoints every node, and uses a network-off Docker sandbox plus the LiteLLM model ladder. A standalone MCP server exposes the same sandbox and graph primitives."
        >
          <defs>
            <marker id={markers.normal} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
            </marker>
            <marker id={markers.accent} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
            </marker>
          </defs>

          {/* clients */}
          <Box x={25} y={60} w={160} h={62} title="CLI" sub="portage · httpx" />
          <Box x={25} y={160} w={160} h={62} title="Dashboard" sub="Next.js · REST only" />

          {/* API */}
          <Box x={260} y={106} w={170} h={70} title="FastAPI API" sub="control plane" />

          {/* Postgres */}
          <motion.g {...pulse}>
            <rect x={505} y={82} width={230} height={118} rx="3" {...boxStyle} />
            <text x={620} y={110} textAnchor="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 700 }}>Postgres 16</text>
            <text x={620} y={127} textAnchor="middle" className="font-mono" style={{ fontSize: 11, fill: "var(--muted)" }}>+ pgvector</text>
            <line x1={520} y1={139} x2={720} y2={139} stroke="var(--border)" strokeWidth="0.8" />
            <text x={620} y={156} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)" }}>jobs queue · tasks DAG · runs / metrics</text>
            <text x={620} y={172} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--accent)" }}>LangGraph checkpoints</text>
            <text x={620} y={186} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--accent)" }}>thread_id = job_id</text>
          </motion.g>

          {/* Worker */}
          <motion.g {...pulse}>
            <rect x={505} y={296} width={230} height={104} rx="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" />
            <text x={620} y={324} textAnchor="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 700 }}>LangGraph Worker</text>
            <text x={620} y={344} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>Ingest → Plan → Execute →</text>
            <text x={620} y={359} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>Verify → Recover → Report</text>
            <text x={620} y={381} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--accent)" }}>checkpointed after every node</text>
          </motion.g>

          {/* Sandbox + LLM */}
          <Box x={890} y={60} w={225} h={92} title="Sandbox" sub="Docker · --network none" lines={["ephemeral per run", "pytest → JUnit report"]} accent />
          <Box x={890} y={200} w={225} h={80} title="LiteLLM" sub="model ladder" lines={["driver → escalation tier"]} />

          {/* MCP */}
          <Box x={25} y={330} w={160} h={70} title="MCP host" sub="Claude Code · Cursor" />
          <Box x={260} y={318} w={170} h={94} title="MCP server" sub="stdio · standalone" lines={["verify_patch_in_sandbox", "repo_graph · blast_radius"]} />

          {/* edges */}
          <Edge reduced={reduced} markers={markers} id={`${uid}-cli-api`} d={`M 185 91 Q 225 91, 256 122`} delay={0} packet={{ dur: 2.2, begin: 0 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-dash-api`} d={`M 185 191 Q 225 191, 256 160`} delay={0.1} packet={{ dur: 2.2, begin: 0.5 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-api-pg`} d={`M 430 141 L 501 141`} delay={0.25} packet={{ dur: 2, begin: 0.9 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-pg-worker`} d={`M 580 200 L 580 292`} accent delay={0.4} packet={{ dur: 1.8, begin: 1.4 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-worker-pg`} d={`M 660 292 L 660 204`} dashed opacity={0.8} delay={0.5} packet={{ dur: 1.8, begin: 2.0 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-worker-sb`} d={`M 735 316 Q 830 290, 886 140`} accent delay={0.6} packet={{ dur: 2, begin: 1.9 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-worker-llm`} d={`M 735 348 Q 820 340, 886 260`} delay={0.6} packet={{ dur: 2.2, begin: 2.3 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-mcphost-mcp`} d={`M 185 365 L 256 365`} delay={0.7} packet={{ dur: 2.2, begin: 2.6 }} />
          <Edge reduced={reduced} markers={markers} id={`${uid}-mcp-sb`} d={`M 430 380 Q 850 440, 990 156`} dashed opacity={0.75} delay={0.8} packet={{ dur: 3, begin: 3.0 }} />

          {/* edge labels */}
          <text x={222} y={78} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>REST</text>
          <text x={222} y={210} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>REST</text>
          <text x={466} y={128} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>enqueue</text>
          <text x={566} y={250} textAnchor="end" className="font-mono" style={{ fontSize: 9.5, fill: "var(--accent)", fontStyle: "italic" }}>claim · FOR UPDATE</text>
          <text x={566} y={263} textAnchor="end" className="font-mono" style={{ fontSize: 9.5, fill: "var(--accent)", fontStyle: "italic" }}>SKIP LOCKED + lease</text>
          <text x={674} y={250} className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>checkpoint</text>
          <text x={674} y={263} className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>every node</text>
          <text x={836} y={216} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--accent)", fontStyle: "italic" }}>verify</text>
          <text x={822} y={330} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>per-file rewrite</text>
          <text x={222} y={352} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>stdio</text>
          <text x={640} y={442} textAnchor="middle" className="font-mono" style={{ fontSize: 9.5, fill: "var(--muted)", fontStyle: "italic" }}>same verified primitives — compose stack not required</text>
        </svg>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        One core engine, two interfaces. The CLI and dashboard are thin REST clients — neither touches the
        queue or database directly. Jobs land in Postgres; a LangGraph worker claims them atomically with{" "}
        <span className="font-mono text-foreground">FOR UPDATE SKIP LOCKED</span> plus a heartbeat lease, and
        checkpoints state after every node so a killed worker resumes instead of restarting. Verification runs
        in an ephemeral network-off Docker sandbox; LLM calls go through a LiteLLM driver/escalation ladder.
        The MCP stdio server exposes the same sandbox and graph primitives to co-pilot agents without needing
        the compose stack.
      </p>
    </figure>
  )
}
