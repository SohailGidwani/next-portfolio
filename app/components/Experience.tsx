"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, Briefcase, Calendar } from "lucide-react"
import Image, { StaticImageData } from "next/image"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { Badge } from "@/app/components/ui/badge"
import { triggerHaptic } from "./ui/haptics"
import { usePortfolio } from "./PortfolioProvider"
import AskPandaAI from "@/public/images/Insaito.png"
import fullstack from "@/public/images/iifl.png"
import feynwick from "@/public/images/iremify.png"
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
}

const experiences: ExperienceItem[] = [
  {
    id: "keck-usc",
    title: "Research Assistant - Multi-Modal AI for Alzheimer's Disease",
    company: "Keck School of Medicine of USC",
    date: "Oct, 2025 - Present",
    description:
      "Architecting multi-modal deep learning pipelines for Alzheimer's disease prediction using neuroimaging and clinical data, with end-to-end experimentation infrastructure across ~71M parameter models.",
    projects: [
      "Multi-Modal Deep Learning Pipeline: Architected a multi-modal deep learning pipeline for Alzheimer's disease prediction using T1 MRI, DTI imaging, and clinical data across 2,363 ADNI subjects, achieving 72.7% balanced accuracy on 3-class diagnosis and 93.1% on binary classification (CN vs Dementia).",
      "Missing-Modality Fusion: Designed missing-modality fusion via cross-attention with modality dropout, enabling robust inference when imaging data is incomplete (39.4% DTI coverage); nearly doubled preclinical amyloid detection sensitivity from 29% to 56% between model iterations.",
      "Experimentation Infrastructure: Built end-to-end experimentation infrastructure: two-stage training (CLIP contrastive pre-training → multi-task fine-tuning), modality ablation studies across 7 combinations, and confidence calibration analysis on ~71M parameter models.",
    ],
    tags: ["Python", "PyTorch", "Deep Learning", "CLIP"],
    isLatest: true,
    logo: keckUSC,
  },
  {
    id: "insaito",
    title: "Senior Software Engineer - I",
    company: "Insaito, Inc.",
    date: "May, 2025 - July, 2025",
    description:
      "Building cutting-edge AI agent platforms from scratch, focusing on open-source LLM deployment and integration architecture. Leading the development of comprehensive AI agent builder with extensive third-party app integrations.",
    projects: [
      "AI Agent Builder Platform: Architecting and developing a comprehensive AI agent builder platform from the ground up, enabling users to create sophisticated AI agents with custom workflows and integrations.",
      "Open Source LLM Deployment: Deploying and optimizing open-source large language models including Qwen 3 and Mistral Small 24B 2, ensuring efficient performance and scalability for production environments.",
      "OAuth Integration Architecture: Building robust OAuth functionality for 100+ different applications, enabling seamless authentication and authorization across diverse third-party services and platforms.",
      "MCP Server Development: Creating Model Context Protocol (MCP) servers for integrated applications, making all functions and capabilities available to the AI models for enhanced functionality and user experience.",
      "Full-Stack Development: Handling end-to-end development from backend infrastructure to frontend user interfaces, ensuring cohesive and performant AI agent experiences.",
    ],
    tags: ["TypeScript", "Next.js", "Node.js", "MongoDB"],
    isLatest: false,
    logo: AskPandaAI,
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
      "Cross-functional Collaboration: Worked closely with data science and security teams to implement best practices for data handling and model deployment, ensuring robust and secure AI solutions.",
    ],
    tags: ["Python", "Flask", "Qdrant", "Azure"],
    isLatest: false,
    logo: fullstack,
  },
  {
    id: "iremify",
    title: "Web Developer (Intern)",
    company: "Iremify.com",
    date: "May, 2021 - July, 2021",
    description:
      "Designed and implemented machine learning algorithms for predictive analytics. Collaborated with cross-functional teams to integrate ML solutions into existing products.",
    projects: [
      "Troubleshot and debugged code ensuring compatibility with devices, browsers, and operating systems.",
      "Developed web platform back ends using NodeJS and Flask frameworks. Built APIs and data clients to consume APIs.",
      "Implemented responsive front-end designs using React, showcasing adaptability in learning and applying new technologies.",
    ],
    tags: ["React", "Node.js", "Flask"],
    isLatest: false,
    logo: feynwick,
  },
]

export default function Experience() {
  const { activeSkill } = usePortfolio()
  const [selected, setSelected] = useState<ExperienceItem | null>(null)
  const normalizedSkill = activeSkill?.toLowerCase()

  const openModal = (experience: ExperienceItem) => {
    triggerHaptic()
    setSelected(experience)
  }

  const [featured, ...restExperiences] = experiences
  const featuredHighlighted = normalizedSkill && featured
    ? featured.tags.some((tag) => tag.toLowerCase() === normalizedSkill)
    : false

  return (
    <section id="experience" className="py-16 sm:py-20">
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
              className={`group cursor-pointer rounded-3xl border bg-card/80 p-6 shadow-card transition hover:-translate-y-1 sm:p-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
                featuredHighlighted
                  ? "border-primary/40 ring-1 ring-primary/20"
                  : "border-border ring-1 ring-primary/15"
              }`}
            >
              <div className="flex items-start gap-4 sm:gap-5">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-border bg-background sm:h-16 sm:w-16">
                  <Image
                    src={featured.logo}
                    alt={`${featured.company} logo`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-display text-lg text-foreground sm:text-xl">{featured.title}</h3>
                    {featured.isLatest && (
                      <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-muted-foreground">{featured.company}</p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    {featured.date}
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">{featured.description}</p>

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
                          isTagHighlighted ? "border-primary/40 bg-primary/10 text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {tag}
                      </Badge>
                    )
                  })}
                </div>
                <span className="ml-auto inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary/70 transition group-hover:text-primary">
                  Details
                  <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </motion.div>
          )}

          {restExperiences.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
                    className={`group cursor-pointer rounded-3xl border bg-card/80 p-5 shadow-card transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background ${
                      isHighlighted ? "border-primary/40 ring-1 ring-primary/20" : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-border bg-background">
                        <Image
                          src={item.logo}
                          alt={`${item.company} logo`}
                          fill
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
                      <Calendar className="h-3 w-3 text-primary" />
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
                                isTagHighlighted ? "border-primary/40 bg-primary/10 text-primary" : "text-muted-foreground"
                              }`}
                            >
                              {tag}
                            </Badge>
                          )
                        })}
                      </div>
                      <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary/70 transition group-hover:text-primary">
                        Details
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
          <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto rounded-3xl border-border bg-card/95 top-auto bottom-4 translate-y-0 sm:bottom-auto sm:top-[50%] sm:translate-y-[-50%] sm:rounded-3xl">
            <DialogHeader>
              <div className="flex flex-wrap items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-border bg-background">
                  <Image
                    src={selected.logo}
                    alt={`${selected.company} logo`}
                    fill
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
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  <Briefcase className="h-4 w-4" />
                  Key Contributions
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {selected.projects.map((project) => (
                    <div
                      key={project}
                      className="rounded-2xl border border-border/70 bg-background/70 p-3 text-xs text-muted-foreground"
                    >
                      {project}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </section>
  )
}
