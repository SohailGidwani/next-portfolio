"use client"

import { motion, useReducedMotion } from "framer-motion"

interface EdgeProps {
  id: string
  d: string
  accent?: boolean
  dashed?: boolean
  delay?: number
  packet?: { dur: number; begin: number } | null
  reduced: boolean
}

function Edge({ id, d, accent, dashed, delay = 0, packet, reduced }: EdgeProps) {
  const stroke = accent ? "var(--accent)" : "var(--muted)"
  const sw = accent ? 2 : 1.5
  const marker = accent ? "url(#sys-arrow-accent)" : "url(#sys-arrow)"

  return (
    <>
      <motion.path
        id={id}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
        strokeDasharray={dashed ? "6 4" : undefined}
        markerEnd={marker}
        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: "easeInOut", delay }}
      />
      {packet && !reduced ? (
        <circle r="2.5" fill={accent ? "var(--accent)" : "var(--muted)"} opacity={0.9}>
          <animateMotion
            dur={`${packet.dur}s`}
            repeatCount="indefinite"
            begin={`${packet.begin}s`}
            rotate="auto"
          >
            <mpath href={`#${id}`} />
          </animateMotion>
        </circle>
      ) : null}
    </>
  )
}

export default function SystemArchitecture() {
  const reduced = useReducedMotion() ?? false

  // ── geometry ──────────────────────────────────────
  const W = 1080
  const H = 420
  const midY = 210

  // Client: x=20, w=130 → cx=85
  const clX = 20; const clW = 130; const clH = 120; const clCX = clX + clW / 2
  // Flask: x=215, w=200 → cx=315
  const flX = 215; const flW = 200; const flH = 200; const flCX = flX + flW / 2
  // Postgres: x=555, w=178 → cx=644, pgY=110
  const pgX = 555; const pgW = 178; const pgH = 90; const pgCX = pgX + pgW / 2; const pgY = 108
  // Storage: x=555, w=178 → cx=644, storeY=310
  const stX = pgX; const stW = pgW; const stH = 82; const stCX = stX + stW / 2; const storeY = 312
  // Ollama: x=845, w=168 → cx=929
  const olX = 845; const olW = 168; const olH = 106; const olCX = olX + olW / 2

  const boxStyle = { fill: "var(--card)", stroke: "var(--border)", strokeWidth: 1.2 } as const

  const pulse = reduced ? {} : {
    animate: { opacity: [0.85, 1, 0.85] },
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  }

  // derived edge endpoints
  const clRight = clX + clW          // 150
  const flRight = flX + flW          // 415
  const pgRight = pgX + pgW          // 733
  const stLeft  = stX                // 555
  const olLeft  = olX                // 845

  return (
    <figure className="my-8">
      <div className="rounded border border-border bg-card/40 p-4 sm:p-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="System architecture: Next.js client sends requests to Flask API (Gunicorn). Flask routes uploads to Storage, search and embed queries to Postgres 16 with pgvector, and answer requests through Postgres retrieval into Ollama."
        >
          <defs>
            <marker id="sys-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
            </marker>
            <marker id="sys-arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
            </marker>
          </defs>

          {/* ═══ CLIENT ═══ */}
          <g>
            <rect x={clX} y={midY - clH / 2} width={clW} height={clH} rx="3" {...boxStyle} />
            <text x={clCX} y={midY - 18} textAnchor="middle" className="font-mono" style={{ fontSize: 15, fill: "var(--fg)", fontWeight: 700 }}>Client</text>
            <text x={clCX} y={midY}      textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>Next.js</text>
            <line x1={clX + 10} y1={midY + 16} x2={clX + clW - 10} y2={midY + 16} stroke="var(--border)" strokeWidth="0.8" />
            <text x={clCX} y={midY + 32} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--accent)" }}>upload · search</text>
            <text x={clCX} y={midY + 47} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--accent)" }}>embed · answer</text>
          </g>

          {/* ═══ FLASK API ═══ */}
          <motion.g {...pulse}>
            <rect x={flX} y={midY - flH / 2} width={flW} height={flH} rx="3" {...boxStyle} />
            <text x={flCX} y={midY - 68} textAnchor="middle" className="font-mono" style={{ fontSize: 15, fill: "var(--fg)", fontWeight: 700 }}>Flask API</text>
            <text x={flCX} y={midY - 50} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>Gunicorn</text>
            <line x1={flX + 12} y1={midY - 34} x2={flX + flW - 12} y2={midY - 34} stroke="var(--border)" strokeWidth="0.8" />
            {[
              { y: midY - 16, t: "POST /documents/upload" },
              { y: midY + 1,  t: "POST /search | /hybrid" },
              { y: midY + 18, t: "POST /embeddings/reindex" },
              { y: midY + 35, t: "POST /answer  (RAG)" },
            ].map((e) => (
              <text key={e.t} x={flCX} y={e.y} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>{e.t}</text>
            ))}
          </motion.g>

          {/* ═══ POSTGRES ═══ */}
          <g>
            <rect x={pgX} y={pgY - pgH / 2} width={pgW} height={pgH} rx="3" {...boxStyle} />
            <text x={pgCX} y={pgY - 16} textAnchor="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 700 }}>Postgres 16</text>
            <text x={pgCX} y={pgY + 2}  textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--accent)" }}>+ pgvector</text>
            <text x={pgCX} y={pgY + 20} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>GIN (FTS) · IVFFlat (ANN)</text>
          </g>

          {/* ═══ STORAGE ═══ */}
          <g>
            <rect x={stX} y={storeY - stH / 2} width={stW} height={stH} rx="3" {...boxStyle} />
            <text x={stCX} y={storeY - 14} textAnchor="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 700 }}>Storage</text>
            <text x={stCX} y={storeY + 4}  textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>local / S3</text>
            <text x={stCX} y={storeY + 22} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>SHA-256 dedup</text>
          </g>

          {/* ═══ OLLAMA ═══ */}
          <motion.g {...pulse}>
            <rect x={olX} y={midY - olH / 2} width={olW} height={olH} rx="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" />
            <text x={olCX} y={midY - 22} textAnchor="middle" className="font-mono" style={{ fontSize: 15, fill: "var(--fg)", fontWeight: 700 }}>Ollama</text>
            <text x={olCX} y={midY - 4}  textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>Local LLM</text>
            <text x={olCX} y={midY + 14} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--accent)" }}>gemma3:1b</text>
          </motion.g>

          {/* ═══ EDGES ═══ */}
          {/* Client → Flask */}
          <Edge reduced={reduced} id="sys-cli-flask"
            d={`M ${clRight} ${midY} L ${flX - 2} ${midY}`}
            delay={0} packet={{ dur: 2.4, begin: 0 }} />

          {/* Flask → Postgres (search + embed) */}
          <Edge reduced={reduced} id="sys-flask-pg"
            d={`M ${flRight} ${midY - 50} Q ${flRight + 60} ${pgY}, ${pgX - 2} ${pgY}`}
            delay={0.2} packet={{ dur: 2.2, begin: 0.6 }} />

          {/* Flask → Storage (upload) */}
          <Edge reduced={reduced} id="sys-flask-store"
            d={`M ${flRight} ${midY + 50} Q ${flRight + 60} ${storeY}, ${stLeft - 2} ${storeY}`}
            delay={0.3} packet={{ dur: 2.5, begin: 0.9 }} />

          {/* Storage → Postgres (background ingestion, dashed) */}
          <Edge reduced={reduced} id="sys-store-pg"
            d={`M ${pgCX} ${storeY - stH / 2 - 2} L ${pgCX} ${pgY + pgH / 2 + 2}`}
            dashed delay={0.5} packet={null} />

          {/* Postgres → Ollama (retrieval → RAG) */}
          <Edge reduced={reduced} id="sys-pg-ollama"
            d={`M ${pgRight} ${pgY} Q ${pgRight + 55} ${pgY - 10}, ${olLeft - 2} ${midY - 20}`}
            accent delay={0.6} packet={{ dur: 2.0, begin: 1.4 }} />

          {/* ═══ LABELS ═══ */}
          <text x={(clRight + flX) / 2} y={midY - 10} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)", fontStyle: "italic" }}>HTTP</text>
          <text x={flRight + 40} y={midY - 80} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)", fontStyle: "italic" }}>search / embed</text>
          <text x={flRight + 40} y={midY + 90} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)", fontStyle: "italic" }}>upload / store</text>
          <text x={pgCX + 24} y={storeY - stH / 2 - 18} textAnchor="middle" className="font-mono" style={{ fontSize: 9, fill: "var(--muted)", fontStyle: "italic" }}>background</text>
          <text x={pgCX + 28} y={storeY - stH / 2 - 6}  textAnchor="middle" className="font-mono" style={{ fontSize: 9, fill: "var(--muted)", fontStyle: "italic" }}>ingestion</text>
          <text x={(pgRight + olLeft) / 2} y={pgY - 28} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--accent)", fontStyle: "italic" }}>retrieval → RAG</text>
        </svg>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        All services run locally, no API keys, no cloud dependency. Flask (Gunicorn) is the single entry point: uploads go to Storage and queue background ingestion into Postgres; search and embed queries hit Postgres directly; answer requests retrieve from Postgres then forward context to Ollama.
      </p>
    </figure>
  )
}
