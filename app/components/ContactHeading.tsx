"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { createChase } from "@/app/utils/chase"

const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** The box of one character's glyph run, as it is drawn (after text-transform). */
function glyphBox(node: Node, from: number): DOMRect {
  const range = document.createRange()
  range.setStart(node, from)
  range.setEnd(node, from + 1)
  return range.getBoundingClientRect()
}

// When things happen, by where the heading's first line is, as a share of
// the screen height from the top: the logo's square starts to stretch while
// the heading is still below the fold, tears as it comes into view, and the
// torn-off square has landed by the time the line is at END_AT. The stretch
// and the flight each get at least MIN_STRETCH and MIN_FLIGHT of the screen
// height to play out in. If the page runs out first, everything moves
// earlier so the landing still happens.
const STRETCH_AT = 1.25
const TEAR_AT = 0.9
const END_AT = 0.42
const MIN_STRETCH = 0.2
const MIN_FLIGHT = 0.3
// The stretch waits until the last section title above Contact has flown
// into the navbar (see SectionDock), plus this many pixels, so the bar is
// still when the square starts to pull out of it.
const QUIET_GAP = 24
// How long the tear takes to snap, in milliseconds. It is an event, so it
// runs on its own clock rather than at the pace of the scroll.
const TEAR_MS = 240

// The same full stop as the end of the hero's name, at the same share of
// the type size.
const STOP = "inline-block h-[0.17em] w-[0.17em] rounded-[0.045em] bg-accent"

/**
 * The Contact heading, closed by a square torn from the logo's own. The page
 * opens with the hero's full stop flying up into the navbar as the logo's
 * mark; here the mark gives the heading its full stop. As Contact comes near,
 * the logo's square stretches down out of the navbar and thins in the middle
 * until it tears in two: one square stays in the logo, the other sweeps over
 * "Let's work" and down past its end in one curve, curling in to close
 * "Together". Scrolling back up takes it home, where it joins the logo's
 * square again.
 *
 * Built like the hero's flight: the heading is real text with the square in
 * it, painted before any script; a fixed layer draws the stretch and the
 * torn-off square, measured against the logo and the heading every frame,
 * from a value that chases the scroll so a fast flick still shows the move.
 * The logo's own square is never touched. With reduced motion nothing moves
 * and the square simply sits in the heading.
 */
export default function ContactHeading({ className }: { className: string }) {
  const firstRef = useRef<HTMLSpanElement>(null)
  const secondRef = useRef<HTMLSpanElement>(null)
  const stopRef = useRef<HTMLSpanElement>(null)
  const flyRef = useRef<HTMLDivElement>(null)
  // The flying layer lives at the page root, which only exists in the
  // browser, so it is added after the first render.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    const first = firstRef.current?.firstChild
    const second = secondRef.current?.firstChild
    const stop = stopRef.current
    const fly = flyRef.current
    if (!first?.textContent || !second?.textContent || !stop || !fly) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const lastOfFirst = first.textContent.length - 1
    const lastOfSecond = second.textContent.length - 1
    const piece = (name: string) => fly.querySelector<HTMLElement>(`[data-piece="${name}"]`)!
    const drop = piece("drop")
    const bridge = piece("bridge")
    const stubTop = piece("stub-top")
    const stubBottom = piece("stub-bottom")

    const findLogoSquare = () => document.querySelector<HTMLElement>("[data-nav-logo] > span")
    const scrolledNow = () => Math.max(window.scrollY, document.scrollingElement?.scrollTop ?? 0)

    const chase = createChase()
    let raf = 0
    let running = false
    let drawnSize = 0
    // When the square tore, or null while it is whole.
    let tornAt: number | null = null

    const restore = () => {
      fly.style.visibility = "hidden"
      stop.style.opacity = ""
    }
    /** A plain bar of the accent, by its box. */
    const bar = (el: HTMLElement, x: number, y: number, w: number, h: number) => {
      el.style.visibility = w > 0.2 && h > 0.2 ? "visible" : "hidden"
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`
      el.style.width = `${w.toFixed(2)}px`
      el.style.height = `${h.toFixed(2)}px`
    }

    const render = () => {
      raf = 0
      if (!running) return
      const logoSquare = findLogoSquare()
      // Everything as it is this frame: the logo's square, the heading's
      // (invisible but laid out, so it moves with the page), and the last
      // letter of each line.
      const from = logoSquare?.getBoundingClientRect()
      const to = stop.getBoundingClientRect()
      const k = glyphBox(first, lastOfFirst)
      const r = glyphBox(second, lastOfSecond)
      if (!from?.height || !to.height || !k.height || !r.height) {
        running = false
        return restore()
      }
      const now = performance.now()

      const view = window.innerHeight
      const scrolled = scrolledNow()
      const top = k.top + scrolled
      const header = logoSquare!.closest("header")?.getBoundingClientRect()
      const navBottom = header?.bottom ?? 0
      // A section title lands in the navbar as its top reaches the bar's
      // bottom edge; find the scroll at which the last one above us does.
      let quiet = 0
      for (const title of document.querySelectorAll<HTMLElement>("[data-section-title]")) {
        const at = title.getBoundingClientRect().top + scrolled
        if (at < top) quiet = Math.max(quiet, at - navBottom + QUIET_GAP)
      }
      let start = Math.max(top - STRETCH_AT * view, quiet)
      let tear = Math.max(top - TEAR_AT * view, start + MIN_STRETCH * view)
      let end = Math.max(top - END_AT * view, tear + MIN_FLIGHT * view)
      const bottom = document.documentElement.scrollHeight - view
      if (end > bottom) {
        end = bottom
        tear = Math.min(tear, end - MIN_FLIGHT * view)
        start = Math.min(start, tear - MIN_STRETCH * view)
      }
      const span = Math.max(1, end - start)
      const tearAt = (tear - start) / span
      const { value: p, settled } = chase.step(clamp01((scrolled - start) / span), now)

      // Tear on the way down; join again just below that on the way back,
      // so resting on the line never flickers between the two.
      if (tornAt === null && p >= tearAt) tornAt = now
      else if (tornAt !== null && p < tearAt * 0.97) tornAt = null
      const snap = tornAt === null ? 0 : clamp01((now - tornAt) / TEAR_MS)

      // Keep drawing until the flight has caught up with the scroll and the
      // tear has finished snapping.
      if (!settled || (tornAt !== null && snap < 1)) raf = requestAnimationFrame(render)

      const home = p <= 0
      const landed = p >= 1 && snap >= 1
      fly.style.visibility = home || landed ? "hidden" : "visible"
      stop.style.opacity = landed ? "" : "0"
      if (home || landed) return

      const s = from.width
      // How far the square stretches: out of the bottom of the navbar, so
      // the piece that tears off has left the bar.
      const reach = Math.max(3 * s, navBottom - from.bottom + 1.5 * s)

      let x: number
      let y: number
      let size: number
      if (tornAt === null) {
        // Stretching: the lower end pulls down at the pace of the scroll,
        // and the middle thins faster the closer it gets to giving way.
        const e = p / tearAt
        const pull = reach * e * e * (3 - 2 * e)
        const neck = s * (1 - 0.7 * e * e * e)
        x = from.left
        y = from.top + pull
        size = s
        bar(bridge, from.left + (s - neck) / 2, from.top + s / 2, neck, pull)
        bar(stubTop, 0, 0, 0, 0)
        bar(stubBottom, 0, 0, 0, 0)
      } else {
        // Torn: each half of the thin middle springs back into its square,
        // and the lower square goes on to the heading.
        const fromX = from.left
        const fromY = from.top + reach
        const f = clamp01((p - tearAt) / (1 - tearAt))

        // One unbroken curve to its place behind the R: over the top of
        // "Let's work", down past the end of it heading straight down, then
        // curling left into place, arriving level with the line. Two cubic
        // pieces meet past the end of "Let's work" with the same direction
        // and speed, so the square never stops or turns sharply on the way.
        const gap = to.left - r.right
        // The column it comes down: clear of the K by a gap and a square,
        // since a curve cuts in a little as it straightens out.
        const lane = Math.max(k.right + gap + to.width, to.left)
        // Where it passes the first line: its own top level with where it
        // would sit on that line's baseline.
        const passY = to.top - (r.top - k.top)
        const lead = 0.6 * Math.max(0, passY - fromY)
        const curl = 0.55 * Math.max(0, to.top - passY)
        const a = lead + curl > 0 ? lead / (lead + curl) : 0.5
        // It leaves with the snap's momentum and slows only as it settles,
        // so nothing hangs under the navbar after the tear.
        const u = 1 - (1 - f) * (1 - f)
        const cubic = (p0: number, p1: number, p2: number, p3: number, t: number) => {
          const m = 1 - t
          return m * m * m * p0 + 3 * m * m * t * p1 + 3 * m * t * t * p2 + t * t * t * p3
        }
        if (u <= a) {
          const t = a > 0 ? u / a : 1
          x = cubic(fromX, fromX + 0.5 * (lane - fromX), lane, lane, t)
          y = cubic(fromY, fromY + 0.15 * (passY - fromY), passY - lead, passY, t)
        } else {
          const t = (u - a) / (1 - a)
          x = cubic(lane, lane, to.left + 0.55 * (lane - to.left), to.left, t)
          y = cubic(passY, passY + curl, to.top, to.top, t)
        }
        // It reaches full size on the way to the first line, so it passes
        // the big letters as the full stop it is about to be.
        size = s + (to.width - s) * easeInOut(clamp01(u / Math.max(a, 0.01)))
        // A last guard for layouts nothing above foresaw: never let the
        // square overlap the first line's letters.
        const lineLeft = glyphBox(first, 0).left
        if (x < k.right && x + size > lineLeft && y < k.bottom && y + size > k.top) x = k.right + 1

        const spring = 1 - Math.pow(1 - snap, 3)
        const thin = s * 0.3
        const half = (reach / 2) * (1 - spring)
        bar(bridge, 0, 0, 0, 0)
        bar(stubTop, from.left + (s - thin) / 2, from.top + s / 2, thin, half)
        bar(stubBottom, x! + (size! - thin) / 2, y! + size! / 2 - half, thin, half)
      }

      // The torn-off square is drawn at the heading's size and scaled down,
      // so it is crisp where it is largest.
      if (drawnSize !== to.width) {
        drawnSize = to.width
        drop.style.width = `${to.width}px`
        drop.style.height = `${to.height}px`
      }
      drop.style.transform = `translate3d(${x!.toFixed(2)}px, ${y!.toFixed(2)}px, 0) scale(${(size! / to.width).toFixed(4)})`
    }
    const schedule = () => {
      if (running && !raf) raf = requestAnimationFrame(render)
    }

    let cancelled = false
    const begin = () => {
      if (running || cancelled) return
      running = true
      render()
    }
    // Start once the display face is in, so the letters are measured in it,
    // but never wait on it for long.
    const fontWait = window.setTimeout(begin, 2500)
    document.fonts.ready.then(begin)
    const resize = new ResizeObserver(schedule)
    resize.observe(stop.parentElement ?? stop)
    // Capture, so a scroll anywhere on the page is heard.
    document.addEventListener("scroll", schedule, { passive: true, capture: true })
    window.addEventListener("resize", schedule)

    return () => {
      cancelled = true
      running = false
      window.clearTimeout(fontWait)
      cancelAnimationFrame(raf)
      resize.disconnect()
      document.removeEventListener("scroll", schedule, { capture: true })
      window.removeEventListener("resize", schedule)
      restore()
    }
  }, [mounted])

  return (
    <>
      <h2 className={className}>
        <span ref={firstRef} className="block text-foreground">Let&apos;s work</span>
        <span className="block whitespace-nowrap text-foreground">
          <span ref={secondRef}>Together</span>
          <span ref={stopRef} aria-hidden className={`ml-[0.06em] ${STOP}`} />
        </span>
      </h2>

      {/* The stretch and the torn-off square. Portalled to the page root at the navbar's own
          z-50, like the hero's flight: it wins by coming later in the page,
          and dialogs, appended when they open, still land on top of it. */}
      {mounted
        ? createPortal(
            <div ref={flyRef} aria-hidden className="pointer-events-none invisible fixed left-0 top-0 z-50 print:hidden">
              {/* The stretched middle while the square is whole, the two
                  halves of it springing back once it tears, and the square
                  that tears off. */}
              <div data-piece="bridge" className="absolute left-0 top-0 bg-accent" />
              <div data-piece="stub-top" className="absolute left-0 top-0 bg-accent" />
              <div data-piece="stub-bottom" className="absolute left-0 top-0 bg-accent" />
              <div data-piece="drop" className="absolute left-0 top-0 origin-top-left rounded-[26%] bg-accent will-change-transform" />
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
