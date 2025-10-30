"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, PanInfo } from "framer-motion"
import { Briefcase, Calendar, ChevronRight, X } from "lucide-react"
import Image, { StaticImageData } from "next/image"
import { useTheme } from "next-themes"
import ReactDOM from "react-dom"
import ScrollAnimation from "./ScrollAnimation"
import { triggerHaptic } from "./ui/haptics"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import AskPandaAI from "@/public/images/Insaito.png"
import fullstack from "@/public/images/iifl.png"
import feynwick from "@/public/images/iremify.png"
import keckUSC from "@/public/images/keck_USC.png"

interface ExperienceProps {
  setActiveSection: (section: string) => void
}

interface ExperienceItem {
  title: string
  company: string
  date: string
  description: string
  projects: string[]
  isLatest?: boolean
  logo: StaticImageData
}

function BottomSheetModal({
  open,
  onClose,
  experience,
}: {
  open: boolean
  onClose: () => void
  experience: ExperienceItem | null
}) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKey)
    window.history.pushState({ modal: true }, "")

    const handlePopState = () => {
      if (open) {
        onClose()
      }
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("keydown", handleKey)
      window.removeEventListener("popstate", handlePopState)
      if (open) {
        window.history.back()
      }
    }
  }, [open, onClose])

  const dragThreshold = 120

  function handleDragEnd(event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    if (info.offset.y > dragThreshold) {
      if (typeof window !== "undefined" && "vibrate" in window.navigator) {
        window.navigator.vibrate(15)
      }
      onClose()
    }
  }

  if (!open || !experience) {
    return null
  }

  const gradient = "from-blue-500 to-sky-500"

  const modalContent = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32, bounce: 0.22 }}
        className="relative mx-auto w-full max-w-lg touch-pan-y rounded-t-3xl bg-white px-5 pb-6 pt-3 shadow-2xl dark:bg-slate-950"
        style={{
          minHeight: "60vh",
          maxHeight: "85vh",
          overflowY: "auto",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-3 mt-1 h-1.5 w-16 rounded-full bg-slate-300 transition-colors dark:bg-slate-600" />
        <button
          onClick={onClose}
          className="absolute right-5 top-4 rounded-full border border-slate-200 bg-white p-1 text-slate-500 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          aria-label="Close"
        >
          <X size={18} />
        </button>
        <div className={`mb-4 h-1 rounded-full bg-gradient-to-r ${gradient}`} />
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300">{experience.title}</h2>
          <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-800">
              <Image
                src={experience.logo}
                alt={`${experience.company} logo`}
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <span className="font-medium text-slate-900 dark:text-slate-200">{experience.company}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Calendar size={14} />
            <span>{experience.date}</span>
            {experience.isLatest && (
              <motion.span
                className="inline-flex items-center gap-1 rounded-full border border-green-200/70 px-2 py-0.5 text-[11px] font-semibold text-green-700 dark:border-green-800 dark:text-green-300"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <motion.span
                  className="h-1.5 w-1.5 rounded-full bg-green-500"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
                ACTIVE
              </motion.span>
            )}
          </div>
        </div>
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl bg-blue-50/80 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:bg-blue-900/20 dark:text-slate-300">
            {experience.description}
          </div>
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-200">
              <Briefcase size={16} className="text-blue-600 dark:text-blue-400" />
              Key Points
            </h4>
            {experience.projects.map((project, index) => (
              <div
                key={`${experience.company}-sheet-${index}`}
                className="rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm leading-relaxed text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
              >
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100/80 text-[11px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {index + 1}
                  </span>
                  Highlight
                </div>
                {project}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )

  if (typeof window !== "undefined") {
    return ReactDOM.createPortal(modalContent, document.body)
  }

  return null
}

export default function Experience({ setActiveSection }: ExperienceProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [selectedExperience, setSelectedExperience] = useState<ExperienceItem | null>(null)
  const [activeExperience, setActiveExperience] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, systemTheme } = useTheme()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10)
          setActiveSection("experience")
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px",
      },
    )

    const ref = sectionRef.current
    if (ref) {
      observer.observe(ref)
    }

    return () => {
      if (ref) {
        observer.unobserve(ref)
      }
    }
  }, [setActiveSection])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (!isMobile && activeExperience < 0) {
      setActiveExperience(0)
    }
  }, [isMobile, activeExperience])

  const experiences: ExperienceItem[] = [
    {
      title: "Student Worker - Research Assistant",
      company: "Keck School of Medicine of USC",
      date: "Oct, 2023 - Present",
      description:
        "Supporting research that bridges visual and textual information for healthcare by preparing multimodal datasets, training vision-language models, and evaluating their clinical alignment.",
      projects: [
        "VLM Multimodal Tasks: Curating and preprocessing medical imaging and textual datasets to fine-tune vision-language models that connect visual findings with clinical narratives.",
        "Model Training & Evaluation: Running training experiments, monitoring performance metrics, and building evaluation loops that highlight model strengths and weaknesses for healthcare use cases.",
        "Research Collaboration: Partnering with clinicians and researchers to translate experimental insights into deployable prototypes, documentation, and future study proposals.",
      ],
      isLatest: true,
      logo: keckUSC,
    },
    {
      title: "Senior Software Engineer - I ",
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
      isLatest: false,
      logo: AskPandaAI,
    },
    {
      title: "Full-Stack/AI Developer",
      company: "IIFL Finance Ltd",
      date: "June, 2023 - May, 2025",
      description:
        "Led AI initiatives and developed cutting-edge machine learning models for various client projects. Mentored junior developers and contributed to the company's AI research efforts.",
      projects: [
        "Custom Data Chatbots (RAG) : Built an internal employee support chatbot using NLP, Python, and Flask. Integrated with Qdrant vector database, Azure OpenAI service, and Zoho ticketing system. This AI-powered solution significantly reduced the number of support tickets raised by employees, streamlining internal processes. (Certificate of Achievement)",
        "Gold Loan Image Audit App: Engineered AI-powered application using models like GroundingDino, Swin-Transformer, enhancing fraud detection and reducing potential loan fraud by 15%.",
        "Cross-functional Collaboration: Worked closely with data science and security teams to implement best practices for data handling and model deployment, ensuring robust and secure AI solutions.",
      ],
      isLatest: false,
      logo: fullstack,
    },
    {
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
      isLatest: false,
      logo: feynwick,
    },
  ]

  const currentTheme = theme === "system" ? systemTheme : theme
  const isDark = mounted && currentTheme === "dark"
  const brandGradient = "from-blue-500 to-sky-500"
  const safeActiveIndex = activeExperience < 0 || activeExperience >= experiences.length ? 0 : activeExperience
  const activeExp = experiences[safeActiveIndex]

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="bg-white py-16 transition-colors duration-300 dark:bg-slate-950"
    >
      <div className="container mx-auto px-4">
        <ScrollAnimation variant="fadeUp" duration={0.6}>
          <div className="mb-12 text-center">
            <h2
              className={`mb-4 text-3xl font-bold md:text-4xl ${isDark ? "text-blue-400" : "text-blue-900"}`}
            >
              Professional Experience
            </h2>
          </div>
        </ScrollAnimation>

        {!mounted && (
          <div className="mx-auto max-w-5xl rounded-2xl border border-slate-200/70 bg-white/70 p-10 text-center text-sm text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-400">
            Loading experience...
          </div>
        )}

        {mounted && !isMobile && activeExp && (
          <ScrollAnimation variant="fadeUp" delay={0.2}>
            <div className="mx-auto hidden max-w-6xl gap-8 md:grid lg:grid-cols-[280px,1fr]">
              <motion.aside
                className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                viewport={{ once: true }}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Roles</p>
                <div className="mt-4 max-h-[520px] space-y-3 overflow-y-auto pr-1">
                  {experiences.map((experience, index) => {
                    const isActive = index === activeExperience
                    const gradient = brandGradient

                    return (
                      <motion.button
                        key={experience.company}
                        onClick={() => {
                          triggerHaptic()
                          setActiveExperience(index)
                        }}
                        className={`relative w-full rounded-2xl border px-4 py-4 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 ${
                          isActive
                            ? "border-blue-200 bg-blue-50/70 shadow-inner dark:border-blue-800/70 dark:bg-blue-900/20"
                            : "border-transparent hover:border-blue-200/70 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isActive && (
                          <span className={`absolute inset-y-3 left-0 w-1 rounded-full bg-gradient-to-b ${gradient}`} />
                        )}
                        <div className="flex items-start gap-3">
                          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-800">
                            <Image
                              src={experience.logo}
                              alt={`${experience.company} logo`}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                {experience.company}
                              </span>
                              {experience.isLatest && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                  Active
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{experience.date}</p>
                            <p className="mt-2 text-sm leading-snug text-slate-600 dark:text-slate-300">
                              {experience.title.trim()}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.aside>

              <AnimatePresence mode="wait">
                <motion.article
                  key={activeExperience}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className={`h-1 bg-gradient-to-r ${brandGradient}`} />
                  <div className="space-y-8 p-8 lg:p-10">
                    <div className="flex flex-wrap items-start justify-between gap-6">
                      <div className="space-y-4">
                        <motion.h3
                          className="text-2xl font-bold text-blue-700 dark:text-blue-300"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                        >
                          {activeExp.title}
                        </motion.h3>

                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <div className="relative h-8 w-8 overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-800">
                            <Image
                              src={activeExp.logo}
                              alt={`${activeExp.company} logo`}
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          </div>
                          <span className="font-medium text-slate-900 dark:text-slate-200">{activeExp.company}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                          <Calendar size={16} />
                          <span>{activeExp.date}</span>
                          {activeExp.isLatest && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-green-200/70 px-2 py-0.5 text-[11px] font-semibold text-green-700 dark:border-green-800 dark:text-green-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                              ACTIVE
                            </span>
                          )}
                        </div>
                      </div>

                      <motion.button
                        onClick={() => {
                          triggerHaptic()
                          setSelectedExperience(activeExp)
                        }}
                        className="inline-flex items-center gap-1 rounded-xl border border-blue-200/60 bg-blue-50/70 px-4 py-2 text-sm font-semibold text-blue-700 transition dark:border-blue-800/70 dark:bg-blue-900/30 dark:text-blue-300"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        More info
                        <ChevronRight size={16} />
                      </motion.button>
                    </div>

                    <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                      {activeExp.description}
                    </p>

                    <div className="space-y-4">
                      <h4 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-200">
                        <Briefcase size={18} className="text-blue-600 dark:text-blue-400" />
                        Highlights
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {activeExp.projects.slice(0, 4).map((project, index) => (
                          <motion.div
                            key={`${activeExp.company}-highlight-${index}`}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="rounded-2xl border border-slate-200/70 bg-slate-50/60 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
                          >
                            {project}
                          </motion.div>
                        ))}
                      </div>
                      {activeExp.projects.length > 4 && (
                        <button
                          onClick={() => {
                            triggerHaptic()
                            setSelectedExperience(activeExp)
                          }}
                          className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-300"
                        >
                          View all {activeExp.projects.length} points
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              </AnimatePresence>
            </div>
          </ScrollAnimation>
        )}

        {mounted && isMobile && (
          <div className="space-y-5 md:hidden">
            {experiences.map((experience, index) => {
              const isOpen = index === activeExperience
              const gradient = brandGradient

              return (
                <motion.div
                  key={experience.company}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  // NEW: Animate expanded state with shadow
                  animate={isOpen ? { boxShadow: '0 8px 24px 0 rgba(23, 37, 84, 0.14)', scale: 1.025 } : { boxShadow: '0 1px 3px 0 rgba(17, 24, 39, 0.06)', scale: 1 }}
                  className={`overflow-hidden rounded-3xl border border-slate-200/70 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 mb-4 ${isOpen ? 'shadow-2xl ring-2 ring-blue-100 dark:ring-blue-900/30' : 'shadow-lg'} `}
                >
                  <button
                    type="button"
                    onClick={() => {
                      triggerHaptic()
                      setActiveExperience((prev) => (prev === index ? -1 : index))
                    }}
                    className="flex w-full items-center justify-between gap-4 px-5 py-6 md:py-5 md:px-5 text-left"
                    style={{ minHeight: 64 }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl bg-white shadow-md dark:bg-slate-800">
                        <Image
                          src={experience.logo}
                          alt={`${experience.company} logo`}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                          {experience.title.trim()}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{experience.company}</p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Calendar size={14} />
                          <span>{experience.date}</span>
                        </div>
                      </div>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                      className="rounded-full border border-slate-200 p-1 text-slate-500 dark:border-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 shadow"
                    >
                      <ChevronRight size={16} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={`${experience.company}-content`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: 'easeInOut' }}
                        className="border-t border-slate-200 px-6 pb-6 pt-2 dark:border-slate-800"
                      >
                        <div className={`my-4 h-1 rounded-full bg-gradient-to-r ${gradient}`} />
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 mb-3">
                          {experience.description}
                        </p>
                        <div className="mt-1 space-y-3">
                          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-200">
                            <Briefcase size={16} className="text-blue-600 dark:text-blue-400" />
                            Highlights
                          </h4>
                          {experience.projects.slice(0, 2).map((project, projectIndex) => (
                            <div
                              key={`${experience.company}-project-${projectIndex}`}
                              className="rounded-2xl border border-slate-200/70 bg-slate-50/60 px-4 py-3 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300"
                            >
                              {project}
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => {
                            triggerHaptic()
                            setSelectedExperience(experience)
                          }}
                          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline dark:text-blue-300"
                        >
                          View full summary
                          <ChevronRight size={14} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {!isMobile && (
        <Dialog open={!!selectedExperience} onOpenChange={() => setSelectedExperience(null)}>
          <DialogContent className="max-h-[85vh] w-full max-w-4xl overflow-hidden p-0">
            {selectedExperience && <div className={`h-1 bg-gradient-to-r ${brandGradient}`} />}
            <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {selectedExperience?.title}
                </DialogTitle>
                <DialogDescription>
                  <div className="flex flex-col gap-3 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                      <div className="relative h-8 w-8 overflow-hidden rounded-xl bg-white shadow-sm dark:bg-slate-800">
                        {selectedExperience?.logo && (
                          <Image
                            src={selectedExperience.logo}
                            alt={`${selectedExperience.company} logo`}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        )}
                      </div>
                      <span className="font-medium text-slate-900 dark:text-slate-200">
                        {selectedExperience?.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>{selectedExperience?.date}</span>
                      {selectedExperience?.isLatest && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-green-200/70 px-2 py-0.5 text-[11px] font-semibold text-green-700 dark:border-green-800 dark:text-green-300">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                          ACTIVE
                        </span>
                      )}
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 space-y-6 text-slate-700 dark:text-slate-300">
                <div className="rounded-2xl bg-blue-50/80 px-5 py-4 text-sm leading-relaxed dark:bg-blue-900/20">
                  {selectedExperience?.description}
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-200">
                    <Briefcase size={18} className="text-blue-600 dark:text-blue-400" />
                    Key Points
                    {selectedExperience && (
                      <span className="text-sm font-medium text-slate-400 dark:text-slate-500">
                        ({selectedExperience.projects.length})
                      </span>
                    )}
                  </h4>
                  <div className="mt-4 space-y-3">
                    {selectedExperience?.projects.map((project, index) => (
                      <motion.div
                        key={`${selectedExperience.company}-modal-project-${index}`}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="rounded-2xl border border-slate-200/70 bg-white px-4 py-4 text-sm leading-relaxed text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-300"
                      >
                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100/80 text-[11px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                            {index + 1}
                          </span>
                          Highlight
                        </div>
                        {project}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {isMobile && (
        <AnimatePresence>
          <BottomSheetModal
            open={!!selectedExperience}
            onClose={() => setSelectedExperience(null)}
            experience={selectedExperience}
          />
        </AnimatePresence>
      )}
    </section>
  )
}
