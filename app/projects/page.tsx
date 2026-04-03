"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Github, Home } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import knowledgeHub from "@/public/images/KnowledgeHub_1.png"
import imagecaption from "@/public/images/BE-Project.jpg"
import blogsite from "@/public/images/BlogSite.jpg"
import techupdates from "@/public/images/Tech Updates.png"
const projects = [
  {
    id: "knowledge-hub",
    title: "Knowledge Hub",
    shortDescription: "Upload notes, search them semantically, ask questions with RAG.",
    image: knowledgeHub,
    tags: ["Flask", "pgvector", "RAG", "OCR"],
    github: "https://github.com/SohailGidwani/knowledge_hub",
  },
  {
    id: "tech-updates",
    title: "Tech Updates",
    shortDescription: "Scrapes tech news from multiple sources, AI sorts it for me.",
    image: techupdates,
    tags: ["Flask", "Azure OpenAI", "Qdrant"],
    github: "https://github.com/SohailGidwani/Project-TechUpdates",
  },
  {
    id: "image-captioning",
    title: "Image Captioning",
    shortDescription: "Give it an image, get a caption. Transformer model hit 0.80 BLEU.",
    image: imagecaption,
    tags: ["TensorFlow", "CNN", "Transformer"],
    github: "https://github.com/SohailGidwani/Image-Caption",
  },
  {
    id: "scribeglobe",
    title: "ScribeGlobe",
    shortDescription: "A Medium clone built on Cloudflare Workers. Serverless all the way.",
    image: blogsite,
    tags: ["React", "Hono", "PostgreSQL"],
    github: "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
  },
]

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="border-b border-white/[0.06] bg-white/[0.02] backdrop-blur">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4 px-4 py-6">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-xs font-body font-medium uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors"
          >
            <Home className="h-4 w-4" />
            Back to portfolio
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <p className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30">Projects</p>
          <h1 className="font-display italic text-4xl text-white sm:text-5xl">All projects</h1>
          <p className="max-w-2xl font-body text-sm text-white/35">
            Everything I&apos;ve shipped, from AI pipelines to full-stack apps. Click into any of them for the full story.
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project, index) => (
            <Link key={project.id} href={`/projects/${project.id}`} className="block">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group flex h-full cursor-pointer flex-col rounded-2xl glass p-5 transition hover:-translate-y-1"
              >
                <div className="relative h-40 w-full overflow-hidden rounded-xl">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/60 via-transparent to-transparent" />
                </div>
                <div className="mt-4 flex-1 space-y-2">
                  <h2 className="font-display italic text-xl text-white">{project.title}</h2>
                  <p className="font-body text-sm text-white/35">{project.shortDescription}</p>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-white/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-xs font-body font-medium uppercase tracking-[0.2em] text-white/40 transition group-hover:text-white/60">
                    Details
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      window.open(project.github, "_blank", "noreferrer")
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        e.stopPropagation()
                        window.open(project.github, "_blank", "noreferrer")
                      }
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/30 transition hover:text-white/60"
                    aria-label={`Open ${project.title} on GitHub`}
                  >
                    <Github className="h-4 w-4" />
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
