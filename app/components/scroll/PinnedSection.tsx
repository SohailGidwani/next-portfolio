"use client"

import { useEffect, useRef, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface PinnedSectionProps {
  children: ReactNode
  id: string
  pinSpacerClassName?: string
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

  useEffect(() => {
    if (!sectionRef.current) return

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
  }, [scrubDuration, onProgress])

  return (
    <section
      ref={sectionRef}
      id={id}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {children}
    </section>
  )
}
