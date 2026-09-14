// Paired-difference intervals (a forest plot folded into a table). The point
// of this figure is which intervals clear zero, so the zero line is the one
// fixed reference and every row shares one scale. Significance is carried by
// position and by the printed interval, never by the accent alone.

interface PairedRow {
  id: string
  /** Baseline configuration and its balanced accuracy. */
  a: { name: string; value: number }
  /** Comparison configuration; positive differences favor it. */
  b: { name: string; value: number }
  diff: number
  lo: number
  hi: number
  p: string
}

interface Props {
  title: string
  subtitle?: string
  rows: PairedRow[]
  domain: [number, number]
  caption?: string
}

const signed = (v: number) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(3)}`
const tick = (v: number) => `${v < 0 ? "−" : "+"}${Math.abs(v).toFixed(2)}`

export default function PairedDifferences({ title, subtitle, rows, domain, caption }: Props) {
  const [min, max] = domain
  const pct = (v: number) => ((Math.min(max, Math.max(min, v)) - min) / (max - min)) * 100
  const zero = pct(0)

  const glyph = (r: PairedRow) => {
    const clears = r.lo > 0 || r.hi < 0
    return (
      <div className="relative h-4" aria-hidden>
        {/* The one reference this figure exists for, so it outranks the grid. */}
        <span className="absolute inset-y-0 w-px bg-muted-foreground/50" style={{ left: `${zero}%` }} />
        <span
          className={`absolute top-1/2 h-0.5 -translate-y-1/2 rounded-full ${
            clears ? "bg-accent" : "bg-foreground/35"
          }`}
          style={{ left: `${pct(r.lo)}%`, width: `${pct(r.hi) - pct(r.lo)}%` }}
        />
        <span
          className={`absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full ${
            clears ? "bg-accent" : "bg-foreground/60"
          }`}
          style={{ left: `${pct(r.diff)}%` }}
        />
      </div>
    )
  }

  const interval = (r: PairedRow) => {
    const clears = r.lo > 0 || r.hi < 0
    return (
      <p className="font-mono text-[11px] tabular-nums leading-snug">
        <span className={clears ? "font-bold text-foreground" : "text-muted-foreground"}>
          {signed(r.diff)}
        </span>
        {/* Own line: inline, the bracket broke across two at this width. */}
        <span className="block whitespace-nowrap text-muted-foreground/80">
          [{signed(r.lo)}, {signed(r.hi)}]
        </span>
      </p>
    )
  }

  const comparison = (r: PairedRow) => (
    <>
      <p className="text-sm leading-snug text-foreground">
        <span className="mr-2 font-mono text-[11px] text-accent">{r.id}</span>
        {r.a.name} → {r.b.name}
      </p>
      <p className="mt-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
        {r.a.value.toFixed(3)} → {r.b.value.toFixed(3)}
      </p>
    </>
  )

  return (
    <figure className="my-8">
      <div className="rounded border border-border bg-card/40 p-4 sm:p-5">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">{title}</p>
        {subtitle ? (
          <p className="mt-0.5 font-mono text-xs tracking-[0.1em] text-muted-foreground/60">
            {subtitle}
          </p>
        ) : null}

        {/* ─── Mobile: one stacked card per comparison ─── */}
        <div className="mt-4 divide-y divide-border/50 sm:hidden">
          {rows.map((r) => (
            <div key={`m-${r.id}`} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">{comparison(r)}</div>
                <p className="shrink-0 font-mono text-[11px] tabular-nums text-muted-foreground">
                  p {r.p}
                </p>
              </div>
              <div className="mt-2">{glyph(r)}</div>
              <div className="mt-1">{interval(r)}</div>
            </div>
          ))}
        </div>

        {/* ─── Desktop: table with a shared-scale interval column ─── */}
        <div className="mt-4 hidden sm:block">
          <div className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_7.5rem_3rem] items-end gap-4 border-b border-border/70 pb-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            <span>Comparison</span>
            <span className="relative block h-4" aria-hidden>
              <span className="absolute left-0">{tick(min)}</span>
              <span className="absolute -translate-x-1/2" style={{ left: `${zero}%` }}>
                0
              </span>
              <span className="absolute right-0">{tick(max)}</span>
            </span>
            <span>Δ [95% CI]</span>
            <span className="text-right">p</span>
          </div>
          <div className="divide-y divide-border/50">
            {rows.map((r) => (
              <div
                key={`d-${r.id}`}
                className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_7.5rem_3rem] items-center gap-4 py-3"
              >
                <div className="min-w-0">{comparison(r)}</div>
                {glyph(r)}
                {interval(r)}
                <p className="text-right font-mono text-[11px] tabular-nums text-muted-foreground">
                  {r.p}
                </p>
              </div>
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
