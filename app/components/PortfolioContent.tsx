"use client"

import { useState } from "react"
import { useScrollEngine } from "./scroll/ScrollEngine"
import MinimalNav from "./MinimalNav"
import CommandPalette from "./CommandPalette"
import Hero from "./Hero"
import About from "./About"
import Education from "./Education"
import Experience from "./Experience"
import Skills from "./Skills"
import Projects from "./Projects"
import Triumphs from "./Triumphs"
import Personal from "./Personal"
import Contact from "./Contact"
import BackToTop from "./BackToTop"
import { Toaster } from "react-hot-toast"

export default function PortfolioContent() {
  const { activeSection, setActiveSection } = useScrollEngine()
  const [navVisible, setNavVisible] = useState(false)

  const handleHeroProgress = (progress: number) => {
    setNavVisible(progress > 0.3)
  }

  return (
    <>
      <MinimalNav activeSection={activeSection} visible={navVisible} />
      <CommandPalette onNavigate={(id) => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: "smooth" })
          setActiveSection(id)
        }
      }} />

      <main id="main-content" className="relative">
        <Hero onProgress={handleHeroProgress} />
        <About />
        <Education />
        <Experience />
        <Skills />
        <Projects />
        <Triumphs />
        <Personal />
        <Contact />
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(20px)",
            color: "#fff",
            fontSize: "13px",
          },
        }}
      />
      <BackToTop />
    </>
  )
}
