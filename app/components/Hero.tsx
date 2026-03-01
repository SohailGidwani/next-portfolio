"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowDownRight, Check, ChevronDown, Github, Linkedin, Mail, MapPin, Sparkles, Terminal } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"
import ShootingStars from "./ShootingStars"
import toast from "react-hot-toast"

interface HeroProps {
  setActiveSection: (section: string) => void
}

const ROLES = [
  "AI / CS Engineer",
  "Full-Stack Developer",
  "MS CS @ USC",
  "ML Systems Builder",
]


function RoleBadge() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % ROLES.length), 2800)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground backdrop-blur-sm">
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

function AnimatedName() {
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
          transition={{ duration: 0.35, delay: 0.3 + i * 0.04, ease: "easeOut" }}
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
  const email = "sohailgidwani15@gmail.com"

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      triggerHaptic()
      setCopied(true)
      toast.success("Email copied!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Failed to copy")
    }
  }

  return (
    <motion.button
      onClick={handleCopy}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition-colors hover:border-primary/40 hover:text-primary"
      aria-label="Copy email address"
      whileHover={{ y: -3, scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Mail className="h-4 w-4" />}
    </motion.button>
  )
}

const CODE_LINES: { tokens: { text: string; color: string }[] }[] = [
  { tokens: [
    { text: "const ", color: "text-purple-400 dark:text-purple-300" },
    { text: "engineer", color: "text-foreground" },
    { text: " = {", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "  name", color: "text-primary" },
    { text: ": ", color: "text-muted-foreground" },
    { text: "\"Sohail Gidwani\"", color: "text-amber-600 dark:text-amber-400" },
    { text: ",", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "  role", color: "text-primary" },
    { text: ": ", color: "text-muted-foreground" },
    { text: "\"AI / CS Engineer\"", color: "text-amber-600 dark:text-amber-400" },
    { text: ",", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "  focus", color: "text-primary" },
    { text: ": [", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "    ", color: "" },
    { text: "\"Applied AI\"", color: "text-amber-600 dark:text-amber-400" },
    { text: ",", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "    ", color: "" },
    { text: "\"Intelligent Systems\"", color: "text-amber-600 dark:text-amber-400" },
    { text: ",", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "    ", color: "" },
    { text: "\"Full-Stack Engineering\"", color: "text-amber-600 dark:text-amber-400" },
  ]},
  { tokens: [
    { text: "  ],", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "  location", color: "text-primary" },
    { text: ": ", color: "text-muted-foreground" },
    { text: "\"Los Angeles\"", color: "text-amber-600 dark:text-amber-400" },
    { text: ",", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "  status", color: "text-primary" },
    { text: ": ", color: "text-muted-foreground" },
    { text: "\"MS CS @ USC\"", color: "text-amber-600 dark:text-amber-400" },
    { text: ",", color: "text-muted-foreground" },
  ]},
  { tokens: [
    { text: "  open to work", color: "text-primary" },
    { text: ": ", color: "text-muted-foreground" },
    { text: "true", color: "text-emerald-500 dark:text-emerald-400" },
  ]},
  { tokens: [
    { text: "}", color: "text-muted-foreground" },
  ]},
]

function CodePanel() {
  return (
    <div className="relative rounded-2xl border border-border bg-card/80 shadow-xl shadow-black/5 backdrop-blur-sm overflow-hidden dark:bg-card/60">
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/80 dark:bg-red-400/60" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80 dark:bg-amber-400/60" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80 dark:bg-emerald-400/60" />
        </div>
        <div className="ml-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Terminal className="h-3 w-3" />
          <span className="font-mono">engineer.ts</span>
        </div>
      </div>
      {/* Code body */}
      <div className="p-5 font-mono text-[13px] leading-relaxed sm:text-sm">
        {CODE_LINES.map((line, lineIdx) => (
          <motion.div
            key={lineIdx}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.6 + lineIdx * 0.06, ease: "easeOut" }}
            className="flex"
          >
            <span className="mr-4 w-5 shrink-0 select-none text-right text-[11px] text-muted-foreground/40">
              {lineIdx + 1}
            </span>
            <span>
              {line.tokens.map((token, tIdx) => (
                <span key={tIdx} className={token.color}>{token.text}</span>
              ))}
            </span>
          </motion.div>
        ))}
        {/* Blinking cursor */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="flex"
        >
          <span className="mr-4 w-5 shrink-0 select-none text-right text-[11px] text-muted-foreground/40">
            13
          </span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 1, ease: "steps(2)" }}
            className="inline-block h-[1.1em] w-[2px] bg-primary"
          />
        </motion.div>
      </div>
    </div>
  )
}

interface Orb {
  x: number
  y: number
  radius: number
  phaseX: number
  phaseY: number
  speedX: number
  speedY: number
  driftX: number
  driftY: number
  color: [number, number, number]
}

function AuroraMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const orbsRef = useRef<Orb[]>([])
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      initOrbs(rect.width, rect.height)
    }

    const initOrbs = (w: number, h: number) => {
      orbsRef.current = [
        {
          x: w * 0.25, y: h * 0.3,
          radius: Math.max(w, h) * 0.35,
          phaseX: 0, phaseY: 0.5,
          speedX: 0.15, speedY: 0.12,
          driftX: w * 0.12, driftY: h * 0.1,
          color: [45, 212, 191],    // teal
        },
        {
          x: w * 0.7, y: h * 0.25,
          radius: Math.max(w, h) * 0.3,
          phaseX: 2, phaseY: 1,
          speedX: 0.1, speedY: 0.14,
          driftX: w * 0.1, driftY: h * 0.08,
          color: [251, 146, 60],    // warm amber
        },
        {
          x: w * 0.5, y: h * 0.7,
          radius: Math.max(w, h) * 0.32,
          phaseX: 4, phaseY: 3,
          speedX: 0.12, speedY: 0.09,
          driftX: w * 0.08, driftY: h * 0.12,
          color: [14, 116, 144],    // deep cyan
        },
        {
          x: w * 0.15, y: h * 0.75,
          radius: Math.max(w, h) * 0.22,
          phaseX: 1.5, phaseY: 4.2,
          speedX: 0.08, speedY: 0.11,
          driftX: w * 0.06, driftY: h * 0.09,
          color: [168, 85, 247],    // violet accent
        },
      ]
    }

    let time = 0
    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const isDark = document.documentElement.classList.contains("dark")

      ctx.clearRect(0, 0, w, h)

      const baseAlpha = isDark ? 0.18 : 0.1

      for (const orb of orbsRef.current) {
        const cx = orb.x + Math.sin(time * orb.speedX + orb.phaseX) * orb.driftX
        const cy = orb.y + Math.cos(time * orb.speedY + orb.phaseY) * orb.driftY

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orb.radius)
        const [r, g, b] = orb.color
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${baseAlpha})`)
        grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.5})`)
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      }

      time += 0.008
      animRef.current = requestAnimationFrame(animate)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    animRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  )
}

export default function Hero({ setActiveSection }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10)
          setActiveSection("hero")
        }
      },
      { threshold: 0.3, rootMargin: "-10% 0px -10% 0px" }
    )

    const currentRef = sectionRef.current
    if (currentRef) observer.observe(currentRef)
    return () => { if (currentRef) observer.unobserve(currentRef) }
  }, [setActiveSection])

  const scrollToAbout = () => {
    triggerHaptic()
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToProjects = () => {
    triggerHaptic()
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
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
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              <RoleBadge />
            </motion.div>

            <AnimatedName />

            <motion.p
              className="max-w-lg text-lg leading-relaxed text-muted-foreground sm:text-xl"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.95 }}
            >
              Building intelligent systems that blend machine learning,
              software engineering, and thoughtful product design.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 1.05 }}
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
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition-colors hover:border-primary/40 hover:text-primary"
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
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition-colors hover:border-primary/40 hover:text-primary"
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
              transition={{ duration: 0.4, delay: 1.15 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <MapPin className="h-3.5 w-3.5 text-primary" />
              Los Angeles · Open to remote + on-site
            </motion.div>
          </div>

          {/* Right — code editor panel */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35 }}
            className="hidden lg:block"
          >
            <CodePanel />
          </motion.div>
        </div>
      </div>

      {/* Scroll chevron → about */}
      {!shouldReduce && (
        <motion.button
          onClick={scrollToAbout}
          aria-label="Scroll to about section"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/30 transition-colors hover:text-muted-foreground/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.6 }}
          whileHover={{ scale: 1.15 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronDown className="h-5 w-5" />
          </motion.div>
        </motion.button>
      )}
    </section>
  )
}
