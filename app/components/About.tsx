"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Brain, Compass, Sparkles, Users } from "lucide-react"
import { triggerHaptic } from "./ui/haptics"

interface AboutProps {
  setActiveSection: (section: string) => void
}

const traits = [
  {
    title: "Systems Thinking",
    description: "I map the full lifecycle of AI products, from data ingestion to guardrails and UX.",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    title: "Collaborative",
    description: "I enjoy working across design, research, and engineering to ship cohesive products.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Curious",
    description: "Always experimenting with new models, system design ideas, and evaluation tools.",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Product-Led",
    description: "I focus on impact, rapid iteration, and building features that solve real pain points.",
    icon: <Compass className="h-5 w-5" />,
  },
]

export default function About({ setActiveSection }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          triggerHaptic(10)
          setActiveSection("about")
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

  return (
    <section id="about" ref={sectionRef} className="py-16 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">About</p>
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">
              Building AI products that feel thoughtful and scalable.
            </h2>
            <div className="space-y-4 text-base text-muted-foreground">
              <p>
                I am an AI engineer and full-stack developer who enjoys exploring everything from
                machine learning to system design. I build scalable pipelines, evaluation harnesses,
                and interfaces that make complex ideas usable.
              </p>
              <p>
                My work blends rapid experimentation with production discipline. I like tackling
                ambiguous problems, designing the architecture, and shipping to users with strong
                observability and safety guardrails.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-card/70 p-6 text-sm text-muted-foreground">
              <p className="font-display text-lg text-foreground">Focus</p>
              <p className="mt-2">
                Intelligent systems, human-centered UX, and robust engineering practices that keep
                AI products dependable.
              </p>
            </div>
          </motion.div>

          <div className="grid gap-4">
            {traits.map((trait, index) => (
              <motion.div
                key={trait.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-border bg-card/80 p-5 shadow-[0_24px_60px_-50px_rgba(0,0,0,0.45)]"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {trait.icon}
                  </span>
                  <div>
                    <h3 className="font-display text-lg text-foreground">{trait.title}</h3>
                    <p className="text-sm text-muted-foreground">{trait.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
