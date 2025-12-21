"use client"

import { motion } from "framer-motion"
import { Badge } from "@/app/components/ui/badge"
import { ArrowUpRight, Github, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import knowledgeHub from "@/public/images/KnowledgeHub_1.png"
import imagecaption from "@/public/images/BE-Project.jpg"
import blogsite from "@/public/images/BlogSite.jpg"
import techupdates from "@/public/images/Tech Updates.png"
import ThemeToggle from "@/app/components/ThemeToggle"

export default function ProjectsPage() {
  const projects = [
    {
      id: "knowledge-hub",
      title: "Knowledge Hub",
      shortDescription: "Document management with OCR, semantic search, and RAG-based Q&A.",
      image: knowledgeHub,
      tags: ["Flask", "pgvector", "RAG", "OCR"],
      github: "https://github.com/SohailGidwani/knowledge_hub",
    },
    {
      id: "tech-updates",
      title: "Tech Updates",
      shortDescription: "Personal tech-news aggregator with AI categorization.",
      image: techupdates,
      tags: ["Flask", "Azure OpenAI", "Qdrant"],
      github: "https://github.com/SohailGidwani/Project-TechUpdates",
    },
    {
      id: "image-captioning",
      title: "Image Captioning",
      shortDescription: "CNN + Transformer pipeline for caption generation.",
      image: imagecaption,
      tags: ["TensorFlow", "CNN", "Transformer"],
      github: "https://github.com/SohailGidwani/Image-Caption",
    },
    {
      id: "scribeglobe",
      title: "ScribeGlobe",
      shortDescription: "Medium-like platform with a serverless backend on Cloudflare.",
      image: blogsite,
      tags: ["React", "Hono", "PostgreSQL"],
      github: "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-border bg-card/60 backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-6">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            Back to portfolio
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Projects</p>
          <h1 className="font-display text-4xl text-foreground sm:text-5xl">Full project archive</h1>
          <p className="max-w-2xl text-base text-muted-foreground">
            Explore detailed case studies across AI/ML systems, retrieval pipelines, and full-stack
            product builds.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group flex flex-col rounded-3xl border border-border bg-card/80 p-5 shadow-[0_18px_50px_-40px_rgba(0,0,0,0.45)]"
            >
              <div className="relative h-40 w-full overflow-hidden rounded-2xl">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
              </div>
              <div className="mt-4 flex-1 space-y-2">
                <h2 className="font-display text-xl text-foreground">{project.title}</h2>
                <p className="text-sm text-muted-foreground">{project.shortDescription}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="border-border/70 bg-background/60 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Link
                  href={`/projects/${project.id}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  Details
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background/70 text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                  aria-label={`Open ${project.title} on GitHub`}
                >
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
