"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import PinnedSection from "./scroll/PinnedSection"
import AnimatedTimeline from "./AnimatedTimeline"
import { useScrollEngine } from "./scroll/ScrollEngine"

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
    <div className="glass rounded-2xl p-6">
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

export default function Experience() {
  const { registerSection } = useScrollEngine()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("experience", sectionRef.current)
    }
  }, [registerSection])

  const handleProgress = useCallback((p: number) => {
    setProgress(p)
  }, [])

  const scrubDuration = Math.max(2, experiences.length * 1.2)

  const entries = experiences.map((item) => ({
    id: item.id,
    content: <ExperienceCard item={item} />,
  }))

  return (
    <PinnedSection id="experience" scrubDuration={scrubDuration} onProgress={handleProgress}>
      <div ref={sectionRef} className="flex h-screen w-full items-center overflow-hidden">
        <div className="container mx-auto px-6 max-h-[85vh] overflow-y-auto scrollbar-hide">
          <div className="mb-10">
            <p className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30">
              Experience
            </p>
            <h2 className="mt-4 font-display italic text-4xl sm:text-5xl text-white leading-[1.1]">
              Industry, research, and product execution.
            </h2>
          </div>
          <AnimatedTimeline entries={entries} progress={progress} />
        </div>
      </div>
    </PinnedSection>
  )
}
