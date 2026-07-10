"use client"

import { useEffect } from "react"

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
              onSectionChange(id)
            }, DEBOUNCE_MS)
          }
        }
      },
      // A narrow viewport band works for sections of any height. An element
      // threshold (previously 30%) can never be reached by very tall sections.
      { threshold: 0, rootMargin: "-20% 0px -65% 0px" }
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
