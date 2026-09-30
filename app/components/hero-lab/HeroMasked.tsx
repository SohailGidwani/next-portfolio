"use client"

import dynamic from "next/dynamic"
import Link from "next/link"
import { ArrowDown, ArrowUpRight } from "lucide-react"
import { triggerHaptic } from "../ui/haptics"
import { smoothScrollToId } from "@/app/utils/smoothScroll"
import MaskedName from "./MaskedName"

const ShootingStars = dynamic(() => import("../ShootingStars"), { ssr: false })

const NAME = ["Sohail", "Gidwani"]

// As wide as the column allows, and no taller than the screen can hold with
// the rest of the hero under it.
const NAME_CLASS =
  "block w-full min-w-0 select-none font-display font-extrabold uppercase leading-[0.95] tracking-[-0.03em] text-foreground text-[clamp(2.5rem,min(23cqi,27svh),16rem)]"

const LINK =
  "inline-flex items-center gap-1 text-foreground underline-offset-4 transition-colors hover:text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"

/**
 * A hero built on one idea: the name behaves like the research. It keeps the
 * poster-size name and drops what stood around it (the role pill, the button
 * row, the stat tiles), leaving the sentence and a plain line of links.
 * Preview only, at /hero-lab; the live hero is untouched.
 */
export default function HeroMasked() {
  return (
    <section id="hero" className="relative min-h-[100svh] border-b border-border pt-[calc(var(--nav-h)+1.25rem)]">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <ShootingStars />
      </div>

      <div className="container relative z-[1] mx-auto flex min-h-[calc(100svh-var(--nav-h)-1.25rem)] flex-col justify-center pb-12 pt-6 sm:pb-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:text-xs">
          Agentic AI/ML Engineer <span aria-hidden>·</span> Los Angeles
        </p>

        <div className="mt-4 w-full min-w-0 [container-type:inline-size] sm:mt-5">
          <MaskedName lines={NAME} className={NAME_CLASS} />
        </div>

        {/* What the name is doing, in one line, with the way to the work behind it. */}
        <p className="mt-4 flex items-start gap-2.5 font-mono text-[11px] leading-relaxed tracking-[0.04em] text-muted-foreground sm:text-xs">
          <span aria-hidden className="mt-[3px] h-2.5 w-2.5 shrink-0 border border-dashed border-accent" />
          <span>
            Hide most of the picture, predict it from the rest. This is how my models learn.{" "}
            <Link href="/research" className={`${LINK} whitespace-nowrap`}>
              See the research
              <ArrowUpRight className="h-3 w-3" aria-hidden />
            </Link>
          </span>
        </p>

        <div className="mt-10 grid gap-8 border-t border-border pt-7 sm:mt-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16">
          <p className="max-w-[34ch] text-balance font-display text-xl font-medium leading-snug tracking-[-0.01em] text-foreground sm:text-2xl">
            I build AI systems that hold up in production, and publish the evaluations that say whether they do.
          </p>

          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
            <p className="flex items-center gap-2 text-foreground/80">
              <span aria-hidden className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Open to full-time roles
            </p>
            <p className="mt-1.5">Graduating May 2027</p>
            <p className="mt-1.5">Relocate / Hybrid / Remote</p>
            <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
              <button
                type="button"
                onClick={() => {
                  triggerHaptic()
                  smoothScrollToId("projects")
                }}
                className={`${LINK} uppercase tracking-[0.18em]`}
              >
                Projects
                <ArrowDown className="h-3 w-3" aria-hidden />
              </button>
              <a href="/documents/Sohail_Gidwani_Resume.pdf" target="_blank" rel="noreferrer" aria-label="Download resume (PDF)" className={LINK}>
                Resume
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
              <a href="https://github.com/SohailGidwani" target="_blank" rel="noreferrer" className={LINK}>
                GitHub
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
              <a href="https://linkedin.com/in/sohail-gidwani" target="_blank" rel="noreferrer" className={LINK}>
                LinkedIn
                <ArrowUpRight className="h-3 w-3" aria-hidden />
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
