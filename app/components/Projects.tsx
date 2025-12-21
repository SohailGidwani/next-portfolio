"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { ArrowUpRight, Github } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import knowledgeHub from "@/public/images/KnowledgeHub_1.png"
import imagecaption from "@/public/images/BE-Project.jpg"
import blogsite from "@/public/images/BlogSite.jpg"
import techupdates from "@/public/images/Tech Updates.png"

interface ProjectsProps {
  setActiveSection: (section: string) => void
  activeSkill?: string | null
}

const projects = [
  {
    id: "knowledge-hub",
    title: "Knowledge Hub",
    shortDescription: "AI-powered document management with OCR, semantic search, and RAG-based Q&A.",
    description:
      "Built a Flask + Postgres system with pgvector, OCR, and local LLMs to answer questions over academic docs.",
    image: knowledgeHub,
    tags: ["Flask", "pgvector", "RAG", "OCR"],
    github: "https://github.com/SohailGidwani/knowledge_hub",
    featured: true,
  },
  {
    id: "image-captioning",
    title: "Image Captioning",
    shortDescription: "CNN + Transformer pipeline for feature extraction and caption generation.",
    description:
      "Implemented VGG-16 feature extraction with LSTM/Transformer generation and a Streamlit UI.",
    image: imagecaption,
    tags: ["TensorFlow", "CNN", "Transformer"],
    github: "https://github.com/SohailGidwani/Image-Caption",
    featured: true,
  },
  {
    id: "scribeglobe",
    title: "ScribeGlobe",
    shortDescription: "Medium-like platform with a serverless backend on Cloudflare Workers.",
    description:
      "Built a React + Vite frontend with Hono-based APIs and Postgres persistence.",
    image: blogsite,
    tags: ["React", "Hono", "PostgreSQL"],
    github: "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
    featured: true,
  },
  {
    id: "tech-updates",
    title: "Tech Updates",
    shortDescription: "Personal tech-news aggregator with AI-driven categorization.",
    description:
      "Scrapes multiple sources, categorizes via Azure OpenAI, and serves articles via Flask + React.",
    image: techupdates,
    tags: ["Flask", "Azure OpenAI", "Qdrant"],
    github: "https://github.com/SohailGidwani/Project-TechUpdates",
    featured: false,
  },
]

export default function Projects({ setActiveSection, activeSkill }: ProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null)

  const normalizedSkill = activeSkill?.toLowerCase()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10)
          setActiveSection("projects")
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px",
      }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [setActiveSection])

  const [primary, ...rest] = projects
  const primaryHighlighted = primary && normalizedSkill
    ? primary.tags.some((tag) => tag.toLowerCase() === normalizedSkill)
    : false

  return (
    <section id="projects" ref={sectionRef} className="py-16 sm:py-20">
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
              Selected builds with measurable outcomes.
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            onClick={() => triggerHaptic()}
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {primary && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  viewport={{ once: true }}
                  className={`group rounded-3xl border bg-card/80 p-6 shadow-[0_24px_80px_-60px_rgba(0,0,0,0.5)] ${
                    primaryHighlighted ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
                  }`}
                >
                  <div className="relative mb-6 h-56 w-full overflow-hidden rounded-2xl">
                    <Image
                      src={primary.image}
                      alt={primary.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl text-foreground">{primary.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{primary.shortDescription}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/projects/${primary.id}`}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground transition hover:border-primary/40"
                        onClick={() => triggerHaptic()}
                        aria-label={`View ${primary.title}`}
                      >
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                      <a
                        href={primary.github}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground transition hover:border-primary/40"
                        onClick={() => triggerHaptic()}
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
                          className={`border-border/70 bg-background/60 text-[11px] font-semibold uppercase tracking-[0.15em] ${
                            isHighlighted ? "border-primary/40 bg-primary/10 text-primary" : "text-muted-foreground"
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
                      className={`group rounded-3xl border bg-card/80 p-5 ${
                        isHighlighted ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-display text-xl text-foreground">{project.title}</h4>
                          <p className="mt-2 text-sm text-muted-foreground">{project.shortDescription}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Link
                            href={`/projects/${project.id}`}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/70 text-foreground transition hover:border-primary/40"
                            onClick={() => triggerHaptic()}
                            aria-label={`View ${project.title}`}
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/70 text-foreground transition hover:border-primary/40"
                            onClick={() => triggerHaptic()}
                            aria-label={`Open ${project.title} on GitHub`}
                          >
                            <Github className="h-4 w-4" />
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
                              className={`border-border/70 bg-background/60 text-[11px] font-semibold uppercase tracking-[0.15em] ${
                                tagHighlighted ? "border-primary/40 bg-primary/10 text-primary" : "text-muted-foreground"
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
