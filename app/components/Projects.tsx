"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { ArrowUpRight, Github } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import { usePortfolio } from "./PortfolioProvider"
import knowledgeHub from "@/public/images/KnowledgeHub_1.png"
import imagecaption from "@/public/images/BE-Project.jpg"
import blogsite from "@/public/images/BlogSite.jpg"
import techupdates from "@/public/images/Tech Updates.png"

const projects = [
  {
    id: "knowledge-hub",
    title: "Knowledge Hub",
    shortDescription: "My go-to tool for studying. Upload notes, search them semantically, ask questions with RAG.",
    description:
      "Flask + Postgres app with pgvector that does OCR on handwritten notes and uses Ollama to answer questions over my course docs. Built it because I was tired of digging through PDFs.",
    image: knowledgeHub,
    tags: ["Flask", "pgvector", "RAG", "OCR"],
    github: "https://github.com/SohailGidwani/knowledge_hub",
    featured: true,
  },
  {
    id: "image-captioning",
    title: "Image Captioning",
    shortDescription: "Feed it an image, get a caption. Transformer model hit 0.80 BLEU.",
    description:
      "CNN/VGG-16 pulls features from images, then an LSTM and Transformer generate captions. The Transformer version hit 0.80 BLEU. Wrapped it in Streamlit so anyone could try it.",
    image: imagecaption,
    tags: ["TensorFlow", "CNN", "Transformer"],
    github: "https://github.com/SohailGidwani/Image-Caption",
    featured: true,
  },
  {
    id: "scribeglobe",
    title: "ScribeGlobe",
    shortDescription: "A Medium clone I built to learn serverless. Hono on Cloudflare Workers.",
    description:
      "React + Vite frontend, Hono APIs running on Cloudflare Workers, Postgres for storage. Basically, I wanted to understand edge computing so I built a whole blogging platform.",
    image: blogsite,
    tags: ["React", "Hono", "PostgreSQL"],
    github: "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
    featured: true,
  },
  {
    id: "tech-updates",
    title: "Tech Updates",
    shortDescription: "Scrapes tech news and uses AI to sort it. My personal reading feed.",
    description:
      "Python scrapes articles from Medium, YC, and Crunchbase. Azure OpenAI categorizes them, Qdrant stores the vectors, and a Flask + React frontend serves it all up.",
    image: techupdates,
    tags: ["Flask", "Azure OpenAI", "Qdrant"],
    github: "https://github.com/SohailGidwani/Project-TechUpdates",
    featured: false,
  },
]

export default function Projects() {
  const { activeSkill } = usePortfolio()
  const normalizedSkill = activeSkill?.toLowerCase()

  const [primary, ...rest] = projects
  const primaryHighlighted = primary && normalizedSkill
    ? primary.tags.some((tag) => tag.toLowerCase() === normalizedSkill)
    : false

  return (
    <section id="projects" className="py-16 sm:py-20">
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
              Things I've built that I'm proud of.
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            onClick={() => triggerHaptic()}
          >
            View all
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              {primary && (
                <Link href={`/projects/${primary.id}`} className="block">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true }}
                    className={`group cursor-pointer rounded-2xl border bg-card/80 p-6 shadow-card transition-shadow duration-300 hover:shadow-card-hover ${
                      primaryHighlighted ? "border-primary/40 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
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
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          triggerHaptic()
                          window.open(primary.github, "_blank", "noreferrer")
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            e.stopPropagation()
                            triggerHaptic()
                            window.open(primary.github, "_blank", "noreferrer")
                          }
                        }}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/70 text-foreground transition hover:border-primary/40"
                        aria-label={`Open ${primary.title} on GitHub`}
                      >
                        <Github className="h-4 w-4" />
                      </span>
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
                </Link>
              )}

          <div className="grid gap-4">
            {rest.map((project, index) => {
                  const isHighlighted = normalizedSkill
                    ? project.tags.some((tag) => tag.toLowerCase() === normalizedSkill)
                    : false
                  return (
                    <Link key={project.id} href={`/projects/${project.id}`} className="block">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        whileHover={{ y: -3, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.4, delay: index * 0.08 }}
                        viewport={{ once: true }}
                        className={`group cursor-pointer rounded-2xl border bg-card/80 p-5 transition-shadow duration-300 hover:shadow-card ${
                          isHighlighted ? "border-primary/40 ring-1 ring-primary/20" : "border-border hover:border-primary/30"
                        }`}
                      >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="font-display text-xl text-foreground">{project.title}</h4>
                          <p className="mt-2 text-sm text-muted-foreground">{project.shortDescription}</p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              triggerHaptic()
                              window.open(project.github, "_blank", "noreferrer")
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault()
                                e.stopPropagation()
                                triggerHaptic()
                                window.open(project.github, "_blank", "noreferrer")
                              }
                            }}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/70 text-foreground transition hover:border-primary/40"
                            aria-label={`Open ${project.title} on GitHub`}
                          >
                            <Github className="h-4 w-4" />
                          </span>
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
                    </Link>
                  )
                })}
          </div>
        </div>
      </div>
    </section>
  )
}
