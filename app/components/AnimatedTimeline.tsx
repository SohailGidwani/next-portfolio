"use client"

import { useEffect, useRef, ReactNode } from "react"
import { gsap } from "gsap"

interface TimelineEntry {
  id: string
  content: ReactNode
}

interface AnimatedTimelineProps {
  entries: TimelineEntry[]
  progress: number
}

export default function AnimatedTimeline({ entries, progress }: AnimatedTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!lineRef.current) return
    const lineHeight = progress * 100
    gsap.to(lineRef.current, {
      height: `${lineHeight}%`,
      duration: 0.3,
      ease: "power2.out",
    })
  }, [progress])

  useEffect(() => {
    cardRefs.current.forEach((card, i) => {
      if (!card) return
      const entryProgress = (i + 1) / entries.length
      const visible = progress >= entryProgress - 0.15

      gsap.to(card, {
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 40,
        duration: 0.5,
        ease: "power2.out",
      })
    })
  }, [progress, entries.length])

  return (
    <div ref={containerRef} className="relative">
      {/* Vertical connecting line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-white/[0.06] md:left-1/2 md:-translate-x-px">
        <div
          ref={lineRef}
          className="w-full bg-white/20"
          style={{ height: "0%" }}
        />
      </div>

      <div className="space-y-12 md:space-y-16">
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            ref={(el) => { cardRefs.current[i] = el }}
            className={`relative pl-12 md:pl-0 md:w-1/2 opacity-0 translate-y-10 ${
              i % 2 === 0 ? "md:pr-12 md:ml-0" : "md:pl-12 md:ml-auto"
            }`}
          >
            {/* Dot on the timeline */}
            <div
              className={`absolute top-6 left-[13px] h-2.5 w-2.5 rounded-full border border-white/20 bg-[#090909] md:top-6 ${
                i % 2 === 0
                  ? "md:left-auto md:right-[-5px]"
                  : "md:left-[-6px]"
              }`}
            />
            {entry.content}
          </div>
        ))}
      </div>
    </div>
  )
}
