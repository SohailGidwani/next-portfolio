"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { createChase } from "@/app/utils/chase"

const NAME = "Sohail Gidwani"
const LINES = ["Sohail", "Gidwani"]
// The navbar logo is "SohailG" and a square: the name with "idwani" taken
// out. These are the letters of the name (by their place in NAME) that
// become it, in logo order.
const KEPT = [0, 1, 2, 3, 4, 5, 7]
const LOGO = "SohailG"
// Pixels of scroll the docking beat takes, and the gap the word keeps under
// the navbar until it is over the logo's place.
const DOCK_SCROLL = 220
const CLEARANCE = 8

const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

/** The box of one character's glyph run: the same kind of box at any size, in any case. */
function glyphBox(node: Node, from = 0): DOMRect {
  const range = document.createRange()
  range.setStart(node, from)
  range.setEnd(node, from + 1)
  return range.getBoundingClientRect()
}

// The square after "Gidwani" is a full stop at this size, and grows into the
// logo's square on the way there. It hangs past the line (a negative right
// margin equal to its width and gap) so the centred name stays centred on
// the letters.
const SQUARE = "inline-block h-[0.17em] w-[0.17em] rounded-[0.045em] bg-accent"

/**
 * The hero's name, which becomes the navbar logo as the page scrolls:
 * "idwani" fades out, "Sohail" and the G rise and shrink into the corner, and
 * the full stop follows them, so the name lands as "SohailG" exactly. It is
 * set in the logo's own case, face and weight for that reason.
 *
 * The heading is real text and paints before any script. Once the page is
 * ready, the logo's seven letters and the square are handed to a fixed layer,
 * measured against the logo itself, and moved there by scroll position; on
 * arrival the real logo takes over, so nothing is left scaled. The logo is
 * hidden by CSS while the name is on the page (see globals.css). With reduced
 * motion none of this runs and the logo simply stays put.
 *
 * Letters are plain inline spans, not inline blocks, so the name keeps its
 * kerning at display size; that is also why the letters that fall away only
 * fade (an inline span cannot be transformed).
 */
export default function HeroName({ className, flyClass }: { className: string; flyClass: string }) {
  const nameRef = useRef<HTMLHeadingElement>(null)
  const flyRef = useRef<HTMLDivElement>(null)
  // The flying layer lives at the page root (see below), which only exists
  // in the browser, so it is added after the first render.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    // The logo is hidden by CSS while this page's name is meant to fly into
    // it. Whenever the flight cannot run, say so, and the CSS steps aside so
    // the logo is never left missing.
    const standDown = () => root.setAttribute("data-hero-flight", "off")

    const name = nameRef.current
    const fly = flyRef.current
    if (!name || !fly || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      standDown()
      return
    }
    const letters = Array.from(name.querySelectorAll<HTMLElement>("[data-ch]"))
    const nameSquare = name.querySelector<HTMLElement>("[data-square]")
    const clones = Array.from(fly.querySelectorAll<HTMLElement>("[data-clone]"))
    const at = (i: number) => letters.find((el) => el.dataset.ch === String(i))
    const kept = KEPT.map(at).filter((el): el is HTMLElement => Boolean(el))
    const dropped = letters.filter((el) => !KEPT.includes(Number(el.dataset.ch)))
    if (!nameSquare || kept.length !== KEPT.length || clones.length !== KEPT.length + 1) {
      standDown()
      return
    }

    /** The logo as it is right now (looked up fresh, so a re-rendered navbar is never missed). */
    const findLogo = () => {
      const logo = document.querySelector<HTMLElement>("[data-nav-logo]")
      const text = logo ? Array.from(logo.childNodes).find((node) => node.nodeType === Node.TEXT_NODE) : undefined
      const square = logo?.querySelector<HTMLElement>("span")
      const from = text?.textContent?.indexOf(LOGO) ?? -1
      return logo && text && square && from >= 0 ? { logo, text, square, from } : null
    }

    const scrolledNow = () => Math.max(window.scrollY, document.scrollingElement?.scrollTop ?? 0)
    const navBottom = () => findLogo()?.logo.closest("header")?.getBoundingClientRect().bottom ?? 64
    /** Whether the navbar shows its links in the middle (desktop) that the word must not cross. */
    const crowdedNav = () => {
      const links = document.querySelector<HTMLElement>('header nav[aria-label="Main navigation"]')
      return Boolean(links && links.offsetParent !== null)
    }

    let offset: { x: number; y: number }[] = []
    let size = ""
    let distance = 300
    let assembleUntil = 0.4
    let raf = 0
    // The flight is drawn from a value that chases the scroll, so a fast
    // flick still shows the name gliding into the logo.
    const chase = createChase()
    let running = false
    let lastLogo: HTMLElement | null = null

    /** Size the flying copies to the heading and find where each glyph sits inside its copy. */
    const setup = () => {
      // The heading's size is in container units, which mean nothing in the
      // fixed layer, so the copies take its measured size.
      size = getComputedStyle(name).fontSize
      for (const clone of clones) {
        clone.style.fontSize = size
        clone.style.transform = "none"
      }
      offset = clones.map((clone) => {
        const box = clone.getBoundingClientRect()
        const inner = clone.firstElementChild as HTMLElement
        const r = inner.firstChild ? glyphBox(inner.firstChild) : inner.getBoundingClientRect()
        return { x: r.left - box.left, y: r.top - box.top }
      })
      // Pace the beats to this screen: the name finishes assembling just as
      // it scrolls up to the navbar, then docking takes a fixed stretch.
      const restTop = glyphBox(kept[0].firstChild as Node).top + scrolledNow()
      // Desktop gets room to read the first beat (the name waits under the
      // navbar if it gets there first); phones keep to the name's own path.
      const least = crowdedNav() ? 150 : 60
      const assembleScroll = Math.min(260, Math.max(least, restTop - (navBottom() + CLEARANCE)))
      distance = assembleScroll + DOCK_SCROLL
      assembleUntil = assembleScroll / distance
    }

    /** Hand everything back: the heading's own letters, and the logo. */
    const stop = () => {
      running = false
      fly.style.visibility = "hidden"
      for (const el of letters) el.style.opacity = ""
      nameSquare.style.opacity = ""
      if (lastLogo) lastLogo.style.opacity = ""
      standDown()
    }

    const render = () => {
      raf = 0
      if (!running) return
      const target = findLogo()
      if (!target) return stop()
      if (lastLogo && lastLogo !== target.logo) lastLogo.style.opacity = ""
      lastLogo = target.logo
      if (getComputedStyle(name).fontSize !== size) setup()

      const { value: p, settled } = chase.step(clamp01(scrolledNow() / distance), performance.now())
      // Keep drawing until the flight has caught up with the scroll.
      if (!settled) raf = requestAnimationFrame(render)
      const docked = p >= 1
      // Two beats. First the name assembles into the logo's word at full
      // size: "idwani" fades, the G closes on "Sohail", and the full stop
      // comes with it. Then that word shrinks into the navbar as one rigid
      // piece, so no letter ever crosses another.
      const assembling = clamp01(p / assembleUntil)
      const assemble = easeInOut(assembling)
      const docking = clamp01((p - assembleUntil) / (1 - assembleUntil))
      const dock = easeInOut(docking)
      const dockEarly = 1 - (1 - docking) * (1 - docking) * (1 - docking)
      // As "idwani" fades, the full stop closes up behind the G, and from
      // then on the two move as one: along their own line through the space
      // "idwani" has left, then straight up beside the l, so they never cut
      // across "Sohail".
      const collapse = easeInOut(clamp01(assembling / 0.3))
      const slide = easeInOut(clamp01((assembling - 0.3) / 0.36))
      const rise = easeInOut(clamp01((assembling - 0.66) / 0.34))

      // Everything is measured as it is this frame: each piece where it sits
      // in the heading (invisible, but laid out, so it moves with the page)
      // and where its twin sits in the logo. Nothing measured earlier can go
      // stale, whatever the zoom, scroll restoration or layout does.
      const here: DOMRect[] = []
      const there: DOMRect[] = []
      for (let i = 0; i < clones.length; i++) {
        here.push(i < KEPT.length ? glyphBox(kept[i].firstChild as Node) : nameSquare.getBoundingClientRect())
        there.push(i < KEPT.length ? glyphBox(target.text, target.from + i) : target.square.getBoundingClientRect())
        if (!here[i].height || !there[i].height) return stop()
      }
      // The logo's word at the heading's size, laid out from where the S
      // stands: the logo's own spacing, scaled up by the size difference.
      const grow = here[0].height / there[0].height
      const G = KEPT.length - 1
      const SQ = KEPT.length
      const gX = here[0].left + (there[G].left - there[0].left) * grow
      const gY = here[0].top + (there[G].top - there[0].top) * grow
      const placed: { x: number; y: number; scale: number }[] = []
      // The word: letters laid out with the logo's own spacing scaled up;
      // the square stays a full stop, on the baseline just after the G, and
      // only becomes the logo's square in the second beat.
      const word = here.map((s, i) => ({
        x: i === SQ ? gX + here[G].width + parseFloat(size) * 0.06 : here[0].left + (there[i].left - there[0].left) * grow,
        y: i === SQ ? gY + (s.top - here[G].top) : here[0].top + (there[i].top - there[0].top) * grow,
        scale: i === SQ ? 1 : (there[i].height * grow) / s.height,
      }))
      // Second beat, as one piece: the S (the anchor) heads left early and
      // rises late, and the word's own layout shrinks around it on a single
      // curve, so every piece, the full stop included, keeps its place.
      const anchorX = word[0].x + (there[0].left - word[0].x) * dockEarly
      const anchorY = word[0].y + (there[0].top - word[0].y) * dock
      for (let i = 0; i < clones.length; i++) {
        const s = here[i]
        const t = there[i]
        let x: number
        let y: number
        let scale: number
        if (dock === 0 && i === SQ) {
          // The full stop: closing up behind the G, then fixed to it.
          const g = placed[G]
          const behindX = g.x + (here[G].width + parseFloat(size) * 0.06) * g.scale
          const behindY = g.y + (s.top - here[G].top) * g.scale
          x = s.left + (behindX - s.left) * collapse
          y = s.top + (behindY - s.top) * collapse
          scale = 1
        } else if (dock === 0) {
          const across = i === G ? slide : assemble
          const up = i === G ? rise : assemble
          x = s.left + (word[i].x - s.left) * across
          y = s.top + (word[i].y - s.top) * up
          scale = 1 + (word[i].scale - 1) * assemble
        } else {
          const fromX = word[i].x - word[0].x
          const fromY = word[i].y - word[0].y
          x = anchorX + fromX + (t.left - there[0].left - fromX) * dockEarly
          y = anchorY + fromY + (t.top - there[0].top - fromY) * dockEarly
          scale = word[i].scale + (t.height / s.height - word[i].scale) * dockEarly
        }
        placed.push({ x, y, scale })
      }
      // Where the navbar has links in the middle (desktop), the word waits
      // just under it while it shrinks and moves left, and only rises into
      // the bar over the logo's own place, never crossing the links.
      // Either way it never rides off the top of the screen: on phones it
      // holds at the logo's own height, in the empty left of the bar.
      const release = easeInOut(clamp01((docking - 0.55) / 0.45))
      const hold = crowdedNav() ? navBottom() + CLEARANCE : there[0].top
      const floor = hold + (there[0].top - hold) * release
      const lift = Math.max(0, floor - placed[0].y)
      placed.forEach(({ x, y, scale }, i) => {
        clones[i].style.transform = `translate3d(${(x - offset[i].x * scale).toFixed(2)}px, ${(y + lift - offset[i].y * scale).toFixed(2)}px, 0) scale(${scale.toFixed(4)})`
      })
      fly.style.visibility = docked ? "hidden" : "visible"
      target.logo.style.opacity = docked ? "1" : ""

      // "idwani" fades out first, right to left, just ahead of the full stop
      // closing up behind the G, like a cursor deleting the word.
      dropped.forEach((el, i) => {
        el.style.opacity = String(1 - clamp01((assembling - (dropped.length - 1 - i) * 0.045) / 0.08))
      })
    }
    const schedule = () => {
      if (running && !raf) raf = requestAnimationFrame(render)
    }

    let cancelled = false
    const begin = () => {
      if (running || cancelled) return
      running = true
      setup()
      // Hand the logo's letters over to the flying layer.
      for (const el of kept) el.style.opacity = "0"
      nameSquare.style.opacity = "0"
      root.setAttribute("data-hero-flight", "on")
      render()
    }
    // Start once the display face is in (so the copies match the heading),
    // but never wait on it for long.
    const fontWait = window.setTimeout(begin, 2500)
    document.fonts.ready.then(begin)
    const resize = new ResizeObserver(() => {
      if (!running) return
      setup()
      render()
    })
    resize.observe(name)
    // Capture, so a scroll anywhere on the page is heard.
    document.addEventListener("scroll", schedule, { passive: true, capture: true })
    window.addEventListener("resize", schedule)

    return () => {
      cancelled = true
      window.clearTimeout(fontWait)
      cancelAnimationFrame(raf)
      resize.disconnect()
      document.removeEventListener("scroll", schedule, { capture: true })
      window.removeEventListener("resize", schedule)
      running = false
      fly.style.visibility = "hidden"
      if (lastLogo) lastLogo.style.opacity = ""
      root.removeAttribute("data-hero-flight")
      for (const el of letters) el.style.opacity = ""
      nameSquare.style.opacity = ""
    }
  }, [mounted])

  let index = 0
  return (
    <>
      <h1 ref={nameRef} className={className} aria-label={NAME} data-hero-name>
        {LINES.map((line, li) => {
          const first = index
          index += line.length + 1 // the space between the words
          return (
            <span key={line} className="block pb-[0.06em] -mb-[0.06em]">
              {Array.from(line).map((ch, k) => (
                <span key={k} data-ch={first + k}>
                  {ch}
                </span>
              ))}
              {li === LINES.length - 1 ? <span data-square aria-hidden className={`ml-[0.06em] -mr-[0.23em] ${SQUARE}`} /> : null}
            </span>
          )
        })}
      </h1>

      {/* The flying layer: the logo's seven letters and its square. Portalled
          to the page root: inside the hero's stacking context its z-index
          could never lift it over the navbar it is flying into. It sits at
          the navbar's own z-50 and wins by coming later in the page; dialogs
          (command palette, menu, modals) are z-50 portals appended when they
          open, so they land on top of it. Anything higher would print the
          flying letters over an open dialog. */}
      {mounted
        ? createPortal(
            <div ref={flyRef} aria-hidden className="pointer-events-none invisible fixed left-0 top-0 z-50 print:hidden">
              {[...KEPT.map((i) => NAME[i]), ""].map((ch, i) => (
                <div key={i} data-clone className={`absolute left-0 top-0 origin-top-left whitespace-nowrap will-change-transform ${flyClass}`}>
                  {ch ? <span>{ch}</span> : <span className={`block ${SQUARE}`} />}
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
