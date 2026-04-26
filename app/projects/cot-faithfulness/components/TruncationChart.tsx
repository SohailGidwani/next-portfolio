"use client"

import { useState } from "react"

const SERIES = [
  {
    label: "Llama 3B · Math",
    color: "#d97706",
    dashed: false,
    data: [22.7, 26.8, 22.6, 18.8, 13.3],
  },
  {
    label: "Qwen 7B · Math",
    color: "#d97706",
    dashed: true,
    data: [9.2, 11.6, 22.6, 23.0, 20.5],
  },
  {
    label: "Llama 3B · Science",
    color: "#60a5fa",
    dashed: false,
    data: [59.3, 58.9, 61.8, 62.4, 55.1],
  },
  {
    label: "Qwen 7B · Science",
    color: "#60a5fa",
    dashed: true,
    data: [82.7, 85.9, 87.3, 85.0, 80.0],
  },
]

const STEPS = [1, 2, 3, 4, 5]
const Y_MIN = 0
const Y_MAX = 100
const W = 800
const H = 320
const PAD = { top: 24, right: 28, bottom: 44, left: 48 }
const IW = W - PAD.left - PAD.right
const IH = H - PAD.top - PAD.bottom

const xScale = (step: number) => PAD.left + ((step - 1) / (STEPS.length - 1)) * IW
const yScale = (v: number) => PAD.top + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * IH

const yTicks = [0, 20, 40, 60, 80, 100]

const TOOLTIP_W = 190
const TOOLTIP_H = 30 + SERIES.length * 16

interface Props {
  caption?: string
}

export default function TruncationChart({ caption }: Props) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  function handleMouseMove(e: React.MouseEvent<SVGRectElement>) {
    const svgEl = (e.currentTarget as SVGRectElement).ownerSVGElement!
    const rect = svgEl.getBoundingClientRect()
    const svgX = ((e.clientX - rect.left) / rect.width) * W
    let nearest = 0
    let minDist = Infinity
    STEPS.forEach((s, i) => {
      const d = Math.abs(svgX - xScale(s))
      if (d < minDist) { minDist = d; nearest = i }
    })
    setHoverIdx(nearest)
  }

  return (
    <figure className="my-8">
      <div className="rounded border border-border bg-card/40 p-4 sm:p-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Step Consistency Rate curves for Llama and Qwen on GSM8K and ARC"
        >
          {/* Y grid */}
          {yTicks.map((v) => (
            <g key={`y-${v}`}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={yScale(v)}
                y2={yScale(v)}
                stroke="var(--border)"
                strokeDasharray="2 4"
                strokeWidth="1"
                opacity={v === 0 || v === 100 ? 0.5 : 0.25}
              />
              <text
                x={PAD.left - 10}
                y={yScale(v)}
                textAnchor="end"
                dominantBaseline="middle"
                className="font-mono"
                style={{ fontSize: 10, fill: "var(--muted)" }}
              >
                {v}%
              </text>
            </g>
          ))}

          {/* X grid */}
          {STEPS.map((s) => (
            <g key={`x-${s}`}>
              <line
                x1={xScale(s)}
                x2={xScale(s)}
                y1={PAD.top}
                y2={H - PAD.bottom}
                stroke="var(--border)"
                strokeDasharray="2 4"
                strokeWidth="1"
                opacity={0.2}
              />
              <text
                x={xScale(s)}
                y={H - PAD.bottom + 16}
                textAnchor="middle"
                className="font-mono"
                style={{ fontSize: 10, fill: "var(--muted)" }}
              >
                Step {s}
              </text>
            </g>
          ))}

          {/* Y label */}
          <text
            transform={`translate(14, ${PAD.top + IH / 2}) rotate(-90)`}
            textAnchor="middle"
            className="font-mono uppercase"
            style={{ fontSize: 9, fill: "var(--muted)", letterSpacing: "0.15em" }}
          >
            SCR (%)
          </text>

          {/* Series lines */}
          {SERIES.map((s) => {
            const d = s.data
              .map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i + 1)} ${yScale(v)}`)
              .join(" ")
            return (
              <g key={s.label}>
                <path
                  d={d}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeDasharray={s.dashed ? "6 4" : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {s.data.map((v, i) => (
                  <circle
                    key={i}
                    cx={xScale(i + 1)}
                    cy={yScale(v)}
                    r={hoverIdx === i ? 5 : 3}
                    fill={s.color}
                  />
                ))}
              </g>
            )
          })}

          {/* Crosshair + tooltip */}
          {hoverIdx !== null && (() => {
            const hx = xScale(hoverIdx + 1)
            const ty = PAD.top + 10
            const tx = hx + 14 > W - PAD.right - TOOLTIP_W ? hx - TOOLTIP_W - 14 : hx + 14
            return (
              <g>
                <line
                  x1={hx}
                  x2={hx}
                  y1={PAD.top}
                  y2={H - PAD.bottom}
                  stroke="var(--muted)"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  opacity={0.4}
                />
                <rect
                  x={tx}
                  y={ty}
                  width={TOOLTIP_W}
                  height={TOOLTIP_H}
                  rx={3}
                  style={{ fill: "var(--card)", stroke: "var(--border)", strokeWidth: 1 }}
                />
                <text
                  x={tx + 10}
                  y={ty + 14}
                  className="font-mono"
                  style={{ fontSize: 9, fill: "var(--muted)", letterSpacing: "0.12em" }}
                >
                  STEP {hoverIdx + 1}
                </text>
                {SERIES.map((s, i) => (
                  <g key={s.label}>
                    <circle cx={tx + 14} cy={ty + 26 + i * 16} r={3} fill={s.color} />
                    <text
                      x={tx + 24}
                      y={ty + 30 + i * 16}
                      className="font-mono"
                      style={{ fontSize: 9, fill: "var(--fg)" }}
                    >
                      {s.label}: {s.data[hoverIdx]}%
                    </text>
                  </g>
                ))}
              </g>
            )
          })()}

          {/* Invisible overlay — must be last to sit on top */}
          <rect
            x={PAD.left}
            y={PAD.top}
            width={IW}
            height={IH}
            fill="transparent"
            style={{ cursor: "crosshair" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIdx(null)}
          />
        </svg>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
          {SERIES.map((s) => (
            <div key={s.label} className="flex items-center gap-2">
              <span
                className="inline-block h-px w-5"
                style={{
                  borderTop: s.dashed ? `2px dashed ${s.color}` : `2px solid ${s.color}`,
                }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      {caption && (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{caption}</p>
      )}
    </figure>
  )
}
