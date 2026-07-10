"use client"

import { useState } from "react"

interface Series {
  name: string
  data: number[]
  color: string
  dashed?: boolean
}

interface Props {
  series: Series[]
  yMin?: number
  yMax?: number
  xMax: number
  bestEpoch?: number
  caption?: string
}

export default function TrainingChart({
  series,
  yMin = 0.3,
  yMax = 0.85,
  xMax,
  bestEpoch,
  caption,
}: Props) {
  const W = 800
  const H = 360
  const PAD = { top: 24, right: 28, bottom: 40, left: 44 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const xScale = (epoch: number) =>
    PAD.left + ((epoch - 1) / (xMax - 1)) * innerW
  const yScale = (v: number) =>
    PAD.top + (1 - (v - yMin) / (yMax - yMin)) * innerH

  const yTicks = 6
  const yValues = Array.from({ length: yTicks }, (_, i) =>
    yMin + ((yMax - yMin) * i) / (yTicks - 1),
  )
  const xTicks = [1, 5, 10, 15, 20, 25, 30]

  const dataLen = series[0]?.data.length ?? 0

  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  function handleMouseMove(e: React.MouseEvent<SVGRectElement>) {
    const svgEl = (e.currentTarget as SVGRectElement).ownerSVGElement!
    const rect = svgEl.getBoundingClientRect()
    const svgX = ((e.clientX - rect.left) / rect.width) * W
    let nearest = 0
    let minDist = Infinity
    for (let i = 0; i < dataLen; i++) {
      const d = Math.abs(svgX - xScale(i + 1))
      if (d < minDist) { minDist = d; nearest = i }
    }
    setHoverIdx(nearest)
  }

  const TOOLTIP_W = 160
  const TOOLTIP_H = 30 + series.length * 16

  return (
    <figure className="my-8">
      <div className="rounded border border-border bg-card/40 p-4 sm:p-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Training history line chart across epochs"
        >
          {/* Grid lines */}
          {yValues.map((v, i) => (
            <g key={`y-${i}`}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={yScale(v)}
                y2={yScale(v)}
                style={{ stroke: "var(--border)" }}
                strokeDasharray="2 4"
                strokeWidth="1"
                opacity={i === 0 || i === yValues.length - 1 ? 0.6 : 0.3}
              />
              <text
                x={PAD.left - 10}
                y={yScale(v)}
                textAnchor="end"
                dominantBaseline="middle"
                className="font-mono"
                style={{ fontSize: 10, fill: "var(--muted)" }}
              >
                {v.toFixed(2)}
              </text>
            </g>
          ))}

          {xTicks.map((e) => (
            <g key={`x-${e}`}>
              <line
                x1={xScale(e)}
                x2={xScale(e)}
                y1={PAD.top}
                y2={H - PAD.bottom}
                style={{ stroke: "var(--border)" }}
                strokeDasharray="2 4"
                strokeWidth="1"
                opacity={0.2}
              />
              <text
                x={xScale(e)}
                y={H - PAD.bottom + 16}
                textAnchor="middle"
                className="font-mono"
                style={{ fontSize: 10, fill: "var(--muted)" }}
              >
                {e}
              </text>
            </g>
          ))}

          <text
            x={W / 2}
            y={H - 6}
            textAnchor="middle"
            className="font-mono uppercase"
            style={{ fontSize: 9, fill: "var(--muted)", letterSpacing: "0.15em" }}
          >
            Epoch
          </text>

          {/* Best epoch marker */}
          {bestEpoch ? (
            <g>
              <line
                x1={xScale(bestEpoch)}
                x2={xScale(bestEpoch)}
                y1={PAD.top}
                y2={H - PAD.bottom}
                style={{ stroke: "var(--accent)" }}
                strokeDasharray="4 4"
                strokeWidth="1.5"
                opacity={0.6}
              />
              <text
                x={xScale(bestEpoch) + 6}
                y={PAD.top + 12}
                className="font-mono uppercase"
                style={{ fontSize: 9, fill: "var(--accent)", letterSpacing: "0.15em" }}
              >
                Best (Ep.{bestEpoch})
              </text>
            </g>
          ) : null}

          {/* Series lines */}
          {series.map((s) => {
            const path = s.data
              .map((v, i) => `${i === 0 ? "M" : "L"} ${xScale(i + 1)} ${yScale(v)}`)
              .join(" ")
            return (
              <g key={s.name}>
                <path
                  d={path}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2"
                  strokeDasharray={s.dashed ? "5 4" : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {s.data.map((v, i) => (
                  <circle
                    key={i}
                    cx={xScale(i + 1)}
                    cy={yScale(v)}
                    r={hoverIdx === i ? 4 : 2}
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
                  EPOCH {hoverIdx + 1}
                </text>
                {series.map((s, i) => (
                  <g key={s.name}>
                    <circle cx={tx + 14} cy={ty + 26 + i * 16} r={3} fill={s.color} />
                    <text
                      x={tx + 24}
                      y={ty + 30 + i * 16}
                      className="font-mono"
                      style={{ fontSize: 9, fill: "var(--fg)" }}
                    >
                      {s.name}: {s.data[hoverIdx]?.toFixed(3) ?? "--"}
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
            width={innerW}
            height={innerH}
            fill="transparent"
            style={{ cursor: "crosshair" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverIdx(null)}
          />
        </svg>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {series.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span
                className="inline-block h-0.5 w-5"
                style={{
                  background: s.color,
                  ...(s.dashed
                    ? { borderTop: `1px dashed ${s.color}`, background: "transparent" }
                    : {}),
                }}
              />
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {caption ? (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{caption}</p>
      ) : null}
    </figure>
  )
}
