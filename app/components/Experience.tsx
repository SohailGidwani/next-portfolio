"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, Briefcase, Calendar, FileText } from "lucide-react"
import Image, { StaticImageData } from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { Badge } from "@/app/components/ui/badge"
import { triggerHaptic } from "./ui/haptics"
import { useSkillHighlight } from "./SkillHighlightProvider"
import insaitoLogo from "@/public/images/Insaito.png"
import iiflLogo from "@/public/images/iifl.png"
import keckUSC from "@/public/images/keck_USC.png"

interface ExperienceItem {
  id: string
  title: string
  company: string
  date: string
  description: string
  projects: string[]
  tags: string[]
  isLatest?: boolean
  logo: StaticImageData
  researchUrl?: string
  researchLabel?: string
}

const experiences: ExperienceItem[] = [
  {
    id: "keck-usc",
    title: "Research Assistant",
    company: "Keck School of Medicine of USC",
    date: "Oct, 2025 - Present",
    description:
      "Architecting multi-modal deep learning pipelines for Alzheimer's disease prediction using neuroimaging and clinical data, with end-to-end experimentation infrastructure across ~70M parameter models.",
    projects: [
      "Multi-Modal Deep Learning Pipeline: Architected a multi-modal deep learning pipeline for Alzheimer's disease prediction using T1 MRI, DTI imaging, and clinical data across 2,363 ADNI subjects, achieving 70.7% balanced accuracy on 3-class diagnosis and 93.3% on binary classification (CN vs Dementia).",
      "Missing-Modality Fusion: Designed missing-modality fusion via cross-attention with modality dropout, enabling robust inference when imaging data is incomplete (39.4% DTI coverage); CN amyloid detection sensitivity at 0.529 with 0.846 specificity — suitable as a rule-out triage tool before expensive PET.",
      "Retrieval-Augmented VQA: Extended the frozen VLM with a FAISS-based retrieval + cross-encoder rerank + LLM pipeline; benchmarked Mistral 7B, Gemma 4 26B MoE, and MedGemma 1.5 4B — Mistral 7B wins at 94.7% diagnosis VQA accuracy.",
      "Experimentation Infrastructure: Built end-to-end experimentation infrastructure: two-stage training (CLIP contrastive pre-training → multi-task fine-tuning), modality ablation studies across 7 combinations, and confidence calibration analysis on ~70M parameter models.",
    ],
    tags: ["Python", "PyTorch", "Deep Learning", "CLIP", "RAG"],
    isLatest: true,
    logo: keckUSC,
    researchUrl: "/research/multimodal-alzheimers-vqa",
    researchLabel: "Read the Alzheimer's VLM research",
  },
  {
    id: "insaito",
    title: "Senior Software Engineer - I",
    company: "Insaito, Inc.",
    date: "May, 2025 - July, 2025",
    description:
      "Built an AI agent builder platform from scratch — open-source LLM deployment (Qwen 3, Mistral 24B), OAuth for 100+ apps, and MCP server development. End-to-end ownership from backend infra to frontend UI.",
    projects: [
      "AI Agent Builder Platform: Architecting and developing a comprehensive AI agent builder platform from the ground up, enabling users to create sophisticated AI agents with custom workflows and integrations.",
      "Open Source LLM Deployment: Deploying and optimizing open-source large language models including Qwen 3 and Mistral Small 24B 2, ensuring efficient performance and scalability for production environments.",
      "OAuth Integration Architecture: Building robust OAuth functionality for 100+ different applications, enabling seamless authentication and authorization across diverse third-party services and platforms.",
      "MCP Server Development: Creating Model Context Protocol (MCP) servers for integrated applications, making all functions and capabilities available to the AI models for enhanced functionality and user experience.",
      "Full-Stack Development: Handling end-to-end development from backend infrastructure to frontend user interfaces, ensuring cohesive and performant AI agent experiences.",
    ],
    tags: ["TypeScript", "Next.js", "Node.js", "MongoDB"],
    isLatest: false,
    logo: insaitoLogo,
  },
  {
    id: "iifl",
    title: "Full Stack - Software Developer",
    company: "IIFL Finance Ltd",
    date: "June, 2023 - May, 2025",
    description:
      "Built internal employee support chatbot, AI-powered fraud detection, and automated user support systems across multiple business verticals.",
    projects: [
      "Custom Data Chatbots (RAG): Built an internal employee support chatbot using NLP, Python, and Flask. Integrated with Qdrant vector database, Azure OpenAI service, and Zoho ticketing system. This AI-powered solution significantly reduced the number of support tickets raised by employees, streamlining internal processes. (Certificate of Achievement)",
      "Gold Loan Image Audit App: Engineered AI-powered application using models like GroundingDino, Swin-Transformer, enhancing fraud detection and reducing potential loan fraud by 15%.",
      "CapitalGenie: Designed and implemented an automated user support system leveraging internal APIs and GPT-4o to fetch user data, diagnose issues, and generate personalized responses, accelerating resolution by 70%.",
      "Compliance & Security: Implemented data anonymization and access-control workflows for AI services handling sensitive financial data, passing internal security audits on first review.",
    ],
    tags: ["Python", "Flask", "Qdrant", "Azure"],
    isLatest: false,
    logo: iiflLogo,
  },
]

export default function Experience() {
  const { activeSkill } = useSkillHighlight()
  const [selected, setSelected] = useState<ExperienceItem | null>(null)
  const normalizedSkill = activeSkill?.toLowerCase()

  useEffect(() => {
    const handler = (event: Event) => {
      const id = (event as CustomEvent<{ id?: string }>).detail?.id
      if (!id) return
      const match = experiences.find((item) => item.id === id)
      if (match) setSelected(match)
    }
    window.addEventListener("portfolio:open-experience", handler)
    return () => window.removeEventListener("portfolio:open-experience", handler)
  }, [])

  const openModal = (experience: ExperienceItem) => {
    triggerHaptic()
    setSelected(experience)
  }

  const [featured, ...restExperiences] = experiences
  const featuredHighlighted = normalizedSkill && featured
    ? featured.tags.some((tag) => tag.toLowerCase() === normalizedSkill)
    : false

  return (
    <section id="experience" className="section-y">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Experience</p>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            Industry, research, and product execution.
          </h2>
        </motion.div>

        <div className="mt-10 space-y-6">
          {featured && (
            <motion.div
              key={`${featured.company}-${featured.title}`}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-label={`View details for ${featured.title} at ${featured.company}`}
              onClick={() => openModal(featured)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  openModal(featured)
                }
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className={`group cursor-pointer rounded border border-border border-l-2 border-l-accent bg-card/80 p-6 transition hover:border-t-accent/50 hover:border-r-accent/50 hover:border-b-accent/50 sm:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
                featuredHighlighted ? "bg-accent/5" : ""
              }`}
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded border border-border bg-background sm:h-16 sm:w-16">
                  <Image
                    src={featured.logo}
                    alt={`${featured.company} logo`}
                    fill
                    placeholder="blur"
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-[23px] leading-snug text-foreground">{featured.title}</h3>
                    {featured.isLatest && (
                      <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{featured.company}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-accent" />
                    {featured.date}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{featured.description}</p>

              {featured.researchUrl ? (
                <Link
                  href={featured.researchUrl}
                  onClick={(event) => {
                    event.stopPropagation()
                    triggerHaptic()
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.stopPropagation()
                    }
                  }}
                  aria-label={`${featured.researchLabel ?? "Read the research"} — opens research page`}
                  className="group/research mt-4 inline-flex max-w-full items-center gap-2 rounded border border-accent/30 bg-accent/5 px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-accent transition hover:border-accent/60 hover:bg-accent/10 sm:text-[11px]"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="min-w-0 truncate">
                    {featured.researchLabel ?? "Read the research"}
                  </span>
                  <ArrowUpRight className="h-3 w-3 shrink-0 transition-transform group-hover/research:translate-x-0.5 group-hover/research:-translate-y-0.5" aria-hidden />
                </Link>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                <div className="flex flex-wrap gap-2">
                  {featured.tags.map((tag) => {
                    const isTagHighlighted = normalizedSkill
                      ? tag.toLowerCase() === normalizedSkill
                      : false
                    return (
                      <Badge
                        key={tag}
                        variant="outline"
                        className={`border-border/70 bg-background/60 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                          isTagHighlighted ? "border-accent/40 bg-accent/10 text-accent" : "text-muted-foreground"
                        }`}
                      >
                        {tag}
                      </Badge>
                    )
                  })}
                </div>
                <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent/70 transition group-hover:text-accent">
                  View {featured.company}
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </motion.div>
          )}

          {restExperiences.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              {restExperiences.map((item, index) => {
                const isHighlighted = normalizedSkill
                  ? item.tags.some((tag) => tag.toLowerCase() === normalizedSkill)
                  : false

                return (
                  <motion.div
                    key={`${item.company}-${item.title}`}
                    role="button"
                    tabIndex={0}
                    aria-haspopup="dialog"
                    aria-label={`View details for ${item.title} at ${item.company}`}
                    onClick={() => openModal(item)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        openModal(item)
                      }
                    }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    className={`group cursor-pointer rounded border bg-card/80 p-5 transition hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
                      isHighlighted ? "border-accent/40 bg-accent/5" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-border bg-background">
                        <Image
                          src={item.logo}
                          alt={`${item.company} logo`}
                          fill
                          placeholder="blur"
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-display text-base leading-snug text-foreground">{item.title}</h3>
                        <p className="text-xs text-muted-foreground">{item.company}</p>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 text-accent" />
                      {item.date}
                    </div>

                    <p className="mt-2.5 line-clamp-3 text-sm text-muted-foreground">{item.description}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5">
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => {
                          const isTagHighlighted = normalizedSkill
                            ? tag.toLowerCase() === normalizedSkill
                            : false
                          return (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={`border-border/70 bg-background/60 text-[10px] font-semibold uppercase tracking-[0.2em] ${
                                isTagHighlighted ? "border-accent/40 bg-accent/10 text-accent" : "text-muted-foreground"
                              }`}
                            >
                              {tag}
                            </Badge>
                          )
                        })}
                      </div>
                      <span className="ml-auto inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-accent/70 transition group-hover:text-accent">
                        View {item.company}
                        <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        {selected && (
          <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto rounded border-border bg-card top-auto bottom-4 translate-y-0 sm:bottom-auto sm:top-[50%] sm:translate-y-[-50%] sm:rounded">
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded border border-border bg-background">
                  <Image
                    src={selected.logo}
                    alt={`${selected.company} logo`}
                    fill
                    placeholder="blur"
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <DialogTitle className="font-display text-2xl text-foreground">
                    {selected.title}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {selected.company} · {selected.date}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              {selected.researchUrl ? (
                <Link
                  href={selected.researchUrl}
                  onClick={() => triggerHaptic()}
                  className="group/cta inline-flex items-center gap-2 rounded border border-accent/40 bg-accent/5 px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent transition hover:border-accent hover:bg-accent/10"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {selected.researchLabel ?? "Read the research"}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                </Link>
              ) : null}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                  <Briefcase className="h-3.5 w-3.5" />
                  Key Contributions
                </div>
                <ul className="space-y-2.5">
                  {selected.projects.map((project) => {
                    const colonIdx = project.indexOf(": ")
                    const hasLead = colonIdx > 0 && colonIdx < 50
                    return (
                      <li
                        key={project}
                        className="flex gap-2.5 rounded border border-border/70 bg-background/70 p-3.5 text-sm leading-relaxed text-muted-foreground"
                      >
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent/60" />
                        <span>
                          {hasLead ? (
                            <>
                              <strong className="font-semibold text-foreground">{project.slice(0, colonIdx)}</strong>
                              {project.slice(colonIdx)}
                            </>
                          ) : (
                            project
                          )}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  )
}
