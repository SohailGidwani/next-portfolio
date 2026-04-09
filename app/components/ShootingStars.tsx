"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  length: number
  speed: number
  opacity: number
  angle: number
  active: boolean
  delay: number
  trail: { x: number; y: number; opacity: number }[]
}

export default function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<Star[]>([])
  const animationRef = useRef<number>(0)
  const sizeRef = useRef({ w: 0, h: 0 })

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      sizeRef.current = { w: rect.width, h: rect.height }
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      initStars(rect.width, rect.height)
    }

    const initStars = (width: number, height: number) => {
      const starCount = 6
      const stars: Star[] = []
      for (let i = 0; i < starCount; i++) {
        stars.push(createStar(width, height, i * 2000))
      }
      starsRef.current = stars
    }

    const createStar = (width: number, height: number, delay: number = 0): Star => {
      const angle = (Math.random() * 30 + 210) * (Math.PI / 180)
      const startFromTop = Math.random() > 0.3
      const x = startFromTop
        ? Math.random() * width * 0.8 + width * 0.1
        : width + 10
      const y = startFromTop ? -10 : Math.random() * height * 0.4

      return {
        x, y,
        length: Math.random() * 80 + 60,
        speed: Math.random() * 4 + 8,
        opacity: 0,
        angle,
        active: false,
        delay,
        trail: [],
      }
    }

    const animate = (timestamp: number) => {
      animationRef.current = requestAnimationFrame(animate)

      const { w: width, h: height } = sizeRef.current
      ctx.clearRect(0, 0, width, height)

      const stars = starsRef.current
      const isDark = document.documentElement.classList.contains("dark")

      stars.forEach((star, index) => {
        if (!star.active) {
          if (timestamp > star.delay) {
            star.active = true
            star.opacity = 0
          } else {
            return
          }
        }

        if (star.opacity < 1) {
          star.opacity = Math.min(1, star.opacity + 0.08)
        }

        star.x += Math.cos(star.angle) * star.speed
        star.y -= Math.sin(star.angle) * star.speed
        star.trail.unshift({ x: star.x, y: star.y, opacity: star.opacity })

        if (star.trail.length > 20) {
          star.trail.pop()
        }

        if (star.trail.length > 1) {
          for (let i = 0; i < star.trail.length - 1; i++) {
            const t1 = star.trail[i]
            const t2 = star.trail[i + 1]
            const trailOpacity = (1 - i / star.trail.length) * star.opacity * 0.6

            const gradient = ctx.createLinearGradient(t1.x, t1.y, t2.x, t2.y)
            if (isDark) {
              gradient.addColorStop(0, `rgba(45, 212, 191, ${trailOpacity})`)
              gradient.addColorStop(1, `rgba(45, 212, 191, ${trailOpacity * 0.3})`)
            } else {
              gradient.addColorStop(0, `rgba(20, 120, 100, ${trailOpacity})`)
              gradient.addColorStop(1, `rgba(20, 120, 100, ${trailOpacity * 0.3})`)
            }

            ctx.beginPath()
            ctx.moveTo(t1.x, t1.y)
            ctx.lineTo(t2.x, t2.y)
            ctx.strokeStyle = gradient
            ctx.lineWidth = Math.max(0.5, 2 - i * 0.1)
            ctx.lineCap = "round"
            ctx.stroke()
          }
        }

        const headGlow = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, 6
        )
        if (isDark) {
          headGlow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.9})`)
          headGlow.addColorStop(0.3, `rgba(45, 212, 191, ${star.opacity * 0.6})`)
          headGlow.addColorStop(1, "rgba(45, 212, 191, 0)")
        } else {
          headGlow.addColorStop(0, `rgba(255, 255, 255, ${star.opacity * 0.8})`)
          headGlow.addColorStop(0.3, `rgba(20, 120, 100, ${star.opacity * 0.5})`)
          headGlow.addColorStop(1, "rgba(20, 120, 100, 0)")
        }

        ctx.beginPath()
        ctx.arc(star.x, star.y, 6, 0, Math.PI * 2)
        ctx.fillStyle = headGlow
        ctx.fill()

        ctx.beginPath()
        ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        if (star.x < -100 || star.y > height + 100 || star.x > width + 100) {
          const newStar = createStar(width, height, 0)
          newStar.active = false
          newStar.delay = timestamp + Math.random() * 3000 + 1500
          stars[index] = newStar
        }
      })
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationRef.current)
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
