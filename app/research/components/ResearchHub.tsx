"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  Home,
  FlaskConical,
  ArrowUpRight,
  GitBranch,
  CornerDownRight,
} from "lucide-react"
import ThemeToggle from "@/app/components/ThemeToggle"
import InteractiveCard from "@/app/components/ui/InteractiveCard"
import {
  getResearchRoots,
  getExtensions,
  STATUS_META,
  type ResearchEntry,
} from "@/app/data/research"

function StatusBadge({ status }: { status: ResearchEntry["status"] }) {
  const meta = STATUS_META[status]
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] ${meta.badge}`}
    >
      {meta.pulse ? (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
        </span>
      ) : null}
      {meta.label}
    </span>
  )
}

function ResearchCard({ entry }: { entry: ResearchEntry }) {
  const isExtension = entry.kind === "extension"

  const inner = (
    <InteractiveCard
      tilt={!isExtension}
      className={`group relative flex h-full flex-col rounded-lg border bg-card/80 p-5 shadow-card transition-colors sm:p-6 ${
        isExtension
          ? "border-dashed border-border hover:border-accent/40"
          : "border-border hover:border-accent/40"
      } ${entry.href ? "cursor-pointer" : "cursor-default"}`}
    >
      {/* Type + status */}
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          {isExtension ? (
            <>
              <GitBranch className="h-3 w-3" />
              Extension
            </>
          ) : (
            <>
              <FlaskConical className="h-3 w-3" />
              Paper
            </>
          )}
        </span>
        <StatusBadge status={entry.status} />
      </div>

      {/* Extends hint */}
      {isExtension ? (
        <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
          <CornerDownRight className="h-3 w-3" />
          Extends MEMOIR-VLM
        </p>
      ) : null}

      {/* Title */}
      <h3
        className={`mt-3 font-display tracking-tight text-foreground ${
          isExtension ? "text-lg" : "text-xl sm:text-2xl"
        }`}
      >
        {entry.shortTitle}
      </h3>
      <p className="mt-1 text-sm leading-snug text-muted-foreground/90">
        {entry.title}
      </p>

      {/* Summary */}
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        {entry.summary}
      </p>

      {/* Metrics */}
      {entry.metrics && entry.metrics.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          {entry.metrics.map((m) => (
            <div key={m.label} className="border-l-2 border-accent/40 pl-3">
              <p className="font-mono text-lg font-bold leading-none text-foreground">
                {m.value}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                {m.label}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {/* Tags */}
      <div className="mt-5 flex flex-wrap gap-2">
        {entry.tags.map((t) => (
          <span
            key={t}
            className="rounded-[3px] border border-border bg-background/60 px-2 py-0.5 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground/70">
          {entry.venue} · {entry.year}
        </span>
        {entry.href ? (
          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground transition group-hover:text-accent">
            Read
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        ) : (
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground/50">
            Detail coming soon
          </span>
        )}
      </div>
    </InteractiveCard>
  )

  if (entry.href) {
    return (
      <Link href={entry.href} className="block h-full">
        {inner}
      </Link>
    )
  }
  return <div className="h-full">{inner}</div>
}

function LineageRow({
  entry,
  isFirst,
  isLast,
  index,
  reduced,
}: {
  entry: ResearchEntry
  isFirst: boolean
  isLast: boolean
  index: number
  reduced: boolean
}) {
  const isExtension = entry.kind === "extension"

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative pb-6 pl-12 last:pb-0 sm:pl-16"
    >
      {/* Incoming spine segment (top → node) */}
      {!isFirst ? (
        <span className="absolute left-6 top-0 h-7 w-px -translate-x-1/2 bg-accent/30 sm:left-8" />
      ) : null}
      {/* Outgoing spine segment (node → bottom) */}
      {!isLast ? (
        <span className="absolute left-6 top-7 bottom-0 w-px -translate-x-1/2 bg-accent/30 sm:left-8" />
      ) : null}
      {/* Branch stub to extension card */}
      {isExtension ? (
        <span className="absolute left-6 top-7 w-6 border-t border-dashed border-accent/40 sm:left-8 sm:w-8" />
      ) : null}
      {/* Node */}
      {isExtension ? (
        <span className="absolute left-6 top-7 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent bg-background sm:left-8" />
      ) : (
        <span className="absolute left-6 top-7 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent)_18%,transparent)] sm:left-8" />
      )}

      <ResearchCard entry={entry} />
    </motion.div>
  )
}

function ResearchGroup({ root, idx }: { root: ResearchEntry; idx: number }) {
  const reduced = useReducedMotion() ?? false
  const extensions = getExtensions(root.id)
  const rows = [root, ...extensions]

  return (
    <section className="relative">
      {rows.map((entry, i) => (
        <LineageRow
          key={entry.id}
          entry={entry}
          isFirst={i === 0}
          isLast={i === rows.length - 1}
          index={idx + i}
          reduced={reduced}
        />
      ))}
    </section>
  )
}

export default function ResearchHub() {
  const reduced = useReducedMotion() ?? false
  const roots = getResearchRoots()

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Top nav ─── */}
      <div className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-2">
            <Link
              href="/#experience"
              className="inline-flex items-center gap-1.5 rounded border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Portfolio</span>
            </Link>
            <span className="inline-flex items-center gap-1.5 rounded border border-accent/30 bg-accent/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-accent">
              <FlaskConical className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Research</span>
            </span>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* ─── Header ─── */}
      <div className="border-b border-border bg-card/40 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px w-8 bg-accent" />
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
                Research
              </span>
            </div>
            <h1 className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Research &amp; ongoing work
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Submitted and ongoing research, shown as a living lineage:
              each paper branches into the extensions and follow-up work it makes
              possible. Follow a node to read the full write-up.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── Lineage ─── */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl space-y-16">
            {roots.map((root, i) => (
              <ResearchGroup key={root.id} root={root} idx={i} />
            ))}
          </div>

          {/* Legend */}
          <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-3 border-t border-border/60 pt-6">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground/60">
              Legend
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <span className="h-3 w-3 rounded-full bg-accent" />
              Paper
            </span>
            <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-accent bg-background" />
              Extension
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
