"use client"

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

interface SkillHighlightContextType {
  activeSkill: string | null
  setActiveSkill: (skill: string | null) => void
}

const SkillHighlightContext = createContext<SkillHighlightContextType | null>(null)

export function useSkillHighlight() {
  const ctx = useContext(SkillHighlightContext)
  if (!ctx) throw new Error("useSkillHighlight must be used within SkillHighlightProvider")
  return ctx
}

export function SkillHighlightProvider({ children }: { children: ReactNode }) {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)

  const value = useMemo<SkillHighlightContextType>(
    () => ({ activeSkill, setActiveSkill }),
    [activeSkill]
  )

  return (
    <SkillHighlightContext.Provider value={value}>
      {children}
    </SkillHighlightContext.Provider>
  )
}
