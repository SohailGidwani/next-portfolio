"use client"

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { useMediaQuery } from "@/app/hooks/useMediaQuery"
import { CHAPTER_OPEN_EVENT } from "./MobileChapterNav"

const DURATION_MS = 320

/**
 * A long-form section that reads as a chapter on phones and as plain
 * running text on desktop.
 *
 * Below 768px the body is clamped by CSS and fronted by a one-line
 * summary, so a reader can skim fourteen chapters in a few screens and
 * open only what they want. At 768px and up every rule here goes quiet
 * and the markup renders exactly as it did before.
 *
 * The clamp is the CSS default rather than a hydration-time decision:
 * the server already sends the collapsed shape, so there is no flash and
 * no layout shift. The full text is always present in the DOM for
 * crawlers.
 */
export default function MobileSection({
  id,
  n,
  label,
  summary,
  lead,
  figure,
  children,
}: {
  id: string
  n: string
  label: string
  /**
   * One line, plain language: what a reader gets if they open this. Omit it
   * and the clamped body serves as its own preview, which reads better than
   * a summary that just paraphrases the opening sentence.
   */
  summary?: string
  /**
   * The section's opening paragraph. Hidden on phones when a summary is
   * present, since the two say the same thing, which is also what lets the
   * figure sit directly under the summary without reordering the DOM.
   */
  lead?: ReactNode
  /**
   * A diagram or other visual that stays OUTSIDE the clamp. Diagrams are the
   * thing that earns the tap, so collapsing a chapter must never hide one.
   */
  figure?: ReactNode
  children?: ReactNode
}) {
  const [expanded, setExpanded] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  // Height captured at click time, before React commits the new state.
  const fromHeight = useRef<number | null>(null)
  const isPhone = useMediaQuery("(max-width: 767px)")
  // A section can be just a lead plus a figure; then the lead is the body.
  const hasBody = Boolean(children)

  useLayoutEffect(() => {
    const body = bodyRef.current
    const from = fromHeight.current
    fromHeight.current = null
    if (!body || from === null) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    // Let CSS settle to its new resting height and measure that, so the
    // animation never depends on a hardcoded pixel value that could drift
    // away from the stylesheet.
    body.style.transition = "none"
    body.style.maxHeight = ""
    body.style.overflow = "hidden"
    const to = body.clientHeight

    body.style.maxHeight = `${from}px`
    void body.offsetHeight
    body.style.transition = `max-height ${DURATION_MS}ms var(--ease-sheet)`
    body.style.maxHeight = `${to}px`

    const settle = (event: TransitionEvent) => {
      // Ignore transitions bubbling up from anything nested in the body.
      if (event.target !== body || event.propertyName !== "max-height") return
      // Hand the resting height back to CSS so later reflows (font swap,
      // image load, orientation change) are not pinned to a stale value.
      body.style.transition = ""
      body.style.maxHeight = ""
      body.style.overflow = ""
    }
    body.addEventListener("transitionend", settle, { once: true })
    return () => body.removeEventListener("transitionend", settle)
  }, [expanded])

  // Picking a chapter from the navigator should land on open text, not on a
  // clamped stub the reader has to tap again. No height is captured here, so
  // this opens instantly rather than animating under the incoming scroll.
  useEffect(() => {
    const onOpenRequest = (event: Event) => {
      if ((event as CustomEvent<string>).detail === id) setExpanded(true)
    }
    window.addEventListener(CHAPTER_OPEN_EVENT, onOpenRequest)
    return () => window.removeEventListener(CHAPTER_OPEN_EVENT, onOpenRequest)
  }, [id])

  const toggle = () => {
    fromHeight.current = bodyRef.current?.clientHeight ?? null
    setExpanded((open) => !open)
  }

  return (
    <section data-expanded={expanded}>
      <div id={id} className="mb-6 scroll-mt-24">
        <div className="mb-2 flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-accent">{n}</span>
          <div className="h-px w-5 bg-border" />
        </div>
        <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground sm:text-2xl">
          {label}
        </h2>
      </div>

      {summary && (
        <p className="mb-5 text-[15px] leading-[1.7] text-muted-foreground md:hidden">{summary}</p>
      )}

      {/* Desktop keeps its original reading order (lead, figure, body). On
          phones the summary stands in for the lead, so the figure lands
          directly under it with no reordering and no duplicated markup.
          When a section is only a lead plus a figure, the lead IS the body
          and belongs inside the clamp instead. */}
      {hasBody && lead && (
        <div className={summary ? "hidden md:block" : undefined}>{lead}</div>
      )}

      {/* When the lead IS the body, the two swap: the phone wants the figure
          first as the hook, desktop wants its original text-then-figure
          order. A flex order swap does that without duplicating markup. */}
      <div className={hasBody ? undefined : "flex flex-col"}>
        <div className={hasBody ? undefined : "order-1 md:order-2"}>{figure}</div>

        <div
          ref={bodyRef}
          id={`${id}-body`}
          className={`m-collapse-body ${hasBody ? "" : "order-2 md:order-1"}`}
          inert={isPhone && !expanded}
        >
          {hasBody ? children : lead}
        </div>
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-expanded={expanded}
        aria-controls={`${id}-body`}
        className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded border border-border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground transition-transform active:scale-[0.97] md:hidden"
      >
        {expanded ? "Collapse" : "Read this chapter"}
        <ChevronDown
          aria-hidden
          className={`h-3.5 w-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
        />
      </button>
    </section>
  )
}
