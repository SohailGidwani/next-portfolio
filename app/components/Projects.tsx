"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { ArrowUpRight, ExternalLink, Github } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import { useSkillHighlight } from "./SkillHighlightProvider"
import { projects } from "@/app/data/projects"

export default function Projects() {
  const { activeSkill } = useSkillHighlight()
  const normalizedSkill = activeSkill?.toLowerCase()

  const [primary, ...rest] = projects
  const primaryHighlighted = primary && normalizedSkill
    ? primary.tags.some((tag) => tag.toLowerCase() === normalizedSkill)
    : false

  return (
    <section id="projects" className="section-y">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-end justify-between gap-6"
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Projects</p>
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Things I&apos;ve built that I&apos;m proud of.
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded border border-border bg-card/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
            onClick={() => triggerHaptic()}
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {primary && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className={`group relative cursor-pointer rounded border bg-card/80 p-6 transition ${
                      primaryHighlighted ? "border-accent/40 bg-accent/5" : "border-border hover:border-accent/40"
                    }`}
                  >
                  <Link href={`/projects/${primary.id}`} className="absolute inset-0 z-0 rounded" aria-label={primary.title}>
                    <span className="sr-only">View {primary.title}</span>
                  </Link>
                  <div className="relative mb-6 h-56 w-full overflow-hidden rounded border border-border">
                    <Image
                      src={primary.image}
                      alt={primary.title}
                      fill
                      placeholder="blur"
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl text-foreground">{primary.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{primary.shortDescription}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {primary.demo && (
                        <a
                          href={primary.demo}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => triggerHaptic()}
                          className="relative z-10 inline-flex items-center gap-1.5 rounded border border-accent/30 bg-accent/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent transition hover:bg-accent/20"
                          aria-label={`Live demo of ${primary.title}`}
                        >
                          <ExternalLink className="h-3 w-3" />
                          Live
                        </a>
                      )}
                      <a
                        href={primary.github}
                        target="_blank"
                        rel="noreferrer"
                        onClick={() => triggerHaptic()}
                        className="relative z-10 inline-flex h-9 w-9 items-center justify-center rounded border border-border bg-background/70 text-foreground transition hover:border-accent/40"
                        aria-label={`Open ${primary.title} on GitHub`}
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{primary.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {primary.tags.map((tag) => {
                      const isHighlighted = normalizedSkill
                        ? tag.toLowerCase() === normalizedSkill
                        : false
                      return (
                        <Badge
                          key={tag}
                          variant="outline"
                          className={`border-border/70 bg-background/60 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                            isHighlighted ? "border-accent/40 bg-accent/10 text-accent" : "text-muted-foreground"
                          }`}
                        >
                          {tag}
                        </Badge>
                      )
                    })}
                  </div>
                  </motion.div>
              )}

          <div className="grid gap-4">
            {rest.map((project, index) => {
                  const isHighlighted = normalizedSkill
                    ? project.tags.some((tag) => tag.toLowerCase() === normalizedSkill)
                    : false
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      viewport={{ once: true }}
                      className={`group relative cursor-pointer rounded border bg-card/80 p-5 transition ${
                        isHighlighted ? "border-accent/40 bg-accent/5" : "border-border hover:border-accent/40"
                      }`}
                    >
                      <Link href={`/projects/${project.id}`} className="absolute inset-0 z-0 rounded" aria-label={project.title}>
                        <span className="sr-only">View {project.title}</span>
                      </Link>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-display text-xl text-foreground">{project.title}</h4>
                          <p className="mt-2 text-sm text-muted-foreground">{project.shortDescription}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {project.demo && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => triggerHaptic()}
                              className="relative z-10 inline-flex items-center gap-1 rounded border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-accent transition hover:bg-accent/20"
                              aria-label={`Live demo of ${project.title}`}
                            >
                              <ExternalLink className="h-3 w-3" />
                              Live
                            </a>
                          )}
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => triggerHaptic()}
                            className="relative z-10 inline-flex h-8 w-8 items-center justify-center rounded border border-border bg-background/70 text-foreground transition hover:border-accent/40"
                            aria-label={`Open ${project.title} on GitHub`}
                          >
                            <Github className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.map((tag) => {
                          const tagHighlighted = normalizedSkill
                            ? tag.toLowerCase() === normalizedSkill
                            : false
                          return (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={`border-border/70 bg-background/60 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                                tagHighlighted ? "border-accent/40 bg-accent/10 text-accent" : "text-muted-foreground"
                              }`}
                            >
                              {tag}
                            </Badge>
                          )
                        })}
                      </div>
                    </motion.div>
                  )
                })}
          </div>
        </div>
      </div>
    </section>
  )
}
