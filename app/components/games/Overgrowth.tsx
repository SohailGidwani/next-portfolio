"use client"

import { useEffect, useRef } from "react"
import { clamp, grow, rand, runCanvas } from "./canvasLoop"

// Three depths of growth against the amber haze: the back catches the light
// and goes soft and warm, the front is close to silhouette.
const LAYERS = [
  { colors: ["rgba(122,108,62,0.42)", "rgba(104,98,56,0.42)", "rgba(132,116,70,0.38)"], height: 1.12, spacing: 16 },
  { colors: ["#3a4524", "#434f29", "#34401f", "#4d5630"], height: 0.95, spacing: 12 },
  { colors: ["#151b0d", "#1b2311", "#11160a"], height: 0.78, spacing: 14 },
] as const
const IVY = ["#18210f", "#1f2a13", "#27341a", "#303f1f", "#3b4b26"]

type Blade = { x: number; len: number; angle: number; curl: number; width: number; color: string; phase: number; rim: boolean; delay: number }
type Frond = { x: number; len: number; dir: number; phase: number; delay: number }
type IvyStem = {
  pts: number[] // cubic Bezier: x0,y0,x1,y1,x2,y2,x3,y3, anchored at the top edge
  leaves: { u: number; side: number; size: number; tilt: number; color: string }[]
  delay: number
  duration: number
  phase: number
  sway: number
}

function bez(p: number[], u: number) {
  const v = 1 - u
  const a = v * v * v, b = 3 * v * v * u, c = 3 * v * u * u, d = u * u * u
  return [a * p[0] + b * p[2] + c * p[4] + d * p[6], a * p[1] + b * p[3] + c * p[5] + d * p[7]]
}
function tangent(p: number[], u: number) {
  const v = 1 - u
  return [
    3 * v * v * (p[2] - p[0]) + 6 * v * u * (p[4] - p[2]) + 3 * u * u * (p[6] - p[4]),
    3 * v * v * (p[3] - p[1]) + 6 * v * u * (p[5] - p[3]) + 3 * u * u * (p[7] - p[5]),
  ]
}

/** A three-lobed ivy leaf hanging from its stalk at the origin, pointing down. */
function ivyLeaf(ctx: CanvasRenderingContext2D, L: number) {
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(-0.28 * L, 0.02 * L, -0.52 * L, 0.3 * L)
  ctx.quadraticCurveTo(-0.3 * L, 0.36 * L, -0.22 * L, 0.46 * L)
  ctx.quadraticCurveTo(-0.2 * L, 0.78 * L, 0, L)
  ctx.quadraticCurveTo(0.2 * L, 0.78 * L, 0.22 * L, 0.46 * L)
  ctx.quadraticCurveTo(0.3 * L, 0.36 * L, 0.52 * L, 0.3 * L)
  ctx.quadraticCurveTo(0.28 * L, 0.02 * L, 0, 0)
  ctx.fill()
}

function blade(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, angle: number, curl: number, width: number, sway: number) {
  // A curved, tapering blade: it leaves the root along `angle` and droops
  // further outward (`curl`) toward the tip, which the wind moves most.
  const midA = angle * 0.55
  const tipA = angle + curl
  const mx = x + Math.sin(midA) * len * 0.55 + sway * 0.4
  const my = y - Math.cos(midA) * len * 0.55
  const tx = x + Math.sin(tipA) * len + sway
  const ty = y - Math.cos(tipA) * len
  ctx.beginPath()
  ctx.moveTo(x - width / 2, y)
  ctx.quadraticCurveTo(mx - width * 0.3, my, tx, ty)
  ctx.quadraticCurveTo(mx + width * 0.3, my, x + width / 2, y)
  ctx.fill()
  return [mx, my, tx, ty] as const
}

/**
 * The Last of Us: the corners have been taken back. A low band of grass runs
 * the width of the ground and rises into overgrown mounds at both corners,
 * with ferns unfurling there. Ivy hangs from the top: a vine runs along the
 * top edge from each corner and stems drop from the edge itself, so every
 * leaf hangs off something. Everything
 * grows in outward from the corners when the stage opens, then stirs in a
 * light wind under the fireflies.
 */
export default function Overgrowth({ still }: { still: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) return
    return runCanvas(ref.current, still, (w, h) => {
      const phone = w < 768
      const s = clamp(Math.min(w, h) / 900, 0.45, 1.3)
      const reach = w * (phone ? 0.5 : 0.38)
      // How tall the growth stands at x: a low band everywhere, rising into
      // a mound toward each corner.
      const cornerness = (x: number) => Math.pow(1 - clamp(Math.min(x, w - x) / reach, 0, 1), 1.6)
      const standAt = (x: number) => h * (phone ? 0.03 + 0.17 * cornerness(x) : 0.035 + 0.3 * cornerness(x))
      // Growth spreads from the corners in.
      const delayAt = (x: number) => 0.2 + (1 - cornerness(x)) * 0.7

      const layers: Blade[][] = LAYERS.map((L, li) => {
        const blades: Blade[] = []
        const spacing = L.spacing * s * (phone ? 1.2 : 1)
        // Tufts crowd together in the corner mounds and space out along the
        // low band, where extra blades would only cost frames.
        for (let x = -20; x < w + 20; x += spacing * rand(0.6, 1.4) * (1 + (1 - cornerness(x)) * 0.9)) {
          const stand = standAt(x) * L.height * rand(0.65, 1.05)
          const count = Math.round(3 + stand / (28 * s) + rand(0, 2))
          for (let i = 0; i < count; i++) {
            // A tuft fans out from one root; outer blades lie lower and droop.
            const angle = rand(-0.62, 0.62) + (x < w / 2 ? 0.08 : -0.08)
            blades.push({
              x: x + rand(-3, 3) * s,
              len: stand * rand(0.5, 1) * (1 - Math.abs(angle) * 0.35),
              angle,
              curl: Math.sign(angle) * rand(0.05, 0.45),
              width: s * rand(2.2, 4.2) * (li === 2 ? 1.2 : 1),
              color: L.colors[Math.floor(Math.random() * L.colors.length)],
              phase: rand(0, Math.PI * 2),
              rim: li === 1 && Math.random() < 0.22,
              delay: delayAt(x) + li * 0.08 + rand(0, 0.2),
            })
          }
        }
        return blades
      })

      const fronds: Frond[] = []
      for (const dir of [1, -1]) {
        const n = phone ? 2 : 4
        for (let i = 0; i < n; i++) {
          const x = dir === 1 ? rand(-10, reach * 0.35) : w - rand(-10, reach * 0.35)
          fronds.push({ x, len: h * (phone ? rand(0.14, 0.2) : rand(0.2, 0.3)), dir, phase: rand(0, 6), delay: 0.35 + i * 0.12 })
        }
      }

      // Ivy grows from the top edge, never floating: in each top corner a
      // vine runs along the edge, and stems drop from the edge, longest and
      // most crowded at the corner. Leaves are strung along every stem.
      const stems: IvyStem[] = []
      const ivyReach = w * (phone ? 0.42 : 0.28)
      const addStem = (pts: number[], spacing: number, minSize: number, maxSize: number, delay: number, duration: number, sway: number) => {
        const length = Math.hypot(pts[6] - pts[0], pts[7] - pts[1]) * 1.1
        const n = Math.max(2, Math.floor(length / (spacing * s)))
        stems.push({
          pts,
          leaves: Array.from({ length: n }, (_, k) => {
            const u = (k + 0.5) / n
            return { u, side: k % 2 ? 1 : -1, size: s * rand(minSize, maxSize) * (1 - u * 0.4), tilt: rand(0.35, 0.95), color: IVY[Math.floor(Math.random() * IVY.length)] }
          }),
          delay,
          duration,
          phase: rand(0, 6),
          sway,
        })
      }
      for (const dir of [1, -1]) {
        const X = (d: number) => (dir === 1 ? d : w - d)
        const edge = ivyReach * rand(1, 1.2)
        addStem([X(-6), 3, X(edge * 0.33), 3 + rand(4, 10) * s, X(edge * 0.66), 2 + rand(6, 14) * s, X(edge), 3 + rand(8, 18) * s], 9, 12, 20, 0.15, 1.6, 0.008)
        const count = phone ? 5 : 8
        for (let i = 0; i < count; i++) {
          const f = i / count // 0 at the corner
          const x0 = X(ivyReach * Math.pow(f, 1.25) * 0.95 + rand(-6, 6) * s)
          const len = h * (phone ? 0.08 + 0.2 * (1 - f) : 0.1 + 0.32 * Math.pow(1 - f, 1.2)) * rand(0.75, 1.05)
          const drift = dir * rand(-0.1, 0.25) * len
          addStem(
            [x0, -4, x0 + rand(-14, 14) * s, len * 0.35, x0 + drift * 0.6 + rand(-18, 18) * s, len * 0.7, x0 + drift, len],
            11, 11, 19, 0.3 + f * 0.45, 1.3 + (1 - f) * 0.6, 0.025,
          )
        }
      }

      return (ctx, t) => {
        const wind = (x: number) => Math.sin(t * 0.9 + x * 0.004) * 0.6 + Math.sin(t * 0.37 + x * 0.0017) * 0.4

        // Ivy: each stem grows down (or along the edge) from where it is
        // anchored, swings a little from that point, and puts out leaves as
        // it reaches them.
        ctx.lineCap = "round"
        for (const st of stems) {
          const g = grow((t - st.delay) / st.duration)
          if (g <= 0) continue
          ctx.save()
          ctx.translate(st.pts[0], st.pts[1])
          ctx.rotate(Math.sin(t * 0.6 + st.phase) * st.sway)
          ctx.translate(-st.pts[0], -st.pts[1])
          ctx.strokeStyle = "#1c2612"
          ctx.lineWidth = 1.8 * s
          ctx.beginPath()
          ctx.moveTo(st.pts[0], st.pts[1])
          for (let u = 0.04; u < g + 0.04; u += 0.04) {
            const [x, y] = bez(st.pts, Math.min(u, g))
            ctx.lineTo(x, y)
          }
          ctx.stroke()
          for (const l of st.leaves) {
            if (l.u > g) break
            const [x, y] = bez(st.pts, l.u)
            const [tx, ty] = tangent(st.pts, l.u)
            // Leaves hang: halfway between the stem's direction and straight
            // down, spread to alternate sides.
            const angle = (Math.atan2(ty, tx) - Math.PI / 2) * 0.45 + l.side * l.tilt + Math.sin(t * 1.2 + l.u * 9 + st.phase) * 0.07
            const size = l.size * clamp((g - l.u) * 6, 0, 1)
            ctx.save()
            ctx.translate(x, y)
            ctx.rotate(angle)
            ctx.fillStyle = l.color
            ivyLeaf(ctx, size)
            if (size > 14 * s) {
              ctx.strokeStyle = "rgba(120,140,70,0.35)"
              ctx.lineWidth = 0.8
              ctx.beginPath()
              ctx.moveTo(0, size * 0.05)
              ctx.lineTo(0, size * 0.85)
              ctx.stroke()
            }
            ctx.restore()
          }
          ctx.restore()
        }

        // Ferns: a stem that unfurls, with paired leaflets shrinking to the tip.
        for (const f of fronds) {
          const g = grow((t - f.delay) / 1.4)
          if (g <= 0) continue
          const sway = wind(f.x) * 10 * s
          const bx = f.x
          const by = h + 6
          const cx = bx + f.dir * f.len * 0.25
          const cy = by - f.len * 0.95
          const tx = bx + f.dir * f.len * 0.85 + sway
          const ty = by - f.len * 0.5
          const at = (u: number) => [
            (1 - u) * (1 - u) * bx + 2 * (1 - u) * u * cx + u * u * tx,
            (1 - u) * (1 - u) * by + 2 * (1 - u) * u * cy + u * u * ty,
          ]
          ctx.strokeStyle = "#1a2310"
          ctx.fillStyle = "#1d2712"
          ctx.lineWidth = 2 * s
          ctx.beginPath()
          ctx.moveTo(bx, by)
          for (let u = 0.05; u <= g; u += 0.05) {
            const [x, y] = at(u)
            ctx.lineTo(x, y)
          }
          ctx.stroke()
          for (let u = 0.12; u <= g; u += 0.045) {
            const [x, y] = at(u)
            const [x2, y2] = at(u + 0.01)
            const ang = Math.atan2(y2 - y, x2 - x)
            const leafLen = f.len * 0.17 * Math.pow(1 - u, 0.7) * clamp((g - u) * 8, 0, 1)
            for (const side of [-1, 1]) {
              ctx.save()
              ctx.translate(x, y)
              ctx.rotate(ang + side * 1.15)
              ctx.beginPath()
              ctx.moveTo(0, 0)
              ctx.quadraticCurveTo(leafLen * 0.5, -leafLen * 0.22, leafLen, 0)
              ctx.quadraticCurveTo(leafLen * 0.5, leafLen * 0.22, 0, 0)
              ctx.fill()
              ctx.restore()
            }
          }
        }

        // Grass, back to front. The rim is the sunset catching an edge.
        layers.forEach((blades, li) => {
          const depthSway = [5, 8, 11][li] * s
          for (const b of blades) {
            const g = grow((t - b.delay) / 1)
            if (g <= 0) continue
            const sway = (wind(b.x) + Math.sin(t * 1.7 + b.phase) * 0.25) * depthSway * (b.len / (120 * s))
            ctx.fillStyle = b.color
            const [mx, my, tx, ty] = blade(ctx, b.x, h + 4, b.len * g, b.angle, b.curl, b.width, sway)
            if (b.rim) {
              ctx.strokeStyle = "rgba(255,186,104,0.28)"
              ctx.lineWidth = 0.8
              ctx.beginPath()
              ctx.moveTo(b.x + b.width / 2, h + 4)
              ctx.quadraticCurveTo(mx + b.width * 0.3, my, tx, ty)
              ctx.stroke()
            }
          }
        })
      }
    })
  }, [still])

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}
