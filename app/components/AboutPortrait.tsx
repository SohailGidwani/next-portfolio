"use client"

import Image from "next/image"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import portrait from "@/public/images/personal/SohailGidwani.jpg"

/**
 * Homepage portrait, running the same print-assembly choreography as /about:
 * the photo settles, the amber board slides out from behind it, registration
 * marks stamp in, the caption rule draws, the credit fades up.
 *
 * /about drives this from CSS keyframes on load, which cannot work here. This
 * section sits about six screens down, so a load-triggered animation would
 * finish long before anyone scrolled to it. Same curves, durations and delays
 * as the portrait-* keyframes, played on scroll instead. Variants on the
 * parent so the seven beats can never drift apart.
 */
const EASE_OUT_SOFT = [0.25, 1, 0.5, 1] as const
const EASE_SHEET = [0.32, 0.72, 0, 1] as const

/** Down and to the right, matching the resting offset of the /about board. */
const BOARD_OFFSET = 10

export default function AboutPortrait() {
  const reduceMotion = useReducedMotion()

  /** Reduced motion keeps every element, just skips the travel. */
  const settle = (duration: number, delay: number, ease: readonly number[]) =>
    reduceMotion ? { duration: 0 } : { duration, delay, ease: ease as number[] }

  const photo: Variants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    shown: { opacity: 1, y: 0, transition: settle(0.5, 0, EASE_OUT_SOFT) },
  }

  const board: Variants = {
    hidden: reduceMotion
      ? { opacity: 1, x: BOARD_OFFSET, y: BOARD_OFFSET }
      : { opacity: 0, x: 0, y: 0 },
    shown: {
      opacity: 1,
      x: BOARD_OFFSET,
      y: BOARD_OFFSET,
      transition: settle(0.45, 0.25, EASE_SHEET),
    },
  }

  // Not scale(0): nothing in the real world appears from nothing. Starting
  // just under full size reads as the mark settling into place.
  const mark = (delay: number): Variants => ({
    hidden: reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 },
    shown: { opacity: 1, scale: 1, transition: settle(0.3, delay, EASE_OUT_SOFT) },
  })

  const rule: Variants = {
    hidden: reduceMotion ? { scaleX: 1 } : { scaleX: 0 },
    shown: { scaleX: 1, transition: settle(0.4, 0.7, EASE_SHEET) },
  }

  const caption: Variants = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 },
    shown: { opacity: 1, y: 0, transition: settle(0.35, 0.85, EASE_OUT_SOFT) },
  }

  return (
    <figure className="hidden min-w-0 self-start lg:block lg:pl-4 lg:pt-1">
      <motion.div initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.4 }}>
        <div className="group relative isolate">
          {/* Amber mounting block: slides out from behind the print */}
          <motion.div aria-hidden variants={board} className="absolute inset-0 -z-10 bg-accent" />

          {/* Registration marks stamp in; the block owns the fourth corner */}
          <motion.span
            aria-hidden
            variants={mark(0.5)}
            className="absolute -left-2 -top-2 h-3 w-3 origin-top-left border-l border-t border-foreground/40"
          />
          <motion.span
            aria-hidden
            variants={mark(0.56)}
            className="absolute -right-2 -top-2 h-3 w-3 origin-top-right border-r border-t border-foreground/40"
          />
          <motion.span
            aria-hidden
            variants={mark(0.62)}
            className="absolute -bottom-2 -left-2 h-3 w-3 origin-bottom-left border-b border-l border-foreground/40"
          />

          <motion.div
            variants={photo}
            className="relative aspect-[3/4] w-full overflow-hidden border border-border bg-background"
          >
            <Image
              src={portrait}
              alt="Sohail Gidwani, professional portrait"
              fill
              sizes="(min-width: 1280px) 380px, 320px"
              className="object-cover object-[50%_18%] [filter:sepia(0.12)_saturate(1.06)] transition-transform duration-700 ease-[var(--ease-out-soft)] group-hover:scale-[1.03]"
              priority={false}
            />
            {/* Same grading as /about: the light studio backdrop is carried
                into the page so the print does not read as a pasted sticker. */}
            <div aria-hidden className="portrait-vignette pointer-events-none absolute inset-0" />
          </motion.div>
        </div>

        <figcaption className="mt-4">
          <motion.span
            aria-hidden
            variants={rule}
            className="block h-px w-full origin-left bg-border"
          />
          <motion.div
            variants={caption}
            className="flex items-baseline justify-between gap-3 pt-2.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
          >
            <span>Fig. 01 · Sohail Gidwani</span>
            <span className="text-accent">LA · 2026</span>
          </motion.div>
        </figcaption>
      </motion.div>
    </figure>
  )
}
