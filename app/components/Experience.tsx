"use client"

import { useEffect, useRef, useCallback } from "react"
import { gsap } from "gsap"
import PinnedSection from "./scroll/PinnedSection"
import { useScrollEngine } from "./scroll/ScrollEngine"
import { useIsMobile } from "./hooks/useDeviceDetect"

interface ExperienceItem {
  id: string
  title: string
  company: string
  date: string
  description: string
  projects: string[]
  tags: string[]
  isLatest?: boolean
}

const experiences: ExperienceItem[] = [
  {
    id: "keck-usc",
    title: "Research Assistant — Multi-Modal AI for Alzheimer's Disease",
    company: "Keck School of Medicine of USC",
    date: "Oct, 2025 – Present",
    description:
      "Architecting multi-modal deep learning pipelines for Alzheimer's disease prediction using neuroimaging and clinical data, with end-to-end experimentation infrastructure across ~71M parameter models.",
    projects: [
      "Multi-Modal Deep Learning Pipeline: Architected a multi-modal deep learning pipeline for Alzheimer's disease prediction using T1 MRI, DTI imaging, and clinical data across 2,363 ADNI subjects, achieving 72.7% balanced accuracy on 3-class diagnosis and 93.1% on binary classification (CN vs Dementia).",
      "Missing-Modality Fusion: Designed missing-modality fusion via cross-attention with modality dropout, enabling robust inference when imaging data is incomplete (39.4% DTI coverage); nearly doubled preclinical amyloid detection sensitivity from 29% to 56% between model iterations.",
      "Experimentation Infrastructure: Built end-to-end experimentation infrastructure: two-stage training (CLIP contrastive pre-training → multi-task fine-tuning), modality ablation studies across 7 combinations, and confidence calibration analysis on ~71M parameter models.",
    ],
    tags: ["Python", "PyTorch", "Deep Learning", "CLIP"],
    isLatest: true,
  },
  {
    id: "insaito",
    title: "Senior Software Engineer — I",
    company: "Insaito, Inc.",
    date: "May, 2025 – July, 2025",
    description:
      "Building cutting-edge AI agent platforms from scratch, focusing on open-source LLM deployment and integration architecture.",
    projects: [
      "AI Agent Builder Platform: Architecting and developing a comprehensive AI agent builder platform from the ground up, enabling users to create sophisticated AI agents with custom workflows and integrations.",
      "Open Source LLM Deployment: Deploying and optimizing open-source large language models including Qwen 3 and Mistral Small 24B 2.",
      "OAuth Integration Architecture: Building robust OAuth functionality for 100+ different applications.",
      "MCP Server Development: Creating Model Context Protocol (MCP) servers for integrated applications.",
      "Full-Stack Development: Handling end-to-end development from backend infrastructure to frontend user interfaces.",
    ],
    tags: ["TypeScript", "Next.js", "Node.js", "MongoDB"],
    isLatest: false,
  },
  {
    id: "iifl",
    title: "Full Stack — Software Developer",
    company: "IIFL Finance Ltd",
    date: "June, 2023 – May, 2025",
    description:
      "Built internal employee support chatbot, AI-powered fraud detection, and automated user support systems across multiple business verticals.",
    projects: [
      "Custom Data Chatbots (RAG): Built an internal employee support chatbot using NLP, Python, and Flask. Integrated with Qdrant vector database, Azure OpenAI service, and Zoho ticketing system.",
      "Gold Loan Image Audit App: Engineered AI-powered application using models like GroundingDino, Swin-Transformer, enhancing fraud detection and reducing potential loan fraud by 15%.",
      "CapitalGenie: Designed and implemented an automated user support system leveraging internal APIs and GPT-4o, accelerating resolution by 70%.",
      "Cross-functional Collaboration: Worked closely with data science and security teams to implement best practices for data handling and model deployment.",
    ],
    tags: ["Python", "Flask", "Qdrant", "Azure"],
    isLatest: false,
  },
  {
    id: "iremify",
    title: "Web Developer (Intern)",
    company: "Iremify.com",
    date: "May, 2021 – July, 2021",
    description:
      "Designed and implemented ML algorithms for predictive analytics. Collaborated with cross-functional teams to integrate ML solutions into existing products.",
    projects: [
      "Troubleshot and debugged code ensuring compatibility with devices, browsers, and operating systems.",
      "Developed web platform back ends using NodeJS and Flask frameworks. Built APIs and data clients to consume APIs.",
      "Implemented responsive front-end designs using React, showcasing adaptability in learning and applying new technologies.",
    ],
    tags: ["React", "Node.js", "Flask"],
    isLatest: false,
  },
]

function ExperienceCard({ item }: { item: ExperienceItem }) {
  return (
    <div className="rounded-2xl p-6 bg-white/[0.03] border border-white/[0.06]">
      <div className="flex items-center gap-3">
        <h3 className="font-display italic text-xl text-white leading-tight">{item.title}</h3>
        {item.isLatest && (
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-body font-medium tracking-[0.2em] uppercase text-white/40">
            Active
          </span>
        )}
      </div>
      <p className="mt-1 font-body text-sm text-white/40">{item.company}</p>
      <p className="mt-1 font-body text-xs text-white/25">{item.date}</p>
      <p className="mt-4 font-body text-sm text-white/35 leading-relaxed">{item.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {item.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-white/30"
          >
            {tag}
          </span>
        ))}
      </div>

      {item.projects.length > 0 && (
        <div className="mt-5 space-y-2">
          <p className="text-[9px] font-body font-medium tracking-[0.3em] uppercase text-white/20">
            Key Contributions
          </p>
          {item.projects.map((project, i) => (
            <p key={i} className="font-body text-xs text-white/25 leading-relaxed pl-3 border-l border-white/[0.06]">
              {project}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

function MobileExperience() {
  const { registerSection } = useScrollEngine()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("experience", sectionRef.current)
    }
  }, [registerSection])

  return (
    <section id="experience" ref={sectionRef} className="relative py-20 px-4">
      <div className="mb-10">
        <p className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30">
          Experience
        </p>
        <h2 className="mt-4 font-display italic text-4xl text-white leading-[1.1]">
          Industry, research, and product execution.
        </h2>
      </div>
      <div className="space-y-6">
        {experiences.map((item) => (
          <div key={item.id} className="rounded-2xl p-6 bg-white/[0.03] border border-white/[0.06]">
            <div className="flex items-center gap-3">
              <h3 className="font-display italic text-xl text-white leading-tight">{item.title}</h3>
              {item.isLatest && (
                <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-body font-medium tracking-[0.2em] uppercase text-white/40">
                  Active
                </span>
              )}
            </div>
            <p className="mt-1 font-body text-sm text-white/40">{item.company}</p>
            <p className="mt-1 font-body text-xs text-white/25">{item.date}</p>
            <p className="mt-4 font-body text-sm text-white/35 leading-relaxed">{item.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-0.5 font-mono text-[10px] text-white/30">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const HEADER_HEIGHT = 150
const COUNT = experiences.length

export default function Experience() {
  const { registerSection } = useScrollEngine()
  const sectionRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const overflowRef = useRef(0)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("experience", sectionRef.current)
    }
  }, [registerSection])

  useEffect(() => {
    if (!timelineRef.current) return
    const el = timelineRef.current
    const measure = () => {
      const contentH = el.scrollHeight
      const viewportH = window.innerHeight - HEADER_HEIGHT - 60
      overflowRef.current = Math.max(0, contentH - viewportH)
    }
    measure()
    const timer = setTimeout(measure, 300)
    window.addEventListener("resize", measure)
    return () => {
      window.removeEventListener("resize", measure)
      clearTimeout(timer)
    }
  }, [isMobile])

  const updateAnimations = useCallback((p: number) => {
    const overflow = overflowRef.current

    if (timelineRef.current && overflow > 0) {
      gsap.set(timelineRef.current, { y: -(p * overflow) })
    }

    if (lineRef.current) {
      lineRef.current.style.height = `${p * 100}%`
    }

    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const visible = p >= i / COUNT
      card.style.opacity = visible ? "1" : "0"
      card.style.transform = visible ? "translateY(0)" : "translateY(24px)"
    })

    dotRefs.current.forEach((dot, i) => {
      if (!dot) return
      const active = p >= i / COUNT
      dot.style.background = active ? "rgba(255,255,255,0.5)" : "#090909"
      dot.style.borderColor = active ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)"
      dot.style.transform = active ? "scale(1.3)" : "scale(1)"
    })
  }, [])

  const handleProgress = useCallback((p: number) => {
    updateAnimations(p)
  }, [updateAnimations])

  if (isMobile !== false) return <MobileExperience />

  const scrubDuration = Math.max(3, COUNT * 1.2)

  return (
    <PinnedSection id="experience" scrubDuration={scrubDuration} onProgress={handleProgress}>
      <div ref={sectionRef} className="relative h-screen w-full overflow-hidden">
        <div className="relative z-10 px-6 pt-16 pb-6">
          <div className="container mx-auto">
            <p className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30">
              Experience
            </p>
            <h2 className="mt-4 font-display italic text-4xl sm:text-5xl text-white leading-[1.1]">
              Industry, research, and product execution.
            </h2>
          </div>
        </div>

        <div className="relative px-6" style={{ height: `calc(100vh - ${HEADER_HEIGHT}px - 60px)` }}>
          <div ref={timelineRef} className="container mx-auto relative will-change-transform">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-white/[0.04] md:left-1/2 md:-translate-x-px">
              <div ref={lineRef} className="w-full bg-white/20 transition-[height] duration-100" style={{ height: "0%" }} />
            </div>

            <div className="space-y-14 md:space-y-20 pb-16">
              {experiences.map((item, i) => (
                <div
                  key={item.id}
                  ref={(el) => { cardRefs.current[i] = el }}
                  className={`relative pl-12 md:pl-0 md:w-[46%] opacity-0 transition-[opacity,transform] duration-500 ease-out ${
                    i % 2 === 0 ? "md:pr-14 md:ml-0" : "md:pl-14 md:ml-auto"
                  }`}
                  style={{ transform: "translateY(24px)" }}
                >
                  <div
                    ref={(el) => { dotRefs.current[i] = el }}
                    className={`absolute top-6 left-[13px] h-2.5 w-2.5 rounded-full border border-white/20 bg-[#090909] transition-all duration-300 md:top-6 ${
                      i % 2 === 0
                        ? "md:left-auto md:right-[-5px]"
                        : "md:left-[-6px]"
                    }`}
                  />
                  <ExperienceCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PinnedSection>
  )
}
