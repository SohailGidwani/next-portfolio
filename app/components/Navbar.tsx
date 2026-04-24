"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, Sparkles, X } from "lucide-react"
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
  { label: "Personal", id: "personal" },
  { label: "Contact", id: "contact" },
]

export default function Navbar() {
  const { activeSection, setActiveSection, startTour } = usePortfolio()
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
      className={`fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] border-b transition-[background-color,backdrop-filter] duration-300 ${
        scrolled
          ? "border-border bg-background/95 backdrop-blur-md"
          : "border-transparent bg-background/85 backdrop-blur-sm"
      }`}
    >
      <div className="container grid h-full grid-cols-2 items-center gap-3 px-[18px] sm:px-6 md:px-9 min-[901px]:grid-cols-[1fr_auto_1fr]">
        <button
          type="button"
          onClick={() => scrollToSection("hero")}
          className="flex justify-start text-left font-display text-base font-extrabold tracking-tight text-foreground"
          aria-label="Scroll to top"
        >
          <span className="inline-flex items-center gap-0.5">
            SohailG
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-[2px] bg-accent" aria-hidden />
          </span>
        </button>

        <nav
          className="hidden min-h-0 items-center justify-center gap-5 min-[901px]:flex xl:gap-7"
          aria-label="Main navigation"
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`relative font-body text-[11px] font-medium uppercase tracking-[0.08em] transition-colors ${
                activeSection === item.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
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
          <button
            type="button"
            onClick={() => {
              triggerHaptic()
              startTour()
            }}
            className="hidden items-center gap-1.5 rounded border border-border bg-transparent px-4 py-2 text-center font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground transition hover:border-foreground/40 min-[901px]:inline-flex min-[901px]:justify-center md:px-5"
            aria-label="Start portfolio tour"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
            Tour
          </button>
          <div className="sm:hidden">
            <ThemeToggle variant="icon" />
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded border border-border text-foreground min-[901px]:hidden"
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
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur min-[901px]:hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.nav
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-3 top-[calc(var(--nav-h)+0.5rem)] flex max-h-[min(80vh,520px)] flex-col gap-1 overflow-y-auto rounded-md border border-border bg-card p-4 shadow-xl"
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
                  className={`rounded px-4 py-3 text-left font-body text-[11px] font-semibold uppercase tracking-[0.08em] ${
                    activeSection === item.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-card2 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
              <button
                type="button"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded border border-border px-4 py-3 text-center font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground"
                onClick={() => {
                  triggerHaptic()
                  startTour()
                  setIsOpen(false)
                }}
              >
                <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
                Tour
              </button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
