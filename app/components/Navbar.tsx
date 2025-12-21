"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Menu, X } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import { triggerHaptic } from "./ui/haptics"

interface NavbarProps {
  activeSection: string
  setActiveSection: (section: string) => void
}

const navItems = [
  { label: "About", id: "about" },
  { label: "Education", id: "education" },
  { label: "Experience", id: "experience" },
  { label: "Skills", id: "skills" },
  { label: "Projects", id: "projects" },
  { label: "Triumphs", id: "triumphs" },
  { label: "Contact", id: "contact" },
]

export default function Navbar({ activeSection, setActiveSection }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 16)
    }

    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    triggerHaptic()
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: "smooth" })
      setActiveSection(sectionId)
    }
    setIsOpen(false)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className="mx-auto max-w-6xl px-4 pt-4 transition-all duration-300 md:px-6"
      >
        <div
          className={`pointer-events-auto flex items-center justify-between rounded-2xl border px-4 py-3 backdrop-blur transition-all duration-300 md:px-5 ${
            scrolled
              ? "border-border bg-card/80 shadow-[0_20px_60px_-40px_rgba(0,0,0,0.35)]"
              : "border-transparent bg-transparent"
          }`}
        >
          <button
            onClick={() => scrollToSection("hero")}
            className="group flex items-center gap-3 text-left"
            aria-label="Scroll to top"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-sm font-semibold text-primary">
              SG
            </span>
            <span className="hidden flex-col text-sm font-medium text-foreground/80 sm:flex">
              <span className="font-display text-base text-foreground">Sohail Gidwani</span>
              <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Portfolio</span>
            </span>
          </button>

          <div className="hidden items-center gap-6 lg:flex">
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
                    className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  />
                )}
              </button>
            ))}
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/70 text-foreground shadow-sm"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
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
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="mx-auto mt-24 flex w-[92vw] max-w-md flex-col gap-3 rounded-3xl border border-border bg-card/80 p-6 shadow-xl"
              onClick={(event) => event.stopPropagation()}
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
