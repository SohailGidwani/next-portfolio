"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { List, Check } from "lucide-react"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog"
import { useMediaQuery } from "@/app/hooks/useMediaQuery"
import { useSheetDrag } from "@/app/hooks/useSheetDrag"
import { triggerHaptic } from "./ui/haptics"
import { smoothScrollToId } from "@/app/utils/smoothScroll"
import { HEADING_OFFSET, type TocItem } from "./SectionTOC"

/** Fired when a chapter is picked, so a collapsed MobileSection can open itself. */
export const CHAPTER_OPEN_EVENT = "chapter:open"

const SHOW_AFTER_PX = 400

/**
 * Wayfinding for long pages on anything narrower than the SectionTOC rail.
 *
 * SectionTOC only appears at 1200px and up, which left every phone and
 * tablet reader scrolling thirty screens with no map and no sense of how
 * much was left. This is the counterpart: a pill in the thumb arc showing
 * position ("03 / 14"), opening a sheet that lists every chapter.
 *
 * Fixed position, so mounting it after hydration costs no layout shift.
 */
export default function MobileChapterNav({ items }: { items: TocItem[] }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const reduced = useReducedMotion() ?? false
  const frame = useRef<number | null>(null)
  // Complements SectionTOC exactly: this hides where that rail appears.
  const showsPill = useMediaQuery("(max-width: 1199px)")
  // Same drag-to-dismiss physics as the nav sheet.
  const { sheetRef, sheetHandlers } = useSheetDrag(() => setOpen(false))

  /**
   * Position is derived from scroll offset rather than observed crossings.
   * An IntersectionObserver only speaks when a heading physically passes its
   * band, so a jump, an anchor link, or a reload halfway down leaves the
   * readout stuck on chapter one. Reading positions directly is always right,
   * and fourteen getBoundingClientRect calls per frame is nothing.
   */
  useEffect(() => {
    const read = () => {
      frame.current = null
      setVisible(window.scrollY > SHOW_AFTER_PX)
      // The chapter you are "in" is the last one whose heading is above the
      // reading line, a third of the way down the viewport.
      const line = window.innerHeight * 0.33
      let current = 0
      items.forEach((item, i) => {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= line) current = i
      })
      setActiveIndex(current)
    }

    const onScroll = () => {
      if (frame.current !== null) return
      frame.current = requestAnimationFrame(read)
    }

    read()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame.current !== null) cancelAnimationFrame(frame.current)
    }
  }, [items])

  const active = items[activeIndex]
  const activeId = active?.id ?? ""

  const jump = (id: string) => {
    triggerHaptic()
    setOpen(false)
    // Ask the chapter to open before scrolling, so the target is already at
    // its full height when the scroll lands.
    window.dispatchEvent(new CustomEvent(CHAPTER_OPEN_EVENT, { detail: id }))
    // smoothScrollTo rather than scrollIntoView, so a chapter jump is paced
    // by distance and killed under reduced motion like every other scroll
    // on the site. It reads the preference itself, so no ternary here.
    requestAnimationFrame(() => {
      smoothScrollToId(id, { offset: HEADING_OFFSET })
    })
  }

  if (!showsPill) return null

  return (
    <>
      <AnimatePresence>
        {visible && !open && (
          <motion.button
            type="button"
            onClick={() => {
              triggerHaptic()
              setOpen(true)
            }}
            /* Centring lives here, not in a -translate-x-1/2 class: framer
               writes transform inline and would overwrite the utility. */
            initial={reduced ? { opacity: 0, x: "-50%" } : { opacity: 0, x: "-50%", y: 12, scale: 0.97 }}
            animate={{ opacity: 1, x: "-50%", y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0, x: "-50%" } : { opacity: 0, x: "-50%", y: 12, scale: 0.97 }}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
            aria-label={`Chapter ${activeIndex + 1} of ${items.length}: ${active?.label ?? ""}. Open chapter list`}
            className="chapter-pill fixed left-1/2 z-40 flex min-h-[44px] max-w-[86vw] items-center gap-2.5 rounded-full border border-border bg-card/95 px-4 py-2.5 shadow-lg backdrop-blur"
          >
            <List aria-hidden className="h-4 w-4 shrink-0 text-accent" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
              {String(activeIndex + 1).padStart(2, "0")}
              <span className="text-muted-foreground">/{items.length}</span>
            </span>
            <span className="truncate font-body text-xs font-semibold text-foreground">
              {active?.label}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showClose={false}
          ref={sheetRef}
          {...sheetHandlers}
          style={{ touchAction: "none" }}
          className="mobile-sheet bottom-0 left-0 right-0 top-auto h-auto max-h-[80dvh] w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-none rounded-t-md border-x-0 border-b-0 bg-background p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] sm:rounded-none sm:rounded-t-md"
        >
          <div aria-hidden className="mx-auto mb-2 h-1 w-9 rounded-[2px] bg-border" />
          <DialogTitle className="px-4 pb-1 pt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            On this page
          </DialogTitle>
          <DialogDescription className="sr-only">
            Jump to any chapter of this page.
          </DialogDescription>
          <nav className="flex flex-col gap-0.5 pb-1" aria-label="Chapters">
            {items.map((item, index) => {
              const isActive = item.id === activeId
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => jump(item.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`mobile-nav-item flex min-h-[44px] items-center gap-3 rounded px-4 py-3 text-left transition-transform active:scale-[0.98] ${
                    isActive ? "bg-card2 text-foreground" : "text-muted-foreground"
                  }`}
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  <span
                    className={`w-6 shrink-0 font-mono text-[11px] uppercase tracking-[0.15em] ${
                      isActive ? "text-accent" : "text-muted-foreground/60"
                    }`}
                  >
                    {item.n}
                  </span>
                  <span className="flex-1 font-body text-sm font-semibold">{item.label}</span>
                  {isActive && <Check aria-hidden className="h-4 w-4 shrink-0 text-accent" />}
                </button>
              )
            })}
          </nav>
        </DialogContent>
      </Dialog>
    </>
  )
}
