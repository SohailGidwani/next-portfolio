"use client"

import { useEffect, useState, type RefObject } from "react"

// How long the page must be still, with the element in view, before it counts.
const DWELL_MS = 220

/**
 * True once the element has been at least `amount` in view while the page
 * sat still for a moment, and from then on.
 *
 * For moments that play once. "Once it comes into view" is spent by a fast
 * trackpad flick that carries the element past in a blur; this waits until
 * the visitor has actually stopped with it in front of them. Every scroll
 * restarts the wait, momentum included, so flying past never counts.
 */
export function useSettledInView(ref: RefObject<Element | null>, amount = 0.6) {
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || settled) return
    let visible = false
    let timer = 0
    const wait = () => {
      window.clearTimeout(timer)
      if (visible) timer = window.setTimeout(() => setSettled(true), DWELL_MS)
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= amount
        wait()
      },
      { threshold: [0, amount] },
    )
    io.observe(el)
    document.addEventListener("scroll", wait, { passive: true, capture: true })
    return () => {
      io.disconnect()
      window.clearTimeout(timer)
      document.removeEventListener("scroll", wait, { capture: true })
    }
  }, [ref, amount, settled])

  return settled
}
