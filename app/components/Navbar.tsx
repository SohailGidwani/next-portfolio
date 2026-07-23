"use client"

import {
  useEffect,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react"
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

  // ── Sheet drag-to-dismiss ────────────────────────────────────────────
  // 1:1 downward tracking with a 10px hysteresis (so row taps stay taps),
  // rubber-banding above the origin, and velocity-based dismissal.
  const sheetRef = useRef<HTMLDivElement>(null)
  const sheetDrag = useRef({
    startX: 0,
    startY: 0,
    engaged: false,
    suppressClick: false,
    raf: 0,
    dy: 0,
    samples: [] as { t: number; y: number }[],
  })

  const reducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches

  const rubberband = (overshoot: number, dimension: number, constant = 0.55) =>
    (overshoot * dimension * constant) /
    (dimension + constant * Math.abs(overshoot))

  const applySheetTransform = () => {
    const el = sheetRef.current
    const drag = sheetDrag.current
    drag.raf = 0
    if (!el) return
    const h = el.getBoundingClientRect().height || 1
    const y = drag.dy >= 0 ? drag.dy : rubberband(drag.dy, h)
    el.style.transform = `translateY(${y}px)`
  }

  const onSheetPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = sheetDrag.current
    drag.startX = event.clientX
    drag.startY = event.clientY
    drag.engaged = false
    drag.suppressClick = false
    drag.dy = 0
    drag.samples = [{ t: event.timeStamp, y: event.clientY }]
  }

  const onSheetPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = sheetDrag.current
    const el = sheetRef.current
    if (!el || drag.samples.length === 0) return
    const dx = event.clientX - drag.startX
    const dy = event.clientY - drag.startY
    if (!drag.engaged) {
      if (Math.abs(dy) < 10 || Math.abs(dy) <= Math.abs(dx)) return
      drag.engaged = true
      drag.suppressClick = true
      el.setPointerCapture(event.pointerId)
    }
    drag.dy = dy
    drag.samples.push({ t: event.timeStamp, y: event.clientY })
    if (drag.samples.length > 5) drag.samples.shift()
    if (!drag.raf) drag.raf = requestAnimationFrame(applySheetTransform)
  }

  const onSheetPointerEnd = () => {
    const drag = sheetDrag.current
    const el = sheetRef.current
    if (drag.raf) cancelAnimationFrame(drag.raf)
    drag.raf = 0
    const wasEngaged = drag.engaged
    drag.engaged = false
    if (!el || !wasEngaged) return
    const first = drag.samples[0]
    const last = drag.samples[drag.samples.length - 1]
    const velocity =
      last && first && last.t > first.t ? (last.y - first.y) / (last.t - first.t) : 0
    const h = el.getBoundingClientRect().height || 1
    const dy = drag.dy
    drag.samples = []
    if (dy > 0 && (velocity > 0.11 || dy > h * 0.5)) {
      // Dismiss: keep travelling the way the finger sent it, then close.
      if (reducedMotion()) {
        el.style.transform = ""
        setIsOpen(false)
        return
      }
      const exit = el.animate(
        [
          { transform: `translateY(${dy}px)`, opacity: 1 },
          { transform: `translateY(${h}px)`, opacity: 0.6 },
        ],
        {
          duration: Math.min(250, Math.max(140, (h - dy) * 0.5)),
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          fill: "forwards",
        }
      )
      const close = () => setIsOpen(false)
      exit.finished.then(close).catch(close)
    } else {
      // Settle back on the sheet curve, from the rubber-banded position.
      const from = dy >= 0 ? dy : rubberband(dy, h)
      el.style.transform = ""
      if (!reducedMotion() && from !== 0) {
        el.animate(
          [{ transform: `translateY(${from}px)` }, { transform: "translateY(0px)" }],
          {
            duration: Math.min(350, Math.max(200, Math.abs(from) * 0.9)),
            easing: "cubic-bezier(0.32, 0.72, 0, 1)",
          }
        )
      }
    }
  }

  const onSheetClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (sheetDrag.current.suppressClick) {
      event.preventDefault()
      event.stopPropagation()
      sheetDrag.current.suppressClick = false
    }
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
            className="flex h-9 w-9 items-center justify-center rounded border border-border text-foreground transition-transform duration-150 active:scale-[0.97] min-[901px]:hidden"
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
          ref={sheetRef}
          showClose={false}
          onCloseAutoFocus={(event) => {
            event.preventDefault()
            menuButtonRef.current?.focus()
          }}
          onPointerDown={onSheetPointerDown}
          onPointerMove={onSheetPointerMove}
          onPointerUp={onSheetPointerEnd}
          onPointerCancel={onSheetPointerEnd}
          onClickCapture={onSheetClickCapture}
          style={{ touchAction: "none" }}
          className="mobile-sheet bottom-0 left-0 right-0 top-auto h-auto max-h-[80dvh] w-full max-w-none translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-none rounded-t-md border-x-0 border-b-0 bg-background p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] min-[901px]:hidden sm:rounded-none sm:rounded-t-md"
        >
          <div aria-hidden className="mx-auto mb-2 h-1 w-9 rounded-[2px] bg-border" />
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
