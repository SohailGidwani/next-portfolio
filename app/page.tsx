"use client"

import { useState } from 'react'
import { ThemeProvider } from "next-themes"
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

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState<string>('hero')

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ProjectStructuredData />
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        <Navbar activeSection={activeSection} setActiveSection={setActiveSection} />
        <ScrollAnimation>
          <Hero setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <ScrollAnimation>
          <About setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <ScrollAnimation>
          <Experience setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <ScrollAnimation>
          <Education setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <ScrollAnimation>
          <Skills setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <ScrollAnimation>
          <Projects setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <ScrollAnimation>
          <Triumphs setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <ScrollAnimation>
          <Contact setActiveSection={setActiveSection} />
        </ScrollAnimation>
        <Toaster position="bottom-right" />
      </div>
    </ThemeProvider>
  )
}