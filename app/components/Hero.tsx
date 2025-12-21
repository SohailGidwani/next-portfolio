"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { ArrowDownRight, Github, Linkedin, Mail, MapPin, Sparkles } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"

interface HeroProps {
  setActiveSection: (section: string) => void
}

const highlights = [
  {
    label: "Focus",
    value: "Applied AI, intelligent systems, and full-stack product engineering",
  },
  {
    label: "Currently",
    value: "M.S. in CS @ USC · exploring AI + systems design",
  },
  {
    label: "Based",
    value: "Los Angeles · Mumbai",
  },
]

const stats = [
  { label: "AI/ML Projects", value: "12+" },
  { label: "AI Systems", value: "6+" },
  { label: "Years Building", value: "4" },
]

export default function Hero({ setActiveSection }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10)
          setActiveSection("hero")
        }
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px",
      }
    )

    const currentRef = sectionRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [setActiveSection])

  const scrollToProjects = () => {
    triggerHaptic()
    const section = document.getElementById("projects")
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-12 sm:pt-32"
    >
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI / CS Engineer
            </span>
            <div className="space-y-3">
              <h1 className="font-display text-4xl leading-tight text-foreground sm:text-5xl lg:text-6xl">
                Sohail Gidwani
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                I build intelligent systems that blend machine learning, software engineering, and
                thoughtful product design. Focused on practical AI that ships and scales.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={scrollToProjects}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
              >
                View Projects
                <ArrowDownRight className="h-4 w-4" />
              </button>
              <a
                href="/documents/Sohail_Gidwani_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                onClick={() => triggerHaptic()}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-primary/40"
              >
                Download Resume
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                Open to remote + on-site
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="mailto:sohailgidwani15@gmail.com"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition hover:-translate-y-0.5 hover:border-primary/40"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
                <a
                  href="https://github.com/SohailGidwani"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition hover:-translate-y-0.5 hover:border-primary/40"
                  aria-label="GitHub"
                >
                  <Github className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com/in/sohail-gidwani"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground transition hover:-translate-y-0.5 hover:border-primary/40"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative animate-float-slow"
          >
            <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.5)] backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl text-foreground">Signal Stack</h2>
              </div>

              <div className="mt-6 space-y-4">
                {highlights.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/70 bg-background/60 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-sm text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border/70 bg-background/60 p-3 text-center">
                    <p className="font-display text-lg text-foreground">{stat.value}</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
