"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight, Layers } from "lucide-react"
import { projects } from "@/app/data/projects"
import { triggerHaptic } from "./ui/haptics"

const featured = projects.filter((p) => p.featured).slice(0, 3)

export default function HeroSpotlight() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card/70 shadow-xl shadow-black/10 backdrop-blur-sm dark:bg-card/50 dark:shadow-black/40">
      <div
        className="pointer-events-none absolute inset-0 opacity-80 dark:opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 10% 20%, hsl(var(--accent) / 0.14), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, hsl(var(--primary) / 0.08), transparent 50%)",
        }}
      />
      <div className="relative p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Selected work
            </p>
            <p className="mt-1 font-display text-lg text-foreground">Shipped systems</p>
          </div>
          <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background/60 text-accent">
            <Layers className="h-4 w-4" aria-hidden />
          </span>
        </div>

        <ul className="space-y-3">
          {featured.map((project, index) => (
            <motion.li
              key={project.id}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
            >
              <Link
                href={`/projects/${project.id}`}
                onClick={() => triggerHaptic()}
                className="group flex items-center gap-3 rounded-xl border border-border/80 bg-background/50 p-2.5 transition-colors hover:border-accent/40 hover:bg-background/80 dark:bg-background/30 dark:hover:bg-background/45"
              >
                <div className="relative h-14 w-[4.5rem] shrink-0 overflow-hidden rounded-lg border border-border/60">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(min-width: 1140px) 120px, 100vw"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-sm font-medium text-foreground sm:text-base">
                    {project.title}
                  </p>
                  <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground sm:line-clamp-1">
                    {project.shortDescription}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded border border-border/80 bg-secondary/60 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
              </Link>
            </motion.li>
          ))}
        </ul>

        <Link
          href="/projects"
          onClick={() => triggerHaptic()}
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground transition hover:text-accent"
        >
          View all projects
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
