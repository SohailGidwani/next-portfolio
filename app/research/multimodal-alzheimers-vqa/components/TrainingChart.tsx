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

  return (
    <figure className="my-8">
      <div className="rounded border border-border bg-card/40 p-4 sm:p-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-auto w-full"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Training history line chart across 30 epochs for DX3, Amyloid, CN Amyloid, and Sex metrics"
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

          {/* Lines */}
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
                    r="2"
                    fill={s.color}
                  />
                ))}
              </g>
            )
          })}
        </svg>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {series.map((s) => (
            <div key={s.name} className="flex items-center gap-2">
              <span
                className="inline-block h-0.5 w-5"
                style={{
                  background: s.color,
                  ...(s.dashed ? { borderTop: `1px dashed ${s.color}`, background: "transparent" } : {}),
                }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
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
