"use client"

import { motion } from "framer-motion"
import { GraduationCap, MapPin, Microscope } from "lucide-react"

export default function HeroAside() {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative hidden min-w-0 lg:block"
      aria-label="Quick facts"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/50 p-7 shadow-lg shadow-black/5 backdrop-blur-sm dark:bg-card/40 dark:shadow-black/30">
        <div
          className="pointer-events-none absolute -right-8 -top-12 h-48 w-48 rounded-full bg-accent/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10"
          aria-hidden
        />

        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          At a glance
        </p>

        <ul className="relative mt-6 space-y-5">
          <li className="flex gap-3.5">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-accent">
              <GraduationCap className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="font-medium text-foreground">USC Viterbi</p>
              <p className="mt-0.5 text-sm leading-snug text-muted-foreground">
                MS in Computer Science — class of 2027
              </p>
            </div>
          </li>
          <li className="flex gap-3.5">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-accent">
              <Microscope className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="font-medium text-foreground">Keck School of Medicine</p>
              <p className="mt-0.5 text-sm leading-snug text-muted-foreground">
                Graduate research assistant
              </p>
            </div>
          </li>
          <li className="flex gap-3.5">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-accent">
              <MapPin className="h-4 w-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="font-medium text-foreground">Based in Los Angeles</p>
              <p className="mt-0.5 text-sm leading-snug text-muted-foreground">
                Open to remote and on-site roles
              </p>
            </div>
          </li>
        </ul>

        <p className="relative mt-6 border-t border-border pt-5 text-xs leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">Languages</span>
          <span className="mx-2 text-border">·</span>
          English, Hindi, Sindhi
        </p>
      </div>
    </motion.aside>
  )
}
