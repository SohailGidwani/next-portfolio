"use client"

import { useEffect, useRef } from "react"

interface Orb {
  x: number
  y: number
  radius: number
  phaseX: number
  phaseY: number
  speedX: number
  speedY: number
  driftX: number
  driftY: number
  color: [number, number, number]
}

const FRAME_INTERVAL = 1000 / 30

export default function AuroraMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const orbsRef = useRef<Orb[]>([])
  const animRef = useRef<number>(0)
  const sizeRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      sizeRef.current = { w: rect.width, h: rect.height }
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      initOrbs(rect.width, rect.height)
    }

    const initOrbs = (w: number, h: number) => {
      orbsRef.current = [
        {
          x: w * 0.25, y: h * 0.3,
          radius: Math.max(w, h) * 0.35,
          phaseX: 0, phaseY: 0.5,
          speedX: 0.15, speedY: 0.12,
          driftX: w * 0.12, driftY: h * 0.1,
          color: [245, 240, 232],
        },
        {
          x: w * 0.7, y: h * 0.25,
          radius: Math.max(w, h) * 0.3,
          phaseX: 2, phaseY: 1,
          speedX: 0.1, speedY: 0.14,
          driftX: w * 0.1, driftY: h * 0.08,
          color: [235, 190, 130],
        },
        {
          x: w * 0.5, y: h * 0.7,
          radius: Math.max(w, h) * 0.32,
          phaseX: 4, phaseY: 3,
          speedX: 0.12, speedY: 0.09,
          driftX: w * 0.08, driftY: h * 0.12,
          color: [175, 185, 175],
        },
        {
          x: w * 0.15, y: h * 0.75,
          radius: Math.max(w, h) * 0.22,
          phaseX: 1.5, phaseY: 4.2,
          speedX: 0.08, speedY: 0.11,
          driftX: w * 0.06, driftY: h * 0.09,
          color: [220, 200, 185],
        },
      ]
    }

    const drawFrame = (time: number) => {
      const { w, h } = sizeRef.current
      const isDark = document.documentElement.classList.contains("dark")
      ctx.clearRect(0, 0, w, h)
      const baseAlpha = isDark ? 0.16 : 0.075

      for (const orb of orbsRef.current) {
        const cx = orb.x + Math.sin(time * orb.speedX + orb.phaseX) * orb.driftX
        const cy = orb.y + Math.cos(time * orb.speedY + orb.phaseY) * orb.driftY
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orb.radius)
        const [r, g, b] = orb.color
        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${baseAlpha})`)
        grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${baseAlpha * 0.5})`)
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
        ctx.fillStyle = grad
        ctx.fillRect(0, 0, w, h)
      }
    }

    handleResize()

    if (prefersReduced) {
      drawFrame(0)
      const onResize = () => {
        handleResize()
        drawFrame(0)
      }
      window.addEventListener("resize", onResize)
      return () => window.removeEventListener("resize", onResize)
    }

    let time = 0
    let lastFrameTime = 0

    const animate = (timestamp: number) => {
      animRef.current = requestAnimationFrame(animate)
      const delta = timestamp - lastFrameTime
      if (delta < FRAME_INTERVAL) return
      lastFrameTime = timestamp - (delta % FRAME_INTERVAL)

      drawFrame(time)
      time += 0.008
    }

    window.addEventListener("resize", handleResize)
    animRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animRef.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ willChange: "transform" }}
      aria-hidden="true"
    />
  )
}
