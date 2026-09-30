"use client"

import { useEffect, useRef } from "react"
import { clamp, rand, runCanvas } from "./canvasLoop"

// Pitch units match PitchLines in GameScene: 1050 x 680 with a 25-unit margin.
const W = 1050
const H = 680
// A 4-3-3 for the side attacking right; the other side is its mirror.
const SHAPE = [
  [60, 340],
  [230, 130], [210, 270], [210, 410], [230, 550],
  [380, 200], [360, 340], [380, 480],
  [510, 150], [530, 340], [510, 530],
]
// The poster's two kits: Real Madrid white, Bayern red, each with a keeper.
const KIT = [
  { shirt: "#f3f2ee", keeper: "#d8e24a" },
  { shirt: "#d62f3b", keeper: "#2b2b2b" },
]

type Player = { team: number; i: number; x: number; y: number; wob: number }
type Trail = { pts: number[]; age: number }

/**
 * FIFA: a match plays out on the chalk pitch. Both sides hold their shape and
 * shift with the ball; it moves in curved passes that leave a chalk trail
 * behind them, and every few passes it is cut out and possession changes.
 * Floodlights glow from the corners and camera flashes go off in the stands.
 */
export default function MatchPlay({ still }: { still: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ref.current) return
    return runCanvas(ref.current, still, (w, h) => {
      // Same fit as the SVG: a 4% inset, contained, and turned end-on below
      // the md breakpoint, where the pitch is drawn rotated 90 degrees.
      const vertical = w < 768
      const ax = w * 0.04
      const ay = h * 0.04
      const aw = w * 0.92
      const ah = h * 0.92
      const scale = vertical ? Math.min(aw / H, ah / W) : Math.min(aw / W, ah / H)
      const ox = ax + (aw - (vertical ? H : W) * scale) / 2
      const oy = ay + (ah - (vertical ? W : H) * scale) / 2
      const toScreen = (px: number, py: number): [number, number] =>
        vertical ? [ox + (H - py) * scale, oy + px * scale] : [ox + px * scale, oy + py * scale]
      const pitch = vertical
        ? { x: ox, y: oy, w: H * scale, h: W * scale }
        : { x: ox, y: oy, w: W * scale, h: H * scale }

      const bands = [
        { x: 0, y: 0, w, h: pitch.y },
        { x: 0, y: pitch.y + pitch.h, w, h: h - pitch.y - pitch.h },
        { x: 0, y: pitch.y, w: pitch.x, h: pitch.h },
        { x: pitch.x + pitch.w, y: pitch.y, w: w - pitch.x - pitch.w, h: pitch.h },
      ].filter((b) => b.w > 8 && b.h > 8)
      const stands = { bands, total: bands.reduce((sum, b) => sum + b.w * b.h, 0) }

      const players: Player[] = []
      for (const team of [0, 1]) {
        SHAPE.forEach(([x, y], i) => players.push({ team, i, x: team ? W - x : x, y, wob: rand(0, 6) }))
      }
      const home = (p: Player) => {
        const [x, y] = SHAPE[p.i]
        return p.team ? [W - x, y] : [x, y]
      }

      let possession = 0
      let holder = players[6]
      let ball = { x: holder.x, y: holder.y }
      let pass: { from: number[]; ctrl: number[]; to: Player; t: number; dur: number; trail: Trail } | null = null
      let hold = 0.6
      let passesLeft = 5
      const trails: Trail[] = []
      const flashes: { x: number; y: number; age: number; r: number }[] = []

      const startPass = () => {
        const mates = players.filter((p) => p.team === possession && p !== holder && p.i !== 0)
        const forward = possession === 0 ? 1 : -1
        let to: Player
        if (passesLeft <= 0) {
          // Cut out: the nearest opponent to a forward point steals it.
          const aim = { x: ball.x + forward * 180, y: ball.y + rand(-120, 120) }
          const rivals = players.filter((p) => p.team !== possession)
          to = rivals.reduce((a, b) => (Math.hypot(b.x - aim.x, b.y - aim.y) < Math.hypot(a.x - aim.x, a.y - aim.y) ? b : a))
          possession = 1 - possession
          passesLeft = Math.round(rand(4, 7))
        } else {
          // Prefer a mate further up the pitch and a pass of sensible length.
          const scored = mates.map((m) => {
            const d = Math.hypot(m.x - ball.x, m.y - ball.y)
            return { m, score: (m.x - ball.x) * forward * 0.6 - Math.abs(d - 240) * 0.5 + rand(0, 160) }
          })
          to = scored.sort((a, b) => b.score - a.score)[0].m
          passesLeft -= 1
        }
        const dist = Math.hypot(to.x - ball.x, to.y - ball.y)
        const mx = (ball.x + to.x) / 2
        const my = (ball.y + to.y) / 2
        const bend = rand(-0.2, 0.2) * dist
        const nx = -(to.y - ball.y) / (dist || 1)
        const ny = (to.x - ball.x) / (dist || 1)
        const trail: Trail = { pts: [ball.x, ball.y], age: -1 }
        trails.push(trail)
        pass = { from: [ball.x, ball.y], ctrl: [mx + nx * bend, my + ny * bend], to, t: 0, dur: clamp(dist / 520, 0.45, 1.15), trail }
      }

      return (ctx, t, dt) => {
        // Floodlights: soft glows from the four corners, breathing slightly.
        ctx.globalCompositeOperation = "lighter"
        for (const [cx, cy] of [[0, 0], [w, 0], [0, h], [w, h]]) {
          const r = Math.max(w, h) * 0.45
          const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, r)
          glow.addColorStop(0, `rgba(210,255,220,${0.13 + Math.sin(t * 0.8 + cx) * 0.02})`)
          glow.addColorStop(1, "rgba(210,255,220,0)")
          ctx.fillStyle = glow
          ctx.fillRect(cx === 0 ? 0 : w - r, cy === 0 ? 0 : h - r, r, r)
        }

        // Camera flashes in the stands: only in the bands between the
        // touchlines and the screen edge, picked in proportion to their area.
        if (!still && stands.total > 0 && Math.random() < dt * (vertical ? 3 : 6)) {
          let pick = Math.random() * stands.total
          const band = stands.bands.find((b) => (pick -= b.w * b.h) < 0) ?? stands.bands[0]
          flashes.push({ x: band.x + rand(0, band.w), y: band.y + rand(0, band.h), age: 0, r: rand(8, 18) })
        }
        for (let i = flashes.length - 1; i >= 0; i--) {
          const f = flashes[i]
          f.age += dt
          if (f.age > 0.18) {
            flashes.splice(i, 1)
            continue
          }
          const a = 1 - f.age / 0.18
          const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r)
          g.addColorStop(0, `rgba(255,255,255,${0.9 * a})`)
          g.addColorStop(1, "rgba(255,255,255,0)")
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalCompositeOperation = "source-over"

        // Play.
        if (!still) {
          if (pass) {
            pass.t += dt
            const u = 1 - Math.pow(1 - clamp(pass.t / pass.dur, 0, 1), 1.6)
            const v = 1 - u
            ball = {
              x: v * v * pass.from[0] + 2 * v * u * pass.ctrl[0] + u * u * pass.to.x,
              y: v * v * pass.from[1] + 2 * v * u * pass.ctrl[1] + u * u * pass.to.y,
            }
            pass.trail.pts.push(ball.x, ball.y)
            if (pass.t >= pass.dur) {
              holder = pass.to
              pass.trail.age = 0
              pass = null
              hold = rand(0.35, 0.9)
            }
          } else {
            const forward = holder.team === 0 ? 1 : -1
            ball = { x: holder.x + forward * 9, y: holder.y + 3 }
            hold -= dt
            if (hold <= 0) startPass()
          }

          // Each side holds its shape, pushes up when it has the ball, and
          // leans toward it. Keepers barely move.
          for (const p of players) {
            const [hx, hy] = home(p)
            const dir = p.team === 0 ? 1 : -1
            const keeper = p.i === 0
            const push = keeper ? 0 : dir * (p.team === possession ? 70 : -30)
            const tx = clamp(hx + push + (ball.x - W / 2) * (keeper ? 0.05 : 0.28), 40, W - 40)
            const ty = clamp(hy + (ball.y - H / 2) * (keeper ? 0.25 : 0.18), 40, H - 40)
            const pull = pass && p === pass.to ? 3 : 1.2
            p.x += (tx - p.x) * Math.min(1, dt * pull) + Math.sin(t * 1.3 + p.wob) * 0.15
            p.y += (ty - p.y) * Math.min(1, dt * pull) + Math.cos(t * 1.1 + p.wob) * 0.15
          }
        }

        // Chalk trails of recent passes.
        ctx.setLineDash([6, 6])
        ctx.lineCap = "round"
        for (let i = trails.length - 1; i >= 0; i--) {
          const tr = trails[i]
          if (tr.age >= 0) tr.age += dt
          if (tr.age > 1.6) {
            trails.splice(i, 1)
            continue
          }
          const a = tr.age < 0 ? 0.6 : 0.6 * (1 - tr.age / 1.6)
          ctx.strokeStyle = `rgba(240,255,240,${a})`
          ctx.lineWidth = 1.6
          ctx.beginPath()
          for (let k = 0; k < tr.pts.length; k += 2) {
            const [sx, sy] = toScreen(tr.pts[k], tr.pts[k + 1])
            if (k === 0) ctx.moveTo(sx, sy)
            else ctx.lineTo(sx, sy)
          }
          ctx.stroke()
        }
        ctx.setLineDash([])

        const pr = Math.max(4, 7 * scale)
        for (const p of players) {
          const [sx, sy] = toScreen(p.x, p.y)
          ctx.fillStyle = "rgba(0,0,0,0.35)"
          ctx.beginPath()
          ctx.ellipse(sx + 1.5, sy + pr * 0.8, pr * 0.9, pr * 0.4, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.fillStyle = p.i === 0 ? KIT[p.team].keeper : KIT[p.team].shirt
          ctx.beginPath()
          ctx.arc(sx, sy, pr, 0, Math.PI * 2)
          ctx.fill()
          ctx.strokeStyle = "rgba(0,0,0,0.45)"
          ctx.lineWidth = 1
          ctx.stroke()
          if (p === holder && !pass) {
            ctx.strokeStyle = "rgba(255,255,255,0.55)"
            ctx.beginPath()
            ctx.arc(sx, sy, pr + 4, 0, Math.PI * 2)
            ctx.stroke()
          }
        }

        const [bx, by] = toScreen(ball.x, ball.y)
        ctx.save()
        ctx.shadowColor = "rgba(255,255,255,0.9)"
        ctx.shadowBlur = 8
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.arc(bx, by, Math.max(2.6, 3.6 * scale), 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    })
  }, [still])

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />
}
