"use client"

import { useEffect, useRef } from "react"
import { clamp, runCanvas } from "./canvasLoop"

/*
 * Spider-Man, the favourite: Manhattan at night after the crane sequence in
 * The Amazing Spider-Man. The Empire State Building stands back in the haze
 * with its crown floodlit, searchlights sweep up from behind the skyline,
 * yellow tower cranes run their trolleys and swing their hooks under work
 * lights, a glass office tower stands close on the right, and it rains
 * through all of it.
 *
 * The scene is five stacked canvases. Three never repaint after a resize:
 * the sky, the city in front of the searchlights, and the vignette with its
 * grain. Only two redraw each frame: the beams, at half resolution since they
 * are soft, and the lights, trolleys and rain. One canvas repainting all of
 * it every frame ran at a third of the frame rate. The layout reads where the
 * stage put the picture and its text, so the cranes reach toward the picture
 * and the Empire State's crown stays in view at any size.
 */

type Rng = () => number
type Rect = { left: number; right: number; top: number; bottom: number }
type Crane = { x: number; base: number; top: number; dir: 1 | -1; s: number; jib: number; counter: number; peak: number; jy: number }
type Beam = { x: number; y: number; a: number; sweep: number; speed: number; phase: number; k: number }

// Seeded, so the city keeps its shape when the stage resizes.
const seeded = (seed: number): Rng => () => {
  seed = (seed * 16807) % 2147483647
  return (seed - 1) / 2147483646
}
const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}
const YELLOW = "rgba(236,188,78,0.95)"

/** Sizes one of the stacked canvases and returns its context in CSS pixels. */
function fit(c: HTMLCanvasElement, w: number, h: number, scale: number) {
  c.width = Math.round(w * scale)
  c.height = Math.round(h * scale)
  const g = c.getContext("2d")!
  g.setTransform(scale, 0, 0, scale, 0, 0)
  g.clearRect(0, 0, w, h)
  return g
}

/** Soft cloud, value noise over four octaves, thinning toward the skyline. */
function clouds(w: number, h: number, rng: Rng) {
  const cw = Math.ceil(w / 5)
  const ch = Math.ceil(h / 5)
  const c = document.createElement("canvas")
  c.width = cw
  c.height = ch
  const g = c.getContext("2d")!
  const img = g.createImageData(cw, ch)
  const octaves = [3, 6, 12, 24].map((n) => ({ n, v: Array.from({ length: (n + 1) * (n + 1) }, rng) }))
  const s = (t: number) => t * t * (3 - 2 * t)
  const at = (o: { n: number; v: number[] }, x: number, y: number) => {
    const fx = x * o.n
    const fy = y * o.n
    const ix = Math.min(o.n - 1, Math.floor(fx))
    const iy = Math.min(o.n - 1, Math.floor(fy))
    const tx = s(fx - ix)
    const ty = s(fy - iy)
    const v = (a: number, b: number) => o.v[b * (o.n + 1) + a]
    return (v(ix, iy) * (1 - tx) + v(ix + 1, iy) * tx) * (1 - ty) + (v(ix, iy + 1) * (1 - tx) + v(ix + 1, iy + 1) * tx) * ty
  }
  for (let y = 0; y < ch; y++) {
    for (let x = 0; x < cw; x++) {
      let v = 0
      let amp = 1
      let sum = 0
      for (const o of octaves) {
        v += at(o, x / cw, y / ch) * amp
        sum += amp
        amp *= 0.5
      }
      const d = smooth(0.4, 0.76, v / sum) * (1 - smooth(0.3, 0.75, y / ch))
      const i = (y * cw + x) * 4
      img.data[i] = 80
      img.data[i + 1] = 96
      img.data[i + 2] = 114
      img.data[i + 3] = Math.round(d * 200)
    }
  }
  g.putImageData(img, 0, 0)
  return c
}

/** Office floors: each a band of narrow windows between dark slabs, lit floor by floor. */
function windows(g: CanvasRenderingContext2D, rng: Rng, x0: number, y0: number, x1: number, y1: number, cw: number, fh: number, lit: number, warm: boolean, glass = 0.08) {
  const winH = Math.max(2, fh * 0.62)
  for (let y = y0; y < y1; y += fh) {
    const floorLit = rng() < lit
    const tone = warm && rng() < 0.55 ? `255,${205 + Math.floor(rng() * 30)},${145 + Math.floor(rng() * 40)}` : `${222 + Math.floor(rng() * 25)},${232 + Math.floor(rng() * 15)},246`
    const a = 0.45 + rng() * 0.35
    for (let x = x0; x < x1; x += cw) {
      const on = floorLit ? rng() < 0.9 : rng() < lit * 0.15
      g.fillStyle = on ? `rgba(${tone},${a * (0.8 + rng() * 0.2)})` : `rgba(120,150,180,${glass * (0.6 + rng() * 0.6)})`
      g.fillRect(x, y, cw - 1, winH)
    }
  }
}

/** A crane's lattice between two points: two chords and K-bracing between them. */
function truss(g: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, depth: number, taper = 0) {
  const len = Math.hypot(x1 - x0, y1 - y0)
  const ux = (x1 - x0) / len
  const uy = (y1 - y0) / len
  const nx = -uy
  const ny = ux
  const d = (k: number) => depth * (1 - taper * k)
  const step = Math.max(4, Math.abs(depth) * 1.15)
  g.beginPath()
  g.moveTo(x0, y0)
  g.lineTo(x1, y1)
  g.moveTo(x0 + nx * d(0), y0 + ny * d(0))
  g.lineTo(x1 + nx * d(1), y1 + ny * d(1))
  for (let s = 0, k = 0; s < len - 0.5; s += step, k++) {
    const a = s / len
    const b = Math.min(1, (s + step) / len)
    const p0x = x0 + ux * s
    const p0y = y0 + uy * s
    const p1x = x0 + ux * Math.min(len, s + step)
    const p1y = y0 + uy * Math.min(len, s + step)
    g.moveTo(p0x, p0y)
    g.lineTo(p0x + nx * d(a), p0y + ny * d(a))
    if (k % 2) {
      g.moveTo(p0x, p0y)
      g.lineTo(p1x + nx * d(b), p1y + ny * d(b))
    } else {
      g.moveTo(p0x + nx * d(a), p0y + ny * d(a))
      g.lineTo(p1x, p1y)
    }
  }
  g.stroke()
}

/** A tower crane side on: mast, cab, peak and cables, jib, counter-jib and its weights. */
function drawCrane(g: CanvasRenderingContext2D, c: Crane) {
  const { x, base, top, jib, counter, dir, s } = c
  g.save()
  g.strokeStyle = YELLOW
  g.lineWidth = 1.25 * Math.max(0.8, s)
  g.shadowColor = "rgba(255,160,50,0.45)"
  g.shadowBlur = 6 * s
  const mw = 15 * s
  truss(g, x - mw / 2, base, x - mw / 2, top, mw)
  g.fillStyle = YELLOW
  g.fillRect(x - mw * 0.8, top - 6 * s, mw * 1.6, 7 * s)
  const cabX = x + dir * mw * 0.55 - (dir < 0 ? 12 * s : 0)
  g.fillStyle = "rgba(200,150,55,1)"
  g.fillRect(cabX, top - 16 * s, 12 * s, 10 * s)
  g.fillStyle = "rgba(255,236,190,0.9)"
  g.fillRect(cabX + 2 * s, top - 14 * s, 8 * s, 4 * s)
  c.peak = top - 70 * s
  g.beginPath()
  g.moveTo(x - mw / 2, top - 6 * s)
  g.lineTo(x, c.peak)
  g.lineTo(x + mw / 2, top - 6 * s)
  g.stroke()
  c.jy = top - 8 * s
  truss(g, x, c.jy, x + dir * jib, c.jy, -11 * s, 0.45)
  truss(g, x, c.jy, x - dir * counter, c.jy, -9 * s)
  g.fillStyle = "rgba(70,74,80,1)"
  for (let i = 0; i < 3; i++) g.fillRect(x - dir * (counter - 8 * s - i * 10 * s) - 5 * s, c.jy, 9 * s, 16 * s)
  g.shadowBlur = 0
  g.strokeStyle = "rgba(236,188,78,0.55)"
  g.lineWidth = 0.9
  g.beginPath()
  g.moveTo(x, c.peak)
  g.lineTo(x + dir * jib * 0.62, c.jy - 11 * s)
  g.moveTo(x, c.peak)
  g.lineTo(x - dir * counter * 0.85, c.jy - 9 * s)
  g.stroke()
  g.restore()
}

/**
 * The Empire State Building front on: base, setbacks, the long shaft with its
 * piers, the floodlit crown, the mast and the antenna. `height` is to the tip.
 */
function empireState(g: CanvasRenderingContext2D, rng: Rng, cx: number, ground: number, height: number) {
  const u = height / 880
  const X = (v: number) => cx + v * u
  const Y = (v: number) => ground - v * u
  const tiers: [number, number, number][] = [
    [0, 60, 100], [60, 75, 84], [75, 600, 62], [600, 618, 54], [618, 636, 46], [636, 652, 40], [652, 668, 32],
  ]
  g.fillStyle = "#0f1d29"
  for (const [y0, y1, w] of tiers) g.fillRect(X(-w / 2), Y(y1), w * u, (y1 - y0) * u)
  g.strokeStyle = "rgba(150,185,215,0.14)"
  g.lineWidth = 1
  g.beginPath()
  for (let i = -3; i <= 3; i++) {
    g.moveTo(X(i * 8.4), Y(75))
    g.lineTo(X(i * 8.4), Y(600))
  }
  g.stroke()
  for (let v = 80; v < 598; v += 6) {
    for (let i = -3; i < 3; i++) {
      if (rng() < 0.16) {
        g.fillStyle = `rgba(255,${205 + Math.floor(rng() * 30)},${150 + Math.floor(rng() * 40)},${0.35 + rng() * 0.3})`
        g.fillRect(X(i * 8.4 + 2.6), Y(v + 2.4), 3.2 * u, 2.4 * u)
      }
    }
  }
  // Floodlit from each setback up, brightest at the top.
  const flood = (y0: number, y1: number, w: number, a: number) => {
    const gr = g.createLinearGradient(0, Y(y0), 0, Y(y1))
    gr.addColorStop(0, `rgba(225,238,255,${a})`)
    gr.addColorStop(1, `rgba(225,238,255,${a * 0.35})`)
    g.fillStyle = gr
    g.fillRect(X(-w / 2), Y(y1), w * u, (y1 - y0) * u)
  }
  flood(560, 600, 62, 0.28)
  flood(600, 618, 54, 0.42)
  flood(618, 636, 46, 0.48)
  flood(636, 652, 40, 0.55)
  flood(652, 668, 32, 0.6)
  g.fillStyle = "rgba(232,242,255,0.78)"
  g.beginPath()
  g.moveTo(X(-11), Y(668))
  g.lineTo(X(11), Y(668))
  g.lineTo(X(6), Y(762))
  g.lineTo(X(-6), Y(762))
  g.closePath()
  g.fill()
  g.strokeStyle = "rgba(120,150,180,0.6)"
  g.lineWidth = 0.8
  g.beginPath()
  for (let i = -2; i <= 2; i++) {
    g.moveTo(X(i * 4), Y(668))
    g.lineTo(X(i * 2.2), Y(762))
  }
  g.stroke()
  g.fillStyle = "rgba(232,242,255,0.7)"
  g.fillRect(X(-4.5), Y(790), 9 * u, 28 * u)
  g.strokeStyle = "rgba(200,215,230,0.7)"
  g.lineWidth = Math.max(1, 1.6 * u)
  g.beginPath()
  g.moveTo(X(0), Y(790))
  g.lineTo(X(0), Y(880))
  g.stroke()
  const glow = g.createRadialGradient(X(0), Y(680), 0, X(0), Y(680), 140 * u)
  glow.addColorStop(0, "rgba(190,215,255,0.22)")
  glow.addColorStop(1, "rgba(190,215,255,0)")
  g.fillStyle = glow
  g.fillRect(X(-160), Y(830), 320 * u, 320 * u)
  return { x: X(0), y: Y(880) }
}

/** One searchlight beam, drawn once: a bright core inside layers of soft haze. */
function beamSprite() {
  const L = 1200
  const B = 240
  const c = document.createElement("canvas")
  c.width = L
  c.height = B
  const g = c.getContext("2d")!
  const cone = (half: number, alpha: number, blur: number) => {
    g.filter = `blur(${blur}px)`
    const gr = g.createLinearGradient(0, 0, L, 0)
    gr.addColorStop(0, `rgba(225,238,255,${alpha})`)
    gr.addColorStop(0.5, `rgba(225,238,255,${alpha * 0.45})`)
    gr.addColorStop(1, "rgba(225,238,255,0)")
    g.fillStyle = gr
    g.beginPath()
    g.moveTo(0, B / 2 - 2)
    g.lineTo(L, B / 2 - half)
    g.lineTo(L, B / 2 + half)
    g.lineTo(0, B / 2 + 2)
    g.closePath()
    g.fill()
  }
  cone(110, 0.3, 24)
  cone(54, 0.45, 11)
  cone(16, 0.75, 3)
  return c
}

function grainTile() {
  const c = document.createElement("canvas")
  c.width = c.height = 160
  const g = c.getContext("2d")!
  const img = g.createImageData(160, 160)
  for (let i = 0; i < img.data.length; i += 4) {
    const v = Math.random() * 255
    img.data[i] = img.data[i + 1] = img.data[i + 2] = v
    img.data[i + 3] = 12
  }
  g.putImageData(img, 0, 0)
  return c
}

/** Where the stage put the picture and its text; estimated if not on the page yet. */
function stageRects(w: number, h: number): { pic: Rect; text: Rect } {
  const r = (el: Element | null) => {
    if (!el) return null
    const b = el.getBoundingClientRect()
    return b.width > 0 ? { left: b.left, right: b.right, top: b.top, bottom: b.bottom } : null
  }
  const pw = Math.min(w * 0.86, 700)
  const pic = r(document.querySelector("[data-stage-picture]")) ?? { left: (w - pw) / 2, right: (w + pw) / 2, top: h * 0.22, bottom: h * 0.22 + pw / 2 }
  const text = r(document.querySelector("[data-stage-text]")) ?? { left: pic.left, right: pic.right, top: pic.bottom + 40, bottom: pic.bottom + 240 }
  return { pic, text }
}

export default function CraneScene({ still }: { still: boolean }) {
  const backRef = useRef<HTMLCanvasElement>(null)
  const beamRef = useRef<HTMLCanvasElement>(null)
  const frontRef = useRef<HTMLCanvasElement>(null)
  const fxRef = useRef<HTMLCanvasElement>(null)
  const shadeRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const backEl = backRef.current
    const beamEl = beamRef.current
    const frontEl = frontRef.current
    const fxEl = fxRef.current
    const shadeEl = shadeRef.current
    if (!backEl || !beamEl || !frontEl || !fxEl || !shadeEl) return
    const beamImg = beamSprite()
    const grain = grainTile()

    return runCanvas(
      fxEl,
      still,
      (w, h) => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2)
        const rng = seeded(31)
        const phone = w < 768
        const { pic, text } = stageRects(w, h)

        // Back: sky lit faintly by the city, cloud, and the far skyline in haze.
        const b = fit(backEl, w, h, dpr)
        const sky = b.createLinearGradient(0, 0, 0, h)
        sky.addColorStop(0, "#04070b")
        sky.addColorStop(0.6, "#0a121a")
        sky.addColorStop(1, "#121e29")
        b.fillStyle = sky
        b.fillRect(0, 0, w, h)
        const cityGlow = b.createRadialGradient(w * 0.2, h * 0.2, 0, w * 0.2, h * 0.2, w * 0.5)
        cityGlow.addColorStop(0, "rgba(90,130,170,0.22)")
        cityGlow.addColorStop(1, "rgba(90,130,170,0)")
        b.fillStyle = cityGlow
        b.fillRect(0, 0, w, h)
        b.drawImage(clouds(w, h, rng), 0, 0, w, h)
        for (let x = 0; x < w; ) {
          const bw = 20 + rng() * 50
          const top = h * (0.56 + rng() * 0.2)
          b.fillStyle = "#0e1923"
          b.fillRect(x, top, bw, h - top)
          windows(b, rng, x + 2, top + 4, x + bw - 2, h, 4, 6, 0.12, true, 0.04)
          x += bw + 2
        }
        b.fillStyle = "rgba(20,38,52,0.55)"
        b.fillRect(0, 0, w, h)

        // Front: the Empire State, the nearer blocks, the glass tower and the cranes.
        const f = fit(frontEl, w, h, dpr)
        // On a phone the picture fills the width, so the Empire State stands
        // behind it with its crown in the sky above.
        const esb = phone
          ? empireState(f, rng, w * 0.2, pic.top + 30, Math.max(140, pic.top))
          : empireState(f, rng, w * 0.17, h * 0.98, Math.min(h * 0.8, w * 0.62))
        f.fillStyle = "rgba(18,36,50,0.28)"
        f.fillRect(0, 0, w * (phone ? 0.45 : 0.32), h)
        for (const [x0, w0, t0] of [[-0.02, 0.1, 0.66], [0.06, 0.09, 0.72], [0.2, 0.08, 0.7], [0.28, 0.08, 0.78]]) {
          const x = w * x0
          const bw = w * w0 * (phone ? 1.6 : 1)
          const top = h * (phone ? Math.max(t0, 0.8) : t0)
          f.fillStyle = "#08111a"
          f.fillRect(x, top, bw, h - top)
          windows(f, rng, x + 3, top + 5, x + bw - 3, h, 6, 9, 0.28, true, 0.05)
        }
        const sign = { x: w * 0.035, y: h * (phone ? 0.88 : 0.8), w: 34, h: 22 }
        const sg = f.createRadialGradient(sign.x + sign.w / 2, sign.y + sign.h / 2, 0, sign.x + sign.w / 2, sign.y + sign.h / 2, 60)
        sg.addColorStop(0, "rgba(255,60,60,0.4)")
        sg.addColorStop(1, "rgba(255,60,60,0)")
        f.fillStyle = sg
        f.fillRect(sign.x - 50, sign.y - 50, sign.w + 100, sign.h + 100)
        f.fillStyle = "rgba(255,80,80,0.95)"
        f.fillRect(sign.x, sign.y, sign.w, sign.h)
        const R = { x0: w * (phone ? 0.84 : 0.78), x1: w * 1.02 }
        const glass = f.createLinearGradient(R.x0, 0, R.x1, 0)
        glass.addColorStop(0, "#0c1620")
        glass.addColorStop(1, "#070e15")
        f.fillStyle = glass
        f.fillRect(R.x0, -10, R.x1 - R.x0, h + 10)
        windows(f, rng, R.x0 + 6, 4, R.x1, h, 7, 15, 0.58, true, 0.1)
        f.strokeStyle = "rgba(4,9,14,0.9)"
        f.lineWidth = 3
        f.beginPath()
        for (let x = R.x0 + 55; x < R.x1; x += 49) {
          f.moveTo(x, 0)
          f.lineTo(x, h)
        }
        f.stroke()
        f.fillStyle = "rgba(190,220,250,0.35)"
        f.fillRect(R.x0, 0, 1.5, h)

        // The cranes reach toward the picture without going behind it. On a
        // phone the big one works above the picture, the small one below the text.
        const s = clamp(h / 800, 0.85, 1.3) * (phone ? 0.75 : 1)
        const cranes: Crane[] = []
        if (phone) {
          const top = Math.max(110, pic.top - 46)
          cranes.push({ x: w - 26, base: h + 20, top, dir: -1, s, jib: w * 0.62, counter: 40, peak: 0, jy: 0 })
          const low = text.bottom + 70 * s
          if (low < h - 30) cranes.push({ x: 20, base: h + 20, top: low, dir: 1, s: s * 0.8, jib: w * 0.5, counter: 30, peak: 0, jy: 0 })
        } else {
          const c1x = w * 0.94
          cranes.push({ x: c1x, base: h + 20, top: h * 0.31, dir: -1, s, jib: c1x - Math.max(pic.right + 18, w * 0.76), counter: w * 0.1, peak: 0, jy: 0 })
          const c2x = w * 0.05
          cranes.push({ x: c2x, base: h + 20, top: h * 0.58, dir: 1, s: s * 0.7, jib: Math.min(pic.left - 18, w * 0.25) - c2x, counter: w * 0.06, peak: 0, jy: 0 })
        }
        for (const c of cranes) if (c.jib > 20) drawCrane(f, c)
        const live = cranes.filter((c) => c.jib > 20)

        // Searchlights rise from behind the skyline, crossing in V's.
        const foot = phone ? h * 0.98 : h * 0.74
        const beams: Beam[] = (phone
          ? [[0.1, 0.3, 0.75], [0.4, -0.25, 0.65], [0.7, 0.15, 0.55]]
          : [[0.08, 0.28, 0.75], [0.27, -0.3, 0.7], [0.36, 0.05, 0.55], [0.7, -0.12, 0.55]]
        ).map(([x, a, k], i) => ({ x: w * x, y: foot + (i % 2) * h * 0.02, a: -Math.PI / 2 + a, sweep: 0.14 + i * 0.02, speed: 0.15 + i * 0.03, phase: i * 1.7, k }))
        const len = h * 1.15

        // The vignette and film grain on top never change either.
        const sh = fit(shadeEl, w, h, dpr)
        const v = sh.createRadialGradient(w / 2, h * 0.45, Math.min(w, h) * 0.35, w / 2, h * 0.45, Math.max(w, h) * 0.8)
        v.addColorStop(0, "rgba(0,0,0,0)")
        v.addColorStop(1, "rgba(0,0,0,0.55)")
        sh.fillStyle = v
        sh.fillRect(0, 0, w, h)
        const pattern = sh.createPattern(grain, "repeat")
        if (pattern) {
          sh.fillStyle = pattern
          sh.fillRect(0, 0, w, h)
        }
        // The beams are soft, so their canvas runs at half resolution.
        const bg = fit(beamEl, w, h, Math.min(dpr, 1) * 0.5)

        const reds = [esb, { x: R.x0 + 4, y: h * 0.05 }]
        for (const c of live) reds.push({ x: c.x, y: c.peak - 2 }, { x: c.x + c.dir * c.jib, y: c.jy - 4 })

        // Rain, three depths falling at a slight slant.
        const drops = Array.from({ length: Math.round((w * h) / 5200) }, () => {
          const z = Math.random()
          return { x: Math.random() * (w + 150) - 100, y: Math.random() * h * 2 - h, z, len: 10 + z * 22, v: 700 + z * 800 }
        })
        const wind = 0.16

        return (ctx, t, dt) => {
          // Searchlights, on their own canvas between the sky and the city.
          bg.clearRect(0, 0, w, h)
          bg.globalCompositeOperation = "lighter"
          const angles = beams.map((bm) => bm.a + bm.sweep * Math.sin(t * bm.speed + bm.phase))
          beams.forEach((bm, i) => {
            bg.save()
            bg.translate(bm.x, bm.y)
            bg.rotate(angles[i])
            bg.globalAlpha = bm.k * (0.92 + 0.08 * Math.sin(t * 7 + i))
            bg.drawImage(beamImg, 0, -len * 0.13, len, len * 0.26)
            bg.restore()
            const lamp = bg.createRadialGradient(bm.x, bm.y, 0, bm.x, bm.y, 70)
            lamp.addColorStop(0, `rgba(215,232,255,${0.35 * bm.k})`)
            lamp.addColorStop(1, "rgba(215,232,255,0)")
            bg.fillStyle = lamp
            bg.fillRect(bm.x - 70, bm.y - 70, 140, 140)
          })

          ctx.save()
          ctx.globalCompositeOperation = "lighter"
          reds.forEach((r, i) => {
            if (Math.sin(t * 1.6 + i * 1.7) < 0.35) return
            const gl = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, 14)
            gl.addColorStop(0, "rgba(255,60,50,0.95)")
            gl.addColorStop(1, "rgba(255,60,50,0)")
            ctx.fillStyle = gl
            ctx.fillRect(r.x - 14, r.y - 14, 28, 28)
          })
          ctx.restore()

          // Each trolley runs slowly along its jib, the hook swinging on its cables,
          // and a work light shines down from near the tip.
          const lights = live.map((c, i) => {
            const tx = c.x + c.dir * c.jib * (0.45 + 0.3 * Math.sin(t * 0.12 + i * 2))
            const drop = (90 + 50 * Math.sin(t * 0.09 + i)) * c.s
            const swing = Math.sin(t * 1.1 + i) * 0.05
            const hx = tx + Math.sin(swing) * drop
            const hy = c.jy + Math.cos(swing) * drop
            ctx.fillStyle = YELLOW
            ctx.fillRect(tx - 6 * c.s, c.jy - 1, 12 * c.s, 5 * c.s)
            ctx.strokeStyle = "rgba(200,205,210,0.6)"
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(tx - 2, c.jy + 4)
            ctx.lineTo(hx - 2, hy)
            ctx.moveTo(tx + 2, c.jy + 4)
            ctx.lineTo(hx + 2, hy)
            ctx.stroke()
            ctx.fillStyle = YELLOW
            ctx.fillRect(hx - 5 * c.s, hy, 10 * c.s, 8 * c.s)
            ctx.strokeStyle = "rgba(210,215,220,0.9)"
            ctx.lineWidth = 1.4
            ctx.beginPath()
            ctx.arc(hx, hy + 12 * c.s, 3.5 * c.s, 0.2, Math.PI * 1.4)
            ctx.stroke()
            const lx = c.x + c.dir * c.jib * 0.86
            const ly = c.jy + 2
            const reach = 320 * c.s
            ctx.save()
            ctx.globalCompositeOperation = "lighter"
            const cone = ctx.createLinearGradient(lx, ly, lx, ly + reach)
            cone.addColorStop(0, "rgba(255,214,150,0.22)")
            cone.addColorStop(1, "rgba(255,214,150,0)")
            ctx.fillStyle = cone
            ctx.beginPath()
            ctx.moveTo(lx - 3, ly)
            ctx.lineTo(lx + 3, ly)
            ctx.lineTo(lx + 70 * c.s, ly + reach)
            ctx.lineTo(lx - 70 * c.s, ly + reach)
            ctx.closePath()
            ctx.fill()
            const gl = ctx.createRadialGradient(lx, ly, 0, lx, ly, 40 * c.s)
            gl.addColorStop(0, "rgba(255,240,205,0.7)")
            gl.addColorStop(1, "rgba(255,220,160,0)")
            ctx.fillStyle = gl
            ctx.fillRect(lx - 40 * c.s, ly - 40 * c.s, 80 * c.s, 80 * c.s)
            ctx.restore()
            return { x: lx, y: ly, reach }
          })

          // Rain, catching the work lights and the beams it falls through.
          const lit = (x: number, y: number) => {
            for (const l of lights) {
              const dy = y - l.y
              if (dy > 0 && dy < l.reach && Math.abs(x - l.x) < 3 + dy * 0.22) return true
            }
            for (let i = 0; i < beams.length; i++) {
              const bm = beams[i]
              const dx = x - bm.x
              const dy = y - bm.y
              const d = Math.hypot(dx, dy)
              if (d > len || dy > 0) continue
              const diff = Math.abs(Math.atan2(Math.sin(Math.atan2(dy, dx) - angles[i]), Math.cos(Math.atan2(dy, dx) - angles[i])))
              if (diff < 0.05 && d < len * 0.7) return true
            }
            return false
          }
          ctx.lineCap = "butt"
          const plain = [new Path2D(), new Path2D(), new Path2D()]
          const bright = new Path2D()
          for (const d of drops) {
            d.y += d.v * dt
            d.x += d.v * wind * dt
            if (d.y > h + 30) {
              d.y = -20 - Math.random() * 100
              d.x = Math.random() * (w + 150) - 100
            }
            const p = lit(d.x, d.y) ? bright : plain[Math.min(2, Math.floor(d.z * 3))]
            p.moveTo(d.x, d.y)
            p.lineTo(d.x - d.len * wind, d.y - d.len)
          }
          plain.forEach((p, i) => {
            ctx.strokeStyle = `rgba(190,220,255,${0.07 + i * 0.06})`
            ctx.lineWidth = 0.6 + i * 0.5
            ctx.stroke(p)
          })
          ctx.strokeStyle = "rgba(255,236,200,0.5)"
          ctx.lineWidth = 1
          ctx.stroke(bright)
        }
      },
      12,
    )
  }, [still])

  const layerClass = "absolute inset-0 h-full w-full"
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <canvas ref={backRef} className={layerClass} />
      <canvas ref={beamRef} className={layerClass} />
      <canvas ref={frontRef} className={layerClass} />
      <canvas ref={fxRef} className={layerClass} />
      <canvas ref={shadeRef} className={layerClass} />
    </div>
  )
}
