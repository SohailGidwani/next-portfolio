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
    description: "I think about the whole picture, not just the model. Data in, guardrails, UX, all of it.",
    icon: <Brain className="h-5 w-5" />,
  },
  {
    title: "Collaborative",
    description: "I like working with designers, researchers, and other engineers. Better products come out of it.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Curious",
    description: "I'm always trying out new models, reading papers, and breaking things to see how they work.",
    icon: <Sparkles className="h-5 w-5" />,
  },
  {
    title: "Product-Led",
    description: "I'd rather ship something useful in a week than spend a month on something nobody asked for.",
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
              I like making AI things that people can actually use.
            </h2>
            <div className="space-y-4 text-base text-muted-foreground">
              <p>
                I'm an AI engineer and full-stack developer. I've worked on everything from RAG pipelines and LLM integrations to React frontends and Flask APIs. What I care about most is taking something complex and making it feel simple for the person using it.
              </p>
              <p>
                I tend to move fast, prototype a lot, and then clean things up once I know what works. Ambiguous problems don't scare me. If anything, those are the ones I find most interesting.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card/80 p-6 text-sm text-muted-foreground">
              <p className="font-display text-lg text-foreground">Focus</p>
              <p className="mt-2">
                Applied AI, retrieval systems, and building products that don't break when real people use them.
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
                className="rounded-2xl border border-border bg-card/80 p-5 shadow-card"
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
