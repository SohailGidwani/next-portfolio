"use client"

import { createContext, useContext, useEffect, useRef, useState, useCallback, ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
  const [registrationVersion, setRegistrationVersion] = useState(0)
  const sectionsRef = useRef<Map<string, HTMLElement>>(new Map())
  const spyTriggersRef = useRef<ScrollTrigger[]>([])

  const registerSection = useCallback((id: string, element: HTMLElement) => {
    sectionsRef.current.set(id, element)
    setRegistrationVersion(v => v + 1)
  }, [])

  useEffect(() => {
    ScrollTrigger.defaults({
      toggleActions: "play none none reverse",
    })
  }, [])

  useEffect(() => {
    spyTriggersRef.current.forEach(t => t.kill())
    spyTriggersRef.current = []

    sectionsRef.current.forEach((element, id) => {
      spyTriggersRef.current.push(
        ScrollTrigger.create({
          trigger: element,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveSection(id),
          onEnterBack: () => setActiveSection(id),
        })
      )
    })

    return () => {
      spyTriggersRef.current.forEach(t => t.kill())
      spyTriggersRef.current = []
    }
  }, [registrationVersion])

  return (
    <ScrollContext.Provider value={{ isReady: true, activeSection, setActiveSection, registerSection }}>
      {children}
    </ScrollContext.Provider>
  )
}
