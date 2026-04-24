interface Bar {
  label: string
  value: number
  highlight?: boolean
}

interface ChartPanel {
  title: string
  subtitle?: string
  bars: Bar[]
  valueFormat?: (v: number) => string
  max?: number
}

function BarChart({ title, subtitle, bars, valueFormat, max = 1 }: ChartPanel) {
  const format = valueFormat ?? ((v: number) => v.toFixed(3))
  return (
    <div className="rounded border border-border bg-card/40 p-4 sm:p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">{title}</p>
      {subtitle ? (
        <p className="mt-0.5 font-mono text-[10px] tracking-[0.1em] text-muted-foreground/60">
          {subtitle}
        </p>
      ) : null}
      <div className="mt-4 space-y-2">
        {bars.map((bar) => {
          const pct = Math.min(100, (bar.value / max) * 100)
          return (
            <div key={bar.label} className="grid grid-cols-[140px_1fr_52px] items-center gap-3">
              <span
                className={`truncate font-mono text-[10px] uppercase tracking-[0.12em] ${
                  bar.highlight ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {bar.label}
              </span>
              <div className="relative h-2 overflow-hidden rounded-[2px] bg-border/50">
                <div
                  className={`h-full rounded-[2px] ${
                    bar.highlight ? "bg-accent" : "bg-foreground/40"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span
                className={`text-right font-mono text-[11px] tabular-nums ${
                  bar.highlight ? "font-bold text-foreground" : "text-muted-foreground"
                }`}
              >
                {format(bar.value)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface Props {
  panels: ChartPanel[]
  caption?: string
}

export default function AblationChart({ panels, caption }: Props) {
  return (
    <figure className="my-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {panels.map((panel) => (
          <BarChart key={panel.title} {...panel} />
        ))}
      </div>
      {caption ? (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{caption}</p>
      ) : null}
    </figure>
  )
}
