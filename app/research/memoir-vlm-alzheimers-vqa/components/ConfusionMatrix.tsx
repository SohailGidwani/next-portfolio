import { Fragment } from "react"

interface ConfusionCell {
  count: number
  percent: number
}

interface Props {
  title?: string
  labels: string[]
  matrix: ConfusionCell[][]
  rowTotals?: number[]
  caption?: string
}

export default function ConfusionMatrix({ title, labels, matrix, rowTotals, caption }: Props) {
  const maxCount = Math.max(...matrix.flat().map((c) => c.count))

  return (
    <figure className="my-8">
      {title ? (
        <figcaption className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {title}
        </figcaption>
      ) : null}

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div
            className="grid gap-1 text-center"
            style={{
              gridTemplateColumns: `auto repeat(${labels.length}, minmax(80px, 1fr)) ${rowTotals ? "auto" : ""}`,
            }}
          >
            <div />
            {labels.map((label, i) => (
              <div
                key={`col-${i}`}
                className="pb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground"
              >
                {label}
              </div>
            ))}
            {rowTotals ? <div /> : null}

            {matrix.map((row, i) => (
              <Fragment key={`row-${i}`}>
                <div className="flex items-center pr-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {labels[i]}
                </div>
                {row.map((cell, j) => {
                  const isDiag = i === j
                  const intensity = Math.min(cell.count / maxCount, 1)
                  const bgColor = isDiag
                    ? `color-mix(in oklch, var(--accent) ${Math.round(intensity * 70)}%, transparent)`
                    : `color-mix(in oklch, var(--fg) ${Math.round(intensity * 20)}%, transparent)`
                  return (
                    <div
                      key={`${i}-${j}`}
                      className={`flex flex-col items-center justify-center rounded border border-border/70 py-4 ${
                        isDiag ? "border-accent/40" : ""
                      }`}
                      style={{ background: bgColor }}
                    >
                      <span
                        className={`font-display text-lg font-bold ${
                          isDiag ? "text-foreground" : "text-foreground/80"
                        }`}
                      >
                        {cell.count}
                      </span>
                      <span className="mt-0.5 font-mono text-[9px] tracking-[0.1em] text-muted-foreground">
                        {cell.percent.toFixed(0)}%
                      </span>
                    </div>
                  )
                })}
                {rowTotals ? (
                  <div className="flex items-center justify-center pl-3 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
                    {rowTotals[i]}
                  </div>
                ) : null}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {caption ? (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{caption}</p>
      ) : null}
    </figure>
  )
}
