export default function VQAPipeline() {
  const W = 1200
  const H = 380
  const midY = H / 2

  const boxStyle = {
    fill: "var(--card)",
    stroke: "var(--border)",
    strokeWidth: 1.2,
  } as const

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
              style={{ fontSize: 9, fill: "var(--muted)", letterSpacing: "0.2em" }}
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
                <text
                  x={120}
                  y={e.y - 4}
                  textAnchor="middle"
                  className="font-mono"
                  style={{ fontSize: 10, fill: "var(--fg)", fontWeight: 600 }}
                >
                  {e.label}
                </text>
                <text
                  x={120}
                  y={e.y + 12}
                  textAnchor="middle"
                  className="font-mono"
                  style={{ fontSize: 9, fill: "var(--muted)" }}
                >
                  {e.sub}
                </text>
              </g>
            ))}
          </g>

          {/* ═══ FUSION ═══ */}
          <g>
            <rect x={250} y={midY - 40} width="120" height="80" rx="3" {...boxStyle} />
            <text
              x={310}
              y={midY - 10}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 10, fill: "var(--fg)", fontWeight: 600 }}
            >
              Attention
            </text>
            <text
              x={310}
              y={midY + 6}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 10, fill: "var(--fg)", fontWeight: 600 }}
            >
              Fusion
            </text>
            <text
              x={310}
              y={midY + 24}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              8-head, pool-q
            </text>
          </g>

          {/* ═══ z_f ═══ */}
          <g>
            <circle
              cx={430}
              cy={midY}
              r="28"
              fill="var(--card2)"
              stroke="var(--accent)"
              strokeWidth="1.8"
            />
            <text
              x={430}
              y={midY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="font-mono"
              style={{ fontSize: 12, fill: "var(--fg)", fontWeight: 700 }}
            >
              z_f
            </text>
            <text
              x={430}
              y={midY + 45}
              textAnchor="middle"
              className="font-mono italic"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              ℝ⁵¹²
            </text>
          </g>

          {/* ═══ FAISS ═══ */}
          <g>
            <rect x={500} y={midY - 32} width="140" height="64" rx="3" {...boxStyle} />
            <text
              x={570}
              y={midY - 8}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 10, fill: "var(--fg)", fontWeight: 600 }}
            >
              FAISS Index
            </text>
            <text
              x={570}
              y={midY + 9}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              IndexFlatIP
            </text>
            <text
              x={570}
              y={midY + 22}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--accent)" }}
            >
              1,889 vectors
            </text>
          </g>

          {/* ═══ CROSS ENCODER ═══ */}
          <g>
            <rect x={700} y={midY - 32} width="140" height="64" rx="3" {...boxStyle} />
            <text
              x={770}
              y={midY - 8}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 10, fill: "var(--fg)", fontWeight: 600 }}
            >
              Cross-Encoder
            </text>
            <text
              x={770}
              y={midY + 9}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              Rerank
            </text>
            <text
              x={770}
              y={midY + 22}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              top-50 → top-5
            </text>
          </g>

          {/* ═══ LLM ═══ */}
          <g>
            <rect
              x={900}
              y={midY - 46}
              width="160"
              height="92"
              rx="3"
              fill="var(--card)"
              stroke="var(--accent)"
              strokeWidth="1.8"
            />
            <text
              x={980}
              y={midY - 24}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 12, fill: "var(--fg)", fontWeight: 700 }}
            >
              LLM
            </text>
            <text
              x={980}
              y={midY - 6}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              Mistral 7B
            </text>
            <text
              x={980}
              y={midY + 8}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              Gemma 4 26B
            </text>
            <text
              x={980}
              y={midY + 22}
              textAnchor="middle"
              className="font-mono"
              style={{ fontSize: 9, fill: "var(--muted)" }}
            >
              MedGemma 4B
            </text>
          </g>

          {/* ═══ OUTPUTS ═══ */}
          {[
            { y: midY - 60, label: "VQA Answer", accent: true },
            { y: midY, label: "Caption" },
            { y: midY + 60, label: "Similar Cases" },
          ].map((o) => (
            <g key={o.label}>
              <rect
                x={1110}
                y={o.y - 15}
                width="80"
                height="30"
                rx="3"
                fill="var(--card)"
                stroke={o.accent ? "var(--accent)" : "var(--border)"}
                strokeWidth={o.accent ? 1.5 : 1.2}
              />
              <text
                x={1150}
                y={o.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-mono"
                style={{ fontSize: 9, fill: "var(--fg)", fontWeight: 600 }}
              >
                {o.label}
              </text>
            </g>
          ))}

          {/* ═══ ARROWS ═══ */}
          <g fill="none" strokeWidth="1.5" markerEnd="url(#vqa-arrow)">
            <line x1={190} y1={120} x2={248} y2={midY - 10} stroke="var(--muted)" />
            <line x1={190} y1={185} x2={248} y2={midY} stroke="var(--muted)" />
            <line x1={190} y1={250} x2={248} y2={midY + 10} stroke="var(--muted)" />

            <line x1={370} y1={midY} x2={400} y2={midY} stroke="var(--muted)" />
            <line x1={460} y1={midY} x2={498} y2={midY} stroke="var(--muted)" />
            <line x1={640} y1={midY} x2={698} y2={midY} stroke="var(--muted)" />
            <line x1={840} y1={midY} x2={898} y2={midY} stroke="var(--muted)" />

            <line x1={1060} y1={midY - 20} x2={1108} y2={midY - 60} stroke="var(--muted)" />
            <line x1={1060} y1={midY} x2={1108} y2={midY} stroke="var(--muted)" />
            <line x1={840} y1={midY + 20} x2={1108} y2={midY + 60} stroke="var(--muted)" />
          </g>

          {/* Flow labels */}
          <text
            x={670}
            y={midY - 42}
            textAnchor="middle"
            className="font-mono italic"
            style={{ fontSize: 9, fill: "var(--muted)" }}
          >
            top-50
          </text>
          <text
            x={870}
            y={midY - 42}
            textAnchor="middle"
            className="font-mono italic"
            style={{ fontSize: 9, fill: "var(--muted)" }}
          >
            top-5 context
          </text>
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
