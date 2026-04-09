"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowDownRight, Check, ChevronDown, Github, Linkedin, Mail, MapPin, Sparkles } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import dynamic from "next/dynamic"
import toast from "react-hot-toast"
import { smoothScrollToId } from "@/app/utils/smoothScroll"

const ShootingStars = dynamic(() => import("./ShootingStars"), { ssr: false })
const AuroraMesh = dynamic(() => import("./AuroraMesh"), { ssr: false })
const CodePanel = dynamic(() => import("./CodePanel"), { ssr: false })

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
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm">
      <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
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

function AnimatedName({ delayScale }: { delayScale: number }) {
  const shouldReduce = useReducedMotion()
  const name = "Sohail Gidwani"

  if (shouldReduce) {
    return (
      <h1 className="font-display text-5xl leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl">
        {name}
      </h1>
    )
  }

  return (
    <h1
      className="font-display text-5xl leading-[1.08] tracking-tight text-foreground sm:text-6xl lg:text-7xl xl:text-8xl"
      aria-label={name}
    >
      {name.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: (0.3 + i * 0.04) * delayScale, ease: "easeOut" }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
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
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 text-foreground transition-colors hover:border-primary/40 hover:text-primary"
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
      className="relative flex min-h-[100svh] flex-col justify-center px-4 pt-28 pb-24 sm:pt-32"
    >
      {/* Aurora extends beyond section bottom so it doesn't clip hard */}
      <div className="pointer-events-none absolute inset-x-0 -top-20 -bottom-32" style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 75%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 5%, black 75%, transparent 100%)" }}>
        <AuroraMesh />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <ShootingStars />
      </div>

      <div className="container relative mx-auto">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">

          {/* Left — text content */}
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 * ds }}
            >
              <RoleBadge />
            </motion.div>

            <AnimatedName delayScale={ds} />

            <motion.p
              className="max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl"
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
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20"
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
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40"
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
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 text-foreground transition-colors hover:border-primary/40 hover:text-primary"
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
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 text-foreground transition-colors hover:border-primary/40 hover:text-primary"
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
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Los Angeles · Open to remote and on-site
            </motion.div>
          </div>

          {/* Right — code editor panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 * ds }}
            className="hidden lg:block"
          >
            <CodePanel />
          </motion.div>
        </div>
      </div>

      {/* Scroll chevron → about */}
      <motion.button
        onClick={scrollToAbout}
        aria-label="Scroll to about section"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/30 transition-colors hover:text-muted-foreground/60"
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
