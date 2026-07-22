"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { FileText, Menu, X } from "lucide-react"
import ThemeToggle from "./ThemeToggle"
import ReadingProgress from "./ReadingProgress"
import { triggerHaptic } from "./ui/haptics"
import { usePortfolio } from "./PortfolioProvider"
import { smoothScrollToId, smoothScrollToTop } from "@/app/utils/smoothScroll"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog"

type NavItem = { label: string; id: string; href?: string }

const navItems: NavItem[] = [
  { label: "Experience", id: "experience" },
  { label: "Projects", id: "projects" },
  { label: "Education", id: "education" },
  { label: "About", id: "about" },
  { label: "Contact", id: "contact" },
]

export default function Navbar() {
  const { activeSection, setActiveSection } = usePortfolio()
  const [isOpen, setIsOpen] = useState(false)
  const [atTop, setAtTop] = useState(true)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const update = () => setAtTop(window.scrollY <= 8)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  // Fully transparent only before any scroll, so the hero dot grid runs
  // unbroken behind the bar; the slightest scroll brings the glass back
  // (also while the mobile menu is open, so there is no see-through strip
  // above the panel).
  const transparent = atTop && !isOpen

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
      className={`fixed inset-x-0 top-0 z-50 h-[var(--nav-h)] border-b transition-[background-color,backdrop-filter,border-color] duration-300 ${
        transparent
          ? "border-transparent bg-transparent"
          : "border-border bg-background/95 backdrop-blur-md"
      }`}
    >
      <ReadingProgress />
      <div className="container grid h-full grid-cols-2 items-center gap-3 px-[18px] sm:px-6 md:px-9 min-[901px]:grid-cols-[1fr_auto_1fr] min-[901px]:gap-6 min-[901px]:px-4 xl:px-6">
        <button
          type="button"
          onClick={() => scrollToSection("hero")}
          className="flex justify-start text-left font-display text-base font-extrabold tracking-tight text-foreground"
          aria-label="SohailG, scroll to top"
        >
          <span className="inline-flex items-center gap-0.5">
            SohailG
            <span className="inline-block h-1.5 w-1.5 shrink-0 rounded-[2px] bg-accent" aria-hidden />
          </span>
        </button>

        <nav
          className="hidden min-h-0 items-center justify-center gap-4 min-[901px]:flex xl:gap-6"
          aria-label="Main navigation"
        >
          {navItems.map((item) =>
            item.href ? (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => triggerHaptic()}
                className="relative font-body text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
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
            ),
          )}
        </nav>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <ThemeToggle variant="pill" />
          </div>
          {/* The hero has its own Resume CTA — this one slides in once the hero scrolls away. */}
          <a
            href="/documents/Sohail_Gidwani_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => triggerHaptic()}
            aria-hidden={activeSection === "hero"}
            tabIndex={activeSection === "hero" ? -1 : 0}
            className={`hidden items-center gap-1.5 overflow-hidden whitespace-nowrap rounded border bg-transparent py-2 text-center font-body text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground transition-[max-width,opacity,padding,border-color] duration-300 min-[901px]:inline-flex min-[901px]:justify-center ${
              activeSection === "hero"
                ? "pointer-events-none max-w-0 border-transparent px-0 opacity-0"
                : "max-w-40 border-border px-4 opacity-100 hover:border-foreground/40 md:px-5"
            }`}
          >
            <FileText className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
            Resume
          </a>
          <div className="sm:hidden">
            <ThemeToggle variant="icon" />
          </div>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-9 w-9 items-center justify-center rounded border border-border text-foreground min-[901px]:hidden"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation-dialog"
          >
            {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          id="mobile-navigation-dialog"
          showClose={false}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            menuButtonRef.current?.focus()
          }}
          className="mobile-sheet bottom-0 left-0 right-0 top-auto h-auto max-h-[80dvh] w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-none rounded-t-md border-x-0 border-b-0 bg-background p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] min-[901px]:hidden sm:rounded-none sm:rounded-t-md"
        >
          <DialogTitle className="sr-only">Portfolio navigation</DialogTitle>
          <DialogDescription className="sr-only">
            Navigate to experience, projects, education, about, contact, or the resume.
          </DialogDescription>
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navItems.map((item, index) =>
              item.href ? (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => {
                    triggerHaptic()
                    setIsOpen(false)
                  }}
                  className="mobile-nav-item block rounded px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground transition-transform hover:bg-card2 hover:text-foreground active:scale-[0.98]"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`mobile-nav-item rounded px-4 py-3 text-left font-body text-xs font-semibold uppercase tracking-[0.08em] transition-transform active:scale-[0.98] ${
                    activeSection === item.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-card2 hover:text-foreground"
                  }`}
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  {item.label}
                </button>
              ),
            )}
            <a
              href="/documents/Sohail_Gidwani_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-nav-item mt-2 inline-flex items-center justify-center gap-2 rounded border border-border px-4 py-3 text-center font-body text-xs font-semibold uppercase tracking-[0.08em] text-foreground transition-transform active:scale-[0.98]"
              style={{ animationDelay: `${navItems.length * 20}ms` }}
              onClick={() => {
                triggerHaptic()
                setIsOpen(false)
              }}
            >
              <FileText className="h-3.5 w-3.5 text-accent" aria-hidden />
              Resume
            </a>
          </nav>
        </DialogContent>
      </Dialog>
    </header>
  )
}
