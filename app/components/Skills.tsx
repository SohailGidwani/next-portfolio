"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ChevronDown } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import SectionHeading from "./SectionHeading"
import { SKILL_EVIDENCE, type UsedIn } from "@/app/data/skillEvidence"

interface PlaybookStep {
  tool: string
  role: string
  logo?: string
  /** For dark logos that vanish on the dark theme */
  invertInDark?: boolean
}

interface Playbook {
  id: string
  label: string
  steps: PlaybookStep[]
}

const playbooks: Playbook[] = [
  {
    id: "rag",
    label: "RAG System",
    steps: [
      { tool: "Python", role: "language", logo: "/skill-icons/python.svg" },
      { tool: "HuggingFace", role: "embeddings", logo: "/skill-icons/huggingface.svg" },
      { tool: "Qdrant", role: "retrieval", logo: "/skill-icons/qdrant.png" },
      { tool: "Azure", role: "llm service", logo: "/skill-icons/azure.svg" },
      { tool: "Flask", role: "api", logo: "/skill-icons/flask.svg", invertInDark: true },
      { tool: "SQLAlchemy", role: "orm", logo: "/skill-icons/sqlalchemy.svg" },
      { tool: "Redis", role: "caching", logo: "/skill-icons/redis.svg" },
      { tool: "Docker", role: "ship", logo: "/skill-icons/docker.svg" },
    ],
  },
  {
    id: "model",
    label: "Ship a Model",
    steps: [
      { tool: "Pandas", role: "data prep", logo: "/skill-icons/pandas.svg" },
      { tool: "PyTorch", role: "training", logo: "/skill-icons/pytorch.svg" },
      { tool: "HuggingFace", role: "transformers", logo: "/skill-icons/huggingface.svg" },
      { tool: "OpenCV", role: "vision", logo: "/skill-icons/opencv.svg" },
      { tool: "Scikit-learn", role: "evaluation", logo: "/skill-icons/scikit-learn.svg" },
      { tool: "FastAPI", role: "serving", logo: "/skill-icons/fastapi.svg" },
      { tool: "AWS", role: "deploy", logo: "/skill-icons/aws.svg" },
    ],
  },
  {
    id: "fullstack",
    label: "Full-Stack Product",
    steps: [
      { tool: "TypeScript", role: "language", logo: "/skill-icons/typescript.svg" },
      { tool: "Next.js", role: "framework", logo: "/skill-icons/nextjs.svg", invertInDark: true },
      { tool: "React", role: "ui", logo: "/skill-icons/react.svg" },
      { tool: "Tailwind CSS", role: "styling", logo: "/skill-icons/tailwindcss.svg" },
      { tool: "Node.js", role: "runtime", logo: "/skill-icons/nodejs.svg" },
      { tool: "Prisma", role: "orm", logo: "/skill-icons/prisma.svg", invertInDark: true },
      { tool: "PostgreSQL", role: "data", logo: "/skill-icons/postgresql.svg" },
      { tool: "CloudFlare", role: "edge", logo: "/skill-icons/cloudflare.png" },
    ],
  },
  {
    id: "agents",
    label: "Agentic AI",
    steps: [
      { tool: "Python", role: "language", logo: "/skill-icons/python.svg" },
      { tool: "Claude Code", role: "agentic coding", logo: "/skill-icons/claude.svg" },
      { tool: "MCP", role: "tool protocol", logo: "/skill-icons/mcp.svg", invertInDark: true },
      { tool: "Ollama", role: "local llms", logo: "/skill-icons/ollama.svg", invertInDark: true },
      { tool: "FastAPI", role: "api", logo: "/skill-icons/fastapi.svg" },
      { tool: "N8N", role: "automation", logo: "/skill-icons/n8n.svg" },
      { tool: "Google Cloud", role: "infra", logo: "/skill-icons/googlecloud.svg" },
      { tool: "Docker", role: "ship", logo: "/skill-icons/docker.svg" },
    ],
  },
]

// Compact index of everything else, grouped as before.
const fullIndex: { label: string; items: string }[] = [
  {
    label: "ML / AI",
    items:
      "PyTorch · TensorFlow · Scikit-learn · Keras · OpenCV · NLTK · HuggingFace · Ollama · spaCy · Pandas · NumPy · Matplotlib · Seaborn · MCP · LLMOps",
  },
  { label: "Languages", items: "Python · JavaScript · TypeScript · Java · C++ · SQL" },
  {
    label: "Web",
    items:
      "React · Node.js · Express · Next.js · Django · Flask · Hono · FastAPI · Tailwind CSS · WebRTC · HTML5 · CSS3",
  },
  {
    label: "Databases",
    items: "PostgreSQL · MongoDB · Redis · Elasticsearch · MySQL · Qdrant · Oracle · Prisma · SQLAlchemy",
  },
  { label: "Cloud", items: "AWS · Google Cloud · Azure · Heroku · CloudFlare" },
  {
    label: "Tools",
    items:
      "Git · Claude Code · N8N · Docker · Kubernetes · CI/CD · Agile · RESTful APIs · Linux · Bitbucket · TFS · Serverless",
  },
]

/** The card's face: a button when it has places to show, a plain block when not. */
function Card({ as, children, ...rest }: { as: "button" | "div"; children: React.ReactNode } & Record<string, unknown>) {
  const Tag = as
  return <Tag {...rest}>{children}</Tag>
}

const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches

/** One place a tool was used: a page to open, or a role card in Experience. */
function Place({ place, onGo }: { place: UsedIn; onGo: () => void }) {
  const text = (
    <>
      <span className="font-medium text-foreground transition-colors group-hover/place:text-accent">{place.label}</span>
      {place.detail ? <span className="text-muted-foreground"> · {place.detail}</span> : null}
    </>
  )
  const row = "group/place flex w-full items-baseline justify-between gap-3 rounded-[3px] py-1 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50"
  const arrow = <ArrowUpRight className="h-3.5 w-3.5 shrink-0 self-center text-muted-foreground transition-colors group-hover/place:text-accent" aria-hidden />
  if (place.href) {
    return (
      <Link href={place.href} onClick={onGo} className={row}>
        <span className="min-w-0">{text}</span>
        {arrow}
      </Link>
    )
  }
  if (place.experience) {
    const id = place.experience
    return (
      <button
        type="button"
        className={row}
        onClick={() => {
          onGo()
          window.dispatchEvent(new CustomEvent("portfolio:open-experience", { detail: { id } }))
        }}
      >
        <span className="min-w-0">{text}</span>
        {arrow}
      </button>
    )
  }
  return <p className="py-1 text-sm">{text}</p>
}

export default function Skills() {
  const [activeId, setActiveId] = useState(playbooks[0].id)
  // The tool whose "used in" popover is open. One at a time.
  const [openTool, setOpenTool] = useState<string | null>(null)
  const hoverTimer = useRef<number | undefined>(undefined)
  const reduceMotion = useReducedMotion()

  const active = playbooks.find((p) => p.id === activeId) ?? playbooks[0]

  const selectPlaybook = (id: string) => {
    triggerHaptic()
    setOpenTool(null)
    setActiveId(id)
  }

  // Escape or a press anywhere outside the open card closes the popover.
  useEffect(() => {
    if (!openTool) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenTool(null)
    }
    const onPress = (event: PointerEvent) => {
      const card = document.querySelector(`[data-skill-card="${CSS.escape(openTool)}"]`)
      if (card && !card.contains(event.target as Node)) setOpenTool(null)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPress)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPress)
    }
  }, [openTool])
  useEffect(() => () => window.clearTimeout(hoverTimer.current), [])

  // With a mouse, resting on a card opens it and leaving closes it, each after
  // a beat so passing over the grid does not flicker. Touch uses the tap.
  const hoverOpen = (tool: string) => {
    if (!canHover()) return
    window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => setOpenTool(tool), 180)
  }
  const hoverClose = () => {
    if (!canHover()) return
    window.clearTimeout(hoverTimer.current)
    hoverTimer.current = window.setTimeout(() => setOpenTool(null), 160)
  }

  return (
    <section id="skills" className="section-y">
      <div className="container mx-auto px-4">
        <SectionHeading>Skills</SectionHeading>

        {/* Playbook tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          viewport={{ once: true }}
          role="tablist"
          aria-label="Playbooks"
          className="mt-10 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3"
        >
          {playbooks.map((pb) => {
            const isActive = pb.id === activeId
            return (
              <button
                key={pb.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`playbook-panel-${pb.id}`}
                onClick={() => selectPlaybook(pb.id)}
                className={`relative rounded border px-3 py-2.5 font-mono text-xs uppercase tracking-[0.18em] transition sm:px-4 ${
                  isActive
                    ? "border-transparent text-accent"
                    : "border-border bg-card/60 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                }`}
              >
                {isActive &&
                  (reduceMotion ? (
                    <span aria-hidden className="absolute inset-0 rounded border border-accent bg-accent/10" />
                  ) : (
                    <motion.span
                      aria-hidden
                      layoutId="playbook-tab-indicator"
                      transition={{ type: "spring", bounce: 0.18, duration: 0.5 }}
                      className="absolute inset-0 rounded border border-accent bg-accent/10"
                    />
                  ))}
                <span className="relative z-10">{pb.label}</span>
              </button>
            )
          })}
        </motion.div>

        {/* Active playbook — cards keyed by tool so shared tools morph between playbooks */}
        <div id={`playbook-panel-${active.id}`} role="tabpanel" className="mt-8">
          <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            <AnimatePresence initial={false} mode="popLayout">
                {active.steps.map((step, i) => {
                  const places = SKILL_EVIDENCE[step.tool]
                  const isOpen = openTool === step.tool
                  const slug = step.tool.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                  return (
                  <motion.li
                    key={step.tool}
                    layout={!reduceMotion}
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      transition: { duration: 0.3, delay: reduceMotion ? 0 : i * 0.04 },
                    }}
                    exit={reduceMotion ? undefined : { opacity: 0, scale: 0.92, transition: { duration: 0.18 } }}
                    transition={{ layout: { duration: 0.45, ease: [0.32, 0.72, 0, 1] } }}
                    onMouseEnter={places ? () => hoverOpen(step.tool) : undefined}
                    onMouseLeave={places ? hoverClose : undefined}
                    data-skill-card={step.tool}
                    // The open card rises above its neighbours, so its popover
                    // is not painted under the next row.
                    style={{ zIndex: isOpen ? 30 : undefined }}
                    className={`group relative rounded border bg-card/80 transition-colors ${
                      isOpen ? "border-accent/50" : "border-border hover:border-accent/40"
                    }`}
                  >
                    <Card
                      as={places ? "button" : "div"}
                      {...(places
                        ? {
                            type: "button",
                            "aria-expanded": isOpen,
                            "aria-controls": `used-in-${slug}`,
                            onClick: () => {
                              window.clearTimeout(hoverTimer.current)
                              triggerHaptic()
                              setOpenTool(isOpen ? null : step.tool)
                            },
                          }
                        : {})}
                      className="flex w-full items-center gap-3 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 sm:p-4"
                    >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                      {step.logo ? (
                        <Image
                          src={step.logo}
                          alt=""
                          width={22}
                          height={22}
                          className={`h-[22px] w-[22px] object-contain ${
                            step.invertInDark ? "dark:invert" : ""
                          }`}
                        />
                      ) : (
                        <span aria-hidden className="h-2 w-2 bg-accent" />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-base font-bold tracking-tight text-foreground">
                        {step.tool}
                      </span>
                      <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        {step.role}
                      </span>
                    </span>
                    {places ? (
                      <ChevronDown
                        aria-hidden
                        className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-[var(--ease-out-soft)] ${isOpen ? "rotate-180 text-accent" : ""}`}
                      />
                    ) : null}
                    </Card>

                    {/* Where this tool was used: a few places, each a link. */}
                    <AnimatePresence>
                      {isOpen && places ? (
                        <motion.div
                          id={`used-in-${slug}`}
                          role="region"
                          aria-label={`Where ${step.tool} was used`}
                          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(-4px) scale(0.98)" }}
                          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px) scale(1)" }}
                          exit={{ opacity: 0, transition: { duration: 0.1 } }}
                          transition={{ duration: 0.16, ease: [0.25, 1, 0.5, 1] }}
                          className="absolute inset-x-0 top-full mt-1.5 origin-top rounded border border-border bg-background p-3 shadow-[0_14px_36px_-16px_rgba(10,12,20,0.45)] sm:px-4"
                        >
                          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Used in</p>
                          <div className="mt-1">
                            {places.map((place) => (
                              <Place key={place.label} place={place} onGo={() => setOpenTool(null)} />
                            ))}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.li>
                  )
                })}
            </AnimatePresence>
          </ol>
        </div>

        {/* Full index */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 border-t border-border pt-6"
        >
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Full index
          </p>
          <div className="mt-4 space-y-2.5">
            {fullIndex.map((row) => (
              <p key={row.label} className="font-mono text-[11px] leading-relaxed sm:text-xs">
                <span className="uppercase tracking-[0.2em] text-accent">{row.label}</span>
                <span className="text-muted-foreground"> / </span>
                {/* Each item carries its trailing separator and cannot break
                    inside, so lines end on "·" and never start with one. */}
                <span className="uppercase tracking-[0.08em] text-muted-foreground">
                  {row.items.split(" · ").map((item, i, all) => (
                    <span key={item}>
                      <span className="whitespace-nowrap">
                        {item}
                        {i < all.length - 1 ? " ·" : ""}
                      </span>
                      {i < all.length - 1 ? " " : ""}
                    </span>
                  ))}
                </span>
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
