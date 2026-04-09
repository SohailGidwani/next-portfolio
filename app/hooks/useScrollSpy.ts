"use client"

import { useEffect } from "react"
import { triggerHaptic } from "@/app/components/ui/haptics"

const DEBOUNCE_MS = 100

export function useScrollSpy(
  sectionIds: string[],
  onSectionChange: (sectionId: string) => void
) {
  useEffect(() => {
    let pending: ReturnType<typeof setTimeout> | null = null

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            if (pending) clearTimeout(pending)
            const id = entry.target.id
            pending = setTimeout(() => {
              triggerHaptic(10)
              onSectionChange(id)
            }, DEBOUNCE_MS)
          }
        }
      },
      { threshold: 0.3, rootMargin: "-10% 0px -10% 0px" }
    )

    const elements: Element[] = []
    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) {
        observer.observe(el)
        elements.push(el)
      }
    }

    return () => {
      if (pending) clearTimeout(pending)
      for (const el of elements) {
        observer.unobserve(el)
      }
    }
  }, [sectionIds, onSectionChange])
}
