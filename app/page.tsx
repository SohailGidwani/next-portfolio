"use client"

import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Education from './components/Education'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Triumphs from './components/Triumphs'
import Contact from './components/Contact'
import ProjectStructuredData from './components/ProjectStructuredData'
import { Toaster } from 'react-hot-toast'
import SectionDivider from './components/SectionDivider'
import GuidedTour from './components/GuidedTour'
import AmbientBackground from './components/AmbientBackground'

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [activeSkill, setActiveSkill] = useState<string | null>(null)
  const [tourStep, setTourStep] = useState<number | null>(null)

  const tourSteps = useMemo(
    () => [
      {
        id: "hero",
        title: "Signal Stack",
        description: "A high-level snapshot of your focus, impact, and availability.",
      },
      {
        id: "about",
        title: "About",
        description: "Your positioning and the kind of work you want to do next.",
      },
      {
        id: "experience",
        title: "Experience",
        description: "Highlights from research and industry work with measurable scope.",
      },
      {
        id: "skills",
        title: "Skills",
        description: "Your AI and systems toolkit, grouped by discipline.",
      },
      {
        id: "projects",
        title: "Projects",
        description: "Featured builds and case studies with outcomes.",
      },
      {
        id: "contact",
        title: "Contact",
        description: "Fast ways to connect and start a conversation.",
      },
    ],
    []
  )

  const startTour = () => setTourStep(0)
  const stopTour = () => setTourStep(null)
  const nextTourStep = () => {
    setTourStep((prev) => {
      if (prev === null) return null
      return prev + 1 >= tourSteps.length ? null : prev + 1
    })
  }
  const previousTourStep = () => {
    setTourStep((prev) => {
      if (prev === null) return null
      return prev - 1 < 0 ? 0 : prev - 1
    })
  }

  useEffect(() => {
    document.documentElement.style.removeProperty("overflow")
    document.body.style.removeProperty("overflow")
    document.body.style.removeProperty("padding-right")
    document.body.style.removeProperty("position")
  }, [])

  return (
    <>
      <ProjectStructuredData />
      <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
        <AmbientBackground />

        <Navbar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          onStartTour={startTour}
        />

        <main className="relative">
          <Hero setActiveSection={setActiveSection} />
          <SectionDivider />
          <About setActiveSection={setActiveSection} />
          <SectionDivider />
          <Education setActiveSection={setActiveSection} />
          <SectionDivider />
          <Experience setActiveSection={setActiveSection} activeSkill={activeSkill} />
          <SectionDivider />
          <Skills setActiveSection={setActiveSection} onSkillHover={setActiveSkill} />
          <SectionDivider />
          <Projects setActiveSection={setActiveSection} activeSkill={activeSkill} />
          <SectionDivider />
          <Triumphs setActiveSection={setActiveSection} />
          <SectionDivider />
          <Contact setActiveSection={setActiveSection} />
        </main>
        <Toaster position="bottom-right" />
      </div>
      <GuidedTour
        steps={tourSteps}
        stepIndex={tourStep}
        onClose={stopTour}
        onNext={nextTourStep}
        onPrevious={previousTourStep}
      />
    </>
  )
}
