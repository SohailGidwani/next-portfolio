"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowDown, ArrowUpRight, ChevronDown, Github, Linkedin } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import { smoothScrollToId } from "@/app/utils/smoothScroll"
import SkillsTicker from "./SkillsTicker"

const ShootingStars = dynamic(() => import("./ShootingStars"), { ssr: false })

function RoleBadge() {
  return (
    <span className="inline-flex items-center gap-2 rounded-pill border border-border bg-transparent px-4 py-2 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
      ML Systems Builder
    </span>
  )
}

function HeroStats() {
  const items = [
    { value: "2+", label: "Years production experience" },
    { value: "3", label: "AI systems deployed at IIFL" },
    { value: "71M", label: "Parameter models researched" },
    { value: "LA", label: "Los Angeles, CA / Open to remote" },
  ]

  return (
    <div className="mt-14 w-full border-t border-border pt-10 sm:mt-16 sm:pt-12">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6 lg:gap-10">
        {items.map((item) => (
          <div key={item.label} className="min-w-0 text-center md:text-left">
            <p className="font-display text-[clamp(1.25rem,3.5vw,2.65rem)] leading-none tracking-[-0.02em] text-foreground">
              {item.value}
            </p>
            <p className="mt-2 font-mono text-[9px] font-medium uppercase leading-snug tracking-[0.18em] text-muted-foreground sm:text-[10px] sm:tracking-[0.22em]">
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
    "block font-display font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-foreground text-[clamp(52px,11vw,150px)]"

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
      <span className="block overflow-hidden">
        <motion.span
          className="block"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          Sohail
        </motion.span>
      </span>
      <span className="block overflow-hidden">
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
  const shouldReduce = useReducedMotion()

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

  const scrollToAbout = () => {
    triggerHaptic()
    smoothScrollToId("about")
  }

  const scrollToProjects = () => {
    triggerHaptic()
    smoothScrollToId("projects")
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col pb-0 pt-[calc(var(--nav-h)+1.25rem)]"
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        <ShootingStars />
      </div>

      <div className="container relative z-[1] mx-auto flex flex-1 flex-col items-center justify-center pb-14 pt-6 text-center sm:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 * ds }}
          className="flex flex-col items-center"
        >
          <RoleBadge />
        </motion.div>

        <div className="mt-8 sm:mt-10">
          <HeroTitle />
        </div>

        <motion.p
          className="mx-auto mt-8 max-w-xl px-1 text-[15px] font-normal leading-relaxed text-muted-foreground sm:mt-10"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.35 * ds }}
        >
          I build AI systems that actually work in production — not just in notebooks. Full-stack engineering meets
          applied machine learning.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.45 * ds }}
          className="mt-9 flex w-full max-w-3xl flex-col items-stretch justify-center gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center"
        >
          <motion.button
            type="button"
            onClick={scrollToProjects}
            className="inline-flex items-center justify-center gap-2 rounded bg-foreground px-8 py-3.5 text-sm font-semibold text-background transition hover:opacity-90"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Projects
            <ArrowDown className="h-4 w-4" />
          </motion.button>
          <motion.a
            href="/documents/Sohail_Gidwani_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            onClick={() => triggerHaptic()}
            aria-label="Download resume (PDF)"
            className="inline-flex items-center justify-center rounded border border-border bg-transparent px-8 py-3.5 text-sm font-semibold text-foreground transition hover:border-foreground/40"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Resume
          </motion.a>
          <motion.a
            href="https://github.com/SohailGidwani"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded border border-border bg-transparent px-8 py-3.5 text-sm font-semibold text-foreground transition hover:border-foreground/40"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            GitHub
            <ArrowUpRight className="h-4 w-4" />
          </motion.a>
          <motion.a
            href="https://linkedin.com/in/sohail-gidwani"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded border border-border bg-transparent px-8 py-3.5 text-sm font-semibold text-foreground transition hover:border-foreground/40"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            LinkedIn
            <ArrowUpRight className="h-4 w-4" />
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 * ds }}
          className="flex w-full flex-col items-center"
        >
          <HeroStats />
        </motion.div>
      </div>

      <div className="relative z-[1] mt-auto w-screen max-w-[100vw] shrink-0 -translate-x-1/2 left-1/2">
        <SkillsTicker />
      </div>

      <motion.button
        type="button"
        onClick={scrollToAbout}
        aria-label="Scroll to about section"
        className="absolute bottom-[calc(3.25rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-muted-foreground/40 transition-colors hover:text-muted-foreground/70 sm:bottom-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 * ds, duration: 0.5 }}
        whileHover={{ scale: 1.1 }}
      >
        {shouldReduce ? (
          <ChevronDown className="h-5 w-5" />
        ) : (
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        )}
      </motion.button>
    </section>
  )
}
