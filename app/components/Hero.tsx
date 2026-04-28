"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowUpRight, Github, Linkedin } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import { smoothScrollToId } from "@/app/utils/smoothScroll"
import SkillsTicker from "./SkillsTicker"

const ShootingStars = dynamic(() => import("./ShootingStars"), { ssr: false })

const ROLES = [
  "Full-Stack Developer",
  "AI/ML Engineer",
  "ML Researcher",
  "Agentic AI Engineer",
]

function RoleBadge() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2800)
    return () => clearInterval(id)
  }, [reduced])

  return (
    <span className="inline-flex items-center gap-2 rounded border border-border bg-transparent px-3 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-foreground sm:px-4 sm:py-2 sm:text-[10px] sm:tracking-[0.18em]">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={ROLES[index]}
          className="whitespace-nowrap"
          initial={reduced ? false : { opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? {} : { opacity: 0, y: -5 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function HeroStats() {
  const items: {
    value: string
    label: string
    sub?: string
  }[] = [
    { value: "2+", label: "Years production experience" },
    { value: "3", label: "AI systems deployed at IIFL" },
    { value: "71M", label: "Parameter Custom Model" },
    {
      value: "LA",
      label: "Los Angeles, CA",
      sub: "Open to remote · hybrid · relocation",
    },
  ]

  return (
    <div className="mt-10 w-full border-t border-border pt-8 sm:mt-14 sm:pt-10 md:mt-16 md:pt-12">
      <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 md:gap-6 lg:gap-10">
        {items.map((item) => (
          <div key={item.value + item.label} className="min-w-0 text-left md:text-center">
            <p className="font-display text-[clamp(1.15rem,3.2vw,2.65rem)] leading-none tracking-[-0.02em] text-foreground">
              {item.value}
            </p>
            <p className="mt-1.5 font-mono text-[8px] font-medium uppercase leading-snug tracking-[0.18em] text-muted-foreground sm:mt-2 sm:text-[10px] sm:tracking-[0.22em]">
              {item.label}
            </p>
            {item.sub ? (
              <p className="mt-1 font-body text-[11px] font-normal leading-snug text-muted-foreground sm:text-xs">
                {item.sub}
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function HeroTitle() {
  const shouldReduce = useReducedMotion()

  const lineClass =
    "block w-full min-w-0 font-display font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-foreground text-[clamp(2.25rem,10.25cqi,9.375rem)]"

  if (shouldReduce) {
    return (
      <h1 className={lineClass} aria-label="Sohail Gidwani">
        <span className="block">Sohail</span>
        <span className="block">Gidwani</span>
      </h1>
    )
  }

  return (
    <h1 className={lineClass} aria-label="Sohail Gidwani">
      <span className="block overflow-visible">
        <motion.span
          className="block"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          Sohail
        </motion.span>
      </span>
      <span className="block overflow-visible">
        <motion.span
          className="block"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          Gidwani
        </motion.span>
      </span>
    </h1>
  )
}

export default function Hero() {
  const [ds] = useState(() => {
    if (typeof window === "undefined") return 1
    return sessionStorage.getItem("hero-seen") ? 0.35 : 1
  })

  useEffect(() => {
    const timeout = setTimeout(() => {
      sessionStorage.setItem("hero-seen", "1")
    }, 2000)
    return () => clearTimeout(timeout)
  }, [])

  const scrollToProjects = () => {
    triggerHaptic()
    smoothScrollToId("projects")
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col pb-0 pt-[calc(var(--nav-h)+1.25rem)]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <ShootingStars />
      </div>

      <div className="container relative z-[1] mx-auto flex flex-1 flex-col items-start justify-center pb-14 pt-6 text-left sm:pb-16 md:items-center md:text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 * ds }}
          className="flex flex-col items-start md:items-center"
        >
          <RoleBadge />
        </motion.div>

        <div className="mt-6 w-full min-w-0 [container-type:inline-size] sm:mt-10 md:mt-10">
          <HeroTitle />
        </div>

        <motion.p
          className="mt-5 max-w-xl text-[14px] font-normal leading-relaxed text-muted-foreground sm:mt-8 sm:text-[15px] md:mx-auto md:mt-10 md:px-1"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 * ds }}
        >
          I build AI systems that actually work in production, not just in notebooks. Full-stack engineering meets applied
          machine learning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45 * ds }}
          className="mt-6 grid w-full max-w-3xl grid-cols-2 gap-2 sm:mt-10 sm:flex sm:flex-wrap sm:justify-center sm:gap-3"
        >
          <motion.button
            type="button"
            onClick={scrollToProjects}
            className="inline-flex min-w-0 max-sm:min-h-9 items-center justify-center gap-1 rounded bg-foreground px-3 py-2 text-xs font-semibold text-background transition hover:opacity-90 sm:min-h-0 sm:gap-2 sm:px-8 sm:py-3.5 sm:text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Projects
            <ArrowDown className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
          </motion.button>
          <motion.a
            href="/documents/Sohail_Gidwani_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            onClick={() => triggerHaptic()}
            aria-label="Download resume (PDF)"
            className="inline-flex min-w-0 max-sm:min-h-9 items-center justify-center gap-1 rounded border border-border bg-transparent px-3 py-2 text-xs font-semibold text-foreground transition hover:border-foreground/40 sm:min-h-0 sm:gap-2 sm:px-8 sm:py-3.5 sm:text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Resume
            <ArrowUpRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
          </motion.a>
          <div className="col-span-1 flex w-full min-w-0 justify-start gap-2 max-sm:row-start-2 sm:contents">
            <motion.a
              href="https://github.com/SohailGidwani"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="inline-flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1 rounded border border-border bg-transparent px-2 py-2 text-xs font-semibold text-foreground transition hover:border-foreground/40 sm:min-h-0 sm:flex-initial sm:gap-1.5 sm:px-8 sm:py-3.5 sm:text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Github className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">GitHub</span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
            </motion.a>
            <motion.a
              href="https://linkedin.com/in/sohail-gidwani"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="inline-flex min-h-9 min-w-0 flex-1 items-center justify-center gap-1 rounded border border-border bg-transparent px-2 py-2 text-xs font-semibold text-foreground transition hover:border-foreground/40 sm:min-h-0 sm:flex-initial sm:gap-1.5 sm:px-8 sm:py-3.5 sm:text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Linkedin className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">LinkedIn</span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" aria-hidden />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 * ds }}
          className="flex w-full min-w-0 flex-col items-stretch md:items-center"
        >
          <HeroStats />
        </motion.div>
      </div>

      <div className="relative z-[1] mt-auto w-full min-w-0 shrink-0">
        <SkillsTicker />
      </div>
    </section>
  )
}
