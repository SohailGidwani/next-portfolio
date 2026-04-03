"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { StaticImageData } from "next/image"
import PinnedSection from "./scroll/PinnedSection"
import ProjectSlide from "./ProjectSlide"
import { useScrollEngine } from "./scroll/ScrollEngine"
import knowledgeHub from "@/public/images/KnowledgeHub_1.png"
import imagecaption from "@/public/images/BE-Project.jpg"
import blogsite from "@/public/images/BlogSite.jpg"
import techupdates from "@/public/images/Tech Updates.png"

interface Project {
  id: string
  title: string
  shortDescription: string
  description: string
  image: StaticImageData
  tags: string[]
  github: string
  featured: boolean
}

const projects: Project[] = [
  {
    id: "knowledge-hub",
    title: "Knowledge Hub",
    shortDescription:
      "My go-to tool for studying. Upload notes, search them semantically, ask questions with RAG.",
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
    github:
      "https://github.com/SohailGidwani/0---100-FullStack/tree/main/Week%2012/medium",
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
  const { registerSection } = useScrollEngine()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("projects", sectionRef.current)
    }
  }, [registerSection])

  const handleProgress = useCallback((p: number) => {
    setProgress(p)
  }, [])

  const count = projects.length
  const scrubDuration = count * 1.2
  const activeIndex = Math.min(
    Math.floor(progress * count),
    count - 1
  )

  return (
    <PinnedSection id="projects" scrubDuration={scrubDuration} onProgress={handleProgress}>
      <div ref={sectionRef} className="relative h-screen w-full overflow-hidden">
        {/* Section header fades out as we scroll */}
        <div
          className="absolute top-12 left-6 z-20 transition-opacity duration-300"
          style={{ opacity: progress < 0.05 ? 1 : 0 }}
        >
          <p className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30">
            Projects
          </p>
          <h2 className="mt-4 font-display italic text-4xl sm:text-5xl text-white leading-[1.1]">
            Things I&apos;ve built that I&apos;m proud of.
          </h2>
        </div>

        {/* Project slides */}
        {projects.map((project, i) => {
          const slideProgress = progress * count - i
          const opacity = slideProgress < -0.5
            ? 0
            : slideProgress > 1.5
              ? 0
              : slideProgress >= 0 && slideProgress <= 1
                ? 1
                : slideProgress < 0
                  ? 1 + slideProgress * 2
                  : 1 - (slideProgress - 1) * 2

          const clampedOpacity = Math.max(0, Math.min(1, opacity))
          const translateY = slideProgress < 0 ? 60 : slideProgress > 1 ? -60 : 0

          return (
            <ProjectSlide
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              tags={project.tags}
              image={project.image}
              github={project.github}
              opacity={clampedOpacity}
              translateY={translateY}
            />
          )
        })}

        {/* Navigation dots */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? "bg-white/60 scale-125"
                  : "bg-white/15 hover:bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Current / total counter */}
        <div className="absolute bottom-8 right-6 z-20">
          <span className="font-mono text-xs text-white/25">
            {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
        </div>
      </div>
    </PinnedSection>
  )
}
