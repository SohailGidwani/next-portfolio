"use client"

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { useReducedMotion } from "framer-motion"
import { triggerHaptic } from "./ui/haptics"

/**
 * Card sections as a swipeable deck on phones, unchanged grid on desktop.
 *
 * Six project cards stacked vertically cost two and a half screens of
 * scrolling on a phone, most of it card chrome. Laterally they cost one,
 * and browsing them becomes a thumb flick instead of a scroll marathon.
 *
 * The deck itself is pure CSS scroll-snap, so it works in the server HTML
 * with no JS at all. This component only adds the position readout, which
 * is what tells a reader how many cards are left.
 */
export default function CardDeck({
  children,
  label,
  className = "",
}: {
  children: ReactNode
  /** Names the deck for screen readers, e.g. "Projects". */
  label: string
  /** Desktop grid classes, applied from sm up where the deck goes quiet. */
  className?: string
}) {
  const count = Children.count(children)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const frame = useRef<number | null>(null)
  // Tracked in a ref so the haptic fires on a real change, not on re-render.
  const lastIndex = useRef(0)
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion() ?? false

  // Cards snap centred, so position is whichever card's centre sits nearest
  // the middle of the scrollport.
  const measure = useCallback(() => {
    const el = scrollerRef.current
    if (!el) return
    const box = el.getBoundingClientRect()
    const mid = box.left + box.width / 2
    let nearest = 0
    let shortest = Infinity
    const cards = Array.from(el.children) as HTMLElement[]
    cards.forEach((card, i) => {
      const r = card.getBoundingClientRect()
      const distance = Math.abs(r.left + r.width / 2 - mid)
      if (distance < shortest) {
        shortest = distance
        nearest = i
      }
    })
    // A short tick each time a new card takes the centre, so a swipe feels
    // like the card clicking into place rather than sliding silently.
    if (nearest !== lastIndex.current) {
      lastIndex.current = nearest
      triggerHaptic(8)
    }
    setIndex(nearest)
  }, [])

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const onScroll = () => {
      if (frame.current !== null) return
      frame.current = requestAnimationFrame(() => {
        frame.current = null
        measure()
      })
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      el.removeEventListener("scroll", onScroll)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [measure])

  const goTo = (i: number) => {
    const el = scrollerRef.current
    const card = el?.children[i] as HTMLElement | undefined
    if (!el || !card) return
    el.scrollTo({
      left: card.offsetLeft + card.offsetWidth / 2 - el.clientWidth / 2,
      behavior: reduced ? "auto" : "smooth",
    })
  }

  return (
    <div>
      <div ref={scrollerRef} className={`m-deck ${className}`} role="group" aria-label={label}>
        {children}
      </div>

      {/* Position readout: phones only, where the deck is actually a deck. */}
      <div className="mt-1 flex items-center gap-3 sm:hidden">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
          <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
          {` / ${String(count).padStart(2, "0")}`}
        </span>
        <div className="flex flex-1 items-center gap-1.5">
          {Array.from({ length: count }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${label} card ${i + 1} of ${count}`}
              aria-current={i === index ? "true" : undefined}
              /* The visible bar is 3px, but the button carries a full 44px
                 of hit height so it clears the touch-target minimum. */
              className="flex h-11 flex-1 items-center"
            >
              <span
                className={`block h-[3px] w-full rounded-[2px] transition-colors duration-200 ${
                  i === index ? "bg-accent" : "bg-border"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
