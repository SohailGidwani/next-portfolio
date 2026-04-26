const CONDITIONS = ["Early", "Middle", "Late", "Early+Late", "All"] as const

interface Panel {
  title: string
  subtitle: string
  values: number[]
  max: number
}

const PANELS: Panel[] = [
  {
    title: "Llama 3B · Math",
    subtitle: "CFR increases with late-step corruption",
    values: [44.8, 45.6, 54.8, 54.4, 60.3],
    max: 70,
  },
  {
    title: "Qwen 7B · Math",
    subtitle: "Same pattern, lower baseline",
    values: [29.2, 29.2, 39.2, 42.4, 48.4],
    max: 70,
  },
  {
    title: "Llama 3B · Science",
    subtitle: "Moderate CFR regardless of position",
    values: [28.7, 28.3, 28.7, 32.5, 34.3],
    max: 70,
  },
  {
    title: "Qwen 7B · Science",
    subtitle: "Nearly immune to corruption",
    values: [9.3, 9.3, 9.3, 9.5, 10.8],
    max: 70,
  },
]

function PanelBlock({ title, subtitle, values, max }: Panel) {
  return (
    <div className="rounded border border-border bg-card/40 p-4 sm:p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">{title}</p>
      <p className="mt-0.5 font-mono text-[10px] tracking-[0.1em] text-muted-foreground/60">{subtitle}</p>
      <div className="mt-4 space-y-2">
        {CONDITIONS.map((cond, i) => {
          const val = values[i]
          const isLate = cond === "Late" || cond === "Early+Late"
          const isAll = cond === "All"
          const pct = (val / max) * 100
          return (
            <div key={cond} className="grid grid-cols-[64px_1fr_44px] items-center gap-2">
              <span
                className={`truncate font-mono text-[10px] uppercase tracking-[0.1em] ${
                  isAll ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {cond}
              </span>
              <div className="relative h-2 overflow-hidden rounded-[2px] bg-border/40">
                <div
                  className={`h-full rounded-[2px] ${
                    isAll ? "bg-accent" : isLate ? "bg-foreground/60" : "bg-foreground/30"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span
                className={`text-right font-mono text-[10px] tabular-nums ${
                  isAll ? "font-bold text-foreground" : "text-muted-foreground"
                }`}
              >
                {val}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface Props {
  caption?: string
}

export default function CorruptionChart({ caption }: Props) {
  return (
    <figure className="my-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {PANELS.map((p) => (
          <PanelBlock key={p.title} {...p} />
        ))}
      </div>
      {caption && (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{caption}</p>
      )}
    </figure>
  )
}
