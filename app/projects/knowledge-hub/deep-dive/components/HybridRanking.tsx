"use client"

import { motion, useReducedMotion } from "framer-motion"
import { useDiagramVertical } from "@/app/components/DiagramOrientation"

interface EdgeProps {
  id: string
  d: string
  accent?: boolean
  delay?: number
  packet?: { dur: number; begin: number } | null
  reduced: boolean
  mk?: string
}

function Edge({ id, d, accent, delay = 0, packet, reduced, mk = "" }: EdgeProps) {
  const stroke = accent ? "var(--accent)" : "var(--muted)"
  const sw = accent ? 2 : 1.5
  const marker = accent ? `url(#hr-arrow-accent${mk})` : `url(#hr-arrow${mk})`

  return (
    <>
      <motion.path
        id={id}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
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

function HybridRankingVertical({ reduced }: { reduced: boolean }) {
  const W = 440
  const H = 830

  const boxStyle = { fill: "var(--card)", stroke: "var(--border)", strokeWidth: 1.2 } as const

  const pulse = reduced ? {} : {
    animate: { opacity: [0.85, 1, 0.85] },
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  }

  // Two lanes flowing downward: FTS (left), Semantic (right)
  const xFTS = 115
  const xSem = 325
  const xMid = 220

  const yQuery = 60
  const yRetr = 185
  const yScore = 305
  const yNorm = 425
  const yBlend = 575
  const yResult = 720

  return (
    <figure className="m-0 flex h-full flex-col">
      <div className="min-h-0 flex-1 rounded border border-border bg-card/40 p-3">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Hybrid ranking: query goes to FTS (left lane) and semantic search (right lane) in parallel. Each produces raw scores that are z-score normalized, then blended with weights alpha=0.6 semantic and beta=0.4 FTS. An optional OCR confidence penalty adjusts the final score."
        >
          <defs>
            <marker id="hr-arrow-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
            </marker>
            <marker id="hr-arrow-accent-v" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
            </marker>
          </defs>

          {/* ═══ QUERY ═══ */}
          <g>
            <rect x={xMid - 70} y={yQuery - 32} width={140} height={64} rx="3" {...boxStyle} />
            <text x={xMid} y={yQuery - 6} textAnchor="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 700 }}>Query</text>
            <text x={xMid} y={yQuery + 12} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>natural language</text>
          </g>

          {/* ═══ RETRIEVAL ═══ */}
          <g>
            <rect x={xFTS - 85} y={yRetr - 30} width={170} height={60} rx="3" {...boxStyle} />
            <text x={xFTS} y={yRetr - 6} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>FTS</text>
            <text x={xFTS} y={yRetr + 12} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>GIN · tsquery</text>
          </g>
          <g>
            <rect x={xSem - 85} y={yRetr - 30} width={170} height={60} rx="3" {...boxStyle} />
            <text x={xSem} y={yRetr - 6} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>Semantic</text>
            <text x={xSem} y={yRetr + 12} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>IVFFlat · cosine</text>
          </g>

          {/* ═══ RAW SCORES ═══ */}
          <g>
            <rect x={xFTS - 65} y={yScore - 28} width={130} height={56} rx="3" {...boxStyle} />
            <text x={xFTS} y={yScore - 6} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--fg)", fontWeight: 700 }}>s_f</text>
            <text x={xFTS} y={yScore + 10} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>ts_rank_cd</text>
          </g>
          <g>
            <rect x={xSem - 65} y={yScore - 28} width={130} height={56} rx="3" {...boxStyle} />
            <text x={xSem} y={yScore - 6} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--fg)", fontWeight: 700 }}>s_v</text>
            <text x={xSem} y={yScore + 10} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>1 − d_cos</text>
          </g>

          {/* ═══ Z-SCORES ═══ */}
          <g>
            <rect x={xFTS - 80} y={yNorm - 34} width={160} height={68} rx="3" {...boxStyle} />
            <text x={xFTS} y={yNorm - 12} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--fg)", fontWeight: 700 }}>z_f</text>
            <text x={xFTS} y={yNorm + 6} textAnchor="middle" className="font-mono italic" style={{ fontSize: 11, fill: "var(--muted)" }}>(s_f − μ_f) / σ_f</text>
            <text x={xFTS} y={yNorm + 22} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>z-score norm</text>
          </g>
          <g>
            <rect x={xSem - 80} y={yNorm - 34} width={160} height={68} rx="3" {...boxStyle} />
            <text x={xSem} y={yNorm - 12} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--fg)", fontWeight: 700 }}>z_v</text>
            <text x={xSem} y={yNorm + 6} textAnchor="middle" className="font-mono italic" style={{ fontSize: 11, fill: "var(--muted)" }}>(s_v − μ_v) / σ_v</text>
            <text x={xSem} y={yNorm + 22} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>z-score norm</text>
          </g>

          {/* ═══ BLEND ═══ */}
          <motion.g {...pulse}>
            <rect x={xMid - 100} y={yBlend - 54} width={200} height={108} rx="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" />
            <text x={xMid} y={yBlend - 30} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>Blend</text>
            <text x={xMid} y={yBlend - 10} textAnchor="middle" className="font-mono italic" style={{ fontSize: 12, fill: "var(--fg)" }}>α·z_v + β·z_f</text>
            <line x1={xMid - 78} y1={yBlend + 4} x2={xMid + 78} y2={yBlend + 4} stroke="var(--border)" strokeWidth="0.8" />
            <text x={xMid} y={yBlend + 22} textAnchor="middle" className="font-mono" style={{ fontSize: 11, fill: "var(--accent)" }}>α = 0.6  (sem)</text>
            <text x={xMid} y={yBlend + 38} textAnchor="middle" className="font-mono" style={{ fontSize: 11, fill: "var(--muted)" }}>β = 0.4  (FTS)</text>
          </motion.g>

          {/* ═══ RESULT ═══ */}
          <g>
            <rect x={xMid - 65} y={yResult - 36} width={130} height={72} rx="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" />
            <text x={xMid} y={yResult - 10} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>Ranked</text>
            <text x={xMid} y={yResult + 8} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>Results</text>
            <text x={xMid} y={yResult + 26} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>top-K chunks</text>
          </g>

          {/* ═══ OCR CONFIDENCE PENALTY ═══ */}
          <text x={xMid + 70} y={805} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)", fontStyle: "italic" }}>
            optional: if ocr_conf &lt; 50, subtract λ from score
          </text>
          <line x1={xMid + 80} y1={yBlend + 56} x2={xMid + 80} y2={793} stroke="var(--border)" strokeWidth="0.8" strokeDasharray="4 3" />

          {/* ═══ EDGES ═══ */}
          <Edge reduced={reduced} mk="-v" id="hrv-q-fts" d={`M ${xMid - 35} ${yQuery + 34} Q ${xFTS} ${yQuery + 60}, ${xFTS} ${yRetr - 33}`} delay={0} packet={{ dur: 2.2, begin: 0 }} />
          <Edge reduced={reduced} mk="-v" id="hrv-q-sem" d={`M ${xMid + 35} ${yQuery + 34} Q ${xSem} ${yQuery + 60}, ${xSem} ${yRetr - 33}`} delay={0.1} packet={{ dur: 2.2, begin: 0.3 }} />

          <Edge reduced={reduced} mk="-v" id="hrv-fts-sf" d={`M ${xFTS} ${yRetr + 32} L ${xFTS} ${yScore - 31}`} delay={0.2} packet={{ dur: 1.8, begin: 0.6 }} />
          <Edge reduced={reduced} mk="-v" id="hrv-sem-sv" d={`M ${xSem} ${yRetr + 32} L ${xSem} ${yScore - 31}`} delay={0.2} packet={{ dur: 1.8, begin: 0.7 }} />

          <Edge reduced={reduced} mk="-v" id="hrv-sf-zf" d={`M ${xFTS} ${yScore + 30} L ${xFTS} ${yNorm - 37}`} delay={0.3} packet={{ dur: 1.6, begin: 1.0 }} />
          <Edge reduced={reduced} mk="-v" id="hrv-sv-zv" d={`M ${xSem} ${yScore + 30} L ${xSem} ${yNorm - 37}`} delay={0.3} packet={{ dur: 1.6, begin: 1.1 }} />

          <Edge reduced={reduced} mk="-v" id="hrv-zf-blend" d={`M ${xFTS} ${yNorm + 36} Q ${xFTS} ${yNorm + 80}, ${xMid - 60} ${yBlend - 57}`} delay={0.4} packet={{ dur: 2.0, begin: 1.4 }} />
          <Edge reduced={reduced} mk="-v" id="hrv-zv-blend" d={`M ${xSem} ${yNorm + 36} Q ${xSem} ${yNorm + 80}, ${xMid + 60} ${yBlend - 57}`} delay={0.4} packet={{ dur: 2.0, begin: 1.5 }} />

          <Edge reduced={reduced} mk="-v" id="hrv-blend-result" accent d={`M ${xMid} ${yBlend + 56} L ${xMid} ${yResult - 39}`} delay={0.6} packet={{ dur: 1.8, begin: 1.8 }} />
        </svg>
      </div>
    </figure>
  )
}

export default function HybridRanking() {
  const reduced = useReducedMotion() ?? false
  const vertical = useDiagramVertical()

  if (vertical) return <HybridRankingVertical reduced={reduced} />

  const W = 1080
  const H = 400

  const boxStyle = {
    fill: "var(--card)",
    stroke: "var(--border)",
    strokeWidth: 1.2,
  } as const

  const pulse = reduced
    ? {}
    : {
        animate: { opacity: [0.85, 1, 0.85] },
        transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
      }

  // Layout: 5 column x positions
  const cxQuery   = 70
  const cxRetieve = 260
  const cxScore   = 450
  const cxNorm    = 640
  const cxBlend   = 830
  const cxResult  = 1020

  // Two row y positions (FTS top, Semantic bottom)
  const yFTS  = 120
  const yMid  = 200   // blend row
  const ySem  = 280

  return (
    <figure className="my-8">
      <div className="rounded border border-border bg-card/40 p-4 sm:p-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Hybrid ranking: query goes to FTS (top lane) and semantic search (bottom lane) in parallel. Each produces raw scores that are z-score normalized, then blended with weights alpha=0.6 semantic and beta=0.4 FTS. An optional OCR confidence penalty adjusts the final score."
        >
          <defs>
            <marker id="hr-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
            </marker>
            <marker id="hr-arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
            </marker>
          </defs>

          {/* ═══ QUERY ═══ */}
          <g>
            <rect x={20} y={yMid - 32} width={100} height={64} rx="3" {...boxStyle} />
            <text x={cxQuery} y={yMid - 6} textAnchor="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 700 }}>Query</text>
            <text x={cxQuery} y={yMid + 12} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>natural language</text>
          </g>

          {/* ═══ RETRIEVAL: FTS top lane ═══ */}
          <g>
            <rect x={cxRetieve - 65} y={yFTS - 30} width={130} height={60} rx="3" {...boxStyle} />
            <text x={cxRetieve} y={yFTS - 6} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>FTS</text>
            <text x={cxRetieve} y={yFTS + 12} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>GIN · tsquery</text>
          </g>

          {/* ═══ RETRIEVAL: Semantic bottom lane ═══ */}
          <g>
            <rect x={cxRetieve - 65} y={ySem - 30} width={130} height={60} rx="3" {...boxStyle} />
            <text x={cxRetieve} y={ySem - 6} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>Semantic</text>
            <text x={cxRetieve} y={ySem + 12} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>IVFFlat · cosine</text>
          </g>

          {/* ═══ SCORE: FTS ═══ */}
          <g>
            <rect x={cxScore - 60} y={yFTS - 28} width={120} height={56} rx="3" {...boxStyle} />
            <text x={cxScore} y={yFTS - 6} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--fg)", fontWeight: 700 }}>s_f</text>
            <text x={cxScore} y={yFTS + 10} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>ts_rank_cd</text>
          </g>

          {/* ═══ SCORE: Semantic ═══ */}
          <g>
            <rect x={cxScore - 60} y={ySem - 28} width={120} height={56} rx="3" {...boxStyle} />
            <text x={cxScore} y={ySem - 6} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--fg)", fontWeight: 700 }}>s_v</text>
            <text x={cxScore} y={ySem + 10} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>1 − d_cos</text>
          </g>

          {/* ═══ Z-SCORE: FTS ═══ */}
          <g>
            <rect x={cxNorm - 65} y={yFTS - 34} width={130} height={68} rx="3" {...boxStyle} />
            <text x={cxNorm} y={yFTS - 12} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--fg)", fontWeight: 700 }}>z_f</text>
            <text x={cxNorm} y={yFTS + 6} textAnchor="middle" className="font-mono italic" style={{ fontSize: 11, fill: "var(--muted)" }}>(s_f − μ_f) / σ_f</text>
            <text x={cxNorm} y={yFTS + 22} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>z-score norm</text>
          </g>

          {/* ═══ Z-SCORE: Semantic ═══ */}
          <g>
            <rect x={cxNorm - 65} y={ySem - 34} width={130} height={68} rx="3" {...boxStyle} />
            <text x={cxNorm} y={ySem - 12} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--fg)", fontWeight: 700 }}>z_v</text>
            <text x={cxNorm} y={ySem + 6} textAnchor="middle" className="font-mono italic" style={{ fontSize: 11, fill: "var(--muted)" }}>(s_v − μ_v) / σ_v</text>
            <text x={cxNorm} y={ySem + 22} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>z-score norm</text>
          </g>

          {/* ═══ BLEND BOX ═══ */}
          <motion.g {...pulse}>
            <rect x={cxBlend - 75} y={yMid - 54} width={150} height={108} rx="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" />
            <text x={cxBlend} y={yMid - 30} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>Blend</text>
            <text x={cxBlend} y={yMid - 10} textAnchor="middle" className="font-mono italic" style={{ fontSize: 12, fill: "var(--fg)" }}>α·z_v + β·z_f</text>
            <line x1={cxBlend - 58} y1={yMid + 4} x2={cxBlend + 58} y2={yMid + 4} stroke="var(--border)" strokeWidth="0.8" />
            <text x={cxBlend} y={yMid + 22} textAnchor="middle" className="font-mono" style={{ fontSize: 11, fill: "var(--accent)" }}>α = 0.6  (sem)</text>
            <text x={cxBlend} y={yMid + 38} textAnchor="middle" className="font-mono" style={{ fontSize: 11, fill: "var(--muted)" }}>β = 0.4  (FTS)</text>
          </motion.g>

          {/* ═══ RESULT ═══ */}
          <g>
            <rect x={cxResult - 55} y={yMid - 36} width={110} height={72} rx="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" />
            <text x={cxResult} y={yMid - 10} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>Ranked</text>
            <text x={cxResult} y={yMid + 8} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>Results</text>
            <text x={cxResult} y={yMid + 26} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>top-K chunks</text>
          </g>

          {/* ═══ OCR CONFIDENCE PENALTY label ═══ */}
          <text x={cxBlend} y={360} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)", fontStyle: "italic" }}>
            optional: if ocr_conf &lt; 50, subtract λ from score
          </text>
          <line x1={cxBlend} y1={yMid + 54} x2={cxBlend} y2={348} stroke="var(--border)" strokeWidth="0.8" strokeDasharray="4 3" />

          {/* ═══ EDGES ═══ */}
          {/* Query → FTS lane */}
          <Edge reduced={reduced} id="hr-q-fts"  d={`M 120 ${yMid - 14} Q 175 ${yFTS}, 193 ${yFTS}`} delay={0} packet={{ dur: 2.2, begin: 0 }} />
          {/* Query → Sem lane */}
          <Edge reduced={reduced} id="hr-q-sem"  d={`M 120 ${yMid + 14} Q 175 ${ySem}, 193 ${ySem}`} delay={0.1} packet={{ dur: 2.2, begin: 0.3 }} />

          {/* FTS → s_f */}
          <Edge reduced={reduced} id="hr-fts-sf" d={`M 327 ${yFTS} L 388 ${yFTS}`} delay={0.2} packet={{ dur: 1.8, begin: 0.6 }} />
          {/* Sem → s_v */}
          <Edge reduced={reduced} id="hr-sem-sv" d={`M 327 ${ySem} L 388 ${ySem}`} delay={0.2} packet={{ dur: 1.8, begin: 0.7 }} />

          {/* s_f → z_f */}
          <Edge reduced={reduced} id="hr-sf-zf"  d={`M 512 ${yFTS} L 573 ${yFTS}`} delay={0.3} packet={{ dur: 1.6, begin: 1.0 }} />
          {/* s_v → z_v */}
          <Edge reduced={reduced} id="hr-sv-zv"  d={`M 512 ${ySem} L 573 ${ySem}`} delay={0.3} packet={{ dur: 1.6, begin: 1.1 }} />

          {/* z_f → Blend */}
          <Edge reduced={reduced} id="hr-zf-blend" d={`M 707 ${yFTS} Q 760 ${yFTS}, 753 ${yMid - 30}`} delay={0.4} packet={{ dur: 2.0, begin: 1.4 }} />
          {/* z_v → Blend */}
          <Edge reduced={reduced} id="hr-zv-blend" d={`M 707 ${ySem} Q 760 ${ySem}, 753 ${yMid + 30}`} delay={0.4} packet={{ dur: 2.0, begin: 1.5 }} />

          {/* Blend → Result */}
          <Edge reduced={reduced} id="hr-blend-result" accent d={`M 907 ${yMid} L 963 ${yMid}`} delay={0.6} packet={{ dur: 1.8, begin: 1.8 }} />
        </svg>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Both FTS and semantic search run in parallel on the same query. Raw scores (
        <span className="font-mono text-foreground">ts_rank_cd</span> and cosine similarity{" "}
        <span className="font-mono text-foreground">1 − d_cos</span>) are each z-score normalized within
        their stream, then blended: <span className="font-mono text-foreground">score = 0.6·z_v + 0.4·z_f</span>.
        Chunks with low OCR confidence take an optional penalty λ. This produces stable,
        interpretable rankings across wildly different document types.
      </p>
    </figure>
  )
}
