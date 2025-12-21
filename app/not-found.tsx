"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const FUN_FACTS = [
  "AI research moves fast, but good ideas age well.",
  "The first neural network model was proposed in 1943.",
  "Computer science is as much about people as it is about code.",
  "The term 'bug' dates back to a moth found in a relay in 1947.",
  "Great products often start as small experiments.",
]

export default function NotFound() {
  const [funFact, setFunFact] = useState(FUN_FACTS[0])

  useEffect(() => {
    const index = Math.floor(Math.random() * FUN_FACTS.length)
    setFunFact(FUN_FACTS[index])
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-10%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.16),transparent_70%)] blur-2xl" />
        <div className="absolute bottom-[-20%] left-[-12%] h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.18),transparent_70%)] blur-3xl" />
        <div className="absolute inset-0 grain" />
      </div>

      <main className="relative flex min-h-screen items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl rounded-3xl border border-border bg-card/80 p-8 text-center shadow-[0_30px_80px_-60px_rgba(0,0,0,0.4)]"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">404</p>
          <h1 className="mt-4 font-display text-4xl text-foreground sm:text-5xl">
            This page drifted off course.
          </h1>
          <p className="mt-4 text-base text-muted-foreground">
            The page you&apos;re looking for isn&apos;t available. Let&apos;s get you back to something useful.
          </p>

          <div className="mt-6 rounded-2xl border border-border bg-background/70 px-4 py-3 text-sm text-muted-foreground">
            <span className="text-primary">Insight:</span> {funFact}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition hover:-translate-y-0.5"
            >
              Back to home
            </Link>
            <Link
              href="/projects"
              className="rounded-full border border-border bg-background/70 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-primary/40"
            >
              View projects
            </Link>
          </div>

          <div className="mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Quick links: <Link href="/#about" className="hover:text-foreground">About</Link> ·{" "}
            <Link href="/#skills" className="hover:text-foreground">Skills</Link> ·{" "}
            <Link href="/#contact" className="hover:text-foreground">Contact</Link>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
