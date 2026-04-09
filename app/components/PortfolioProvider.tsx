"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { useScrollSpy } from "@/app/hooks/useScrollSpy"

export const SECTION_IDS = [
  "hero", "about", "education", "experience",
  "skills", "projects", "triumphs", "personal", "contact",
] as const

export const TOUR_STEPS = [
  { id: "hero", title: "At a Glance", description: "A high-level snapshot of my focus, impact, and availability." },
  { id: "about", title: "About", description: "My positioning and the kind of work I want to do next." },
  { id: "education", title: "Education", description: "Academic foundations and coursework shaping my AI systems focus." },
  { id: "experience", title: "Experience", description: "Highlights from research and industry work with measurable scope." },
  { id: "skills", title: "Skills", description: "Your AI and systems toolkit, grouped by discipline." },
  { id: "projects", title: "Projects", description: "Featured builds and case studies with outcomes." },
  { id: "triumphs", title: "Triumphs", description: "Certifications, awards, and milestones along the way." },
  { id: "personal", title: "Personal", description: "Get to know me beyond the professional side - my interests, hobbies, and what I enjoy." },
  { id: "contact", title: "Contact", description: "Fast ways to connect and start a conversation." },
]

interface PortfolioContextType {
  activeSection: string
  setActiveSection: (section: string) => void
  activeSkill: string | null
  setActiveSkill: (skill: string | null) => void
  tourStep: number | null
  startTour: () => void
  stopTour: () => void
  nextTourStep: () => void
  previousTourStep: () => void
}

const PortfolioContext = createContext<PortfolioContextType | null>(null)

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error("usePortfolio must be used within PortfolioProvider")
  return ctx
}

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState("hero")
  const [activeSkill, setActiveSkill] = useState<string | null>(null)
  const [tourStep, setTourStep] = useState<number | null>(null)

  const sectionIds = useMemo(() => [...SECTION_IDS], [])
  const handleSectionChange = useCallback((id: string) => setActiveSection(id), [])

  useScrollSpy(sectionIds, handleSectionChange)

  const startTour = useCallback(() => setTourStep(0), [])
  const stopTour = useCallback(() => setTourStep(null), [])
  const nextTourStep = useCallback(() => {
    setTourStep((prev) => {
      if (prev === null) return null
      return prev + 1 >= TOUR_STEPS.length ? null : prev + 1
    })
  }, [])
  const previousTourStep = useCallback(() => {
    setTourStep((prev) => {
      if (prev === null) return null
      return prev - 1 < 0 ? 0 : prev - 1
    })
  }, [])

  useEffect(() => {
    document.documentElement.style.removeProperty("overflow")
    document.body.style.removeProperty("overflow")
    document.body.style.removeProperty("padding-right")
    document.body.style.removeProperty("position")
  }, [])

  const value = useMemo<PortfolioContextType>(() => ({
    activeSection, setActiveSection,
    activeSkill, setActiveSkill,
    tourStep, startTour, stopTour, nextTourStep, previousTourStep,
  }), [activeSection, activeSkill, tourStep, startTour, stopTour, nextTourStep, previousTourStep])

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}
