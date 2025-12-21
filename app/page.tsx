"use client"

import { useEffect, useState } from 'react'
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

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<string>('hero')

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
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 right-[-10%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.18),transparent_70%)] blur-2xl animate-float-slow" />
          <div className="absolute top-[20%] left-[-12%] h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.2),transparent_65%)] blur-3xl animate-float-slower" />
          <div className="absolute bottom-[-20%] right-[12%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(14,116,144,0.18),transparent_65%)] blur-3xl animate-float-slow" />
          <div className="absolute left-1/2 top-10 h-px w-[60%] -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-35 animate-pulse-soft" />
          <div className="absolute inset-0 grain" />
        </div>

        <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />

        <main className="relative">
          <Hero setActiveSection={setActiveSection} />
          <SectionDivider />
          <About setActiveSection={setActiveSection} />
          <SectionDivider />
          <Education setActiveSection={setActiveSection} />
          <SectionDivider />
          <Experience setActiveSection={setActiveSection} />
          <SectionDivider />
          <Skills setActiveSection={setActiveSection} />
          <SectionDivider />
          <Projects setActiveSection={setActiveSection} />
          <SectionDivider />
          <Triumphs setActiveSection={setActiveSection} />
          <SectionDivider />
          <Contact setActiveSection={setActiveSection} />
        </main>
        <Toaster position="bottom-right" />
      </div>
    </>
  )
}
