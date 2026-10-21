"use client"

import { useEffect, useRef } from "react"
import { DRAWINGS, type Drawing } from "./heroDrawings"

/*
 * The hero's background: a pen plotter drawing one picture at a time beside the
 * name, things built and things loved. Fresh ink is the accent and dries to
 * grey behind the pen; between strokes the pen lifts and glides. When a drawing
 * is done its caption types in, it holds, fades, and the pen crosses to the
 * other side for the next one. A click on an empty part of the hero skips ahead.
 *
 * Centred layouts draw beside the name with a caption. When the hero is
 * left-aligned (phones) the drawing sits small to the right of the badge and
 * name, captioned only if there is room. Reduced motion shows the first
 * drawing finished and still.
 */

const SVG_NS = "http://www.w3.org/2000/svg"
// Pen speed in px of line per second at full size, and px per ms with the pen up.
const SPEED = 320
const TRAVEL = 1.1
const HOLD_MS = 4800
const FADE_MS = 1200
const TRAIL_MS = 1200
const CAPTION_CPS = 32
// The canvases cover only the drawing, plus this much room for the pen's halo.
const PAD = 24
// Scrolled this far, the drawing is gone and the name flies over a clear hero.
const FADE_SCROLL = 140

type Pt = [number, number]
type Layout = { ox: number; oy: number; s: number; caption: boolean }
type Job = {
  drawing: Drawing
  L: Layout
  strokes: Pt[][]
  total: number
  si: number
  pi: number
  drawn: number
  mode: "travel" | "draw" | "done"
  from: { x: number; y: number }
  t0: number
  doneAt: number
  fadeAt: number
}

const smooth = (a: number, b: number, v: number) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export default function PenPlotter() {
  const rootRef = useRef<HTMLDivElement>(null)
  const paperRef = useRef<HTMLCanvasElement>(null)
  const penRef = useRef<HTMLCanvasElement>(null)
  const tipRef = useRef<HTMLSpanElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const root = rootRef.current
    const paperEl = paperRef.current
    const penEl = penRef.current
    const captionEl = captionRef.current
    const tip = tipRef.current
    const hero = root?.closest("section")
    const paper = paperEl?.getContext("2d")
    const ink = penEl?.getContext("2d")
    if (!root || !paperEl || !penEl || !captionEl || !tip || !hero || !paper || !ink) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Path data is sampled through an SVG path element, then cached per step.
    const svg = document.createElementNS(SVG_NS, "svg")
    svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden"
    root.appendChild(svg)
    const cache = new Map<string, Pt[][]>()
    const strokesOf = (d: Drawing, step: number) => {
      const key = `${d.id}:${step.toFixed(2)}`
      const hit = cache.get(key)
      if (hit) return hit
      const el = document.createElementNS(SVG_NS, "path")
      el.setAttribute("d", d.d)
      svg.appendChild(el)
      const len = el.getTotalLength()
      const strokes: Pt[][] = []
      let cur: Pt[] = []
      let last: DOMPoint | null = null
      for (let l = 0; l <= len; l += step) {
        const p = el.getPointAtLength(l)
        // A jump between samples is where the path moves to a new stroke.
        if (!last || Math.hypot(p.x - last.x, p.y - last.y) > step * 3) {
          cur = []
          strokes.push(cur)
        }
        cur.push([p.x, p.y])
        last = p
      }
      el.remove()
      const out = strokes.filter((s) => s.length > 1)
      cache.set(key, out)
      return out
    }

    let w = 0
    let h = 0
    let dpr = 1
    let heroTop = 0
    let opacity = ""
    let fg = "#000"
    let accent = "#00f"
    let dark = false
    let job: Job | null = null
    let idx = 0
    let side = 1
    let raf = 0
    let holdTimer = 0
    let prev = -1
    let inView = true
    let ready = false
    let jobFade = 1
    let shown = -1
    const pen = { x: 0, y: 0 }
    const trail: number[] = []

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement)
      fg = cs.getPropertyValue("--fg").trim() || fg
      accent = cs.getPropertyValue("--accent").trim() || accent
      dark = document.documentElement.classList.contains("dark")
    }

    // From the scroll position alone, so a frame never forces a layout.
    const scrollFade = () => 1 - smooth(0, FADE_SCROLL, window.scrollY - heroTop)
    const applyOpacity = () => {
      const o = (scrollFade() * jobFade).toFixed(3)
      if (o !== opacity) root.style.opacity = opacity = o
    }

    // Where the drawing goes: beside the name when it is centred, else in the
    // space right of the badge and name.
    const layout = (): Layout | null => {
      const hr = hero.getBoundingClientRect()
      // The letters themselves: the name's lines are blocks as wide as the hero.
      const glyphs = hero.querySelectorAll("[data-hero-name] [data-ch], [data-hero-name] [data-square]")
      if (!glyphs.length) return null
      const nr = { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity }
      glyphs.forEach((g) => {
        const r = g.getBoundingClientRect()
        nr.left = Math.min(nr.left, r.left)
        nr.right = Math.max(nr.right, r.right)
        nr.top = Math.min(nr.top, r.top)
        nr.bottom = Math.max(nr.bottom, r.bottom)
      })
      const br = hero.querySelector("[data-hero-badge]")?.getBoundingClientRect() ?? nr
      const nameL = nr.left - hr.left
      const nameR = nr.right - hr.left
      const midY = (nr.top + nr.bottom) / 2 - hr.top
      if (nameL > w * 0.12) {
        const right = side > 0
        const from = right ? nameR + 24 : 16
        const to = right ? w - 16 : nameL - 24
        const s = Math.min((to - from) / 400, (h * 0.42) / 300, 1.05)
        if (s * 400 < 96) return null
        const cx = (from + to) / 2
        return { ox: cx - 200 * s, oy: midY - 150 * s, s, caption: s * 400 >= 200 }
      }
      const from = Math.max(nameR, br.right - hr.left) + 16
      const to = w - 16
      const top = br.top - hr.top
      const bottom = nr.bottom - hr.top
      const s = Math.min((to - from) / 400, (bottom - top) / 300)
      if (s * 400 < 80) return null
      return { ox: (from + to) / 2 - 200 * s, oy: top + (bottom - top) / 2 - 150 * s, s, caption: s * 400 >= 200 }
    }

    const size = () => {
      const r = hero.getBoundingClientRect()
      w = r.width
      h = r.height
      heroTop = r.top + window.scrollY
      dpr = Math.min(window.devicePixelRatio || 1, 2)
    }

    // Both canvases cover just this drawing's box; drawing still uses hero
    // coordinates through the transform. Full-hero canvases repainted every
    // frame dropped the page to ~20fps.
    const fit = (L: Layout) => {
      const x = Math.floor(L.ox - PAD)
      const y = Math.floor(L.oy - PAD)
      const bw = Math.ceil(400 * L.s + PAD * 2)
      const bh = Math.ceil(300 * L.s + PAD * 2)
      for (const [el, ctx] of [[paperEl, paper], [penEl, ink]] as const) {
        el.style.left = `${x}px`
        el.style.top = `${y}px`
        el.style.width = `${bw}px`
        el.style.height = `${bh}px`
        el.width = Math.round(bw * dpr)
        el.height = Math.round(bh * dpr)
        ctx.setTransform(dpr, 0, 0, dpr, -x * dpr, -y * dpr)
      }
    }
    const clear = (ctx: CanvasRenderingContext2D) => {
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
      ctx.restore()
    }

    const inkStyle = () => {
      const k = job ? Math.min(1, Math.max(0.7, job.L.s)) : 1
      paper.strokeStyle = fg
      paper.globalAlpha = dark ? 0.55 : 0.6
      paper.lineWidth = 1.3 * k
      paper.lineCap = "round"
      paper.lineJoin = "round"
    }

    // Moves the pen `budget` px along the strokes, inking the paper as it goes.
    const advance = (budget: number, t: number, maxPoints = Infinity, instant = false) => {
      if (!job) return
      inkStyle()
      let n = 0
      while (budget > 0 && job.si < job.strokes.length && n < maxPoints) {
        const st = job.strokes[job.si]
        if (job.mode === "travel") {
          if (!instant) return
          job.mode = "draw"
          pen.x = st[0][0]
          pen.y = st[0][1]
        }
        const a = st[job.pi]
        const b = st[job.pi + 1]
        if (!b) {
          trail.push(NaN, NaN, t)
          job.si++
          job.pi = 0
          if (job.si < job.strokes.length) {
            job.mode = "travel"
            job.from = { ...pen }
            job.t0 = t
          }
          continue
        }
        paper.beginPath()
        paper.moveTo(a[0], a[1])
        paper.lineTo(b[0], b[1])
        paper.stroke()
        trail.push(b[0], b[1], t)
        pen.x = b[0]
        pen.y = b[1]
        budget -= Math.hypot(b[0] - a[0], b[1] - a[1])
        job.pi++
        job.drawn++
        n++
      }
      if (job.si >= job.strokes.length) job.mode = "done"
    }

    // Redraws the paper up to the pen, after a theme change.
    const repaint = () => {
      if (!job) return
      clear(paper)
      inkStyle()
      paper.beginPath()
      job.strokes.forEach((st, si) => {
        if (si > job!.si) return
        const end = si < job!.si ? st.length - 1 : job!.pi
        if (end < 1) return
        paper.moveTo(st[0][0], st[0][1])
        for (let i = 1; i <= end; i++) paper.lineTo(st[i][0], st[i][1])
      })
      paper.stroke()
    }

    // Centred under the drawing, kept inside the hero. Measured at full length
    // so it doesn't shift while it types in.
    const placeCaption = () => {
      if (!job) return
      const { L, drawing } = job
      captionEl.style.width = ""
      captionEl.textContent = drawing.caption
      const cw = captionEl.offsetWidth
      captionEl.textContent = ""
      shown = -1
      captionEl.style.width = `${cw}px`
      captionEl.style.top = `${L.oy + 300 * L.s + 14}px`
      captionEl.style.left = `${Math.min(w - 8 - cw, Math.max(8, L.ox + 200 * L.s - cw / 2))}px`
    }

    const startJob = (predraw: number) => {
      clear(paper)
      clear(ink)
      trail.length = 0
      captionEl.textContent = ""
      jobFade = 1
      const L = layout()
      if (!L) {
        job = null
        tip.style.opacity = "0"
        applyOpacity()
        return
      }
      fit(L)
      const drawing = DRAWINGS[idx % DRAWINGS.length]
      const step = Math.max(0.8, 1.6 / L.s)
      const strokes = strokesOf(drawing, step).map((st) => st.map(([x, y]) => [L.ox + x * L.s, L.oy + y * L.s] as Pt))
      const total = strokes.reduce((n, st) => n + st.length - 1, 0)
      const first = strokes[0][0]
      if (!job) {
        pen.x = first[0]
        pen.y = first[1]
      }
      job = { drawing, L, strokes, total, si: 0, pi: 0, drawn: 0, mode: "travel", from: { ...pen }, t0: -1, doneAt: -1, fadeAt: -1 }
      placeCaption()
      if (predraw > 0) advance(Infinity, 0, predraw >= 1 ? Infinity : Math.floor(total * predraw), true)
      applyOpacity()
    }

    const typeCaption = (count: number) => {
      if (!job || !job.L.caption) return
      const text = job.drawing.caption
      const n = Math.min(text.length, Math.max(0, Math.floor(count)))
      if (n !== shown) {
        shown = n
        captionEl.textContent = text.slice(0, n)
      }
    }

    // Fresh ink, redrawn each frame on its own canvas. The pen tip is an
    // element moved by transform, so the pen gliding between drawings costs nothing.
    const drawPen = (t: number) => {
      clear(ink)
      while (trail.length && t - trail[2] > TRAIL_MS) trail.splice(0, 3)
      const k = job ? Math.min(1, Math.max(0.7, job.L.s)) : 1
      if (trail.length > 6) {
        ink.strokeStyle = accent
        ink.lineWidth = 1.6 * k
        ink.lineCap = "round"
        ink.lineJoin = "round"
        const n = trail.length / 3
        const parts = 8
        const per = Math.ceil(n / parts)
        for (let p = 0; p < parts; p++) {
          const i0 = p * per
          const i1 = Math.min(n - 1, (p + 1) * per)
          if (i1 <= i0) continue
          ink.globalAlpha = 0.9 * ((p + 1) / parts) ** 1.5
          ink.beginPath()
          let lifted = true
          for (let i = i0; i <= i1; i++) {
            const x = trail[i * 3]
            const y = trail[i * 3 + 1]
            if (Number.isNaN(x)) {
              lifted = true
              continue
            }
            if (lifted) ink.moveTo(x, y)
            else ink.lineTo(x, y)
            lifted = false
          }
          ink.stroke()
        }
        ink.globalAlpha = 1
      }
      const visible = !!job && job.mode !== "done"
      tip.style.opacity = visible ? (job!.mode === "travel" ? "0.7" : "1") : "0"
      if (visible) tip.style.transform = `translate3d(${pen.x}px, ${pen.y}px, 0) scale(${k})`
    }

    const next = () => {
      idx++
      side = -side
      startJob(0)
    }

    const frame = (t: number) => {
      raf = 0
      if (!ready || !job || !inView || document.hidden || scrollFade() <= 0) {
        prev = -1
        applyOpacity()
        return
      }
      // First frame after a wake uses a fixed step: rAF time can precede the wake.
      const dt = prev < 0 ? 1 / 60 : Math.min(0.05, (t - prev) / 1000)
      prev = t
      if (job.mode === "travel") {
        if (job.t0 < 0) job.t0 = t
        const target = job.strokes[job.si][0]
        const d = Math.hypot(target[0] - job.from.x, target[1] - job.from.y)
        const k = Math.min(1, (t - job.t0) / Math.max(120, d / TRAVEL))
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2
        pen.x = job.from.x + (target[0] - job.from.x) * e
        pen.y = job.from.y + (target[1] - job.from.y) * e
        if (k >= 1) job.mode = "draw"
      } else if (job.mode === "draw") {
        advance(dt * SPEED * Math.min(1, Math.max(0.45, job.L.s)), t)
      }
      if (job.mode === "done") {
        if (job.doneAt < 0) job.doneAt = t
        typeCaption(((t - job.doneAt - 150) / 1000) * CAPTION_CPS)
        if (job.fadeAt < 0 && t - job.doneAt > HOLD_MS) job.fadeAt = t
        if (job.fadeAt >= 0) {
          jobFade = 1 - smooth(0, FADE_MS, t - job.fadeAt)
          if (jobFade <= 0) {
            next()
            raf = requestAnimationFrame(frame)
            return
          }
        }
      }
      drawPen(t)
      applyOpacity()
      // Nothing moves while a finished drawing holds: sleep until it fades.
      const captionDone = !job.L.caption || shown >= job.drawing.caption.length
      if (job.mode === "done" && job.fadeAt < 0 && captionDone && trail.length === 0) {
        window.clearTimeout(holdTimer)
        holdTimer = window.setTimeout(wake, Math.max(0, job.doneAt + HOLD_MS - t))
        prev = -1
        return
      }
      raf = requestAnimationFrame(frame)
    }

    function wake() {
      if (!reduced && !raf) raf = requestAnimationFrame(frame)
    }

    const still = () => {
      startJob(1)
      // No fresh ink when nothing moves.
      trail.length = 0
      if (job) typeCaption(Infinity)
      drawPen(0)
    }

    // A click on an empty part of the hero lifts the pen and moves on.
    const onClick = (e: MouseEvent) => {
      if (reduced || !job || (e.target as Element).closest("a, button, input, [role='button']")) return
      if (job.mode !== "done") {
        job.mode = "done"
        job.doneAt = performance.now()
      }
      if (job.fadeAt < 0) job.fadeAt = performance.now() - FADE_MS * 0.6
      wake()
    }

    const onScroll = () => {
      applyOpacity()
      wake()
    }

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      wake()
    })

    let lastW = 0
    let lastH = 0
    const ro = new ResizeObserver(() => {
      const r = hero.getBoundingClientRect()
      if (!ready || (Math.abs(r.width - lastW) < 1 && Math.abs(r.height - lastH) < 1)) return
      lastW = r.width
      lastH = r.height
      const progress = job ? job.drawn / Math.max(1, job.total) : 0.45
      size()
      if (reduced) still()
      else {
        startJob(Math.max(0.01, progress))
        wake()
      }
    })

    const mo = new MutationObserver(() => {
      readColors()
      if (reduced) still()
      else {
        repaint()
        wake()
      }
    })

    let cancelled = false
    ;(async () => {
      // Measure the name only once fonts are in and the hero has finished rising in.
      await document.fonts?.ready
      const settling = hero.getAnimations({ subtree: true }).filter((a) => {
        const end = a.effect?.getComputedTiming().endTime
        return typeof end === "number" && Number.isFinite(end)
      })
      await Promise.all(settling.map((a) => a.finished.catch(() => undefined)))
      if (cancelled) return
      ready = true
      readColors()
      size()
      const r = hero.getBoundingClientRect()
      lastW = r.width
      lastH = r.height
      if (reduced) still()
      else {
        // Open mid-drawing rather than on an empty hero.
        startJob(0.45)
        wake()
      }
    })()

    io.observe(hero)
    ro.observe(hero)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    hero.addEventListener("click", onClick)
    window.addEventListener("scroll", onScroll, { passive: true })
    document.addEventListener("visibilitychange", wake)

    return () => {
      cancelled = true
      if (raf) cancelAnimationFrame(raf)
      window.clearTimeout(holdTimer)
      io.disconnect()
      ro.disconnect()
      mo.disconnect()
      hero.removeEventListener("click", onClick)
      window.removeEventListener("scroll", onScroll)
      document.removeEventListener("visibilitychange", wake)
      svg.remove()
    }
  }, [])

  return (
    <div ref={rootRef} className="absolute inset-0" style={{ opacity: 0 }} aria-hidden="true">
      <canvas ref={paperRef} className="absolute" />
      <canvas ref={penRef} className="absolute" />
      {/* The pen tip: the full stop, with a soft halo. */}
      <span ref={tipRef} className="absolute left-0 top-0 opacity-0">
        <span className="absolute -left-[9px] -top-[9px] h-[18px] w-[18px] rounded-full bg-accent/20" />
        <span className="absolute -left-[4.5px] -top-[4.5px] h-[9px] w-[9px] rounded-[2px] bg-accent" />
      </span>
      <p
        ref={captionRef}
        className="absolute whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground"
      />
    </div>
  )
}
