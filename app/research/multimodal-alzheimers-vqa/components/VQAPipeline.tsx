"use client"

import { motion, useReducedMotion } from "framer-motion"

interface EdgeProps {
  id: string
  d: string
  accent?: boolean
  delay?: number
  packet?: { dur: number; begin: number } | null
  reduced: boolean
}

function Edge({ id, d, accent, delay = 0, packet, reduced }: EdgeProps) {
  const stroke = accent ? "var(--accent)" : "var(--muted)"
  const sw = accent ? 2 : 1.5
  const marker = accent ? "url(#vqa-arrow-accent)" : "url(#vqa-arrow)"

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
        <circle r="2.5" fill="var(--accent)">
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

export default function VQAPipeline() {
  const reduced = useReducedMotion() ?? false

  const W = 1200
  const H = 380
  const midY = H / 2

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

  return (
    <figure className="my-8">
      <div className="rounded border border-border bg-card/40 p-4 sm:p-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="VQA pipeline: frozen encoders produce fused embeddings; FAISS retrieves top-50 similar subjects; cross-encoder reranks to top-5; LLM generates answers"
        >
          <defs>
            <marker
              id="vqa-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
            </marker>
            <marker
              id="vqa-arrow-accent"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
            </marker>
          </defs>

          {/* ═══ FROZEN ENCODER GROUP ═══ */}
          <g>
            <rect
              x={30}
              y={60}
              width="180"
              height="260"
              rx="3"
              fill="var(--card2)"
              stroke="var(--border)"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity={0.4}
            />
            <text
              x={120}
              y={82}
              textAnchor="middle"
              className="font-mono uppercase"
              style={{ fontSize: 12, fill: "var(--muted)", letterSpacing: "0.2em" }}
            >
              Frozen
            </text>

            {[
              { y: 120, label: "T1 Enc", sub: "3D ResNet-18" },
              { y: 185, label: "DTI Enc", sub: "3D ResNet-18" },
              { y: 250, label: "Clin Enc", sub: "MLP" },
            ].map((e) => (
              <g key={e.label}>
                <rect x={55} y={e.y - 22} width="130" height="44" rx="3" {...boxStyle} />
                <text x={120} y={e.y - 4} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 600 }}>{e.label}</text>
                <text x={120} y={e.y + 12} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>{e.sub}</text>
              </g>
            ))}
          </g>

          {/* ═══ FUSION ═══ */}
          <g>
            <rect x={250} y={midY - 40} width="120" height="80" rx="3" {...boxStyle} />
            <text x={310} y={midY - 10} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 600 }}>Attention</text>
            <text x={310} y={midY + 6} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 600 }}>Fusion</text>
            <text x={310} y={midY + 24} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>8-head, pool-q</text>
          </g>

          {/* ═══ z_f ═══ */}
          <motion.g {...pulse}>
            <circle cx={430} cy={midY} r="28" fill="var(--card2)" stroke="var(--accent)" strokeWidth="1.8" />
            <text x={430} y={midY} textAnchor="middle" dominantBaseline="middle" className="font-mono" style={{ fontSize: 15, fill: "var(--fg)", fontWeight: 700 }}>z_f</text>
            <text x={430} y={midY + 45} textAnchor="middle" className="font-mono italic" style={{ fontSize: 12, fill: "var(--muted)" }}>ℝ⁵¹²</text>
          </motion.g>

          {/* ═══ FAISS ═══ */}
          <g>
            <rect x={500} y={midY - 32} width="140" height="64" rx="3" {...boxStyle} />
            <text x={570} y={midY - 8} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 600 }}>FAISS Index</text>
            <text x={570} y={midY + 9} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>IndexFlatIP</text>
            <text x={570} y={midY + 22} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--accent)" }}>1,889 vectors</text>
          </g>

          {/* ═══ CROSS ENCODER ═══ */}
          <g>
            <rect x={700} y={midY - 32} width="140" height="64" rx="3" {...boxStyle} />
            <text x={770} y={midY - 8} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 600 }}>Cross-Encoder</text>
            <text x={770} y={midY + 9} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>Rerank</text>
            <text x={770} y={midY + 22} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>top-50 → top-5</text>
          </g>

          {/* ═══ LLM ═══ */}
          <motion.g {...pulse}>
            <rect x={900} y={midY - 46} width="160" height="92" rx="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.8" />
            <text x={980} y={midY - 24} textAnchor="middle" className="font-mono" style={{ fontSize: 15, fill: "var(--fg)", fontWeight: 700 }}>LLM</text>
            <text x={980} y={midY - 6} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>Mistral 7B</text>
            <text x={980} y={midY + 8} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>Gemma 4 26B</text>
            <text x={980} y={midY + 22} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>MedGemma 4B</text>
          </motion.g>

          {/* ═══ OUTPUTS ═══ */}
          {[
            { y: midY - 70, label: "VQA Answer", accent: true },
            { y: midY, label: "Caption" },
            { y: midY + 100, label: "Similar Cases" },
          ].map((o) => (
            <g key={o.label}>
              <rect x={1090} y={o.y - 17} width="110" height="34" rx="3" fill="var(--card)" stroke={o.accent ? "var(--accent)" : "var(--border)"} strokeWidth={o.accent ? 1.5 : 1.2} />
              <text x={1145} y={o.y + 1} textAnchor="middle" dominantBaseline="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--fg)", fontWeight: 600 }}>{o.label}</text>
            </g>
          ))}

          {/* ═══ ANIMATED EDGES ═══ */}
          {/* Three encoders → Fusion (converging) */}
          <Edge reduced={reduced} id="vqa-t1-fuse" d={`M 190 120 L 248 ${midY - 10}`} delay={0} packet={{ dur: 2.6, begin: 0 }} />
          <Edge reduced={reduced} id="vqa-dti-fuse" d={`M 190 185 L 248 ${midY}`} delay={0.1} packet={{ dur: 2.6, begin: 0.4 }} />
          <Edge reduced={reduced} id="vqa-clin-fuse" d={`M 190 250 L 248 ${midY + 10}`} delay={0.2} packet={{ dur: 2.6, begin: 0.8 }} />

          {/* Fusion → z_f */}
          <Edge reduced={reduced} id="vqa-fuse-zf" d={`M 370 ${midY} L 400 ${midY}`} delay={0.3} packet={{ dur: 1.2, begin: 1.0 }} />

          {/* z_f → FAISS */}
          <Edge reduced={reduced} id="vqa-zf-faiss" d={`M 460 ${midY} L 498 ${midY}`} delay={0.4} packet={{ dur: 1.4, begin: 1.4 }} />

          {/* FAISS → Cross-encoder */}
          <Edge reduced={reduced} id="vqa-faiss-cross" d={`M 640 ${midY} L 698 ${midY}`} delay={0.5} packet={{ dur: 1.8, begin: 1.8 }} />

          {/* Cross-encoder → LLM */}
          <Edge reduced={reduced} id="vqa-cross-llm" d={`M 840 ${midY} L 898 ${midY}`} delay={0.6} packet={{ dur: 1.8, begin: 2.2 }} />

          {/* LLM → VQA Answer (accent — hero output) */}
          <Edge reduced={reduced} id="vqa-llm-answer" d={`M 1060 ${midY - 24} L 1088 ${midY - 70}`} accent delay={0.7} packet={{ dur: 2.0, begin: 2.6 }} />

          {/* LLM → Caption */}
          <Edge reduced={reduced} id="vqa-llm-caption" d={`M 1060 ${midY} L 1088 ${midY}`} delay={0.7} packet={null} />

          {/* Cross-encoder → Similar cases — routed below LLM */}
          <Edge
            reduced={reduced}
            id="vqa-cross-similar"
            d={`M 770 ${midY + 32} Q 770 ${midY + 100}, 820 ${midY + 100} L 1088 ${midY + 100}`}
            delay={0.8}
            packet={null}
          />

          {/* Flow labels */}
          <text x={670} y={midY - 42} textAnchor="middle" className="font-mono italic" style={{ fontSize: 12, fill: "var(--muted)" }}>top-50</text>
          <text x={870} y={midY - 42} textAnchor="middle" className="font-mono italic" style={{ fontSize: 12, fill: "var(--muted)" }}>top-5 context</text>
        </svg>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Frozen multi-modal encoders produce the fused embedding{" "}
        <span className="font-mono text-foreground">z_f ∈ ℝ⁵¹²</span>. FAISS retrieves top-50
        similar training subjects; a cross-encoder reranks down to top-5. The LLM generates answers
        from the retrieved context. Three LLM backbones are compared: Mistral 7B, Gemma 4 26B MoE,
        and MedGemma 1.5 4B.
      </p>
    </figure>
  )
}
