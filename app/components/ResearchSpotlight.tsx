import Link from "next/link"
import { ArrowUpRight, FlaskConical } from "lucide-react"
import { getResearchRoots, STATUS_META } from "@/app/data/research"
import SectionHeading from "./SectionHeading"

export default function ResearchSpotlight() {
  const entry = getResearchRoots()[0]
  if (!entry) return null

  const status = STATUS_META[entry.status]

  return (
    <section id="research-spotlight" className="section-y">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Research">
            Work built to survive scrutiny, not just a demo.
          </SectionHeading>
          <Link
            href="/research"
            className="inline-flex items-center gap-2 rounded border border-border bg-card/80 px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
          >
            Research hub
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>

        <Link
          href={entry.href ?? "/research"}
          className="group mt-10 block rounded border border-foreground/10 bg-card2 p-6 shadow-card transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-card-hover sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              <FlaskConical className="h-4 w-4" aria-hidden />
              Current study
            </div>
            <span className={`rounded-full border px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] ${status.badge}`}>
              {status.label}
            </span>
          </div>

          <h3 className="mt-5 font-display text-2xl text-foreground sm:text-3xl">
            {entry.shortTitle}
          </h3>
          <p className="mt-2 max-w-3xl text-base leading-relaxed text-muted-foreground">
            {entry.title}
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {entry.summary}
          </p>

          {entry.metrics ? (
            <div className="mt-6 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
              {entry.metrics.map((metric) => (
                <div key={metric.label} className="border-l-2 border-accent/40 pl-3">
                  <p className="font-mono text-xl font-bold text-foreground">{metric.value}</p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Read the research
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </Link>
      </div>
    </section>
  )
}
