"use client"

import { useEffect, useState } from "react"
import { smoothScrollToId } from "@/app/utils/smoothScroll"

/** Matches the `scroll-mt-24` on every section heading this rail targets. */
export const HEADING_OFFSET = 96

export type TocItem = {
  id: string
  n: string
  label: string
}

/**
 * Quiet right-rail "on this page" list for long article pages.
 * Scroll-spies the numbered sections and highlights the active one.
 * Hidden below 1200px where there is no spare gutter.
 */
export default function SectionTOC({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      // Active band: a section counts as current while its label sits in the
      // upper third of the viewport.
      { rootMargin: "-15% 0px -65% 0px" }
    )

    for (const item of items) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [items])

  // Not scrollIntoView: the browser's smooth behaviour ignores
  // prefers-reduced-motion (measured: it still animated 117 frames under
  // reduce) and paces every jump the same regardless of distance.
  // smoothScrollTo teleports for reduced motion and is distance-proportional,
  // which is what the navbar, hero, and command palette already do.
  const scrollTo = (id: string) => {
    smoothScrollToId(id, { offset: HEADING_OFFSET })
  }

  return (
    <nav
      aria-label="On this page"
      className="fixed right-6 top-1/2 z-30 hidden max-w-[200px] -translate-y-1/2 min-[1200px]:block"
    >
      <p className="mb-3 pl-4 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground/60">
        On this page
      </p>
      <ul className="space-y-2 border-l border-border">
        {items.map((item) => {
          const isActive = active === item.id
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => scrollTo(item.id)}
                aria-current={isActive ? "true" : undefined}
                className={`-ml-px flex w-full items-baseline gap-2 border-l py-0.5 pl-4 text-left font-mono text-xs uppercase tracking-[0.12em] transition-colors ${
                  isActive
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className={isActive ? "text-accent" : "text-muted-foreground/60"}>{item.n}</span>
                <span className="min-w-0 truncate">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
