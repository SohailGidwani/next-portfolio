export default function VLMArchitecture() {
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
              id="arrow"
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
              id="arrow-accent"
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
            {/* T1 */}
            <rect x={colIn - 40} y={rowT - 30} width="100" height="60" rx="3" {...boxStyle} />
            <text
              x={colIn + 10}
              y={rowT - 5}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 11, fill: "var(--fg)", fontWeight: 600 }}
            >
              T1 MRI
            </text>
            <text
              x={colIn + 10}
              y={rowT + 15}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              91×109×91
            </text>

            {/* DTI */}
            <rect x={colIn - 40} y={rowD - 30} width="100" height="60" rx="3" {...boxStyle} />
            <text
              x={colIn + 10}
              y={rowD - 5}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 11, fill: "var(--fg)", fontWeight: 600 }}
            >
              DTI FA
            </text>
            <text
              x={colIn + 10}
              y={rowD + 15}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              91×109×91
            </text>

            {/* Clinical */}
            <rect x={colIn - 40} y={rowC - 30} width="100" height="60" rx="3" {...boxStyle} />
            <text
              x={colIn + 10}
              y={rowC - 5}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 11, fill: "var(--fg)", fontWeight: 600 }}
            >
              Clinical
            </text>
            <text
              x={colIn + 10}
              y={rowC + 15}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              6 feats + APOE
            </text>
          </g>

          {/* ═══ ENCODERS ═══ */}
          <g>
            {[rowT, rowD].map((y, i) => (
              <g key={`enc-${i}`}>
                <rect x={colEnc - 55} y={y - 24} width="130" height="48" rx="3" {...boxStyle} />
                <text
                  x={colEnc + 10}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-mono"
                  style={{ fontSize: 11, fill: "var(--fg)", fontWeight: 600 }}
                >
                  3D ResNet-18
                </text>
                <text
                  x={colEnc + 10}
                  y={y + 16}
                  textAnchor="middle"
                  className="font-mono"
                  style={{ fontSize: 9, fill: "var(--muted)" }}
                >
                  → 512-d
                </text>
              </g>
            ))}
            <rect x={colEnc - 55} y={rowC - 24} width="130" height="48" rx="3" {...boxStyle} />
            <text
              x={colEnc + 10}
              y={rowC}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-mono"
              style={{ fontSize: 11, fill: "var(--fg)", fontWeight: 600 }}
            >
              Clinical MLP
            </text>
            <text
              x={colEnc + 10}
              y={rowC + 16}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              → 512-d
            </text>
          </g>

          {/* ═══ EMBEDDINGS ═══ */}
          {[
            { y: rowT, label: "z_T1" },
            { y: rowD, label: "z_DTI" },
            { y: rowC, label: "z_Clin" },
          ].map((e) => (
            <g key={e.label}>
              <circle
                cx={colEmb}
                cy={e.y}
                r="24"
                fill="var(--card2)"
                stroke="var(--accent)"
                strokeWidth="1.2"
              />
              <text
                x={colEmb}
                y={e.y}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-mono"
                style={{ fontSize: 11, fill: "var(--fg)", fontWeight: 700 }}
              >
                {e.label}
              </text>
              <text
                x={colEmb}
                y={e.y + 40}
                textAnchor="middle"
                className="font-mono italic"
                style={{ fontSize: 9, fill: "var(--muted)" }}
              >
                ℓ2, ℝ⁵¹²
              </text>
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
                <rect
                  x={colMask - 16}
                  y={m.y - 16}
                  width="32"
                  height="32"
                  fill="var(--card)"
                  stroke="var(--accent)"
                  strokeWidth="1.2"
                />
              </g>
              <text
                x={colMask}
                y={m.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 14, fill: "var(--accent)", fontWeight: 700 }}
              >
                ×
              </text>
              <text
                x={colMask}
                y={m.y - 32}
                textAnchor="middle"
                className="font-mono"
                style={{ fontSize: 9, fill: "var(--muted)" }}
              >
                drop {m.drop}
              </text>
            </g>
          ))}

          {/* ═══ FUSION ═══ */}
          <g>
            <rect x={colFuse - 60} y={rowD - 60} width="140" height="120" rx="3" {...boxStyle} />
            <text
              x={colFuse + 10}
              y={rowD - 30}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 11, fill: "var(--fg)", fontWeight: 600 }}
            >
              Cross-Attention
            </text>
            <text
              x={colFuse + 10}
              y={rowD - 10}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              8 heads
            </text>
            <text
              x={colFuse + 10}
              y={rowD + 8}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              pool query
            </text>
            <text
              x={colFuse + 10}
              y={rowD + 26}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              + modality emb.
            </text>
            <text
              x={colFuse + 10}
              y={rowD + 46}
              textAnchor="middle"
              className="font-mono uppercase"
              style={{ fontSize: 9, fill: "var(--accent)", letterSpacing: "0.15em", fontWeight: 700 }}
            >
              Fusion
            </text>
          </g>

          {/* ═══ FUSED EMBEDDING ═══ */}
          <g>
            <circle
              cx={colZf}
              cy={rowD}
              r="28"
              fill="var(--card2)"
              stroke="var(--accent)"
              strokeWidth="1.8"
            />
            <text
              x={colZf}
              y={rowD}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-mono"
              style={{ fontSize: 12, fill: "var(--fg)", fontWeight: 700 }}
            >
              z_f
            </text>
            <text
              x={colZf}
              y={rowD + 45}
              textAnchor="middle"
              className="font-mono italic"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              ℝ⁵¹²
            </text>
          </g>

          {/* ═══ TASK HEADS ═══ */}
          {heads.map((h) => (
            <g key={h.label}>
              <rect
                x={colHead - 55}
                y={h.y - 15}
                width="130"
                height="30"
                rx="3"
                fill="var(--card)"
                stroke={h.accent ? "var(--accent)" : "var(--border)"}
                strokeWidth={h.accent ? 1.5 : 1.2}
              />
              <text
                x={colHead - 45}
                y={h.y + 1}
                dominantBaseline="middle"
                className="font-mono"
                style={{ fontSize: 10, fill: "var(--fg)", fontWeight: 600 }}
              >
                {h.label}
              </text>
              <text
                x={colHead + 45}
                y={h.y + 1}
                textAnchor="end"
                dominantBaseline="middle"
                className="font-mono italic"
                style={{ fontSize: 9, fill: "var(--muted)" }}
              >
                {h.dim}
              </text>
            </g>
          ))}

          {/* ═══ ARROWS ═══ */}
          <g fill="none" strokeWidth="1.5" markerEnd="url(#arrow)">
            {/* Inputs → Encoders */}
            <line x1={colIn + 60} y1={rowT} x2={colEnc - 62} y2={rowT} stroke="var(--muted)" />
            <line x1={colIn + 60} y1={rowD} x2={colEnc - 62} y2={rowD} stroke="var(--muted)" />
            <line x1={colIn + 60} y1={rowC} x2={colEnc - 62} y2={rowC} stroke="var(--muted)" />

            {/* Encoders → Embeddings */}
            <line x1={colEnc + 75} y1={rowT} x2={colEmb - 28} y2={rowT} stroke="var(--muted)" />
            <line x1={colEnc + 75} y1={rowD} x2={colEmb - 28} y2={rowD} stroke="var(--muted)" />
            <line x1={colEnc + 75} y1={rowC} x2={colEmb - 28} y2={rowC} stroke="var(--muted)" />

            {/* Embeddings → Masks */}
            <line x1={colEmb + 28} y1={rowT} x2={colMask - 22} y2={rowT} stroke="var(--muted)" />
            <line x1={colEmb + 28} y1={rowD} x2={colMask - 22} y2={rowD} stroke="var(--muted)" />
            <line x1={colEmb + 28} y1={rowC} x2={colMask - 22} y2={rowC} stroke="var(--muted)" />

            {/* Masks → Fusion (all converge to fusion center) */}
            <line x1={colMask + 22} y1={rowT} x2={colFuse - 62} y2={rowD} stroke="var(--muted)" />
            <line x1={colMask + 22} y1={rowD} x2={colFuse - 62} y2={rowD} stroke="var(--muted)" />
            <line x1={colMask + 22} y1={rowC} x2={colFuse - 62} y2={rowD} stroke="var(--muted)" />
          </g>

          {/* Fusion → z_f (accent) */}
          <line
            x1={colFuse + 80}
            y1={rowD}
            x2={colZf - 30}
            y2={rowD}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            markerEnd="url(#arrow-accent)"
          />

          {/* z_f → heads (fanout) */}
          {heads.map((h) => (
            <line
              key={`line-${h.label}`}
              x1={colZf + 28}
              y1={rowD}
              x2={colHead - 57}
              y2={h.y}
              fill="none"
              stroke={h.accent ? "var(--accent)" : "var(--muted)"}
              strokeWidth={h.accent ? 1.5 : 1.2}
              opacity={h.accent ? 1 : 0.7}
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
