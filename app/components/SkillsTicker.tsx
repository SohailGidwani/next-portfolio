"use client"

import { useReducedMotion } from "framer-motion"

const STACK = [
  "Python",
  "TypeScript",
  "Next.js",
  "React",
  "RAG",
  "LLMs",
  "pgvector",
  "PostgreSQL",
  "Flask",
  "PyTorch",
  "Docker",
  "Azure OpenAI",
  "Qdrant",
  "TensorFlow",
  "Tailwind CSS",
  "Framer Motion",
]

export default function SkillsTicker() {
  const reduce = useReducedMotion()
  const loop = [...STACK, ...STACK]

  return (
    <div
      className="border-y border-border bg-secondary/60"
      role="presentation"
      aria-hidden="true"
    >
      <div className="overflow-hidden py-2.5 sm:py-3">
        <div
          className={
            reduce
              ? "flex flex-wrap justify-center gap-x-10 gap-y-2 px-6"
              : "flex w-max animate-marquee gap-10 pr-10"
          }
        >
          {loop.map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
