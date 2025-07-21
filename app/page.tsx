"use client"

import { useState } from 'react'
import { ThemeProvider } from "./components/ThemeProvider"
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Education from './components/Education'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Triumphs from './components/Triumphs'
import Contact from './components/Contact'
import ScrollAnimation from './components/ScrollAnimation'
import ProjectStructuredData from './components/ProjectStructuredData'
import { Toaster } from 'react-hot-toast'
import SectionDivider from './components/SectionDivider'

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<string>('hero')

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProjectStructuredData />
      <div className="min-h-screen bg-white dark:bg-slate-950 text-gray-800 dark:text-slate-200 transition-colors duration-300">
        <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
        <ScrollAnimation>
          <Hero setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <ScrollAnimation>
          <About setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <SectionDivider />
        <ScrollAnimation>
          <Education setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <SectionDivider />
        <ScrollAnimation>
          <Experience setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <SectionDivider />
        <ScrollAnimation>
          <Skills setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <SectionDivider />
        <ScrollAnimation>
          <Projects setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <SectionDivider />
        <ScrollAnimation>
          <Triumphs setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <SectionDivider />
        <ScrollAnimation>
          <Contact setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <Toaster position="bottom-right" />
      </div>
    </ThemeProvider>
  )
}