"use client"

import { useEffect, useRef, useState } from "react"
import { animate, motion, useDragControls, useMotionValue } from "framer-motion"
import Link from "next/link"
import { ArrowUpRight, Briefcase, Calendar, FileText, FlaskConical, X } from "lucide-react"
import Image, { StaticImageData } from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { Badge } from "@/app/components/ui/badge"
import { triggerHaptic } from "./ui/haptics"
import SectionHeading from "./SectionHeading"
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
  researchHubUrl?: string
  researchHubLabel?: string
  note?: string
}

const experiences: ExperienceItem[] = [
  {
    id: "keck-usc",
    title: "Research Assistant",
    company: "Keck School of Medicine of USC",
    date: "Oct 2025 - Present",
    description:
      "Building MEMOIR-VLM, a multimodal deep learning pipeline for Alzheimer's disease classification and VQA using neuroimaging and clinical data, with end-to-end experimentation infrastructure across ~70M parameter models.",
    projects: [
      "Multimodal Deep Learning Pipeline: Architected a multimodal deep learning pipeline (MEMOIR-VLM) for Alzheimer's disease classification using T1 MRI, DTI imaging, and clinical data across 2,363 ADNI subjects, achieving 70.7% balanced accuracy on 3-class diagnosis and 93.3% on binary classification (CN vs Dementia).",
      "Missing-Modality Fusion: Designed missing-modality fusion via cross-attention with stochastic modality dropout, enabling robust inference with any subset of T1, DTI, and clinical inputs when imaging data is incomplete (39.4% DTI coverage).",
      "Retrieval-Augmented VQA: Extended the frozen VLM with a FAISS-based retrieval + cross-encoder rerank + LLM pipeline; benchmarked Mistral 7B, Gemma 4 26B MoE, and MedGemma 1.5 4B, with Mistral 7B winning at 94.7% diagnosis VQA accuracy.",
      "Experimentation Infrastructure: Built end-to-end experimentation infrastructure: two-stage training (CLIP contrastive pre-training → multi-task fine-tuning), modality ablation studies across 7 combinations, and confidence calibration analysis on ~70M parameter models.",
    ],
    tags: ["Python", "PyTorch", "Deep Learning", "CLIP", "RAG"],
    isLatest: true,
    logo: keckUSC,
    researchUrl: "/research/memoir-vlm-alzheimers-vqa",
    researchLabel: "Read the MEMOIR-VLM research",
    researchHubUrl: "/research",
    researchHubLabel: "All research",
  },
  {
    id: "insaito",
    title: "Senior Software Engineer - I",
    company: "Insaito, Inc.",
    date: "May 2025 - Jul 2025",
    description:
      "Built core infrastructure and product surfaces for an AI agent builder, spanning open-source model deployment, third-party authentication, MCP tools, backend services, and frontend workflows.",
    projects: [
      "Agent Platform Foundation: Built backend and frontend workflows for configuring agents, connecting tools, and running open-source models including Qwen 3 and Mistral Small 24B.",
      "Integration Architecture: Implemented reusable OAuth and MCP foundations designed to support a catalog of 100+ third-party applications; the number describes platform capacity, not 100 individually completed integrations.",
    ],
    tags: ["Python", "Flask", "Node.js", "GCP","MCP"],
    isLatest: false,
    logo: insaitoLogo,
  },
  {
    id: "iifl",
    title: "Full Stack - Software Developer",
    company: "IIFL Finance Ltd",
    date: "Jun 2023 - May 2025",
    description:
      "Built internal employee support chatbot, AI-powered fraud detection, and automated user support systems across multiple business verticals.",
    projects: [
      "Custom Data Chatbots (RAG): Built an internal employee support chatbot using NLP, Python, and Flask. Integrated with Qdrant vector database, Azure OpenAI service, and Zoho ticketing system. This AI-powered solution significantly reduced the number of support tickets raised by employees, streamlining internal processes. (Certificate of Achievement)",
      "Gold Loan Image Audit App: Engineered an AI-assisted audit application with GroundingDINO and Swin Transformer. An internal post-launch study measured a 15% reduction in potential loan-fraud cases versus the prior review workflow.",
      "CapitalGenie: Designed an automated support system using internal APIs and GPT-4o to diagnose issues and draft personalized responses. An internal post-launch study measured 70% faster resolution than the previous support workflow.",
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

  const sheetRef = useRef<HTMLDivElement>(null)
  const modalBodyRef = useRef<HTMLDivElement>(null)
  const dragFrom = useRef<{ y: number } | null>(null)
  const dragControls = useDragControls()
  const sheetY = useMotionValue(0)

  const openModal = (experience: ExperienceItem) => {
    triggerHaptic()
    sheetY.set(0)
    setSelected(experience)
  }

  const closeModal = () => {
    setSelected(null)
    sheetY.set(0)
  }

  // Slide the sheet off-screen, then unmount the dialog.
  const dismissSheet = () => {
    triggerHaptic()
    const distance = (sheetRef.current?.offsetHeight ?? 600) + 32
    animate(sheetY, distance, { duration: 0.22, ease: [0.4, 0, 1, 1] }).then(() => {
      setSelected(null)
      sheetY.set(0)
    })
  }

  const isMobileSheet = () =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 639px)").matches

  const requestClose = () => {
    if (isMobileSheet()) dismissSheet()
    else closeModal()
  }

  // Slide the sheet up from the bottom when it opens (mobile only).
  useEffect(() => {
    if (!selected || !isMobileSheet()) return
    const distance = (sheetRef.current?.offsetHeight ?? 600) + 32
    sheetY.set(distance)
    const controls = animate(sheetY, 0, { duration: 0.3, ease: [0.2, 0.8, 0.2, 1] })
    return () => controls.stop()
  }, [selected, sheetY])

  const [featured, ...restExperiences] = experiences
  const featuredHighlighted = normalizedSkill && featured
    ? featured.tags.some((tag) => tag.toLowerCase() === normalizedSkill)
    : false

  return (
    <section id="experience" className="section-y">
      <div className="container mx-auto px-4">
        <SectionHeading eyebrow="Experience">
          Industry, research, and product execution.
        </SectionHeading>

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
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className={`group cursor-pointer rounded border border-border border-l-2 border-l-accent bg-card/80 p-6 transition active:scale-[0.99] hover:border-t-accent/50 hover:border-r-accent/50 hover:border-b-accent/50 sm:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
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
                      <span className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.22em] text-accent">
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
                  {featured.note ? (
                    <p className="mt-1.5 text-xs italic text-muted-foreground/80">
                      {featured.note}
                    </p>
                  ) : null}
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{featured.description}</p>

              {featured.researchUrl ? (
                <div className="mt-4 flex flex-wrap items-center gap-2">
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
                  aria-label={`${featured.researchLabel ?? "Read the research"}: opens research page`}
                  className="group/research inline-flex max-w-full items-center gap-2 rounded border border-accent/30 bg-accent/5 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent transition hover:border-accent/60 hover:bg-accent/10 sm:text-xs"
                >
                  <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="min-w-0 truncate">
                    {featured.researchLabel ?? "Read the research"}
                  </span>
                  <ArrowUpRight className="h-3 w-3 shrink-0 transition-transform group-hover/research:translate-x-0.5 group-hover/research:-translate-y-0.5" aria-hidden />
                </Link>
                {featured.researchHubUrl ? (
                  <Link
                    href={featured.researchHubUrl}
                    onClick={(event) => {
                      event.stopPropagation()
                      triggerHaptic()
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.stopPropagation()
                      }
                    }}
                    aria-label={`${featured.researchHubLabel ?? "All research"}: opens research hub`}
                    className="group/hub inline-flex max-w-full items-center gap-2 rounded border border-border bg-background/60 px-3 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:border-foreground/40 hover:text-foreground sm:text-xs"
                  >
                    <FlaskConical className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span className="min-w-0 truncate">
                      {featured.researchHubLabel ?? "All research"}
                    </span>
                    <ArrowUpRight className="h-3 w-3 shrink-0 transition-transform group-hover/hub:translate-x-0.5 group-hover/hub:-translate-y-0.5" aria-hidden />
                  </Link>
                ) : null}
                </div>
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
                        className={`border-border/70 bg-background/60 text-xs font-semibold uppercase tracking-[0.2em] ${
                          isTagHighlighted ? "border-accent/40 bg-accent/10 text-accent" : "text-muted-foreground"
                        }`}
                      >
                        {tag}
                      </Badge>
                    )
                  })}
                </div>
                <span className="ml-auto inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.22em] text-accent/70 transition group-hover:text-accent">
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
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    /* Flex column so the tag/link footer can be pushed to the
                       bottom: side-by-side cards have different description
                       lengths, which otherwise leaves their footers unaligned. */
                    className={`group flex h-full cursor-pointer flex-col rounded border bg-card/80 p-5 transition hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
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

                    {item.note ? (
                      <p className="mt-1.5 text-xs italic text-muted-foreground/80">
                        {item.note}
                      </p>
                    ) : null}

                    <p className="mt-2.5 line-clamp-3 text-sm text-muted-foreground">{item.description}</p>

                    <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag) => {
                          const isTagHighlighted = normalizedSkill
                            ? tag.toLowerCase() === normalizedSkill
                            : false
                          return (
                            <Badge
                              key={tag}
                              variant="outline"
                              className={`border-border/70 bg-background/60 text-xs font-semibold uppercase tracking-[0.2em] ${
                                isTagHighlighted ? "border-accent/40 bg-accent/10 text-accent" : "text-muted-foreground"
                              }`}
                            >
                              {tag}
                            </Badge>
                          )
                        })}
                      </div>
                      <span className="ml-auto inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.22em] text-accent/70 transition group-hover:text-accent">
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

      <Dialog open={!!selected} onOpenChange={(open) => !open && requestClose()}>
        {selected && (
          <DialogContent className="top-auto bottom-0 w-full max-w-none translate-y-0 gap-0 border-0 bg-transparent p-0 shadow-none max-sm:data-[state=open]:animate-none max-sm:data-[state=closed]:animate-none sm:bottom-auto sm:top-[50%] sm:w-full sm:max-w-3xl sm:translate-y-[-50%] [&>button]:hidden">
            <motion.div
              ref={sheetRef}
              drag="y"
              dragListener={false}
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 1 }}
              style={{ y: sheetY }}
              onPointerDown={(e) => {
                if (e.pointerType !== "touch") return
                dragFrom.current = { y: e.clientY }
              }}
              onPointerMove={(e) => {
                if (e.pointerType !== "touch" || !dragFrom.current) return
                const dy = e.clientY - dragFrom.current.y
                if (dy > 8 && (modalBodyRef.current?.scrollTop ?? 0) <= 0) {
                  dragControls.start(e)
                  dragFrom.current = null
                }
              }}
              onPointerUp={() => {
                dragFrom.current = null
              }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 110 || info.velocity.y > 500) dismissSheet()
              }}
              className="relative flex max-h-[85vh] flex-col overflow-hidden rounded-t border border-x-0 border-b-0 border-border bg-card sm:max-h-[85vh] sm:rounded sm:border-x sm:border-b"
            >
              <div aria-hidden className="mx-auto mt-2 h-1 w-10 shrink-0 rounded bg-border sm:hidden" />
              <button
                type="button"
                onClick={requestClose}
                aria-label="Close"
                className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded border border-border bg-background/70 text-muted-foreground transition hover:border-accent/40 hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            <DialogHeader className="shrink-0 border-b border-border/60 bg-card px-5 py-3.5 pr-14 text-left sm:px-6 sm:py-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded border border-border bg-background sm:h-12 sm:w-12">
                  <Image
                    src={selected.logo}
                    alt={`${selected.company} logo`}
                    fill
                    placeholder="blur"
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0">
                  <DialogTitle className="truncate font-display text-lg leading-snug text-foreground sm:text-2xl">
                    {selected.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-muted-foreground sm:text-sm">
                    {selected.company} · {selected.date}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div
              ref={modalBodyRef}
              className="space-y-4 overflow-y-auto overscroll-contain px-5 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-5"
            >
              {selected.note ? (
                <p className="text-xs italic text-muted-foreground/80">{selected.note}</p>
              ) : null}
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              {selected.researchUrl ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={selected.researchUrl}
                    onClick={() => triggerHaptic()}
                    className="group/cta inline-flex items-center gap-2 rounded border border-accent/40 bg-accent/5 px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-accent transition hover:border-accent hover:bg-accent/10"
                  >
                    <FileText className="h-3.5 w-3.5" />
                    {selected.researchLabel ?? "Read the research"}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                  </Link>
                  {selected.researchHubUrl ? (
                    <Link
                      href={selected.researchHubUrl}
                      onClick={() => triggerHaptic()}
                      className="group/hubcta inline-flex items-center gap-2 rounded border border-border bg-background/60 px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition hover:border-foreground/40 hover:text-foreground"
                    >
                      <FlaskConical className="h-3.5 w-3.5" />
                      {selected.researchHubLabel ?? "All research"}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/hubcta:translate-x-0.5 group-hover/hubcta:-translate-y-0.5" />
                    </Link>
                  ) : null}
                </div>
              ) : null}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-accent">
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
            </motion.div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  )
}
