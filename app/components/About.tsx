"use client"

import { useEffect, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { useScrollEngine } from "./scroll/ScrollEngine"

const traits = [
  {
    title: "Systems Thinking",
    description:
      "I think about the whole picture, not just the model. Data in, guardrails, UX, all of it.",
  },
  {
    title: "Collaborative",
    description:
      "I like working with designers, researchers, and other engineers. Better products come out of it.",
  },
  {
    title: "Curious",
    description:
      "I'm always trying out new models, reading papers, and breaking things to see how they work.",
  },
  {
    title: "Product-Led",
    description:
      "I'd rather ship something useful in a week than spend a month on something nobody asked for.",
  },
]

export default function About() {
  const { registerSection } = useScrollEngine()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(contentRef, { once: true, margin: "-100px" })

  useEffect(() => {
    if (sectionRef.current) {
      registerSection("about", sectionRef.current)
    }
  }, [registerSection])

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex min-h-screen items-center py-32"
    >
      <div className="container mx-auto px-6" ref={contentRef}>
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div className="space-y-8">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-[10px] font-body font-medium tracking-[0.4em] uppercase text-white/30"
            >
              About
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display italic text-4xl sm:text-5xl text-white leading-[1.1]"
            >
              I like making AI things that people can actually use.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-5 font-body text-base text-white/40 leading-relaxed"
            >
              <p>
                I&apos;m an AI engineer and full-stack developer. I&apos;ve worked on everything
                from RAG pipelines and LLM integrations to React frontends and Flask APIs. What I
                care about most is taking something complex and making it feel simple for the person
                using it.
              </p>
              <p>
                I tend to move fast, prototype a lot, and then clean things up once I know what
                works. Ambiguous problems don&apos;t scare me. If anything, those are the ones I find
                most interesting.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <p className="font-display italic text-lg text-white">Focus</p>
              <p className="mt-2 font-body text-sm text-white/35">
                Applied AI, retrieval systems, and building products that don&apos;t break when real
                people use them.
              </p>
            </motion.div>
          </div>

          <div className="grid gap-4">
            {traits.map((trait, index) => (
              <motion.div
                key={trait.title}
                initial={{ opacity: 0, y: 24 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 + index * 0.1 }}
                className="glass rounded-2xl p-6"
              >
                <h3 className="font-display italic text-lg text-white">{trait.title}</h3>
                <p className="mt-2 font-body text-sm text-white/35">{trait.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
