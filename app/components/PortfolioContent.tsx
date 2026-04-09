"use client"

import { useState, useEffect } from "react"
import { useScrollEngine } from "./scroll/ScrollEngine"
import { ScrollTrigger } from "gsap/ScrollTrigger"
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

  useEffect(() => {
    const onScroll = () => {
      setNavVisible(window.scrollY > window.innerHeight * 0.4)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh(true)
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative min-h-screen bg-[#090909] text-white">
      <MinimalNav activeSection={activeSection} visible={navVisible} />
      <CommandPalette onNavigate={(id) => {
        const el = document.getElementById(id)
        if (el) {
          el.scrollIntoView({ behavior: "smooth" })
          setActiveSection(id)
        }
      }} />

      <main id="main-content" className="relative">
        <Hero />
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
    </div>
  )
}
