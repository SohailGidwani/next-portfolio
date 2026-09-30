"use client"

import { useEffect, useRef } from "react"

// The name is cut into patches the way a Vision Transformer cuts up a scan:
// a fixed number across, however wide the name is drawn.
const COLS = 24
const MASK_RATIO = 0.75 // how much is hidden on load, as in JEPA pre-training
const BLOCK = { cols: 3, rows: 2 } // what the pointer hides
const HOLD_AFTER_LEAVE = 0.35 // seconds a patch stays hidden once the pointer moves on
const COARSE_FOR = 0.3 // seconds a patch shows its rough guess before it sharpens
const IDLE_EVERY = 8 // seconds between self-masks when nobody is pointing

type Mode = "clear" | "masked" | "coarse"
interface Cell {
  mode: Mode
  /** When the mode moves on by itself; Infinity while the pointer holds it. */
  until: number
  cover: number
  tone: number
  ink: number
}

/**
 * The hero's name, behaving like the research: most of it is hidden, then
 * predicted back from the patches left showing, first as a rough block of
 * tone, then sharp. After that the pointer is the mask.
 *
 * The heading is real text and never moves. This canvas sits over it and
 * only covers patches (in the page colour) and paints the rough guess; a
 * sharp patch is simply the text showing through again. So the name is in
 * the HTML, paints before any script runs, and is all there is without
 * JavaScript or with reduced motion.
 */
export default function MaskedName({ lines, className }: { lines: string[]; className: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!wrap || !canvas || !ctx) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cells: Cell[] = []
    let rows = 0
    let size = 0
    let width = 0
    let height = 0
    let colors = { bg: "#000", fg: "#fff", accent: "#0ff" }
    let raf = 0
    let last = 0
    let gridAlpha = 0
    let gridTarget = 0
    let opened = false
    let lastPointer = -Infinity
    let idleTimer = 0
    let disposed = false
    const held = new Set<number>()
    const now = () => performance.now() / 1000

    const readColors = () => {
      const css = getComputedStyle(document.documentElement)
      colors = {
        bg: css.getPropertyValue("--bg").trim() || "#000",
        fg: css.getPropertyValue("--fg").trim() || "#fff",
        accent: css.getPropertyValue("--accent").trim() || "#0ff",
      }
    }

    /** How much of each patch is letter, from an offscreen drawing of the same text. */
    const measureInk = () => {
      const off = document.createElement("canvas")
      off.width = Math.max(1, Math.round(width))
      off.height = Math.max(1, Math.round(height))
      const g = off.getContext("2d", { willReadFrequently: true })
      if (!g) return
      const box = wrap.getBoundingClientRect()
      const spans = wrap.querySelectorAll<HTMLElement>("[data-line]")
      spans.forEach((span, i) => {
        const css = getComputedStyle(span)
        const fontSize = parseFloat(css.fontSize)
        g.font = `${css.fontWeight} ${fontSize}px ${css.fontFamily}`
        if ("letterSpacing" in g) (g as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = css.letterSpacing
        g.textBaseline = "alphabetic"
        g.fillStyle = "#000"
        const text = lines[i].toUpperCase()
        const m = g.measureText(text)
        const r = span.getBoundingClientRect()
        const lineHeight = parseFloat(css.lineHeight) || fontSize
        const baseline = r.top - box.top + (lineHeight - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2 + m.fontBoundingBoxAscent
        g.fillText(text, r.left - box.left, baseline)
      })
      const data = g.getImageData(0, 0, off.width, off.height).data
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < COLS; c++) {
          const x0 = Math.floor(c * size), x1 = Math.min(off.width, Math.floor((c + 1) * size))
          const y0 = Math.floor(r * size), y1 = Math.min(off.height, Math.floor((r + 1) * size))
          let sum = 0
          let count = 0
          // Every third pixel is plenty for an average.
          for (let y = y0; y < y1; y += 3) for (let x = x0; x < x1; x += 3) { sum += data[(y * off.width + x) * 4 + 3]; count++ }
          cells[r * COLS + c].ink = count ? sum / count / 255 : 0
        }
      }
    }

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = wrap.clientWidth
      height = wrap.clientHeight
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      size = width / COLS
      rows = Math.ceil(height / size)
      cells = Array.from({ length: rows * COLS }, () => ({ mode: "clear" as Mode, until: 0, cover: 0, tone: 0, ink: 0 }))
      held.clear()
      readColors()
      measureInk()
    }

    const draw = (t: number) => {
      const dt = Math.min(0.05, last ? t - last : 0.016)
      last = t
      const k = 1 - Math.exp(-dt / 0.07)
      gridAlpha += (gridTarget - gridAlpha) * (1 - Math.exp(-dt / 0.18))
      ctx.clearRect(0, 0, width, height)

      let busy = Math.abs(gridTarget - gridAlpha) > 0.004
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]
        if (cell.mode === "masked" && t >= cell.until) { cell.mode = "coarse"; cell.until = t + COARSE_FOR }
        else if (cell.mode === "coarse" && t >= cell.until) cell.mode = "clear"
        const coverTo = cell.mode === "clear" ? 0 : 1
        const toneTo = cell.mode === "coarse" ? 1 : 0
        cell.cover += (coverTo - cell.cover) * k
        cell.tone += (toneTo - cell.tone) * k
        if (cell.mode !== "clear" || cell.cover > 0.004) busy = true
        if (cell.cover <= 0.004) continue

        const x = (i % COLS) * size
        const y = Math.floor(i / COLS) * size
        // The cover: the page colour over the text. A hair larger than the
        // patch, so no sliver of letter shows between neighbours.
        ctx.globalAlpha = cell.cover
        ctx.fillStyle = colors.bg
        ctx.fillRect(x - 0.5, y - 0.5, size + 1, size + 1)
        // The rough guess: one flat tone for the whole patch, as dark as the
        // share of it that is letter.
        if (cell.tone > 0.004 && cell.ink > 0.01) {
          ctx.globalAlpha = cell.cover * cell.tone * cell.ink
          ctx.fillStyle = colors.fg
          ctx.fillRect(x, y, size, size)
        }
        // A hidden patch is outlined, so an empty one still reads as hidden.
        ctx.globalAlpha = cell.cover * (1 - cell.tone) * 0.55
        ctx.strokeStyle = colors.accent
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])
        ctx.strokeRect(x + 1.5, y + 1.5, size - 3, size - 3)
      }

      // The patch grid itself, shown while the opening sequence runs.
      if (gridAlpha > 0.004) {
        ctx.globalAlpha = gridAlpha * 0.16
        ctx.strokeStyle = colors.fg
        ctx.setLineDash([])
        ctx.lineWidth = 1
        ctx.beginPath()
        for (let c = 0; c <= COLS; c++) { ctx.moveTo(Math.round(c * size) + 0.5, 0); ctx.lineTo(Math.round(c * size) + 0.5, rows * size) }
        for (let r = 0; r <= rows; r++) { ctx.moveTo(0, Math.round(r * size) + 0.5); ctx.lineTo(width, Math.round(r * size) + 0.5) }
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      return busy
    }

    // The loop only runs while something is changing.
    const frame = (ms: number) => {
      raf = draw(ms / 1000) ? requestAnimationFrame(frame) : 0
      if (!raf) last = 0
    }
    const wake = () => {
      if (!raf && !disposed) raf = requestAnimationFrame(frame)
    }

    /** On load: hide most of the name, then predict it back in a sweep. */
    const open = () => {
      if (opened || disposed) return
      opened = true
      const t = now()
      gridTarget = 1
      const order = cells.map((_, i) => i).sort(() => Math.random() - 0.5)
      const hidden = order.slice(0, Math.round(cells.length * MASK_RATIO))
      for (const i of hidden) {
        const col = i % COLS
        window.setTimeout(() => {
          // A resize in the meantime lays the grid out afresh.
          if (disposed || held.has(i) || !cells[i]) return
          cells[i].mode = "masked"
          // Predicted left to right, a little ragged, like a front moving through.
          cells[i].until = t + 1.15 + (col / COLS) * 0.75 + Math.random() * 0.28
          wake()
        }, Math.random() * 320)
      }
      window.setTimeout(() => { gridTarget = 0; wake() }, 2300)
      wake()
    }

    const blockAt = (clientX: number, clientY: number) => {
      const box = wrap.getBoundingClientRect()
      const c0 = Math.round((clientX - box.left) / size - BLOCK.cols / 2)
      const r0 = Math.round((clientY - box.top) / size - BLOCK.rows / 2)
      const out: number[] = []
      for (let r = r0; r < r0 + BLOCK.rows; r++)
        for (let c = c0; c < c0 + BLOCK.cols; c++) if (r >= 0 && r < rows && c >= 0 && c < COLS) out.push(r * COLS + c)
      return out
    }
    const hold = (ids: number[]) => {
      const t = now()
      const next = new Set(ids)
      for (const i of held) if (!next.has(i)) { held.delete(i); cells[i].until = t + HOLD_AFTER_LEAVE }
      for (const i of next) { held.add(i); cells[i].mode = "masked"; cells[i].until = Infinity }
      wake()
    }
    const onMove = (e: PointerEvent) => {
      lastPointer = now()
      hold(blockAt(e.clientX, e.clientY))
    }
    const onLeave = () => hold([])
    // A finger lifting is the end of pointing; a mouse button lifting is not.
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") onLeave()
    }

    // With nobody pointing, a block hides and comes back now and then, so the
    // name is never just a picture (and so phones see it too).
    const idle = () => {
      if (disposed) return
      if (opened && !document.hidden && now() - lastPointer > IDLE_EVERY - 1 && held.size === 0) {
        const inked = cells.map((cell, i) => (cell.ink > 0.25 ? i : -1)).filter((i) => i >= 0)
        const at = inked[Math.floor(Math.random() * inked.length)]
        if (at !== undefined) {
          const c0 = Math.min(COLS - BLOCK.cols, Math.max(0, (at % COLS) - 1))
          const r0 = Math.min(rows - BLOCK.rows, Math.max(0, Math.floor(at / COLS)))
          const t = now()
          for (let r = r0; r < r0 + BLOCK.rows; r++)
            for (let c = c0; c < c0 + BLOCK.cols; c++) {
              const cell = cells[r * COLS + c]
              cell.mode = "masked"
              cell.until = t + 0.9 + Math.random() * 0.25
            }
          wake()
        }
      }
      idleTimer = window.setTimeout(idle, IDLE_EVERY * 1000)
    }

    layout()
    const resize = new ResizeObserver(() => { layout(); wake() })
    resize.observe(wrap)
    // A theme switch changes the page colour the covers are painted in.
    const theme = new MutationObserver(() => { readColors(); wake() })
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "style"] })

    wrap.addEventListener("pointermove", onMove)
    wrap.addEventListener("pointerdown", onMove)
    wrap.addEventListener("pointerleave", onLeave)
    wrap.addEventListener("pointercancel", onLeave)
    wrap.addEventListener("pointerup", onUp)

    // Wait for the display face, or the ink map would be measured on the fallback.
    document.fonts.ready.then(() => {
      if (disposed) return
      layout()
      window.setTimeout(open, 350)
    })
    idleTimer = window.setTimeout(idle, IDLE_EVERY * 1000)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.clearTimeout(idleTimer)
      resize.disconnect()
      theme.disconnect()
      wrap.removeEventListener("pointermove", onMove)
      wrap.removeEventListener("pointerdown", onMove)
      wrap.removeEventListener("pointerleave", onLeave)
      wrap.removeEventListener("pointercancel", onLeave)
      wrap.removeEventListener("pointerup", onUp)
    }
  }, [lines])

  return (
    <div ref={wrapRef} className="relative">
      <h1 className={className} aria-label={lines.join(" ")}>
        {lines.map((line) => (
          <span key={line} data-line className="block pb-[0.06em] -mb-[0.06em]">
            {line}
          </span>
        ))}
      </h1>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
    </div>
  )
}
