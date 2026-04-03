"use client"

import { useState } from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Education from './components/Education'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Triumphs from './components/Triumphs'
import Contact from './components/Contact'
import Personal from './components/Personal'
import ProjectStructuredData from './components/ProjectStructuredData'
import FAQStructuredData from './components/FAQStructuredData'
import BreadcrumbStructuredData from './components/BreadcrumbStructuredData'
import { Toaster } from 'react-hot-toast'
import CommandPalette from './components/CommandPalette'
import SkipLink from './components/SkipLink'
import BackToTop from './components/BackToTop'
import KeyboardShortcuts from './components/KeyboardShortcuts'

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<string>('hero')
  const [activeSkill, setActiveSkill] = useState<string | null>(null)

  return (
    <>
      <SkipLink />
      <ProjectStructuredData />
      <FAQStructuredData />
      <BreadcrumbStructuredData />
      <CommandPalette onNavigate={setActiveSection} />
      <KeyboardShortcuts />

      <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
        <main id="main-content" className="relative" role="main">
          <Hero setActiveSection={setActiveSection} />
          <About setActiveSection={setActiveSection} />
          <Education setActiveSection={setActiveSection} />
          <Experience setActiveSection={setActiveSection} activeSkill={activeSkill} />
          <Skills setActiveSection={setActiveSection} onSkillHover={setActiveSkill} />
          <Projects setActiveSection={setActiveSection} activeSkill={activeSkill} />
          <Triumphs setActiveSection={setActiveSection} />
          <Personal setActiveSection={setActiveSection} />
          <Contact setActiveSection={setActiveSection} />
        </main>
        <Toaster position="bottom-right" />
        <BackToTop />
      </div>
    </>
  )
}
