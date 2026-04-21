"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import { triggerHaptic } from "./ui/haptics"
import { usePortfolio } from "./PortfolioProvider"
import { smoothScrollToId, smoothScrollToTop } from "@/app/utils/smoothScroll"

const navItems = [
  { label: "About", id: "about" },
  { label: "Education", id: "education" },
  { label: "Experience", id: "experience" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Wins", id: "triumphs" },
  { label: "Contact", id: "contact" },
]

export default function Navbar() {
  const { activeSection, setActiveSection } = usePortfolio()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [isOpen])

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16)
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    triggerHaptic()
    if (sectionId === "hero") {
      smoothScrollToTop()
    } else {
      smoothScrollToId(sectionId)
    }
    setActiveSection(sectionId)
    setIsOpen(false)
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-border/80 bg-background/95 backdrop-blur-md"
          : "border-transparent bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-3 px-4 py-3 md:px-6 md:py-4 lg:grid-cols-[1fr_auto_1fr]">
        <button
          type="button"
          onClick={() => scrollToSection("hero")}
          className="flex justify-start text-left font-body text-base font-bold tracking-tight text-foreground"
          aria-label="Scroll to top"
        >
          <span>
            Sohail
            <span className="font-normal">.</span>
            <span className="ml-0.5 inline-block h-1.5 w-1.5 translate-y-[-2px] rounded-full bg-accent align-middle" aria-hidden />
          </span>
        </button>

        <nav
          className="hidden items-center justify-center gap-4 lg:flex xl:gap-7"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`relative text-[10px] font-medium uppercase tracking-[0.2em] transition-colors xl:text-[11px] xl:tracking-[0.22em] ${
                activeSection === item.id
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.label}
              {activeSection === item.id ? (
                <span className="absolute -bottom-1 left-0 right-0 mx-auto h-px max-w-[1.25rem] bg-accent" />
              ) : null}
            </button>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <ThemeToggle variant="pill" />
          </div>
          <a
            href="/documents/Sohail_Gidwani_Resume.pdf"
            target="_blank"
            rel="noreferrer"
            onClick={() => triggerHaptic()}
            className="hidden rounded-full bg-foreground px-4 py-2 text-center text-[10px] font-bold uppercase tracking-[0.18em] text-background transition hover:opacity-90 sm:inline-flex sm:items-center sm:justify-center md:px-5"
          >
            Resume
          </a>
          <div className="sm:hidden">
            <ThemeToggle variant="icon" />
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.nav
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-3 top-[4.25rem] flex max-h-[min(80vh,520px)] flex-col gap-1 overflow-y-auto rounded-2xl border border-border bg-card p-4 shadow-xl"
              onClick={(event) => event.stopPropagation()}
              aria-label="Mobile navigation"
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className={`rounded-xl px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] ${
                    activeSection === item.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
              <a
                href="/documents/Sohail_Gidwani_Resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="mt-2 rounded-xl border border-border px-4 py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-foreground"
                onClick={() => triggerHaptic()}
              >
                Resume
              </a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
