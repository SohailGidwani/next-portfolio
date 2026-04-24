"use client"

import { motion, useReducedMotion } from "framer-motion"

interface EdgeProps {
  id: string
  d: string
  accent?: boolean
  opacity?: number
  strokeWidth?: number
  delay?: number
  packet?: { dur: number; begin: number } | null
  reduced: boolean
}

function Edge({
  id,
  d,
  accent,
  opacity = 1,
  strokeWidth,
  delay = 0,
  packet,
  reduced,
}: EdgeProps) {
  const stroke = accent ? "var(--accent)" : "var(--muted)"
  const sw = strokeWidth ?? (accent ? 2 : 1.5)
  const marker = accent ? "url(#vlm-arrow-accent)" : "url(#vlm-arrow)"

  return (
    <>
      <motion.path
        id={id}
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
        opacity={opacity}
        markerEnd={marker}
        initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.9, ease: "easeInOut", delay }}
      />
      {packet && !reduced ? (
        <circle r="2.5" fill="var(--accent)" opacity={accent ? 1 : 0.85}>
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

export default function VLMArchitecture() {
  const reduced = useReducedMotion() ?? false

  const W = 1100
  const H = 520

  // Row y-coordinates (T1 top, DTI middle, Clinical bottom)
  const rowT = 110
  const rowD = 260
  const rowC = 410

  // Column x-coordinates
  const colIn = 70
  const colEnc = 240
  const colEmb = 430
  const colMask = 570
  const colFuse = 720
  const colZf = 880
  const colHead = 1020

  const boxStyle = {
    fill: "var(--card)",
    stroke: "var(--border)",
    strokeWidth: 1.2,
  } as const

  const heads = [
    { y: rowD - 165, label: "DX 3-class", dim: "→ 3" },
    { y: rowD - 100, label: "DX Binary", dim: "→ 2" },
    { y: rowD - 35, label: "Sex", dim: "→ 2" },
    { y: rowD + 30, label: "Age", dim: "→ 1" },
    { y: rowD + 95, label: "CDR-SB", dim: "→ 1" },
    { y: rowD + 160, label: "Amyloid", dim: "→ 2", accent: true },
  ]

  // Continuous pulse on "hot" nodes
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
          aria-label="Multi-modal VLM architecture: three encoders produce embeddings that pass through modality-masking gates into a cross-attention fusion block, then six task heads"
        >
          <defs>
            <marker
              id="vlm-arrow"
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
              id="vlm-arrow-accent"
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

          {/* ═══ INPUT LABELS ═══ */}
          <g>
            <rect x={colIn - 40} y={rowT - 30} width="100" height="60" rx="3" {...boxStyle} />
            <text x={colIn + 10} y={rowT - 5} textAnchor="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 600 }}>T1 MRI</text>
            <text x={colIn + 10} y={rowT + 15} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>91×109×91</text>

            <rect x={colIn - 40} y={rowD - 30} width="100" height="60" rx="3" {...boxStyle} />
            <text x={colIn + 10} y={rowD - 5} textAnchor="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 600 }}>DTI FA</text>
            <text x={colIn + 10} y={rowD + 15} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>91×109×91</text>

            <rect x={colIn - 40} y={rowC - 30} width="100" height="60" rx="3" {...boxStyle} />
            <text x={colIn + 10} y={rowC - 5} textAnchor="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 600 }}>Clinical</text>
            <text x={colIn + 10} y={rowC + 15} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>6 feats + APOE</text>
          </g>

          {/* ═══ ENCODERS ═══ */}
          <g>
            {[rowT, rowD].map((y, i) => (
              <g key={`enc-${i}`}>
                <rect x={colEnc - 55} y={y - 24} width="130" height="48" rx="3" {...boxStyle} />
                <text x={colEnc + 10} y={y} textAnchor="middle" dominantBaseline="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 600 }}>3D ResNet-18</text>
                <text x={colEnc + 10} y={y + 16} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>→ 512-d</text>
              </g>
            ))}
            <rect x={colEnc - 55} y={rowC - 24} width="130" height="48" rx="3" {...boxStyle} />
            <text x={colEnc + 10} y={rowC} textAnchor="middle" dominantBaseline="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 600 }}>Clinical MLP</text>
            <text x={colEnc + 10} y={rowC + 16} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>→ 512-d</text>
          </g>

          {/* ═══ EMBEDDINGS ═══ */}
          {[
            { y: rowT, label: "z_T1" },
            { y: rowD, label: "z_DTI" },
            { y: rowC, label: "z_Clin" },
          ].map((e) => (
            <g key={e.label}>
              <circle cx={colEmb} cy={e.y} r="24" fill="var(--card2)" stroke="var(--accent)" strokeWidth="1.2" />
              <text x={colEmb} y={e.y} textAnchor="middle" dominantBaseline="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 700 }}>{e.label}</text>
              <text x={colEmb} y={e.y + 40} textAnchor="middle" className="font-mono italic" style={{ fontSize: 12, fill: "var(--muted)" }}>ℓ2, ℝ⁵¹²</text>
            </g>
          ))}

          {/* ═══ MASKING GATES ═══ */}
          {[
            { y: rowT, drop: "10%" },
            { y: rowD, drop: "30%" },
            { y: rowC, drop: "5%" },
          ].map((m, i) => (
            <g key={`mask-${i}`}>
              <g transform={`rotate(45 ${colMask} ${m.y})`}>
                <rect x={colMask - 16} y={m.y - 16} width="32" height="32" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.2" />
              </g>
              <text x={colMask} y={m.y + 1} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 17, fill: "var(--accent)", fontWeight: 700 }}>×</text>
              <text x={colMask} y={m.y - 32} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>drop {m.drop}</text>
            </g>
          ))}

          {/* ═══ FUSION ═══ */}
          <motion.g {...pulse}>
            <rect x={colFuse - 60} y={rowD - 60} width="140" height="120" rx="3" {...boxStyle} />
            <text x={colFuse + 10} y={rowD - 30} textAnchor="middle" className="font-mono" style={{ fontSize: 14, fill: "var(--fg)", fontWeight: 600 }}>Cross-Attention</text>
            <text x={colFuse + 10} y={rowD - 10} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>8 heads</text>
            <text x={colFuse + 10} y={rowD + 8} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>pool query</text>
            <text x={colFuse + 10} y={rowD + 26} textAnchor="middle" className="font-mono" style={{ fontSize: 12, fill: "var(--muted)" }}>+ modality emb.</text>
            <text x={colFuse + 10} y={rowD + 46} textAnchor="middle" className="font-mono uppercase" style={{ fontSize: 12, fill: "var(--accent)", letterSpacing: "0.15em", fontWeight: 700 }}>Fusion</text>
          </motion.g>

          {/* ═══ FUSED EMBEDDING ═══ */}
          <motion.g {...pulse}>
            <circle cx={colZf} cy={rowD} r="28" fill="var(--card2)" stroke="var(--accent)" strokeWidth="1.8" />
            <text x={colZf} y={rowD} textAnchor="middle" dominantBaseline="middle" className="font-mono" style={{ fontSize: 15, fill: "var(--fg)", fontWeight: 700 }}>z_f</text>
            <text x={colZf} y={rowD + 45} textAnchor="middle" className="font-mono italic" style={{ fontSize: 12, fill: "var(--muted)" }}>ℝ⁵¹²</text>
          </motion.g>

          {/* ═══ TASK HEADS ═══ */}
          {heads.map((h) => (
            <g key={h.label}>
              <rect x={colHead - 70} y={h.y - 18} width="150" height="36" rx="3" fill="var(--card)" stroke={h.accent ? "var(--accent)" : "var(--border)"} strokeWidth={h.accent ? 1.5 : 1.2} />
              <text x={colHead - 60} y={h.y + 1} dominantBaseline="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 600 }}>{h.label}</text>
              <text x={colHead + 70} y={h.y + 1} textAnchor="end" dominantBaseline="middle" className="font-mono italic" style={{ fontSize: 12, fill: "var(--muted)" }}>{h.dim}</text>
            </g>
          ))}

          {/* ═══ ANIMATED EDGES ═══ */}
          {/* Inputs → Encoders — each gets a flowing packet, staggered */}
          <Edge reduced={reduced} id="vlm-in-enc-t1" d={`M ${colIn + 60} ${rowT} L ${colEnc - 62} ${rowT}`} packet={{ dur: 3, begin: 0 }} />
          <Edge reduced={reduced} id="vlm-in-enc-dti" d={`M ${colIn + 60} ${rowD} L ${colEnc - 62} ${rowD}`} packet={{ dur: 3, begin: 0.4 }} />
          <Edge reduced={reduced} id="vlm-in-enc-clin" d={`M ${colIn + 60} ${rowC} L ${colEnc - 62} ${rowC}`} packet={{ dur: 3, begin: 0.8 }} />

          {/* Encoders → Embeddings */}
          <Edge reduced={reduced} id="vlm-enc-emb-t1" d={`M ${colEnc + 75} ${rowT} L ${colEmb - 28} ${rowT}`} delay={0.2} packet={{ dur: 2, begin: 0.6 }} />
          <Edge reduced={reduced} id="vlm-enc-emb-dti" d={`M ${colEnc + 75} ${rowD} L ${colEmb - 28} ${rowD}`} delay={0.2} packet={{ dur: 2, begin: 1.0 }} />
          <Edge reduced={reduced} id="vlm-enc-emb-clin" d={`M ${colEnc + 75} ${rowC} L ${colEmb - 28} ${rowC}`} delay={0.2} packet={{ dur: 2, begin: 1.4 }} />

          {/* Embeddings → Masks */}
          <Edge reduced={reduced} id="vlm-emb-mask-t1" d={`M ${colEmb + 28} ${rowT} L ${colMask - 22} ${rowT}`} delay={0.3} packet={{ dur: 1.8, begin: 1.2 }} />
          <Edge reduced={reduced} id="vlm-emb-mask-dti" d={`M ${colEmb + 28} ${rowD} L ${colMask - 22} ${rowD}`} delay={0.3} packet={{ dur: 1.8, begin: 1.6 }} />
          <Edge reduced={reduced} id="vlm-emb-mask-clin" d={`M ${colEmb + 28} ${rowC} L ${colMask - 22} ${rowC}`} delay={0.3} packet={{ dur: 1.8, begin: 2.0 }} />

          {/* Masks → Fusion (converging — all get packets, shows merge) */}
          <Edge reduced={reduced} id="vlm-mask-fuse-t1" d={`M ${colMask + 22} ${rowT} L ${colFuse - 62} ${rowD}`} delay={0.4} packet={{ dur: 2.2, begin: 1.2 }} />
          <Edge reduced={reduced} id="vlm-mask-fuse-dti" d={`M ${colMask + 22} ${rowD} L ${colFuse - 62} ${rowD}`} delay={0.4} packet={{ dur: 2.2, begin: 1.6 }} />
          <Edge reduced={reduced} id="vlm-mask-fuse-clin" d={`M ${colMask + 22} ${rowC} L ${colFuse - 62} ${rowD}`} delay={0.4} packet={{ dur: 2.2, begin: 2.0 }} />

          {/* Fusion → z_f (accent, hero arrow) */}
          <Edge
            reduced={reduced}
            id="vlm-fuse-zf"
            d={`M ${colFuse + 80} ${rowD} L ${colZf - 30} ${rowD}`}
            accent
            delay={0.5}
            packet={{ dur: 1.8, begin: 2.4 }}
          />

          {/* z_f → heads (fanout) */}
          {heads.map((h) => (
            <Edge
              reduced={reduced}
              key={`vlm-edge-${h.label}`}
              id={`vlm-zf-head-${h.label.replace(/\s/g, "-")}`}
              d={`M ${colZf + 28} ${rowD} L ${colHead - 72} ${h.y}`}
              accent={h.accent}
              opacity={h.accent ? 1 : 0.7}
              strokeWidth={h.accent ? 1.5 : 1.2}
              delay={0.6}
              packet={h.accent ? { dur: 2.2, begin: 2.8 } : null}
            />
          ))}
        </svg>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Three modality-specific encoders produce ℓ2-normalized 512-d embeddings. Each passes
        through a masking gate that randomly drops modalities during training (T1: 10%, DTI: 30%,
        Clinical: 5%). Masked embeddings are fused via 8-head cross-attention with a learnable pool
        query, producing <span className="font-mono text-foreground">z_f ∈ ℝ⁵¹²</span> that feeds
        six MLP task heads. Amyloid head upweighted as the primary clinical target.
      </p>
    </figure>
  )
}
