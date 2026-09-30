"use client"

import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import {
  Brain,
  FlaskConical,
  ArrowUpRight,
  GitBranch,
  CornerDownRight,
} from "lucide-react"
import InteractiveCard from "@/app/components/ui/InteractiveCard"
import PageNav from "@/app/components/PageNav"
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
      className={`inline-flex shrink-0 items-center rounded-[3px] border px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.18em] ${meta.badge}`}
    >
      {meta.label}
    </span>
  )
}

function ResearchCard({ entry }: { entry: ResearchEntry }) {
  const isExtension = entry.kind === "extension"

  const inner = (
    <InteractiveCard
      className={`group relative flex h-full flex-col rounded border bg-card/80 p-5 shadow-card transition-colors sm:p-6 ${
        isExtension
          ? "border-dashed border-border hover:border-accent/40"
          : "border-border hover:border-accent/40"
      } ${entry.href ? "cursor-pointer" : "cursor-default"}`}
    >
      {/* Type + status */}
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-[0.22em] text-accent">
          {isExtension ? (
            <>
              <GitBranch className="h-3 w-3" />
              Extension
            </>
          ) : entry.kind === "study" ? (
            <>
              <Brain className="h-3 w-3" />
              Study
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
        <p className="mt-3 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
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
      <p className="mt-1 text-sm leading-snug text-muted-foreground">
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
              <p className="font-mono text-lg font-medium leading-none text-foreground">
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
        <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
          {entry.venue} · {entry.year}
        </span>
        {/* No placeholder when there is no write-up: the status badge
            already says the work is in progress. */}
        {entry.href ? (
          <span className="link-action shrink-0 group-hover:underline">
            Read
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        ) : null}
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

  // The spine and nodes only mean something when a paper has extensions to
  // connect. A lone entry gets the card alone, flush with the page header,
  // instead of an indent and a dot that point at nothing.
  if (extensions.length === 0) {
    return (
      <motion.section
        initial={reduced ? false : { opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
      >
        <ResearchCard entry={root} />
      </motion.section>
    )
  }

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
      <PageNav
        items={[
          { label: "Portfolio", icon: "home", href: "/#experience" },
          { label: "Research", icon: "research" },
        ]}
      />

      {/* ─── Header ─── */}
      <div className="border-b border-border bg-card/40 py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <h1 className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Research &amp; ongoing work
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Accepted papers and studies still in progress, from my research
              at Keck School of Medicine of USC. Each paper links to its full
              write-up.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ─── Lineage ─── */}
      <div className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl space-y-8">
            {roots.map((root, i) => (
              <ResearchGroup key={root.id} root={root} idx={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
