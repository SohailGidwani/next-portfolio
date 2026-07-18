"use client"

import { useEffect, useRef, useState } from "react"
import { useInView } from "framer-motion"

interface AnimatedCounterProps {
  value: number
  suffix?: string
  duration?: number
  className?: string
}

export default function AnimatedCounter({
  value,
  suffix = "",
  duration = 1500,
  className = "",
}: AnimatedCounterProps) {
  // SSR the final value: the counter is an LCP candidate, and server-rendering
  // "0" defers the real paint until hydration + a full count-up (measured as a
  // 4.2s LCP). Painting the final value first keeps LCP at first render; the
  // count-up then restarts from 0 as a pure enhancement.
  const [count, setCount] = useState(value)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCount(value)
      return
    }

    setCount(0)
    const startTime = Date.now()
    const endValue = value

    const animate = () => {
      const now = Date.now()
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3)
      const currentValue = Math.floor(easeOut * endValue)

      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(endValue)
      }
    }

    requestAnimationFrame(animate)
  }, [isInView, value, duration])

  return (
    <span ref={ref} className={className}>
      {count}{suffix}
    </span>
  )
}
