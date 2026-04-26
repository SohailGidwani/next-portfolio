"use client"

import { useState } from "react"

const SERIES = [
  {
    label: "Llama 3B · Science",
    color: "#60a5fa",
    dashed: false,
    data: [17.2, 13.2, 15.6, 13.6],
  },
  {
    label: "Qwen 7B · Science",
    color: "#3b82f6",
    dashed: true,
    data: [6.4, 8.8, 16.8, 16.0],
  },
  {
    label: "Llama 3B · Math",
    color: "#d97706",
    dashed: false,
    data: [2.0, 1.2, 1.2, 2.0],
  },
  {
    label: "Qwen 7B · Math",
    color: "#d97706",
    dashed: true,
    data: [1.6, 2.0, 2.4, 1.2],
  },
]

const X_LABELS = ["Weak", "Medium", "Strong", "Auth"]
const Y_MIN = 0
const Y_MAX = 25
const W = 800
const H = 300
const PAD = { top: 24, right: 28, bottom: 44, left: 48 }
const IW = W - PAD.left - PAD.right
const IH = H - PAD.top - PAD.bottom

const xScale = (i: number) => PAD.left + (i / (X_LABELS.length - 1)) * IW
const yScale = (v: number) => PAD.top + (1 - (v - Y_MIN) / (Y_MAX - Y_MIN)) * IH

const yTicks = [0, 5, 10, 15, 20, 25]

const TOOLTIP_W = 190
const TOOLTIP_H = 30 + SERIES.length * 16

interface Props {
  caption?: string
}

export default function HintsChart({ caption }: Props) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  function handleMouseMove(e: React.MouseEvent<SVGRectElement>) {
    const svgEl = (e.currentTarget as SVGRectElement).ownerSVGElement!
    const rect = svgEl.getBoundingClientRect()
    const svgX = ((e.clientX - rect.left) / rect.width) * W
    let nearest = 0
    let minDist = Infinity
    X_LABELS.forEach((_, i) => {
      const d = Math.abs(svgX - xScale(i))
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
          aria-label="Steered-But-Hidden rate by hint strength for Llama and Qwen on GSM8K and ARC"
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
                opacity={v === 0 ? 0.5 : 0.25}
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
          {X_LABELS.map((label, i) => (
            <g key={`x-${label}`}>
              <line
                x1={xScale(i)}
                x2={xScale(i)}
                y1={PAD.top}
                y2={H - PAD.bottom}
                stroke="var(--border)"
                strokeDasharray="2 4"
                strokeWidth="1"
                opacity={0.2}
              />
              <text
                x={xScale(i)}
                y={H - PAD.bottom + 16}
                textAnchor="middle"
                className="font-mono"
                style={{ fontSize: 10, fill: "var(--muted)" }}
              >
                {label}
              </text>
            </g>
          ))}

          <text
            transform={`translate(14, ${PAD.top + IH / 2}) rotate(-90)`}
            textAnchor="middle"
            className="font-mono uppercase"
            style={{ fontSize: 9, fill: "var(--muted)", letterSpacing: "0.15em" }}
          >
            SBH (%)
          </text>

          {/* Series lines */}
          {SERIES.map((s) => {
            const d = s.data
              .map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i)} ${yScale(v)}`)
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
                    cx={xScale(i)}
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
            const hx = xScale(hoverIdx)
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
                  {X_LABELS[hoverIdx].toUpperCase()}
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
