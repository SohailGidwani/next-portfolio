"use client"

import { useEffect, useRef, ReactNode } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useIsMobile, usePrefersReducedMotion } from '../hooks/useDeviceDetect'

interface PinnedSectionProps {
  children: ReactNode
  id: string
  scrubDuration?: number
  onProgress?: (progress: number, velocity: number) => void
}

export default function PinnedSection({
  children,
  id,
  scrubDuration = 2,
  onProgress,
}: PinnedSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const onProgressRef = useRef(onProgress)
  const isMobile = useIsMobile()
  const reducedMotion = usePrefersReducedMotion()

  onProgressRef.current = onProgress

  const shouldPin = isMobile === false && !reducedMotion

  useEffect(() => {
    if (!sectionRef.current || !shouldPin) return

    triggerRef.current = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${window.innerHeight * scrubDuration}`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const velocity = Math.min(Math.abs(self.getVelocity()) / 1000, 1)
        onProgressRef.current?.(self.progress, velocity)
      },
    })

    return () => {
      triggerRef.current?.kill()
    }
  }, [scrubDuration, shouldPin])

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`relative w-full overflow-hidden ${shouldPin ? 'min-h-screen' : 'min-h-0'}`}
    >
      {children}
    </section>
  )
}
