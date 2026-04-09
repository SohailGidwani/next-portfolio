"use client"

import { useEffect, useRef, useCallback } from "react"
import Image, { StaticImageData } from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import PinnedSection from "./scroll/PinnedSection"
import { useScrollEngine } from "./scroll/ScrollEngine"
import { useIsMobile } from "./hooks/useDeviceDetect"
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

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="flex-shrink-0 w-[85vw] max-w-[1000px] h-full flex items-center">
      <div className="group relative w-full rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6 lg:p-8 transition-colors duration-300 hover:bg-white/[0.05] hover:border-white/[0.12]">
        <Link
          href={`/projects/${project.id}`}
          className="absolute inset-0 z-0 rounded-3xl"
          aria-label={`View ${project.title}`}
        />
        <div className="grid w-full gap-8 lg:grid-cols-[1.2fr_1fr] items-center">
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 85vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/80 via-transparent to-transparent" />
          </div>

          <div className="space-y-5">
            <h3 className="font-display italic text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              {project.title}
            </h3>
            <p className="font-body text-sm text-white/35 leading-relaxed max-w-md">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-[10px] text-white/30"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 pt-2">
              <span className="font-body text-xs tracking-[0.2em] uppercase text-white/50 group-hover:text-white transition-colors">
                View Project →
              </span>
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="relative z-10 font-body text-xs tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MobileProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative rounded-2xl p-5 space-y-4 bg-white/[0.02] border border-white/[0.06] active:bg-white/[0.05]">
      <Link
        href={`/projects/${project.id}`}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={`View ${project.title}`}
      />
      <div className="relative aspect-video overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={typeof project.image === "string" ? project.image : project.image.src}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090909]/80 via-transparent to-transparent" />
      </div>
      <h3 className="font-display italic text-2xl text-white">{project.title}</h3>
      <p className="font-body text-sm text-white/35 leading-relaxed">{project.description}</p>
      <div className="flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 font-mono text-[10px] text-white/30"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center gap-4 pt-2">
        <span className="font-body text-xs tracking-[0.2em] uppercase text-white/50">
          View Project →
        </span>
        <a
          href={project.github}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 font-body text-xs tracking-[0.2em] uppercase text-white/30 hover:text-white/60 transition-colors"
        >
          GitHub
        </a>
      </div>
    </div>
  )
}

const COUNT = projects.length

export default function Projects() {
  const { registerSection } = useScrollEngine()
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const maxXRef = useRef(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("projects", sectionRef.current)
    }
  }, [registerSection])

  useEffect(() => {
    if (!trackRef.current) return
    const track = trackRef.current
    const measure = () => {
      const trackW = track.scrollWidth
      const viewportW = window.innerWidth
      maxXRef.current = Math.max(0, trackW - viewportW)
    }

    measure()
    const timer = setTimeout(measure, 300)

    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
      clearTimeout(timer)
    }
  }, [isMobile])

  const handleProgress = useCallback((p: number) => {
    if (trackRef.current && maxXRef.current > 0) {
      gsap.set(trackRef.current, { x: -(p * maxXRef.current) })
    }

    if (barRef.current) {
      barRef.current.style.width = `${p * 100}%`
    }

    if (counterRef.current) {
      const idx = Math.min(Math.floor(p * COUNT), COUNT - 1)
      counterRef.current.textContent = `${String(idx + 1).padStart(2, "0")} / ${String(COUNT).padStart(2, "0")}`
    }
  }, [])

  if (isMobile !== false) {
    return (
      <section id="projects" ref={sectionRef} className="relative w-full py-20 px-4">
        <div className="mb-10">
          <p className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30">
            Projects
          </p>
          <h2 className="mt-4 font-display italic text-4xl text-white leading-[1.1]">
            Things I&apos;ve built that I&apos;m proud of.
          </h2>
        </div>
        <div className="space-y-6">
          {projects.map((project) => (
            <MobileProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>
    )
  }

  return (
    <PinnedSection id="projects" scrubDuration={COUNT * 1.5} onProgress={handleProgress}>
      <div ref={sectionRef} className="relative h-screen w-full overflow-hidden">
        <div className="relative z-20 px-6 pt-16 pb-4">
          <div className="container mx-auto">
            <p className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30">
              Projects
            </p>
            <h2 className="mt-4 font-display italic text-4xl sm:text-5xl text-white leading-[1.1]">
              Things I&apos;ve built that I&apos;m proud of.
            </h2>
          </div>
        </div>

        <div
          ref={trackRef}
          className="absolute left-0 h-[calc(100vh-180px)] bottom-16 flex items-center gap-16 pl-6 pr-[15vw] will-change-transform"
        >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <div className="absolute bottom-8 left-6 right-6 z-20">
          <div className="flex items-center gap-4">
            <span ref={counterRef} className="font-mono text-xs text-white/25">
              01 / {String(COUNT).padStart(2, "0")}
            </span>
            <div className="flex-1 h-px bg-white/[0.06] relative">
              <div
                ref={barRef}
                className="absolute top-0 left-0 h-full bg-white/20"
                style={{ width: "0%" }}
              />
            </div>
            <span className="font-body text-[10px] tracking-[0.3em] uppercase text-white/20">
              Scroll to browse
            </span>
          </div>
        </div>
      </div>
    </PinnedSection>
  )
}
