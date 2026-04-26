"use client"

import { Suspense } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { Github, FolderKanban, Brain, Database, Globe, Zap } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import techupdates from '@/public/images/Tech Updates.png'
import ProjectSkeleton from "@/app/components/ProjectSkeleton"
import ProjectNav from "@/app/components/ProjectNav"
import ProjectDetailStructuredData from "@/app/components/ProjectDetailStructuredData"

function SectionLabel({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">{n}</span>
        <div className="h-px w-5 bg-border" />
      </div>
      <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground sm:text-2xl">
        {label}
      </h2>
    </div>
  )
}

export default function TechUpdatesPage() {
  const project = {
    title: "Tech-updates (Personal Tech News Aggregator)",
    description: "I wanted my own tech news feed, so I built one. It scrapes articles from Medium, YC, and Crunchbase, then uses Azure OpenAI to sort everything into categories.",
    longDescription: `I got tired of checking five different sites every morning for tech news, so I built a thing that does it for me. Tech-updates scrapes articles from Medium, Y Combinator's Hacker News, and Crunchbase on a schedule, then pipes them through Azure OpenAI to auto-categorize everything (AI/ML, startups, web dev, etc.).

The backend is Flask + PostgreSQL for the core API and data storage. The cool part is the Qdrant vector database: every article gets embedded and stored as a vector, so I can do similarity search. If you're reading about LLMs, it'll surface related articles you might've missed. It's not just keyword matching, it actually understands the content.

The frontend is React + Vite. Nothing groundbreaking there, but it's fast and the UI updates as new articles come in. I built this mostly because I wanted to work with vector databases and see how well GPT-based models handle content categorization at scale. Turns out, pretty well.`,
    image: techupdates,
    tags: ["React", "Vite", "Python", "Flask", "Azure OpenAI", "Qdrant(vectorDB)", "PostgreSQL", "Web Scraping", "AI"],
    github: "https://github.com/SohailGidwani/Project-TechUpdates",
    features: [
      {
        icon: <Brain className="w-5 h-5" />,
        title: "AI Categorization",
        description: "Articles go through Azure OpenAI, which tags them by topic so I don't have to read everything myself"
      },
      {
        icon: <Database className="w-5 h-5" />,
        title: "Vector Database",
        description: "Every article gets embedded in Qdrant, so 'find me more like this' actually works"
      },
      {
        icon: <Globe className="w-5 h-5" />,
        title: "Multi-Source Scraping",
        description: "Scrapers run on a schedule, pulling articles from Medium, YC, and Crunchbase automatically"
      },
      {
        icon: <Zap className="w-5 h-5" />,
        title: "Real-time Updates",
        description: "Flask API + Postgres on the backend. New articles show up in the feed as they're scraped"
      }
    ],
    technicalDetails: [
      "React + Vite frontend with category filtering and search",
      "Flask REST API handling scraping triggers, CRUD, and AI calls",
      "PostgreSQL for article storage, user prefs, and scraping metadata",
      "Azure OpenAI (GPT-4) for categorizing and summarizing articles",
      "Qdrant vector DB storing article embeddings for similarity search",
      "Custom scrapers for Medium (RSS parsing), YC (HTML scraping), and Crunchbase",
      "Cron-based scraping schedule so the feed stays fresh",
      "Mobile-friendly layout built with Tailwind",
      "Filter by category, source, or date range",
      "Similar article recommendations powered by cosine similarity on embeddings"
    ],
    challenges: [
      "Every site structures its HTML differently, so each scraper needed custom parsing logic that breaks when they redesign",
      "Azure OpenAI rate limits hit hard when you're categorizing hundreds of articles at once. Had to add batching and retry logic",
      "Qdrant was new to me, and figuring out the right embedding dimensions and distance metrics took real experimentation",
      "Deduplication is tricky when the same story gets covered by multiple sources with different titles",
      "Keeping the scraping schedule reliable without hammering the source sites or getting IP-blocked"
    ],
    learnings: [
      "LLMs are surprisingly good at categorization if you write clear prompts and give them structured output formats",
      "Vector databases aren't just hype. Similarity search on embeddings works way better than keyword search for articles",
      "Web scraping is fragile by nature. You need good error handling and alerts for when a scraper silently breaks",
      "Rate limiting and backoff aren't optional when you're calling external APIs in a loop",
      "Building something I actually use every day kept me motivated in ways a tutorial project never would"
    ]
  }

  return (
    <>
      <ProjectDetailStructuredData
        title={project.title}
        description={project.description}
        slug="tech-updates"
        image="/images/Tech%20Updates.png"
        keywords={project.tags}
        github={project.github}
        projectType="app"
      />
      <Suspense fallback={<ProjectSkeleton />}>
        <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
          <ProjectNav />

          {/* Header */}
          <div className="border-b border-border bg-card/40 py-16 sm:py-20">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl"
              >
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-px w-8 bg-accent" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                    AI / News Aggregator
                  </span>
                </div>
                <h1 className="font-display mb-5 text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                  {project.title}
                </h1>
                <p className="mb-8 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="font-mono text-[10px] uppercase tracking-[0.1em]">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="py-16 sm:py-20">
            <div className="container mx-auto">
              <div className="max-w-3xl space-y-16">

                {/* 01 — Preview */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.15 }}
                >
                  <SectionLabel n="01" label="Preview" />
                  <div className="relative aspect-video overflow-hidden rounded border border-border">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 800px"
                      priority
                    />
                  </div>
                </motion.section>

                {/* 02 — Overview */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.25 }}
                >
                  <SectionLabel n="02" label="Overview" />
                  <p className="whitespace-pre-line text-base leading-relaxed text-muted-foreground">
                    {project.longDescription}
                  </p>
                </motion.section>

                {/* 03 — Key Features */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.35 }}
                >
                  <SectionLabel n="03" label="Key Features" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    {project.features.map((feature, index) => (
                      <div
                        key={index}
                        className="rounded border border-border bg-card p-5 transition-colors hover:border-accent/40"
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <div className="text-accent">{feature.icon}</div>
                          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-foreground">
                            {feature.title}
                          </h3>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.section>

                {/* 04 — Technical Stack */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.45 }}
                >
                  <SectionLabel n="04" label="Technical Stack" />
                  <div className="overflow-hidden rounded border border-border bg-card">
                    <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent/60" />
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        implementation.notes
                      </span>
                    </div>
                    <div className="divide-y divide-border/50">
                      {project.technicalDetails.map((detail, index) => (
                        <div key={index} className="flex items-start gap-4 px-4 py-3">
                          <span className="w-5 shrink-0 text-right font-mono text-[10px] text-accent/60">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-sm text-muted-foreground">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.section>

                {/* 05 — Friction & Takeaways */}
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.55 }}
                >
                  <SectionLabel n="05" label="Friction & Takeaways" />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded border border-border bg-card p-5">
                      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        Friction
                      </p>
                      <ul className="space-y-3">
                        {project.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="mt-2 h-1 w-1 shrink-0 bg-muted-foreground/50" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded border border-accent/20 bg-card p-5">
                      <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                        Takeaways
                      </p>
                      <ul className="space-y-3">
                        {project.learnings.map((learning, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <span className="mt-2 h-1 w-1 shrink-0 bg-accent/60" />
                            {learning}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.section>

                {/* CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.65 }}
                  className="flex flex-wrap gap-3 border-t border-border pt-8"
                >
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded bg-accent px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-accent/90"
                  >
                    <Github className="h-4 w-4" />
                    Source Code
                  </a>
                  <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] text-foreground transition hover:border-foreground/40"
                  >
                    <FolderKanban className="h-4 w-4" />
                    All Projects
                  </Link>
                </motion.div>

              </div>
            </div>
          </div>
        </div>
      </Suspense>
    </>
  )
}
