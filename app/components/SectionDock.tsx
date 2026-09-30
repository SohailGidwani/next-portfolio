"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { createChase } from "@/app/utils/chase"

// How far below the navbar a heading is when it starts to fly, in pixels.
// It lands as its own top reaches the navbar's bottom edge.
const RUN_UP = 140
const ZERO_WIDTH = "\u200b"

const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** The box of one character's glyph run: the same kind of box at any size. */
function glyphBox(node: Node, from = 0): DOMRect {
  const range = document.createRange()
  range.setStart(node, from)
  range.setEnd(node, from + 1)
  return range.getBoundingClientRect()
}

/**
 * The section you are in, shown next to the logo on the home page. As each
 * section's title scrolls up to the navbar it shrinks and flies into the bar
 * after the logo ("SohailG / Experience") and stays there while you read that
 * section; the next title takes its place as it arrives, and scrolling back up
 * past a title flies it back down into its section. The same idea as the
 * name flying into the logo, and measured the same way: everything is read
 * live each frame, so it lands exactly whatever the layout does.
 *
 * Headings opt in through SectionHeading's data-section-title; a section
 * whose heading is not a plain name (Contact) opts in with
 * data-section-label and switches the label without a flight. With reduced
 * motion nothing flies: the label just changes as each section arrives.
 */
export default function SectionDock() {
  const flyRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    const fly = flyRef.current
    const slot = document.querySelector<HTMLElement>("[data-nav-section]")
    const label = slot?.querySelector<HTMLElement>("[data-nav-section-label]")
    const target = slot?.querySelector<HTMLElement>("[data-nav-section-target]")
    const header = slot?.closest("header")
    if (!fly || !slot || !label || !target || !header) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const copy = fly.firstElementChild as HTMLElement

    type Mark = { el: HTMLElement; label: string; flies: boolean }
    const marks: Mark[] = [
      ...Array.from(document.querySelectorAll<HTMLElement>("[data-section-title]")).map((el) => ({
        el,
        label: el.dataset.sectionTitle ?? "",
        flies: !still,
      })),
      ...Array.from(document.querySelectorAll<HTMLElement>("[data-section-label]")).map((el) => ({
        el,
        label: el.dataset.sectionLabel ?? "",
        flies: false,
      })),
    ]
      .filter((m) => m.label)
      // In page order, whichever kind of marker they are.
      .sort((a, b) => (a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
    if (!marks.length) return

    let raf = 0
    let flying: Mark | null = null
    // Each flight is drawn from a value that chases its scroll position, so a
    // fast flick still shows the title gliding into the bar. Switches (no
    // flight) are instant.
    const chases = marks.map(() => createChase())
    let offset = { x: 0, y: 0 }

    /** Dress the flying copy as this heading: its text, at its size, and where its glyph sits in its box. */
    const dress = (mark: Mark) => {
      const css = getComputedStyle(mark.el)
      copy.textContent = mark.label
      copy.style.fontSize = css.fontSize
      copy.style.fontWeight = css.fontWeight
      copy.style.letterSpacing = css.letterSpacing
      copy.style.transform = "none"
      target.textContent = mark.label
      const box = copy.getBoundingClientRect()
      const r = glyphBox(copy.firstChild as Node)
      offset = { x: r.left - box.left, y: r.top - box.top }
      flying = mark
    }

    const render = () => {
      raf = 0
      const bar = header.getBoundingClientRect().bottom
      // How far along each marker is: 0 until it is RUN_UP below the navbar,
      // 1 once it reaches it. Markers that do not fly just switch.
      // A section that switches without a flight (Contact) counts once it is
      // well into view: as the last section, its top may never reach the
      // navbar before the page runs out.
      const arrive = bar + (window.innerHeight - bar) * 0.4
      const now = performance.now()
      let gliding = false
      const progress = marks.map((m, i) => {
        const top = m.el.getBoundingClientRect().top
        if (!m.flies) return top <= arrive ? 1 : 0
        const { value, settled } = chases[i].step(clamp01((bar + RUN_UP - top) / RUN_UP), now)
        if (!settled) gliding = true
        return value
      })
      // Keep drawing until every flight has caught up with the scroll.
      if (gliding) raf = requestAnimationFrame(render)
      let docked = -1
      let inFlight = -1
      progress.forEach((p, i) => {
        if (p >= 1) docked = i
        else if (p > 0 && marks[i].flies) inFlight = i
      })

      // Headings in flight or docked are carried by the copy or the label.
      marks.forEach((m, i) => {
        if (m.flies) m.el.style.opacity = progress[i] > 0 ? "0" : ""
      })

      const p = inFlight >= 0 ? progress[inFlight] : 0
      if (inFlight >= 0) {
        const mark = marks[inFlight]
        if (flying !== mark) dress(mark)
        const e = easeInOut(p)
        const s = glyphBox(mark.el.firstChild as Node)
        const t = glyphBox(target.firstChild as Node)
        if (s.height && t.height) {
          const scale = 1 + (t.height / s.height - 1) * e
          const x = s.left + (t.left - s.left) * e - offset.x * scale
          // Never above the bar's row: after a fast flick the heading itself
          // is already far above the screen, and the title should come in
          // along the bar, not drop down from off the top.
          const y = Math.max(s.top + (t.top - s.top) * e, t.top) - offset.y * scale
          copy.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`
          fly.style.visibility = "visible"
        }
      } else {
        fly.style.visibility = "hidden"
        flying = null
      }

      // The label shows the section you are in; as the next title comes in
      // to land, the old name makes way for it.
      // Never empty: an empty label has no baseline, and the bar would align
      // the slot differently the moment a name arrived, a 3px hop on landing.
      const current = docked >= 0 ? marks[docked].label : ZERO_WIDTH
      if (label.textContent !== current) label.textContent = current
      // The old name is gone before the new title reaches the bar, so the two
      // never overlap; the first title brings the slash in with it.
      const makeWay = clamp01((p - 0.25) / 0.35)
      label.style.opacity = String(1 - makeWay)
      label.style.transform = `translateY(${(-6 * makeWay).toFixed(2)}px)`
      slot.style.opacity = String(docked >= 0 ? 1 : clamp01((p - 0.4) / 0.5))
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render)
    }

    let cancelled = false
    // Start once the display face is in, so the copy matches the headings.
    document.fonts.ready.then(() => {
      if (!cancelled) render()
    })
    render()
    document.addEventListener("scroll", schedule, { passive: true, capture: true })
    window.addEventListener("resize", schedule)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      document.removeEventListener("scroll", schedule, { capture: true })
      window.removeEventListener("resize", schedule)
      for (const m of marks) m.el.style.opacity = ""
      label.textContent = ZERO_WIDTH
      label.style.opacity = ""
      label.style.transform = ""
      target.textContent = ""
      slot.style.opacity = ""
    }
  }, [mounted])

  // The flying copy of a heading, portalled to the page root so it passes
  // over the navbar it is flying into. Same z-50 as the navbar and the
  // dialogs: later in the page than the navbar, earlier than any dialog
  // opened after it, so it never prints over the command palette or a modal.
  return mounted
    ? createPortal(
        <div ref={flyRef} aria-hidden className="pointer-events-none invisible fixed left-0 top-0 z-50 print:hidden">
          <div data-section-copy className="absolute left-0 top-0 origin-top-left whitespace-nowrap font-display leading-[1.05] text-foreground will-change-transform" />
        </div>,
        document.body,
      )
    : null
}
