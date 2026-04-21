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
  { label: "Triumphs", id: "triumphs" },
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
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,box-shadow,border-color] duration-300 ${
        scrolled
          ? "border-border bg-background/92 shadow-[0_12px_40px_-28px_rgba(0,0,0,0.22)] backdrop-blur-md dark:shadow-[0_12px_40px_-28px_rgba(0,0,0,0.5)]"
          : "border-border/70 bg-background/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <button
            onClick={() => scrollToSection("hero")}
            className="group flex items-center gap-3 text-left"
            aria-label="Scroll to top"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-foreground text-xs font-bold text-background transition group-hover:border-accent group-hover:text-accent">
              SG
            </span>
            <span className="hidden flex-col text-sm font-medium text-foreground/80 sm:flex">
              <span className="font-display text-base text-foreground">Sohail Gidwani</span>
              <span className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
                AI engineer
              </span>
            </span>
          </button>

          <nav className="hidden items-center gap-5 lg:flex" aria-label="Main navigation">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`relative text-sm font-medium transition-colors ${
                  activeSection === item.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  />
                )}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                triggerHaptic()
                startTour()
              }}
              className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground transition hover:border-accent/50 hover:text-foreground"
            >
              Tour
            </button>
            <ThemeToggle />
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground"
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
            className="fixed inset-0 z-40 bg-background/90 backdrop-blur"
            onClick={() => setIsOpen(false)}
          >
            <motion.nav
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 bottom-4 flex flex-col gap-3 rounded-3xl border border-border bg-card/95 p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] shadow-xl"
              onClick={(event) => event.stopPropagation()}
              aria-label="Mobile navigation"
            >
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                  }`}
                >
                  {item.label}
                </motion.button>
              ))}
              <button
                type="button"
                onClick={() => {
                  triggerHaptic()
                  startTour()
                  setIsOpen(false)
                }}
                className="rounded-2xl border border-border bg-background/70 px-4 py-3 text-left text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              >
                Guided tour
              </button>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
