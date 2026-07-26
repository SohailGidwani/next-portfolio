"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { ArrowUpRight, ExternalLink, Github } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import SectionHeading from "./SectionHeading"
import CardDeck from "./CardDeck"
import { useSkillHighlight } from "./SkillHighlightProvider"
import InteractiveCard from "./ui/InteractiveCard"
import { projects } from "@/app/data/projects"

export default function Projects() {
  const { activeSkill } = useSkillHighlight()
  const normalizedSkill = activeSkill?.toLowerCase()

  // Home shows the featured subset (1 primary + 2×2 grid); /projects has everything.
  const [primary, ...rest] = projects.filter((p) => p.featured)
  const primaryHighlighted = primary && normalizedSkill
    ? primary.tags.some((tag) => tag.toLowerCase() === normalizedSkill)
    : false

  return (
    <section id="projects" className="section-y">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Projects">
            Things I&apos;ve built that I&apos;m proud of.
          </SectionHeading>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded border border-border bg-card/80 px-4 py-2 font-mono text-xs uppercase tracking-[0.22em] text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
            onClick={() => triggerHaptic()}
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-10">
          <CardDeck label="Projects" className="sm:grid sm:grid-cols-2 sm:gap-6">
              {primary && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className="sm:col-span-2"
                  >
                  <InteractiveCard
                    tilt
                    maxTilt={1.5}
                    className={`group h-full cursor-pointer rounded border p-6 shadow-card transition-[border-color,box-shadow] duration-300 hover:shadow-card-hover ${
                      primaryHighlighted
                        ? "border-accent/40 bg-accent/5"
                        : "border-foreground/10 bg-card2 hover:border-accent/40"
                    }`}
                  >
                  <Link href={`/projects/${primary.id}`} className="absolute inset-0 z-0 rounded" aria-label={primary.title}>
                    <span className="sr-only">View {primary.title}</span>
                  </Link>
                  <div className="relative mb-5 h-40 w-full overflow-hidden rounded border border-border sm:mb-6 sm:h-64">
                    <Image
                      src={primary.image}
                      alt={primary.title}
                      fill
                      placeholder="blur"
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 100vw, (max-width: 1080px) 90vw, 1080px"
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
                          className="relative z-10 inline-flex items-center gap-1.5 rounded border border-accent/30 bg-accent/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.2em] text-accent transition hover:bg-accent/20"
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
                  <p className="mt-4 font-mono text-[11px] leading-relaxed text-accent">
                    {primary.outcome}
                  </p>
                  {/* The short description and outcome already carry the card on
                      a phone; the long form would stretch every sibling in the
                      deck to match it. */}
                  <p className="mt-4 hidden text-sm text-muted-foreground sm:block">
                    {primary.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {primary.tags.map((tag) => {
                      const isHighlighted = normalizedSkill
                        ? tag.toLowerCase() === normalizedSkill
                        : false
                      return (
                        <Badge
                          key={tag}
                          variant="outline"
                          className={`border-border/70 bg-background/60 text-xs font-semibold uppercase tracking-[0.2em] ${
                            isHighlighted ? "border-accent/40 bg-accent/10 text-accent" : "text-muted-foreground"
                          }`}
                        >
                          {tag}
                        </Badge>
                      )
                    })}
                  </div>
                  </InteractiveCard>
                  </motion.div>
              )}

            {rest.map((project, index) => {
                  const isHighlighted = normalizedSkill
                    ? project.tags.some((tag) => tag.toLowerCase() === normalizedSkill)
                    : false
                  return (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      viewport={{ once: true }}
                    >
                    <InteractiveCard
                      tilt
                      className={`group h-full cursor-pointer rounded border p-5 shadow-card transition-[border-color,box-shadow] duration-300 hover:shadow-card-hover ${
                        isHighlighted
                          ? "border-accent/40 bg-accent/5"
                          : "border-foreground/10 bg-card2 hover:border-accent/40"
                      }`}
                    >
                      <Link href={`/projects/${project.id}`} className="absolute inset-0 z-0 rounded" aria-label={project.title}>
                        <span className="sr-only">View {project.title}</span>
                      </Link>
                      {/* Cover art on phones only: a deck card is tall enough
                          that text alone leaves it looking empty, while the
                          desktop grid stays text-led as designed. */}
                      <div className="relative mb-5 h-40 w-full overflow-hidden rounded border border-border sm:hidden">
                        <Image
                          src={project.image}
                          alt=""
                          fill
                          placeholder="blur"
                          className="object-cover object-top"
                          sizes="80vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
                      </div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-display text-xl text-foreground">{project.title}</h4>
                          <p className="mt-2 text-sm text-muted-foreground">{project.shortDescription}</p>
                          <p className="mt-3 font-mono text-[11px] leading-relaxed text-accent">
                            {project.outcome}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {project.demo && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noreferrer"
                              onClick={() => triggerHaptic()}
                              className="relative z-10 inline-flex items-center gap-1 rounded border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-xs uppercase tracking-[0.2em] text-accent transition hover:bg-accent/20"
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
                            className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded border border-border bg-background/70 text-foreground transition hover:border-accent/40 sm:h-8 sm:w-8"
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
                              className={`border-border/70 bg-background/60 text-xs font-semibold uppercase tracking-[0.2em] ${
                                tagHighlighted ? "border-accent/40 bg-accent/10 text-accent" : "text-muted-foreground"
                              }`}
                            >
                              {tag}
                            </Badge>
                          )
                        })}
                      </div>
                    </InteractiveCard>
                    </motion.div>
                  )
                })}
          </CardDeck>
        </div>
      </div>
    </section>
  )
}
