interface Row {
  metric: string
  sublabel?: string
  higher?: "mistral" | "gemma" | "medgemma"
  mistral: number
  gemma: number
  medgemma: number
  max?: number
  format?: (v: number) => string
}

const MODELS: { id: "mistral" | "gemma" | "medgemma"; label: string; tag: string }[] = [
  { id: "mistral", label: "Mistral 7B", tag: "7B dense" },
  { id: "gemma", label: "Gemma 4 26B", tag: "MoE" },
  { id: "medgemma", label: "MedGemma 4B", tag: "medical FT" },
]

interface Props {
  rows: Row[]
  caption?: string
}

export default function LLMComparison({ rows, caption }: Props) {
  return (
    <figure className="my-8">
      <div className="overflow-x-auto rounded border border-border bg-card/40 p-4 sm:p-6">
        <div className="min-w-[680px]">
          {/* Header */}
          <div className="grid grid-cols-[180px_1fr_1fr_1fr] gap-4 border-b border-border pb-3">
            <div />
            {MODELS.map((m) => (
              <div key={m.id} className="text-right">
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
                  {m.label}
                </p>
                <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">
                  {m.tag}
                </p>
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-border/50">
            {rows.map((row) => {
              const max = row.max ?? 1
              const format = row.format ?? ((v: number) => v.toFixed(3))
              return (
                <div
                  key={`${row.metric}-${row.sublabel ?? ""}`}
                  className="grid grid-cols-[180px_1fr_1fr_1fr] items-center gap-4 py-3"
                >
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-foreground">
                      {row.metric}
                    </p>
                    {row.sublabel ? (
                      <p className="mt-0.5 font-mono text-[9px] tracking-[0.1em] text-muted-foreground/70">
                        {row.sublabel}
                      </p>
                    ) : null}
                  </div>
                  {MODELS.map((m) => {
                    const value = row[m.id]
                    const highlight = row.higher === m.id
                    const pct = Math.min(100, (value / max) * 100)
                    return (
                      <div key={m.id} className="flex items-center gap-2">
                        <div className="relative h-1.5 flex-1 overflow-hidden rounded-[2px] bg-border/50">
                          <div
                            className={`h-full ${highlight ? "bg-accent" : "bg-foreground/40"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span
                          className={`min-w-[44px] text-right font-mono text-[11px] tabular-nums ${
                            highlight ? "font-bold text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {format(value)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {caption ? (
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{caption}</p>
      ) : null}
    </figure>
  )
}
