"use client"

import { motion, useReducedMotion } from "framer-motion"

interface Step {
  cx: number; cy: number; w: number; h: number
  label: string; sub: string; sub2?: string; accent: boolean
}

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
  const marker = accent ? "url(#ing-arrow-accent)" : "url(#ing-arrow)"

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

export default function IngestionPipeline() {
  const reduced = useReducedMotion() ?? false

  // ── geometry ──────────────────────────────────────
  const W = 1260
  const H = 350

  // 7 steps: cx positions spread across W with ~60px gaps
  // step widths: 110, 120, 130, 125, 125, 120, 110
  // cx:          80,  255,  435,  620,  805,  985, 1165
  // right edge of last box: 1165 + 55 = 1220 → 40px margin inside W=1260
  const steps: Step[] = [
    { cx: 80,   cy: 120, w: 110, h: 64, label: "PDF / Image", sub: "input",              accent: false },
    { cx: 255,  cy: 120, w: 120, h: 64, label: "Render",      sub: "PyMuPDF · scale 3",  accent: false },
    { cx: 435,  cy: 120, w: 130, h: 70, label: "Preprocess",  sub: "deskew · denoise",   sub2: "· binarize", accent: false },
    { cx: 620,  cy: 120, w: 125, h: 64, label: "Tesseract",   sub: "PSM 6/11/4 · conf",  accent: false },
    { cx: 805,  cy: 120, w: 125, h: 64, label: "Chunker",     sub: "300–700 tok · ovlp", accent: false },
    { cx: 985,  cy: 120, w: 120, h: 64, label: "Embedder",    sub: "MiniLM · 384-d",     accent: false },
    { cx: 1165, cy: 120, w: 110, h: 64, label: "Postgres",    sub: "pgvector + GIN",     accent: true  },
  ]

  // TrOCR fallback: sits below Tesseract (step 3 at cx=620)
  const trOCR = { cx: 620, cy: 268, w: 150, h: 64 }

  const boxStyle = { fill: "var(--card)", stroke: "var(--border)", strokeWidth: 1.2 } as const

  const pulse = reduced ? {} : {
    animate: { opacity: [0.85, 1, 0.85] },
    transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
  }

  // Derived edge endpoints
  // step0 right=135, step1 left=195/right=315, step2 left=370/right=500,
  // step3 left=558/right=683, step4 left=743/right=868, step5 left=925/right=1045,
  // step6 left=1110
  const s0r = steps[0].cx + steps[0].w / 2     // 135
  const s1l = steps[1].cx - steps[1].w / 2     // 195
  const s1r = steps[1].cx + steps[1].w / 2     // 315
  const s2l = steps[2].cx - steps[2].w / 2     // 370
  const s2r = steps[2].cx + steps[2].w / 2     // 500
  const s3l = steps[3].cx - steps[3].w / 2     // 558
  const s3r = steps[3].cx + steps[3].w / 2     // 683
  const s4l = steps[4].cx - steps[4].w / 2     // 743
  const s4r = steps[4].cx + steps[4].w / 2     // 868
  const s5l = steps[5].cx - steps[5].w / 2     // 925
  const s5r = steps[5].cx + steps[5].w / 2     // 1045
  const s6l = steps[6].cx - steps[6].w / 2     // 1110

  const tessCy   = steps[3].cy                 // 120
  const tessBot  = tessCy + steps[3].h / 2     // 152
  const chunkCy  = steps[4].cy                 // 120
  const chunkBot = chunkCy + steps[4].h / 2    // 152

  return (
    <figure className="my-8">
      <div className="rounded border border-border bg-card/40 p-4 sm:p-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Ingestion pipeline: PDF or image input is rendered by PyMuPDF, preprocessed (deskew, denoise, binarize), passed to Tesseract OCR with multi-pass PSM configs. If confidence is low, TrOCR fallback runs. Text chunks go to Sentence-Transformers for embeddings, then stored in Postgres with pgvector and GIN index."
        >
          <defs>
            <marker id="ing-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted)" />
            </marker>
            <marker id="ing-arrow-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
            </marker>
          </defs>

          {/* ═══ MAIN PIPELINE BOXES ═══ */}
          {steps.map((s) => (
            <g key={s.label}>
              {s.accent ? (
                <motion.g {...pulse}>
                  <rect x={s.cx - s.w / 2} y={s.cy - s.h / 2} width={s.w} height={s.h} rx="3" fill="var(--card)" stroke="var(--accent)" strokeWidth="1.5" />
                  <text x={s.cx} y={s.cy - 10} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>{s.label}</text>
                  <text x={s.cx} y={s.cy + 6}  textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--accent)" }}>{s.sub}</text>
                  {s.sub2 && <text x={s.cx} y={s.cy + 20} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--accent)" }}>{s.sub2}</text>}
                </motion.g>
              ) : (
                <g>
                  <rect x={s.cx - s.w / 2} y={s.cy - s.h / 2} width={s.w} height={s.h} rx="3" {...boxStyle} />
                  <text x={s.cx} y={s.cy - 10} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>{s.label}</text>
                  <text x={s.cx} y={s.cy + 6}  textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>{s.sub}</text>
                  {s.sub2 && <text x={s.cx} y={s.cy + 20} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>{s.sub2}</text>}
                </g>
              )}
            </g>
          ))}

          {/* ═══ TrOCR FALLBACK ═══ */}
          <g>
            <rect x={trOCR.cx - trOCR.w / 2} y={trOCR.cy - trOCR.h / 2} width={trOCR.w} height={trOCR.h} rx="3" fill="var(--card)" stroke="var(--border)" strokeWidth="1.2" strokeDasharray="5 3" />
            <text x={trOCR.cx} y={trOCR.cy - 10} textAnchor="middle" className="font-mono" style={{ fontSize: 13, fill: "var(--fg)", fontWeight: 700 }}>TrOCR</text>
            <text x={trOCR.cx} y={trOCR.cy + 6}  textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)" }}>VisionEncoderDecoder</text>
          </g>

          {/* ═══ STEP LABELS ABOVE ARROWS ═══ */}
          <text x={(steps[1].cx + steps[2].cx) / 2} y={96} textAnchor="middle" className="font-mono" style={{ fontSize: 9, fill: "var(--muted)", fontStyle: "italic" }}>rasterise</text>
          <text x={(steps[2].cx + steps[3].cx) / 2} y={96} textAnchor="middle" className="font-mono" style={{ fontSize: 9, fill: "var(--muted)", fontStyle: "italic" }}>clean image</text>
          <text x={(steps[3].cx + steps[4].cx) / 2} y={96} textAnchor="middle" className="font-mono" style={{ fontSize: 9, fill: "var(--muted)", fontStyle: "italic" }}>text + conf</text>
          <text x={(steps[4].cx + steps[5].cx) / 2} y={96} textAnchor="middle" className="font-mono" style={{ fontSize: 9, fill: "var(--muted)", fontStyle: "italic" }}>300–700 tok</text>
          <text x={(steps[5].cx + steps[6].cx) / 2} y={96} textAnchor="middle" className="font-mono" style={{ fontSize: 9, fill: "var(--muted)", fontStyle: "italic" }}>384-d vectors</text>

          {/* ═══ MAIN FLOW EDGES ═══ */}
          <Edge reduced={reduced} id="ing-0-1" d={`M ${s0r} 120 L ${s1l} 120`} delay={0}   packet={{ dur: 2.0, begin: 0   }} />
          <Edge reduced={reduced} id="ing-1-2" d={`M ${s1r} 120 L ${s2l} 120`} delay={0.1} packet={{ dur: 2.0, begin: 0.3 }} />
          <Edge reduced={reduced} id="ing-2-3" d={`M ${s2r} 120 L ${s3l} 120`} delay={0.2} packet={{ dur: 2.0, begin: 0.6 }} />
          <Edge reduced={reduced} id="ing-3-4" d={`M ${s3r} 120 L ${s4l} 120`} delay={0.3} packet={{ dur: 2.0, begin: 0.9 }} />
          <Edge reduced={reduced} id="ing-4-5" d={`M ${s4r} 120 L ${s5l} 120`} delay={0.4} packet={{ dur: 2.0, begin: 1.2 }} />
          <Edge reduced={reduced} accent id="ing-5-6" d={`M ${s5r} 120 L ${s6l} 120`} delay={0.5} packet={{ dur: 2.0, begin: 1.5 }} />

          {/* ═══ TrOCR BRANCH ═══ */}
          {/* Tesseract down to TrOCR (dashed — fallback path) */}
          <Edge reduced={reduced} id="ing-ocr-trocr"   d={`M ${steps[3].cx} ${tessBot} L ${steps[3].cx} ${trOCR.cy - trOCR.h / 2 - 2}`} dashed delay={0.3} packet={null} />
          {/* TrOCR merges back into Chunker */}
          <Edge reduced={reduced} id="ing-trocr-chunk" d={`M ${trOCR.cx + trOCR.w / 2} ${trOCR.cy} Q ${steps[4].cx} ${trOCR.cy} ${steps[4].cx} ${chunkBot}`} dashed delay={0.4} packet={null} />

          {/* TrOCR labels */}
          <text x={steps[3].cx + 28} y={200} className="font-mono" style={{ fontSize: 10, fill: "var(--muted)", fontStyle: "italic" }}>low conf</text>
          <text x={(trOCR.cx + trOCR.w / 2 + steps[4].cx) / 2} y={258} textAnchor="middle" className="font-mono" style={{ fontSize: 10, fill: "var(--muted)", fontStyle: "italic" }}>fallback text</text>
        </svg>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        Each document goes through PyMuPDF rendering at scale 3 for clarity, then deskew (affine transform), non-local-means denoising, and Otsu/adaptive binarization before Tesseract runs three PSM passes and keeps the highest-confidence result. If average token confidence falls below the threshold, TrOCR (ViT encoder + Transformer LM) handles the page as a fallback. Text is then chunked at 300–700 tokens with overlap, embedded by Sentence-Transformers, and stored in Postgres.
      </p>
    </figure>
  )
}
