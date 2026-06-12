"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowUpRight, Github, Linkedin } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import { smoothScrollToId } from "@/app/utils/smoothScroll"
import AnimatedCounter from "./AnimatedCounter"
import { useMagnetic } from "./ui/useMagnetic"

const ShootingStars = dynamic(() => import("./ShootingStars"), { ssr: false })

function RoleBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded border border-border bg-transparent px-3 py-1.5 font-mono text-[9px] font-medium uppercase tracking-[0.2em] text-foreground sm:px-4 sm:py-2 sm:text-[10px] sm:tracking-[0.18em]">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
      <span className="whitespace-nowrap">Agentic AI/ML Engineer</span>
    </span>
  )
}

function HeroStats() {
  const items: {
    value?: number
    suffix?: string
    text?: string
    label: string
  }[] = [
    { value: 2, suffix: "+", label: "Years production experience" },
    { value: 3, label: "AI systems deployed at IIFL" },
    { value: 70, suffix: "M", label: "Parameter Custom Model" },
    { text: "LA", label: "Currently based" },
  ]

  return (
    <div className="mt-10 w-full border-t border-border pt-8 sm:mt-14 sm:pt-10 md:mt-16 md:pt-12">
      <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 md:gap-6 lg:gap-10">
        {items.map((item) => (
          <div key={item.label} className="min-w-0 text-left md:text-center">
            <p className="font-display text-[clamp(1.15rem,3.2vw,2.65rem)] leading-none tracking-[-0.02em] text-foreground">
              {item.value !== undefined ? (
                <AnimatedCounter value={item.value} suffix={item.suffix ?? ""} duration={1100} />
              ) : (
                item.text
              )}
            </p>
            <p className="mt-1.5 font-mono text-[8px] font-medium uppercase leading-snug tracking-[0.18em] text-muted-foreground sm:mt-2 sm:text-[10px] sm:tracking-[0.22em]">
              {item.label}
            </p>
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
      <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
        <motion.span
          className="block"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Sohail
        </motion.span>
      </span>
      <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
        <motion.span
          className="block"
          initial={{ y: "110%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.7, delay: 0.09, ease: [0.22, 1, 0.36, 1] }}
        >
          Gidwani
        </motion.span>
      </span>
    </h1>
  )
}

export default function Hero() {
  const magProjects = useMagnetic<HTMLButtonElement>()
  const magResume = useMagnetic<HTMLAnchorElement>()
  const magGithub = useMagnetic<HTMLAnchorElement>()
  const magLinkedin = useMagnetic<HTMLAnchorElement>()

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
      className="relative min-h-[100svh] border-b border-border pt-[calc(var(--nav-h)+1.25rem)]"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <ShootingStars />
      </div>

      <div className="container relative z-[1] mx-auto flex min-h-[calc(100svh-var(--nav-h)-1.25rem)] flex-col items-start justify-center pb-16 pt-6 text-left sm:pb-20 md:items-center md:text-center">
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
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4 * ds }}
          className="mt-4 flex items-center justify-start gap-2 sm:mt-5 md:justify-center"
        >
          <span aria-hidden className="relative flex h-1.5 w-1.5 shrink-0">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/70" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground sm:text-[11px] sm:tracking-[0.2em]">
            Open to work · Remote · Hybrid · Relocation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45 * ds }}
          className="mt-6 grid w-full max-w-3xl grid-cols-2 gap-2 sm:mt-10 sm:flex sm:flex-wrap sm:justify-center sm:gap-3"
        >
          <motion.button
            type="button"
            onClick={scrollToProjects}
            ref={magProjects.ref}
            style={{ x: magProjects.x, y: magProjects.y }}
            onPointerMove={magProjects.onPointerMove}
            onPointerLeave={magProjects.onPointerLeave}
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
            ref={magResume.ref}
            style={{ x: magResume.x, y: magResume.y }}
            onPointerMove={magResume.onPointerMove}
            onPointerLeave={magResume.onPointerLeave}
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
              ref={magGithub.ref}
              style={{ x: magGithub.x, y: magGithub.y }}
              onPointerMove={magGithub.onPointerMove}
              onPointerLeave={magGithub.onPointerLeave}
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
              ref={magLinkedin.ref}
              style={{ x: magLinkedin.x, y: magLinkedin.y }}
              onPointerMove={magLinkedin.onPointerMove}
              onPointerLeave={magLinkedin.onPointerLeave}
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
    </section>
  )
}
