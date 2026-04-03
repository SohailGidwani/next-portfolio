"use client"

import { useEffect, useRef, useState, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface PinnedSectionProps {
  children: ReactNode
  id: string
  pinSpacerClassName?: string
  scrubDuration?: number
  onProgress?: (progress: number, velocity: number) => void
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

export default function PinnedSection({
  children,
  id,
  scrubDuration = 2,
  onProgress,
}: PinnedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const isMobile = useIsMobile()
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!sectionRef.current || isMobile || reducedMotion) return

    triggerRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${window.innerHeight * scrubDuration}`,
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const velocity = Math.min(Math.abs(self.getVelocity()) / 1000, 1)
        onProgress?.(self.progress, velocity)
      },
    })

    return () => {
      triggerRef.current?.kill()
    }
  }, [scrubDuration, onProgress, isMobile, reducedMotion])

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative w-full overflow-hidden ${isMobile || reducedMotion ? 'min-h-0' : 'min-h-screen'}`}
    >
      {children}
    </section>
  )
}
