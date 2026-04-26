interface ModelRow {
  model: string
  noCot: number
  cot: number
}

interface Panel {
  title: string
  subtitle: string
  rows: ModelRow[]
}

function PanelBlock({ title, subtitle, rows }: Panel) {
  return (
    <div className="rounded border border-border bg-card/40 p-4 sm:p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">{title}</p>
      <p className="mt-0.5 font-mono text-[10px] tracking-[0.1em] text-muted-foreground/60">{subtitle}</p>
      <div className="mt-5 space-y-5">
        {rows.map((row) => {
          const delta = +(row.cot - row.noCot).toFixed(1)
          const improved = delta > 0
          return (
            <div key={row.model}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground">
                  {row.model}
                </span>
                <span
                  className={`font-mono text-[10px] font-bold tabular-nums ${
                    improved ? "text-accent" : "text-muted-foreground"
                  }`}
                >
                  {improved ? "+" : ""}
                  {delta}pp
                </span>
              </div>
              <div className="space-y-1.5">
                <div className="grid grid-cols-[52px_1fr_44px] items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
                    No CoT
                  </span>
                  <div className="relative h-1.5 overflow-hidden rounded-[2px] bg-border/40">
                    <div
                      className="h-full rounded-[2px] bg-foreground/25"
                      style={{ width: `${row.noCot}%` }}
                    />
                  </div>
                  <span className="text-right font-mono text-[10px] tabular-nums text-muted-foreground">
                    {row.noCot}%
                  </span>
                </div>
                <div className="grid grid-cols-[52px_1fr_44px] items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.1em] text-muted-foreground/60">
                    CoT
                  </span>
                  <div className="relative h-1.5 overflow-hidden rounded-[2px] bg-border/40">
                    <div
                      className={`h-full rounded-[2px] ${improved ? "bg-accent" : "bg-foreground/50"}`}
                      style={{ width: `${row.cot}%` }}
                    />
                  </div>
                  <span
                    className={`text-right font-mono text-[10px] font-bold tabular-nums ${
                      improved ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {row.cot}%
                  </span>
                </div>
              </div>
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

export default function BaselineChart({ caption }: Props) {
  const panels: Panel[] = [
    {
      title: "Math · GSM8K",
      subtitle: "CoT dramatically improves accuracy",
      rows: [
        { model: "Llama 3.2 3B", noCot: 5.2, cot: 48.8 },
        { model: "Qwen 2.5 7B", noCot: 16.0, cot: 65.6 },
      ],
    },
    {
      title: "Science MC · ARC",
      subtitle: "CoT actually hurts performance",
      rows: [
        { model: "Llama 3.2 3B", noCot: 71.6, cot: 60.0 },
        { model: "Qwen 2.5 7B", noCot: 90.0, cot: 85.2 },
      ],
    },
  ]

  return (
    <figure className="my-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {panels.map((p) => (
          <PanelBlock key={p.title} {...p} />
        ))}
      </div>
      {caption && (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{caption}</p>
      )}
    </figure>
  )
}
