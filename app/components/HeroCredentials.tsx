"use client"

import { motion } from "framer-motion"

const ROWS = [
  {
    period: "2025 — present",
    org: "Keck School of Medicine, USC",
    line: "Research Assistant · multi-modal AD prediction",
  },
  {
    period: "2023 — 2025",
    org: "IIFL Finance Ltd",
    line: "Software Developer · RAG, fraud detection, internal AI",
  },
  {
    period: "2025 — 2027 (exp.)",
    org: "USC Viterbi School of Engineering",
    line: "MS Computer Science",
  },
] as const

export default function HeroCredentials() {
  return (
    <aside
      className="relative rounded-xl border border-border bg-card/40 p-5 backdrop-blur-sm dark:bg-card/25 sm:p-6"
      aria-label="Recent roles and education"
    >
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
        Where I&apos;ve been
      </p>
      <ul className="space-y-5">
        {ROWS.map((row, i) => (
          <motion.li
            key={row.org}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.07 }}
            className="border-l-2 border-accent/35 pl-4"
          >
            <p className="font-mono text-[11px] text-muted-foreground">{row.period}</p>
            <p className="mt-1 font-display text-base text-foreground">{row.org}</p>
            <p className="mt-0.5 text-sm leading-snug text-muted-foreground">{row.line}</p>
          </motion.li>
        ))}
      </ul>
    </aside>
  )
}
