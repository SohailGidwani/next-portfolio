"use client"

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollContextType {
  isReady: boolean
  activeSection: string
  setActiveSection: (id: string) => void
  registerSection: (id: string, element: HTMLElement) => void
}

const ScrollContext = createContext<ScrollContextType>({
  isReady: false,
  activeSection: 'hero',
  setActiveSection: () => {},
  registerSection: () => {},
})

export function useScrollEngine() {
  return useContext(ScrollContext)
}

export default function ScrollEngine({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState('hero')
  const sectionsRef = useRef<Map<string, HTMLElement>>(new Map())
  const spyTriggersRef = useRef<ScrollTrigger[]>([])
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const rebuildSpies = useCallback(() => {
    spyTriggersRef.current.forEach(t => t.kill())
    spyTriggersRef.current = []

    sectionsRef.current.forEach((element, id) => {
      spyTriggersRef.current.push(
        ScrollTrigger.create({
          trigger: element,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        })
      )
    })
  }, [])

  const registerSection = useCallback((id: string, element: HTMLElement) => {
    sectionsRef.current.set(id, element)

    // Debounce: wait for all sections to register before building spy triggers
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      // Wait an extra frame for GSAP pin spacers to be inserted
      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
        rebuildSpies()
      })
    }, 300)
  }, [rebuildSpies])

  useEffect(() => {
    ScrollTrigger.defaults({
      toggleActions: "play none none reverse",
    })

    return () => {
      spyTriggersRef.current.forEach(t => t.kill())
      spyTriggersRef.current = []
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  return (
    <ScrollContext.Provider value={{ isReady: true, activeSection, setActiveSection, registerSection }}>
      {children}
    </ScrollContext.Provider>
  )
}
