"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import Image from "next/image"
import { triggerHaptic } from "./ui/haptics"
import { useSkillHighlight } from "./SkillHighlightProvider"

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

export default function Skills() {
  const { setActiveSkill } = useSkillHighlight()
  const [activeId, setActiveId] = useState(playbooks[0].id)
  const reduceMotion = useReducedMotion()

  const active = playbooks.find((p) => p.id === activeId) ?? playbooks[0]

  const selectPlaybook = (id: string) => {
    triggerHaptic()
    setActiveId(id)
  }

  return (
    <section id="skills" className="section-y" onMouseLeave={() => setActiveSkill(null)}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="space-y-3"
        >
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Skills</p>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">
            Organized by what you&apos;d hire me to do.
          </h2>
        </motion.div>

        {/* Playbook tabs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
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
                className={`rounded border px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] transition sm:px-4 ${
                  isActive
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-border bg-card/60 text-muted-foreground hover:border-accent/40 hover:text-foreground"
                }`}
              >
                {pb.label}
              </button>
            )
          })}
        </motion.div>

        {/* Active playbook */}
        <div className="mt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              id={`playbook-panel-${active.id}`}
              role="tabpanel"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
                {active.steps.map((step, i) => (
                  <motion.li
                    key={`${active.id}-${step.tool}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.05 + i * 0.05 }}
                    onMouseEnter={() => setActiveSkill(step.tool)}
                    onMouseLeave={() => setActiveSkill(null)}
                    className="group flex items-center gap-3 rounded border border-border bg-card/80 p-3 transition hover:border-accent/40 sm:p-4"
                  >
                    <span className="font-mono text-[10px] tracking-[0.2em] text-accent">
                      {String(i + 1).padStart(2, "0")}
                    </span>
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
                    <span className="min-w-0">
                      <span className="block truncate font-display text-sm font-bold uppercase tracking-tight text-foreground">
                        {step.tool}
                      </span>
                      <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
                        {step.role}
                      </span>
                    </span>
                  </motion.li>
                ))}
              </ol>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Full index */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 border-t border-border pt-6"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/60">
            Full index
          </p>
          <div className="mt-4 space-y-2.5">
            {fullIndex.map((row) => (
              <p key={row.label} className="font-mono text-[10px] leading-relaxed sm:text-[11px]">
                <span className="uppercase tracking-[0.2em] text-accent">{row.label}</span>
                <span className="text-muted-foreground/40"> / </span>
                <span className="uppercase tracking-[0.08em] text-muted-foreground">{row.items}</span>
              </p>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
