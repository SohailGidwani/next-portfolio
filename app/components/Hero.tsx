"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowDownRight, Check, ChevronDown, Github, Linkedin, Mail, MapPin, Sparkles } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import dynamic from "next/dynamic"
import toast from "react-hot-toast"
import { smoothScrollToId } from "@/app/utils/smoothScroll"
import { projects } from "@/app/data/projects"
import SkillsTicker from "./SkillsTicker"

const ShootingStars = dynamic(() => import("./ShootingStars"), { ssr: false })
const AuroraMesh = dynamic(() => import("./AuroraMesh"), { ssr: false })
const HeroSpotlight = dynamic(() => import("./HeroSpotlight"), { ssr: false })

const ROLES = [
  "AI / CS Engineer",
  "Full-Stack Developer",
  "MS CS @ USC",
  "ML Systems Builder",
]


function RoleBadge() {
  const shouldReduce = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (shouldReduce) return
    const id = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2800)
    return () => clearInterval(id)
  }, [shouldReduce])

  return (
    <span className="inline-flex items-center gap-2.5 rounded-md border border-border bg-card/90 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground backdrop-blur-sm">
      <span className="relative flex h-2 w-2 shrink-0">
        {!shouldReduce ? (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
        ) : null}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
      </span>
      <Sparkles className="h-3.5 w-3.5 shrink-0 text-accent" />
      <AnimatePresence mode="wait">
        <motion.span
          key={ROLES[index]}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="whitespace-nowrap"
        >
          {ROLES[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function HeroStats() {
  const projectCount = projects.length
  const items = [
    { value: `${projectCount}+`, label: "Projects documented", nowrap: false },
    { value: "RAG · Agents", label: "Core stack focus", nowrap: true },
    { value: "USC", label: "MS Computer Science", nowrap: false },
  ]

  return (
    <div className="mt-10 border-t border-border pt-8 sm:mt-12">
      <div className="grid gap-8 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="min-w-0 space-y-1">
            <p
              className={`font-display text-2xl tracking-tight text-foreground sm:text-3xl md:text-4xl ${item.nowrap ? "whitespace-nowrap" : ""}`}
            >
              {item.value}
            </p>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnimatedName({ delayScale }: { delayScale: number }) {
  const shouldReduce = useReducedMotion()
  const first = "Sohail"
  const last = "Gidwani"
  const name = `${first} ${last}`

  const headingClass =
    "font-display leading-[1.08] tracking-tight text-foreground hyphens-none [overflow-wrap:normal] text-[clamp(2.25rem,6.5vw+0.5rem,5.75rem)] sm:text-[clamp(2.75rem,5.5vw+0.75rem,5.75rem)] min-[1140px]:text-[clamp(3.25rem,4.2vw+1rem,5.85rem)]"

  if (shouldReduce) {
    return (
      <h1 className={headingClass}>
        <span className="inline-block">{first}</span>{" "}
        <span className="inline-block whitespace-nowrap">{last}</span>
      </h1>
    )
  }

  let idx = 0
  const step = 0.04
  const nextDelay = () => (0.3 + idx++ * step) * delayScale

  return (
    <h1 className={headingClass} aria-label={name}>
      <span className="inline-block">
        {first.split("").map((char, i) => (
          <motion.span
            key={`f-${i}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: nextDelay(), ease: "easeOut" }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </span>
      <span className="inline-block" aria-hidden="true">
        <motion.span
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: nextDelay(), ease: "easeOut" }}
          className="inline-block"
        >
          {"\u00A0"}
        </motion.span>
      </span>
      <span className="inline-block whitespace-nowrap">
        {last.split("").map((char, i) => (
          <motion.span
            key={`l-${i}`}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: nextDelay(), ease: "easeOut" }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </span>
    </h1>
  )
}

function CopyEmailButton() {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const email = "sohailgidwani15@gmail.com"

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      triggerHaptic()
      setCopied(true)
      toast.success("Email copied!")
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }

  return (
    <motion.button
      onClick={handleCopy}
      title="Copy email address"
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card/90 text-foreground transition-colors hover:border-accent/50 hover:text-accent"
      aria-label="Copy email address"
      whileHover={{ y: -3, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Mail className="h-4 w-4" />}
    </motion.button>
  )
}

export default function Hero() {
  const shouldReduce = useReducedMotion()

  const [ds] = useState(() => {
    if (typeof window === "undefined") return 1
    return sessionStorage.getItem("hero-seen") ? 0.3 : 1
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
      className="relative flex min-h-[100svh] flex-col px-4 pt-24 pb-0 sm:pt-28"
    >
      {/* Aurora extends beyond section bottom so it doesn't clip hard */}
      <div className="pointer-events-none absolute inset-x-0 -top-20 -bottom-32" style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 75%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 75%, transparent 100%)" }}>
        <AuroraMesh />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <ShootingStars />
      </div>

      <div className="container relative mx-auto flex flex-1 flex-col justify-center pb-16 pt-8 sm:pb-20">
        <div className="grid items-start gap-10 min-[1140px]:grid-cols-[1fr_1fr] min-[1140px]:items-center min-[1140px]:gap-14 xl:gap-16">

          {/* Left — text content */}
          <div className="min-w-0 space-y-6 sm:space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 * ds }}
            >
              <RoleBadge />
            </motion.div>

            <AnimatedName delayScale={ds} />

            <motion.p
              className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.95 * ds }}
            >
              I build AI systems that actually work in production, not just in notebooks. Full-stack engineering meets applied ML.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 1.05 * ds }}
              className="flex flex-wrap items-center gap-3"
            >
              <motion.button
                type="button"
                onClick={scrollToProjects}
                className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-foreground/10"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                View Projects
                <ArrowDownRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </motion.button>
              <motion.a
                href="/documents/Sohail_Gidwani_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                onClick={() => triggerHaptic()}
                aria-label="Download resume (PDF)"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-card/90 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/50"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Resume
              </motion.a>

              <span className="hidden h-6 w-px bg-border sm:block" />

              <div className="flex items-center gap-2">
                <CopyEmailButton />
                <motion.a
                  href="https://github.com/SohailGidwani"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card/90 text-foreground transition-colors hover:border-accent/50 hover:text-accent"
                  aria-label="GitHub"
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Github className="h-4 w-4" />
                </motion.a>
                <motion.a
                  href="https://linkedin.com/in/sohail-gidwani"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card/90 text-foreground transition-colors hover:border-accent/50 hover:text-accent"
                  aria-label="LinkedIn"
                  whileHover={{ y: -3, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  <Linkedin className="h-4 w-4" />
                </motion.a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.15 * ds }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <MapPin className="h-3.5 w-3.5 text-accent" />
              Los Angeles · Open to remote and on-site
            </motion.div>
          </div>

          {/* Right — project spotlight (wide screens only) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 * ds }}
            className="hidden min-w-0 min-[1140px]:block"
          >
            <HeroSpotlight />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.25 * ds }}
        >
          <HeroStats />
        </motion.div>
      </div>

      <div className="relative z-[1] mt-auto w-screen max-w-[100vw] shrink-0 -translate-x-1/2 left-1/2">
        <SkillsTicker />
      </div>

      {/* Scroll chevron → about */}
      <motion.button
        onClick={scrollToAbout}
        aria-label="Scroll to about section"
        className="absolute bottom-[calc(3.25rem+env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 text-muted-foreground/30 transition-colors hover:text-muted-foreground/60 sm:bottom-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.0 * ds, duration: 0.6 }}
        whileHover={{ scale: 1.15 }}
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
